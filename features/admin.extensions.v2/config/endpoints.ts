/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { ExtendedFeatureResourceEndpointsInterfaceV2 } from "./models";
import { DeploymentConfigInterface, store } from "../../admin.core.v1";

/**
 * Get the resource endpoints for the extended features.
 *
 * @param serverHost - Server Host.
 * @returns Interface for the resource endpoints of extended features.
 */
export const getExtendedFeatureResourceEndpointsV2 = (serverHost: string,
    deploymentConfig: DeploymentConfigInterface): ExtendedFeatureResourceEndpointsInterfaceV2 => {

    const orgId: string = store.getState().organization.organization.id;
    const authzServiceHost: string = deploymentConfig.extensions?.authzServiceHost as string;

    return {
        organizationEndpointV2: `${ serverHost }/api/asgardeo-enterprise-login/v2/business-user-login/{organization}`,
        organizationPatchEndpointV2: `${ serverHost }/api/asgardeo-enterprise-login/v2/business-user-login`
    };
};
