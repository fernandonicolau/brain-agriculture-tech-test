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

## Seed de desenvolvimento

O seed foi pensado para ambiente de desenvolvimento e faz reset dos dados de dominio antes de inserir os registros de exemplo. Isso permite rodar o comando mais de uma vez sem duplicar dados.

Executar migrations e depois popular a base:

```bash
npm run migration:run
npm run seed
```

O seed cria:

- 3 produtores
- 4 fazendas em estados diferentes: `MG`, `SP`, `MT`, `GO`
- 5 culturas: `Soja`, `Milho`, `Algodao`, `Cafe`, `Cana-de-acucar`
- 5 safras
- associacoes entre safras e culturas suficientes para alimentar o dashboard

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/health?checkDatabase=true`

## Regras de negocio

- A validacao de CPF/CNPJ foi implementada manualmente em [src/common/validators/document.validator.ts](src/common/validators/document.validator.ts) para evitar dependencia extra e manter a regra explicita no projeto.
- A regra de area da fazenda usa `arableArea + vegetationArea <= totalArea` e esta centralizada em [src/common/validators/farm-area.validator.ts](src/common/validators/farm-area.validator.ts).
