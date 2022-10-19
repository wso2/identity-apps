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
pnpm lint
```

#### For a specific module/app.

##### Example: To run linter on Console

```bash
cd apps/console
pnpm lint
```

or

```bash
# From anywhere in the project.
pnpm nx run console:lint
```

##### Example: To run linter on React Components

```bash
cd modules/react-components
pnpm lint
```

or

```bash
# From anywhere in the project.
pnpm nx run react-components:lint
```

#### For a specific folder or a file.

The script `lint:targeted` is meant to be used if you need to run the linter on a specific folder or file inside an app or a module.

##### Example: To run linter on `features/applications` inside the Console

```bash
cd apps/console
pnpm lint:targeted -- src/features/applications
```

##### Example: To run linter on `basic-application.spec.ts` test file inside the integration test suite.

```bash
cd tests
pnpm lint:targeted -- integration/applications/basic-application.spec.ts
```

### Auto-fixing Issues

ESLint has the ability to [auto-fix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) certain warnings and errors.

This can be done using the **CLI** as well as via the IDE/Code Editor using the integrated ESLint Plugin.

Execute the following commands to auto-fix possible issues using the **CLI**.

#### Auto-fix issues in the entire Mono-repo

```bash
# Run this from the root.
pnpm lint:autofix
```

#### Auto-fix issues in a specific module/app.

##### Example: To fix issues in Core module

```bash
cd modules/core
pnpm lint:autofix
```

#### Auto-fix issues in a specific folder or a file.

##### Example: To fix issues in `api` directory inside the My Account

```bash
cd apps/myaccount
pnpm lint:targeted -- src/api --fix
```

##### Example: To fix issues in `url-utils.ts` file inside the Core module.

```bash
cd modules/core
pnpm lint:targeted -- src/utils/url-utils.ts --fix
```
