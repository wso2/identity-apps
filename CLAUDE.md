# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WSO2 Identity Server Web Applications - a monorepo containing React-based admin consoles and user portals for WSO2 Identity Server. Uses Nx for monorepo management and pnpm for package management.

## Essential Commands

### Build

```bash
pnpm install && pnpm build        # Full build (all apps + modules)
pnpm build:modules                # Build shared modules only
pnpm build:apps                   # Build console and myaccount apps
```

### Development

```bash
cd apps/console && pnpm start     # Console at https://localhost:9001/console
cd apps/myaccount && pnpm start   # My Account at https://localhost:9000/myaccount
```

### Testing

```bash
pnpm test                         # Run all unit tests
pnpm test:watch                   # Watch mode

# Single test file (from features directory)
npx jest features/admin.applications.v1/__tests__/applications-page.test.tsx

# Single module tests
cd modules/core && pnpm test
```

### Linting & Type Checking

```bash
pnpm lint                         # ESLint all projects
pnpm lint:autofix                 # Auto-fix issues
pnpm typecheck                    # TypeScript type checking
```

### Cleanup

```bash
pnpm clean                        # Clean all build artifacts
```

## Architecture

### Directory Structure

- **apps/console** - Admin console (port 9001)
- **apps/myaccount** - User self-service portal (port 9000)
- **modules/** - Shared libraries (core, react-components, theme, i18n, forms, validation, etc.)
- **features/** - Feature modules (70+ admin.*.v1 packages for console features)
- **identity-apps-core/** - JSP portals (auth portal, recovery portal) - Maven build

### Key Modules

- `@wso2is/core` - API utilities, configs, hooks, Redux store, helpers
- `@wso2is/react-components` - Semantic UI-based component library
- `@wso2is/theme` - Theming system
- `@wso2is/i18n` - Internationalization (i18next)
- `@wso2is/form` - Form handling (current — Oxygen UI / MUI field adapters)
- `@wso2is/forms` - Form handling (legacy — Semantic UI, **do not use in new code**)

### Technology Stack

- React 18, TypeScript 5.1, Redux
- Webpack 5, Nx 17, pnpm 8
- Jest + React Testing Library
- Semantic UI React + MUI + Oxygen UI (WSO2 design system)
- Asgardeo Auth for SSO/OIDC

## Code Conventions

### Naming Conventions

- **Interfaces**: Must use `Interface` suffix (e.g., `ApplicationListInterface`, `FeatureConfigInterface`)
- **Enums**: Do NOT use `Interface` suffix (e.g., `ApplicationAccessTypes`, `OnboardingStep`)
- **Component props**: Define prop interfaces in the component file, extend `IdentifiableComponentInterface`. Only move to `models/` if shared across multiple components
- **Component IDs**: Use hierarchical naming: `${parentId}-${childName}` (e.g., `wizard-color-picker`)

### TypeScript Conventions

This codebase uses **explicit type annotations everywhere** — do not rely on type inference. Never use `any`; use proper types or `unknown` with type guards.

**Variables** — always annotate, even when the type is obvious:
```typescript
const isLoading: boolean = true;
const name: string = config.appName;
const items: ApplicationListInterface[] = [];
const dispatch: Dispatch = useDispatch();
```

**Components** — use `FunctionComponent` (never `FC` or `React.FC`) with `ReactElement` return:
```typescript
const MyComponent: FunctionComponent<MyComponentPropsInterface> = (
    props: MyComponentPropsInterface
): ReactElement => { ... };
```

**Hooks** — explicit generics on `useState`, `useRef`; explicit type on `useSelector`:
```typescript
const [ isOpen, setIsOpen ] = useState<boolean>(false);
const timerRef: React.MutableRefObject<number | null> = useRef<number | null>(null);
const featureConfig: FeatureConfigInterface = useSelector(
    (state: AppState) => state?.config?.ui?.features
);
```

**Callbacks** — type the variable with the full function signature AND the arrow function return type:
```typescript
const handleSubmit: (name: string) => void = useCallback(
    (name: string): void => { ... },
    []
);
```

**useMemo** — type the variable with the expected result type:
```typescript
const isValid: boolean = useMemo(() => name.length > 0, [ name ]);
```

**Async functions** — annotate with `Promise<T>` on both variable and function:
```typescript
const createApp: () => Promise<void> = useCallback(async (): Promise<void> => {
    const result: CreatedAppResultInterface = await createOnboardingApplication(data);
}, [ data ]);
```

**Custom hook return types** — define a named return interface:
```typescript
interface UseMyHookReturn {
    isLoading: boolean;
    data: MyDataInterface | null;
}

export const useMyHook = (): UseMyHookReturn => { ... };
```

### Testing

- Test files: `__tests__/<component>.test.tsx` adjacent to component
- Use `data-componentid` for DOM element selection (not id/classes)
- Use custom render from `@wso2is/unit-testing/utils` (wraps with providers)
- Mock APIs with MSW (handlers in `test-configs/__mocks__/server`)
- `data-testid` is deprecated - use `data-componentid` via `IdentifiableComponentInterface`

### Components

- Extend `IdentifiableComponentInterface` from `@wso2is/core/models` for component IDs
- Form fields use `@wso2is/form` library (not `@wso2is/forms`, which is legacy Semantic UI)
- All form inputs must have labels; use "(optional)" suffix for non-required fields
- Memoize components with expensive render logic using `React.memo()`
- Stabilize callbacks with `useCallback` and expensive computations with `useMemo`

### Styling

All new components must use **Oxygen UI** (`@oxygen-ui/react`) with MUI's `styled` API. See [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) for full guidelines.

- **Imports**: Use per-component imports: `import Box from "@oxygen-ui/react/Box"`
- **Icons**: Import from `@oxygen-ui/react-icons`
- **Styled API** (preferred): Use `styled` from `@mui/material/styles` for reusable styled components
- **Typed styled components**: Always type theme as `({ theme }: { theme: Theme })` and annotate return type as `typeof BaseComponent` (e.g., `const StyledBox: typeof Box = styled(Box)(...)`)
- **No `any`**: Never use `as any` on theme or styled component types — import `Theme` from `@mui/material/styles`
- **`sx` prop**: Use sparingly for one-off layout adjustments (max 3-4 properties)
- **Theme values**: Always reference `theme.palette`, `theme.spacing()`, `theme.shape.borderRadius` — never hardcode colors or pixel values
- **Shared styles file**: For features with many styled components, create a dedicated styles file (e.g., `<feature>-styles.tsx`) containing reusable layout primitives (`ContentArea`, `TwoColumnLayout`, `PrimaryButton`, etc.)

### Access Control

The access control system lives in `modules/access-control/` and provides scope-based feature gating. Features are configured via `FeatureAccessConfigInterface` which defines CRUD scopes, an `enabled` flag, and optional `disabledFeatures`/`subFeatures`.

**Data flow:**
```
Redux Store (allowedScopes, organizationType, features)
  → AccessControlProvider (wraps app root)
    → Components use hooks or <Show> to check access
```

**Checking scopes in components** — use the `useRequiredScopes` hook:
```typescript
import { useRequiredScopes } from "@wso2is/access-control";

const hasUpdatePermission: boolean = useRequiredScopes(
    featureConfig?.applications?.scopes?.update
);
```

**Declarative rendering** — use the `Show` component:
```typescript
import { Show } from "@wso2is/access-control";

<Show when={ featureConfig?.applications?.scopes?.create }>
    <CreateButton />
</Show>
```

**Checking feature enablement:**
```typescript
import { isFeatureEnabled } from "@wso2is/access-control";

isFeatureEnabled(featureConfig, "featureName.subFeature")
```

**Organization-aware scopes**: `hasRequiredScopes()` automatically transforms scope prefixes for sub-organizations (`internal_` → `internal_org_`, `console:` → `console:org:`). No manual handling needed.

**Route filtering**: `RouteUtils.filterEnabledRoutes()` filters navigation routes based on `feature.enabled`, `scopes.feature`, and `scopes.read`. Used in layout components to show only accessible routes.

**Feature gate statuses** (newer pattern via `useCheckFeatureStatus`):
```typescript
const status: FeatureStatus = useCheckFeatureStatus("console.application.signIn");
// FeatureStatus: ENABLED | DISABLED | HIDDEN | BLOCKED
```

### Feature Flags

Control feature visibility via `deployment.config.json`. Each feature has a `FeatureAccessConfigInterface` with CRUD scopes:

```json
"myFeature": {
    "enabled": true,
    "disabledFeatures": [],
    "scopes": {
        "create": ["internal_*_mgt_create"],
        "feature": ["console:*"],
        "read": [], "update": [], "delete": []
    }
}
```

To add a new feature flag:

1. Add config entry to `apps/console/src/public/deployment.config.json` (as above)
2. Add the key to `FeatureConfigInterface` in `features/admin.core.v1/models/config.ts`:
   ```typescript
   myFeature?: FeatureAccessConfigInterface;
   ```
3. Create a status hook that checks: feature flag enabled, user scopes, and any business rules (organization type, privileged user status, etc.)

## Feature Development Guide

### Feature Directory Structure

```
features/admin.<feature-name>.v1/
├── api/                    # API integration (one file per concern)
├── assets/                 # Feature-specific icons, images, and SVGs
├── components/
│   ├── shared/             # Reusable UI components scoped to this feature
│   └── steps/              # Step components (for multi-step flows)
├── constants/
│   ├── component-ids.ts    # data-componentid string constants
│   ├── validation.ts       # Validation constraints
│   └── index.ts            # Barrel export
├── hooks/                  # Custom hooks
├── models/
│   └── index.ts            # TypeScript interfaces & enums
├── pages/                  # Route entry points
├── utils/                  # Pure utility functions
├── public-api.ts           # Public exports (keep minimal)
├── package.json
└── tsconfig.json
```

> **Assets**: Store feature-specific icons and images in the feature's own `assets/` directory — do NOT add them to the shared `themes/` module (which is deprecated). Import SVGs as React components via the `ReactComponent` named export (e.g., `import { ReactComponent as MyIcon } from "../assets/icons/my-icon.svg"`).

### Public API & Encapsulation

Only export what other features actually need via `public-api.ts`. Internal components, hooks, utils, and constants should NOT be exported. This prevents tight coupling between features.

### State Management

- Use **local component state** (`useState`) for feature-internal state — not Redux
- Create a **custom hook** with memoized update functions for complex state
- Use **immutable patterns**: spread existing state, update only changed fields
- **Redux** is for app-wide state and alerts (`dispatch(addAlert(...))`)
- **sessionStorage**: Transient state that should survive page reloads within a session
- **localStorage**: Persistent state like completion flags (hash user IDs for privacy)

### Multi-Step Wizard Pattern

For wizard-style features:

- **Orchestrator component** owns the state and renders steps conditionally
- **Step components** receive data and callbacks as props (no direct state access)
- **Step enum** defines the flow: `enum MyStep { STEP_ONE = 0, STEP_TWO = 1, ... }`
- **Per-step validation** via a dedicated hook that returns whether the current step is valid
- Steps can be conditionally skipped based on user choices

### API Layer

- One file per API concern (e.g., `create-application.ts`, `update-branding.ts`)
- Reuse existing feature APIs via imports (e.g., `@wso2is/admin.applications.v1`)
- Secondary API calls should fail silently if the primary operation succeeds
- Primary errors dispatch alerts (see below)

**HTTP client** — all API functions use the Asgardeo SPA client:
```typescript
import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());
```

**Data fetching** — use the `useRequest` SWR hook from `@wso2is/admin.core.v1/hooks/use-request`:
```typescript
import useRequest, { RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";

const { data, isLoading, error, mutate }: RequestResultInterface<MyDataType> =
    useRequest<MyDataType>({ url: endpoint, method: HttpMethods.GET, headers: { ... } });
```

**API endpoints** come from the Redux store — access via `store.getState().config.endpoints`.

**Alerts** — dispatch success/error notifications via Redux:
```typescript
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";

// Success
dispatch(addAlert({
    description: "Application created successfully.",
    level: AlertLevels.SUCCESS,
    message: "Application Created"
}));

// Error (typically in catch block)
dispatch(addAlert({
    description: error?.response?.data?.description || "Something went wrong.",
    level: AlertLevels.ERROR,
    message: "Operation Failed"
}));
```

### Route Registration

Routes are defined in `apps/console/src/configs/routes.tsx` and organized by layout group:

| Function | Layout | Use for |
|----------|--------|---------|
| `getAppViewRoutes()` | Side panel + header | Standard admin pages (applications, users, etc.) |
| `getFullScreenViewRoutes()` | Full screen, no side panel | Wizards, onboarding flows |
| `getDefaultLayoutRoutes()` | Tenant management | Organization settings |
| `getErrorLayoutRoutes()` | Error pages | 404, unauthorized |
| `getAuthLayoutRoutes()` | Auth flows | Login, logout |

**Adding a new route** requires two steps:

1. **Register the path** in `features/admin.core.v1/constants/app-constants.ts` → `getPaths()`:
```typescript
[ "MY_FEATURE", `${ AppConstants.getDeveloperViewBasePath() }/my-feature` ],
```

2. **Add the route entry** to the appropriate function in `routes.tsx`:
```typescript
{
    component: lazy(() => import("@wso2is/admin.<feature>.v1/pages/<page>")),
    exact: true,
    id: "<feature>",
    path: AppConstants.getPaths().get("MY_FEATURE"),
    protected: true,
    showOnSidePanel: true   // true = appears in side navigation
}
```

Always use `lazy()` imports for route-level components.

**Route filtering** — routes are automatically filtered at runtime by `CommonRouteUtils.filterEnabledRoutes()` based on the route's `id` matching a key in `featureConfig`. If `featureConfig.<id>.enabled` is `false` or the user lacks required scopes, the route is hidden. Set `showOnSidePanel: true` for routes that should appear in the side navigation.

### Constants Organization

- **component-ids.ts**: All `data-componentid` values as named string constants
- **validation.ts**: Validation constraints (min/max lengths, regex patterns)
- **Data-driven configs**: Templates, options, and selectable items as typed constant arrays
- Use a barrel export (`index.ts`) within the constants directory

### Reusing Existing Constants & Utilities

**Always check existing feature packages before defining new constants.** Many commonly needed values already have canonical definitions. Duplicating them creates maintenance burden and inconsistencies.

**Shared constants to reuse:**

| What | Where | Example |
|------|-------|---------|
| Template IDs | `@wso2is/admin.applications.v1/models/application` → `ApplicationTemplateIdTypes` enum | `ApplicationTemplateIdTypes.M2M_APPLICATION` instead of `"m2m-application"` |
| Authenticator names | `@wso2is/admin.connections.v1/constants/local-authenticator-constants` → `LocalAuthenticatorConstants.AUTHENTICATOR_NAMES` | `AUTHENTICATOR_NAMES.BASIC_AUTHENTICATOR_NAME` instead of `"BasicAuthenticator"` |
| Local IDP identifier | `LocalAuthenticatorConstants.LOCAL_IDP_IDENTIFIER` | Use instead of hardcoding `"LOCAL"` |
| Claim URIs | `@wso2is/admin.claims.v1/constants/claim-management-constants` → `ClaimManagementConstants` | `.EMAIL_CLAIM_URI` instead of `"http://wso2.org/claims/emailaddress"` |
| Server config IDs | `@wso2is/admin.server-configurations.v1/constants/server-configurations-constants` | Connector IDs, category IDs |

**Storage utilities** — use `@wso2is/core/utils` wrappers instead of raw browser APIs:
```typescript
// Good
import { SessionStorageUtils, LocalStorageUtils } from "@wso2is/core/utils";
SessionStorageUtils.setItemToSessionStorage(key, value);
LocalStorageUtils.getValueFromLocalStorage(key);

// Bad — don't use raw APIs
sessionStorage.setItem(key, value);
localStorage.getItem(key);
```

**Reuse existing API functions** — check if the Console already has an API function for what you need before writing HTTP calls:
```typescript
// Good — reuse existing function from admin.branding.v1
import { updateBrandingPreference } from "@wso2is/admin.branding.v1/api/branding-preferences";
await updateBrandingPreference(isUpdate, appId, preference, BrandingPreferenceTypes.APP);

// Bad — duplicating HTTP mechanics
const response = isUpdate
    ? await httpClient.put(url, { data: preference })
    : await httpClient.post(url, { data: preference });
```

### Comment Conventions

- **Exported functions**: Keep JSDoc with `@param` and `@returns` annotations
- **Interfaces/types**: JSDoc is optional — skip if the name and properties are self-explanatory
- **Inline comments**: Only add when explaining non-obvious behavior or constraints (e.g., "Email as login identifier requires alphanumeric username to be enabled")
- **Remove**: Comments that restate what the code already says, verbose step-by-step narration, or obvious descriptions like "This interface defines the props"

### i18n / Translations

The codebase uses **i18next** via `@wso2is/i18n`. Translations are organized by namespace (60+), each mapping to a feature area.

**File structure:**
```
modules/i18n/src/
├── constants.ts                          # Namespace string constants
├── models/namespaces/                    # TypeScript interfaces per namespace
│   └── applications-ns.ts               # e.g., ApplicationsNS interface
└── translations/
    ├── en-US/
    │   ├── meta.ts                       # Registers available namespaces for locale
    │   └── portals/
    │       ├── applications.ts           # Translation key-value pairs
    │       └── ...
    ├── fr-FR/
    └── ...
```

**Usage in components:**
```typescript
import { useTranslation } from "react-i18next";

const { t } = useTranslation();

// Keys use colon-separated namespace: "namespace:path.to.key"
<Typography>{ t("applications:edit.sections.signOnMethod.title") }</Typography>
```

**To add new translation keys:**
1. Add the key to the TypeScript interface in `modules/i18n/src/models/namespaces/<namespace>-ns.ts`
2. Add the English value in `modules/i18n/src/translations/en-US/portals/<namespace>.ts`
3. Use the `<namespace>:<key.path>` format in components

### Cross-Feature Dependencies

Feature packages declare dependencies on other features in their `package.json`:
```json
{
    "dependencies": {
        "@wso2is/admin.applications.v1": "workspace:^",
        "@wso2is/admin.core.v1": "workspace:^",
        "@wso2is/core": "^2.5.3"
    }
}
```

- **`workspace:^`** — local monorepo feature (resolved by pnpm workspace)
- **Semver version** (e.g., `^2.5.3`) — published package from the registry

When your feature imports from another feature, add it as a `workspace:^` dependency in your `package.json`. All features depend on `@wso2is/core` and `@wso2is/i18n` at minimum.

## Prerequisites for Local Development

WSO2 Identity Server must be running with CORS configured in `deployment.toml`:
```toml
[cors]
allowed_origins = ["https://localhost:9000", "https://localhost:9001"]

[console]
callback_url = "regexp=(https://localhost:9001/console|...)"

[myaccount]
callback_url = "regexp=(https://localhost:9000/myaccount|...)"
```

## Environment Requirements

- Node.js >= 16
- pnpm 8.x (use `corepack prepare pnpm@8.7.4 --activate`)
- Maven (for JSP apps)
- JDK 11+

## Documentation Reference

- [AGENTS.md](./AGENTS.md) - Cross-tool AI agent instructions (open standard for Cursor, Copilot, Codex, etc.)
- [docs/write-code/CODE_QUALITY.md](docs/write-code/CODE_QUALITY.md) - Code quality rules (also used by CodeRabbit for PR reviews)
- [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) - Styling architecture, Oxygen UI usage, component guidelines, theming, migration strategy
- [docs/FORMS.md](docs/FORMS.md) - Form component guidelines and field types
