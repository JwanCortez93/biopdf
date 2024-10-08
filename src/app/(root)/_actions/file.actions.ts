"use server";

import { db } from "@/db";

export const getFiles = async (userId: string) => {
  try {
    const files = await db.file.findMany({ where: { userId } });
    return files;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getFileByIdOrKey = async ({
  fileId,
  key,
  userId,
}: {
  fileId?: string;
  key?: string;
  userId: string;
}) => {
  try {
    if (!fileId && !key) throw new Error();
    const file = fileId
      ? await db.file.findUnique({
          where: { id: fileId, userId },
        })
      : key
      ? await db.file.findUnique({ where: { key, userId } })
      : null;
    return file;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getFileUploadStatus = async ({
  fileId,
  userId,
}: {
  fileId: string;
  userId: string;
}) => {
  const file = await db.file.findUnique({
    where: { id: fileId, userId },
    select: { uploadStatus: true },
  });
  if (!file) return { status: "PENDING" as const };
  return { status: file.uploadStatus };
};

export const deleteFile = async ({
  fileId,
  userId,
}: {
  fileId: string;
  userId: string;
}) => {
  try {
    const file = await db.file.findUnique({ where: { id: fileId, userId } });
    if (!file) throw new Error("File not found");

    await db.file.delete({ where: { id: fileId } });
    return file;
  } catch (error: any) {
    console.log(error.message);
  }
};
