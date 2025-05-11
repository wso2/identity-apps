/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { RolesResourceEndpointsInterface } from "../models/endpoints";

/**
 * Get the resource endpoints for the Role Management feature.
 *
 * @param serverHostWithOrgPath - Server Host with Org Path.
 * @param serverHost - Server Host
 * @returns `RolesResourceEndpointsInterface`
 */
export const getRolesResourceEndpoints = (
    serverHostWithOrgPath: string,
    serverHost: string
): RolesResourceEndpointsInterface => {
    return {
        permission: `${serverHostWithOrgPath}/api/server/v1/permission-management/permissions`,
        roles: `${serverHostWithOrgPath}/scim2/Roles`,
        rolesV2: `${serverHostWithOrgPath}/scim2/v2/Roles`,
        rolesV3: `${serverHostWithOrgPath}/scim2/v3/Roles`,
        rolesWithoutOrgPath: `${serverHost}/scim2/Roles`
    };
};
