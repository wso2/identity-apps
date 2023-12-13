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

import { ApplicationsResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the Application Management feature.
 *
 * @param serverHost - Server Host.
 * @returns The resource endpoints for the Application Management feature.
 */
export const getApplicationsResourceEndpoints = (serverHost: string): ApplicationsResourceEndpointsInterface => {
    const serverHostWithoutOPath: string = serverHost.replace("/o/", "/");

    return {
        applications: `${ serverHost }/api/server/v1/applications`,
        myAccountConfigMgt: `${ serverHostWithoutOPath }/api/identity/config-mgt/v1.0/resource/myaccount`,
        requestPathAuthenticators: `${ serverHost }/api/server/v1/configs/authenticators?type=REQUEST_PATH`
    };
};
