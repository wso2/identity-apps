---
"@wso2is/admin.application-templates.v1": minor
"@wso2is/admin.applications.v1": minor
"@wso2is/console": minor
"@wso2is/i18n": minor
---

Let admins register known MCP clients, such as Claude and Visual Studio Code, from the MCP Client template in one click. IS retrieves and checks each client's Client ID Metadata Document (CIMD), and the application is created from the values in that document. The list of known clients comes from the deployment config (`extensions.mcpKnownClients`). Any other client can be added from its metadata document URL, after the admin reviews what the document declares.
