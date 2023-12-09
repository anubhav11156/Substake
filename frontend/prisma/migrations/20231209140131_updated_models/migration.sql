-- AlterTable
ALTER TABLE "UserUnstakingDetails" ALTER COLUMN "shares" DROP DEFAULT,
ALTER COLUMN "shares" SET DATA TYPE TEXT;
