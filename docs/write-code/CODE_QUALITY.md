# Ensuring Code Quality

This is an evolving documentation on the best practices for writing readable, functional and maintainable frontend code. Everyone contributing to identity-apps repository is expected to go through this document and get a better understanding on the best practices to follow.

> Make sure that you set up the required developer tools as mentioned [here](../SET_UP_DEV_ENVIRONMENT.md#setting-up-development-tools) before starting off with the coding.

## Refrain from using `defaultProps`

Using `defaultProps` for functional components is deprecated and will be removed in a future React version. Use JavaScript default parameter values directly in function definitions instead. This approach is cleaner, easier to read, and avoids unnecessary overhead. Additionally, TypeScript can better infer types when default values are defined inline.

**Why:**

- defaultProps requires additional syntax and is less intuitive for functional components.
- Inline default values are simpler and align better with ES6+ standards.
- Improves type inference and eliminates the need for extra declarations.

**What to do:**

Define default values for props directly in the function parameter list.

**Example:**

Recommended:

```javascript
const MyComponent = ({ title = "Default Title" }) => (
    <h1>{title}</h1>
);
```

Avoid:

```javascript
const MyComponent = ({ title }) => (
    <h1>{title}</h1>
);

MyComponent.defaultProps = {
    title: "Default Title",
};
```

## Refrain from using `hasRequiredScopes` in React components. Use `useRequiredScopes` whenever possible.

The `hasRequiredScopes` function is a utility to check if the user has the necessary scopes for an action. However, it is a synchronous function and does not integrate seamlessly with React's lifecycle, which can lead to issues with reactivity and state management. The `useRequiredScopes` custom hook, on the other hand, leverages React's state and effect management, ensuring more predictable and reactive behavior.

**Why:**

- `useRequiredScopes` is designed as a React hook, making it more suitable for functional components.
- Ensures reactivity, automatically re-evaluating when dependencies change.
- Reduces boilerplate code and integrates seamlessly into React's declarative paradigm.

**What to do:**

Replace instances of `hasRequiredScopes` with `useRequiredScopes` wherever possible to ensure better reactivity and cleaner code.

**Example:**

Recommended:

```javascript
import { useRequiredScopes } from "@wso2is/access-control";

const MyComponent = () => {
    const sampleFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features?.sampleFeature);

    const hasSampleReadPermissions: boolean = useRequiredScopes(sampleFeatureConfig?.scopes?.read);

    return hasSampleReadPermissions ? <p>data</p> : null;
};
```

Avoid:

```javascript
import { hasRequiredScopes } from "@wso2is/access-control";

const MyComponent = () => {
    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);

    const hasSampleReadPermissions: boolean = hasRequiredScopes(featureConfig?.sampleFeature,
            featureConfig?.sampleFeature?.scopes?.read, allowedScopes)

    return hasSampleReadPermissions ? <p>data</p> : null;
};
```

## Avoid using semantic UI classes as much as possible.

We are moving away from Semantic UI in favor of Oxygen UI. As part of this transition, new components should avoid using Semantic UI classes to prevent future issues and maintain consistency with the evolving UI framework.

**Why:**

- Using Semantic UI classes in new components introduces technical debt.
- Keeping the codebase consistent with Oxygen UI ensures future-proof development.

**What to do:**

Use Oxygen UI components and classes for new components to ensure consistency and future-proof development.

**Example:**

Recommended:

```jsx
import Button from "@oxygen-ui/react/Button";

const MyComponent = () => {
    return (
       <Button
         className="primary-button"
         variant="outlined"
       >
         Click Me
       </Button>);
};
```

Avoid:

```jsx
import { Button } from "semantic-ui-react"

const MyComponent = () => {
    return <button className="ui button primary">Click Me</button>;
};
```

## Avoid using named exports. Use default exports instead

Use default exports instead of named exports to maintain a uniform and simple import/export structure in the codebase.

**Why:**
- Makes refactoring easier, as default exports can be renamed during import without modifying the export.
- Reduces potential naming conflicts when importing multiple items.
- Simplifies the codebase by enforcing a single export per file.

**What to do:**
Always use default exports for components, utilities, and modules.

**Example:**

Recommended:

```javascript
// MyComponent.jsx
const MyComponent = () => {
    return <div>Hello, World!</div>;
};

export default MyComponent;

// Importing
import MyComponent from "./MyComponent";
```

Avoid:

```javascript
// MyComponent.jsx
export const MyComponent = () => {
    return <div>Hello, World!</div>;
};

// Importing
import { MyComponent } from "./MyComponent";
```

## Use `react-final-form` and related imports from `@wso2is/form` when implementing new forms.

The in-house form builder in modules/forms has limitations in scalability, flexibility, and styling, which makes it unsuitable for complex use cases. Instead of 
maintaining this outdated implementation, we are adopting [React Final Form](https://final-form.org/react/) as our standard for building forms. Customized wrappers for React Final Form components are available in the `wso2is/form` module and should be used for all new forms.

**Why:**
- The in-house form builder is difficult to scale for all use cases, and styling inconsistencies and difficulties arise in certain scenarios.
- React Final Form is a robust, widely-used library with better features and community support.

**What to do:**
Always use React Final Form and related components from `@wso2is/form` (located in `modules/form`) for implementing new forms.

**Example:**

Recommended:

```javascript
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/form";

const MyForm = () => (
  <FinalForm
    onSubmit={(values) => console.log(values)}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
       <FinalFormField
        key="username"
        ariaLabel="username"
        required
        name="username"
        label={ t("actions:fields.authentication" +
            ".types.basic.properties.username.label") }
        placeholder={ t("actions:fields.authentication" +
            ".types.basic.properties.username.placeholder") }
        component={ TextFieldAdapter }
       />
       <button type="submit">Submit</button>
      </form>
    )}
  />
);
```

Avoid:

```javascript
import { Forms, Input } from "@wso2is/forms";

const MyForm = () => (
  <Forms
    onSubmit={(values) => console.log(values)}
  >
    {/* form fields */}
    <button type="submit">Submit</button>
  </Form>
);
```

## Refrain from using 	`any` as a type. Use it as the last resort.

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## Avoid using data-testid / TestableComponentInterface. Use IdentifiableComponentInterface instead.

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## Get the UI text reviewed by the documentation team.

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## Make sure to get the UI/UX reviewed with the team before jumping into implementation.

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## Enable running eslint on file save

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## Make sure to add changeset if you want a new version released with your changes. Carefully review the type of changes to each module and specify the version bump type in changeset accordingly.

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## Use constants for string literals wherever possible.

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## If you are doing a behavioral change to the repo (changes to development process, changes to product behaviour etc,), make sure to update the PR with relevant references. This will come in handy when looking back at the code in a few years.

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>
    
## Use clear variable names

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>
    
## Use `classnames` package for conditionally applying class names to UI elements

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>

## Refrain from using index files, as it leads to increased bundle sizes and circular dependencies

<brief description>

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

Recommended:

<example what to do>

Avoid:

<example what not to do>
    
## Use modern js features to keep the code concise and readable. 

<brief description>

Eg: 

**Why:**
<explain reasons in list format>

**What to do:**
<explain the recommendation in single sentence>

**Example:**

1. Use optional chaining instead of chained expressions joined by `&&`.

Recommended:

```javascript
const userName = user?.profile?.name || "Guest";
```

Avoid:

```javascript
const userName = (user && user.profile && user.profile.name) || "Guest";
```


## Typescript Doc Comments

We follow [TSDoc](https://tsdoc.org/) comments when writing doc comments. Also we use [eslint-plugin-tsdoc](https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/) ESLint plugin to ensure the validity of the TS doc comments. Please make sure that you adhere to the specified rules.

### Examples
TSDoc comment for a function that accepts two numbers and returns the average of those numbers.
>Note: The type of the parameters is not specified in TSDoc, because it is already expressed by the TypeScript language.
```ts
/**
 * Returns the average of two numbers.
 *
 * @param x - The first input number
 * @param y - The second input number
 * @returns The arithmetic mean of `x` and `y`
 * 
 */
const getAverage = (x: number, y: number): number => {
    return (x + y) / 2.0;
}

```

Refer [TSDoc](https://tsdoc.org/) for more information.
