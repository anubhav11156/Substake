-- CreateTable
CREATE TABLE "UserDetails" (
    "id" TEXT NOT NULL,
    "isSubscribed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);
