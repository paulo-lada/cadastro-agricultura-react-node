import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../database/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  const prismaMock = {
    propriedade: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    safra: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar o dashboard com totais e gráficos', async () => {
    prismaMock.propriedade.count.mockResolvedValue(1);
    prismaMock.propriedade.aggregate.mockResolvedValue({ _sum: { areaTotal: 100 } });
    prismaMock.propriedade.findMany.mockResolvedValue([
      {
        id: '1',
        nome: 'Fazenda A',
        cidade: 'Uberlândia',
        estado: 'MG',
        areaTotal: 100,
        areaAgricultavel: 60,
        areaVegetacao: 40,
        produtorId: 'p1',
        produtor: { id: 'p1', nome: 'João', cpfCnpj: '12345678901' },
      },
    ]);

    prismaMock.safra.findMany.mockResolvedValue([
      {
        id: '1',
        nome: 'Safra 2024',
        propriedadeId: '1',
        ano: 2024,
        areaPlantada: 50,
        cultura: 'Milho',
        propriedade: { id: '1' },
      },
    ]);

    const result = await service.getDashboardData();

    expect(result.totalPropriedades).toBe(1);
    expect(result.somaHectares).toBe(100);
    expect(result.porEstado).toEqual([{ name: 'MG', value: 1 }]);
    expect(result.porCultura).toEqual([{ name: 'Milho', value: 50 }]);
    expect(result.usoSolo).toEqual([
      { name: 'Agricultável', value: 60 },
      { name: 'Vegetação', value: 40 },
    ]);
  });
});
