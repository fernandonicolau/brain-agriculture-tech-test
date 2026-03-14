# Brain Agriculture API

Backend base em NestJS para o teste tecnico de gestao de produtores rurais.

## Variaveis de ambiente

Copie o arquivo de exemplo e ajuste os valores se necessario:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Rodando com Docker Compose

Suba a API com hot reload e o PostgreSQL:

```bash
docker compose up --build
```

Derrube os containers:

```bash
docker compose down
```

Derrube os containers e remova o volume do banco:

```bash
docker compose down -v
```

## Rodando sem Docker

```bash
npm install
npm run start:dev
```

## Migrations

Criar uma migration vazia:

```bash
npm run migration:create --name=CreateProducerTable
```

Gerar uma migration a partir das entidades:

```bash
npm run migration:generate --name=CreateProducerTable
```

Executar migrations:

```bash
npm run migration:run
```

Reverter a ultima migration:

```bash
npm run migration:revert
```

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/health?checkDatabase=true`
