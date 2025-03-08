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

## Refrain from using `any` as a type. Use it as the last resort.

Using `any` as a type bypasses TypeScript's type-checking, which can lead to potential runtime errors and reduce the benefits of a strongly typed system.

**Why:**

- `any` disables type safety, making your code prone to errors.
- Using `any` can obscure the intent of the code, reducing readability and predictability.

**What to do:**

Use specific types or `unknown` when the type is uncertain, and refine it with type guards as necessary.

**Example:**

Recommended:

```javascript
// Typescript will prevent any `processInput` function calls with parameters that are not of
// type `string` during development and build time.
function processInput(input: string): string {
   return input.toUpperCase();
}
```

Avoid:

```javascript
// Might cause runtime errors if input is not a string, but TS wouldn't show any warning
// during development or build
function processInput(input: any): string {
  return input.toUpperCase();
}
```

## Avoid using `data-testid` / `TestableComponentInterface`. Use `IdentifiableComponentInterface` instead.

When adding identifiers to components for testing or automation purposes, prefer using `IdentifiableComponentInterface` with `data-componentid` over using `TestableComponentInterface` with `data-testid`.

**Why:**
- Consistency: IdentifiableComponentInterface standardizes how components are identified across the codebase.
- Readability: It provides clearer intent about the purpose of the identifier.
- Scalability: It aligns better with modern testing frameworks and automation tools.
- Maintainability: Reduces reliance on arbitrary attributes (data-testid), making tests more resilient to UI changes.

**What to do:**
Use `IdentifiableComponentInterface` to define unique identifiers for components instead of using `data-testid` with `TestableComponentInterface`.

**Example:**

Recommended:

```js
import { IdentifiableComponentInterface } from "@wso2is/core";

interface MyComponentProps extends IdentifiableComponentInterface {
  /* props for your component */
}

const MyComponent: React.FC<IdentifiableComponentInterface> = ({
   /* props for your component */
   propA,
   propB, 
   ["data-componentid"]: componentId = "my-component"
}) => {
  return <div data-componentid={ componentId }>Hello</div>;
};
```

Avoid:

```js
import { TestableComponentInterface } from "@wso2is/core";

interface MyComponentProps extends TestableComponentInterface {
  /* props for your component */
}

const MyComponent = (
   /* props for your component */
   propA,
   propB, 
   ["data-testid"]: testId = "my-component"
) => {
  return <div data-testid={ testId }>Hello</div>;
};
```

## Enable running eslint on file save

Automatically running ESLint on file save helps maintain code quality and enforce consistent coding standards without requiring manual intervention.

**Why:**

- Ensures code follows linting rules consistently.
- Reduces manual effort in running ESLint commands.
- Helps catch errors and warnings early.

**What to do:**

Enable ESLint to run automatically on file save in your editor or development environment.

**Example:**

Recommended:

In VS Code:

```js
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

Avoid:

Manually running ESLint each time before committing changes or manually resolve eslint warnings in the editor.

```bash
eslint --fix myfile.js
```

## Use constants for string literals wherever possible.

Using constants for string literals helps avoid repetition, reduces the risk of errors, and makes code easier to maintain.

**Why:**

- Reduces the risk of typos by reusing the same value consistently.
- Simplifies code maintenance, as updating a string value only requires modifying the constant.
- Improves readability by giving meaningful names to commonly used values.
- Promotes consistency across the codebase by preventing multiple variations of the same string.

**What to do:**

Define constants for string literals and use them throughout the code to ensure consistency and maintainability.

**Example:**

Recommended:

```JS
const OperationStatus = {
  SUCCESS: "success",
  ERROR: "error"
}

// Usage
if (status === OperationStatus.SUCCESS) { ... }
```

Avoid:

```js
if (status === "success") { ... }
```
    
## Use meaningful variable names  

Use meaningful and descriptive variable names to improve code readability and maintainability.  

**Why:**  
- Enhances code readability and understanding.  
- Reduces ambiguity and misinterpretation.  
- Makes debugging and collaboration easier.  

**What to do:**  
Choose variable names that clearly describe their purpose and avoid abbreviations or vague terms.  

**Example:**  

Recommended:  
```javascript
const userEmail = "user@example.com";

