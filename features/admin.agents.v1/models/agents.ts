/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
export interface AddAgentInterface {
    id?: string;
    name: string;
    description: string;
    version: string;
    url?: string;
    owner?: string;
}
export enum AgentType {
    INTERACTIVE = "INTERACTIVE",
    BACKGROUND = "BACKGROUND"
}

export interface AgentSchema {
    Url?: string;
    Description?: string;
    DisplayName?: string;
    IsUserServingAgent?: boolean;
    AgentType?: AgentType;
    CallbackUrl?: string;
    CibaAuthReqExpiryTime?: number;
    NotificationChannels?: string[];
    [key: string]: any;
}

export interface AgentScimSchema {
    id?: string;
    userName?: string;
    password?: string;
    "urn:scim:wso2:agent:schema"?: AgentSchema;
}

/**
 * Interface for role audiences in agent sharing.
 */
export interface RoleAudiencesInterface {
    display: string;
    type: string;
}

/**
 * Interface for role sharing in agent sharing.
 */
export interface RoleSharingInterface {
    displayName: string;
    audience: RoleAudiencesInterface;
}

/**
 * Interface for sharing the agent with all organizations.
 */
export interface ShareAgentWithAllOrganizationsDataInterface {
    agentId: string;
    policy: string;
    roleAssignment: {
        mode: string;
        roles?: RoleSharingInterface[];
    };
}

/**
 * Interface for unsharing the agent with all organizations.
 */
export interface UnshareAgentWithAllOrganizationsDataInterface {
    agentId: string;
}

/**
 * Interface for shared organization and roles for agents.
 */
export interface SharedOrganizationAndRolesInterface {
    orgId: string;
    policy: string;
    roleAssignment?: {
        mode: string;
        roles: RoleSharingInterface[];
    };
}

/**
 * Interface for sharing the agent with selected organization and roles.
 */
export interface ShareAgentWithSelectedOrganizationsAndRolesDataInterface {
    agentId: string;
    organizations: SharedOrganizationAndRolesInterface[];
}

/**
 * Interface for the patch operation to share the agent with selected organizations and roles.
 */
export interface ShareOrganizationsAndRolesPatchOperationInterface {
    op: string;
    path: string;
    value: RoleSharingInterface[];
}

/**
 * Interface for the patch data to share the agent with selected organizations and roles.
 */
export interface ShareOrganizationsAndRolesPatchDataInterface {
    agentId: string;
    Operations: ShareOrganizationsAndRolesPatchOperationInterface[];
}

/**
 * Interface for unsharing the agent from organizations.
 */
export interface UnshareOrganizationsDataInterface {
    agentId: string;
    orgIds: string[];
}

/**
 * Interface for basic agent fields shared across create and read operations.
 */
export interface AgentBasicInterface {
    name: string;
    description: string;
    version: string;
    url?: string;
    owner?: string;
}

/**
 * Interface for agent.
 */
export interface AgentInterface extends AgentBasicInterface {
    id: string;
    associatedRoles?: {
        allowedAudience?: string;
    };
}

/**
 * Agent sharing policy enum.
 */
export enum AgentSharingPolicy {
    ALL_EXISTING_ORGS_ONLY = "ALL_EXISTING_ORGS_ONLY",
    ALL_EXISTING_AND_FUTURE_ORGS = "ALL_EXISTING_AND_FUTURE_ORGS",
    SELECTED_ORG_ONLY = "SELECTED_ORG_ONLY",
    SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN = "SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN"
}
