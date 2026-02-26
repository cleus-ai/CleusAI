import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Demo user
  const passwordHash = await bcrypt.hash("DemoPass123!", 12);
  await prisma.user.upsert({
    where: { email: "demo@cleus.ai" },
    update: {},
    create: { email: "demo@cleus.ai", username: "demouser", passwordHash, plan: "PRO", credits: 500 },
  });

  // Default AI characters
  const characters = [
    { name: "Luna", description: "Friendly AI companion who loves philosophy", personality: "Curious, empathetic, thoughtful. Loves Socratic dialogue.", isPublic: true },
    { name: "Rex", description: "No-nonsense direct assistant", personality: "Blunt, efficient, gets straight to the point. No fluff.", isPublic: true },
    { name: "Nova", description: "Creative writing muse", personality: "Imaginative, poetic, loves metaphors and storytelling.", isPublic: true },
  ];

  for (const char of characters) {
    await prisma.userCharacter.upsert({
      where: { id: `seed-${char.name.toLowerCase()}` },
      update: {},
      create: { id: `seed-${char.name.toLowerCase()}`, userId: (await prisma.user.findFirst({ where: { email: "demo@cleus.ai" } }))!.id, ...char },
    });
  }

  console.log("Seeding complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
