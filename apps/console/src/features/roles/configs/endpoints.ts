/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { RolesResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the Role Management feature.
 *
 * @param {string} serverHostWithOrgPath - Server Host with Org Path.
 * @param {string} serverHost - Server Host
 * @return {RolesResourceEndpointsInterface}
 */
export const getRolesResourceEndpoints = (
    serverHostWithOrgPath: string,
    serverHost: string
): RolesResourceEndpointsInterface => {
    return {
        permission: `${serverHostWithOrgPath}/api/server/v1/permission-management/permissions`,
        roles: `${serverHostWithOrgPath}/scim2/Roles`,
        rolesWithoutOrgPath: `${serverHost}/scim2/Roles`
    };
};
