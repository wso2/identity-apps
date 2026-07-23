---
"@wso2is/react-components": patch
"@wso2is/admin.applications.v1": patch
---

Preserve complex regex callback URLs in migrated applications. A single `regexp=(...)` callback whose pattern contains a literal comma (e.g. a `{0,4}` quantifier) is now kept as one atomic value across display, edit and save instead of being split as a comma-separated list. Adding across syntaxes combines all alternatives into one de-duplicated `regexp=(...)`, and an input mixing both syntaxes is rejected.
