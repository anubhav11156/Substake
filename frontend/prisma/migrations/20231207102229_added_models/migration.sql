-- CreateTable
CREATE TABLE "UserStakingDetails" (
    "address" TEXT NOT NULL,
    "Asset" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "StakeBatchId" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStakingDetails_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "UserUnstakingDetails" (
    "address" TEXT NOT NULL,
    "ExpectedAsset" INTEGER NOT NULL DEFAULT 0,
    "FinalizedAsset" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "UnstakeBatchId" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserUnstakingDetails_pkey" PRIMARY KEY ("address")
);
