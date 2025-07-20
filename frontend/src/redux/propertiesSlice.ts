// src/redux/propertiesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Property {
    id: string;
    nome: string;
    areaTotal: number;
    areaAgricultavel: number;
    areaVegetacao: number;
    estado: string;
    cidade: string;
    produtorId: string;
    produtor?: {
        nome: string;
        cpfCnpj: string;
    };
}

interface PropertiesState {
    items: Property[];
    loading: boolean;
    error: string | null;
}

const initialState: PropertiesState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchProperties = createAsyncThunk<Property[], string>(
    'properties/fetchAll',
    async (search: string) => {
        const response = await axios.get(`/api/properties?search=${search}`);
        return response.data;
    }
);

export const addProperty = createAsyncThunk<Property, Omit<Property, 'id'>>(
    'properties/add',
    async (data) => {
        const response = await axios.post('/api/properties', data);
        return response.data;
    }
);

export const updateProperty = createAsyncThunk<Property, Property>(
    'properties/update',
    async (data) => {
        const response = await axios.put(`/api/properties/${data.id}`, data);
        return response.data;
    }
);

export const deleteProperty = createAsyncThunk<string, string>(
    'properties/delete',
    async (id) => {
        await axios.delete(`/api/properties/${id}`);
        return id;
    }
);

const propertiesSlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erro ao buscar propriedades';
            })
            .addCase(addProperty.fulfilled, (state, action: PayloadAction<Property>) => {
                state.items.push(action.payload);
            })
            .addCase(updateProperty.fulfilled, (state, action: PayloadAction<Property>) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteProperty.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(p => p.id !== action.payload);
            });
    },
});

export default propertiesSlice.reducer;
