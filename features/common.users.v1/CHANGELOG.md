# @wso2is/common.users.v1

## 1.0.4

### Patch Changes

- [#9273](https://github.com/wso2/identity-apps/pull/9273) [`8c22c1643d0fec6d23a4e32d89dff8280c5f343b`](https://github.com/wso2/identity-apps/commit/8c22c1643d0fec6d23a4e32d89dff8280c5f343b) Thanks [@JayaShakthi97](https://github.com/JayaShakthi97)! - Fix issues in User Profile multi valued text field

## 1.0.3

### Patch Changes

- [#9081](https://github.com/wso2/identity-apps/pull/9081) [`a97a74480293e24fa031bb905cb70329282078ef`](https://github.com/wso2/identity-apps/commit/a97a74480293e24fa031bb905cb70329282078ef) Thanks [@brionmario](https://github.com/brionmario)! - Introduce `End` node to Flows

## 1.0.2

### Patch Changes

- [#9052](https://github.com/wso2/identity-apps/pull/9052) [`00860d487e6a193e990def381194598ebe326452`](https://github.com/wso2/identity-apps/commit/00860d487e6a193e990def381194598ebe326452) Thanks [@JayaShakthi97](https://github.com/JayaShakthi97)! - Fix attribute mapping issues in Add User wizard

## 1.0.1

### Patch Changes

- [#9038](https://github.com/wso2/identity-apps/pull/9038) [`262799599950b401142f81c161fc26bbf688ee9c`](https://github.com/wso2/identity-apps/commit/262799599950b401142f81c161fc26bbf688ee9c) Thanks [@JayaShakthi97](https://github.com/JayaShakthi97)! - Fix issues in My Account user profile
  - Refactors how user profile data is flattened and passed down to input fields
  - Implements separate components for single-value email address and single-value mobile number fields.
  - Centralizes profile data flattening logic to the common feature module - `common.users.v1`.
  - Fixes an issue with not displaying boolean attribute fields in read-only mode.

## 1.0.0

### Major Changes

- [#9022](https://github.com/wso2/identity-apps/pull/9022) [`ae7f142e91e36fe3aba2788a0bfd68b895db82a8`](https://github.com/wso2/identity-apps/commit/ae7f142e91e36fe3aba2788a0bfd68b895db82a8) Thanks [@JayaShakthi97](https://github.com/JayaShakthi97)! - Rename feature: features/common.ui.profile.v1 -> features/common.users.v1
