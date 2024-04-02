/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { Config } from "../../../../admin.core.v1/configs";
import { TenantResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the Tenant related features.
 *
 * @returns tenant resource endpoints.
 */
export const getTenantResourceEndpoints = (): TenantResourceEndpointsInterface => {
    return {
        tenantAssociationApi: Config.getDeploymentConfig().serverOrigin + "/api/asgardeo/v1/tenant/me",
        tenantManagementApi: Config.getDeploymentConfig().serverOrigin + "/api/asgardeo/v1/tenant",
        tenantSubscriptionApi: Config.getDeploymentConfig().serverOrigin + 
            Config.getDeploymentConfig().extensions?.subscriptionApiPath
    };
};
