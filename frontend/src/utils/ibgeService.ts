import axios from 'axios';

export async function fetchEstados() {
  const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  return response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
}

export async function fetchCidadesPorEstado(sigla: string) {
  const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`);
  return response.data;
}
