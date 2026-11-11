# Code Quality Rules

Best practices for frontend code in identity-apps. Set up the [developer tools](../SET_UP_DEV_ENVIRONMENT.md#setting-up-development-tools) first.

## Code

### 1. No `defaultProps` — use default parameter values

`defaultProps` on function components is deprecated in React.

```tsx
// ✅
const MyComponent = ({ title = "Default Title" }) => <h1>{ title }</h1>;

// ❌
MyComponent.defaultProps = { title: "Default Title" };
```

### 2. Use `useRequiredScopes`, not `hasRequiredScopes`, in components

The hook re-evaluates reactively; the plain function does not.

```tsx
// ✅
const hasReadPermission: boolean = useRequiredScopes(featureConfig?.sampleFeature?.scopes?.read);

// ❌
const hasReadPermission: boolean = hasRequiredScopes(
    featureConfig?.sampleFeature, featureConfig?.sampleFeature?.scopes?.read, allowedScopes);
```

### 3. Use Oxygen UI, not Semantic UI

Semantic UI is being phased out. Don't use its components or classes (`ui button primary`, etc.) in new code.

```tsx
// ✅
import Button from "@oxygen-ui/react/Button";

// ❌
import { Button } from "semantic-ui-react";
```

### 4. Use default exports, not named exports

One default export per file.

```tsx
// ✅
const MyComponent = () => <div />;
export default MyComponent;

// ❌
export const MyComponent = () => <div />;
```

### 5. Build new forms with `@wso2is/forms` (React Final Form)

`@wso2is/forms/legacy` is deprecated for new code.

```tsx
// ✅
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/forms";

<FinalForm
    onSubmit={ handleSubmit }
    render={ ({ handleSubmit }) => (
        <form onSubmit={ handleSubmit }>
            <FinalFormField
                name="username"
                label={ t("...label") }
                ariaLabel="username"
                required
                component={ TextFieldAdapter }
            />
        </form>
    ) }
/>

// ❌
import { Forms, Input } from "@wso2is/forms/legacy";
```

### 6. Never use `any`

Use a specific type, or `unknown` narrowed with type guards.

```ts
// ✅
const processInput = (input: string): string => input.toUpperCase();

// ❌
const processInput = (input: any): string => input.toUpperCase();
```

### 7. Use `IdentifiableComponentInterface` / `data-componentid`, not `TestableComponentInterface` / `data-testid`

```tsx
// ✅
interface MyComponentPropsInterface extends IdentifiableComponentInterface {}

const MyComponent: FunctionComponent<MyComponentPropsInterface> = ({
    [ "data-componentid" ]: componentId = "my-component"
}: MyComponentPropsInterface): ReactElement => <div data-componentid={ componentId } />;

// ❌
interface MyComponentProps extends TestableComponentInterface {}
<div data-testid={ testId } />
```

### 8. Use constants instead of repeated string literals

```ts
// ✅
if (status === OperationStatus.SUCCESS) { ... }

// ❌
if (status === "success") { ... }
```

### 9. Use descriptive names

No abbreviations or vague names.

```ts
// ✅
const maxRetryCount: number = 3;
const updatePolicyCombinationAlgorithm = () => { ... };

// ❌
const mrc: number = 3;
const updateAlgorithm = () => { ... };
```

### 10. Use `classnames` for conditional class names

```tsx
// ✅
className={ classNames("button", { primary: isPrimary, disabled: isDisabled }) }

// ❌
className={ "button " + (isPrimary ? "primary " : "") + (isDisabled ? "disabled" : "") }
```

### 11. Import from specific file paths, not index files

Index re-exports increase bundle size, weaken tree-shaking, and cause circular dependencies.

```ts
// ✅
import Button from "@/components/button";

// ❌
import { Button } from "@/components";
```

### 12. Use modern JS syntax

Prefer optional chaining, destructuring, template literals, and async/await.

```ts
// ✅
const userName: string = user?.profile?.name || "Guest";

// ❌
const userName: string = (user && user.profile && user.profile.name) || "Guest";
```

### 13. Move component logic into custom hooks

Keep state, side effects, and data fetching in hooks. Keep components for rendering.

```tsx
// ✅
const UserProfile = ({ userId }) => {
    const user: UserInterface = useUserData(userId);

    return user ? <h1>{ user.name }</h1> : <p>Loading...</p>;
};

// ❌ useState + useEffect + fetch inline in UserProfile
```

### 14. Don't build dynamic import paths with concatenation

Bundlers can't statically analyze `import()` paths built with `+` or template literals.

```ts
// ✅
const pageImports = {
    about: () => import("./pages/about"),
    home: () => import("./pages/home")
};

// ❌
import(`./pages/${ pageName }`);
import("./pages" + "/dynamic-connector.tsx");
```

### 15. Add concise TSDoc comments to functions, interfaces, and interface members

Document every function, interface, and interface member. Keep each comment to a short line saying what it is or does. Don't restate the type, list implementation steps, or add examples, history, or filler.

```ts
// ✅
/**
 * Props for the user profile card.
 */
interface UserProfileCardPropsInterface extends IdentifiableComponentInterface {
    /**
     * User to display.
     */
    user: UserInterface;
    /**
     * Called when the edit button is clicked.
     */
    onEdit: () => void;
}

/**
 * Formats a user's full name.
 *
 * @param user - User to format.
 * @returns Full name, or the username if no name is set.
 */
const formatFullName = (user: UserInterface): string => { ... };

// ❌ Too verbose
/**
 * This function is responsible for formatting the full name of the user.
 * It first checks whether the given name exists, then checks the family name,
 * and concatenates them with a space. This is useful in many places in the UI.
 *
 * @param user - The user object of type UserInterface which contains user details.
 * @returns A string containing the formatted full name of the user.
 */
```

## Tooling & Pull Requests

### 16. Run ESLint on save

VS Code settings:

```json
"editor.codeActionsOnSave": { "source.fixAll.eslint": true }
```

### 17. Include a changeset in every PR

Run `pnpm changeset` from the repo root and choose the bump type.

- If you change `features/` or `modules/`, also add a **patch** bump for the consuming app: `@wso2is/console`, `@wso2is/myaccount`, or `@wso2is/identity-apps-core`.
- New packages get a **major** bump.

### 18. Add screenshots or recordings for UI changes

For new or visibly changed UI, add screenshots of the relevant states (default, loading, error, etc.), before/after comparisons for updates, and screen recordings for interactive or multi-step flows.
