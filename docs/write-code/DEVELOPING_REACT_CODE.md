# Developing React Code

## Writing Components

### Ordering

When writing React components, follow the below ordering pattern for better readability.

```jsx

export const Component: FunctionComponent<ComponentPropsInterface> = (
  props: ComponentPropsInterface
): ReactElement => {

  // 1. Prop restructuring
  const {
    children,
    "data-componentid": componentId
  } = props;

  // 2. Refs
  const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  // 3. Other custom & third party hooks.
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getLink } = useDocumentation();
  const { isGreaterThanComputerViewport } = useMediaContext();

  // 4. Redux selectors
  const theme: string = useSelector((state: AppState) => state.config.ui.theme?.name);

  // 5. State declarations.
  const [ isAvailable, setIsAvailable ] = useState<boolean>(false);

  // 6. Memo hooks
  const isReadOnly = useMemo(() => {
      // do something
  } , []);

  // 7. useEffect Hooks with empty dependency array.
  useEffect(() => {
      // do something
  }, []);

  // 8. useEffect Hooks with non-empty dependency array.
  useEffect(() => {
      // do something
  }, [ isReadOnly ]);

  // 9. Functions.
  const noop = (): string | null => {
    return null;
  };

  // 10. Return of the function.
  return (
    <div>My Awesome Component.</div>
  )
};
```

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
