# Folder Explorer Monorepo

Monorepo project dengan Turborepo yang berisi aplikasi web folder explorer dan API backend.

## Struktur Project

```
.
├── apps/
│   ├── api/          # Backend API (Bun + ElysiaJS)
│   └── web/          # Frontend Web (Vue 3 + Vuetify)
├── packages/         # Shared packages
│   └── types/        # Shared TypeScript types (@repo/types)
└── turbo.json        # Turborepo configuration
```

## Prerequisites

Pastikan Anda telah menginstall:

- **Node.js** >= 18
- **Bun** >= 1.3.10 (Package manager)

### Install Bun

Jika belum menginstall Bun, jalankan:

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

Atau kunjungi [bun.sh](https://bun.sh) untuk instruksi lengkap.

## Instalasi

1. Clone repository:

```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies untuk semua workspace:

```bash
bun install
```

Perintah ini akan menginstall dependencies untuk:

- Root workspace
- `apps/api`
- `apps/web`
- Semua packages lainnya

## Development

### Menjalankan Semua Aplikasi

Untuk menjalankan semua aplikasi dalam development mode:

```bash
bun run dev
```

Atau dengan Turbo:

```bash
turbo dev
```

### Menjalankan Aplikasi Tertentu

Untuk menjalankan hanya aplikasi web:

```bash
turbo dev --filter=web
```

Atau langsung dari folder aplikasi:

```bash
cd apps/web
bun run dev
```

Untuk menjalankan hanya API:

```bash
turbo dev --filter=api
```

Atau:

```bash
cd apps/api
bun --watch src/index.ts
```

**Note**: Ada bug di Bun 1.3.10 dengan beberapa `bun run` commands. Jika mengalami error, gunakan command langsung seperti contoh di atas.

### Port Default

- **Web App**: http://localhost:5173
- **API**: http://localhost:3000 (sesuaikan dengan konfigurasi)

## Build

### Build Semua Aplikasi

```bash
bun run build
```

Atau:

```bash
turbo build
```

### Build Aplikasi Tertentu

```bash
turbo build --filter=web
```

## Scripts Tersedia

Di root project:

- `bun run dev` - Menjalankan semua aplikasi dalam development mode
- `bun run build` - Build semua aplikasi
- `bun run lint` - Lint semua aplikasi
- `bun run format` - Format code dengan Prettier
- `bun run check-types` - Type checking untuk semua aplikasi

## Aplikasi

### Web App (apps/web)

Aplikasi frontend dengan fitur:

- Windows Explorer-like interface
- Folder tree navigation
- Search functionality
- Context menu (right-click) dengan opsi: Open, New Folder, Rename, Delete
- Breadcrumb navigation
- Double-click untuk membuka folder

Tech stack:

- Vue 3
- Vuetify 4
- TypeScript
- Vite

Dokumentasi lengkap: [apps/web/EXPLORER_GUIDE.md](apps/web/EXPLORER_GUIDE.md)

### API (apps/api)

Backend API untuk folder management dengan arsitektur yang clean dan scalable.

Tech stack:

- Bun runtime
- Elysia (HTTP framework)
- Prisma ORM
- PostgreSQL
- TypeScript
- Dependency Injection

Features:

- RESTful API untuk CRUD operations
- Folder tree structure dengan self-referencing
- Cascade delete untuk children folders
- Path auto-generation
- Type-safe dengan TypeScript
- Layered architecture (Repository, Service, Controller, Routes)
- Config management (tidak langsung baca .env)
- Singleton patterns untuk shared resources
- **Swagger/OpenAPI documentation** - Interactive API docs di `/swagger`

Dokumentasi lengkap: [apps/api/API_DOCUMENTATION.md](apps/api/API_DOCUMENTATION.md)

Swagger Guide: [apps/api/SWAGGER_GUIDE.md](apps/api/SWAGGER_GUIDE.md)

## Shared Packages

### @repo/types (packages/types)

Shared TypeScript types untuk seluruh monorepo.

Features:

- Single source of truth untuk types
- Type-safe communication antara frontend dan backend
- Reusable types dan interfaces
- Type guards untuk runtime checking

Types yang tersedia:

- `Folder` - Folder entity interface
- `CreateFolderDTO` - DTO untuk create folder
- `UpdateFolderDTO` - DTO untuk update folder
- `FolderTreeDTO` - Simplified tree structure
- `ApiResponse<T>` - Standard API response wrapper
- `isSuccessResponse()` - Type guard untuk success response
- `isErrorResponse()` - Type guard untuk error response

Usage:

```typescript
import type { Folder, ApiResponse } from "@repo/types";
import { isSuccessResponse } from "@repo/types";
```

Dokumentasi lengkap: [packages/types/README.md](packages/types/README.md)

## Troubleshooting

### Port sudah digunakan

Jika port sudah digunakan, Anda bisa:

1. Stop aplikasi yang menggunakan port tersebut
2. Atau ubah port di file konfigurasi masing-masing aplikasi

### Dependencies tidak terinstall

Jika ada masalah dengan dependencies:

```bash
# Hapus node_modules dan lock file
rm -rf node_modules apps/*/node_modules bun.lock

# Install ulang
bun install
```

### Turbo cache issue

Jika ada masalah dengan Turbo cache:

```bash
# Clear Turbo cache
rm -rf .turbo

# Atau force rebuild
turbo build --force
```

## Tech Stack

- **Monorepo**: Turborepo
- **Package Manager**: Bun
- **Frontend**: Vue 3 + Vuetify
- **Backend**: Bun + ElysiaJS
- **Build Tool**: Vite (web), Bun (api)

## Useful Links

- [Turborepo Documentation](https://turborepo.dev/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vuetify Documentation](https://vuetifyjs.com/)
