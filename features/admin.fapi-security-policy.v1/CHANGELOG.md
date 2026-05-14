# @wso2is/admin.fapi-security-policy.v1

## 1.0.0

### Major Changes

- [`264546c83b012941bcf09d51e06fa88bb0d6419e`](https://github.com/wso2/identity-apps/commit/264546c83b012941bcf09d51e06fa88bb0d6419e) Thanks [@vimukthiRajapaksha](https://github.com/vimukthiRajapaksha)! - Introduce the FAPI Security Policy configuration module

  Adds a new feature module for configuring Financial-grade API (FAPI) security policies. The module includes:

  - `FapiSecurityPolicyConfigurationPage` — top-level page for managing FAPI security policy settings
  - `FapiEnforcementSettings` — reusable component for toggling FAPI enforcement and selecting an active FAPI profile
  - `SupportedFapiProfiles` — component for displaying and selecting among supported FAPI profiles
  - `useGetFapiConfig` / `useGetDcrFapiConfig` — SWR-based hooks for fetching server-level and DCR FAPI configurations
  - `updateFapiConfig` / `updateDcrFapiConfig` — API functions for persisting FAPI and DCR configuration changes
  - `useFapiProfileConstraints` — hook that derives per-profile enforcement constraints

### Patch Changes

- [#10290](https://github.com/wso2/identity-apps/pull/10290) 
[`264546c83b012941bcf09d51e06fa88bb0d6419e`](https://github.com/wso2/identity-apps/commit/264546c83b012941bcf09d51e06fa88bb0d6419e):
  - @wso2is/admin.core.v1@2.55.3
  - @wso2is/access-control@3.5.3
  - @wso2is/core@2.12.10
  - @wso2is/form@2.10.1
  - @wso2is/i18n@2.37.5
  - @wso2is/react-components@2.9.16
