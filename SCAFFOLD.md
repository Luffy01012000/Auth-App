# Production Express.js + TypeScript Architecture Scaffold Blueprint

> **LLM Prompt Instruction**:
> You are an expert backend engineer. When instructed to generate, scaffold, or recreate this Express.js backend project, produce the exact directory structure, configuration files, and complete source code files defined below. Do not omit any files, skip implementations, or replace code blocks with comments like `// implement here`. Follow all architectural principles, conventions, and file names verbatim.

---

## 1. Architectural & Technical Requirements

- **Runtime & Language**: Node.js (>=22/25), TypeScript (ESM `"type": "module"`, `"moduleResolution": "NodeNext"`).
- **Package Manager**: `pnpm` (>=10.x.x) with strict dependency build approvals (`onlyBuiltDependencies`).
- **Design Philosophy**:
  - **Clean Layered Architecture**: Presentation (`controllers`, `routes`, `dto`) -> Application (`services`, `interfaces`) -> Infrastructure (`repositories`, `indicators`, `logger`).
  - **SOLID Principles**: Single Responsibility (SRP), Open/Closed (OCP via Strategy Pattern), Liskov Substitution (LSP via `AppError`), Interface Segregation (ISP), and Dependency Inversion (DIP via Constructor Injection).
  - **Composition Root**: Central dependency wiring in `src/container.ts` with zero reflection/decorator overhead.
  - **File Naming Pattern**: Strictly `kebab-case` (`kebab-case.ts`, `kebab-case.entity.ts`, `kebab-case.service.ts`).
- **High-Speed Tooling**:
  - **Linter & Formatter**: `@biomejs/biome` (Rust-based, runs in ~40ms, enforces `useFilenamingConvention: kebab-case`).
  - **Build Tool**: `tsup` (esbuild-based, sub-100ms bundling).
  - **Type Checking**: Decoupled from build using `tsc --noEmit --incremental` with `.cache/.tsbuildinfo`.
  - **Test Runner**: `vitest` + `supertest` (native ESM execution).
  - **Logging**: `winston` (structured JSON in prod, colorized in dev) + `morgan` (HTTP request stream).
  - **Git Hooks**: `husky` + `commitlint` (Conventional Commits) + `lint-staged`.

---

## 2. Complete Project File Tree

```text
.
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── biome.json
├── commitlint.config.js
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── container.ts
│   ├── config/
│   │   └── env.ts
│   ├── core/
│   │   ├── errors/
│   │   │   ├── app-error.ts
│   │   │   └── error-codes.ts
│   │   ├── http/
│   │   │   └── api-response.ts
│   │   └── logger/
│   │       ├── logger.interface.ts
│   │       └── winston-logger.ts
│   ├── middlewares/
│   │   ├── error-handler.ts
│   │   ├── not-found.ts
│   │   ├── request-logger.ts
│   │   └── validate.ts
│   ├── modules/
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   ├── health.interface.ts
│   │   │   ├── health.routes.ts
│   │   │   ├── health.service.ts
│   │   │   └── indicators/
│   │   │       ├── memory.indicator.ts
│   │   │       └── uptime.indicator.ts
│   │   └── user/
│   │       ├── dto/
│   │       │   └── user.dto.ts
│   │       ├── user.controller.ts
│   │       ├── user.entity.ts
│   │       ├── user.repository.interface.ts
│   │       ├── user.repository.memory.ts
│   │       ├── user.routes.ts
│   │       ├── user.service.interface.ts
│   │       └── user.service.ts
│   └── routes/
│       └── index.ts
└── tests/
    ├── unit/
    │   ├── env.test.ts
    │   ├── health.service.test.ts
    │   └── user.service.test.ts
    └── integration/
        ├── error-handler.test.ts
        ├── health.test.ts
        └── user.test.ts
```

---

## 3. Project Configuration Files

