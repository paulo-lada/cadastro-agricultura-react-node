import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PropertiesService', () => {
  let service: PropertiesService;

  const prismaMock = {
    propriedade: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    produtor: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if produtor does not exist', async () => {
      prismaMock.produtor.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          nome: 'Fazenda X',
          cidade: 'Cidade Y',
          estado: 'SP',
          areaTotal: 100,
          areaAgricultavel: 40,
          areaVegetacao: 50,
          produtorId: 'invalid-produtor-id',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.produtor.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-produtor-id' },
      });
    });

    it('should throw BadRequestException if areas invalid', async () => {
      prismaMock.produtor.findUnique.mockResolvedValue({ id: 'produtor-1' });

      await expect(
        service.create({
          nome: 'Fazenda X',
          cidade: 'Cidade Y',
          estado: 'SP',
          areaTotal: 80,
          areaAgricultavel: 50,
          areaVegetacao: 40,
          produtorId: 'produtor-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create property if data is valid', async () => {
      prismaMock.produtor.findUnique.mockResolvedValue({ id: 'produtor-1' });
      prismaMock.propriedade.create.mockResolvedValue({
        id: 'prop-1',
        nome: 'Fazenda X',
        cidade: 'Cidade Y',
        estado: 'SP',
        areaTotal: 100,
        areaAgricultavel: 40,
        areaVegetacao: 50,
        produtorId: 'produtor-1',
      });

      const result = await service.create({
        nome: 'Fazenda X',
        cidade: 'Cidade Y',
        estado: 'SP',
        areaTotal: 100,
        areaAgricultavel: 40,
        areaVegetacao: 50,
        produtorId: 'produtor-1',
      });

      expect(result).toHaveProperty('id', 'prop-1');
      expect(prismaMock.propriedade.create).toHaveBeenCalledWith({
        data: {
          nome: 'Fazenda X',
          cidade: 'Cidade Y',
          estado: 'SP',
          areaTotal: 100,
          areaAgricultavel: 40,
          areaVegetacao: 50,
          produtorId: 'produtor-1',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const mockProperties = [
        { id: '1', nome: 'Fazenda 1' },
        { id: '2', nome: 'Fazenda 2' },
      ];
      prismaMock.propriedade.findMany.mockResolvedValue(mockProperties);

      const result = await service.findAll();

      expect(result).toEqual(mockProperties);
      expect(prismaMock.propriedade.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { nome: 'asc' },
        include: { produtor: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return one property by id', async () => {
      const mockProperty = { id: '1', nome: 'Fazenda 1' };
      prismaMock.propriedade.findUnique.mockResolvedValue(mockProperty);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProperty);
      expect(prismaMock.propriedade.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { produtor: true, safras: true },
      });
    });
  });

  describe('remove', () => {
    it('should delete property by id', async () => {
      prismaMock.propriedade.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result).toEqual({ id: '1' });
      expect(prismaMock.propriedade.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
