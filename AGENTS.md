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

- Use `@wso2is/form` library (not `@wso2is/forms` which is legacy Semantic UI)
- All form inputs must have labels; use "(optional)" suffix for non-required fields

### i18n

- Uses i18next via `@wso2is/i18n` with namespace-based keys: `"namespace:path.to.key"`
- Translation interfaces in `modules/i18n/src/models/namespaces/`
- English values in `modules/i18n/src/translations/en-US/portals/`

## Environment Requirements

- Node.js >= 16
- pnpm 8.x
- Maven (for JSP apps)
- JDK 11+

## Full Documentation

For comprehensive guidelines including feature development patterns, API layer conventions, route registration, access control, state management, and more, see:

- [CLAUDE.md](./CLAUDE.md) - Complete project conventions and development guide
- [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) - Styling architecture, Oxygen UI usage, theming
- [docs/FORMS.md](docs/FORMS.md) - Form component guidelines
