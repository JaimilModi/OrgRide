import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.employee.findMany();
  console.log(users.map(u => u.email).join(', '));
}
main().finally(() => prisma.$disconnect());
