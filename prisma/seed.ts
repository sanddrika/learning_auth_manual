import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Use a local PrismaClient instance here to avoid import/ESM resolution
// issues when running the seed with ts-node. This is safe for a seed script.
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash,
    },
  });
}

main()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
