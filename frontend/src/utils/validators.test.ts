// src/utils/validators.test.ts
import { isValidCPF, isValidCNPJ } from './validators';

describe('Validação de CPF', () => {
  it('deve validar um CPF válido', () => {
    expect(isValidCPF('52998224725')).toBe(true);
  });

  it('deve invalidar um CPF com todos os dígitos iguais', () => {
    expect(isValidCPF('11111111111')).toBe(false);
  });

  it('deve invalidar um CPF com dígitos incorretos', () => {
    expect(isValidCPF('12345678900')).toBe(false);
  });
});

describe('Validação de CNPJ', () => {
  it('deve validar um CNPJ válido', () => {
    expect(isValidCNPJ('11444777000161')).toBe(true);
  });

  it('deve invalidar um CNPJ com todos os dígitos iguais', () => {
    expect(isValidCNPJ('00000000000000')).toBe(false);
  });

  it('deve invalidar um CNPJ com dígitos incorretos', () => {
    expect(isValidCNPJ('12345678000196')).toBe(false);
  });
});
