import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface DashboardData {
    totalPropriedades: number;
    somaHectares: number;
    porEstado: any[];
    porCultura: any[];
    usoSolo: any[];
}

export interface DashboardState {
    items: DashboardData;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    items: {
        totalPropriedades: 0,
        somaHectares: 0,
        porEstado: [],
        porCultura: [],
        usoSolo: [],
    },
    loading: false,
    error: null,
};

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async () => {
        const response = await axios.get('/api/dashboard');
        return response.data as DashboardData;
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erro ao buscar dados';
            })
    }
});


export default dashboardSlice.reducer;