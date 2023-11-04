import { PrismaClient } from "@prisma/client";
import { env } from "@/env.mjs";

declare global {
  var prisma: PrismaClient | undefined;
}
export const db = globalThis.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalThis.prisma = db;
