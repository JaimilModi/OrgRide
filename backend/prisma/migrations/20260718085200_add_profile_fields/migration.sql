-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "address" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "workShift" TEXT;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "address" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logoUrl" TEXT;
