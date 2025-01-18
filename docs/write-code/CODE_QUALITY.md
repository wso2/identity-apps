# Ensuring Code Quality

This is an evolving documentation on the best practices for writing readable, functional and maintainable frontend code. Everyone contributing to identity-apps repository is expected to go through this document and get a better understanding on the best practices to follow.

> Make sure that you set up the required developer tools as mentioned [here](../SET_UP_DEV_ENVIRONMENT.md#setting-up-development-tools) before starting off with the coding.

## Refrain from using `defaultProps`

## Refrain from using the `hasRequiredScopes` function. Use `useRequiredScopes` wherever possible.

## Avoid using semantic UI classes as much as possible.

## Avoid using named exports. Use default exports instead

## Use ReactFinalForm instead of modules/form or modules/forms when implementing new forms.

## Refrain from using 	`any` as a type. Use it as the last resort.

## Avoid using data-testid / TestableComponentInterface. Use IdentifiableComponentInterface instead.

## Get the UI text reviewed by the documentation team.

## Make sure to get the UI/UX reviewed with the team before jumping into implementation.

## Enable running eslint on file save

## Make sure to add changeset if you want a new version released with your changes. Carefully review the type of changes to each module and specify the version bump type in changeset accordingly.

## Use constants for string literals wherever possible.

## If you are doing a behavioral change to the repo (changes to development process, changes to product behaviour etc,), make sure to update the PR with relevant references. This will come in handy when looking back at the code in a few years.

## Use clear variable names

## Use `classnames` package for conditionally applying class names to UI elements

## Refrain from using index files, as it leads to increased bundle sizes and circular dependencies


## Use modern js features to keep the code concise and readable. Eg: optional chaining instead of chained &&

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
