# Brain Agriculture API

API backend desenvolvida em NestJS para um teste técnico de gestão de produtores rurais, propriedades, safras, culturas e visão consolidada de dashboard.

## Contexto

O projeto modela um cenário de cadastro e gestão do produtor rural com foco em:

- produtores rurais
- propriedades rurais
- safras
- culturas
- associação entre safras e culturas
- indicadores executivos para dashboard

O objetivo foi construir uma base de API organizada, evolutiva e preparada para uso local, execução com Docker, persistência em PostgreSQL e documentação via Swagger.

## Stack Utilizada

- Node.js
- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Docker e Docker Compose
- Jest
- Supertest
- ESLint
- Prettier

## Arquitetura Adotada

A aplicação segue uma organização modular por domínio e responsabilidade.

- `controller`: define contrato HTTP e integração com Swagger
- `service`: concentra regras de negócio e orquestração
- `repository`: encapsula acesso a dados via TypeORM
- `dto`: define contratos de entrada e saída
- `common`: concentra infraestrutura compartilhada, configuração, logging, filtros, validações e banco

Essa separação foi escolhida para manter baixo acoplamento, facilitar testes e permitir evolução incremental sem poluir controllers com lógica de negócio.

## Estrutura de Pastas

```text
src/
├─ common/
│  ├─ config/
│  ├─ database/
│  │  ├─ entities/
│  │  └─ migrations/
│  ├─ http/
│  │  ├─ filters/
│  │  └─ interceptors/
│  ├─ logging/
│  ├─ swagger/
│  ├─ validators/
│  └─ setup-app.ts
├─ modules/
│  ├─ agriculture/
│  │  └─ entities/
│  ├─ crops/
│  ├─ dashboard/
│  ├─ farms/
│  ├─ harvests/
│  ├─ health/
│  └─ producers/
├─ app.module.ts
└─ main.ts

scripts/
├─ seed.ts
└─ typeorm-migration.js

test/
├─ app.e2e-spec.ts
└─ main-api.e2e-spec.ts
```

## Principais Decisões Técnicas

- NestJS foi usado como base por oferecer boa estrutura modular, integração natural com validação, Swagger e DI.
- TypeORM foi adotado pela integração com NestJS, suporte a migrations e facilidade para trabalhar com QueryBuilder.
- PostgreSQL foi escolhido por aderência ao contexto relacional do problema e por ser adequado para agregações do dashboard.
- `synchronize` foi mantido desabilitado. A estrutura do banco é controlada por migrations.
- A associação entre safra e cultura foi modelada explicitamente por `HarvestCrop`, em vez de usar `ManyToMany` implícito, para deixar a estrutura mais clara e extensível.
- As regras centrais de negócio foram encapsuladas em services e helpers próprios, evitando lógica em controller.
- Observabilidade foi tratada com logger centralizado, logs padronizados de request e erro, além de endpoints de liveness/readiness.

## Modelagem de Domínio Resumida

### Entidades principais

- `Producer`
  - `id`
  - `document`
  - `name`
- `Farm`
  - `id`
  - `producerId`
  - `name`
  - `city`
  - `state`
  - `totalArea`
  - `arableArea`
  - `vegetationArea`
- `Harvest`
  - `id`
  - `farmId`
  - `name`
  - `year`
- `Crop`
  - `id`
  - `name`
- `HarvestCrop`
  - `id`
  - `harvestId`
  - `cropId`

### Relacionamentos

- Um produtor possui zero ou muitas fazendas
- Uma fazenda possui zero ou muitas safras
- Uma safra possui zero ou muitas associações com culturas
- Uma cultura pode aparecer em várias safras
- A relação `Harvest <-> Crop` é N:N via `HarvestCrop`

## Regras de Negócio

As regras mais relevantes foram tratadas fora do controller, mantendo os endpoints finos e previsíveis.

### Validação de CPF/CNPJ

