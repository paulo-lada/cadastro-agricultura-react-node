import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Harvest {
  id: string;
  nome: string;
  propriedadeId: string;
  ano: number;
  areaPlantada: number;
  cultura: string;
  propriedade?: {
    nome: string;
  };
}

interface HarvestState {
  items: Harvest[];
  loading: boolean;
  error: string | null;
}

const initialState: HarvestState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchHarvests = createAsyncThunk(
  'harvests/fetchHarvests',
  async (search: string) => {
    const res = await axios.get(`/api/harvests?search=${search}`);
    return res.data as Harvest[];
  }
);

export const addHarvest = createAsyncThunk(
  'harvests/addHarvest',
  async (harvest: Omit<Harvest, 'id'>) => {
    const res = await axios.post('/api/harvests', harvest);
    return res.data as Harvest;
  }
);

export const updateHarvest = createAsyncThunk(
  'harvests/updateHarvest',
  async ({ id, ...data }: Partial<Harvest> & { id: string }) => {
    const res = await axios.put(`/api/harvests/${id}`, data);
    return res.data as Harvest;
  }
);

export const deleteHarvest = createAsyncThunk(
  'harvests/deleteHarvest',
  async (id: string) => {
    await axios.delete(`/api/harvests/${id}`);
    return id;
  }
);

const harvestsSlice = createSlice({
  name: 'harvests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHarvests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHarvests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHarvests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar safras';
      })
      .addCase(addHarvest.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateHarvest.fulfilled, (state, action) => {
        const index = state.items.findIndex(h => h.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteHarvest.fulfilled, (state, action) => {
        state.items = state.items.filter(h => h.id !== action.payload);
      });
  },
});

export default harvestsSlice.reducer;
