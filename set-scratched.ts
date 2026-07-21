import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {

  const result = await prisma.scratchCard.updateMany({
    data: {
      scratched: true
    }
  });

  console.log("Ažurirano kartica:", result.count);

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());