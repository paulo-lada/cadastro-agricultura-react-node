import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Producer {
  id: string;
  nome: string;
  cpfCnpj: string;
}

interface ProducersState {
  items: Producer[];
  loading: boolean;
  error: string | null;
}

const initialState: ProducersState = {
  items: [],
  loading: false,
  error: null,
};

// Busca produtores por nome ou CPF/CNPJ
export const fetchProducers = createAsyncThunk<Producer[], string>(
  'producers/fetch',
  async (search) => {
    const response = await axios.get<Producer[]>('/api/producers', {
      params: { search },
    });
    return response.data;
  }
);

// Adiciona um novo produtor
export const addProducer = createAsyncThunk<
  Producer,
  { nome: string; cpfCnpj: string },
  { rejectValue: { message: string } }
>(
  'producers/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post<Producer>('/api/producers', data);
      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue({ message: err.response.data.message });
      }
      return rejectWithValue({ message: 'Erro desconhecido ao salvar produtor.' });
    }
  }
);

// Atualiza um produtor existente
export const updateProducer = createAsyncThunk<Producer, { id: string; nome: string; cpfCnpj: string }>(
  'producers/update',
  async ({ id, nome, cpfCnpj }) => {
    const response = await axios.put<Producer>(`/api/producers/${id}`, { nome, cpfCnpj });
    return response.data;
  }
);

// Deleta um produtor
export const deleteProducer = createAsyncThunk<void, string>(
  'producers/delete',
  async (id) => {
    await axios.delete(`/api/producers/${id}`);
  }
);

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducers.fulfilled, (state, action: PayloadAction<Producer[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erro ao buscar produtores';
      })
      .addCase(addProducer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProducer.fulfilled, (state, action: PayloadAction<Producer>) => {
        state.loading = false;
        state.items.unshift(action.payload); // adiciona no topo
      })
      .addCase(addProducer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erro ao adicionar produtor';
      });
  },
});

export default producersSlice.reducer;
