---
"@wso2is/admin.authentication-flow-builder.v1": minor
"@wso2is/admin.registration-flow-builder.v1": minor
"@wso2is/admin.server-configurations.v1": minor
"@wso2is/admin.flow-builder-core.v1": minor
"@wso2is/admin.core.v1": minor
"@wso2is/common.ui.v1": minor
"@wso2is/identity-apps-core": minor
"@wso2is/myaccount": minor
"@wso2is/console": minor
---

- Refactor `UserPreferencesProvider` and move it to a new `common.ui.v1` package.
- Refactor the existing usages.
- Persist the side panel state in the local storage.
 - https://github.com/wso2/product-is/issues/19315
- Close the Navbar when a fresh user tries out the new Self Sign Up composer.
