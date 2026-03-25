# Guia Local de Testes no Swagger

Este arquivo serve como referência prática para testar manualmente a API no Swagger, validar relacionamentos entre tabelas, demonstrar regras de negócio e estruturar uma boa apresentação técnica do projeto.

## Objetivo deste guia

Com este roteiro você consegue:

- subir a aplicação localmente com Docker
- acessar o Swagger
- criar registros na ordem correta
- relacionar produtores, fazendas, safras e culturas
- testar regras de negócio válidas e inválidas
- validar o dashboard
- apresentar a solução de forma organizada para um avaliador técnico

---

## 1. Como subir o projeto localmente

### Opção recomendada: Docker

1. Garanta que existe um arquivo `.env` na raiz.

Se ainda não existir:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Suba a stack:

```bash
npm run docker:up
```

3. Rode as migrations dentro do container da app:

```bash
npm run migration:run:docker
```

4. Popule a base com dados de exemplo:

```bash
npm run seed:docker
```

5. Acompanhe os logs se quiser:

```bash
npm run docker:logs
```

### URLs locais

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Health: `http://localhost:3000/api/v1/health`
- Liveness: `http://localhost:3000/api/v1/health/live`
- Readiness: `http://localhost:3000/api/v1/health/ready`

---

## 2. Como a API está estruturada

### Módulos principais

- `producers`: gestão de produtores
- `farms`: gestão de propriedades rurais
- `harvests`: gestão de safras
- `crops`: gestão de culturas
- `dashboard`: visão executiva agregada
- `health`: health, liveness e readiness

### Relacionamentos

- `Producer` 1:N `Farm`
- `Farm` 1:N `Harvest`
- `Harvest` N:N `Crop` via `HarvestCrop`

### Regras de negócio centrais

- produtor deve ter CPF ou CNPJ válido
- documento do produtor é único
- fazenda deve ter produtor existente
- `arableArea + vegetationArea <= totalArea`
- cultura não pode repetir na mesma safra
- nome da cultura deve ser único

---

## 3. Ordem ideal para testar no Swagger

Se você quiser testar tudo manualmente sem depender apenas do seed, siga esta ordem:

1. `POST /api/v1/producers`
2. `POST /api/v1/farms`
3. `POST /api/v1/crops`
4. `POST /api/v1/harvests`
5. `POST /api/v1/harvests/:id/crops`
6. `GET /api/v1/harvests/:id`
7. `GET /api/v1/farms/:id`
8. `GET /api/v1/dashboard`

---

## 4. Teste completo no Swagger do zero

## 4.1 Criar produtor

### Endpoint

`POST /api/v1/producers`

### Payload válido

```json
{
  "document": "529.982.247-25",
  "name": "Maria da Silva"
}
```

### Resultado esperado

- status `201`
- retorno com `id`
- `document` normalizado só com números

### Exemplo de response

```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "document": "52998224725",
  "name": "Maria da Silva",
  "createdAt": "2026-03-14T18:45:00.000Z",
  "updatedAt": "2026-03-14T18:45:00.000Z"
}
```

Guarde o `id` retornado. Você vai usar como `producerId`.

---

## 4.2 Testar erro de CPF/CNPJ inválido

### Endpoint

`POST /api/v1/producers`

### Payload inválido

```json
{
  "document": "111.111.111-11",
  "name": "Produtor Inválido"
}
```

### Resultado esperado

- status `400`
- mensagem indicando CPF/CNPJ inválido

### Exemplo esperado

```json
{
  "statusCode": 400,
  "message": "Producer document must be a valid CPF or CNPJ",
  "error": "BadRequestException",
  "timestamp": "2026-03-14T20:00:00.000Z",
  "path": "/api/v1/producers"
}
```

---

## 4.3 Testar erro de documento duplicado

Tente criar o mesmo produtor novamente:

```json
{
  "document": "529.982.247-25",
  "name": "Maria da Silva"
}
```

### Resultado esperado

- status `409`
- mensagem de documento duplicado

---

## 4.4 Criar fazenda

### Endpoint

`POST /api/v1/farms`

### Payload válido

Substitua `producerId` pelo id real do produtor criado:

```json
{
  "producerId": "11111111-1111-1111-1111-111111111111",
  "name": "Fazenda Primavera",
  "city": "Sorriso",
  "state": "mt",
  "totalArea": 1000.5,
  "arableArea": 700.25,
  "vegetationArea": 300.25
}
```

### O que validar

- `state` volta como `MT`
- áreas retornam como número
- status `201`

