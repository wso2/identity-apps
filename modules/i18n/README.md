# WSO2 Identity Server - Internationalization (i18n) module for Identity apps.

This module contains the configs, helpers and translations required to make an identity app available in multiple languages.

Implemented on top of [i18next](https://www.i18next.com/) library.

## Install
Add following dependency in your package.json file.

`"@wso2is/i18n": "<VERSION>"`

## Build
```bash
pnpm build
```

## Running Tests
```bash
pnpm test
```

## Usage

### Initialize the module.

```tsx
import { I18n } from "@wso2is/i18n";

I18n.init(options, override, true, true)
    .then(() => {
        // On successful init.
    })
    .catch((error) => {
        // On error.
    });

```

Init function arguments:

| Parameter                 | Type                       | Default                           | Description                                       |
| :------------------------ |:--------------------------:| :---------------------------------| :-------------------------------------------------|
| options 	                | i18next.InitOptions        | undefined                         | Passed in init options.
| override                  | boolean                    | false                             | Should the passed in options replace the default.
| autoDetect                | boolean                    | false                             | If autodetect plugin should be used or not.
| useBackend                | boolean                    | false                             | If XHR back end plugin should be used or not.
| debug                     | boolean                    | false                             | If debug is enabled.
| framework                 | SupportedI18nFrameworks    | SupportedI18nFrameworks.REACT     | The framework to use.
| plugins                   | i18next.Module[]           | undefined                         | Other i18next plugins to use.

### Get the instance.

```ts
import { I18n } from "@wso2is/i18n";

const i18n = I18n.instance;
```

### Use in the provider

```tsx
import { I18nextProvider } from "react-i18next";
import { I18n } from "@wso2is/i18n";

return (
    <I18nextProvider i18n={ I18n.instance }>
        ...
    </I18nextProvider>
)
```

### Adding a new language to the module.

1. Create a folder with the language's ISO code inside `src/translations`. ex: `en-GB`
2. Create a `portals` folder and implement the common, myAccount, console, extensions etc. namespaces.
3. Create other folders such as `docs`, etc. and place the necessary translations.
4. Create a `meta.ts` file and add all the necessary metadata regarding the language bundle.

```ts
import { I18nModuleConstants } from "../../constants";
import { LocaleMeta } from "../../models";

export const meta: LocaleMeta = {
    code: "en-GB",
    flag: "gb",
    name: "English (United Kingdom)",
    namespaces: [
        I18nModuleConstants.COMMON_NAMESPACE,
        I18nModuleConstants.CONSOLE_PORTAL_NAMESPACE,
        I18nModuleConstants.MY_ACCOUNT_NAMESPACE,
        I18nModuleConstants.EXTENSIONS_NAMESPACE
    ]
};
```

5. Export the bundle from the index.

```ts
import * as portals from "./portals";
import { LocaleBundle } from "../../models";
import { meta } from "./meta";

export const EN_GB: LocaleBundle = {
    meta,
    resources: {
        portals
    }
};
```

### Adding a new language during runtime.
1. Create a folder with the language's ISO code inside the distribution directory. ex: For Console, the i18n bundle will be saved under `resources/i18n`. Create a folder `fr-FR` to store french language the translations.
2. Copy the translated JSON files.
3. Update the `meta.json` file.

```json
{
    "fr-FR": {
        "code": "fr-FR",
        "flag": "fr",
        "name": "Français (France)",
        "namespaces": [
            "common",
            "console",
            "myAccount",
            "extensions"
        ],
        "paths": {
            "common": "fr-FR/portals/common.json",
            "console": "fr-FR/portals/console.json",
            "myAccount": "fr-FR/portals/myAccount.json",
            "extensions": "fr-FR/portals/extensions.json"
        }
    }
}
```

## Translation Schema Validation

Namespace translation schemas are generated from the source of truth locale (`en-US`) and validated against all locale resources.

- Source translations: `src/translations/en-US/portals/*.json`
- Generated schemas: `src/models/schemas/namespaces/*.schema.json`
- Validation script: `scripts/validate-namespace-schemas.js`

Each translation namespace JSON file also includes a `$schema` property (for example,
`"$schema": "../../../models/schemas/namespaces/common.schema.json"`).
This enables real-time, IDE-agnostic JSON schema diagnostics in editors that support standard JSON Schema hints.

### Commands

```bash
# Regenerate namespace schemas from en-US.
pnpm generate:translation-schemas

# Sync $schema hints in locale translation files.
pnpm sync:translation-schema-hints

# Regenerate schemas and validate all locale namespace JSON files.
pnpm validate:translations
```

`pnpm build` now runs `pnpm validate:translations` first and fails fast when a locale namespace deviates from the schema.

During build packaging, the `$schema` metadata key is stripped from output translation bundles.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](../../LICENSE)), You may not use this file except in compliance with the License.
