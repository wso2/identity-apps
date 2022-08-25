# Ensuring Code Quality

Make sure that you set up the required developer tools as mentioned [here](../SET_UP_DEV_ENVIRONMENT.md#setting-up-development-tools) before starting off with the coding.

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