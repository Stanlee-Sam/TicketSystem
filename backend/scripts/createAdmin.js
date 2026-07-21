import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

async function main() {
  const password = "Admin@123"; // Change after first login

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      fullName: "System Administrator",
      email: "admin@ticketsystem.com",
      passwordHash,
      role: "IT_ADMIN",
      mustChangePass: true,
      isActive: true,
    },
  });

  console.log(admin);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
