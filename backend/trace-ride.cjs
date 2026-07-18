require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://neondb_owner:npg_k7mHwYoz0SIy@ep-floral-mouse-aw879onf.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30' } }
});

async function trace() {
  // Let's get the specific LDRP ride: b40c1263-1c83-42c0-81a2-2b48029c938c
  const ride = await prisma.ride.findUnique({ where: { id: "b40c1263-1c83-42c0-81a2-2b48029c938c" } });
  
  if (!ride) {
    console.log("Ride not found!");
    return;
  }
  
  console.log("=== RUNTIME TRACE FOR ONE EXISTING RIDE ===");
  console.log("Ride sourceAddress:", ride.sourceAddress);
  console.log("Ride sourceLatitude:", ride.sourceLatitude);
  console.log("Ride sourceLongitude:", ride.sourceLongitude);
  console.log("Ride destinationAddress:", ride.destinationAddress);
  console.log("Ride destinationLatitude:", ride.destinationLatitude);
  console.log("Ride destinationLongitude:", ride.destinationLongitude);
  
  console.log("\n--- EXECUTING MAP PROPS TRANSFORMATION ---");
  // Simulating frontend/src/lib/coordinates.ts helpers
  const sourceLngLat = { longitude: Number(ride.sourceLongitude), latitude: Number(ride.sourceLatitude) };
  const destLngLat = { longitude: Number(ride.destinationLongitude), latitude: Number(ride.destinationLatitude) };
  
  // Simulating MapLibre setLngLat
  console.log("1. Ola Maps source marker (setLngLat):", [sourceLngLat.longitude, sourceLngLat.latitude]);
  console.log("2. Ola Maps destination marker (setLngLat):", [destLngLat.longitude, destLngLat.latitude]);
  
  // Simulating Directions API payload
  console.log(`3. Directions API origin: ${sourceLngLat.latitude},${sourceLngLat.longitude}`);
  console.log(`4. Directions API destination: ${destLngLat.latitude},${destLngLat.longitude}`);
  
  console.log("\nNOTE: Because the DB holds Pune coordinates (18.52, 73.85) for this Gandhinagar address, the map correctly plots markers in Pune, and the Directions API correctly routes between those two points in Pune.");
}

trace().catch(console.error).finally(() => prisma.$disconnect());
