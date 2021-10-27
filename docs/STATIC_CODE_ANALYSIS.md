# Static Code Analysis

## Linting

We use [ESLint](https://eslint.org/) as the primary linting tool, and it's important that you adhere to the
defined ruleset in the configuration.

Set up the ESLint plugin corresponding to the IDE/Code editor you are using. For more
information, follow the instructions [here](./DEVELOPER.md#setting-up-development-tools).

Always keep an eye out for the inline warnings and errors given out by the plugin.

### Running the linter

Execute the following commands based on the requirement to analyze the code with ESLint.

#### For the Entire Mono-repo

```bash
# Run this from the root.
npm run lint
```

#### For a specific module/app.

Navigate to the module/app you want to run the linter on, and execute the following command.

##### Example: To run linter on Console

```bash
cd apps/console
npm run lint
```

or

```bash
npx lerna run lint --scope @wso2is/console --stream
```

##### Example: To run linter on React Components

```bash
cd modules/react-components
npm run lint
```

or

```bash
npx lerna run lint --scope @wso2is/react-components --stream
```

#### For a specific folder or a file.

The script `lint:targeted` is meant to be used if you need to run the linter on a specific folder or file inside an app or a module.

##### Example: To run linter on `features/applications` inside the Console

```bash
cd apps/console
npm run lint:targeted -- src/features/applications
```

##### Example: To run linter on `basic-application.spec.ts` test file inside the integration test suite.

```bash
cd tests
npm run lint:targeted -- integration/applications/basic-application.spec.ts
```
