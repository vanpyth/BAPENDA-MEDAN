import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const news = await prisma.news.findMany();
  console.log("News count:", news.length);
  console.log("News data:", JSON.stringify(news, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
