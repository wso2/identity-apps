/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { AxiosResponse } from "axios";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import {
    addAgent,
    deleteAgent,
    editAgentRolesOfExistingOrganizations,
    shareAgentsWithAllOrganizations,
    shareAgentsWithSelectedOrganizationsAndRoles,
    unShareAgentsWithAllOrganizations,
    unshareAgentWithSelectedOrganizations,
    updateAgent,
    updateAgentApplicationConfiguration,
    updateAgentLockStatus,
    updateAgentPassword
} from "../agents";
import { AgentScimSchema, AgentSharingPolicy, AgentType } from "../../models/agents";

const httpRequestMock: Mock = vi.hoisted(() => vi.fn());

const storeStateMock: {
    config: {
        endpoints: {
            agentSharing: string;
            agents: string;
            applications: string;
        };
    };
} = vi.hoisted(() => ({
    config: {
        endpoints: {
            agentSharing: "https://localhost:9443/api/server/v1/agent-sharing",
            agents: "https://localhost:9443/scim2/Agents",
            applications: "https://localhost:9443/api/server/v1/applications"
        }
    }
}));

vi.mock("@asgardeo/auth-react", () => ({
    AsgardeoSPAClient: {
        getInstance: vi.fn(() => ({
            httpRequest: httpRequestMock
        }))
    }
}));

vi.mock("@wso2is/admin.core.v1/store", () => ({
    store: {
        getState: () => storeStateMock
    }
}));

