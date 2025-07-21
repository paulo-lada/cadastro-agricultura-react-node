import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: 'CPF ou CNPJ deve conter 11 ou 14 dígitos numéricos',
  })
  cpfCnpj: string;
}
