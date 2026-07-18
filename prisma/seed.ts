import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {

  // brišemo stare test podatke
  await prisma.scratchCard.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();


  // kreiranje korisnika
  const password = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      name: "Test Korisnik",
      email: "test@test.com",
      password,
    },
  });


  // kampanja
  const campaign = await prisma.campaign.create({
    data: {
      name: "Ljetna akcija",
      description: "Ogrebi i osvoji popust",
      active: true,
    },
  });


  // nagrade
  await prisma.prize.createMany({
    data: [
      {
        name: "5% popusta",
        discount: 5,
        probability: 50,
        campaignId: campaign.id,
      },
      {
        name: "10% popusta",
        discount: 10,
        probability: 30,
        campaignId: campaign.id,
      },
      {
        name: "20% popusta",
        discount: 20,
        probability: 15,
        campaignId: campaign.id,
      },
      {
        name: "50% popusta",
        discount: 50,
        probability: 5,
        campaignId: campaign.id,
      },
    ],
  });


  console.log("Seed završen!");
  console.log("Test korisnik:", user.email);
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });