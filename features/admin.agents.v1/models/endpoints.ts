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

export interface AgentsResourceEndpointsInterface {
    agentCredentials: string;
    agents: string;
    agentSharing: string;
}

/**
 * Interface for role with audience information.
 */
export interface RoleInterface {
    displayName: string;
    audience: {
        display: string;
        type: string;
    };
}

/**
 * Interface for shared organization information.
 */
export interface SharedOrganizationInterface {
    orgId: string;
    orgName: string;
    sharedAgentId: string;
    sharedType: string;
    sharingMode?: {
        policy: string;
        roleAssignment?: {
            mode: string;
            roles?: Array<RoleInterface>;
        };
    };
    roles?: Array<RoleInterface>;
}

/**
 * Interface for the agent shared organizations response.
 */
export interface AgentSharedOrganizationsResponse {
    /**
     * Pagination links.
     */
    links?: Array<{
        href: string;
        rel: string;
    }>;
    /**
     * Sharing mode configuration.
     */
    sharingMode?: {
        policy: string;
        roleAssignment?: {
            mode: string;
            roles?: Array<RoleInterface>;
        };
    };
    /**
     * List of organizations where the agent has shared access.
     */
    organizations?: Array<SharedOrganizationInterface>;
}
