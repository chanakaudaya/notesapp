# Copilot Instructions

## Build and dev commands

```bash
# Install JS deps
npm install

# Full app in dev mode (Vite + Tauri)
npm run tauri:dev

# Frontend only (no Tauri shell)
npm run dev

# Production build
npm run tauri:build

# TypeScript type-check
npm run typecheck

# Lint
npm run lint

# Run all tests
npm run test

# Run a single test file
npx vitest run src/test/App.test.tsx
```

Rust backend is compiled by Tauri during `tauri:dev` / `tauri:build`. To check it independently:
```bash
cd src-tauri && cargo check
cd src-tauri && cargo test
```

## Architecture overview

**Delivery:** Tauri v2 desktop app (React frontend + Rust backend in one binary). Mobile (iOS/Android) support via Tauri mobile targets in future.

**Data flow:**
```
React UI → invoke() → Tauri IPC → #[command] handler → service function → sqlx/SQLite
```
The frontend never touches SQLite directly — all persistence goes through Tauri commands.

**Frontend (`src/`)**
- `api/` — thin wrappers around `invoke()`, one file per domain; types come from `types/index.ts`
- `hooks/` — TanStack Query hooks per domain (`useNotes`, `useCategories`, `useTodos`, `useReminders`, `useProfiles`)
- `store/useAppStore.ts` — Zustand store for UI-only state (active profile, selected note, active filter, dark mode)
- `components/` — split by domain: `notes/`, `todos/`, `reminders/`, `ui/`
- `pages/` — `ProfilePage` (no active profile) and `MainPage` (Sidebar + NoteList + NoteEditor)

**Backend (`src-tauri/src/`)**
- `commands/` — Tauri `#[command]` functions; they receive `State<AppState>` + request args and delegate to services
- `services/` — pure async business logic operating on `&SqlitePool`; no Tauri dependencies
- `models.rs` — all domain structs with `serde::Serialize/Deserialize` and `sqlx::FromRow`
- `db/mod.rs` — pool creation (WAL mode, foreign keys ON) and migration runner
- `error.rs` — `AppError` enum that `impl serde::Serialize` so it surfaces cleanly to the frontend
- `lib.rs` — Tauri builder, `AppState` struct, `generate_handler![]` macro

**Database (`src-tauri/migrations/`)**
- SQLx migrations; add new files as `000N_description.sql`
- FTS5 virtual table `notes_fts` kept in sync via SQL triggers on `notes`
- All entities use UUID text PKs and RFC 3339 timestamps
- `deleted_at` columns for soft-delete (sync-ready)

## Key conventions

**Adding a new backend feature:**
1. Add structs to `models.rs`
2. Implement logic in `services/<domain>.rs`
3. Add `#[command]` wrappers in `commands/<domain>.rs`
4. Register commands in `lib.rs` `generate_handler![]`

**Adding a new frontend feature:**
1. Add types to `src/types/index.ts` (mirror Rust structs exactly)
2. Add `invoke` wrapper in `src/api/index.ts`
3. Add TanStack Query hooks in `src/hooks/use<Domain>.ts`
4. Build components; use hooks for all data access

**Query cache keys:** defined at the top of each hook file (e.g. `noteKeys`, `reminderKeys`). Always invalidate the right key set in `onSuccess`.

**Zustand store:** persists `activeProfileId`, `darkMode`, and `sidebarOpen` to `localStorage`. Other UI state (active status, search query, selected note) is session-only.

**Error handling:** Rust `AppError` is serialised as a string and arrives in the frontend as a rejected Promise. All `invoke()` calls should be wrapped in try/catch.

**Dark mode:** toggled by adding the `dark` class to `<html>`. Tailwind's `darkMode: 'class'` strategy is active.

**Note status transitions:** `Active` ↔ `Pinned`, `Active` → `Archived`, any → `Trashed`, `Trashed` → permanent delete. The `set_note_status` command handles all transitions.
