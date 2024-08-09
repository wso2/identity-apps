# Formatting

We have already added few [ESLint rules](../../.eslintrc.js) to ensure consistent formatting across the entire codebase.
Please make sure you adhere to the specified rules and also follow the following set of common formatting practices while developing components.

## Ternary Expressions

Typescript allows operands of ternary expressions to be separated by newlines, which can improve the readability of your program.

:white_check_mark: Do

**Single Line**

```typescript
foo > bar ? value1 : value1
```

**Multiline**

```typescript
foo > bar
    ? value1
    : value1
```

:x: Don't

```typescript
foo > bar ? value1
    : value1
```