Guarde o `id` retornado. Você vai usar como `farmId`.

---

## 4.5 Testar erro de produtor inexistente

### Endpoint

`POST /api/v1/farms`

### Payload inválido

```json
{
  "producerId": "00000000-0000-0000-0000-000000000000",
  "name": "Fazenda Sem Produtor",
  "city": "Goiânia",
  "state": "GO",
  "totalArea": 500,
  "arableArea": 300,
  "vegetationArea": 200
}
```

### Resultado esperado

- status `404`
- mensagem: `Producer not found`

---

## 4.6 Testar regra da soma das áreas

### Endpoint

`POST /api/v1/farms`

### Payload inválido

```json
{
  "producerId": "11111111-1111-1111-1111-111111111111",
  "name": "Fazenda Inconsistente",
  "city": "Rio Verde",
  "state": "GO",
  "totalArea": 1000,
  "arableArea": 800,
  "vegetationArea": 300
}
```

### O que está errado

```text
800 + 300 = 1100 > 1000
```

### Resultado esperado

- status `400`
- mensagem:

```text
The sum of arableArea and vegetationArea cannot exceed totalArea
```

---

## 4.7 Criar cultura

### Endpoint

`POST /api/v1/crops`

### Payload válido

```json
{
  "name": "Soja"
}
```

Crie também outras culturas:

```json
{
  "name": "Milho"
}
```

```json
{
  "name": "Algodao"
}
```

Guarde os ids retornados.

---

## 4.8 Testar erro de cultura duplicada

### Endpoint

`POST /api/v1/crops`

### Payload

```json
{
  "name": "soja"
}
```

### Resultado esperado

- status `409`
- a API trata o nome de forma case-insensitive no fluxo de negócio

---

## 4.9 Criar safra

### Endpoint

`POST /api/v1/harvests`

### Payload válido

Substitua `farmId` pelo id da fazenda criada:

```json
{
  "farmId": "22222222-2222-2222-2222-222222222222",
  "name": "Safra 2024/2025",
  "year": 2024
}
```

Guarde o `id` retornado.

---

## 4.10 Testar erro de fazenda inexistente na safra

### Endpoint

`POST /api/v1/harvests`

### Payload inválido

```json
{
  "farmId": "00000000-0000-0000-0000-000000000000",
  "name": "Safra Inválida",
  "year": 2024
}
```

### Resultado esperado

- status `404`
- mensagem: `Farm not found`

---

## 4.11 Associar culturas à safra

### Endpoint

`POST /api/v1/harvests/:id/crops`

Substitua `:id` pelo id da safra.

### Payload

```json
{
  "cropId": "33333333-3333-3333-3333-333333333333"
}
```

Repita para associar outra cultura à mesma safra.

### Resultado esperado

- a resposta já volta com a safra e a lista de culturas relacionadas

---

## 4.12 Testar erro de associação duplicada

Tente associar a mesma cultura novamente na mesma safra:

```json
{
  "cropId": "33333333-3333-3333-3333-333333333333"
}
```

### Resultado esperado

- status `409`
- mensagem:

```text
Crop is already associated with this harvest
```

---

## 4.13 Consultar safra com culturas

### Endpoint

`GET /api/v1/harvests/:id`

### O que validar

- dados básicos da safra
- resumo da fazenda
- lista de culturas associadas

---

## 4.14 Consultar fazenda com safras e culturas

### Endpoint

`GET /api/v1/farms/:id`

### O que validar

- dados da fazenda
- resumo do produtor
- lista de safras
- dentro de cada safra, lista de culturas

Esse endpoint é bom para demonstrar claramente os relacionamentos.

---

## 4.15 Consultar dashboard

### Endpoint

`GET /api/v1/dashboard`

### O que validar

- total de fazendas
- total de hectares
- distribuição por estado
- distribuição por cultura
- uso do solo

### Exemplo

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

---

## 5. Como testar usando o seed

Se você já rodou:

```bash
npm run seed:docker
```

então você pode ir direto para:

- `GET /api/v1/producers`
- `GET /api/v1/farms`
- `GET /api/v1/harvests`
- `GET /api/v1/crops`
- `GET /api/v1/dashboard`

Isso é útil para demonstração rápida.

---

## 6. Melhor roteiro para apresentação

Se você for explicar o projeto para alguém, uma ordem boa é:

### Etapa 1. Mostrar a arquitetura

Explique:

- API em NestJS
- organização modular
- controllers finos
- regras no service
- acesso a banco encapsulado em repository
- TypeORM com PostgreSQL e migrations

