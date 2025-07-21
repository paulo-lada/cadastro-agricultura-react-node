import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePropertyDto) {
    const produtor = await this.prisma.produtor.findUnique({
      where: { id: data.produtorId },
    });

    if (data.areaAgricultavel + data.areaVegetacao > data.areaTotal) {
      throw new BadRequestException('Área agricultável e vegetação não podem exceder o total de hectares.');
    }

    if (!produtor) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return this.prisma.propriedade.create({ data });
  }

  async update(id: string, data: CreatePropertyDto) {
    const propriedade = await this.prisma.propriedade.findUnique({
      where: { id },
    });
    
    if (data.areaAgricultavel + data.areaVegetacao > data.areaTotal) {
      throw new BadRequestException('Área agricultável e vegetação não podem exceder o total de hectares.');
    }
    
    if (!propriedade) {
      throw new NotFoundException('Propriedade não encontrada');
    }

    const produtor = await this.prisma.produtor.findUnique({
      where: { id: data.produtorId },
    });

    if (!produtor) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return this.prisma.propriedade.update({
      where: { id },
      data,
    });
  }

  async findAll(search?: string) {
    const where: Prisma.PropriedadeWhereInput = search
      ? {
        OR: [
          {
            nome: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
          {
            cidade: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        ],
      }
      : {};

    return this.prisma.propriedade.findMany({
      where,
      orderBy: { nome: 'asc' },
      include: { produtor: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.propriedade.findUnique({
      where: { id },
      include: { produtor: true, safras: true },
    });
  }

  async remove(id: string) {
    return this.prisma.propriedade.delete({ where: { id } });
  }
}
