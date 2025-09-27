/*
  Warnings:

  - Added the required column `fechaInicio` to the `Lote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lote" ADD COLUMN "fechaInicio" TIMESTAMP NOT NULL DEFAULT NOW();

