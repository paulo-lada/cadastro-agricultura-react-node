import { IsNotEmpty, IsString, IsNumber, Min, MaxLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'areaTotalValidator', async: false })
class AreaTotalValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as any;
    const areaAgricultavel = obj.areaAgricultavel;
    const areaVegetacao = obj.areaVegetacao;

    if (typeof value !== 'number' || typeof areaAgricultavel !== 'number' || typeof areaVegetacao !== 'number') {
      return false;
    }

    return value >= (areaAgricultavel + areaVegetacao);
  }

  defaultMessage(args: ValidationArguments) {
    return 'A área total deve ser maior ou igual à soma das áreas agricultável e de vegetação';
  }
}

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Validate(AreaTotalValidator)
  areaTotal: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  areaAgricultavel: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  areaVegetacao: number;

  @IsNotEmpty()
  @IsString()
  produtorId: string; // FK para produtor
}
