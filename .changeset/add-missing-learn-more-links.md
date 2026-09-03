---
"@wso2is/admin.alternative-login-identifier.v1": patch
"@wso2is/admin.consents.v1": patch
"@wso2is/admin.core.v1": patch
"@wso2is/admin.impersonation.v1": patch
"@wso2is/admin.issuer-usage-scope.v1": patch
"@wso2is/admin.organization-discovery.v1": patch
"@wso2is/admin.provisioning.v1": patch
"@wso2is/admin.push-providers.v1": patch
"@wso2is/admin.saml2-configuration.v1": patch
"@wso2is/admin.server-configurations.v1": patch
"@wso2is/admin.session-management.v1": patch
"@wso2is/admin.username-validation.v1": patch
"@wso2is/console": patch
"@wso2is/i18n": patch
---

Add the missing "Learn More" documentation links to the Login & Registration and Notification Channels
pages that were shipping without one — Alternative Login Identifiers, Username Validation, Session Management,
Policy Management, Preference Management, Admin Initiated Password Reset, SAML2 Web SSO Configuration,
Organization Discovery, Impersonation, Issuer Usage Scope, Outbound Provisioning Configuration,
Internal Notification Sending, Email Provider, SMS Provider and Push Provider. The Email Provider and SMS
Provider pages already rendered a `DocumentationLink`, but the `develop.emailProviders.learnMore` and
`develop.smsProviders.learnMore` keys they read were absent from the documentation link config, so the link
resolved to `undefined` and never rendered.

The two governance connector descriptions touched here (Alternative Login Identifiers and Admin Initiated
Password Reset) also move from hardcoded English to `governanceConnectors` i18n keys.
