require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_k7mHwYoz0SIy@ep-floral-mouse-aw879onf.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30'
    }
  }
});

async function main() {
  const rides = await prisma.ride.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(rides, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
