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
import { store } from "@wso2is/admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { IdentityProviderManagementConstants } from "../constants";
import { FIDOTrustedAppsResponseInterface } from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the FIDO trusted apps.
 *
 * @param shouldFetch - Should fetch the data.
 *
 * @returns FIDO trusted apps list.
 */
export const useFIDOTrustedApps = <Data = FIDOTrustedAppsResponseInterface, Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store?.getState()?.config?.endpoints?.fidoTrustedApps
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Update the FIDO trusted apps.
 *
 * @param fidoTrustedApps - List of FIDO Trusted Apps.
 *
 * @returns Updated FIDO trusted apps list.
 */
export const updateFidoTrustedApps = (
    fidoTrustedApps: FIDOTrustedAppsResponseInterface
): Promise<void> => {

    const requestConfig: RequestConfigInterface = {
        data: fidoTrustedApps,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store?.getState()?.config?.endpoints?.fidoTrustedApps
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response?.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.FIDO_TRUSTED_APPS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response?.status,
                    response?.request,
                    response,
                    response?.config);
            }
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.FIDO_TRUSTED_APPS_UPDATE_ERROR,
                error?.stack,
                error?.response?.data?.code,
                error?.request,
                error?.response,
                error?.config);
        });
};