### `package.json`
```json
{
  "name": "express-ts-boilerplate",
  "version": "1.0.0",
  "description": "High-performance Express.js boilerplate with TypeScript, Biome, Vitest, and ultra-fast CI",
  "type": "module",
  "main": "dist/server.js",
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
  },
  "keywords": [
    "express",
    "typescript",
    "biome",
    "vitest",
    "pnpm",
    "solid",
    "lld"
  ],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.30.3",
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^18.0.10",
    "express": "^5.3.0",
    "express-rate-limit": "^8.7.4",
    "helmet": "^8.3.0",
    "morgan": "^1.12.1",
    "winston": "^3.19.0",
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.6.6",
    "@commitlint/cli": "^21.2.4",
    "@commitlint/config-conventional": "^21.2.4",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/morgan": "^1.9.10",
    "@types/node": "^26.6.6",
    "@types/supertest": "^7.2.1",
    "husky": "^9.1.7",
    "lint-staged": "^17.6.0",
    "supertest": "^7.3.2",
    "tsup": "^9.0.0",
    "tsx": "^4.23.15",
    "typescript": "^7.0.2",
    "vitest": "^5.1.0"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "@biomejs/biome",
      "esbuild"
    ]
  },
  "lint-staged": {
    "*.{ts,js,json}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  }
}
```

### `tsconfig.json`
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

### `biome.json`
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

### `tsup.config.ts`
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

### `vitest.config.ts`
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

### `commitlint.config.js`
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

### `.husky/pre-commit`
```bash
pnpm lint-staged
pnpm typecheck
```

### `.husky/commit-msg`
```bash
pnpm exec commitlint --edit "$1"
```

### `.env.example`
```env
# Application Environment
NODE_ENV=development
PORT=3000

# Security & CORS
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

### `.gitignore`
```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build & Compilation Output
dist/
build/

# Cache directories
.cache/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.*.local
!.env.example

# Testing & Coverage
coverage/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# System & IDE
.DS_Store
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### `.github/workflows/ci.yml`
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
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Biome Check
        run: pnpm lint

  typecheck:
    name: Type Check (TypeScript Incremental)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Restore TypeScript Incremental Cache
        uses: actions/cache@v4
        with:
          path: .cache/.tsbuildinfo
          key: ${{ runner.os }}-tsbuildinfo-${{ hashFiles('pnpm-lock.yaml', 'tsconfig.json') }}-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-tsbuildinfo-${{ hashFiles('pnpm-lock.yaml', 'tsconfig.json') }}-
            ${{ runner.os }}-tsbuildinfo-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Type Check
        run: pnpm typecheck

  test:
    name: Tests (Vitest)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Unit & Integration Tests
        run: pnpm test

  build:
    name: Build (tsup / esbuild)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Production Bundle
        run: pnpm build
```

---

## 4. Source Code (`src/`)

### `src/config/env.ts`
```typescript
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default("*"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env: Env = parsed.data;
```

### `src/core/errors/error-codes.ts`
```typescript
export const ErrorCode = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];
```

### `src/core/errors/app-error.ts`
```typescript
import { ErrorCode, type ErrorCodeType } from "./error-codes.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCodeType;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    errorCode: ErrorCodeType = ErrorCode.INTERNAL_SERVER_ERROR,
    details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, ErrorCode.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, 401, ErrorCode.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, 403, ErrorCode.FORBIDDEN, details);
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

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, ErrorCode.VALIDATION_ERROR, details);
  }
}
```

### `src/core/http/api-response.ts`
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

export function createSuccessResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown,
  stack?: string,
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      ...(stack ? { stack } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}
```

### `src/core/logger/logger.interface.ts`
```typescript
export interface ILogger {
  debug(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
}
```

### `src/core/logger/winston-logger.ts`
```typescript
import winston from "winston";
import { env } from "../../config/env.js";
import type { ILogger } from "./logger.interface.js";

const { combine, timestamp, json, colorize, printf } = winston.format;

export class WinstonLogger implements ILogger {
  private readonly logger: winston.Logger;

  constructor() {
    const isProd = env.NODE_ENV === "production";

    const format = isProd
      ? combine(timestamp(), json())
      : combine(
          colorize(),
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
            return `[${timestamp}] [${level}]: ${message}${metaStr}`;
          }),
        );

    this.logger = winston.createLogger({
      level: env.LOG_LEVEL,
      format,
      transports: [new winston.transports.Console()],
      exitOnError: false,
    });
  }

  public debug(message: string, meta?: unknown): void {
    this.logger.debug(message, meta ? { meta } : undefined);
  }

  public info(message: string, meta?: unknown): void {
    this.logger.info(message, meta ? { meta } : undefined);
  }

  public warn(message: string, meta?: unknown): void {
    this.logger.warn(message, meta ? { meta } : undefined);
  }

  public error(message: string, meta?: unknown): void {
    this.logger.error(message, meta ? { meta } : undefined);
  }
}
```

