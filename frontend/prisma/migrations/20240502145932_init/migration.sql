/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `UserDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `UserDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDetails" ADD COLUMN     "address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_address_key" ON "UserDetails"("address");
