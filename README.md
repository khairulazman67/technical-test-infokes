# Folder Explorer

Aplikasi web untuk mengelola struktur folder dengan tampilan seperti Windows Explorer.

## Tech Stack

- **Monorepo**: Turborepo
- **Package Manager**: Bun
- **Frontend**: Vue 3 + Vuetify 4
- **Backend**: Bun + Elysia
- **Database**: PostgreSQL + Prisma ORM
- **Testing**: Jest (API), Vitest (Web), Playwright (E2E)

## Prerequisites

- Bun >= 1.0.0
- PostgreSQL >= 14
- Node.js >= 20.19.0 (untuk Playwright)

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Setup Database

Buat database PostgreSQL:

```bash
createdb folder_explorer
createdb folder_explorer_test  # untuk testing
```

### 3. Configure Environment

**API** (`apps/api/.env`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/folder_explorer"
PORT=3000
NODE_ENV=development
```

**Web** (`apps/web/.env`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Setup Database Schema

```bash
cd apps/api
./node_modules/.bin/prisma db push
./node_modules/.bin/prisma db seed
```

### 5. Run Development

```bash
# Dari root directory
bun run dev
```

Aplikasi akan berjalan di:

- **Web**: http://localhost:5173
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/swagger

## Project Structure

```
.
├── apps/
│   ├── api/          # Backend API (Bun + Elysia)
│   │   ├── src/
│   │   │   ├── config/       # Environment configuration
│   │   │   ├── database/     # Prisma client
│   │   │   ├── repositories/ # Data access layer
│   │   │   ├── services/     # Business logic
│   │   │   ├── controllers/  # Request handlers
│   │   │   ├── routes/       # API routes
│   │   │   ├── mappers/      # DTO mappers
│   │   │   └── container/    # Dependency injection
│   │   └── prisma/
│   │       └── schema.prisma # Database schema
│   │
│   └── web/          # Frontend (Vue 3 + Vuetify)
│       ├── src/
│       │   ├── components/   # Vue components
│       │   ├── pages/        # Page components
│       │   ├── composables/  # Composition API logic
│       │   ├── stores/       # Pinia stores
│       │   ├── services/     # API client
│       │   └── config/       # Environment configuration
│       └── e2e/              # Playwright tests
│
└── packages/
    └── types/        # Shared TypeScript types
```

## Architecture

### Backend (API)

Menggunakan **layered architecture** dengan dependency injection:

```
Routes → Controllers → Services → Repositories → Database
```

- **Routes**: Definisi endpoint dan Swagger docs
- **Controllers**: Handle HTTP request/response
- **Services**: Business logic dan transactions
- **Repositories**: Database queries
- **Mappers**: Transform data ke DTO

### Frontend (Web)

Menggunakan **component-based architecture**:

- **Pages**: Top-level page components
- **Components**: Reusable UI components
- **Composables**: Shared logic (API calls, operations)
- **Stores**: Global state management (Pinia)
- **Services**: API client configuration

### Shared Types

Package `@repo/types` berisi TypeScript types yang digunakan oleh API dan Web untuk memastikan type safety.

## Available Scripts

### Root (Turborepo)

```bash
bun run dev          # Run all apps in development
bun run build        # Build all apps
bun run test         # Run all tests
```

### API

```bash
cd apps/api

bun run dev          # Development server
bun run build        # Build for production
bun run start        # Run production build
bun run test         # Run unit tests
bun run test:watch   # Run tests in watch mode
```

### Web

```bash
cd apps/web

bun run dev          # Development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run test         # Run unit tests
bun run test:ui      # Run tests with UI
bun run test:e2e     # Run E2E tests
```

## Testing

### Unit Tests (API)

```bash
cd apps/api
bun run test
```

- Framework: Jest
- Database: Real PostgreSQL (test database)
- Coverage: Service layer methods

### Unit Tests (Web)

```bash
cd apps/web
bun run test:run
```

- Framework: Vitest + Vue Test Utils
- Environment: jsdom
- Coverage: All Vue components

### E2E Tests (Web)

```bash
cd apps/web
bun run test:e2e
```

- Framework: Playwright
- Tests: CRUD operations, search, navigation

## Features

- Folder tree navigation (custom implementation, no library)
- Breadcrumb navigation
- Create, rename, delete folders
- Search folders
- Context menu (right-click)
- RESTful API with Swagger documentation

## Database Schema

```prisma
model Folder {
  id        String   @id @default(uuid())
  name      String
  path      String   @unique
  parentId  String?
  parent    Folder?  @relation("FolderHierarchy", fields: [parentId], references: [id])
  children  Folder[] @relation("FolderHierarchy")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/api/folders`           | Get all folders (tree structure) |
| GET    | `/api/folders/:id`       | Get folder by ID                 |
| GET    | `/api/folders/search?q=` | Search folders                   |
| POST   | `/api/folders`           | Create new folder                |
| PUT    | `/api/folders/:id`       | Update folder                    |
| DELETE | `/api/folders/:id`       | Delete folder                    |

Dokumentasi lengkap: http://localhost:3000/swagger

````

## Troubleshooting

### Database Connection Error

Pastikan PostgreSQL running dan credentials di `.env` benar:

```bash
psql -U postgres -c "SELECT 1"
````

### Port Already in Use

Ubah port di `.env`:

```env
# API
PORT=3001

# Web
VITE_PORT=5174
```

### Prisma Client Error

Regenerate Prisma Client:

```bash
cd apps/api
./node_modules/.bin/prisma generate
```

## Production Build

```bash
# Build all apps
bun run build

# Run API in production
cd apps/api
bun run start

# Serve Web (gunakan nginx atau hosting service)
cd apps/web
# Upload folder dist/ ke hosting
```
