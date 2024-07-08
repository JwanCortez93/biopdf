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
