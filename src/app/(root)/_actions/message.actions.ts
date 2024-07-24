"use server";

import { db } from "@/db";
import { pinecone } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { CohereClient } from "cohere-ai";
import { getMessagesParams } from "../../../../types";
import { INFINITE_QUERY_LIMIT } from "@/constants";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY as string,
});

export const getMessages = async ({
  fileId,
  userId,
  limit,
  cursor,
}: getMessagesParams) => {
  const limitItem = limit ?? INFINITE_QUERY_LIMIT;
  try {
    const file = await db.file.findUnique({ where: { id: fileId, userId } });

    if (!file) throw new Error("File was not found");

    const messages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "desc" },
      take: limitItem + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: { id: true, isUserMessage: true, createdAt: true, text: true },
    });

    let nextCursor: typeof cursor | undefined;

    if (limit && messages.length > limit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }
    return { messages, nextCursor };
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = async ({
  fileId,
  message,
  userId,
}: {
  fileId: string;
  message: string;
  userId: string;
}) => {
  const file = await db.file.findUnique({
    where: { id: fileId, userId },
  });

  if (!file) return new Error("File not found");

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  const pineconeIndex = pinecone.Index("biopdf");

  const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY as string,
    batchSize: 48,
    model: "embed-english-v3.0",
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.message.findMany({
    where: { fileId },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  const formattedMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? ("USER" as const) : ("CHATBOT" as const),
    message: message.text,
  }));

  const resultsMessages = results.map((result, index) => ({
    role: "SYSTEM" as const,
    message: `Relevant PDF excerpt ${index + 1}: ${result.pageContent}`,
  }));

  const combinedMessages = [...formattedMessages, ...resultsMessages];
  const stream = await cohere.chat({
    model: "command-r-plus",
    message,
    temperature: 0,
    chatHistory: combinedMessages,
    promptTruncation: "AUTO",
  });

  await db.message.create({
    data: {
      text: stream.text,
      isUserMessage: false,
      userId,
      fileId,
    },
  });

  console.log(stream.text);

  return file;
};
