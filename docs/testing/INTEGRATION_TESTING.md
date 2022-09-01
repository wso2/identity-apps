# Integration Tests

Product integration tests have been written using [Cypress Testing Framework](https://www.cypress.io/) and you can run the test suites using the following command.

## Running the test suite

### Headless mode

```bash
pnpm test:integration
```

### Interactive mode

```bash
pnpm test:integration:interactive
```

### Only Smoke Tests

```bash
pnpm test:integration:smoke
```

For more information regarding the test module, checkout the [README](../../tests/README.md) in the `tests` module.
