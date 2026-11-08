# 🚗 EcoDrive — Sistema de Locação de Veículos

**Faculdade:** UNIPÊ - Centro Universitário  
**Disciplina:** Programação com Frameworks Web  
**Professor:** Thiago Rodrigues Medeiros  

### 👨‍💻 Identificação dos Integrantes
| Aluno(a) | Matrícula (RGM) |
| :--- | :--- |
| **Carlos Alberto Moreira da Silva** | `42214521` |
| **Thalyson Chaves Nunes** | `42066859` |
| **Paula Thifanny Gomes Dias** | `43900119` |

---

## 📌 Descrição do Sistema

O **EcoDrive — Sistema de Locação de Veículos** é uma aplicação web Full-Stack desenvolvida para gerenciar o fluxo completo de uma locadora de veículos. O sistema integra uma **API RESTful** construída em **Node.js + Express** com persistência relacional em **MySQL** via **Prisma ORM** e uma interface reativa em **React (Vite) + Tailwind CSS**, comunicando-se em tempo real por meio do cliente HTTP **Axios**.

Todas as operações de gestão de frota e locações são protegidas por autenticação baseada em **JSON Web Token (JWT)** e senhas criptografadas com **bcrypt**, garantindo que cada usuário autenticado gerencie e consulte seu próprio histórico de locações com segurança e consistência transacional no banco de dados.

---

## ⚙️ Funcionalidades

### 1. Autenticação e Usuários (`/auth`)
- **Cadastro de Usuário:** formulário controlado para criação de conta com nome, e-mail único e senha criptografada (`bcrypt`).
- **Login e Sessão:** autenticação via e-mail e senha com geração de token JWT (validade de 8h) e armazenamento seguro no `localStorage`.
- **Identificação e Logout:** exibição do nome e e-mail do usuário autenticado na barra de navegação e encerramento imediato da sessão.

### 2. Gestão de Veículos (`/veiculos`)
- **Cadastro de Veículos:** registro de novos veículos contendo `marca`, `modelo`, `placa` (única), `ano` e `valorDiaria`.
- **Listagem e Paginação:** visualização organizada em cards com paginação e atualização automática após cada operação.
- **Filtro de Disponibilidade:** filtragem em tempo real entre **Todos**, **Disponíveis** (`GET /veiculos?disponivel=true`) e **Locados**.
- **Atalho de Locação:** seleção direta de qualquer veículo disponível para preencher automaticamente o formulário de locação.

### 3. Gestão de Locações (`/locacoes`)
- **Busca Inteligente de Veículos:** campo de pesquisa por digitação (marca, modelo, placa ou ano) que sugere veículos disponíveis sem sobrecarregar a tela.
- **Definição de Datas e Cálculo Automático:** definição do período de locação com cálculo prévio da quantidade de diárias e do valor total estimado, além do cálculo oficial persistido pelo backend.
- **Reserva Transacional:** ao registrar uma locação, o status do veículo passa automaticamente para indisponível (`disponibilidade: false`) dentro de uma transação do Prisma.
- **Consulta de Histórico e Filtros:** listagem paginada das locações do usuário autenticado com filtros por status (**Todas**, **Ativas** e **Finalizadas**), exibindo datas de início, devolução prevista, devolução efetiva e valor total (`R$`).
- **Finalização de Locação:** encerramento de locações ativas (`PATCH /locacoes/:id/finalizar`), registrando a data efetiva de devolução, alterando o status para `FINALIZADA` e liberando o veículo novamente para a frota (`disponibilidade: true`).

### 4. Experiência de Uso e Interface
- **Feedback Visual:** banner de notificações de sucesso e erro (integrado às respostas do backend) com fechamento automático após 4 segundos ou fechamento manual.
- **Proteção de Rotas e Interceptor HTTP:** envio automático do cabeçalho `Authorization: Bearer <token>` via interceptor do Axios e tratamento automático de sessão expirada (`401`).

---

## 🗂️ Estrutura do Projeto

