---
"@wso2is/admin.core.v1": patch
"@wso2is/console": patch
---

Fix logo glitch and repeated logo.svg XHR requests caused by LogoImage being defined inside the Header render function, which made React treat it as a new component type on every render and trigger a full unmount/remount cycle.
