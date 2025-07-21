import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    
  await prisma.safra.deleteMany();
  await prisma.propriedade.deleteMany();
  await prisma.produtor.deleteMany();

  console.log('Banco limpo com sucesso!');
}

main().finally(() => prisma.$disconnect());