### `src/middlewares/validate.ts`
```typescript
import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { ValidationError } from "../core/errors/app-error.js";

export interface RequestValidators {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export function validate(schemas: RequestValidators) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as Request["params"];
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as Request["query"];
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        next(new ValidationError("Request validation failed", issues));
      } else {
        next(error);
      }
    }
  };
}
```

### `src/middlewares/request-logger.ts`
```typescript
import type { RequestHandler } from "express";
import morgan from "morgan";
import { env } from "../config/env.js";
import type { ILogger } from "../core/logger/logger.interface.js";

export function createRequestLogger(logger: ILogger): RequestHandler {
  const format = env.NODE_ENV === "production" ? "combined" : "dev";

  return morgan(format, {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
    skip: () => env.NODE_ENV === "test",
  });
}
```

### `src/middlewares/not-found.ts`
```typescript
import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../core/errors/app-error.js";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}
```

### `src/middlewares/error-handler.ts`
```typescript
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../core/errors/app-error.js";
import { ErrorCode } from "../core/errors/error-codes.js";
import { createErrorResponse } from "../core/http/api-response.js";
import type { ILogger } from "../core/logger/logger.interface.js";

export function createErrorHandler(logger: ILogger) {
  return (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    if (err instanceof AppError) {
      if (!err.isOperational) {
        logger.error("Non-operational AppError:", { message: err.message, stack: err.stack });
      }

      res
        .status(err.statusCode)
        .json(createErrorResponse(err.errorCode, err.message, err.details));
      return;
    }

    if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
      res
        .status(400)
        .json(createErrorResponse(ErrorCode.BAD_REQUEST, "Invalid JSON payload in request body"));
      return;
    }

    const errorObj = err instanceof Error ? err : new Error(String(err));
    logger.error("Unhandled Internal Server Error:", {
      message: errorObj.message,
      stack: errorObj.stack,
    });

    const isProd = env.NODE_ENV === "production";
    res.status(500).json(
      createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        isProd ? "Internal server error" : errorObj.message || "Unknown error",
        undefined,
        !isProd ? errorObj.stack : undefined,
      ),
    );
  };
}
```

### `src/modules/health/health.interface.ts`
```typescript
export interface HealthIndicatorResult {
  status: "up" | "down";
  details?: Record<string, unknown>;
}

export interface IHealthIndicator {
  readonly name: string;
  check(): Promise<HealthIndicatorResult>;
}

export interface HealthReport {
  status: "ok" | "degraded" | "down";
  timestamp: string;
  checks: Record<string, HealthIndicatorResult>;
}

export interface IHealthService {
  getReport(): Promise<HealthReport>;
  isAlive(): Promise<boolean>;
  isReady(): Promise<boolean>;
}
```

### `src/modules/health/indicators/memory.indicator.ts`
```typescript
import type { HealthIndicatorResult, IHealthIndicator } from "../health.interface.js";

export class MemoryHealthIndicator implements IHealthIndicator {
  public readonly name = "memory";

  public async check(): Promise<HealthIndicatorResult> {
    const memory = process.memoryUsage();
    const maxHeapBytes = 1.5 * 1024 * 1024 * 1024;
    const isHealthy = memory.heapUsed < maxHeapBytes;

    return {
      status: isHealthy ? "up" : "down",
      details: {
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
      },
    };
  }
}
```

### `src/modules/health/indicators/uptime.indicator.ts`
```typescript
import type { HealthIndicatorResult, IHealthIndicator } from "../health.interface.js";

export class UptimeHealthIndicator implements IHealthIndicator {
  public readonly name = "uptime";

  public async check(): Promise<HealthIndicatorResult> {
    const uptimeSeconds = process.uptime();

    return {
      status: "up",
      details: {
        uptimeSeconds: Math.floor(uptimeSeconds),
        uptimeFormatted: `${Math.floor(uptimeSeconds / 60)}m ${Math.floor(uptimeSeconds % 60)}s`,
      },
    };
  }
}
```

