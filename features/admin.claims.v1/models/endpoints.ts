/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { ORGANIZATION_TYPE } from "@wso2is/admin.organizations.v1/constants";

/**
 * Interface for the Claim Management feature resource endpoints.
 */
export interface ClaimResourceEndpointsInterface {
    claims: string;
    externalClaims: string;
    localClaims: string;
    resourceTypes: string;
}

/**
 * Interface for the Server Supported Claims resource endpoints.
 */
export interface ServerSupportedClaimsInterface {
    id: string;
    name: string;
    attributes: string[];
}

/**
 * Represents the response structure for retrieving details of the
 * currently authenticated organization.
 */
export interface OrganizationSelfResponse {
    /**
     * The unique identifier of the organization.
     */
    id: string;
    /**
     * The name of the organization.
     */
    name: string;
    /**
     * The organization handle.
     */
    orgHandle: string;
    /**
     * The description of the organization.
     */
    description: string;
    /**
     * The status of the organization.
     */
    status: string;
    /**
     * The version of the organization.
     */
    version: string;
    /**
     * The date when the organization was created.
     */
    created: string;
    /**
     * The date when the organization was last modified.
     */
    lastModified: string;
    /**
     * The type of the organization.
     */
    type: ORGANIZATION_TYPE;
    /**
     * Whether the organization has child organizations.
     */
    hasChildren: boolean;
}
