import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class HarvestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHarvestDto) {
    const propriedade = await this.prisma.propriedade.findUnique({
      where: { id: data.propriedadeId },
    });

    if (!propriedade) {
      throw new NotFoundException('Propriedade não encontrada');
    }

    return this.prisma.safra.create({ data });
  }

  async findAll(search?: string) {
    const where: Prisma.SafraWhereInput = search
      ? {
          OR: [
            {
              nome: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              cultura: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              propriedade: {
                nome: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
            }
          ],
      }
      : {};
    return this.prisma.safra.findMany({
      where,
      orderBy: { ano: 'desc' },
      include: { propriedade: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.safra.findUnique({
      where: { id },
      include: { propriedade: true },
    });
  }

  async remove(id: string) {
    return this.prisma.safra.delete({ where: { id } });
  }
}
