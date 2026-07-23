---
"@wso2is/admin.users.v1": patch
"@wso2is/console": patch
---

Switch the user profile locale field between the limited set of bundled languages (plain dropdown) and the full, searchable locale catalog from `@wso2is/core` (Autocomplete), controlled by the existing `enableLegacyLocaleDropdown` config, matching the email/SMS template locale dropdown behavior.
