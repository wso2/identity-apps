/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import TenantConstants from "../../constants/tenant-constants";
import { AdminAdvisoryBannerConfigurationInterface } from "../../models/system-settings/admin-advisory";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Update admin advisory banner configurations.
 *
 * @param data - Data to be updated.
 * @returns a promise containing the server configurations.
 */
const updateAdminAdvisoryBannerConfiguration = (
    data: AdminAdvisoryBannerConfigurationInterface
): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.adminAdvisoryBanner
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                if (response.status === 400) {
                    throw new IdentityAppsApiException(
                        TenantConstants.ADMIN_ADVISORY_BANNER_CONFIGS_INVALID_INPUT_ERROR,
                        null,
                        response.status,
                        response.request,
                        response,
                        response.config
                    );
                }

                throw new IdentityAppsApiException(
                    TenantConstants.ADMIN_ADVISORY_BANNER_CONFIGS_UPDATE_REQUEST_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                TenantConstants.ADMIN_ADVISORY_BANNER_CONFIGS_UPDATE_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default updateAdminAdvisoryBannerConfiguration;
