# @wso2is/common.users.v1

## 1.0.1

### Patch Changes

- [#9049](https://github.com/wso2/identity-apps/pull/9049) [`05f44475ebd8157f81a305fbf3759864a98fbb47`](https://github.com/wso2/identity-apps/commit/05f44475ebd8157f81a305fbf3759864a98fbb47) Thanks [@github-actions](https://github.com/apps/github-actions)! - Fix issues in My Account user profile
  - Refactors how user profile data is flattened and passed down to input fields
  - Implements separate components for single-value email address and single-value mobile number fields.
  - Centralizes profile data flattening logic to the common feature module - `common.users.v1`.
  - Fixes an issue with not displaying boolean attribute fields in read-only mode.

## 1.0.0

### Major Changes

- [#9029](https://github.com/wso2/identity-apps/pull/9029) [`be07e5f25394a7e0f06f41997ed51c226027a03c`](https://github.com/wso2/identity-apps/commit/be07e5f25394a7e0f06f41997ed51c226027a03c) Thanks [@JayaShakthi97](https://github.com/JayaShakthi97)! - Rename feature: features/common.ui.profile.v1 -> features/common.users.v1
