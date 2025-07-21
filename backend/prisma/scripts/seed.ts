import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Cria produtores
    const produtores = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
            prisma.produtor.create({
                data: {
                    nome: `Produtor ${i + 1}`,
                    cpfCnpj: `0000000000${i + 1}`,
                },
            })
        )
    );

    const estadosECidades = [
        { estado: 'SP', cidades: ['Campinas', 'Ribeirão Preto', 'Bauru'] },
        { estado: 'MG', cidades: ['Uberlândia', 'Belo Horizonte', 'Juiz de Fora'] },
        { estado: 'PR', cidades: ['Maringá', 'Curitiba', 'Londrina'] },
        { estado: 'RS', cidades: ['Caxias do Sul', 'Porto Alegre', 'Pelotas'] },
        { estado: 'GO', cidades: ['Anápolis', 'Goiânia', 'Rio Verde'] },
    ];

    // Cria propriedades
    const propriedades = await Promise.all(
        Array.from({ length: 15 }).map((_, i) => {
            const produtor = produtores[i % produtores.length];
            const estadoInfo = estadosECidades[i % estadosECidades.length];
            const cidade = estadoInfo.cidades[i % estadoInfo.cidades.length];

            return prisma.propriedade.create({
                data: {
                    nome: `Fazenda ${i + 1}`,
                    cidade,
                    estado: estadoInfo.estado,
                    areaTotal: 100 + i * 10,
                    areaAgricultavel: 60 + i * 5,
                    areaVegetacao: 40 + i * 5,
                    produtorId: produtor.id,
                },
            });
        })
    );
    // Cria safras
    const culturas = ['Soja', 'Milho', 'Café', 'Algodão', 'Arroz'];
    const anos = [2022, 2023, 2024];

    await Promise.all(
        propriedades.flatMap((fazenda, i) =>
            anos.map((ano) =>
                prisma.safra.create({
                    data: {
                        nome: `Safra ${culturas[i % culturas.length]} ${ano}`,
                        cultura: culturas[i % culturas.length],
                        ano,
                        areaPlantada: 40 + (i * 2),
                        propriedadeId: fazenda.id,
                    },
                })
            )
        )
    );
}

main()
    .then(() => {
        console.log('Dados inseridos com sucesso!');
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
