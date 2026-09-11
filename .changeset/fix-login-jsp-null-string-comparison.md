---
"@wso2is/identity-apps-core": patch
---

Fix string comparison in login.jsp — replace reference equality (`==`) with `.equals()` for the identifier-first username null check