### Etapa 2. Mostrar o domínio

Explique:

- produtor possui fazendas
- fazenda possui safras
- safra possui culturas via associação N:N
- dashboard é derivado dessas entidades

### Etapa 3. Mostrar regras de negócio

Demonstre no Swagger:

1. CPF/CNPJ válido
2. CPF/CNPJ inválido
3. soma de áreas válida
4. soma de áreas inválida
5. cultura duplicada na mesma safra

### Etapa 4. Mostrar relacionamentos

No Swagger:

1. cria produtor
2. cria fazenda vinculada
3. cria safra vinculada
4. cria cultura
5. associa cultura na safra
6. busca fazenda por id
7. busca safra por id

### Etapa 5. Mostrar dashboard

Explique que:

- o dashboard usa agregação no banco
- não depende de processamento pesado em memória
- o payload já está pronto para frontend ou gráficos

### Etapa 6. Mostrar observabilidade

Explique:

- logs de request com método, rota, status e duração
- liveness e readiness
- Swagger documentado

---

## 7. Como explicar a configuração do projeto

Se perguntarem “como está configurado?”, você pode responder assim:

### Aplicação

- NestJS com TypeScript
- versionamento por URI em `/api/v1`
- `ValidationPipe` global
- filtro global de exceção
- interceptor global de logging
- Swagger em `/docs`

### Banco

- PostgreSQL
- TypeORM
- `synchronize=false`
- migrations controlam schema
- seed para desenvolvimento

### Docker

- `docker-compose` sobe API e banco
- app usa `Dockerfile.dev` com hot reload
- produção usa `Dockerfile` multi-stage

### TypeORM

- runtime do Nest usa `autoLoadEntities`
- CLI de migration usa `data-source.ts`
- `data-source.ts` exporta apenas uma instância de `DataSource`

---

## 8. Cenários prontos para falar na avaliação

### Cenário 1. Regra de documento

“No produtor, eu normalizei o documento e validei CPF/CNPJ antes de persistir. Além disso, há unicidade no banco e tratamento de conflito na aplicação.”

### Cenário 2. Regra de área

“Na fazenda, a soma da área agricultável com vegetação não pode exceder a área total. Essa regra está no service e também protegida no banco por check constraint.”

### Cenário 3. Relação safra e cultura

“Eu modelei a relação entre safra e cultura com uma entidade explícita `HarvestCrop`, o que deixa a estrutura mais clara e evita duplicidade por safra.”

### Cenário 4. Dashboard

“O dashboard usa QueryBuilder com agregações no banco para total de fazendas, hectares, distribuição por estado, cultura e uso do solo.”

### Cenário 5. Operação e deploy

“A API pode rodar localmente com Docker, já possui health, readiness, logs e está preparada para deploy simples em Render.”

---

## 9. Endpoints úteis para demonstração rápida

### Health

- `GET /api/v1/health`
- `GET /api/v1/health/live`
- `GET /api/v1/health/ready`

### Producers

- `POST /api/v1/producers`
- `GET /api/v1/producers`

### Farms

- `POST /api/v1/farms`
- `GET /api/v1/farms`
- `GET /api/v1/farms/:id`

### Crops

- `POST /api/v1/crops`
- `GET /api/v1/crops`

### Harvests

- `POST /api/v1/harvests`
- `POST /api/v1/harvests/:id/crops`
- `GET /api/v1/harvests/:id`

### Dashboard

- `GET /api/v1/dashboard`

---

## 10. Comandos úteis durante os testes

Subir stack:

```bash
npm run docker:up
```

Ver logs:

```bash
npm run docker:logs
```

Rodar migrations:

```bash
npm run migration:run:docker
```

Rodar seed:

```bash
npm run seed:docker
```

Parar stack:

```bash
npm run docker:down
```

Parar e remover volumes:

```bash
npm run docker:down:volumes
```

---

## 11. Sugestão de roteiro curto de 5 minutos

1. Mostrar Swagger
2. Mostrar health
3. Mostrar produtor válido
4. Mostrar produtor inválido
5. Mostrar fazenda válida
6. Mostrar fazenda inválida pela soma das áreas
7. Mostrar criação de cultura
8. Mostrar criação de safra
9. Mostrar associação de cultura na safra
10. Mostrar `GET /farms/:id`
11. Mostrar `GET /dashboard`

---

## 12. Observação prática

Se você quiser usar esse arquivo só como referência local, pode adicionar no `.gitignore`:

```gitignore
LOCAL_SWAGGER_TESTING_GUIDE.md
```

