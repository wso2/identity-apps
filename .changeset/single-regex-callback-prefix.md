---
"@wso2is/admin.applications.v1": patch
"@wso2is/react-components": patch
---

Keep the `regexp=` prefix of a regex callback URL when the OIDC Protocol tab is saved. A single `regexp=(...)` callback is no longer unwrapped to a plain URL, a regex stored without parentheses is shown as one chip and saved with enclosing parentheses, and one with a numbered backreference is kept unchanged.
