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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError } from "axios";
import TenantConstants from "../constants/tenant-constants";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Check if the tenant domain is available.
 *
 * This function calls the HEAD method of the following endpoint to get the tenant details.
 * - `https://{serverUrl}/t/{tenantDomain}/api/server/v1/tenants/domain/{tenant-domain}`
 * For more details, refer to the documentation:
 * {@link https://is.docs.wso2.com/en/latest/apis/tenant-management-rest-api/#tag/Tenants/operation/isDomainExist}
 *
 * @param tenantDomain - Tenant domain.
 * @param lifecycleStatus - The desired activation status of the tenant.
 * @returns A promise that resolves true if the tenant domain is available for creation, or false otherwise.
 * @throws Error - Throws an error if the operation fails.
 */
const getTenantDomainAvailability = (tenantDomain: string): Promise<boolean> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.HEAD,
        url: `${ store.getState().config.endpoints.tenants }/domain/${tenantDomain}`
    };

    return httpClient(requestConfig)
        .then(() => {
            return Promise.resolve(false);
        })
        .catch((error: AxiosError) => {
            if (error.response.status === 404) {
                return Promise.resolve(true);
            }

            throw new IdentityAppsApiException(
                TenantConstants.TENANT_DOMAIN_AVAILABILITY_CHECK_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default getTenantDomainAvailability;
