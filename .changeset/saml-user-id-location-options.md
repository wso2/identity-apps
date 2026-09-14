---
"@wso2is/admin.identity-providers.v1": patch
"@wso2is/admin.connections.v1": patch
"@wso2is/console": patch
---

Fix the option values of the SAML connection's User ID Location field, which were wired to the inverse
booleans of the `IsUserIdInClaims` property. `Use NameID as the User Identifier` mapped to `true` and
`User Identifier found among claims` to `false`, while the authenticator reads `false` as NameID and
`true` as claims. Every SAML connection was therefore rendered with the opposite user ID location to
the one stored, and selecting an option persisted the opposite boolean.
