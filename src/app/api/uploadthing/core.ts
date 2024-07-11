import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { pinecone } from "@/lib/pinecone";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";

const cohere = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY as string,
  batchSize: 48,
  model: "embed-english-v3.0",
});

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(file.url);
        const blob = await response.blob();

        const loader = new WebPDFLoader(blob);

        const pageLevelDocs = await loader.load();

        const pageAmt = pageLevelDocs.length;

        const pineconeIndex = pinecone.Index("biopdf");

        await PineconeStore.fromDocuments(pageLevelDocs, cohere, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          data: { uploadStatus: "SUCCESS" },
          where: { id: createdFile.id },
        });
      } catch (error: any) {
        console.log(error);
        await db.file.update({
          data: { uploadStatus: "FAILED" },
          where: { id: createdFile.id },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
