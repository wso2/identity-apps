# WSO2 Identity Apps Style Guide

This guide establishes conventions for styling, component architecture, and UI development in the WSO2 Identity Apps repository.

## Table of Contents

- [Styling Architecture](#styling-architecture)
- [Component Guidelines](#component-guidelines)
- [Oxygen UI Components](#oxygen-ui-components)
- [Oxygen UI Icons](#oxygen-ui-icons)
- [Extended Theme](#extended-theme)
- [Styling Best Practices](#styling-best-practices)
- [Migration Strategy](#migration-strategy)

---

## Styling Architecture

### Overview

This repository uses two UI component libraries:

| Library | Foundation | Status | Usage |
|---------|------------|--------|-------|
| **Oxygen UI** | Material UI 5(MUI) | Active | New components |
| **Semantic UI React** | Custom SCSS | Legacy | Existing components |

**Oxygen UI** (`@oxygen-ui/react`) is our design system built on MUI. It provides consistent theming, accessibility, and alignment with WSO2's product design guidelines.

**Semantic UI React** was our original component library. While it remains in the codebase for stability, we are progressively migrating away from it.

### Current State

The codebase contains a mix of:
- SCSS files (Semantic UI theming)
- MUI theming (Oxygen UI)
- Inline styles (legacy, avoid adding new ones)

This hybrid state exists because migrating a large codebase requires a measured, incremental approach to avoid regressions.

---

## Component Guidelines

### What Constitutes a Component

A component is a self-contained, reusable piece of UI that:

1. **Has a single responsibility** - Does one thing well
2. **Is composable** - Can be combined with other components
3. **Is predictable** - Given the same props, renders the same output
4. **Is testable** - Can be tested in isolation

### Component Hierarchy

Structure components in layers of abstraction:

```
Pages (routes)
    └── Features (business logic containers)
        └── Compositions (component combinations)
            └── Base Components (atoms/molecules)
```

**Base Components**: Buttons, inputs, cards, icons - building blocks with no business logic.

**Compositions**: Combine base components for specific UI patterns (e.g., SearchInput = Input + Icon + Button).

**Features**: Connect to state, handle data fetching, contain business logic.

**Pages**: Route-level components that compose features.

### Component Breakdown Principles

When creating or refactoring components:

1. **Extract when repeated** - If you copy-paste UI code more than twice, extract it.

2. **Extract when complex** - If a component exceeds ~150-200 lines or has multiple responsibilities, break it down.

3. **Keep props minimal** - If a component has more than 5-7 props, consider whether it's doing too much.

4. **Favor composition over configuration** - Instead of adding boolean props for variants, create composed components:

   ```tsx
   // ✅ Prefer this
   <Card>
     <CardHeader />
     <CardContent />
   </Card>

   // ❌ Over this
   <Card showHeader={true} headerVariant="primary" />
   ```

5. **Co-locate related code** - Keep component, styles, tests, and types together.

### Ensuring Reusability

To create reusable components:

- **Avoid hardcoded content** - Accept text, labels, and messages as props or children.
- **Use semantic prop names** - `isDisabled` not `d`, `variant` not `v`.
- **Provide sensible defaults** - Components should work with minimal configuration.
- **Document with TypeScript** - Use interfaces with JSDoc comments for complex props.
- **Extend standard interfaces** - Inherit from `IdentifiableComponentInterface` for test IDs.

```tsx
export interface ActionButtonPropsInterface extends IdentifiableComponentInterface {
    /**
     * Button variant determining visual style.
     */
    variant?: "primary" | "secondary" | "danger";
    /**
     * Click handler.
     */
    onClick: () => void;
    /**
     * Button content.
     */
    children: React.ReactNode;
}
```

---

## Oxygen UI Components

Oxygen UI (`@oxygen-ui/react`) is our primary component library built on MUI. Import components using the per-component import pattern for optimal tree-shaking.

### Importing Components

Import each component from its dedicated path:

```tsx
// ✅ Per-component imports
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Typography from "@oxygen-ui/react/Typography";
import TextField from "@oxygen-ui/react/TextField";

// ❌ Avoid this
import { CardContent, Paper, Popover } from "@oxygen-ui/react";
```

### Common Components

| Component | Import Path | Usage |
|-----------|-------------|-------|
| `Box` | `@oxygen-ui/react/Box` | Layout container, replaces `<div>` |
| `Button` | `@oxygen-ui/react/Button` | Actions and interactions |
| `Card` | `@oxygen-ui/react/Card` | Content containers |
| `Typography` | `@oxygen-ui/react/Typography` | Text rendering |
| `TextField` | `@oxygen-ui/react/TextField` | Form inputs |
| `Grid` | `@oxygen-ui/react/Grid` | Grid layouts |
| `Paper` | `@oxygen-ui/react/Paper` | Elevated surfaces |
| `Dialog` | `@oxygen-ui/react/Dialog` | Modal dialogs |
| `Alert` | `@oxygen-ui/react/Alert` | Feedback messages |
| `Select` | `@oxygen-ui/react/Select` | Dropdown selection |

### Example Usage

```tsx
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";

export interface FeatureCardPropsInterface extends IdentifiableComponentInterface {
    title: string;
    description: string;
}

const FeatureCard: FunctionComponent<FeatureCardPropsInterface> = (
    props: FeatureCardPropsInterface
): ReactElement => {
    const {
        title,
        description,
        ["data-componentid"]: componentId = "feature-card"
    } = props;
    return (
        <Card data-componentid={ componentId }>
            <Box display="flex" flexDirection="column" gap={ 1 } p={ 2 }>
                <Typography variant="h6">{ title }</Typography>
                <Typography variant="body2" color="text.secondary">
                    { description }
                </Typography>
            </Box>
        </Card>
    );
};

export default FeatureCard;
```

---

## Oxygen UI Icons

Icons are provided by the `@oxygen-ui/react-icons` package. Import icons individually for optimal bundle size.

### Importing Icons

```tsx
// Import icons individually
import { ArrowLeftIcon } from "@oxygen-ui/react-icons";
import { GearIcon } from "@oxygen-ui/react-icons";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { PlusIcon, MinusIcon } from "@oxygen-ui/react-icons";

// Or import from a single line
import { ChevronRightIcon, CheckIcon, DownloadIcon } from "@oxygen-ui/react-icons";
```

### Common Icons

| Icon | Usage |
|------|-------|
| `ArrowLeftIcon` | Back navigation |
| `ChevronRightIcon` | Forward/expand indicators |
| `GearIcon` | Settings |
| `TrashIcon` | Delete actions |
| `PlusIcon` / `MinusIcon` | Add/remove actions |
| `CheckIcon` | Success/confirmation |
| `DownloadIcon` | Download actions |
| `CopyIcon` | Copy to clipboard |
| `CircleInfoIcon` | Information hints |
| `EnvelopeAtIcon` | Email related |
| `UserCircleDotIcon` | User/profile related |
| `XMarkIcon` | Close/dismiss |

### Example Usage

```tsx
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography";
import { GearIcon, TrashIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent, ReactElement } from "react";

const ActionBar: FunctionComponent = (): ReactElement => {
    return (
        <Box display="flex" gap={ 1 }>
            <Button startIcon={ <GearIcon /> } variant="outlined">
                Settings
            </Button>
            <Button startIcon={ <TrashIcon /> } variant="outlined" color="error">
                Delete
            </Button>
        </Box>
    );
};
```

### Icon Sizing

Icons accept a `size` prop for controlling dimensions:

```tsx
<EnvelopeAtIcon size={ 25 } />
<GearIcon size={ 16 } />
```

---

## Extended Theme

The application uses `extendTheme` from Oxygen UI to customize the default MUI theme. This provides consistent colors, spacing, typography, and component styles across the application.

### Accessing the Theme

Use `useTheme` hook to access theme values in components:

```tsx
import { Theme } from "@oxygen-ui/react/models/theme";
import { useTheme } from "@oxygen-ui/react/theme";

const MyComponent: FunctionComponent = (): ReactElement => {
    const theme: Theme = useTheme();

    return (
        <Box
            sx={ {
                backgroundColor: theme.palette.background.paper,
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius
            } }
        >
            Content
        </Box>
    );
};
```

### Creating an Extended Theme

The theme is configured in `apps/console/src/theme.ts`. Use `extendTheme` to customize:

```tsx
import { Theme as OxygenTheme } from "@oxygen-ui/react";
import { extendTheme } from "@oxygen-ui/react/theme";

const Theme: OxygenTheme = extendTheme({
    // Color schemes for light and dark modes
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: "#ff7300"
                },
                customComponents: {
                    AppShell: {
                        Main: {
                            background: "#FAF9F8"
                        }
                    },
                    Navbar: {
                        background: "#F6F4F2"
                    }
                },
                gradients: {
                    primary: {
                        stop1: "#EB4F63",
                        stop2: "#FA7B3F"
                    }
                }
            }
        },
        dark: {
            palette: {
                primary: {
                    main: "#ff7300"
                }
            }
        }
    },

    // Global component style overrides
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#F6F4F2",
                    borderBottom: "none"
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: "0.6125rem",
                    height: "20px"
                }
            }
        }
    },

    // Custom component properties
    customComponents: {
        AppShell: {
            properties: {
                mainBorderTopLeftRadius: "24px",
                navBarTopPosition: "80px"
            }
        }
    },

    // Global shape settings
    shape: {
        borderRadius: 8
    },

    // Typography settings
    typography: {
        fontFamily: "Gilmer, sans-serif",
        h1: {
            fontWeight: 700
        }
    }
});

export default Theme;
```

### Theme Structure

| Section | Purpose |
|---------|---------|
| `colorSchemes` | Light/dark mode palettes, custom colors, gradients |
| `components` | MUI component style overrides (MuiButton, MuiCard, etc.) |
| `customComponents` | Oxygen UI-specific component configurations |
| `shape` | Border radius and shape settings |
| `typography` | Font families, weights, and text styles |

### Using Theme in Styled Components

Access theme values in styled components. Always type the `theme` parameter explicitly with `{ theme }: { theme: Theme }` and annotate the return type with `typeof BaseComponent`:

```tsx
import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";

export const StyledContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(3)
}));

export const StyledHeader: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 4)
}));

export const ActionButton: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
    borderRadius: theme.shape.borderRadius,
    textTransform: "none",
    "&:hover": {
        backgroundColor: theme.palette.action.hover
    }
}));
```

### Accessing Color Schemes

For dark mode-specific styles, use `theme.palette` which automatically resolves to the active color scheme. Avoid casting `theme as any` — always use properly typed theme properties:

```tsx
const MyComponent: FunctionComponent = (): ReactElement => {
    const theme: Theme = useTheme();

    return (
        <Card
            sx={ {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary
            } }
        >
            Content adapts to the active color scheme
        </Card>
    );
};
```

---

## Styling Best Practices

### For New Components: Use Oxygen UI

All new components must use Oxygen UI with the following approach:

#### 1. Styled API (Preferred)

Use the `styled` API for component-level styles that are reusable and maintainable:

```tsx
import { Theme, styled } from "@mui/material/styles";

const StyledCard = styled("div")(({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1]
}));

// Variants using props
const StyledButton = styled("button")<{ variant?: "primary" | "secondary" }>(
    ({ theme, variant }: { theme: Theme; variant?: "primary" | "secondary" }) => ({
        padding: theme.spacing(1, 2),
        backgroundColor: variant === "primary"
            ? theme.palette.primary.main
            : theme.palette.grey[200]
    })
);
```

**When to use `styled`:**
- Reusable styled elements
- Components with theme-dependent styles
- Styles that benefit from TypeScript prop typing
- Complex conditional styling based on props

#### 2. The `sx` Prop (Use Sparingly)

The `sx` prop is convenient but should be used sparingly:

```tsx
// ✅ Acceptable: One-off layout adjustments
<Box sx={{ mt: 2, display: "flex", gap: 1 }}>
    {children}
</Box>

// ❌ Avoid: Complex styles that should be extracted
<Box sx={{
    position: "absolute",
    top: 0,
    left: 0,
    // ... 15 more properties
}}>
```

**When `sx` is appropriate:**
- Simple spacing adjustments (`mt`, `mb`, `p`, `gap`)
- One-time layout overrides
- Responsive breakpoint tweaks
- Prototyping (refactor to `styled` before merge)

**When to avoid `sx`:**
- More than 3-4 properties - extract to `styled`
- Repeated across multiple components - create a styled component
- Complex conditional logic - use `styled` with props
- Performance-critical render paths - `styled` is more efficient

#### 3. Theme Usage

Always reference theme values instead of hardcoding:

```tsx
// ✅ Correct
backgroundColor: theme.palette.background.paper
padding: theme.spacing(2)
borderRadius: theme.shape.borderRadius

// ❌ Incorrect
backgroundColor: "#ffffff"
padding: "16px"
borderRadius: "4px"
```

### For Existing Components: Incremental Migration

When modifying legacy Semantic UI components:

1. **Bug fixes** - Fix the issue without changing the styling approach.

2. **Minor enhancements** - Use existing patterns in that component for consistency.

3. **Significant refactors** - Consider migrating to Oxygen UI if:
   - The component requires substantial changes
   - It's being extracted for reuse
   - You have adequate test coverage

4. **Document changes** - Note any migration work in PR descriptions.

### Styles to Avoid

- **Inline style objects** - Use `styled` or `sx` instead of `style={{}}`
- **`any` type assertions** - Never use `as any` on theme or styled component types. Always import and use `Theme` from `@mui/material/styles`
- **Untyped theme parameters** - Always use `({ theme }: { theme: Theme })`, not `({ theme })`
- **!important** - Indicates specificity issues; fix the root cause
- **Magic numbers** - Use theme spacing/sizing tokens
- **Deeply nested selectors** - Keep specificity flat
- **Global styles** - Scope styles to components

---

## Migration Strategy

### Goals

Our long-term objective is to:
1. Fully adopt Oxygen UI as the sole styling solution
2. Remove Semantic UI React dependency
3. Eliminate legacy SCSS files
4. Deprecate the shared `themes/` module — new assets (icons, images) should live in each feature's own `assets/` directory

### Approach

This migration follows an **incremental adoption** strategy:

1. **New code uses Oxygen UI** - No new Semantic UI usage
2. **Opportunistic migration** - Migrate when significantly modifying a component
3. **Dedicated migration sprints** - Periodic focused efforts on high-impact areas
4. **Maintain stability** - Never compromise production stability for migration speed

### Migration Checklist

When migrating a component:

- [ ] Identify all Semantic UI dependencies in the component
- [ ] Map Semantic components to Oxygen UI equivalents
- [ ] Update imports and component usage
- [ ] Convert SCSS/className styles to `styled` API
- [ ] Verify visual parity (screenshots help)
- [ ] Update or add unit tests
- [ ] Test responsive behavior
- [ ] Test accessibility (keyboard nav, screen readers)

### Component Mapping Reference

| Semantic UI | Oxygen UI |
|-------------|-----------|
| `Button` | `Button` |
| `Input` | `TextField` |
| `Dropdown` | `Select` |
| `Modal` | `Dialog` |
| `Card` | `Card` |
| `Grid` | `Grid` / `Box` with flex |
| `Message` | `Alert` |
| `Loader` | `CircularProgress` |

---

## Form Components

Use the `@wso2is/form` library for form implementations. See [FORMS.md](./FORMS.md) for detailed form guidelines including:

- Field types and validation
- Form layout patterns
- Error handling

---

## Accessibility

All components must meet WCAG 2.1 AA standards:

- Provide meaningful `aria-label` attributes
- Ensure keyboard navigability
- Maintain sufficient color contrast (use theme colors)
- Support screen readers with semantic HTML

---

## Additional Resources

- [Oxygen UI Documentation](https://wso2.github.io/oxygen-ui)
- [MUI System Documentation](https://mui.com/system/getting-started/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
