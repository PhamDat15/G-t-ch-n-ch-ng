import "dotenv/config";
import { seedSampleArticles } from "../src/lib/seed";
import { prisma } from "../src/lib/db";

async function main() {
  const url = new URL(process.env.DATABASE_URL || "");
  if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
    throw new Error("Preview seed requires a local database.");
  }
  await seedSampleArticles();
  console.log(`Preview ready: ${await prisma.article.count()} articles.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
