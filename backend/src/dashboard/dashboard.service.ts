// src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const [totalPropriedades, somaHectares, propriedades, culturas, todasPropriedades] = await Promise.all([
      this.prisma.propriedade.count(),
      this.prisma.propriedade.aggregate({
        _sum: { areaTotal: true },
      }),
      this.prisma.propriedade.findMany({
        select: { estado: true },
      }),
      this.prisma.safra.findMany({
        select: { cultura: true, areaPlantada: true },
      }),
      this.prisma.propriedade.findMany({
        select: { areaAgricultavel: true, areaVegetacao: true },
      }),
    ]);

    const porEstado = propriedades.reduce((acc, prop) => {
      acc[prop.estado] = (acc[prop.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porCultura = culturas.reduce((acc, safra) => {
      acc[safra.cultura] = (acc[safra.cultura] || 0) + safra.areaPlantada;
      return acc;
    }, {} as Record<string, number>);

    let totalAgricultavel = 0;
    let totalVegetacao = 0;

    todasPropriedades.forEach(p => {
      totalAgricultavel += p.areaAgricultavel;
      totalVegetacao += p.areaVegetacao;
    });

    return {
      totalPropriedades,
      somaHectares: somaHectares._sum.areaTotal ?? 0,
      porEstado: Object.entries(porEstado).map(([name, value]) => ({ name, value })),
      porCultura: Object.entries(porCultura).map(([name, value]) => ({ name, value })),
      usoSolo: [
        { name: 'Agricultável', value: totalAgricultavel },
        { name: 'Vegetação', value: totalVegetacao },
      ],
    };
  }
}
