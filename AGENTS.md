# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/` organized by NestJS modules (`auth/`, `products/`, `categories/`, `cart/`, `orders/`), shared utilities in `src/common/`, MongoDB models in `src/schemas/`, app entry in `src/main.ts` and root wiring in `src/app.module.ts`.
- Tests: unit specs alongside code as `*.spec.ts`; e2e specs in `test/` as `*.e2e-spec.ts`.
- Build output: `dist/`. Runtime uploads (images) in `uploads/` (git-ignored).
- Docs: `README.md`, `API_DOCUMENTATION.md`, Postman collection `postman_collection.json`.

## Build, Test, and Development Commands

- `npm run dev`: Start with hot-reload for local development.
- `npm run start`: Start once (no watch).
- `npm run build`: Compile TypeScript to `dist/`.
- `npm run start:prod`: Run compiled app (`node dist/main`).
- `npm run test` | `test:watch`: Run unit tests (Jest).
- `npm run test:e2e`: Run e2e tests using `test/jest-e2e.json`.
- `npm run test:cov`: Generate coverage report in `coverage/`.
- `npm run lint` | `npm run format`: Lint/auto-format the codebase.

## Coding Style & Naming Conventions

- Language: TypeScript, NestJS patterns (Controller/Service/Module).
- Formatting: Prettier (2 spaces, single quotes, trailing commas). Run `npm run format`.
- Linting: ESLint with `typescript-eslint` + Prettier integration. Run `npm run lint` (fixes when safe).
- Filenames: kebab-case; DTOs end with `.dto.ts`, modules `.module.ts`, services `.service.ts`, controllers `.controller.ts`, schemas `.schema.ts`.
- Code style: Classes/DTOs in PascalCase, variables/functions in camelCase. Validate inputs with `class-validator` in DTOs.

## Testing Guidelines

- Framework: Jest (`ts-jest`), Supertest for e2e.
- Conventions: unit tests `*.spec.ts` colocated; e2e tests `*.e2e-spec.ts` in `test/`.
- Coverage: no strict threshold enforced; keep meaningful coverage for core flows (auth, products, orders). Use `npm run test:cov`.

## Commit & Pull Request Guidelines

- Commits: Use clear, imperative subjects (≤72 chars). Optional conventional prefix helps (e.g., `feat(auth): add refresh token`). Include rationale in body when needed.
- Branches: short, descriptive names (e.g., `feat/products-filtering`).
- PRs: include summary, linked issues, testing steps (curl/Postman examples), screenshots or JSON snippets if API responses change, and notes on breaking changes. Update `API_DOCUMENTATION.md` and `postman_collection.json` when endpoints or payloads change.
- Quality gates: CI green locally — run `npm run lint`, `npm test`, and `npm run test:e2e` before requesting review.

## Security & Configuration Tips

- Configure `.env` (not committed): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `UPLOAD_PATH`. Use a strong `JWT_SECRET`.
- Do not store secrets or uploads in VCS. Ensure `uploads/` exists locally and in deployments, with proper permissions.

