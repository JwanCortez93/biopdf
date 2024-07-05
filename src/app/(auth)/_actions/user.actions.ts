"use server";

import { db } from "@/db";

export const findUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const createUser = async ({
  email,
  id,
}: {
  email: string;
  id: string;
}) => {
  console.log("TEST");
  try {
    const newUser = await db.user.create({ data: { email, id } });
    return newUser;
  } catch (error: any) {
    console.log(error.message);
  }
};
