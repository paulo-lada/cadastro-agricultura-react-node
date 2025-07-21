import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsController } from './harvests.controller';
import { HarvestsService } from './harvests.service';

describe('HarvestsController', () => {
  let controller: HarvestsController;
  let service: HarvestsService;

  const mockHarvestsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestsController],
      providers: [
        {
          provide: HarvestsService,
          useValue: mockHarvestsService,
        },
      ],
    }).compile();

    controller = module.get<HarvestsController>(HarvestsController);
    service = module.get<HarvestsService>(HarvestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