### `src/modules/health/health.service.ts`
```typescript
import type {
  HealthReport,
  IHealthIndicator,
  IHealthService,
} from "./health.interface.js";

export class HealthService implements IHealthService {
  constructor(private readonly indicators: IHealthIndicator[]) {}

  public async getReport(): Promise<HealthReport> {
    const checks: HealthReport["checks"] = {};
    let overallStatus: HealthReport["status"] = "ok";

    for (const indicator of this.indicators) {
      try {
        const result = await indicator.check();
        checks[indicator.name] = result;
        if (result.status === "down") {
          overallStatus = "degraded";
        }
      } catch (error) {
        checks[indicator.name] = {
          status: "down",
          details: { error: error instanceof Error ? error.message : "Indicator check failed" },
        };
        overallStatus = "degraded";
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  public async isAlive(): Promise<boolean> {
    return true;
  }

  public async isReady(): Promise<boolean> {
    const report = await this.getReport();
    return report.status !== "down";
  }
}
```

### `src/modules/health/health.controller.ts`
```typescript
import type { Request, Response } from "express";
import { createSuccessResponse } from "../../core/http/api-response.js";
import type { IHealthService } from "./health.interface.js";

export class HealthController {
  constructor(private readonly healthService: IHealthService) {}

  public check = async (_req: Request, res: Response): Promise<void> => {
    const report = await this.healthService.getReport();
    const httpStatus = report.status === "down" ? 503 : 200;
    res.status(httpStatus).json(createSuccessResponse(report));
  };

  public live = async (_req: Request, res: Response): Promise<void> => {
    const alive = await this.healthService.isAlive();
    res.status(alive ? 200 : 503).json(createSuccessResponse({ status: "alive" }));
  };

  public ready = async (_req: Request, res: Response): Promise<void> => {
    const ready = await this.healthService.isReady();
    res.status(ready ? 200 : 503).json(createSuccessResponse({ status: "ready" }));
  };
}
```

### `src/modules/health/health.routes.ts`
```typescript
import { Router } from "express";
import type { HealthController } from "./health.controller.js";

export function createHealthRouter(controller: HealthController): Router {
  const router = Router();

  router.get("/", controller.check);
  router.get("/live", controller.live);
  router.get("/ready", controller.ready);

  return router;
}
```

### `src/modules/user/user.entity.ts`
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### `src/modules/user/dto/user.dto.ts`
```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address format"),
  name: z.string().min(2, "Name must be at least 2 characters long").max(100),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const userIdParamSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type UserIdParamDto = z.infer<typeof userIdParamSchema>;
```

### `src/modules/user/user.repository.interface.ts`
```typescript
import type { User } from "./user.entity.js";

export interface IUserRepository {
  create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
```

### `src/modules/user/user.repository.memory.ts`
```typescript
import { randomUUID } from "node:crypto";
import type { User } from "./user.entity.js";
import type { IUserRepository } from "./user.repository.interface.js";

export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  public async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const now = new Date();
    const user: User = {
      id: randomUUID(),
      email: userData.email.toLowerCase(),
      name: userData.name,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const targetEmail = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === targetEmail) {
        return user;
      }
    }
    return null;
  }

  public async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
```

### `src/modules/user/user.service.interface.ts`
```typescript
import type { CreateUserDto } from "./dto/user.dto.js";
import type { User } from "./user.entity.js";

export interface IUserService {
  createUser(dto: CreateUserDto): Promise<User>;
  getUserById(id: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
}
```

### `src/modules/user/user.service.ts`
```typescript
import { ConflictError, NotFoundError } from "../../core/errors/app-error.js";
import type { CreateUserDto } from "./dto/user.dto.js";
import type { User } from "./user.entity.js";
import type { IUserRepository } from "./user.repository.interface.js";
import type { IUserService } from "./user.service.interface.js";

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

  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id '${id}' not found`);
    }

    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
