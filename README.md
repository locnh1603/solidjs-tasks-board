
# SolidJS Tasks Monorepo

This is a pnpm monorepo for the SolidJS Real-Time Collaborative Task Board and related apps/packages.

## Monorepo Structure

```
solidjs-tasks/
├── apps/
│   └── board/         # Main SolidJS + Supabase app
├── package.json       # Monorepo root scripts (Turbo, pnpm)
├── pnpm-workspace.yaml
├── turbo.json         # Turbo pipeline config
└── ...
```

## Workspace Usage

- Install all dependencies for all workspaces:
   ```sh
   pnpm install
   ```
- Run all builds/tests/lints in all apps/packages:
   ```sh
   pnpm run build
   pnpm run test
   pnpm run lint
   pnpm run format
   ```
- Develop a specific app:
   ```sh
   cd apps/board
   pnpm run dev
   ```

## App Features

## Overview

A production-ready, real-time collaborative task management application built with **SolidJS** and **Supabase**, featuring integrated chat functionality.

## Features
- Kanban-style task board with drag-and-drop
- Real-time multi-user collaboration (Supabase Realtime)
- Integrated context-aware chat
- User authentication and presence
- File uploads and attachments
- Scalable, production-ready architecture

## Technology Stack
| Category            | Technology                | Purpose                                 |
|---------------------|--------------------------|-----------------------------------------|
| Frontend Framework  | SolidJS 1.8+             | Fine-grained reactivity, efficient rendering |
| Backend/Database    | Supabase                 | PostgreSQL, Auth, Realtime, Storage     |
| Build Tool          | Vite 5+                  | Fast development, optimized builds      |
| Styling             | Tailwind CSS             | Utility-first responsive design         |
| Type Safety         | TypeScript 5+            | Type safety and better DX               |
| State Management    | SolidJS Stores           | Fine-grained reactive state             |
| Routing             | @solidjs/router          | Client-side routing                     |
| Testing             | Vitest + Playwright      | Unit and E2E testing                    |

## System Architecture
```
Client: SolidJS App → State Stores → Service Layer
Backend: Supabase (PostgreSQL, Auth, Realtime, Storage)
Features: Task Management, Chat, User Presence, File Uploads
```

## Database Schema (Simplified)
- **profiles**: user info, status, avatar
- **boards**: Kanban boards
- **board_members**: board membership
- **columns**: board columns
- **tasks**: tasks/cards
- **chat_channels**: chat per board/task
- **channel_members**: chat membership
- **messages**: chat messages
- **message_reactions**: emoji reactions

## Project Structure
```
apps/board/
  ├── src/
  │   ├── components/    # UI components (Board, Chat, Auth, Layout, etc.)
  │   ├── routes/        # App routes
  │   ├── services/      # Supabase and service logic
  │   ├── stores/        # SolidJS stores
  │   ├── types/         # TypeScript types
  │   ├── App.tsx        # App entry
  │   └── index.tsx      # Main entry
  ├── public/
  ├── package.json
  ├── vite.config.ts
  ├── tsconfig.json
  └── README.md
```

## Getting Started
1. Clone the repo and install dependencies:
   ```sh
   pnpm install
   ```
2. Set up your Supabase project and environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Start the development server:
   ```sh
   pnpm run dev
   ```

## License
MIT