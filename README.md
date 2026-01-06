# 🅿️ Parking System

Sistema **full stack** para gerenciamento de estacionamento, com controle de vagas, registro de entrada e saída de veículos, cálculo automático de tarifas e **dashboard com estatísticas em tempo real**.

---

## 📋 Índice

- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Objetivo](#-objetivo)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📦 Pré-requisitos](#-pré-requisitos)
- [🚀 Instalação e Configuração](#-instalação-e-configuração)
- [🎮 Como Usar](#-como-usar)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔌 API - Endpoints](#-api---endpoints)
- [📏 Regras de Negócio](#-regras-de-negócio)
- [🔮  Melhorias Futuras](#-melhorias-futuras)
- [👨‍💻 Autor](#-autor)
- [📄 Licença](#-licença)

---

## 📖 Sobre o Projeto

O **Parking System** é uma aplicação **full stack** desenvolvida para facilitar o controle e a gestão de estacionamentos.

O sistema permite:
- Cadastro e gerenciamento de vagas
- Registro de entrada e saída de veículos
- Cálculo automático de tarifas
- Visualização de estatísticas em tempo real

---

## 🎯 Objetivo

Fornecer uma solução completa e intuitiva para:

- Controlar a ocupação de vagas em tempo real
- Registrar movimentações de veículos
- Calcular automaticamente o valor a ser pago
- Gerar relatórios e estatísticas
- Facilitar a gestão operacional do estacionamento

---

## ✨ Funcionalidades

### 📊 Dashboard
- Visualização em tempo real do status das vagas
- Estatísticas:
  - Total de vagas
  - Ocupadas
  - Livres
  - Em manutenção
- Receita do dia
- Gráfico de percentual de ocupação
- Filtros por status e tipo de vaga
- Grid visual com cores por status

### 🚗 Movimentações

#### Registro de Entrada
- Validação de placas:
  - `ABC-1234`
  - `ABC1D23` (padrão Mercosul)
- Seleção de vaga disponível
- Tipo de veículo (carro ou moto)
- Atualização automática do status da vaga

#### Registro de Saída
- Busca por placa
- Cálculo automático do valor
- Tolerância de **15 minutos grátis**
- Liberação automática da vaga

#### Veículos no Pátio
- Lista de veículos estacionados
- Tempo de permanência em tempo real
- Informações detalhadas (placa, vaga, tipo e horário)

---

### ⚙️ Gestão

#### Vagas
- Criar novas vagas
- Editar número, tipo e status
- Excluir vagas (apenas se estiverem livres)
- Validação de número único
- Alterar status para manutenção

#### Tarifas
- Tarifas por tipo de veículo
- Valores diferenciados para carro e moto
- Configuração de tolerância em minutos

---

## 🛠 Tecnologias Utilizadas

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Swagger
- Class Validator

### Frontend
- React
- Vite
- TypeScript
- TailwindCSS
- Axios
- Lucide React

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- Node.js **18+**
- PostgreSQL **15+**
- npm ou yarn
- NestJS CLI (opcional)

```bash
npm install -g @nestjs/cli

```
---

## 🚀 Instalação e Configuração

1️⃣ Banco de Dados (PostgreSQL)
```bash
CREATE DATABASE parking_db;
```

---

## 2️⃣ Clonar o Projeto
```bash
git clone https://github.com/ewerttongoncalvesdev/parking-system.git
cd parking-system
```

---

## 3️⃣ Configurar o Backend
```bash
cd backend
npm install
```

Crie o arquivo .env:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=parking_db
```

Execute o backend:
```bash
npm run start:dev
```

---

## 4️⃣ Configurar o Frontend
```bash
cd frontend
npm install
npm run dev
```

---

### 🎮 Como Usar

#### Criar Vagas

1. Acesse **Gestão**
2. Clique em **Nova Vaga**
3. Informe:
   - Número (ex: A1, B2)
   - Tipo (Carro, Moto ou Deficiente)

---

#### Registrar Entrada

1. Acesse **Movimentações**
2. Clique em **Registrar Entrada**
3. Informe:
   - Placa
   - Vaga disponível
   - Tipo do veículo

---

#### Registrar Saída

1. Informe a placa
2. Confirme o cálculo
3. Veja o valor automaticamente

---

### 📂 Estrutura do Projeto
```bash
parking-system/
├── backend/
│   ├── src/
│   │   ├── vagas/
│   │   ├── movimentacoes/
│   │   ├── tarifas/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── pages/
│   └── tailwind.config.js
```
---

### 🔌 API - Endpoints

**Vagas**

| Método | Endpoint     | Descrição        |
|--------|--------------|------------------|
| GET    | /vagas       | Listar vagas     |
| POST   | /vagas       | Criar vaga       |
| PUT    | /vagas/:id   | Atualizar vaga   |
| DELETE | /vagas/:id   | Excluir vaga     |

**Movimentações**

| Método | Endpoint |
|--------|----------|
| POST   | /movimentacoes/entrada |
| POST   | /movimentacoes/saida   |
| GET    | /movimentacoes         |

**Tarifas**

| Método | Endpoint     |
|--------|--------------|
| GET    | /tarifas     |
| PUT    | /tarifas/:id |

---

### 📏 Regras de Negócio

- Moto pode usar vaga de carro
- Carro não pode usar vaga de moto
- Tolerância de 15 minutos
- Fração de hora é arredondada para cima
- Vaga é liberada automaticamente na saída
- Não é permitido ocupar vaga em manutenção

---

### 🔮  Melhorias Futuras

- Sistema de autenticação e login (Admin / operador)
- Integração com pagamento online
- Relatórios em PDF/Excel

---

### 👨‍💻 Autor

**Ewertton Gonçalves**
- GitHub: [@ewerttongongalvesdev](https://github.com/ewerttongoncalvesdev)
- LinkedIn: [Ewertton Gonçalves](https://www.linkedin.com/in/ewerttongoncalves/)
- Email: dev.ewerttongoncalves@gmail.com

---

### 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

<div align="center">
⭐ Se este projeto te ajudou, considere dar uma estrela! ⭐
Feito com muito ☕
</div>







