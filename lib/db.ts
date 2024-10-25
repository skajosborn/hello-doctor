import { PrismaClient } from "@prisma/client";

// Extend globalThis with PrismaClient in development
declare global {
  // Declare prisma on globalThis for type safety
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use the existing prisma client or create a new one
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}