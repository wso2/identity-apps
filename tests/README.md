# WSO2 Identity Server - Integration Test Suite

This module contains all the integration test suites written for Identity Apps.
These tests are written using [Cypress Testing Framework](https://www.cypress.io/) and are meant to make sure that the UI components are integration with each other and the backend APIs as expected.

## Test Suites

This package currently covers the following test suites.

|  Suite Name | Path |
| :------------ |:-------------
| Applications[WIP]      | integration/applications |
| Email Templates      | integration/email-templates |
| Groups[WIP]     | integration/groups |

## Configure Test Suites

Tests can be configured to be selectively run using the configuration file(`test-suite.config.json`).

Following is a sample configuration.

```json
{
    "suites": [
        {
            "name": "applications",
            "skip": true,
            "path": "./integration/applications/**",
            "smokeOnly": false,
            "smokeTestPath": "./integration/applications/smoke.spec.ts"
        }
    ]
}
```

 - `name` - Name of the test suite.
 - `skip` - Flag to skip the test suite.
 - `path` - Path to discover the tests. (if a folder is defined, `/**` wildcard is required here)
 - `smokeOnly` - Flag to only run the smoke test.
 - `smokeTestPathsmokeTestPath` - Smoke test spec path.

## Run the Tests

Use the following commands to run the test suites form inside the root of the `tests` module.(If you want to run tests from `identity-apps` root, checkout the [README](../README.md) at the root)

#### Headless mode

```bash
pnpm test or pnpm test:headless
```

#### Interactive mode

```bash
pnpm test:interactive
```

#### Smoke tests only

```bash
pnpm test:smoke
```
