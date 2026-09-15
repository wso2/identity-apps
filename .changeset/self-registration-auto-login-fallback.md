---
"@wso2is/identity-apps-core": patch
---

Add a fallback link to the self registration completion page, and stop the auto login
redirect from firing while the page is hidden. A backgrounded browser cannot hand off to
the application, but the redirect still reaches `/commonauth` and consumes the single use
`sessionDataKey`, leaving the user stranded on the completion page with no way to continue.