```text
Sistema-Locacao-Veiculos/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Histórico de migrações do banco MySQL
│   │   └── schema.prisma        # Modelagem (Usuario, Veiculo, Locacao)
│   ├── src/
│   │   ├── config/              # Instância do Prisma Client
│   │   ├── controllers/         # Controladores HTTP (auth, veiculo, locacao)
│   │   ├── middlewares/         # Middleware de validação JWT (authMiddleware)
│   │   ├── routes/              # Definição das rotas da API
│   │   ├── services/            # Regras de negócio e transações
│   │   ├── app.js               # Configuração do Express e CORS
│   │   └── server.js            # Inicialização do servidor HTTP
│   ├── .env.example             # Modelo de variáveis de ambiente (sem segredos reais)
│   └── package.json
│
└── frontend/
    ├── public/                  # Ativos estáticos (logo e favicon)
    ├── src/
    │   ├── components/
    │   │   ├── layout/          # Navbar e Footer
    │   │   └── ui/              # AlertBanner e Pagination
    │   ├── features/
    │   │   ├── auth/            # AuthSection (Login e Cadastro)
    │   │   ├── veiculos/        # VeiculosSection, VeiculoForm e VeiculoCard
    │   │   └── locacoes/        # LocacoesSection, LocacaoForm e LocacaoCard
    │   ├── services/
    │   │   └── api.js           # Instância do Axios e Interceptors JWT
    │   ├── utils/
    │   │   └── formatters.js    # Formatação de moeda (BRL) e datas
    │   ├── App.jsx              # Gerenciamento de estados globais e sessão
    │   ├── index.css            # Configuração do Tailwind CSS e tema (#01602A / #78DE1F)
    │   └── main.jsx             # Ponto de entrada React
    └── package.json
```

---

## 🛠️ Tecnologias e Requisitos de Execução

### Tecnologias Utilizadas
- **Backend:** Node.js, Express 5, Prisma ORM, MySQL, JSON Web Token (`jsonwebtoken`), `bcrypt`, `dotenv`, `cors`.
- **Frontend:** React 19, Vite, Tailwind CSS, Axios.

### Pré-requisitos
Antes de iniciar, certifique-se de ter instalado em sua máquina:
1. **Node.js** (versão 18 LTS ou superior) e **npm**.
2. **MySQL Server** (em execução local na porta `3306` ou instância acessível).
3. **Git** (opcional, para clonagem do repositório).

---

## 🔐 Configuração das Variáveis de Ambiente (`.env.example`)

O diretório `backend/` inclui o arquivo [backend/.env.example](backend/.env.example) contendo apenas os nomes das variáveis necessárias, sem senhas ou segredos reais:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/locadora_db"
JWT_SECRET="sua_chave_secreta_jwt"
PORT=3000
```

Para configurar seu ambiente local:
1. Crie uma cópia do arquivo `.env.example` com o nome `.env` dentro da pasta `backend/`:
   ```bash
   cp backend/.env.example backend/.env
   ```
   *(No Windows PowerShell: `Copy-Item backend/.env.example backend/.env`)*
2. Edite o arquivo `backend/.env` preenchendo suas credenciais locais do MySQL em `DATABASE_URL` e defina uma chave secreta em `JWT_SECRET`.

---

## 🚀 Instalação, Configuração do Banco e Execução

Siga os passos abaixo para instalar as dependências, preparar o banco de dados e iniciar os servidores:

### 1. Clonar o Repositório
```bash
git clone https://github.com/Thalyson-Chaves/Sistema-Locacao-Veiculos.git
cd Sistema-Locacao-Veiculos
```

### 2. Configurar e Iniciar o Backend
Abra um terminal na raiz do projeto e execute:

```bash
# 1. Acesse a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure o arquivo .env (conforme explicado na seção anterior)
# Certifique-se de que o MySQL está rodando e execute as migrations do Prisma
# para criar o banco de dados e as tabelas (usuarios, veiculos, locacoes):
npx prisma migrate dev

# 4. Inicie o servidor do backend em modo de desenvolvimento
npm run dev
```
> O servidor backend ficará disponível em: `http://localhost:3000`

### 3. Instalar e Iniciar o Frontend
Abra um **segundo terminal** na raiz do projeto e execute:

```bash
# 1. Acesse a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento do Vite
npm run dev
```
> A aplicação frontend ficará disponível no navegador em: `http://localhost:5173`

---

## 📡 Resumo dos Endpoints da API (`http://localhost:3000`)

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/cadastro` | Pública | Cadastra um novo usuário (`nome`, `email`, `senha`). |
| `POST` | `/auth/login` | Pública | Autentica o usuário e retorna `{ token, usuario }`. |
| `GET` | `/veiculos` | `Bearer Token` | Lista todos os veículos (aceita `?disponivel=true`). |
| `POST` | `/veiculos` | `Bearer Token` | Cadastra um novo veículo na frota. |
| `GET` | `/locacoes` | `Bearer Token` | Lista o histórico de locações do usuário autenticado. |
| `POST` | `/locacoes` | `Bearer Token` | Registra uma nova locação e reserva o veículo. |
| `PATCH` | `/locacoes/:id/finalizar` | `Bearer Token` | Finaliza a locação ativa e libera o veículo. |

