# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a micro-frontend (MFE) monorepo built with Nx workspace, Rspack bundler, and Module Federation. The architecture consists of:
- **Host Application** (`host`): Main shell application that orchestrates micro-frontends
- **Remote Applications** (`connections`, `dashboard`): Independent micro-frontend modules
- **Shared Packages**: `@repo/core` (utilities) and `@repo/ui` (shared components with shadcn/ui)

## Essential Commands

### Development
```bash
# Start host application with all remotes
npx nx serve host

# Start individual remotes
npx nx serve connections
npx nx serve dashboard

# Build all projects
npx nx run-many -t build

# Build specific project
npx nx build <project-name>
```

### Testing
```bash
# Run all tests
npx nx run-many -t test

# Run tests for specific project
npx nx test <project-name>

# Run E2E tests
npx nx e2e host-e2e
npx nx e2e connections-e2e
npx nx e2e dashboard-e2e
```

### Linting & Type Checking
```bash
# Lint all projects
npx nx run-many -t lint

# Lint specific project  
npx nx lint <project-name>

# Type check (available on projects with typecheck target)
npx nx typecheck <project-name>
```

### Package Management
```bash
# Install dependencies
pnpm install

# Run local registry for testing packages
npx nx local-registry

# Release packages
pnpm dlx nx run-many -t build  # Pre-version command
```

## Architecture & Structure

### Module Federation Setup
- **Host** (`src/apps/host`): Consumes `dashboard` and `connections` remotes
- **Connections** (`src/modules/connections`): Exposes `./Module` via `remote-entry.ts`
- **Dashboard** (`src/modules/dashboard`): Exposes `./Module` via `remote-entry.ts`

### Shared Dependencies Strategy
- React and React-related packages are configured as **eager singletons** to prevent loadShareSync errors
- `@repo/ui` package is shared across all micro-frontends
- Production builds use static remote URLs (`/_mf/dashboard/`, `/_mf/connections/`)

### Package Structure
- **@repo/core** (`src/packages/core`): Shared utilities and business logic
- **@repo/ui** (`src/packages/ui`): Component library built with:
  - shadcn/ui components
  - Radix UI primitives  
  - Tailwind CSS v4
  - Lucide React icons

### Path Aliases (tsconfig.base.json)
- `@/components/*` → UI components
- `@/ui/*` → shadcn/ui components
- `@/lib/*` → Utility libraries
- `@/utils/*` → Utility functions
- `@/hooks/*` → React hooks
- `@repo/core` → Core package
- `@repo/ui` → UI package

### Build System
- **Rspack** for fast bundling with Module Federation support
- **Nx** for monorepo orchestration and caching
- **TypeScript** with strict configuration
- **ESLint** with flat config format
- **Jest** for unit testing
- **Playwright** for E2E testing

### Nx Project Types
- **Applications**: `host` (main shell)
- **Modules**: `connections`, `dashboard` (micro-frontends)  
- **Libraries**: `core`, `ui` (shared packages)
- **E2E**: `host-e2e`, `connections-e2e`, `dashboard-e2e`

## Development Workflow

1. **Starting Development**: Use `npx nx serve host` to run the complete application
2. **Module Development**: Develop remotes independently with `npx nx serve <module-name>`
3. **Shared Components**: Add UI components to `@repo/ui` package using shadcn/ui patterns
4. **Testing Strategy**: Run unit tests with Jest, E2E tests with Playwright
5. **Building**: Use `npx nx build` for individual projects or `npx nx run-many -t build` for all

## Important Notes

- Module Federation requires careful shared dependency configuration to avoid runtime errors
- The UI package follows shadcn/ui conventions with Tailwind CSS v4
- Production builds expect static remotes to be served from `/_mf/` paths
- All React-related dependencies must remain as eager singletons for proper micro-frontend operation