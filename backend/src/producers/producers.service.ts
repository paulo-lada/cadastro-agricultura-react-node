import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProducerDto) {
    const existing = await this.prisma.produtor.findUnique({
      where: { cpfCnpj: data.cpfCnpj },
    });

    if (existing) {
      throw new BadRequestException('CPF/CNPJ já cadastrado.');
    }

    return this.prisma.produtor.create({ data });
  }

  async update(id: string, data: CreateProducerDto) {
    const existing = await this.prisma.produtor.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new BadRequestException('Produtor não encontrado.');
    }

    return this.prisma.produtor.update({
      where: { id },
      data,
    });
  }

  async findAll(search?: string) {
    const where: Prisma.ProdutorWhereInput = search
      ? {
          OR: [
            {
              nome: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              cpfCnpj: { contains: search },
            },
          ],
        }
      : {};

    return this.prisma.produtor.findMany({
      where,
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.produtor.findUnique({
      where: { id },
      include: { propriedades: true },
    });
  }

  async remove(id: string) {
    return this.prisma.produtor.delete({
      where: { id },
    });
  }
}
