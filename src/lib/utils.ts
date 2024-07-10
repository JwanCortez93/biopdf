import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
