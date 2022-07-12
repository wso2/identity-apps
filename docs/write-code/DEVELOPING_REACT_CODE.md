# Developing React Code

## Writing Components

### Conditional Rendering

The return from an component should always be a `ReactElement` or `null`. Always be careful when doing
[conditional rendering][react-conditional-rendering] with `&&` operator. If the component returns undefined, React
will break the rendering as of now.

:white_check_mark: Do

```typescript
export const SignOnMethods: FunctionComponent<SignOnMethodsPropsInterface> = (
    props: SignOnMethodsPropsInterface
): ReactElement => {

    ...

    return (
        someCondition
            ? <SignOnMethodsContent />
            : null
    );
}
```

:x: Don't

```typescript
export const SignOnMethods: FunctionComponent<SignOnMethodsPropsInterface> = (
    props: SignOnMethodsPropsInterface
): ReactElement => {

    ...

    return someCondition && <SignOnMethodsContent />;
}
```
