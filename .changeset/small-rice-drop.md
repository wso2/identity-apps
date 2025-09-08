---
"@wso2is/common.users.v1": patch
"@wso2is/myaccount": patch
---

Fix issues in My Account user profile
- Refactors how user profile data is flattened and passed down to input fields
- Implements separate components for single-value email address and single-value mobile number fields.
- Centralizes profile data flattening logic to the common feature module - `common.users.v1`.
- Fixes an issue with not displaying boolean attribute fields in read-only mode.
