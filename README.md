# Teste Starti

API REST construída com NestJS, Drizzle ORM e PostgreSQL.

## Requisitos

- Node.js 22+
- pnpm
- Docker (para o banco de dados)

## Setup

### 1. Suba o banco de dados

```bash
make docker-dev-start
```

Isso sobe um container Postgres na porta `7075` (user: `docker`, password: `docker`, database: `teste-starti`).

### 2. Configure as variáveis de ambiente

Ajuste os valores no `.env` conforme o exemplo em `.env.example`.

### 3. Instale as dependências e rode as migrations

```bash
pnpm install
pnpm drizzle-kit migrate
```

### 4. Inicie o servidor

```bash
pnpm dev
```

O servidor inicia na porta configurada no `.env` (padrão: `8082`).

## Docker

O projeto possui um `Dockerfile`. Para o banco de dados de desenvolvimento, use o docker-compose em `docker/dev/docker-compose.yaml`:

```bash
make docker-dev-start   # sobe o Postgres
make docker-dev-stop    # para o Postgres
```

## Endpoints

Todos os endpoints são versionados sob `/v1/`.

### Users (`/v1/users`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/users` | Criar usuário |
| GET | `/v1/users/:id` | Buscar usuário pelo ID |
| PUT | `/v1/users/:id` | Atualizar usuário |
| DELETE | `/v1/users/:id` | Apagar usuário |
| GET | `/v1/users/:id/posts` | Listar posts públicos do usuário |
| GET | `/v1/users/:id/comments` | Listar comentários do usuário em posts públicos |

### Posts (`/v1/posts`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/posts` | Criar publicação |
| GET | `/v1/posts/:id` | Buscar publicação pelo ID |
| PUT | `/v1/posts/:id` | Atualizar publicação |
| PUT | `/v1/posts/:id/archive` | Arquivar publicação |
| DELETE | `/v1/posts/:id` | Apagar publicação |
| GET | `/v1/posts/:id/comments` | Listar comentários da publicação |

### Comments (`/v1/comments`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/comments` | Criar comentário |
| PUT | `/v1/comments/:id` | Atualizar comentário |
| DELETE | `/v1/comments/:id` | Apagar comentário |

## Documentação

A documentação Swagger está disponível em:

```
http://localhost:8082/swagger
```