```

### `src/modules/user/user.controller.ts`
```typescript
import type { Request, Response } from "express";
import { createSuccessResponse } from "../../core/http/api-response.js";
import type { CreateUserDto, UserIdParamDto } from "./dto/user.dto.js";
import type { IUserService } from "./user.service.interface.js";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateUserDto;
    const user = await this.userService.createUser(dto);
    res.status(201).json(createSuccessResponse(user));
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as unknown as UserIdParamDto;
    const user = await this.userService.getUserById(id);
    res.status(200).json(createSuccessResponse(user));
  };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAllUsers();
    res.status(200).json(createSuccessResponse(users));
  };
}
```

### `src/modules/user/user.routes.ts`
```typescript
import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { createUserSchema, userIdParamSchema } from "./dto/user.dto.js";
import type { UserController } from "./user.controller.js";

export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.post("/", validate({ body: createUserSchema }), controller.create);
  router.get("/", controller.getAll);
  router.get("/:id", validate({ params: userIdParamSchema }), controller.getById);

  return router;
}
```

### `src/routes/index.ts`
```typescript
import { Router } from "express";
import type { Container } from "../container.js";
import { createHealthRouter } from "../modules/health/health.routes.js";
import { createUserRouter } from "../modules/user/user.routes.js";

export function createApiRouter(container: Container): Router {
  const apiRouter = Router();

  const healthRouter = createHealthRouter(container.healthController);
  const userRouter = createUserRouter(container.userController);

  // Version 1 routes (/api/v1/*)
  const v1Router = Router();
  v1Router.use("/health", healthRouter);
  v1Router.use("/users", userRouter);

  apiRouter.use("/v1", v1Router);

  return apiRouter;
}
```

### `src/container.ts`
```typescript
import type { ILogger } from "./core/logger/logger.interface.js";
import { WinstonLogger } from "./core/logger/winston-logger.js";
import { HealthController } from "./modules/health/health.controller.js";
import type { IHealthIndicator, IHealthService } from "./modules/health/health.interface.js";
import { HealthService } from "./modules/health/health.service.js";
import { MemoryHealthIndicator } from "./modules/health/indicators/memory.indicator.js";
import { UptimeHealthIndicator } from "./modules/health/indicators/uptime.indicator.js";
import { UserController } from "./modules/user/user.controller.js";
import type { IUserRepository } from "./modules/user/user.repository.interface.js";
import { InMemoryUserRepository } from "./modules/user/user.repository.memory.js";
import { UserService } from "./modules/user/user.service.js";
import type { IUserService } from "./modules/user/user.service.interface.js";

export interface Container {
  logger: ILogger;
  healthService: IHealthService;
  healthController: HealthController;
  userRepository: IUserRepository;
  userService: IUserService;
  userController: UserController;
}

export function createContainer(): Container {
  // 1. Core infrastructure
  const logger: ILogger = new WinstonLogger();

  // 2. Health module (Strategy Pattern)
  const healthIndicators: IHealthIndicator[] = [
    new MemoryHealthIndicator(),
    new UptimeHealthIndicator(),
  ];
  const healthService: IHealthService = new HealthService(healthIndicators);
  const healthController = new HealthController(healthService);

  // 3. User domain module (Layered Architecture & DIP)
  const userRepository: IUserRepository = new InMemoryUserRepository();
  const userService: IUserService = new UserService(userRepository);
  const userController = new UserController(userService);

  return {
    logger,
    healthService,
    healthController,
    userRepository,
    userService,
    userController,
  };
}
```

### `src/app.ts`
```typescript
import cors from "cors";
import express, { type Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { type Container, createContainer } from "./container.js";
import { createErrorHandler } from "./middlewares/error-handler.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { createRequestLogger } from "./middlewares/request-logger.js";
import { createHealthRouter } from "./modules/health/health.routes.js";
import { createApiRouter } from "./routes/index.js";

export function createApp(container: Container = createContainer()): Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(","),
      credentials: true,
    }),
  );

  // Rate limiting (skipped in test environment)
  if (env.NODE_ENV !== "test") {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per IP per window
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please try again later",
        },
      },
    });
    app.use("/api", limiter);
  }

  // Request body parsing
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Request logging (skipped in test environment)
  if (env.NODE_ENV !== "test") {
    app.use(createRequestLogger(container.logger));
  }

  // Top-level health endpoints for cluster probes (e.g. Kubernetes, AWS ECS)
  app.use("/health", createHealthRouter(container.healthController));

  // Versioned API routes
  app.use("/api", createApiRouter(container));

  // 404 handler
  app.use(notFoundHandler);

  // Centralized RFC-compliant error handler
  app.use(createErrorHandler(container.logger));

  return app;
}

