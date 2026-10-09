---
"@wso2is/admin.console-settings.v1": patch
"@wso2is/console": patch
---

Prefetch API resource collections when the console roles list loads, so the granular permissions grid in the create/edit role views renders instantly instead of waiting on that request the first time a wizard is opened in a session.
