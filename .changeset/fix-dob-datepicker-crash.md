---
"@wso2is/identity-apps-core": patch
---

Fix the registration form being unmounted when the date field holds a future date. The date input no longer caps the calendar at today, which was making a crash in the underlying picker reachable.
