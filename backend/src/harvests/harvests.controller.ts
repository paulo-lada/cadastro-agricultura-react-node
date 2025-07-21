import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('safras')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  create(@Body() dto: CreateHarvestDto) {
    return this.harvestsService.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.harvestsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.harvestsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.harvestsService.remove(id);
  }
}
