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
interface AddAgentInterface {
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

interface AgentSchema {
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
interface RoleAudiencesInterface {
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
interface SharedOrganizationAndRolesInterface {
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
interface AgentBasicInterface {
    name: string;
    description: string;
    version: string;
    url?: string;
    owner?: string;
}

/**
 * Interface for agent.
 */
interface AgentInterface extends AgentBasicInterface {
    id: string;
    associatedRoles?: {
        allowedAudience?: string;
    };
}

/**
 * Agent sharing policy enum.
 */
export enum AgentSharingPolicy {
    ALL_EXISTING_AND_FUTURE_ORGS = "ALL_EXISTING_AND_FUTURE_ORGS",
    SELECTED_ORG_ONLY = "SELECTED_ORG_ONLY",
    SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN = "SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN"
}

/**
 * Interface for the agentCriteria field used in sharing request bodies.
 */
export interface AgentCriteriaInterface {
    agentIds: string[];
}

/**
 * Interface for the HTTP request body of the share-with-all endpoint.
 */
export interface ShareWithAllRequestInterface {
    agentCriteria: AgentCriteriaInterface;
    policy: string;
    roleAssignment: {
        mode: string;
        roles?: RoleSharingInterface[];
    };
}

/**
 * Interface for the HTTP request body of the unshare-with-all endpoint.
 */
export interface UnshareWithAllRequestInterface {
    agentCriteria: AgentCriteriaInterface;
}

/**
 * Interface for the HTTP request body of the share-with-selected endpoint.
 */
export interface ShareSelectedRequestInterface {
    agentCriteria: AgentCriteriaInterface;
    organizations: SharedOrganizationAndRolesInterface[];
}

/**
 * Interface for the HTTP request body of the unshare-with-selected endpoint.
 */
export interface UnshareSelectedRequestInterface {
    agentCriteria: AgentCriteriaInterface;
    orgIds: string[];
}

/**
 * Interface for the HTTP request body of the PATCH edit-roles endpoint.
 */
export interface EditRolesRequestInterface {
    agentCriteria: AgentCriteriaInterface;
    Operations: ShareOrganizationsAndRolesPatchOperationInterface[];
}

/**
 * Interface for agent sharing API responses.
 */
export interface AgentSharingResponseInterface {
    message?: string;
    status?: string;
}
