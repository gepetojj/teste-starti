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

<details>
<summary><strong>Criar usuário</strong> — <code>POST /v1/users</code></summary>

![Criar usuário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/create-user.png)

</details>

<details>
<summary><strong>Buscar usuário pelo ID</strong> — <code>GET /v1/users/:id</code></summary>

![Buscar usuário pelo ID](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/get-user-by-id.png)

</details>

<details>
<summary><strong>Atualizar usuário</strong> — <code>PUT /v1/users/:id</code></summary>

![Atualizar usuário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/update-user.png)

</details>

<details>
<summary><strong>Apagar usuário</strong> — <code>DELETE /v1/users/:id</code></summary>

![Apagar usuário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/delete-user.png)

</details>

<details>
<summary><strong>Listar posts do usuário</strong> — <code>GET /v1/users/:id/posts</code></summary>

![Listar posts do usuário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/list-posts-by-user.png)

</details>

<details>
<summary><strong>Listar comentários do usuário</strong> — <code>GET /v1/users/:id/comments</code></summary>

![Listar comentários do usuário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/list-comments-by-user.png)

</details>

### Posts (`/v1/posts`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/posts` | Criar publicação |
| GET | `/v1/posts/:id` | Buscar publicação pelo ID |
| PUT | `/v1/posts/:id` | Atualizar publicação |
| PUT | `/v1/posts/:id/archive` | Arquivar publicação |
| DELETE | `/v1/posts/:id` | Apagar publicação |
| GET | `/v1/posts/:id/comments` | Listar comentários da publicação |

<details>
<summary><strong>Criar publicação</strong> — <code>POST /v1/posts</code></summary>

![Criar publicação](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/create-post.png)

</details>

<details>
<summary><strong>Buscar publicação pelo ID</strong> — <code>GET /v1/posts/:id</code></summary>

![Buscar publicação pelo ID](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/get-post-by-id.png)

</details>

<details>
<summary><strong>Atualizar publicação</strong> — <code>PUT /v1/posts/:id</code></summary>

![Atualizar publicação](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/update-post.png)

</details>

<details>
<summary><strong>Arquivar publicação</strong> — <code>PUT /v1/posts/:id/archive</code></summary>

![Arquivar publicação](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/archive-post.png)

</details>

<details>
<summary><strong>Apagar publicação</strong> — <code>DELETE /v1/posts/:id</code></summary>

![Apagar publicação](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/delete-post.png)

</details>

<details>
<summary><strong>Listar comentários da publicação</strong> — <code>GET /v1/posts/:id/comments</code></summary>

![Listar comentários da publicação](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/list-comments-by-post.png)

</details>

### Comments (`/v1/comments`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/comments` | Criar comentário |
| PUT | `/v1/comments/:id` | Atualizar comentário |
| DELETE | `/v1/comments/:id` | Apagar comentário |

<details>
<summary><strong>Criar comentário</strong> — <code>POST /v1/comments</code></summary>

![Criar comentário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/create-comment.png)

</details>

<details>
<summary><strong>Atualizar comentário</strong> — <code>PUT /v1/comments/:id</code></summary>

![Atualizar comentário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/update-comment.png)

</details>

<details>
<summary><strong>Apagar comentário</strong> — <code>DELETE /v1/comments/:id</code></summary>

![Apagar comentário](https://raw.githubusercontent.com/gepetojj/teste-starti/refs/heads/main/.github/assets/delete-comment.png)

</details>

## Documentação

A documentação Swagger está disponível em:

```
http://localhost:8082/swagger
```
