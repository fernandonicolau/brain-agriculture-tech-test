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

## Endpoints

- `GET /health`
