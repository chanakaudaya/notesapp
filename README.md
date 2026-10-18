# Notes App

A cross-platform notes application built with **React + TypeScript** (frontend) and **Rust + Tauri** (backend), using a local **SQLite** database.

## Features

- 📝 Rich note-taking with full-text search
- ✅ To-do lists with check-off and reordering
- 🔔 Reminders with snooze and dismiss
- 🏷️ Categories and tags for organisation
- 📌 Pin, archive, and trash workflow
- 👤 Local profiles (multi-user on the same device)
- 🌙 Dark mode
- 📱 Responsive layout (desktop, tablet, mobile)

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI | Tailwind CSS, Lucide icons |
| State | Zustand (UI state), TanStack Query (server state) |
| Backend | Rust, Tauri v2 |
| Database | SQLite via `sqlx` with FTS5 full-text search |
| Packaging | Tauri (desktop), Tauri mobile target |

## Getting started

### Prerequisites

- [Rust](https://rustup.rs/) ≥ 1.77
- [Node.js](https://nodejs.org/) ≥ 20
- [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run tauri:dev
```

This starts the Vite dev server and the Tauri shell simultaneously.

### Build for production

```bash
npm run tauri:build
```

Produces a platform installer in `src-tauri/target/release/bundle/`.

## Development commands

| Command | Description |
|---|---|
| `npm run dev` | Vite-only frontend (no Tauri shell) |
| `npm run tauri:dev` | Full app in dev mode |
| `npm run tauri:build` | Production build |
| `npm run typecheck` | TypeScript type-check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |

## Architecture

```
notes-app/
├── src/                    # React frontend
│   ├── api/                # Tauri invoke wrappers (one file per domain)
│   ├── components/         # UI components (notes/, todos/, reminders/, ui/)
│   ├── hooks/              # TanStack Query + mutation hooks
│   ├── pages/              # Top-level pages (ProfilePage, MainPage)
│   ├── store/              # Zustand app store (UI state)
│   └── types/              # Shared TypeScript types (mirror of Rust models)
└── src-tauri/              # Rust / Tauri backend
    ├── migrations/         # SQLx migrations (SQL files)
    └── src/
        ├── commands/       # Tauri #[command] handlers (thin wrappers)
        ├── db/             # Connection pool + migration runner
        ├── models.rs       # Domain structs (serde + sqlx)
        ├── services/       # Business logic (profiles, notes, todos, reminders, categories)
        ├── error.rs        # AppError type (serialisable for Tauri IPC)
        └── lib.rs          # Tauri builder + AppState
```

## Data model

- **Profile**: local user identity; all data is profile-scoped
- **Note**: core entity; can be a plain note or a to-do list (`is_todo_list`)
- **TodoItem**: ordered checklist items belonging to a note
- **Category / Tag**: grouping primitives; notes can have one category + many tags
- **Reminder**: scheduled alert attached to a note; supports snooze and dismiss

All primary keys are UUIDs. Rows include `created_at`/`updated_at` timestamps and `deleted_at` for soft deletes — designed for future cross-device sync.

## Database location

SQLite is stored in the platform app-data directory:

| Platform | Path |
|---|---|
| Windows | `%APPDATA%\com.notesapp.app\notes.db` |
| macOS | `~/Library/Application Support/com.notesapp.app/notes.db` |
| Linux | `~/.local/share/com.notesapp.app/notes.db` |
