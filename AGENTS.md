# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains a learning roadmap in `enterprise-identity-authorization-lab.md` and a root `package.json`. Application code, tests, and assets have not been added yet.

## Build, Test, and Development Commands

The manifest declares pnpm 10.30.3, but it currently contains invalid JSON (`"type": "module";`) and has no build or start script. Fix the separator before using package-manager commands. The only declared command, `pnpm test`, is a placeholder that exits with an error; it does not run tests. Add runnable `dev`, `build`, and `test` scripts alongside the first application milestone, and document any required PostgreSQL or other local services.

## Coding Style & Naming Conventions

Use TypeScript for new Node.js modules, consistent with the roadmap. Prefer two-space indentation, semicolons, and descriptive names: `camelCase` for values and functions, `PascalCase` for types and React components, and `kebab-case` for file names. Keep authentication, authorization, and resource logic in distinct modules. No formatter or linter is configured yet; add configuration before enforcing a style through CI.

## Testing Guidelines

No test framework or coverage threshold is configured. When implementation starts, use the roadmap's suggested Vitest or Jest with Supertest for API tests. Name test files `*.test.ts` and place cross-module scenarios under `tests/integration/` or `tests/security/`. Cover successful flows and denial cases such as invalid credentials, expired sessions, missing permissions, and cross-tenant access. Replace the placeholder `pnpm test` script when the first tests land.

## Commit & Pull Request Guidelines

No usable Git history is available here, so there is no established commit-message convention. Use concise, imperative subjects such as `Add password login endpoint`, with one roadmap milestone or focused change per commit. Pull requests should state the milestone, summarize behavior and security implications, list commands run, and link relevant issues. Include screenshots for UI changes and describe any new configuration or migration steps.

## Security & Configuration

Keep secrets and real credentials out of the repository. Provide example environment variables without values, hash passwords, and document token or session handling decisions near the implementation. Treat tenant isolation and denied access as required checks for authorization changes.
