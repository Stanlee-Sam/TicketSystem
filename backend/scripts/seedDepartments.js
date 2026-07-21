import prisma from "../lib/prisma.js";

const departments = [
  "Emergency Radiology",
  "Information Technology",
  "Health Informatics",
  "Cardiology Unit B",
  "Administration",
];

async function main() {
  for (const name of departments) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const all = await prisma.department.findMany({ orderBy: { name: "asc" } });
  console.log("Departments ready:");
  all.forEach((dept) => console.log(`  ${dept.id}  ${dept.name}`));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
