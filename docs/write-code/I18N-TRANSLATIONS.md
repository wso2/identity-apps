# Adding a new i18n namespace and using it in the My Account and Console apps

This guide explains how to introduce a new i18n namespace for a feature and wire it into both the My Account and Console apps.

The steps below are generic and can be followed to add any new namespace (e.g., my-feature) and consume it from the My Account and Console applications.

---

## Overview

You will:

1. Declare the namespace key in the i18n module constants.
2. Define a TypeScript model for the namespace (for type-safe translations).
3. Add translations for each supported locale and export them.
4. Register the namespace in each locale’s metadata.
5. Wire the namespace in each app so it loads at runtime:
   - 5a) My Account
   - 5b) Console
6. Use the new translations in app code.

---

## 1) Declare the namespace in the i18n module constants

Add a constant for your new namespace in the i18n module. Example for a shared users namespace:

File: modules/i18n/src/constants.ts
```ts
export class I18nModuleConstants {
    // ...
    /**
     * Common Users namespace.
     */
    public static readonly COMMON_USERS_NAMESPACE: string = "commonUsers";
    // ...
}
```

Guidelines:
- Constant name: clear and descriptive (e.g., COMMON_USERS_NAMESPACE).
- Namespace string: concise, camelCase (this is the i18next namespace key).

---

## 2) Define a namespace model (TypeScript interface)

Add a model describing the shape of your translation keys for type safety:

File: modules/i18n/src/models/namespaces/common-users-ns.ts
```ts
export interface CommonUsersNS {
    forms: {
        profile: {
            generic: {
                validation: {
                    duplicate: string;
                    invalidFormat: string;
                };
            };
        };
    };
}
```

Export it from the model barrel file:

File: modules/i18n/src/models/namespaces/index.ts
```ts
export * from "./common-users-ns";
```

Naming conventions:
- Use hyphenated filenames for namespaces (e.g., common-users-ns.ts).
- Use PascalCase for the TypeScript interface (e.g., CommonUsersNS).

---

## 3) Add translations for each supported locale

For each locale, add a file under the portals folder with the hyphenated namespace name and export it. Example for en-US:

File: modules/i18n/src/translations/en-US/portals/common-users.ts
```ts
import { CommonUsersNS } from "../../../models/namespaces/common-users-ns";

/* eslint-disable max-len */
export const commonUsers: CommonUsersNS = {
    forms: {
        profile: {
            generic: {
                validation: {
                    duplicate: "{{field}} can not have duplicate values.",
                    invalidFormat: "The format of the {{field}} entered is incorrect."
                }
            }
        }
    }
};
```

Repeat for other locales you support (e.g., de-DE, es-ES, fr-FR, ja-JP, pt-BR, pt-PT, si-LK, ta-IN), following the same structure and keys.

Then, export the namespace from each locale’s portals/index.ts:

File: modules/i18n/src/translations/<locale>/portals/index.ts
```ts
export * from "./common-users";
```

---

## 4) Register the namespace in each locale’s meta

Each locale has a meta.ts that lists the namespaces loaded for that locale. Add the new namespace constant to the namespaces array. For example:

File: modules/i18n/src/translations/en-US/meta.ts
```ts
export const meta: LocaleMeta = {
    // ...
    namespaces: [
        I18nModuleConstants.COMMON_NAMESPACE,
        I18nModuleConstants.MY_ACCOUNT_NAMESPACE,
        I18nModuleConstants.EXTENSIONS_NAMESPACE,
        I18nModuleConstants.AGENTS_NAMESPACE,
        I18nModuleConstants.FLOWS_NAMESPACE,
        I18nModuleConstants.COMMON_USERS_NAMESPACE
    ]
};
```

Repeat for all other locales you support.

Notes:
- If a locale doesn’t include the namespace in its meta.ts, i18next won’t attempt to load that namespace’s resources for that locale.

---

## 5a) Wire the namespace in the My Account app

Expose the namespace in the My Account app’s i18n constants and map it to the correct bundle directory (typically "portals"):

File: apps/myaccount/src/constants/i18n-constants.ts
```ts
export class I18nConstants {
    /**
     * Common namespace shared by applications.
     */
    public static readonly COMMON_NAMESPACE: string = I18nModuleConstants.COMMON_NAMESPACE;

    /**
     * Users namespace common to applications.
     */
    public static readonly COMMON_USERS_NAMESPACE: string = I18nModuleConstants.COMMON_USERS_NAMESPACE;

    /**
     * Locations of the I18n namespaces.
     */
    public static readonly BUNDLE_NAMESPACE_DIRECTORIES: Map<string, string> = new Map<string, string>([
        [ I18nConstants.COMMON_NAMESPACE, "portals" ],
        [ I18nConstants.PORTAL_NAMESPACE, "portals" ],
        [ I18nConstants.COMMON_USERS_NAMESPACE, "portals" ]
    ]);
}
```

