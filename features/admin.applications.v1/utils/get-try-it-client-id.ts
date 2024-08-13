/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import LoginApplicationTemplate from "../data/try-it-application.json";

/**
 * Retrieves the Try It client ID for a given tenant domain.
 *
 * @param tenantDomain - The tenant domain to replace in the client ID template.
 * @returns The client ID with the tenant domain replaced.
 *
 * @example
 * // Assuming the client ID template is "client_<TENANT>_id"
 * // and tenantDomain is "example.com"
 * // returns "client_example.com_id"
 * const clientId = getTryItClientId("example.com");
 */
const getTryItClientId = (tenantDomain:string): string => {
    return LoginApplicationTemplate.application.
        inboundProtocolConfiguration.oidc.clientId.replace("<TENANT>", tenantDomain);
};

export default getTryItClientId;
