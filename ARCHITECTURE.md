# Architecture Roadmap

## Current direction

The codebase now follows a layered module structure oriented to DDD boundaries:

- `presentation`: HTTP controllers and DTOs
- `application`: use cases, contracts, and orchestration
- `domain`: business rules that do not depend on Nest or TypeORM
- `infrastructure`: TypeORM adapters, database concerns, and external integrations

Current module shape:

- `src/modules/<context>/presentation/http/...`
- `src/modules/<context>/application/...`
- `src/modules/<context>/domain/...`
- `src/modules/<context>/infrastructure/...`

## Dependency rule

Allowed dependency flow:

`presentation -> application -> domain`

`infrastructure -> application | domain`

Domain code must not import NestJS, TypeORM, or transport-specific DTOs.

## Step-by-step evolution

1. Structural decoupling
   - Repository contracts exposed by the application layer
   - TypeORM implementations bound through dependency injection
   - Absolute imports via `@/...`

2. Domain hardening
   - Move cross-entity rules to domain services and value objects
   - Introduce explicit domain models where TypeORM entities are still leaking
   - Remove remaining application dependence on HTTP DTO shapes

3. Event readiness
   - Publish application events from use cases
   - Add event handlers in infrastructure
   - Introduce queue/broker only when async workloads justify it

4. Microservice extraction
   - Keep each module boundary self-contained
   - Replace infrastructure adapters without changing application contracts

## Notes

- REST remains the current integration style.
- Event-driven processing is intentionally deferred until there is a real async use case.
- The repository contracts make later migration to message consumers or separate services much simpler.
