# Write Code

Follow this guide to learn about our coding style and tips on writing maintainable code.

## Ensuring Code Quality

Make sure that you set up the required developer tools as mentioned [here](../SET_UP_DEV_ENVIRONMENT.md#setting-up-development-tools) before
starting off with the coding.

## React Rules of Thumb

### Writing Components

#### Conditional Rendering

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

## Formatting

We have already added few [ESLint rules](../../.eslintrc.js) to ensure consistent formatting across the entire codebase.
Please make sure you adhere to the specified rules and also follow the following set of common formatting practices while developing components.

### Ternary Expressions

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

## Ensuring performance

We care a lot about maintaining the performance of our applications. Hence, it is your duty to make sure that the code you
write follows the standards and does not diminish the existing performance levels.

In-order to ensure this, please follow the following steps while making your contributions.

### Use code splitting

Webpack and React supports code splitting out of the box. Try to always leverage these features to reduce bundle size and performance.

- Read more about Webpack Code Splitting [here](https://webpack.js.org/guides/code-splitting/).
- Read more about React Code Splitting [here](https://reactjs.org/docs/code-splitting.html).

### Take advantage of tree shaking

Webpack's treeshaking is a really awesome feature to get rid of dead code. Always try to take advantage of that.

:white_check_mark: Do

```typescript
import get from "lodash-es";
```

:x: Don't

```typescript
import * as _ from "lodash-es";
```

### Don't write redundant code

Unnecessary code will bulk up the bundle without you even realizing. Always try to avoid scenarios like the following.

#### Redundant optional chain

:x: Don't

```typescript
if (user?.email && user?.email?.home) {
    ...
}
```

When the above block is transpiled, it is converted to the following.

```javascript
if ((user === null || user === void 0 ? void 0 : user.email) && ((_a = user === null || user === void 0 ? void 0 : user.email) === null || _a === void 0 ? void 0 : _a.home)) {
}
```

Notice that the first null check is redundant. It can be re-written as follows.

:white_check_mark: Do

```typescript
if (user?.email?.home) {
    ...
}
```

Following is the transpiled version of the above code block. The footprint is significantly less.

```javascript
if ((_a = user === null || user === void 0 ? void 0 : user.email) === null || _a === void 0 ? void 0 : _a.home) {
}
```

:bulb: Always remember, more characters means more bytes.

### Carefully adding new dependencies

Dependencies carry a heavy wait and contribute in a significant amount for the overall bundle size. So, when adding a new
library to the project try to answer the following questions.

Q1. Is the library absolutely required?

In some cases, you will be able to manually write the code rather than using a library. But keep in mind not to re-invent the wheel as well.

Q2. Is the library actively maintained?

Go to the NPM registry and GitHub repository of the prospective library and check for stats like downloads, stars, last published dates,
issues etc. This will give you an understanding on the state of the library.

:bulb: Never add a dependency that is not actively maintained.

Q3. Have you considered other libraries?

Do a benchmark and test other related libraries.

Q4. What is the size of the library?

You can easily check the size of the library by using an online tool like [Bundlephobia](https://bundlephobia.com/).

![bundlephobia-sample](../assets/bundlephobia-sample.jpg)

Q5. What are the dependencies used inside the library?

Some library developers include relatively large dependencies like [`lodash`](https://lodash.com/), [`moment`](https://momentjs.com/) etc. in their libraries as dependencies.
Adding these will result in increase bundle sizes. Check in the `package.json` for the dependencies used inside the library.

Q6. What is the footprint introduced by the newly added library?

We have added a script to analyze the bundle sizes of our react applications using [Webpack Bundle Analyzer Plugin](https://www.npmjs.com/package/webpack-bundle-analyzer).

Use the following command to examine the footprint introduced by the prospective library.

#### Analyze for Console

:bulb: The analyzer will open in http://localhost:8889

```shell
npx lerna run build:analyze --scope @wso2is/console
```

#### Analyze for My Account

:bulb: The analyzer will open in http://localhost:8888

```shell
npx lerna run build:analyze --scope @wso2is/myaccount
```

Once you execute the above command, the resulting view will look something like the following.

![webpack-analyzer-sample](../assets/webpack-analyzer-sample.jpg)

### Optimize static assets

When adding new assets, always check the existing once in the theme and only proceed if the desired asset is not available.

#### Adding Images

When adding images, always try to add SVGs which are optimized for web.

#### Prepend unused arguments with `_`

There might be times when you have to leave an argument unused in a function, especially when writing extension configs. This will prompt the linter to throw a warning.
To avoid this, always prepend the unused argument with `_`.

```TypeScript
const printAge(_name: string, age: number){
    console.log(age);
}
```

## Ensuring a good user experience
We follow certain development practices to ensure the applications provide a good user experience. Please make sure you adhere to the following guidelines.

### Disable submit buttons until the submission is complete
When the submit button in a form is clicked, usually an API call is sent to persist the changes. However, during the API call, if the submit button remains enabled, then the users will be able to click on it as many times as they want, which will result in multiple API calls.

To avoid this, disable the submit button until the API call is complete. While disabling the button, to provide a better UX, it is also advisable top show a loading indicator in the button.

```TypeScript
const SampleComponent = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const apiCall = (): void {
        setIsSubmitting(true);

        callAPI().then((response) => {
            // handle response
        }).error((error)=>{
            // handle error
        }).finally(()=>{
            setIsSubmitting(false);
        });
    }

    return (
        <div>
            <PrimaryButton loading={ isSubmitting } disabled={ loading }> Submit </PrimaryButton>
        </div>
    )
```

## Styling

### Forms
Always use the new [@wso2is/form](../../modules/form) module when developing forms.

Read the documentation [here](../FORMS.md).

#### Sectioned Form

When styling the forms, avoid using any ad-hoc Headings, Dividers etc.
If you wish to write a form with sub-sections, use the [FormSection](../../modules/react-components/src/components/forms/form-section.tsx) component.
It will add a divider and a Heading with a constant emphasis level.

##### Usage

```tsx
<FormSection heading=“Permissions”>
    <Field.Input
        ariaLabel="scopes"
        inputType="text"
        name="scopes"
        …
    />
    <Field.Input
        ariaLabel="user data"
        inputType="text"
        name="userData"
        …
    />
<FormSection>
```

##### Output

![form-section](../assets/forms-section.png)

[react-conditional-rendering]: https://reactjs.org/docs/conditional-rendering.html
