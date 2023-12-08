/*
  Warnings:

  - The primary key for the `UserStakingDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserUnstakingDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `transactionHash` was added to the `UserStakingDetails` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `transactionHash` was added to the `UserUnstakingDetails` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "UserStakingDetails" DROP CONSTRAINT "UserStakingDetails_pkey",
ADD COLUMN     "transactionHash" TEXT NOT NULL,
ADD CONSTRAINT "UserStakingDetails_pkey" PRIMARY KEY ("transactionHash");

-- AlterTable
ALTER TABLE "UserUnstakingDetails" DROP CONSTRAINT "UserUnstakingDetails_pkey",
ADD COLUMN     "transactionHash" TEXT NOT NULL,
ADD CONSTRAINT "UserUnstakingDetails_pkey" PRIMARY KEY ("transactionHash");
