-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('SCHEDULED', 'STARTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "rideCode" TEXT NOT NULL,
    "sourceAddress" TEXT NOT NULL,
    "sourceLatitude" DECIMAL(65,30) NOT NULL,
    "sourceLongitude" DECIMAL(65,30) NOT NULL,
    "destinationAddress" TEXT NOT NULL,
    "destinationLatitude" DECIMAL(65,30) NOT NULL,
    "destinationLongitude" DECIMAL(65,30) NOT NULL,
    "pickupAt" TIMESTAMP(3) NOT NULL,
    "pricePerSeat" DECIMAL(65,30) NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "femaleOnly" BOOLEAN NOT NULL DEFAULT false,
    "status" "RideStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rides_rideCode_key" ON "rides"("rideCode");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
