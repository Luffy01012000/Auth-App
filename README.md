<div align="center">

# ⚡️ Production Express.js + TypeScript Boilerplate

**Enterprise-grade, high-performance Express 5 boilerplate built with SOLID principles, Low-Level Design (LLD) patterns, and blazing-fast developer tooling.**

[![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/owner/repo/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22%20%7C%2025-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Biome](https://img.shields.io/badge/Linter_%26_Formatter-Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![CodeRabbit](https://img.shields.io/badge/AI_Reviews-CodeRabbit-FF5C5C?logo=probot&logoColor=white)](https://coderabbit.ai/)
[![Dependabot](https://img.shields.io/badge/Dependabot-Monthly-02569B?logo=dependabot&logoColor=white)](https://github.com/dependabot)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## 📖 Overview

This repository provides an architecturally clean, production-ready starting point for building backend microservices and enterprise applications in **Express.js** and **TypeScript**.

Rather than relying on ad-hoc controller scripts or heavyweight decorator frameworks, this project demonstrates how to build modular, maintainable, and testable Node.js services using **standard TypeScript, constructor-based Dependency Injection, and modern high-speed tooling**.

---

## ⚡️ Why This Boilerplate?

| Dimension | Traditional Express Setup | This Boilerplate | Benefit |
| :--- | :--- | :--- | :--- |
| **Linting & Formatting** | ESLint + Prettier (~3,500ms) | **Biome v2** (~40ms) | **50x to 80x faster** in dev and CI |
| **Transpilation / Build** | `tsc` compile (~12,000ms) | **tsup / esbuild** (~100ms) | Sub-second production bundles |
| **Type Checking** | Tied to build, single-threaded | **`tsc --noEmit --incremental`** | Incremental AST cache via `.tsbuildinfo` |
| **Testing** | Jest + ts-jest (~15,000ms) | **Vitest** (~3,000ms) | Native ESM execution with worker threads |
| **CI Wall-Clock Time** | 2 to 4 minutes (sequential) | **< 20 seconds** (parallel jobs) | Parallel runners + pnpm store cache hit |
| **Architecture** | Spaghetti controllers & fat models | **Clean Layered + SOLID + LLD** | Modular, testable, enterprise-ready |

---

## 🏛️ Architectural Design (SOLID & LLD)

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
│                 Service                   │  │                 Service                   │
│          (IUserService contract)          │  │        (IHealthService contract)          │
└──────────────────────┬────────────────────┘  └──────────────────────┬────────────────────┘
                       │ calls (via interface)                        │ calls (via interface)
                       ▼                                              ▼
┌───────────────────────────────────────────┐  ┌───────────────────────────────────────────┐
│           Infrastructure Layer            │  │           Infrastructure Layer            │
│         Repository / Persistence          │  │       Diagnostic Probes / External        │
│          (IUserRepository impl)           │  │     (MemoryIndicator, UptimeIndicator)    │
└───────────────────────────────────────────┘  └───────────────────────────────────────────┘
```

### SOLID Principles Applied

- **Single Responsibility Principle (SRP)**: Controllers parse HTTP inputs and format responses; Services enforce domain rules and business invariants; Repositories handle data persistence.
- **Open/Closed Principle (OCP)**: Health checks and diagnostics use the **Strategy Pattern** (`IHealthIndicator`). New diagnostics (PostgreSQL, Redis, RabbitMQ) are added by implementing the interface without modifying existing service code.
- **Liskov Substitution Principle (LSP)**: Domain errors extend `AppError` (`BadRequestError`, `NotFoundError`, `ConflictError`). The global error handler processes all errors polymorphically.
- **Interface Segregation Principle (ISP)**: Minimal, focused contracts (`ILogger`, `IHealthIndicator`, `IUserRepository`, `IUserService`).
- **Dependency Inversion Principle (DIP)**: High-level modules depend exclusively on interfaces. Dependencies are injected via constructors and assembled in [`src/container.ts`](src/container.ts).
- **Naming Convention**: Strictly enforced `kebab-case` for all files via Biome rules.

---

## 🛡️ Production Features & Security

- **Web Framework**: **Express 5** with native async error handling (no unhandled promise rejections).
- **Security Headers**: **Helmet** configured with sensible defaults.
- **CORS Protection**: Environment-configurable origin whitelist.
- **Rate Limiting**: `express-rate-limit` protecting API routes against brute-force and DDoS attacks.
- **Input Validation**: Strict request validation using **Zod** schemas executed at the HTTP router boundary.
- **Observability**:
  - **Winston**: Structured logger outputting formatted colorized logs in development and machine-readable JSON in production.
  - **Morgan**: HTTP request logging streaming directly into Winston.
- **Graceful Shutdown**: Intercepts `SIGTERM` and `SIGINT`, stops accepting new connections, drains in-flight requests with a 10s timeout, and terminates cleanly.

---

## 🤖 GitHub Bots & CI/CD Automation

This repository includes turnkey automation for enterprise development teams:

1. **CodeRabbit AI Reviewer ([`.coderabbit.yaml`](.coderabbit.yaml))**:
   - Automated code review on pull requests.
   - Custom prompt rules verifying SOLID principles, constructor dependency injection, Zod validation, and `kebab-case` file naming.
2. **Dependabot ([`.github/dependabot.yml`](.github/dependabot.yml))**:
   - Automated **monthly** dependency audits for both `pnpm` packages and GitHub Actions workflows.
   - Automatically groups minor and patch updates to eliminate pull-request clutter.
3. **Semantic PR Title Linter ([`.github/workflows/pr-title.yml`](.github/workflows/pr-title.yml))**:
   - Enforces Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) on all PR titles using `amannn/action-semantic-pull-request`.
4. **Dependency Vulnerability & License Review ([`.github/workflows/dependency-review.yml`](.github/workflows/dependency-review.yml))**:
   - Automated vulnerability scanning on pull requests targeting `main`.
5. **Ultra-Fast Parallel CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))**:
   - Concurrency auto-cancellation for superseded commits.
   - `pnpm` store cache + TypeScript `.tsbuildinfo` cache.
   - Parallel jobs (`lint`, `typecheck`, `test`, `build`) completing in **under 20 seconds**.
6. **Git Hooks (Husky & Commitlint)**:
   - `pre-commit`: Runs `lint-staged` (Biome auto-check & format) followed by `typecheck`.
   - `commit-msg`: Enforces Conventional Commits locally before commits are created.

---

## 📁 Directory Structure

```text
.
├── .coderabbit.yaml                    # CodeRabbit AI code review configuration
├── .env.example                        # Environment variable template
├── .gitignore                          # Git ignore rules
├── .github/
│   ├── dependabot.yml                  # Monthly Dependabot update configuration
│   └── workflows/
│       ├── ci.yml                      # Parallelized high-speed CI workflow
│       ├── pr-title.yml                # Semantic PR title verification action
│       └── dependency-review.yml       # Dependency vulnerability & license scanner
├── .husky/
│   ├── commit-msg                      # Commitlint git hook
│   └── pre-commit                      # Lint-staged & typecheck git hook
├── biome.json                          # Biome linter, formatter & naming rules
├── commitlint.config.js                # Conventional Commits rules
├── package.json                        # Dependencies, scripts & pnpm config
├── tsconfig.json                       # Incremental TypeScript compiler settings
├── tsup.config.ts                      # esbuild-powered production bundler config
├── vitest.config.ts                    # Vitest test runner configuration
├── src/
│   ├── app.ts                          # Express application factory & middleware stack
│   ├── server.ts                       # Server bootstrap & graceful shutdown handler
│   ├── container.ts                    # Composition Root (Dependency Injection graph)
│   ├── config/
│   │   └── env.ts                      # Type-safe Zod environment validation
│   ├── core/
│   │   ├── errors/
│   │   │   ├── app-error.ts            # Liskov-compliant error hierarchy
│   │   │   └── error-codes.ts          # Structured domain error constants
│   │   ├── http/
│   │   │   └── api-response.ts         # Standardized generic JSON response envelope
│   │   └── logger/
│   │       ├── logger.interface.ts     # ILogger abstraction (DIP)
│   │       └── winston-logger.ts       # Winston structured logger implementation
│   ├── middlewares/
│   │   ├── error-handler.ts            # Centralized RFC-compliant error handler
│   │   ├── not-found.ts                # 404 route catch-all
│   │   ├── request-logger.ts           # Morgan HTTP logger middleware
│   │   └── validate.ts                 # Zod schema validation middleware
│   ├── modules/
│   │   ├── health/                     # Diagnostics module (Strategy Pattern)
│   │   │   ├── health.controller.ts
│   │   │   ├── health.interface.ts
│   │   │   ├── health.routes.ts
│   │   │   ├── health.service.ts
│   │   │   └── indicators/
│   │   │       ├── memory.indicator.ts
│   │   │       └── uptime.indicator.ts
│   │   └── user/                       # Sample domain module (Layered Architecture)
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
│       └── index.ts                    # Versioned root API router (/api/v1)
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

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v22` or `v25` (LTS recommended)
- **pnpm**: `v10.x` or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. Install dependencies
pnpm install

# 3. Setup local environment
cp .env.example .env

# 4. Start development server with hot-reload
pnpm dev
```

The server will boot at `http://localhost:3000`.

---

## 📡 API Endpoints

All application routes are strictly versioned under `/api/v1`:

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Cluster liveness & diagnostic report (memory, uptime) | Public |
| `GET` | `/health/live` | Kubernetes / Docker liveness probe | Public |
| `GET` | `/health/ready` | Readiness probe (database, external dependencies) | Public |
| `GET` | `/api/v1/health` | Versioned health status | Public |
| `POST` | `/api/v1/users` | Create user (validated with Zod DTO schema) | Public |
| `GET` | `/api/v1/users` | List all users | Public |
| `GET` | `/api/v1/users/:id` | Get user by ID | Public |

### Sample Response Format

Every API response uses the standardized generic [`ApiResponse<T>`](src/core/http/api-response.ts) envelope:

**Success Response (`200 OK` / `201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "1d8b6711-2b0e-436f-87e2-4911d56e30b8",
    "email": "alex@example.com",
    "name": "Alex",
    "createdAt": "2026-11-11T12:00:00.000Z",
    "updatedAt": "2026-11-11T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-11-11T12:00:00.000Z"
  }
}
```

**Error Response (`400 Bad Request`, `404 Not Found`, `409 Conflict`):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-11-11T12:00:00.000Z"
  }
}
```

---

## 🛠️ Developer Scripts

| Command | Action | Speed |
| :--- | :--- | :--- |
| `pnpm dev` | Starts server with `tsx watch` (hot-reloading) | < 150ms |
| `pnpm build` | Bundles code for production with `tsup` into `dist/` | ~100ms |
| `pnpm start` | Runs the compiled production server | Instant |
| `pnpm typecheck` | Type-checks codebase with incremental AST caching | < 1s |
| `pnpm lint` | Runs Biome linter and file naming checks | ~40ms |
| `pnpm lint:fix` | Automatically fixes linting and formatting issues | ~60ms |
| `pnpm format` | Auto-formats source code with Biome | ~20ms |
| `pnpm test` | Runs unit and integration tests with Vitest | ~3s |
| `pnpm test:watch` | Starts Vitest in interactive watch mode | Instant |
| `pnpm test:coverage` | Generates test coverage report via V8 | ~3s |

---

## 📚 Master Reference Guides

- **LLM Scaffolding Specification**: [`SCAFFOLD.md`](SCAFFOLD.md) — Complete verbatim blueprint containing all source code and configurations for LLM/agent code generation.
- **Step-by-Step Architecture Guide**: [`EXPRESS_SETUP_GUIDE.md`](EXPRESS_SETUP_GUIDE.md) — Exhaustive guide explaining tooling comparisons, SOLID theory, and setup instructions from scratch.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
