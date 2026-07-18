import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.employee.updateMany({
    where: { email: 'dummy@gmail.com' },
    data: { passwordHash }
  });
  console.log('Password updated.');
}
main().finally(() => prisma.$disconnect());
