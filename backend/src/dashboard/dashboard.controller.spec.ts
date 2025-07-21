import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.conroller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getDashboardData: jest.fn().mockResolvedValue({
              totalPropriedades: 2,
              somaHectares: 200,
              porEstado: [{ name: 'SP', value: 1 }],
              porCultura: [{ name: 'Soja', value: 100 }],
              usoSolo: [
                { name: 'Agricultável', value: 120 },
                { name: 'Vegetação', value: 80 },
              ],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve retornar os dados do dashboard', async () => {
    const result = await controller.getDashboard();
    expect(result.totalPropriedades).toBe(2);
    expect(service.getDashboardData).toHaveBeenCalled();
  });
});
