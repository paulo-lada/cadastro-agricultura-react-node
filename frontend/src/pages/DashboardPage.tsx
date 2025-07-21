// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDashboardData } from '../redux/dashboardSlice';
import type { AppDispatch, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { TitleBar } from '../components/TitleBar';
import { PageContainer } from '../components/PageContainer';
import { NoResult } from '../components/NoResult';

const Summary = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: #f4f4f4;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ChartSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const ChartContainer = styled.div`
  width: 400px;
  height: 300px;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a83279', '#4CAF50'];

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error } = useSelector((state: RootState) => state.dashboard);
    const [debounceId, setDebounceId] = useState<NodeJS.Timeout>();

    useEffect(() => {
        const id = setTimeout(() => {
            dispatch(fetchDashboardData())
        }, 500);
        setDebounceId(id);

        return () => {
            if (debounceId) clearTimeout(debounceId);
        };
    }, [dispatch]);

    const renderChart = (data: any[], title: string) => (
        <ChartContainer>
            <h3 style={{ textAlign: 'center' }}>{title}</h3>
            <ResponsiveContainer>
                <PieChart>
                    <Pie dataKey="value" data={data} outerRadius={100} fill="#8884d8" label>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );

    return (
        <PageContainer>
            <TitleBar>Dashboard</TitleBar>

            {loading &&
                <NoResult>
                    <p>Carregando...</p>
                </NoResult>
            }

            {!loading && error != null && (
                <NoResult>
                    <p>Não foi possível carregar os dados do dashboard.</p>
                </NoResult>
            )}

            {!loading && items.totalPropriedades === 0 && error == null && (
                <NoResult>
                    <p>Nenhum dado disponível para exibir.</p>
                </NoResult>
            )}

            {!loading && items.totalPropriedades > 0 && (
                <>
                    <Summary>
                        <SummaryCard>Total de Fazendas: {items.totalPropriedades}</SummaryCard>
                        <SummaryCard>Total de Hectares: {items.somaHectares} ha</SummaryCard>
                    </Summary>
                    <ChartSection>
                        {renderChart(items.porEstado, 'Fazendas por Estado')}
                        {renderChart(items.porCultura, 'Áreas por Cultura')}
                        {renderChart(items.usoSolo, 'Uso do Solo')}
                    </ChartSection>
                </>
            )}
        </PageContainer>
    );
};

export default DashboardPage;
