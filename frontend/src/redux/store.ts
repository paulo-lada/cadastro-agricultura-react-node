
import { configureStore } from '@reduxjs/toolkit';
import producersReducer from './producersSlice';
import propertiesReducer from './propertiesSlice';
import harvestsReducer from './harvestSlice'; 
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    producers: producersReducer,
    properties: propertiesReducer,
    harvests: harvestsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;