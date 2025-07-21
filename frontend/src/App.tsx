// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import ProducersPage from './pages/ProducersPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropertiesPage from './pages/PropertiesPage';
import HarvestPage from './pages/HarvestPage';
import DashboardPage from './pages/DashboardPage';

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: #2f7a2f;
  color: white;
  display: flex;
  flex-direction: column;
  padding: .5rem;
`;

const SidebarHeader = styled.h1`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;  
  text-align: center;
`;

const SidebarLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  display: block;
  transition: background-color 0.3s ease; 

  &.active, &:hover {
    background-color: #1f5a1f;
  }
`;

const Submenu = styled.div<{ expanded: boolean }>`
  max-height: ${({ expanded }) => (expanded ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1rem;
  margin-bottom: ${({ expanded }) => (expanded ? '1rem' : '0')};
`;

const SubmenuLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: block;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.3s ease; 

  &.active, &:hover {
    background-color: #1f5a1f;
  }
`;

const Content = styled.main`
  flex-grow: 1;
  background-color: #f0f8f0;
  overflow-y: auto;
`;

const SidebarToggle = styled.div`
  display: flex;
  justify-content: space-between;  
  align-items: center;
  color: white;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease; 

  &:hover {
    background-color: #1f5a1f;
  }
`;

const App: React.FC = () => {
  const [cadastrosExpanded, setCadastrosExpanded] = useState(false);

  return (
    <>
    <Router>
      <Layout>
        <Sidebar>
          <SidebarHeader>Gestão Agrícola</SidebarHeader>

          <SidebarLink to="/" end>
            Dashboard
          </SidebarLink>

          <div>
            <SidebarToggle onClick={() => setCadastrosExpanded(!cadastrosExpanded)}>
              <span>Cadastros</span>
              <span>{cadastrosExpanded ? '▲' : '▼'}</span>
            </SidebarToggle>

            <Submenu expanded={cadastrosExpanded}>
              <SubmenuLink to="/producers">Produtores</SubmenuLink>
              <SubmenuLink to="/properties">Propriedades</SubmenuLink>
              <SubmenuLink to="/harvests">Safras</SubmenuLink>
            </Submenu>
          </div>
        </Sidebar>

        <Content>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/producers" element={<ProducersPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/harvests" element={<HarvestPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
  
};

export default App;
