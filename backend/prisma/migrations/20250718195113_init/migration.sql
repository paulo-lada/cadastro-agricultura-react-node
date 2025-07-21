-- CreateTable
CREATE TABLE "Produtor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,

    CONSTRAINT "Produtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propriedade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "areaTotal" DOUBLE PRECISION NOT NULL,
    "areaAgricultavel" DOUBLE PRECISION NOT NULL,
    "areaVegetacao" DOUBLE PRECISION NOT NULL,
    "produtorId" TEXT NOT NULL,

    CONSTRAINT "Propriedade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Safra" (
    "id" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "propriedadeId" TEXT NOT NULL,

    CONSTRAINT "Safra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cultura" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "safraId" TEXT NOT NULL,
    "propriedadeId" TEXT NOT NULL,

    CONSTRAINT "Cultura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produtor_cpfCnpj_key" ON "Produtor"("cpfCnpj");

-- AddForeignKey
ALTER TABLE "Propriedade" ADD CONSTRAINT "Propriedade_produtorId_fkey" FOREIGN KEY ("produtorId") REFERENCES "Produtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Safra" ADD CONSTRAINT "Safra_propriedadeId_fkey" FOREIGN KEY ("propriedadeId") REFERENCES "Propriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cultura" ADD CONSTRAINT "Cultura_safraId_fkey" FOREIGN KEY ("safraId") REFERENCES "Safra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cultura" ADD CONSTRAINT "Cultura_propriedadeId_fkey" FOREIGN KEY ("propriedadeId") REFERENCES "Propriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
