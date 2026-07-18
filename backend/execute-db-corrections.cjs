require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_k7mHwYoz0SIy@ep-floral-mouse-aw879onf.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30' } }
});

async function main() {
  console.log("Starting DB Corrections...\n");

  // Ride 1
  await prisma.ride.update({
    where: { id: "695dddbf-eab7-4392-aa4f-7cfc10f9504a" },
    data: {
      sourceAddress: "Kudasan, Gandhinagar, Gujarat",
      sourceLatitude: "23.1794",
      sourceLongitude: "72.6341",
      destinationAddress: "LDRP Institute of Technology and Research, KH-5, Gandhinagar",
      destinationLatitude: "23.2385",
      destinationLongitude: "72.6399"
    }
  });

  // Ride 2
  await prisma.ride.update({
    where: { id: "b40c1263-1c83-42c0-81a2-2b48029c938c" },
    data: {
      sourceAddress: "Kudasan, Gandhinagar, Gujarat",
      sourceLatitude: "23.1794",
      sourceLongitude: "72.6341",
      destinationAddress: "LDRP Institute of Technology and Research, KH-5, Gandhinagar",
      destinationLatitude: "23.2385",
      destinationLongitude: "72.6399"
    }
  });

  // Ride 3
  await prisma.ride.update({
    where: { id: "695dddbf-eab7-4392-aa4f-7cfc10f9504c" },
    data: {
      sourceAddress: "CH-0 Circle, Gandhinagar",
      sourceLatitude: "23.1959",
      sourceLongitude: "72.6395",
      destinationAddress: "KH-5 Circle (Ahimsa Circle), Gandhinagar",
      destinationLatitude: "23.2404",
      destinationLongitude: "72.6379"
    }
  });

  // Ride 4 (Fictional replacement)
  await prisma.ride.update({
    where: { id: "acdddc88-b3b9-49a6-90fb-95892038e87e" },
    data: {
      sourceAddress: "LDRP Institute of Technology and Research, KH-5, Gandhinagar",
      sourceLatitude: "23.2385",
      sourceLongitude: "72.6399",
      destinationAddress: "GIFT City, Gandhinagar, Gujarat",
      destinationLatitude: "23.1619",
      destinationLongitude: "72.6896"
    }
  });

  console.log("DB Corrections completed.\n");

  // Query and print all 4 records
  const ids = [
    "695dddbf-eab7-4392-aa4f-7cfc10f9504a",
    "b40c1263-1c83-42c0-81a2-2b48029c938c",
    "695dddbf-eab7-4392-aa4f-7cfc10f9504c",
    "acdddc88-b3b9-49a6-90fb-95892038e87e"
  ];

  const updatedRides = await prisma.ride.findMany({ where: { id: { in: ids } } });

  console.log("FINAL PERSISTED DATABASE RECORDS:");
  updatedRides.forEach(r => {
    console.log(`\nRide ID: ${r.id}`);
    console.log(`Source Address: ${r.sourceAddress}`);
    console.log(`Source Latitude: ${r.sourceLatitude}`);
    console.log(`Source Longitude: ${r.sourceLongitude}`);
    console.log(`Destination Address: ${r.destinationAddress}`);
    console.log(`Destination Latitude: ${r.destinationLatitude}`);
    console.log(`Destination Longitude: ${r.destinationLongitude}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
