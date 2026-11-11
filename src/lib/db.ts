import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
  prismaConfigVersion: number | undefined;
};

const PRISMA_CONFIG_VERSION = 2;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const databaseHost = connectionString ? new URL(connectionString).hostname : "";
  const isLocalDatabase = databaseHost === "localhost" || databaseHost === "127.0.0.1";
  const pool = new Pool({
    connectionString,
    // Prisma Postgres local can become unstable when Next.js development and
    // build workers open several pools at the same time. Serialize local I/O;
    // keep the normal pool size for the deployed database.
    max: isLocalDatabase ? 1 : 10,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 10_000,
    keepAlive: true,
  });
  pool.on("error", (error) => console.warn("Database pool connection was reset:", error.message));
  const adapter = new PrismaPg(pool);
  return { prisma: new PrismaClient({ adapter }), pool };
}

const canReuseClient = globalForPrisma.prisma && globalForPrisma.prismaConfigVersion === PRISMA_CONFIG_VERSION;
if (!canReuseClient && globalForPrisma.prisma) void globalForPrisma.prisma.$disconnect().catch(() => undefined);
const database = canReuseClient
  ? { prisma: globalForPrisma.prisma as PrismaClient, pool: globalForPrisma.prismaPool }
  : createPrismaClient();

export const prisma = database.prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = database.pool;
  globalForPrisma.prismaConfigVersion = PRISMA_CONFIG_VERSION;
}
