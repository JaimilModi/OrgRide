require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: '(neon-url)'
    }
  }
});

async function main() {
  const rides = await prisma.ride.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(rides, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
