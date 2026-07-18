import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records safely (order matters due to Cascade onDelete)
  await prisma.employee.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Create target organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Acme Corporate',
      domain: 'acme.com',
    },
  });
  console.log(`Created Organization: ${organization.name} (${organization.id})`);

  // 3. Hash password
  const defaultPassword = 'password123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 4. Create employees in different states
  
  // 4a. Active Admin (regular login flow)
  const admin = await prisma.employee.create({
    data: {
      orgId: organization.id,
      employeeId: 'EMP001',
      email: 'admin@acme.com',
      passwordHash,
      name: 'Alice Admin',
      role: 'ADMIN',
      gender: 'FEMALE',
      isFirstLogin: false,
      status: 'ACTIVE',
    },
  });
  console.log(`Created Active Admin: ${admin.email}`);

  // 4b. Active Employee (first login flow)
  const employeeFirstLogin = await prisma.employee.create({
    data: {
      orgId: organization.id,
      employeeId: 'EMP002',
      email: 'employee@acme.com',
      passwordHash,
      name: 'Bob Employee',
      role: 'EMPLOYEE',
      gender: 'MALE',
      isFirstLogin: true,
      status: 'ACTIVE',
    },
  });
  console.log(`Created First-Login Employee: ${employeeFirstLogin.email}`);

  // 4c. Inactive Employee (denied access)
  const inactive = await prisma.employee.create({
    data: {
      orgId: organization.id,
      employeeId: 'EMP003',
      email: 'charlie@acme.com',
      passwordHash,
      name: 'Charlie Inactive',
      role: 'EMPLOYEE',
      gender: 'MALE',
      isFirstLogin: false,
      status: 'INACTIVE',
    },
  });
  console.log(`Created Inactive Employee: ${inactive.email}`);

  // 4d. Suspended Employee (denied access)
  const suspended = await prisma.employee.create({
    data: {
      orgId: organization.id,
      employeeId: 'EMP004',
      email: 'diana@acme.com',
      passwordHash,
      name: 'Diana Suspended',
      role: 'EMPLOYEE',
      gender: 'FEMALE',
      isFirstLogin: false,
      status: 'SUSPENDED',
    },
  });
  console.log(`Created Suspended Employee: ${suspended.email}`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
