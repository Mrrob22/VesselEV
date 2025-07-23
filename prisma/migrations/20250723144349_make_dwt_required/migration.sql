/*
  Warnings:

  - Made the column `dwt` on table `Vessel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vessel" ALTER COLUMN "dwt" SET NOT NULL,
ALTER COLUMN "dwt" SET DEFAULT 50000;
