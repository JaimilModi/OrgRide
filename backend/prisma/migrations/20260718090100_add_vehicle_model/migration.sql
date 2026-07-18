-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('HATCHBACK', 'SEDAN', 'SUV', 'BIKE', 'OTHER');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'CNG', 'EV', 'HYBRID');

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "fuelType" "FuelType" NOT NULL,
    "seatingCapacity" INTEGER NOT NULL,
    "registrationYear" INTEGER NOT NULL,
    "vehicleImage" TEXT NOT NULL,
    "rcNumber" TEXT NOT NULL,
    "rcImage" TEXT NOT NULL,
    "insuranceExpiry" TIMESTAMP(3) NOT NULL,
    "pollutionExpiry" TIMESTAMP(3),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vehicleNumber_key" ON "vehicles"("vehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_rcNumber_key" ON "vehicles"("rcNumber");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
