import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('propriedades')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(@Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: CreatePropertyDto,
  ) {
    return this.propertiesService.update(id, dto);
  }

  @Get()
    findAll(@Query('search') search?: string) {
    return this.propertiesService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
