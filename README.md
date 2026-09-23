# Despensa Inteligente — Backend

API REST para gerenciamento de estoque doméstico e controle do giro de alimentos.

O projeto permite cadastrar produtos, organizar marcas e categorias, controlar lotes e suas movimentações, além de gerenciar listas de compras. A aplicação utiliza autenticação JWT e integra a API do Open Food Facts para facilitar o cadastro de produtos por código de barras.

## Tecnologias

- **Node.js**
- **NestJS 11**
- **TypeScript**
- **TypeORM**
- **MySQL**
- **JWT / Passport**
- **Zod**
- **class-validator / class-transformer**
- **Swagger / OpenAPI**
- **Open Food Facts API**

## Funcionalidades

### Produtos

- Cadastro manual de produtos
- Cadastro por código de barras
- Consulta de produtos no Open Food Facts
- Validação de código de barras
- Controle de origem do produto (`MANUAL` / `OPEN_FOOD_FACTS`)
- Associação com marcas e categorias
- Paginação, filtros e ordenação
- Regras específicas para atualização de produtos provenientes do Open Food Facts

### Marcas e categorias

- CRUD completo
- Busca e criação por nome
- Paginação, filtros e ordenação
- Validação de duplicidade
- Proteção contra exclusão de registros relacionados a produtos

### Lotes

- Controle de lotes por usuário
- Data de compra e validade
- Quantidade e preço unitário
- Cálculo do valor total
- Observações
- Associação com produtos

### Movimentações de estoque

- Entrada
- Consumo
- Descarte
- Ajuste
- Controle da quantidade disponível no lote
- Operações realizadas dentro de transações do banco de dados

### Listas de compras

- Criação de listas por usuário
- Controle de status
- Limite de orçamento
- Itens da lista
- Controle de quantidade e produtos relacionados

### Autenticação e autorização

- Cadastro de usuários
- Login
- Autenticação via JWT
- Controle de acesso baseado em funções
- Roles `USER` e `ADMIN`
- Proteção de rotas com Guards

## Arquitetura

O projeto utiliza uma organização **feature-first**, separando os módulos de acordo com suas responsabilidades de negócio.

```text
src/
├── common/
│   ├── decorators/
│   ├── dto/
│   ├── enums/
│   ├── guards/
│   ├── pipes/
│   └── types/
│
├── database/
│   ├── data-source.ts
│   └── migrations/
│       └── 1790167511824-CreateV1Schema.ts
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── brands/
│   ├── categories/
│   ├── batches/
│   ├── batch-movements/
│   └── shopping-lists/
│
├── app.module.ts
└── main.ts
```

A aplicação separa entidades do banco de dados dos DTOs utilizados nas respostas da API, mantendo as responsabilidades entre persistência, regras de negócio e apresentação.

## Banco de dados

O projeto utiliza **MySQL** com **TypeORM**.

As alterações do schema são controladas por migrations e o projeto utiliza:

```text
synchronize: false
```

A versão atual possui uma migration inicial consolidada:

```text
CreateV1Schema1790167511824
```

Essa migration cria a estrutura inicial do banco, incluindo:

- usuários
- marcas
- categorias
- produtos
- lotes
- movimentações de lote
- listas de compras
- itens de listas de compras

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto para desenvolvimento.

Exemplo:

```env
NODE_ENV=development

PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=despensa_inteligente_db

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d

CORS_ORIGIN=http://localhost:3000

THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

Para produção, utilize:

```text
.env.production.local
```

O arquivo `.env.production.local` não deve ser versionado.

Consulte o `.env.example` para conhecer todas as variáveis necessárias.

## Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## Execução

### Desenvolvimento

```bash
npm run start:dev
```

### Execução normal

```bash
npm run start
```

### Produção

Compile o projeto:

```bash
npm run build
```

Execute a aplicação:

```bash
npm run start:prod
```

Para utilizar as configurações de produção:

```powershell
$env:NODE_ENV="production"
npm run start:prod
```

## Migrations

### Verificar migrations

```bash
npm run migration:show
```

### Executar migrations

```bash
npm run migration:run
```

### Reverter a última migration

```bash
npm run migration:revert
```

A aplicação não utiliza `synchronize` para alterar automaticamente o schema do banco de dados.

## Documentação da API

A API possui documentação interativa utilizando **Swagger / OpenAPI**.

Com a aplicação em execução, acesse:

```text
http://localhost:3000/api/docs
```

A documentação permite consultar os endpoints disponíveis e testar as requisições diretamente pela interface do Swagger.

As rotas protegidas utilizam autenticação Bearer Token.

## Prefixo da API

As rotas da aplicação utilizam o prefixo:

```text
/api
```

Exemplos:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id

GET    /api/brands
GET    /api/categories

GET    /api/batches
POST   /api/batches

GET    /api/shopping-lists
POST   /api/shopping-lists
```

Consulte o Swagger para a lista completa de endpoints, parâmetros, DTOs e respostas.

## Integração com Open Food Facts

O cadastro de produtos por código de barras utiliza a API do **Open Food Facts**.

Fluxo simplificado:

```text
Código de barras
       ↓
API Despensa Inteligente
       ↓
Open Food Facts
       ↓
Dados do produto
       ↓
Validação e normalização
       ↓
Banco de dados
```

A integração utiliza a instância:

```text
https://world.openfoodfacts.net
```

Quando os dados externos não estão disponíveis, o sistema permite o fluxo de cadastro manual conforme as regras definidas para o produto.

## Validação

A aplicação utiliza validação em diferentes níveis.

### Variáveis de ambiente

As variáveis de ambiente são validadas utilizando **Zod**, incluindo:

- tipos
- valores obrigatórios
- portas
- URL de CORS
- segredo JWT
- formato de expiração do JWT
- configurações de rate limiting

### DTOs

Os dados recebidos pela API são validados utilizando:

- `class-validator`
- `class-transformer`

A aplicação também utiliza um ValidationPipe global configurado para rejeitar propriedades não permitidas.

## Segurança

A API possui:

- autenticação JWT
- autorização baseada em roles
- proteção de rotas com Guards
- validação de entrada
- rejeição de propriedades não permitidas
- rate limiting
- controle de CORS
- variáveis sensíveis mantidas fora do código-fonte

## Rate Limiting

A aplicação utiliza proteção contra excesso de requisições através de throttling.

As configurações podem ser definidas através das variáveis:

```env
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## Scripts

Principais comandos disponíveis:

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Testes
npm run test
npm run test:e2e
npm run test:cov

# Migrations
npm run migration:show
npm run migration:run
npm run migration:revert
```

## Objetivo do projeto

O projeto foi desenvolvido como uma aplicação backend completa para gerenciamento de estoque de alimentos, com foco em:

- desenvolvimento de APIs REST
- arquitetura modular
- modelagem de banco de dados
- autenticação e autorização
- integração com APIs externas
- controle transacional de estoque
- validação de dados
- documentação de APIs
- gerenciamento de migrations
- boas práticas de desenvolvimento backend

## Status

**Versão:** `1.0.0`

O backend possui a estrutura inicial da aplicação consolidada em uma migration V1 e está preparado para evolução incremental através de novas migrations e funcionalidades.

## Licença

Este projeto está sob a licença MIT.

```

```