- Implementada manualmente em [src/common/validators/document.validator.ts](c:/Users/andre/Desktop/Desafio/brain-agriculture-tech-test/src/common/validators/document.validator.ts)
- Escolha proposital para evitar dependência extra em uma regra pontual e manter o algoritmo explícito no projeto
- Aplicada no cadastro e atualização de produtor
- O documento é normalizado para apenas dígitos antes de persistir

### Regra de área da fazenda

- Implementada em [src/common/validators/farm-area.validator.ts](c:/Users/andre/Desktop/Desafio/brain-agriculture-tech-test/src/common/validators/farm-area.validator.ts)
- Regra:

```text
arableArea + vegetationArea <= totalArea
```

- Aplicada no cadastro e atualização da fazenda
- Existe também uma `CHECK CONSTRAINT` no banco reforçando essa regra

### Outras regras relevantes

- `document` do produtor é único
- `name` da cultura é único
- `harvestId + cropId` é único em `HarvestCrop`
- `state` da fazenda é normalizado para maiúsculo
- o produtor deve existir antes da criação da fazenda
- a fazenda deve existir antes da criação da safra

## Observabilidade

A aplicação possui uma base simples de observabilidade pronta para evolução.

- logger centralizado em [src/common/logging/app-logger.ts](c:/Users/andre/Desktop/Desafio/brain-agriculture-tech-test/src/common/logging/app-logger.ts)
- logs de request com:
  - método
  - rota
  - status code
  - duração
  - ambiente
- logs de erro padronizados
- log de bootstrap com ambiente e porta
- endpoints de saúde:
  - `GET /api/v1/health`
  - `GET /api/v1/health/live`
  - `GET /api/v1/health/ready`

Exemplo de log:

```text
event=request.completed environment=development method=GET path=/api/v1/dashboard statusCode=200 durationMs=12
```

## Variáveis de Ambiente

Arquivo de exemplo: [.env.example](c:/Users/andre/Desktop/Desafio/brain-agriculture-tech-test/.env.example)

```env
PORT=3000
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=brain_agriculture
```

## Setup Local Sem Docker

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar arquivo de ambiente

Linux/macOS:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Ajustar a conexão com o PostgreSQL local

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=brain_agriculture
```

### 4. Executar migrations

```bash
npm run migration:run
```

### 5. Popular com dados de exemplo

```bash
npm run seed
```

### 6. Subir a API

```bash
npm run start:dev
```

## Setup Com Docker

### 1. Criar arquivo de ambiente

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

### 2. Subir a aplicação e o PostgreSQL

```bash
docker compose up --build
```

### 3. Rodar migrations

```bash
npm run migration:run
```

### 4. Rodar seed

```bash
npm run seed
```

### 5. Encerrar ambiente

```bash
docker compose down
```

Para remover também o volume do banco:

```bash
docker compose down -v
```

## Migrations

Scripts disponíveis:

```bash
npm run migration:create --name=CreateSomething
npm run migration:generate --name=CreateSomething
npm run migration:run
npm run migration:revert
```

Observações:

- a CLI usa o arquivo [data-source.ts](c:/Users/andre/Desktop/Desafio/brain-agriculture-tech-test/data-source.ts)
- `migration:generate` depende das entidades refletirem corretamente o estado desejado do banco

## Seed

Script:

- [scripts/seed.ts](c:/Users/andre/Desktop/Desafio/brain-agriculture-tech-test/scripts/seed.ts)

Objetivo:

- popular o banco com dados coerentes para testes manuais
- alimentar o dashboard com estados, culturas e uso do solo variados

O seed atual:

- remove os dados de domínio antes de inserir novos registros
- pode ser executado repetidamente em desenvolvimento
- cria:
  - 3 produtores
  - 4 fazendas
  - 5 safras
  - 5 culturas
  - 7 associações safra-cultura

Execução:

```bash
npm run seed
```

## Execução de Testes

Executar toda a suíte:

```bash
npm run test
```

Executar em modo serial:

```bash
npm run test -- --runInBand
```

Os testes cobrem prioritariamente:

- validador de CPF/CNPJ
- regra de soma das áreas
- services principais
- endpoints críticos em e2e leve
- agregação do dashboard

## Swagger

Com a aplicação em execução:

```text
http://localhost:3000/docs
```

O Swagger documenta:

- endpoints de produtores
- fazendas
- safras
- culturas
- dashboard
- health, liveness e readiness

## Endpoints Principais

### Producers

- `POST /api/v1/producers`
- `GET /api/v1/producers`
- `GET /api/v1/producers/:id`
- `PATCH /api/v1/producers/:id`
- `DELETE /api/v1/producers/:id`

Exemplo:

```http
POST /api/v1/producers
Content-Type: application/json

