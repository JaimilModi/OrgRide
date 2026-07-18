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
  const rides = await prisma.ride.findMany({
    where: {
      sourceLatitude: '18.52043'
    }
  });
  
  if (rides.length === 0) {
    console.log("No corrupted Pune coordinates found in the database.");
    return;
  }
  
  console.log(`Found ${rides.length} corrupted rides with Pune coordinates. Previewing corrections...\\n`);
  
  rides.forEach(ride => {
    console.log(`Ride ID: ${ride.id}`);
    console.log(`  Source: ${ride.sourceAddress}`);
    console.log(`  Old Source Coords: [${ride.sourceLongitude}, ${ride.sourceLatitude}]`);
    console.log(`  New Source Coords: [72.6369, 23.2156] (LDRP Institute / Gandhinagar approximate)\\n`);
    
    console.log(`  Destination: ${ride.destinationAddress}`);
    console.log(`  Old Dest Coords: [${ride.destinationLongitude}, ${ride.destinationLatitude}]`);
    console.log(`  New Dest Coords: [72.6822, 23.1645] (GIFT City approximate)\\n`);
    console.log('----------------------------------------------------');
  });
  
  console.log("\\nTo execute this correction, please explicitly approve this preview.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