Include the namespace in the i18n initialization so it’s loaded by i18next:

File: apps/myaccount/src/configs/app.ts
```ts
load: "currentOnly", // lookup only current lang key (en-US). Prevents 404 from `en`.
ns: [
    I18nConstants.COMMON_NAMESPACE,
    I18nConstants.PORTAL_NAMESPACE,
    I18nConstants.COMMON_USERS_NAMESPACE
],
preload: [ "si-LK", "fr-FR" ]
```

---

## 5b) Wire the namespace in the Console app

Expose the namespace in Console’s i18n constants and map it to the bundle directory:

File: features/admin.core.v1/constants/i18n-constants.ts
```ts
export class I18nConstants {
    // ...
    /**
     * Common Users namespace.
     */
    public static readonly COMMON_USERS_NAMESPACE: string = I18nModuleConstants.COMMON_USERS_NAMESPACE;

    /**
     * Locations of the I18n namespaces.
     */
    public static readonly BUNDLE_NAMESPACE_DIRECTORIES: Map<string, string> = new Map<string, string>([
        // ...
        [ I18nConstants.AGENTS_NAMESPACE, "portals" ],
        [ I18nConstants.FLOWS_NAMESPACE, "portals" ],
        [ I18nConstants.COMMON_USERS_NAMESPACE, "portals" ]
    ]);
}
```

Add the namespace to the i18n initialization config for Console:

File: features/admin.core.v1/configs/app.ts
```ts
ns: [
    // ...
    I18nConstants.WEBHOOKS_NAMESPACE,
    I18nConstants.APPROVAL_WORKFLOWS_NAMESPACE,
    I18nConstants.AGENTS_NAMESPACE,
    I18nConstants.FLOWS_NAMESPACE,
    I18nConstants.COMMON_USERS_NAMESPACE
],
preload: []
```

---

## 6) Use the translations in app code

Preferred usage: call useTranslation() without specifying a namespace, and reference namespaced keys with the ns:key pattern.

```tsx
import { useTranslation } from "react-i18next";

export const Example = () => {
    const { t } = useTranslation();

    return (
        <span>
            { t("commonUsers:forms.profile.generic.validation.duplicate", { field: "Emails" }) }
        </span>
    );
};
```

Notes:
- Prefix the key with the namespace (e.g., commonUsers:...) when you don’t pass a namespace to useTranslation().
- Interpolation works as usual via the second argument (e.g., { field: "Emails" }).

Alternative (also supported): pass the namespace and use bare keys.
```tsx
const { t } = useTranslation("commonUsers");
t("forms.profile.generic.validation.invalidFormat", { field: "Phone number" });
```

---

## Naming, structure, and conventions

- Namespace constant: Add to I18nModuleConstants (e.g., MY_FEATURE_NAMESPACE: "myFeature").
- Model interface:
  - File: modules/i18n/src/models/namespaces/<namespace>-ns.ts
  - Example: common-users-ns.ts
  - Export via the barrel (index.ts).
- Translations:
  - File: modules/i18n/src/translations/<locale>/portals/<namespace>.ts
  - Example: common-users.ts exporting const commonUsers: CommonUsersNS = { ... }.
- Exports: Update each locale’s portals/index.ts with export * from "./<namespace>";
- Meta: Add your namespace to each locale’s meta.ts namespaces array.
- App wiring:
  - My Account: apps/myaccount/src/constants/i18n-constants.ts and apps/myaccount/src/configs/app.ts
  - Console: features/admin.core.v1/constants/i18n-constants.ts and features/admin.core.v1/configs/app.ts

---

## Verification checklist

General
- [ ] All locales include the new namespace in meta.ts.
- [ ] Each locale’s portals/index.ts exports the new namespace file.
- [ ] Translations load without 404s; keys resolve with t("commonUsers:...").

My Account
- [ ] BUNDLE_NAMESPACE_DIRECTORIES includes the new namespace mapped to "portals".
- [ ] i18n config ns includes I18nConstants.COMMON_USERS_NAMESPACE.

Console
- [ ] BUNDLE_NAMESPACE_DIRECTORIES includes the new namespace mapped to "portals".
- [ ] i18n config ns includes I18nConstants.COMMON_USERS_NAMESPACE.

---

## Reference

- Commit (namespace + translations + wire to My Account): https://github.com/wso2/identity-apps/commit/fbc6986ba5e65c5ed008b7fe5358d1a1eef7d17f
- Commit (wire to Console): https://github.com/wso2/identity-apps/commit/3ef96a7fecc0ccef3c3da3b203707ed2bfba5fa0