{
  "document": "529.982.247-25",
  "name": "Maria da Silva"
}
```

### Farms

- `POST /api/v1/farms`
- `GET /api/v1/farms`
- `GET /api/v1/farms/:id`
- `PATCH /api/v1/farms/:id`
- `DELETE /api/v1/farms/:id`

Exemplo:

```http
POST /api/v1/farms
Content-Type: application/json

{
  "producerId": "4d8b92d1-42a2-48a4-92f0-c20985060f54",
  "name": "Fazenda Primavera",
  "city": "Sorriso",
  "state": "MT",
  "totalArea": 1000.5,
  "arableArea": 700.25,
  "vegetationArea": 300.25
}
```

### Harvests

- `POST /api/v1/harvests`
- `GET /api/v1/harvests`
- `GET /api/v1/harvests/:id`
- `PATCH /api/v1/harvests/:id`
- `DELETE /api/v1/harvests/:id`
- `POST /api/v1/harvests/:id/crops`
- `DELETE /api/v1/harvests/:id/crops/:cropId`

### Crops

- `POST /api/v1/crops`
- `GET /api/v1/crops`

### Dashboard

- `GET /api/v1/dashboard`

## Dashboard

O dashboard foi construído para servir frontend ou ferramenta gráfica com payload simples e agregações feitas no banco via QueryBuilder.

Retorna:

- total de fazendas
- total de hectares registrados
- distribuição por estado
- distribuição por cultura
- distribuição por uso do solo

Exemplo:

```json
{
  "totals": {
    "farms": 10,
    "totalHectares": 12345
  },
  "byState": [
    { "state": "MG", "count": 4 },
    { "state": "SP", "count": 6 }
  ],
  "byCrop": [
    { "crop": "Soja", "count": 7 },
    { "crop": "Milho", "count": 3 }
  ],
  "landUse": {
    "arableArea": 8000,
    "vegetationArea": 4345
  }
}
```

## Deploy

O projeto está preparado para deploy em ambientes containerizados com alguns pontos já endereçados:

- Dockerfile para desenvolvimento
- `docker-compose.yml` com API e PostgreSQL
- configuração via variáveis de ambiente
- migrations controlando schema
- readiness/liveness
- logging estruturado em formato simples

Para produção, a recomendação é:

1. gerar imagem com build de produção
2. injetar variáveis de ambiente por secret manager ou plataforma
3. executar migrations no pipeline ou job de release
4. expor `/api/v1/health/live` e `/api/v1/health/ready` para orquestrador
5. integrar logs com uma plataforma centralizada

## Possíveis Melhorias Futuras

- separar módulos de domínio em bounded contexts mais explícitos
- adicionar autenticação e autorização
- adicionar paginação padronizada reutilizável
- criar testes e2e com banco real em ambiente isolado
- adicionar métricas Prometheus ou OpenTelemetry
- incluir rate limiting e proteção de segurança HTTP
- adicionar documentação de versionamento e changelog
- evoluir seed para cenários mais amplos
- incluir CI com lint, build, test e migration check
- criar imagem Docker otimizada para produção com multi-stage build

## Scripts Úteis

```bash
npm run start:dev
npm run build
npm run start:prod
npm run lint
npm run test
npm run migration:run
npm run seed
```
