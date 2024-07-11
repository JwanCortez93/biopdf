"use server";

import { db } from "@/db";

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
  return file;
};
