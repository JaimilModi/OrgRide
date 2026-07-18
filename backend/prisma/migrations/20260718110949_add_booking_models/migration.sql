-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ride_participants" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "seatsBooked" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ride_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ride_participants" ADD CONSTRAINT "ride_participants_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_participants" ADD CONSTRAINT "ride_participants_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
