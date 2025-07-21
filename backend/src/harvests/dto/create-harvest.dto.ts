// src/harvest/dto/create-harvest.dto.ts
import { IsUUID, IsString, IsInt, Min, Max, Length } from 'class-validator';

export class CreateHarvestDto {
  @IsString()
  @Length(2, 100)
  nome: string;

  @IsUUID()
  propriedadeId: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1) // permite cadastrar até o próximo ano
  ano: number;

  @IsInt()
  @Min(1)
  areaPlantada: number;

  @IsString()
  @Length(2, 100)
  cultura: string;
}
