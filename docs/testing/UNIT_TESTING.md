# Unit Tests

Product Unit tests have been implemented using [Jest](https://jestjs.io/) along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro).
Make sure to write unit tests when you are working on new or existing features.

## Structuring Tests

Tests should be properly structured. Checkout the following examples.

### Example 01

Let's say that you have a component called `applications-page.tsx` at the root of `features/applications` that needs to be tested.

#### Steps

1. Create a `__tests__`(underscore-underscore-tests-underscore-underscore 😉) under `features/applications`.
2. Create a file with the pattern `<FILE_NAME>.test.<FILE_EXTENSION>` inside the `__tests__` folder. (In this case `applications-page.test.tsx`).

>> Naming the test container folders `__tests__` This pattern seems to be the best when there)

#### Folder Structure

```
features
└── applications
    ├── __tests__
    |       └── applications-page.test.tsx
    └── applications-page.tsx
```

### Example 02

Let's say that you have a component called `applications-list.tsx` at the root of `features/applications/components` that needs to be tested.

#### Steps

1. Create a `__tests__` under `features/applications/components`.
2. Create a file with the pattern `<FILE_NAME>.test.<FILE_EXTENSION>` inside the `__tests__` folder. (In this case `applications-list.test.tsx`).

#### Folder Structure

```bash
features
└── applications
    ├── __tests__
    ├── components
    |       └── __tests__
    |       |       └── applications-list.test.tsx
    |       └── applications-list.tsx
    └── applications-page.tsx
```

## Writing Tests

Writing unit tests for every component that you develop is mandatory.
Take a look at the following example test case where we test if the component that we are writing mounts and renders as expected.

⚠️ There are several ESLint plugins ([eslint-plugin-jest-dom][eslint-plugin-jest-dom], [eslint-plugin-testing-library][eslint-plugin-testing-library]) configured to make sure that developers follow the best practices.
Please configure ESLint in your coding environment if you haven't already done so by [following this guide][eslint-ide-plugin-setup-guide].

```tsx
import { render, screen } from "@unit-testing";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { ApplicationList } from "../../../components/applications";

describe("Test if the Application List is working as expected", () => {
    it("<ApplicationList /> renders without exploding", () => {
        render(<ApplicationList />);
        expect(screen.getByTestId("application-list")).toBeInTheDocument();
    });
});
```

:bulb: Note that we use a custom `render` function here rather than from the `@testing-library/react` module. The reason for
this is that we need to wrap our components with providers like `Redux` etc. And doing this in every test case is a
tedious task. So we have written a custom renderer following the guide in
[official documentation][react-testing-library-custom-renderer]. `@unit-testing` is a webpack alias added to avoid importing this function using relative paths.

### Identifying Elements in DOM

