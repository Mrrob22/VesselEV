-- CreateTable
CREATE TABLE "Vessel" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "logID" BIGINT NOT NULL,
    "vesselId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "AERCO2T2W" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PPReference" (
    "id" SERIAL NOT NULL,
    "vesselTypeID" INTEGER NOT NULL,
    "traj" TEXT NOT NULL,
    "a" DOUBLE PRECISION NOT NULL,
    "b" DOUBLE PRECISION NOT NULL,
    "c" DOUBLE PRECISION NOT NULL,
    "d" DOUBLE PRECISION NOT NULL,
    "e" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PPReference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vessel_id_key" ON "Vessel"("id");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
