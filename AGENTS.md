# AGENTS.md

> This file provides AI coding agent instructions for the WSO2 Identity Apps repository.
> It follows the [AGENTS.md](https://github.com/agentsmd/agents.md) open standard for AI agent context.
>
> For comprehensive project conventions, architecture details, and feature development guidelines,
> see [CLAUDE.md](./CLAUDE.md) — the canonical instructions file for this repository.

## Project Overview

WSO2 Identity Server Web Applications - a monorepo containing React-based admin consoles and user portals for WSO2 Identity Server. Uses Nx for monorepo management and pnpm for package management.

## Essential Commands

```bash
pnpm install && pnpm build        # Full build (all apps + modules)
pnpm build:modules                # Build shared modules only
pnpm build:apps                   # Build console and myaccount apps
pnpm test                         # Run all unit tests
pnpm lint                         # ESLint all projects
pnpm lint:autofix                 # Auto-fix lint issues
pnpm typecheck                    # TypeScript type checking
pnpm clean                        # Clean all build artifacts
```

### Development

```bash
cd apps/console && pnpm start     # Console at https://localhost:9001/console
cd apps/myaccount && pnpm start   # My Account at https://localhost:9000/myaccount
```

## Architecture

- **apps/console** - Admin console (port 9001)
- **apps/myaccount** - User self-service portal (port 9000)
- **modules/** - Shared libraries (core, react-components, theme, i18n, forms, validation, etc.)
- **features/** - Feature modules (70+ admin.*.v1 packages for console features)
- **identity-apps-core/** - JSP portals (auth portal, recovery portal) - Maven build

### Technology Stack

- React 18, TypeScript 5.1, Redux
- Webpack 5, Nx 17, pnpm 8
- Jest + React Testing Library
- Semantic UI React + MUI + Oxygen UI (WSO2 design system)

## Key Conventions

### Naming

- **Interfaces**: Must use `Interface` suffix (e.g., `ApplicationListInterface`)
- **Enums**: Do NOT use `Interface` suffix (e.g., `ApplicationAccessTypes`)
- **Components**: Use `FunctionComponent` (never `FC` or `React.FC`) with `ReactElement` return type
- **Component IDs**: Use `data-componentid` (not `data-testid`) via `IdentifiableComponentInterface`

### TypeScript

- **Explicit type annotations everywhere** - do not rely on type inference
- **Never use `any`** - use proper types or `unknown` with type guards
- Always annotate variables, even when the type is obvious

### Styling

- All new components use **Oxygen UI** (`@oxygen-ui/react`) with MUI's `styled` API
- Per-component imports: `import Box from "@oxygen-ui/react/Box"`
- Use `styled` from `@mui/material/styles` (preferred) or `sx` prop (sparingly)
- Always reference theme values - never hardcode colors or pixel values
- See [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) for full styling guidelines

### Forms

- Use `@wso2is/forms` library (React Final Form wrappers). Legacy Semantic UI forms are available under `@wso2is/forms/legacy`.
- All form inputs must have labels; use "(optional)" suffix for non-required fields

### i18n

- Uses i18next via `@wso2is/i18n` with namespace-based keys: `"namespace:path.to.key"`
- Translation interfaces in `modules/i18n/src/models/namespaces/`
- English values in `modules/i18n/src/translations/en-US/portals/`

## Full Documentation

For comprehensive guidelines including feature development patterns, API layer conventions, route registration, access control, state management, and more, see:

- [CLAUDE.md](./CLAUDE.md) - Complete project conventions and development guide
- [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) - Styling architecture, Oxygen UI usage, theming
- [docs/FORMS.md](docs/FORMS.md) - Form component guidelines


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->