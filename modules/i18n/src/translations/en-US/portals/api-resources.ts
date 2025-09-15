/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ApiResourcesNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const apiResources: ApiResourcesNS = {
    confirmations: {
        deleteAPIResource: {
            assertionHint: "Please confirm your action.",
            content: "This action is irreversible and will permanently delete the {{ resourceType }}.",
            header: "Are you sure?",
            message: "If you delete this {{ resourceType }}, some functionalities may not work properly. " +
                "Please proceed with caution."
        },
        deleteAPIResourcePermission: {
            assertionHint: "Please confirm your action.",
            content: "This action is irreversible and will permanently remove the scope from the {{ resourceType }}.",
            header: "Are you sure?",
            message: "If you remove this scope from the {{ resourceType }}, some functionalities may not work properly. " +
                "Please proceed with caution."
        }
    },
    tabs: {
        scopes: {
            button: "Add Scope",
            copiedPopupText: "Copied the Identifier",
            copyPopupText: "Copy the Identifier",
            empty: {
                subTitle: "Click on the + icon to add a new scope",
                title: "No scope is assigned"
            },
            emptySearch: {
                subTitle: {
                    0: "We couldn't find the scope you searched for.",
                    1: "Please try using a different parameter."
                },
                title: "No results found",
                viewAll: "Clear search query"
            },
            form: {
                button: "New Scope",
                cancelButton: "Cancel",
                fields: {
                    description: {
                        label: "Description",
                        placeholder: "Enter the Description"
                    },
                    displayName: {
                        emptyValidate: "Display name cannot be empty",
                        label: "Display Name",
                        placeholder: "Read Bookings"
                    },
                    scope: {
                        emptyValidate: "Scope cannot be empty",
                        label: "Scope",
                        placeholder: "read_bookings"
                    }
                },
                subTitle: "Create a new Scope",
                submitButton: "Create",
                title: "Create a Scope"
            },
            label: "Scopes",
            learnMore: "Learn More",
            removeScopePopupText: "Remove the scope",
            search: "Search scopes by display name",
            subTitle: "List of scopes uses by the API Resource.",
            title: "List of Scopes"
        }
    },
    wizard: {
        addApiResource: {
            steps: {
                scopes: {
                    empty: {
                        subTitle: "Click on the + icon to add a new scope",
                        title: "No scope is assigned"
                    },
                    form: {
                        button: "Add Scope",
                        fields: {
                            description: {
                                hint: "Provide a description for your scope. "+
                                "This will be displayed on the user consent screen.",
                                label: "Description",
                                placeholder: "Enter the Description"
                            },
                            displayName: {
                                emptyValidate: "Display name cannot be empty",
                                hint: "Provide a meaningful name as it will be displayed on the user consent screen.",
                                label: "Display Name",
                                placeholder: "Read Bookings"
                            },
                            permission: {
                                emptyValidate: "Scope cannot be empty",
                                hint: "A unique value that acts as the scope when requesting an "+
                                "access token. <1>Note that the scope cannot be modified once created.</1>",
                                invalid: "Scope cannot contain spaces",
                                label: "Scope",
                                placeholder: "read_bookings",
                                uniqueValidate: "This scope already exists in the organization. "+
                                "Please choose a different one.",
                                errorOccurred: "An error occurred while validating the scopes."
                            },
                            permissionList: {
                                label: "Added Scopes"
                            }
                        }
                    },
                    removeScopePopupText: "Remove the scope",
                    stepTitle: "Scopes"
                }
            }
        }
    },
    mcpServers: {
        newMcpServer: "New MCP Server",
        wizards: {
            addMcpServer: {
                title: "Add new MCP server",
                description: "Register an MCP server",
                steps: {
                    general: {
                        fields: {
                            displayName: {
                                hint: "Meaningful name to identify your MCP server",
                                placeholder: "My MCP Server"
                            },
                            identifier: {
                                placeholder: "mcp://my-mcp-server"
                            }
                        }
                    }
                }
            }
        },
        deleteMcpServer: {
            actionText: "Delete MCP Server",
            heading: "Delete MCP Server",
            subheading: "This action will permanently delete the MCP server. Please be certain before you proceed"
        },
        title: "MCP Servers",
        description: "Define resource models and scopes for MCP servers to enable fine-grained access control over server resources.",
        searchBarPlaceholder: "Search MCP servers by name",
        backButtonText: "Back to MCP Servers",
        scopes: {
            subHeading: "Scopes that the MCP server uses to verify the user's permissions to access " +
                "its tools, resources, and prompts."
        },
        editPageTitle: "Edit MCP Server",
        emptyListPlaceholderText: "There are no MCP servers available"
    }
};