const maxRetryCount = 3;

const updatePolicyCombinationAlgorithm = () => {
  /* function body */
}
```

Avoid:

```javascript
const ue = "user@example.com";

const mrc = 3;

// ambiguous function name
const updateAlgorithm = () => {
  /* function body */
}
```
   
## Use `classnames` package for conditionally applying class names to UI elements

Manually managing conditional class names using string concatenation can lead to unreadable and error-prone code. The [`classnames`](https://www.npmjs.com/package/classnames) package simplifies conditional styling by providing a clean and flexible way to apply class names dynamically.

**Why:**
- Improves readability and maintainability of class name logic.
- Avoids unnecessary string concatenation and ternary expressions.
- Makes conditional styling more declarative and easier to modify.
- Reduces the risk of missing spaces or incorrectly formatted class names.

**What to do:**
Use the classnames package to conditionally apply class names in a structured and readable way.

**Example:**

Recommended:

```js
import classNames from "classnames";

function Button({ primary, disabled }) {
  return (
    <button
      className={classNames("px-4 py-2 rounded", {
        "bg-blue-500 text-white": primary,
        "bg-gray-300 text-gray-700 cursor-not-allowed": disabled,
      })}
      disabled={disabled}
    >
      Click me
    </button>
  );
}
```

Avoid:

```js
function Button({ primary, disabled }) {
  return (
    <button
      className={
        "px-4 py-2 rounded " +
        (primary ? "bg-blue-500 text-white " : "") +
        (disabled ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "")
      }
      disabled={disabled}
    >
      Click me
    </button>
  );
}
```

## Refrain from using index files, as it leads to increased bundle sizes and circular dependencies

Using index.js (or index.ts) files for re-exporting multiple modules can unintentionally import unnecessary code, leading to larger bundle sizes and potential circular dependencies that break execution order.

**Why:**
- Increases bundle size by importing unused modules.
- Leads to circular dependencies that can cause runtime errors.
- Makes debugging harder as imports become less explicit.
- Reduces tree-shaking efficiency, preventing unused code elimination.

**What to do:**
Import modules directly from their specific file paths instead of using index files for aggregation.

**Example:**

Recommended:

```js
// Import only what is needed
import Button from "@/components/Button";
import Card from "@/components/Card";
```

Avoid:

```js
// Importing from index file (Pulls unnecessary code)
import { Button, Card } from "@/components";
```
    
## Use modern js features to keep the code concise and readable. 

Modern JavaScript features like arrow functions, destructuring, template literals, and async/await can greatly enhance code readability, reduce verbosity, and improve maintainability.

Eg: 

**Why:**

- Modern JS features
    - make the code more concise and expressive.
    - reduce the need for repetitive code and boilerplate.
    - help avoid common bugs by promoting cleaner, less error-prone syntax.
    - improve readability, making it easier for developers to understand the code quickly.
    - align with current JavaScript best practices, which helps maintain consistency across projects.

**What to do:**

Adopt modern JavaScript features where possible to simplify and improve the clarity of the code.

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

## Use component hooks to separate the component logic from the presentation layer.

Separating logic into custom hooks improves reusability, readability, and maintainability of React components by keeping UI concerns distinct from business logic.

**Why:**
- Promotes code reusability by encapsulating logic in reusable hooks.
- Improves readability by keeping components focused on rendering.
- Enhances maintainability by making it easier to test and modify logic independently.
- Reduces prop drilling by managing state and side effects separately.

**What to do:**
Extract complex logic, state management, and side effects into custom hooks while keeping UI rendering inside the component.

**Example:**

Recommended:

```js
// useUserData.js (Custom Hook)
import { useState, useEffect } from "react";

function useUserData(userId) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  return user;
}

export default useUserData;
```

```js
// UserProfile.js (Component)
import useUserData from "./useUserData";

function UserProfile({ userId }) {
  const user = useUserData(userId);

  if (!user) return <p>Loading...</p>;

  return <h1>{user.name}</h1>;
}
```

Avoid:

```js
// UserProfile.js (Component with mixed logic)
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return <h1>{user.name}</h1>;
}
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
