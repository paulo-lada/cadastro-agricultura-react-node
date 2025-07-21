import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsService } from './harvests.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('HarvestsService', () => {
  let service: HarvestsService;

  const prismaMock = {
    propriedade: {
      findUnique: jest.fn(),
    },
    safra: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if propriedade does not exist', async () => {
      prismaMock.propriedade.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ ano: 2022, propriedadeId: 'invalid-id', nome: 'Test Harvest', areaPlantada: 10, cultura: 'Soja' }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.propriedade.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
    });

    it('should create harvest if propriedade exists', async () => {
      prismaMock.propriedade.findUnique.mockResolvedValue({ id: 'prop-1' });
      prismaMock.safra.create.mockResolvedValue({
        id: 'safra-1',
        ano: 2022,
        propriedadeId: 'prop-1',
      });

      const result = await service.create({
        ano: 2022,
        propriedadeId: 'prop-1',
        nome: 'Test Harvest',
        areaPlantada: 10,
        cultura: 'Soja',
      });

      expect(result).toHaveProperty('id', 'safra-1');
      expect(prismaMock.safra.create).toHaveBeenCalledWith({
        data: {
          ano: 2022,
          propriedadeId: 'prop-1',
          nome: 'Test Harvest',
          areaPlantada: 10,
          cultura: 'Soja',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return array of harvests', async () => {
      const mockHarvests = [{ id: '1', ano: 2022 }];
      prismaMock.safra.findMany.mockResolvedValue(mockHarvests);

      const result = await service.findAll();

      expect(result).toEqual(mockHarvests);
      expect(prismaMock.safra.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { ano: 'desc' },
        include: { propriedade: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a harvest by id', async () => {
      const mockHarvest = { id: '1', ano: 2022 };
      prismaMock.safra.findUnique.mockResolvedValue(mockHarvest);

      const result = await service.findOne('1');

      expect(result).toEqual(mockHarvest);
      expect(prismaMock.safra.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { propriedade: true },
      });
    });
  });

  describe('remove', () => {
    it('should delete a harvest by id', async () => {
      prismaMock.safra.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result).toEqual({ id: '1' });
      expect(prismaMock.safra.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
