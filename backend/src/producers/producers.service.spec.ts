import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from './producers.service';
import { PrismaService } from '../database/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ProducersService', () => {
  let service: ProducersService;

  const prismaMock = {
    produtor: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if cpfCnpj already exists', async () => {
      prismaMock.produtor.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.create({ nome: 'Nome', cpfCnpj: '12345678901' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create producer if cpfCnpj is unique', async () => {
      prismaMock.produtor.findUnique.mockResolvedValue(null);
      prismaMock.produtor.create.mockResolvedValue({
        id: 'new-id',
        nome: 'Nome',
        cpfCnpj: '12345678901',
      });

      const result = await service.create({
        nome: 'Nome',
        cpfCnpj: '12345678901',
      });

      expect(result).toHaveProperty('id', 'new-id');
      expect(prismaMock.produtor.create).toHaveBeenCalledWith({
        data: { nome: 'Nome', cpfCnpj: '12345678901' },
      });
    });
  });

  describe('findAll', () => {
    it('should return array of producers', async () => {
      const mockProducers = [{ id: '1', nome: 'Produtor 1' }];
      prismaMock.produtor.findMany.mockResolvedValue(mockProducers);

      const result = await service.findAll();

      expect(result).toEqual(mockProducers);
      expect(prismaMock.produtor.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { nome: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const mockProducer = { id: '1', nome: 'Produtor 1' };
      prismaMock.produtor.findUnique.mockResolvedValue(mockProducer);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProducer);
      expect(prismaMock.produtor.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { propriedades: true },
      });
    });
  });

  describe('remove', () => {
    it('should delete a producer by id', async () => {
      prismaMock.produtor.delete.mockResolvedValue({ id: '1' });

      const result = await service.remove('1');

      expect(result).toEqual({ id: '1' });
      expect(prismaMock.produtor.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
