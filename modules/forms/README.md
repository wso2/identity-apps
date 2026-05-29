# WSO2 Identity Server - Unified Form Library

## Overview

`@wso2is/forms` is the unified form library for WSO2 Identity Server frontend applications. It consolidates the following previously separate packages:

- **`@wso2is/form`** — React Final Form wrappers with Oxygen UI / MUI field adapters (now the main API)
- **`@wso2is/forms`** — Legacy Semantic UI form components (available at `@wso2is/forms/legacy`)
- **`@wso2is/dynamic-forms`** — Dynamic form rendering components (available at `@wso2is/forms/legacy`)

## Usage

Import the main form components from `@wso2is/forms`:

```typescript
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/forms";
```

Legacy Semantic UI form components can be imported from the legacy subpath:

```typescript
import { Forms, Field, Validation } from "@wso2is/forms/legacy";
```

**Do not use legacy components in new code.**
