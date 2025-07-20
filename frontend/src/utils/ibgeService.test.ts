// src/utils/ibgeService.test.ts
import axios from 'axios';
import { fetchEstados, fetchCidadesPorEstado } from './ibgeService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ibgeService', () => {
  it('deve buscar os estados e ordená-los pelo nome', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'MG', nome: 'Minas Gerais' },
      ],
    });

    const estados = await fetchEstados();
    expect(estados).toEqual([
      { sigla: 'MG', nome: 'Minas Gerais' },
      { sigla: 'RJ', nome: 'Rio de Janeiro' },
      { sigla: 'SP', nome: 'São Paulo' },
    ]);
  });

  it('deve buscar as cidades de um estado', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { nome: 'Campinas' },
        { nome: 'São Paulo' },
        { nome: 'Santos' },
      ],
    });

    const cidades = await fetchCidadesPorEstado('SP');
    expect(cidades).toEqual([
      { nome: 'Campinas' },
      { nome: 'São Paulo' },
      { nome: 'Santos' },
    ]);
  });
});
