# @wso2is/admin.issuer-usage-scope.v1

## 1.0.3

### Patch Changes

- [#10659](https://github.com/wso2/identity-apps/pull/10659) [`876762c21fedad832f109a5fd7c26b420feb10b9`](https://github.com/wso2/identity-apps/commit/876762c21fedad832f109a5fd7c26b420feb10b9) Thanks [@Miranlfk](https://github.com/Miranlfk)! - Add the missing "Learn More" documentation links to the Login & Registration and Notification Channels
  pages that were shipping without one — Alternative Login Identifiers, Username Validation, Session Management,
  Policy Management, Preference Management, Admin Initiated Password Reset, SAML2 Web SSO Configuration,
  Organization Discovery, Impersonation, Issuer Usage Scope, Outbound Provisioning Configuration,
  Internal Notification Sending, Email Provider, SMS Provider and Push Provider. The Email Provider and SMS
  Provider pages already rendered a `DocumentationLink`, but the `develop.emailProviders.learnMore` and
  `develop.smsProviders.learnMore` keys they read were absent from the documentation link config, so the link
  resolved to `undefined` and never rendered.

  The two governance connector descriptions touched here (Alternative Login Identifiers and Admin Initiated
  Password Reset) also move from hardcoded English to `governanceConnectors` i18n keys.

- Updated dependencies [[`876762c21fedad832f109a5fd7c26b420feb10b9`](https://github.com/wso2/identity-apps/commit/876762c21fedad832f109a5fd7c26b420feb10b9)]:
  - @wso2is/admin.core.v1@2.59.3

## 1.0.2

### Patch Changes

- [#10197](https://github.com/wso2/identity-apps/pull/10197) [`efdbe1f5d9b50bb492883db7f39c8b4c858c6423`](https://github.com/wso2/identity-apps/commit/efdbe1f5d9b50bb492883db7f39c8b4c858c6423) Thanks [@NotoriousTechWorker](https://github.com/NotoriousTechWorker)! - Remove unused dependencies

- Updated dependencies [[`efdbe1f5d9b50bb492883db7f39c8b4c858c6423`](https://github.com/wso2/identity-apps/commit/efdbe1f5d9b50bb492883db7f39c8b4c858c6423)]:
  - @wso2is/admin.organizations.v1@2.28.4
  - @wso2is/admin.applications.v1@2.42.23
  - @wso2is/admin.core.v1@2.57.3

## 1.0.1

### Patch Changes

- [#9875](https://github.com/wso2/identity-apps/pull/9875) [`75dc24fe314a0c3e90fba9b52eb2974801bd464d`](https://github.com/wso2/identity-apps/commit/75dc24fe314a0c3e90fba9b52eb2974801bd464d) Thanks [@RavindiFernando](https://github.com/RavindiFernando)! - Revert Axios and SDK version bumps

- Updated dependencies [[`c834b18928cdfc09710c5e7067668206d006e68a`](https://github.com/wso2/identity-apps/commit/c834b18928cdfc09710c5e7067668206d006e68a), [`877d726905edf898c33c615cd887f8ed0a071a0e`](https://github.com/wso2/identity-apps/commit/877d726905edf898c33c615cd887f8ed0a071a0e), [`75dc24fe314a0c3e90fba9b52eb2974801bd464d`](https://github.com/wso2/identity-apps/commit/75dc24fe314a0c3e90fba9b52eb2974801bd464d), [`b75bb804c799c0e795e8580d35eedb8993d0ecc4`](https://github.com/wso2/identity-apps/commit/b75bb804c799c0e795e8580d35eedb8993d0ecc4)]:
  - @wso2is/admin.applications.v1@2.41.28
  - @wso2is/i18n@2.37.5
  - @wso2is/admin.organizations.v1@2.28.2
  - @wso2is/admin.core.v1@2.55.3
  - @wso2is/access-control@3.5.3
  - @wso2is/core@2.12.10
  - @wso2is/form@2.10.1

## 1.0.0

### Major Changes

- [#9619](https://github.com/wso2/identity-apps/pull/9619) [`03a5f7c376174bfd6d6743606f4b7e70bbe6ad8e`](https://github.com/wso2/identity-apps/commit/03a5f7c376174bfd6d6743606f4b7e70bbe6ad8e) Thanks [@ShanChathusanda93](https://github.com/ShanChathusanda93)! - Introduce the Issuer Usage Scope component for Login and Registration

### Patch Changes

- Updated dependencies [[`03a5f7c376174bfd6d6743606f4b7e70bbe6ad8e`](https://github.com/wso2/identity-apps/commit/03a5f7c376174bfd6d6743606f4b7e70bbe6ad8e)]:
  - @wso2is/admin.applications.v1@2.41.3
  - @wso2is/admin.core.v1@2.53.1
  - @wso2is/i18n@2.33.3
