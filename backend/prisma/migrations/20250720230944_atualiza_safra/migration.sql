/*
  Warnings:

  - You are about to drop the `Cultura` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `areaPlantada` to the `Safra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cultura` to the `Safra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Safra` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cultura" DROP CONSTRAINT "Cultura_propriedadeId_fkey";

-- DropForeignKey
ALTER TABLE "Cultura" DROP CONSTRAINT "Cultura_safraId_fkey";

-- AlterTable
ALTER TABLE "Safra" ADD COLUMN     "areaPlantada" INTEGER NOT NULL,
ADD COLUMN     "cultura" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;

-- DropTable
DROP TABLE "Cultura";
