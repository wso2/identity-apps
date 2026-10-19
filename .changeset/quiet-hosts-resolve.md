---
"@wso2is/admin.connections.v1": patch
"@wso2is/console": patch
---

Resolve the registration and recovery redirect URIs in the connection create wizard help panel using the
accounts portal hostname configured under `[accounts]` in the deployment.toml, falling back to the custom
server host when it is not configured
