import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const clients = new Map<string, PrismaClient>();

export function getDb() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const existing = clients.get(url);
  if (existing) {
    return existing;
  }
  const client = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url }),
  });
  clients.set(url, client);
  return client;
}

export async function resetDb() {
  const open = [...clients.values()];
  clients.clear();
  await Promise.all(open.map((client) => client.$disconnect()));
}