export const app = createApp();
```

### `src/server.ts`
```typescript
import type { Server } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { WinstonLogger } from "./core/logger/winston-logger.js";

const logger = new WinstonLogger();

const server: Server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  logger.info(`Health check available at http://localhost:${env.PORT}/health`);
  logger.info(`API routes available at http://localhost:${env.PORT}/api`);
});

const SHUTDOWN_TIMEOUT_MS = 10000;

function handleShutdown(signal: string) {
  logger.info(`${signal} signal received: closing HTTP server gracefully...`);

  const forceExitTimeout = setTimeout(() => {
    logger.error("Forceful shutdown: connection draining timed out after 10s");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceExitTimeout.unref();

  server.close((err) => {
    clearTimeout(forceExitTimeout);
    if (err) {
      logger.error("Error during server shutdown:", { error: err });
      process.exit(1);
    }
    logger.info("HTTP server closed. Exiting process.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection detected:", { reason });
  process.exit(1);
});
```

---

## 5. Test Suites (`tests/`)

### `tests/unit/env.test.ts`
```typescript
import { describe, expect, it } from "vitest";
import { env } from "../../src/config/env.js";

describe("Environment Configuration", () => {
  it("should have loaded valid environment variables", () => {
    expect(env).toBeDefined();
    expect(typeof env.PORT).toBe("number");
    expect(["development", "test", "production"]).toContain(env.NODE_ENV);
    expect(typeof env.CORS_ORIGIN).toBe("string");
  });
});
```

### `tests/unit/health.service.test.ts`
```typescript
import { describe, expect, it } from "vitest";
import type {
  HealthIndicatorResult,
  IHealthIndicator,
} from "../../src/modules/health/health.interface.js";
import { HealthService } from "../../src/modules/health/health.service.js";

class MockIndicator implements IHealthIndicator {
  constructor(
    public readonly name: string,
    private readonly shouldPass: boolean,
  ) {}

  public async check(): Promise<HealthIndicatorResult> {
    if (!this.shouldPass) {
      return { status: "down", details: { reason: "Database unreachable" } };
    }
    return { status: "up", details: { latencyMs: 5 } };
  }
}

describe("HealthService (Strategy Pattern / OCP Unit Tests)", () => {
  it("should report status 'ok' when all strategies report up", async () => {
    const indicators: IHealthIndicator[] = [
      new MockIndicator("db", true),
      new MockIndicator("redis", true),
    ];
    const service = new HealthService(indicators);

    const report = await service.getReport();

    expect(report.status).toBe("ok");
    expect(report.checks.db?.status).toBe("up");
    expect(report.checks.redis?.status).toBe("up");
  });

  it("should report status 'degraded' if any strategy reports down", async () => {
    const indicators: IHealthIndicator[] = [
      new MockIndicator("db", true),
      new MockIndicator("redis", false),
    ];
    const service = new HealthService(indicators);

    const report = await service.getReport();

    expect(report.status).toBe("degraded");
    expect(report.checks.redis?.status).toBe("down");
  });

  it("should handle unexpected errors in indicators gracefully", async () => {
    const crashingIndicator: IHealthIndicator = {
      name: "crash-service",
      async check() {
        throw new Error("Connection failed abruptly");
      },
    };

    const service = new HealthService([crashingIndicator]);
    const report = await service.getReport();

    expect(report.status).toBe("degraded");
    expect(report.checks["crash-service"]?.status).toBe("down");
  });
});
```

### `tests/unit/user.service.test.ts`
```typescript
import { describe, expect, it } from "vitest";
import { ConflictError, NotFoundError } from "../../src/core/errors/app-error.js";
import type { User } from "../../src/modules/user/user.entity.js";
import type { IUserRepository } from "../../src/modules/user/user.repository.interface.js";
import { UserService } from "../../src/modules/user/user.service.js";

class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  public async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      id: "mock-id-123",
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  public async findAll(): Promise<User[]> {
    return [...this.users];
  }
}

describe("UserService (SOLID / DIP Unit Tests)", () => {
  it("should successfully create a new user when email is unique", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    const created = await service.createUser({
      email: "test@example.com",
      name: "Test User",
    });

    expect(created.id).toBe("mock-id-123");
    expect(created.email).toBe("test@example.com");
    expect(created.name).toBe("Test User");
  });

  it("should throw ConflictError when attempting to register an existing email", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    await service.createUser({ email: "duplicate@example.com", name: "User 1" });

    await expect(
      service.createUser({ email: "duplicate@example.com", name: "User 2" }),
    ).rejects.toThrow(ConflictError);
  });

  it("should throw NotFoundError when user does not exist", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    await expect(service.getUserById("non-existent-id")).rejects.toThrow(NotFoundError);
  });

  it("should retrieve all users", async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);

    await service.createUser({ email: "user1@example.com", name: "User 1" });
    await service.createUser({ email: "user2@example.com", name: "User 2" });

    const users = await service.getAllUsers();
    expect(users).toHaveLength(2);
  });
});
```

### `tests/integration/health.test.ts`
```typescript
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";

