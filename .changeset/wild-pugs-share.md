---
"@wso2is/admin.approval-workflows.v1": patch
"@wso2is/console": patch
---

Remove redundant workflow association API calls when viewing an approval workflow. The workflow operations form no longer fetches the full workflow association list (whose data it never consumed), and the edit view now refreshes associations through its own filtered request instead of the form's. This reduces the number of `GET /workflow-associations` requests on the approval workflow view from three to one.