describe("Agent API helpers", () => {
    beforeEach(() => {
        httpRequestMock.mockReset();
    });

    it("creates an agent with the SCIM payload", async () => {
        const payload: AgentScimSchema = {
            "urn:scim:wso2:agent:schema": {
                Description: "Build automation",
                DisplayName: "Build Agent"
            }
        };

        httpRequestMock.mockResolvedValueOnce({
            data: {
                id: "agent-id"
            }
        } as AxiosResponse);

        await expect(addAgent(payload)).resolves.toEqual({
            id: "agent-id"
        });

        expect(httpRequestMock).toHaveBeenCalledWith({
            data: payload,
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            url: storeStateMock.config.endpoints.agents
        });
    });

    it("updates and deletes agents with the expected resource URL", async () => {
        const response: AxiosResponse = {
            config: {},
            data: {},
            headers: {},
            status: 200,
            statusText: "OK"
        } as AxiosResponse;
        const payload: AgentScimSchema = {
            "urn:scim:wso2:agent:schema": {
                DisplayName: "Updated Agent"
            }
        };

        httpRequestMock.mockResolvedValue(response);

        await expect(updateAgent("agent-id", payload)).resolves.toBe(response);
        await expect(deleteAgent("agent-id")).resolves.toBe(response);

        expect(httpRequestMock).toHaveBeenNthCalledWith(1, {
            data: payload,
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT",
            url: `${storeStateMock.config.endpoints.agents}/agent-id`
        });
        expect(httpRequestMock).toHaveBeenNthCalledWith(2, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "DELETE",
            url: `${storeStateMock.config.endpoints.agents}/agent-id`
        });
    });

    it("patches account lock status and password with SCIM PatchOp payloads", async () => {
        httpRequestMock.mockResolvedValue({
            data: {}
        } as AxiosResponse);

        await updateAgentLockStatus("agent-id", true);
        await updateAgentPassword("agent-id", "NewSecret#123");

        expect(httpRequestMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
            data: {
                Operations: [
                    {
                        op: "replace",
                        value: {
                            "urn:scim:wso2:schema": {
                                accountLocked: true
                            }
                        }
                    }
                ],
                schemas: [
                    "urn:ietf:params:scim:api:messages:2.0:PatchOp"
                ]
            },
            method: "PATCH",
            url: `${storeStateMock.config.endpoints.agents}/agent-id`
        }));
        expect(httpRequestMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
            data: {
                Operations: [
                    {
                        op: "replace",
                        value: {
                            password: "NewSecret#123"
                        }
                    }
                ],
                schemas: [
                    "urn:ietf:params:scim:api:messages:2.0:PatchOp"
                ]
            },
            method: "PATCH",
            url: `${storeStateMock.config.endpoints.agents}/agent-id`
        }));
    });

    it("updates interactive agent application OIDC settings", async () => {
        httpRequestMock
            .mockResolvedValueOnce({
                data: {
                    callbackURLs: [ "https://old.example.com" ],
                    cibaAuthenticationRequest: {
                        authReqExpiryTime: 120
                    },
                    grantTypes: [ "urn:openid:params:grant-type:ciba" ]
                }
            } as AxiosResponse)
            .mockResolvedValueOnce({
                data: {}
            } as AxiosResponse);

        await updateAgentApplicationConfiguration("application-id", {
            agentType: AgentType.INTERACTIVE,
            callbackUrl: "https://app.example.com/callback"
        });

        expect(httpRequestMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
            method: "GET",
            url: `${storeStateMock.config.endpoints.applications}/application-id/inbound-protocols/oidc`
        }));
        expect(httpRequestMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
            data: {
                callbackURLs: [ "https://app.example.com/callback" ],
                grantTypes: [
                    "authorization_code",
                    "refresh_token"
                ]
            },
            method: "PUT",
            url: `${storeStateMock.config.endpoints.applications}/application-id/inbound-protocols/oidc`
        }));
    });

    it("updates background agent application OIDC settings", async () => {
        httpRequestMock
            .mockResolvedValueOnce({
                data: {
                    callbackURLs: [ "https://old.example.com" ],
                    cibaAuthenticationRequest: {
                        authReqExpiryTime: 120
                    },
                    grantTypes: [ "authorization_code" ]
                }
            } as AxiosResponse)
            .mockResolvedValueOnce({
                data: {}
            } as AxiosResponse);

        await updateAgentApplicationConfiguration("application-id", {
            agentType: AgentType.BACKGROUND,
            cibaAuthReqExpiryTime: 600,
            notificationChannels: [ "email", "sms" ]
        });

        expect(httpRequestMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
            data: {
                callbackURLs: [],
                cibaAuthenticationRequest: {
                    authReqExpiryTime: 600,
                    notificationChannels: [ "email", "sms" ]
                },
                grantTypes: [
                    "urn:openid:params:grant-type:ciba"
                ]
            },
            method: "PUT"
        }));
    });

    it("builds the share-with-all request payload", async () => {
        httpRequestMock.mockResolvedValueOnce({
            data: {
                status: "SUCCESS"
            }
        } as AxiosResponse);

        await expect(shareAgentsWithAllOrganizations({
            agentId: "agent-id",
            policy: AgentSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleAssignment: {
                mode: "SELECTED",
                roles: [
                    {
                        audience: {
                            display: "application",
                            type: "APPLICATION"
                        },
                        displayName: "Agent Invoker"
                    }
                ]
            }
        })).resolves.toEqual({
            status: "SUCCESS"
        });

        expect(httpRequestMock).toHaveBeenCalledWith(expect.objectContaining({
            data: {
                agentCriteria: {
                    agentIds: [ "agent-id" ]
                },
                policy: AgentSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
                roleAssignment: {
                    mode: "SELECTED",
                    roles: [
                        {
                            audience: {
                                display: "application",
                                type: "APPLICATION"
                            },
                            displayName: "Agent Invoker"
                        }
                    ]
                }
            },
            method: "POST",
            url: `${storeStateMock.config.endpoints.agentSharing}/share-with-all`
        }));
    });

    it("validates required inputs for sharing helpers", async () => {
        await expect(shareAgentsWithAllOrganizations({
            agentId: "",
            policy: AgentSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS,
            roleAssignment: {
                mode: "NONE"
            }
        })).rejects.toThrow("agentId is required");

        await expect(shareAgentsWithSelectedOrganizationsAndRoles({
            agentId: "agent-id",
            organizations: []
        })).rejects.toThrow("organizations must be a non-empty array");

        await expect(unshareAgentWithSelectedOrganizations({
            agentId: "agent-id",
            orgIds: []
        })).rejects.toThrow("orgIds must be a non-empty array");

        await expect(editAgentRolesOfExistingOrganizations({
            Operations: [],
            agentId: "agent-id"
        })).rejects.toThrow("Operations must be a non-empty array");
    });

    it("builds selected share, unshare, and role edit request payloads", async () => {
        httpRequestMock.mockResolvedValue({
            data: {
                status: "SUCCESS"
            }
        } as AxiosResponse);

        await shareAgentsWithSelectedOrganizationsAndRoles({
            agentId: "agent-id",
            organizations: [
                {
                    orgId: "org-id",
                    policy: AgentSharingPolicy.SELECTED_ORG_ONLY
                }
            ]
        });
        await unshareAgentWithSelectedOrganizations({
            agentId: "agent-id",
            orgIds: [ "org-id" ]
        });
        await unShareAgentsWithAllOrganizations({
            agentId: "agent-id"
        });
        await editAgentRolesOfExistingOrganizations({
            Operations: [
                {
                    op: "replace",
                    path: "/organizations/org-id/roles",
                    value: []
                }
            ],
            agentId: "agent-id"
        });

        expect(httpRequestMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
            data: {
                agentCriteria: {
                    agentIds: [ "agent-id" ]
                },
                organizations: [
                    {
                        orgId: "org-id",
                        policy: AgentSharingPolicy.SELECTED_ORG_ONLY
                    }
                ]
            },
            method: "POST",
            url: `${storeStateMock.config.endpoints.agentSharing}/share`
        }));
        expect(httpRequestMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
            data: {
                agentCriteria: {
                    agentIds: [ "agent-id" ]
                },
                orgIds: [ "org-id" ]
            },
            method: "POST",
            url: `${storeStateMock.config.endpoints.agentSharing}/unshare`
        }));
        expect(httpRequestMock).toHaveBeenNthCalledWith(3, expect.objectContaining({
            data: {
                agentCriteria: {
                    agentIds: [ "agent-id" ]
                }
            },
            method: "POST",
            url: `${storeStateMock.config.endpoints.agentSharing}/unshare-with-all`
        }));
        expect(httpRequestMock).toHaveBeenNthCalledWith(4, expect.objectContaining({
            data: {
                Operations: [
                    {
                        op: "replace",
                        path: "/organizations/org-id/roles",
                        value: []
                    }
                ],
                agentCriteria: {
                    agentIds: [ "agent-id" ]
                }
            },
            method: "PATCH",
            url: `${storeStateMock.config.endpoints.agentSharing}/share`
        }));
    });
});
