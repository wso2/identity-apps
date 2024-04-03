---
"@wso2is/console": patch
"@wso2is/features": patch
---

There were identical pieces of code ("duplicates") found in modules/common and features/admin.core.v1. merged the additional codes from modules/common into features/admin.core.v1, and removed @wso2is/common module dependencies from apps/console and features.
