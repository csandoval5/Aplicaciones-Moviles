-- DropForeignKey
ALTER TABLE "Movimiento" DROP CONSTRAINT "Movimiento_insumoId_fkey";

-- AddForeignKey
ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
