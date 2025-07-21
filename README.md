# AgroGestor

Sistema completo para gerenciamento de propriedades rurais, produtores e safras. A solução foi desenvolvida com foco em modularidade, boas práticas de desenvolvimento, testes automatizados e uma interface simples para facilitar a gestão agrícola.

## Tecnologias Utilizadas

### Backend
- NestJS (TypeScript)
- Prisma ORM com PostgreSQL
- Validação com `class-validator`
- Testes unitários com Jest
- Docker (ambiente isolado para banco de dados)

### Frontend
- ReactJS com TypeScript
- Redux Toolkit para gerenciamento de estado
- Styled Components (Atomic Design)
- React Testing Library e Jest para testes

## Funcionalidades

### Produtores
- Cadastro e edição de produtores
- Validação de CPF e CNPJ
- Listagem com busca, edição e exclusão

### Propriedades
- Cadastro de fazendas com área total, agricultável e vegetação
- Associação com produtor existente (busca com debounce e atalho para novo cadastro)
- Validação de hectares (área agricultável + vegetação ≤ área total)
- Seleção de estado e cidade via API do IBGE

### Safras
- Cadastro de safras por propriedade
- Registro de cultura, ano e área plantada
- Associação direta com propriedade

### Dashboard
- Total de propriedades cadastradas
- Soma de hectares registrados
- Gráficos por:
  - Estado
  - Cultura plantada
  - Uso do solo (área agricultável vs. vegetação)


## Execução do projeto

### Pré Requisitos
- docker e docker-compose
- NodeJS

### Backend
- cd backend
- npm install
- docker-compose up -d
- npx prisma migrate dev --name init
- npm run seed
- npm run start
- O backend estará disponível em http://localhost:3000

### Frontend
- cd frontend
- npm install
- npm run dev
- O frontend estará disponível em http://localhost:5173

## Testes

### Backend
- cd backend
- npm run test

### Frontend
- cd fronted
- npm run test