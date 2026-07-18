import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany();
  
  if (employees.length > 0) {
    const employee = employees[0];
    await prisma.employee.update({
      where: { id: employee.id },
      data: { role: 'ADMIN' }
    });
    console.log(`Successfully promoted ${employee.email} to ADMIN.`);
  } else {
    console.log('No employees found.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
