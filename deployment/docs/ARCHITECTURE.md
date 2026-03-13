# Memoryhole Architecture

## Overview

Memoryhole is a full-stack web application built on [CedarJS](https://cedarjs.com) (a fork of RedwoodJS), using a GraphQL API backed by PostgreSQL, with a React frontend. It is deployed as a set of Docker containers per tenant instance, managed by Ansible and fronted by a Caddy reverse proxy.

```
Internet
   │
   ▼
┌─────────────────────┐
│  Caddy (host)       │  TLS termination, reverse proxy
│  port 80/443        │
└──────────┬──────────┘
           │ proxy to 127.0.0.1:<instance_port>
           ▼
┌─────────────────────────────────────────────┐
│  Docker Compose (per instance)              │
│                                             │
│  ┌───────────┐      ┌───────────────────┐   │
│  │  web      │─────▶│  api              │   │
│  │  port 80  │      │  port 8911 (gql)  │   │
│  │  (Caddy)  │      │  port 8910 (web)  │   │
│  └───────────┘      └────────┬──────────┘   │
│                              │              │
│                    ┌─────────▼──────────┐   │
│                    │  db (Postgres 16)  │   │
│                    │  port 5432         │   │
│                    └────────────────────┘   │
│                                             │
│  ┌─────────────────────┐                    │
│  │  protonmail-bridge  │  SMTP relay        │
│  │  port 25 (internal) │                    │
│  └─────────────────────┘                    │
└─────────────────────────────────────────────┘
```

Multiple instances can run on the same server, each with their own compose stack and isolated data directory.

---

## Docker Services

### `web`

Image: `ghcr.io/michalgm/memoryhole-web`

Runs the compiled frontend as a static site served by an embedded Caddy web server. Also handles proxying API requests to the `api` container. Listens on port 80 inside the container, mapped to a unique host port (`127.0.0.1:<port>:80`) which the host-level Caddy proxies to.

### `api`

Image: `ghcr.io/michalgm/memoryhole-api`

Runs two servers:

- **GraphQL API** on port 8911 — handles all data operations
- **Collaboration WebSocket server** on a separate port — handles real-time document editing via Hocuspocus/Yjs

Depends on `db` being healthy before starting.

### `db`

Image: `postgres:16`

PostgreSQL database. Data stored as a bind mount at `./data/postgres` in the instance directory (owned by uid 999, the postgres user inside the container).

### `protonmail-bridge`

A locally built container that runs the Protonmail Bridge daemon, providing an SMTP relay on `127.0.0.1:1025` that the API uses to send email via Protonmail accounts.

### `console`

Same image as `api`, runs as root with no persistent process (`command: 'true'`). Used for one-off management tasks:

```bash
docker compose exec console node_modules/.bin/cedar exec -- node -e "..."
docker compose exec console node_modules/.bin/cedar prisma db seed
```

### `migrate`

Runs database migrations (`prisma migrate deploy`) on startup, then exits. Runs before `api` on first deploy.

---

## Application Stack

### Runtime

| Component  | Version          |
| ---------- | ---------------- |
| Node.js    | 24.x             |
| Yarn       | 4.x (workspaces) |
| PostgreSQL | 16               |

### Framework

**CedarJS 2.6.0** — a full-stack framework built on React + GraphQL + Prisma. The project is structured as a monorepo with two workspaces:

```
/
├── api/        # Backend — GraphQL API, services, database
├── web/        # Frontend — React app
└── redwood.toml
```

CedarJS provides the conventions, CLI tooling, build pipeline, and auth integration. It is a fork of RedwoodJS.

### Backend (`api/`)

| Component                 | Role                                                   |
| ------------------------- | ------------------------------------------------------ |
| `@cedarjs/api-server`     | HTTP server wrapping the GraphQL and function handlers |
| `@cedarjs/graphql-server` | GraphQL execution with directives and auth             |
| **Prisma**                | ORM — schema, migrations, query client                 |
| **Hocuspocus 3.x**        | WebSocket server for real-time collaborative editing   |
| **Yjs**                   | CRDT library for conflict-free document state          |
| **nodemailer 7**          | Email sending                                          |
| **jsonwebtoken**          | JWT signing for collaboration sessions                 |

### Frontend (`web/`)

| Component                  | Role                                                      |
| -------------------------- | --------------------------------------------------------- |
| **React**                  | UI framework (via CedarJS)                                |
| **Vite 5**                 | Build tool and dev server                                 |
| `@cedarjs/router`          | Client-side routing                                       |
| `@cedarjs/web`             | CedarJS web runtime (cells, auth context, GraphQL client) |
| **MUI 6**                  | Component library (Material UI)                           |
| **Tiptap 3**               | Rich text editor (built on ProseMirror)                   |
| **Material React Table 3** | Data table component                                      |
| **react-hook-form 7**      | Form state management                                     |
| **Zod**                    | Schema validation                                         |
| **@dnd-kit**               | Drag and drop                                             |
| **dayjs**                  | Date handling                                             |

---

## API Layer

### GraphQL

The API is code-first via SDL (Schema Definition Language) files in `api/src/graphql/`. Each SDL file defines types, queries, and mutations for a domain. CedarJS auto-wires these to service functions.

### Services

Business logic lives in `api/src/services/<domain>/`. Services handle queries, mutations, validation, and authorization checks. They are called by the GraphQL resolvers.

### Authentication

Uses **CedarJS dbAuth** — a database-backed session auth system. Credentials are stored as bcrypt hashes in the `User` table. Sessions use HTTP-only cookies containing a signed JWT.

The auth handler at `api/src/functions/auth.js` manages login, logout, signup, and password reset flows. Emails (forgot password, etc.) are sent via the `email.ts` lib.

### Authorization (RBAC)

Four roles in hierarchy order:

| Role          | Access                                       |
| ------------- | -------------------------------------------- |
| `Restricted`  | Read-only access to documents                |
| `Operator`    | Create and edit arrests and logs             |
| `Coordinator` | Manage actions, options, and settings        |
| `Admin`       | Full system access including user management |

GraphQL resolvers use `@requireAuth(minRole: "...")` directives. The `hasRoleLevel()` utility in `api/src/lib/auth.js` handles the hierarchy check. Users can also have an `expiresAt` date.

---

## Database

Managed by **Prisma** with PostgreSQL 16. The schema lives at `api/db/schema.prisma`.

Migrations are applied via `prisma migrate deploy`, which runs automatically in the `migrate` container on each deploy/upgrade.

---

## Real-time Collaboration

Documents support live multi-user editing using:

- **Hocuspocus** — a WebSocket server that coordinates document state between clients
- **Yjs** — a CRDT (Conflict-free Replicated Data Type) library that merges concurrent edits without conflicts
- **Tiptap** — the frontend editor, built on ProseMirror, with a Yjs binding

Document state is stored as binary (Yjs encoded) in the `Document.content` field in Postgres via the Hocuspocus database extension. Authentication for WebSocket connections uses a short-lived JWT issued by the API.

---

## Settings Encryption

Sensitive site settings (e.g. SMTP passwords) are stored encrypted in the database using **AES-256-GCM** via `api/src/lib/crypto.ts`.

- Key source: `SETTINGS_ENCRYPTION_KEY` environment variable
- Key format: 64-char hex (32 bytes) or a passphrase derived via scrypt
- Stored format: `iv:authTag:ciphertext` (hex-encoded, colon-delimited)

Decryption happens on-demand in the email service when credentials are needed.

---

## Build & Images

The Dockerfile at `deployment/Dockerfile` uses a multi-stage build:

```
node:24-trixie-slim (base)
    ├── api_build   — yarn install + cedar build:api
    ├── web_build   — yarn install + cedar build:web
    ├── api_serve   — production API image
    ├── web_serve   — production web image (with embedded Caddy)
    └── console     — API image with root user for admin tasks
```

Images are published to `ghcr.io/michalgm/memoryhole-{api,web}` and pulled by the Ansible upgrade playbook.