describe("Health Endpoints (Integration)", () => {
  const app = createApp();

  it("GET /health should return 200 and system health report", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.checks.memory).toBeDefined();
    expect(response.body.data.checks.uptime).toBeDefined();
  });

  it("GET /health/live should return 200 alive status", async () => {
    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("alive");
  });

  it("GET /health/ready should return 200 ready status", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ready");
  });
});
```

### `tests/integration/user.test.ts`
```typescript
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";

describe("User API Endpoints (Integration)", () => {
  const app = createApp();

  it("POST /api/v1/users should create a user and return 201", async () => {
    const payload = {
      email: "alice@example.com",
      name: "Alice Smith",
    };

    const response = await request(app).post("/api/v1/users").send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("alice@example.com");
    expect(response.body.data.name).toBe("Alice Smith");
    expect(response.body.data.id).toBeDefined();
  });

  it("POST /api/v1/users should fail with 400 when payload is invalid", async () => {
    const payload = {
      email: "not-an-email",
      name: "A", // too short (min 2)
    };

    const response = await request(app).post("/api/v1/users").send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toBeDefined();
  });

  it("POST /api/v1/users should return 409 when email already exists", async () => {
    const payload = {
      email: "duplicate@example.com",
      name: "Duplicate User",
    };

    await request(app).post("/api/v1/users").send(payload);
    const conflictResponse = await request(app).post("/api/v1/users").send(payload);

    expect(conflictResponse.status).toBe(409);
    expect(conflictResponse.body.success).toBe(false);
    expect(conflictResponse.body.error.code).toBe("CONFLICT");
  });

  it("GET /api/v1/users should return all users", async () => {
    const response = await request(app).get("/api/v1/users");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("GET /api/v1/users/:id should return 404 for unknown user", async () => {
    const response = await request(app).get("/api/v1/users/non-existent-id");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
```

### `tests/integration/error-handler.test.ts`
```typescript
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";

describe("Error Handler Middleware (Integration)", () => {
  const app = createApp();

  it("should return 404 with structured error for undefined route", async () => {
    const response = await request(app).get("/api/v1/unknown-endpoint");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
    expect(response.body.error.message).toContain("Route GET /api/v1/unknown-endpoint not found");
  });

  it("should return 400 for malformed JSON body", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .set("Content-Type", "application/json")
      .send("{ invalid-json-payload ");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });
});
```

---

## 6. Execution & Verification Steps

To bring up and verify this project after creating the files:

```bash
# 1. Install dependencies
pnpm install

# 2. Make Git hooks executable
chmod +x .husky/pre-commit .husky/commit-msg

# 3. Create local environment file
cp .env.example .env

# 4. Verify code format and linting (under 50ms)
pnpm lint

# 5. Verify type safety with incremental cache (< 1s)
pnpm typecheck

# 6. Run all unit and integration tests (19 tests)
pnpm test

# 7. Compile high-speed production bundle (~100ms)
pnpm build

# 8. Start development server with live watch
pnpm dev
```
