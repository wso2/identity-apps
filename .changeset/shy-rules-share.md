---
"@wso2is/common.ui.shared-access.v1": patch
---

Fix multi-organization selection not being retained in the selective user/application/agent share organization tree by driving the controlled multi-select RichTreeView through the array-form onSelectedItemsChange callback instead of the per-item onItemSelectionToggle callback.
