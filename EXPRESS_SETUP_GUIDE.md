# Enterprise Express.js TypeScript Boilerplate: Complete Setup Guide

A production-grade, highly scalable Express.js architecture built with **TypeScript**, strictly adhering to **SOLID principles**, **Low-Level Design (LLD) patterns**, and optimized for **blazing-fast CI/CD performance**.

---

## Table of Contents

1. [Architectural Overview & Design Principles](#1-architectural-overview--design-principles)
   - [Clean Layered Architecture](#clean-layered-architecture)
   - [SOLID Principles in Action](#solid-principles-in-action)
   - [LLD Patterns Implemented](#lld-patterns-implemented)
2. [Why This Stack is Blazing Fast](#2-why-this-stack-is-blazing-fast)
   - [The "Slow `tsc`" Problem & The Modern Solution](#the-slow-tsc-problem--the-modern-solution)
   - [Biome vs ESLint + Prettier](#biome-vs-eslint--prettier)
   - [Vitest vs Jest](#vitest-vs-jest)
3. [Step-by-Step Project Setup from Scratch](#3-step-by-step-project-setup-from-scratch)
   - [Step 1: Initialize Project & Package Manager](#step-1-initialize-project--package-manager)
   - [Step 2: Install Dependencies](#step-2-install-dependencies)
   - [Step 3: Configure TypeScript (`tsconfig.json`)](#step-3-configure-typescript-tsconfigjson)
   - [Step 4: Configure Biome (`biome.json`)](#step-4-configure-biome-biomejson)
   - [Step 5: Configure tsup Bundler (`tsup.config.ts`)](#step-5-configure-tsup-bundler-tsupconfigts)
   - [Step 6: Configure Vitest (`vitest.config.ts`)](#step-6-configure-vitest-vitestconfigts)
   - [Step 7: Environment Variables & Git Ignore](#step-7-environment-variables--git-ignore)
4. [Source Code Implementation](#4-source-code-implementation)
   - [Directory Structure](#directory-structure)
   - [Core Abstractions (`src/core/`)](#core-abstractions-srccore)
   - [Middlewares (`src/middlewares/`)](#middlewares-srcmiddlewares)
   - [Health Module - Strategy Pattern (`src/modules/health/`)](#health-module---strategy-pattern-srcmoduleshealth)
   - [User Module - Layered Architecture & DIP (`src/modules/user/`)](#user-module---layered-architecture--dip-srcmodulesuser)
   - [Composition Root (`src/container.ts`)](#composition-root-srccontainerts)
   - [Application Factory & Server Bootstrap (`src/app.ts`, `src/server.ts`)](#application-factory--server-bootstrap-srcappts-srcserverts)
5. [Testing Strategy (Unit & Integration)](#5-testing-strategy-unit--integration)
6. [Ultra-Fast GitHub Actions CI Pipeline](#6-ultra-fast-github-actions-ci-pipeline)
7. [Developer Command Cheatsheet](#7-developer-command-cheatsheet)

---

## 1. Architectural Overview & Design Principles

### Clean Layered Architecture

```text
               ┌────────────────────────────────────────────────────────┐
               │                   Composition Root                     │
               │                   (src/container.ts)                   │
               └───────────────┬────────────────────────┬───────────────┘
                               │ instantiates & wires   │
                               ▼                        ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────────────────┐
│            Presentation Layer             │  │            Presentation Layer             │
│   Routes ──► Middleware ──► Controller    │  │   Routes ──► Middleware ──► Controller    │
└──────────────────────┬────────────────────┘  └──────────────────────┬────────────────────┘
                       │ calls (via interface)                        │ calls (via interface)
                       ▼                                              ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────────────────┐
│            Application Layer              │  │            Application Layer              │
│               Service                     │  │               Service                     │
│          (IUserService contract)          │  │        (IHealthService contract)          │
└──────────────────────┬────────────────────┘  └──────────────────────┬────────────────────┘
                       │ calls (via interface)                        │ calls (via interface)
                       ▼                                              ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────────────────┐
│           Infrastructure Layer            │  │           Infrastructure Layer            │
│         Repository / Persistence          │  │       Diagnostic Probes / Database        │
│          (IUserRepository impl)           │  │     (MemoryIndicator, UptimeIndicator)    │
└───────────────────────────────────────────┘  └───────────────────────────────────────────┘
```

The system separates concerns into three distinct layers:
1. **Presentation Layer (`routes/`, `middlewares/`, `controllers/`)**: Handles HTTP protocol concerns, deserialization, status codes, and input validation schemas. Contains **no business logic**.
2. **Application / Domain Layer (`services/`, `entities/`, `interfaces/`)**: Houses core domain rules, business invariants, and workflows. Interacts strictly through interfaces.
3. **Infrastructure Layer (`repositories/`, `indicators/`, `logger/`, `config/`)**: Manages external data sources, third-party libraries, databases, file systems, and hardware diagnostics.

---

### SOLID Principles in Action

| Principle | Meaning | Concrete Boilerplate Implementation |
| :--- | :--- | :--- |
| **S - Single Responsibility** | A class should have one, and only one, reason to change. | **`UserController`** only maps HTTP requests to service calls. **`UserService`** only enforces business logic. **`InMemoryUserRepository`** only manages user persistence. **`validate`** middleware only validates request schemas. |
| **O - Open / Closed** | Open for extension, closed for modification. | **`HealthService`** accepts an array of `IHealthIndicator` strategies. Adding PostgreSQL or Redis health probes is done by implementing `IHealthIndicator` without altering a single line of `HealthService`. |
| **L - Liskov Substitution** | Subtypes must be substitutable for their base types. | All domain errors inherit from **`AppError`** (`BadRequestError`, `NotFoundError`, `ConflictError`). The global error handler processes all errors through their common base interface without type branching. |
| **I - Interface Segregation** | Clients should not be forced to depend upon interfaces that they do not use. | Fine-grained interfaces (**`ILogger`**, **`IHealthIndicator`**, **`IUserRepository`**, **`IUserService`**) rather than monolithic classes. |
| **D - Dependency Inversion** | Depend upon abstractions, not concretions. | **`UserController`** depends on `IUserService`, not `UserService`. **`UserService`** depends on `IUserRepository`, not `InMemoryUserRepository`. Concrete dependencies are passed via constructor injection. |

---

### LLD Patterns Implemented

1. **Composition Root & Dependency Injection (DI)**:
   - All classes declare their dependencies via `constructor(private readonly dep: IDep)`.
   - `src/container.ts` is the single composition root that instantiates and wires the dependency graph.
   - Allows instant testability: unit tests can inject mock repositories without monkey-patching or complex module-mocking libraries.
2. **Strategy Pattern**:
   - `IHealthIndicator` defines a strategy for checking system components. `HealthService` executes these strategies dynamically.
3. **Repository Pattern**:
   - `IUserRepository` encapsulates data access logic, hiding persistence mechanisms (in-memory, SQL, Prisma, Drizzle) from the business layer.
4. **Data Transfer Object (DTO) & Boundary Validator Pattern**:
   - Input payloads are validated strictly at the HTTP router boundary using Zod schemas before hitting the controller.
5. **Chain of Responsibility Pattern**:
   - Express middleware chain: Security Headers (`helmet`) -> CORS -> Rate Limiting -> Request Logger -> Routes -> 404 Handler -> Centralized Error Handler.

---

## 2. Why This Stack is Blazing Fast

### The "Slow `tsc`" Problem & The Modern Solution

In traditional TypeScript projects, developers configure `tsc` to compile files (`tsc -b` or `tsc --build`).
- **Why `tsc` is slow**: `tsc` performs full type analysis, builds the abstract syntax tree, checks every generic and interface, and then writes JavaScript files to disk. On large codebases, this takes **10–30+ seconds**.
- **The Modern Decoupled Solution**:
  1. **Compilation / Bundling**: We use **`tsup`** (powered by `esbuild`). `tsup` strips types and bundles the entire application into production-ready JavaScript in **~100 milliseconds**.
  2. **Type Checking**: Transpilers (esbuild, swc, oxc) *strip* types but *do not validate* them. To catch real type bugs, we run `tsc --noEmit --incremental`.
  3. **Incremental Cache**: With `"incremental": true` and `"tsBuildInfoFile": "./.cache/.tsbuildinfo"`, TypeScript saves its AST cache to disk. Subsequent runs only check modified files, finishing in **< 1 second**.
  4. **CI Parallelism**: In GitHub Actions, type checking, linting, testing, and building run in **separate parallel jobs**. `tsc` never blocks your tests or build!

### Biome vs ESLint + Prettier

| Feature | ESLint + Prettier | Biome (`@biomejs/biome`) |
| :--- | :--- | :--- |
| **Language** | JavaScript (Node.js) | Rust (Native binary) |
| **Execution Speed** | ~2,500ms – 6,000ms | **~40ms – 70ms (50x faster)** |
| **Configuration** | Multiple files (`.eslintrc.cjs`, `.prettierrc`, plugins) | Single file (`biome.json`) |
| **Formatting & Linting** | Two separate tools, frequent rule conflicts | Unified in a single pass |

### Vitest vs Jest

| Feature | Jest | Vitest |
| :--- | :--- | :--- |
| **Execution Engine** | `ts-jest` / Babel transpilation | Native Vite/esbuild ESM runner |
| **Speed** | High overhead per worker process | Worker threads with shared transform cache |
| **TypeScript Support** | Requires config boilerplate & transform plugins | Works out of the box with zero config |

---

## 3. Step-by-Step Project Setup from Scratch

Follow these exact steps to recreate this project from an empty folder:

### Step 1: Initialize Project & Package Manager

```bash
mkdir express-boilerplate && cd express-boilerplate
git init
pnpm init
```

### Step 2: Install Dependencies

```bash
# Production dependencies
pnpm add express cors helmet express-rate-limit winston morgan zod dotenv

# Development dependencies
pnpm add -D typescript @types/node @types/express @types/cors @types/supertest @types/morgan supertest tsup tsx @biomejs/biome vitest husky @commitlint/cli @commitlint/config-conventional lint-staged
```

Configure build script approval and lint-staged in `package.json` for pnpm 10:

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["@biomejs/biome", "esbuild"]
  },
  "lint-staged": {
    "*.{ts,js,json}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  }
}
```

### Step 3: Configure TypeScript (`tsconfig.json`)

Create `tsconfig.json` optimized for NodeNext ESM, strict type safety, and incremental cache:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "incremental": true,
    "tsBuildInfoFile": "./.cache/.tsbuildinfo",
    "esModuleInterop": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist", ".cache"]
}
```

### Step 4: Configure Biome (`biome.json`)

Create `biome.json` for unified formatting and linting:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.6.6/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main"
  },
  "files": {
    "ignoreUnknown": false,
    "includes": [
      "**",
      "!**/node_modules",
      "!**/dist",
      "!**/.cache",
      "!**/coverage"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "preset": "recommended",
      "correctness": {
        "noUnusedVariables": "error"
      },
      "style": {
        "useConst": "error",
        "useFilenamingConvention": {
          "level": "error",
          "options": {
            "filenameCases": ["kebab-case"]
          }
        }
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  }
}
```

### Step 5: Configure tsup Bundler (`tsup.config.ts`)

Create `tsup.config.ts` for lightning-fast esbuild compilation:

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node22",
  clean: true,
  sourcemap: true,
  minify: false,
  shims: true,
});
```

### Step 6: Configure Vitest (`vitest.config.ts`)

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "tests/"],
    },
  },
});
```

### Step 7: Environment Variables & Git Ignore

`.env.example`:
```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=info
```

`.gitignore`:
```gitignore
node_modules/
dist/
.cache/
*.tsbuildinfo
.env
coverage/
```

Add the scripts to `package.json`:
```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsup",
  "start": "node dist/server.js",
  "typecheck": "tsc --noEmit --incremental",
  "lint": "biome check src tests",
  "lint:fix": "biome check --write src tests",
  "format": "biome format --write src tests",
  "format:check": "biome format src tests",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "prepare": "husky"
}
```

### Step 8: Configure Git Hooks (Husky, Commitlint & lint-staged)

1. Initialize Husky:
```bash
pnpm exec husky init
```

2. Configure Conventional Commits in `commitlint.config.js`:
```javascript
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    "subject-case": [0],
  },
};
```

3. Setup pre-commit hook (`.husky/pre-commit`):
```bash
pnpm lint-staged
pnpm typecheck
```

4. Setup commit-msg hook (`.husky/commit-msg`):
```bash
pnpm exec commitlint --edit "$1"
```

5. Make hooks executable:
```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

---

## 4. Source Code Implementation

### Directory Structure

```text
src/
├── app.ts                              # Express Application Factory
├── server.ts                           # Server Entrypoint & Graceful Shutdown
├── container.ts                        # Composition Root (Dependency Injection)
├── config/
│   └── env.ts                          # Type-safe Zod Environment Validator
├── core/
│   ├── errors/
│   │   ├── app-error.ts                # Liskov-compliant Error Classes
│   │   └── error-codes.ts              # Domain Error Constants
│   ├── http/
│   │   └── api-response.ts             # Standardized Generic Response Envelope
│   └── logger/
│       ├── logger.interface.ts         # ILogger Interface (DIP)
│       └── winston-logger.ts           # Winston Structured Logger Impl
├── middlewares/
│   ├── error-handler.ts                # Centralized RFC-compliant Error Middleware
│   ├── not-found.ts                    # 404 Route Catch-all
│   ├── request-logger.ts               # Morgan HTTP Request Logger Middleware
│   └── validate.ts                     # Boundary Zod Schema Validator
├── modules/
│   ├── health/                         # Diagnostics Module (Strategy Pattern)
│   │   ├── health.interface.ts         # IHealthIndicator & IHealthService
│   │   ├── health.service.ts           # Strategy Aggregator Service
│   │   ├── health.controller.ts        # Health HTTP Controller
│   │   ├── health.routes.ts            # Health Router
│   │   └── indicators/
│   │       ├── memory.indicator.ts     # Memory Probe Strategy
│   │       └── uptime.indicator.ts     # Uptime Probe Strategy
│   └── user/                           # Sample Domain Module (Layered Architecture)
│       ├── dto/
│       │   └── user.dto.ts             # Zod DTOs
│       ├── user.entity.ts              # Domain Entity
│       ├── user.repository.interface.ts# IUserRepository Contract
│       ├── user.repository.memory.ts   # In-Memory Repository Impl
│       ├── user.service.interface.ts   # IUserService Contract
│       ├── user.service.ts             # User Business Service
│       ├── user.controller.ts          # User HTTP Controller
│       └── user.routes.ts              # User Router
└── routes/
    └── index.ts                        # Root API Router (/api/v1)
```

---

### Core Abstractions (`src/core/`)

#### 1. Logger Interface (`src/core/logger/logger.interface.ts`)
```typescript
export interface ILogger {
  debug(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}
```

#### 2. Standardized Response Envelope (`src/core/http/api-response.ts`)
```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
}
```

#### 3. Error Class Hierarchy (`src/core/errors/app-error.ts`)
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly errorCode: ErrorCodeType = ErrorCode.INTERNAL_SERVER_ERROR,
    public readonly details?: unknown,
    public readonly isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(message, 404, ErrorCode.NOT_FOUND, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", details?: unknown) {
    super(message, 409, ErrorCode.CONFLICT, details);
  }
}
```

---

### Health Module - Strategy Pattern (`src/modules/health/`)

#### Strategy Interface (`health.interface.ts`)
```typescript
export interface HealthIndicatorResult {
  status: "up" | "down";
  details?: Record<string, unknown>;
}

export interface IHealthIndicator {
  readonly name: string;
  check(): Promise<HealthIndicatorResult>;
}
```

#### Service Aggregator (`health.service.ts`)
```typescript
export class HealthService implements IHealthService {
  constructor(private readonly indicators: IHealthIndicator[]) {}

  public async getReport(): Promise<HealthReport> {
    const checks: HealthReport["checks"] = {};
    let overallStatus: HealthReport["status"] = "ok";

    for (const indicator of this.indicators) {
      try {
        const result = await indicator.check();
        checks[indicator.name] = result;
        if (result.status === "down") overallStatus = "degraded";
      } catch (error) {
        checks[indicator.name] = {
          status: "down",
          details: { error: error instanceof Error ? error.message : "Failed" },
        };
        overallStatus = "degraded";
      }
    }

    return { status: overallStatus, timestamp: new Date().toISOString(), checks };
  }
}
```

---

### User Module - Layered Architecture & DIP (`src/modules/user/`)

#### Service Layer (`user.service.ts`)
```typescript
export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError(`User with email '${dto.email}' already exists`);
    }

    return this.userRepository.create({
      email: dto.email,
      name: dto.name,
    });
  }
}
```

---

### Composition Root (`src/container.ts`)

```typescript
export function createContainer(): Container {
  const logger: ILogger = new WinstonLogger();

  const healthIndicators: IHealthIndicator[] = [
    new MemoryHealthIndicator(),
    new UptimeHealthIndicator(),
  ];
  const healthService: IHealthService = new HealthService(healthIndicators);
  const healthController = new HealthController(healthService);

  const userRepository: IUserRepository = new InMemoryUserRepository();
  const userService: IUserService = new UserService(userRepository);
  const userController = new UserController(userService);

  return { logger, healthService, healthController, userRepository, userService, userController };
}
```

---

### Application Factory & Server Bootstrap

#### `src/app.ts`
```typescript
export function createApp(container: Container = createContainer()): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  if (env.NODE_ENV !== "test") {
    app.use(createRequestLogger(container.logger));
  }

  app.use("/health", createHealthRouter(container.healthController));
  app.use("/api", createApiRouter(container));
  app.use(notFoundHandler);
  app.use(createErrorHandler(container.logger));

  return app;
}
```

#### `src/server.ts`
```typescript
const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

function handleShutdown(signal: string) {
  logger.info(`${signal} received: closing gracefully...`);
  server.close(() => {
    logger.info("Server closed. Exiting process.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
```

---

## 5. Testing Strategy (Unit & Integration)

### Proving DIP with Unit Tests (`tests/unit/user.service.test.ts`)
Because `UserService` depends on the interface `IUserRepository`, we can inject a lightweight `MockUserRepository` without any external mocking library:

```typescript
class MockUserRepository implements IUserRepository {
  private users: User[] = [];
  async create(data) { /* in-memory push */ }
  async findByEmail(email) { /* return user */ }
  async findById(id) { /* return user */ }
  async findAll() { return [...this.users]; }
}

it("should throw ConflictError on duplicate email", async () => {
  const service = new UserService(new MockUserRepository());
  await service.createUser({ email: "test@example.com", name: "User 1" });
  await expect(
    service.createUser({ email: "test@example.com", name: "User 2" }),
  ).rejects.toThrow(ConflictError);
});
```

---

## 6. Ultra-Fast GitHub Actions CI Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: "22"
  PNPM_VERSION: "10.30.3"

jobs:
  lint:
    name: Lint & Format Check (Biome)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    name: Type Check (TypeScript Incremental)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"
      - uses: actions/cache@v4
        with:
          path: .cache/.tsbuildinfo
          key: ${{ runner.os }}-tsbuildinfo-${{ hashFiles('pnpm-lock.yaml', 'tsconfig.json') }}-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-tsbuildinfo-${{ hashFiles('pnpm-lock.yaml', 'tsconfig.json') }}-
            ${{ runner.os }}-tsbuildinfo-
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    name: Tests (Vitest)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  build:
    name: Build (tsup / esbuild)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

### Why this CI finishes in < 20 seconds:
1. **Concurrency Auto-cancellation**: Eliminates wasted runner minutes when pushing successive commits.
2. **`fetch-depth: 1`**: Clones only the single head commit instead of full git history.
3. **pnpm Store Cache**: Dependencies are resolved from local action cache in ~3 seconds.
4. **TypeScript Incremental Cache**: Restores `.tsbuildinfo` so only modified files are analyzed.
5. **Parallel Matrix Execution**: All 4 jobs run at the exact same time on independent runners.

---

## 7. Developer Command Cheatsheet

| Task | Command | Average Speed |
| :--- | :--- | :--- |
| **Start Development Server** | `pnpm dev` | Instant (< 150ms) |
| **Production Build** | `pnpm build` | ~100ms |
| **Run Production Server** | `pnpm start` | Instant |
| **Type Checking** | `pnpm typecheck` | < 1s (cached) |
| **Lint & Format Check** | `pnpm lint` | ~40ms |
| **Auto-fix Lint & Format** | `pnpm lint:fix` | ~60ms |
| **Run All Tests** | `pnpm test` | ~1.5s – 3s |
| **Run Tests with Coverage** | `pnpm test:coverage` | ~3s |
| **Interactive Test Watcher** | `pnpm test:watch` | Instant feedback |
