/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { OrganizationResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the Application Management feature.
 *
 * @param serverHost - Server Host.
 *
 * @returns OrganizationResourceEndpointsInterface
 */
export const getOrganizationsResourceEndpoints = (
    serverHostWithOrgPath: string,
    serverHost: string
): OrganizationResourceEndpointsInterface => {
    return {
        breadcrumb: `${serverHostWithOrgPath}/api/users/v1/me/organizations/root-hierarchy`,
        organizations: `${serverHostWithOrgPath}/api/server/v1`,
        rootOrganization: `${serverHost}/api/server/v1`,
        usersSuperOrganization: `${serverHostWithOrgPath}/api/users/v1/me/organizations/root`
    };
};