As a practice we use `data-componentid` inorder to make our tests resilient to change.
Use the [getByTestId](https://testing-library.com/docs/queries/bytestid/) method to access with the component id.

#### Example: Assert on components with `getByTestId`.

```typescript jsx
expect(component.getByTestId("getting-started-page-layout")).toBeInTheDocument();
```

:no_entry: Never use any other selectors such as `id`, `classes`, etc. to identify the elements.

If there are no `data-componentid` present in the element, extend the [IdentifiableComponentInterface](../../modules/core/src/models/core.ts) from `@wso2is/core/models` to inherit the attribute.

#### Example: Inheriting `data-componentid`

```typescript jsx

export interface SampleComponentInterface extends IdentifiableComponentInterface {

    // Other attributes
}

export const SampleComponent: FunctionComponent<SampleComponentInterface> = (
    props: SampleComponentInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId,
        // Other props
    } = props;
}

```

:warning: Some components might have the `data-testid` already implemented using the [TestableComponentInterface](../../modules/core/src/models/core.ts).
This interface and the data attribute since has been **deprecated**. Hence, :boom: **DO NOT USE IT** in new components. Refactor the usage where ever possible.

### Testing API Calls

We have used [msw][msw] to mock the APIs. The mock implementation root for the core can be found at `<APP_ROOT>/test-configs/__mocks__/server`.
If you need to add further endpoint mocks, add them in the `handlers.ts`.

#### Extended Features

The mock implementation root for the extensions can be found at `<APP_ROOT>/src/extensions/test-configs/__mocks__/server`.
Add any extended API endpoint mocks in the `handlers.ts`.

💡Checkout these references if you want to learn more about API mocking.

### Snapshot Testing

Snapshot tests are a very useful tool whenever you want to make sure your UI does not change unexpectedly.

A typical snapshot test case renders a UI component, takes a snapshot, then compares it to a reference snapshot file stored alongside the test. The test will fail if the two snapshots do not match: either the change is unexpected, or the reference snapshot needs to be updated to the new version of the UI component.

```tsx
import { render } from "@unit-testing";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { ApplicationList } from "../../../components/applications";

it("<ApplicationList /> matches snapshot", () => {
    const { container } = render(<ApplicationList />);

    expect(container).toMatchSnapshot();
});
```

For further reference, checkout the official documentation of [React Testing Library][react-testing-library].

## Running the test suite

Following are few of the useful commands that you can use to run the existing unit tests for modules.

### Run the full test suite

```bash
# From project root.
npm run test
```

#### Run the full test suite in watch mode

```bash
# From project root.
npm run test:watch
```

### Run Tests for a specific test file

```bash
# From console root
npm run test ./src/features/applications/__tests__/applications-page.test.tsx
```

### Run Tests for a specific test file in watch mode

```bash
# From console root
npm run test -- --watch ./src/features/applications/__tests__/applications-page.test.tsx
```

### Run Tests for an individual module

#### Using Lerna

```bash
# From anywhere inside the project.
npx lerna run test --scope @wso2is/forms
```

#### From the project root.

```bash
# Run tests for modules.
npm run test:unit:modules
```

```bash
# Run tests for apps.
npm run test:unit:apps
```

```bash
# Run tests for specific module. (Replace <MODULE_NAME> with something like `@wso2is/core` or `@wso2is/myaccount`)
npm run test:unit:<MODULE_NAME>
```

#### From inside respective module.

```bash
# From inside component ex: apps/console. Use `npm run test:watch for watch mode.
npm run test
```

## Code Coverage

### Generate coverage report

```bash
# From the root of the project.
npm run test:unit:coverage
```

## References

- Common
    - [Common mistakes with React Testing Library][common-mistakes-with-react-testing-library] Blog by Kent C. Dodds 
    - [Fix the "not wrapped in act(...)" warning][fix-the-not-wrapped-in-act-warning] Blog by Kent C. Dodds
- API Mocking
    - [Stop mocking fetch][stop-mocking-fetch] Blog by Kent C. Dodds
    - [Use Mock Service Worker and Test Like a User][use-mock-Service-worker] Video Tutorial by Leigh Halliday

<!--- Local Links -->
[eslint-ide-plugin-setup-guide]: ../SET_UP_DEV_ENVIRONMENT.md#eslint-ide-plugin

<!--- Remote Links -->
[react-testing-library]: https://testing-library.com/docs/
[react-testing-library-custom-renderer]: https://testing-library.com/docs/react-testing-library/setup#custom-render
[common-mistakes-with-react-testing-library]: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-wrapper-as-the-variable-name-for-the-return-value-from-render
[stop-mocking-fetch]: https://kentcdodds.com/blog/stop-mocking-fetch
[fix-the-not-wrapped-in-act-warning]: https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
[eslint-plugin-jest-dom]: https://github.com/testing-library/eslint-plugin-jest-dom
[eslint-plugin-testing-library]: https://github.com/testing-library/eslint-plugin-testing-library
[msw]: https://mswjs.io/
[use-mock-Service-worker]: https://www.youtube.com/watch?v=v77fjkKQTH0
