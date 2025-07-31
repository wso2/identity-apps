/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { AgentsNS } from "../../../models/namespaces/agents-ns";

export const agents: AgentsNS = {
    description: "Manage AI agent identities, permissions, and access controls for your organization's automated systems.",
    edit: {
        credentials: {
            regenerate: {
                alerts: {
                    error: {
                        description: "Error when regenerating the agent secret",
                        message: "Something went wrong"
                    }
                }
            },
            subtitle: "Authentication details for this agent to securely access applications and API resources.",
            title: "Credentials"
        },
        general: {
            fields: {
                description: {
                    label: "",
                    placeholder: ""
                },
                languageModal: {
                    label: ""
                },
                name: {
                    label: ""
                }
            },
            title: ""
        },
        roles: {
            subtitle: "View roles assigned directly to this agent",
            title: "Roles"

        }
    },
    list: {
        featureUnavailable: {
            subtitle: {
                0: "Each AI agent requires a unique identity with specific permissions, roles, and access policies. Monitor usage, manage credentials, and ensure compliance across all automated systems.",
                1: {
                    onprem: "Configure agent datastore to enable and try out this feature now.",
                    saas: "Create a fresh organization for instant access, or contact us for early access to this game-changing feature."
                }
            },
            title: "AI agent management is coming soon to your organization!"
        }
    },
    new: {
        action: {
            title: "New Agent"
        },
        alerts: {
            success: {
                description: "Agent created successfully",
                message: "Created successfully"
            }
        },
        fields: {
            description: {
                label: "Description",
                placeholder: "Enter a description for the agent"
            },
            name: {
                label: "Name"
            }
        },
        title: "Agent created successfully"
    },
    pageTitle: "Agents",
    title: "Agents"
};
