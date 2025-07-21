import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('produtores')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  create(@Body() dto: CreateProducerDto) {
    return this.producersService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreateProducerDto,
  ) {
    return this.producersService.update(id, dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.producersService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producersService.remove(id);
  }
}
