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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { IdentityProviderManagementConstants } from "../constants";
import { FIDOConfigsInterface, FIDOConnectorConfigsInterface } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the FIDO2 connector configs.
 *
 * @param shouldFetch - Should fetch the data.
 *
 * @returns FIDO2 connector configs.
 */
export const useFIDOConnectorConfigs = <Data = FIDOConnectorConfigsInterface, Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store?.getState()?.config?.endpoints?.fidoConfigs}/${
            IdentityProviderManagementConstants.FIDO_CONNECTOR_CONFIG_NAME}`
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
 * Update the FIDO configurations.
 *
 * @param fidoConfigs - Is customizations already done or not.
 *
 * @returns Updated FIDO configs.
 */
export const updateFidoConfigs = (
    fidoConfigs: FIDOConfigsInterface
): Promise<FIDOConnectorConfigsInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: fidoConfigs,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store?.getState()?.config?.endpoints?.fidoConfigs
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response?.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response?.status,
                    response?.request,
                    response,
                    response?.config);
            }

            return Promise.resolve(response.data as FIDOConnectorConfigsInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_CONFIG_UPDATE_ERROR,
                error?.stack,
                error?.response?.data?.code,
                error?.request,
                error?.response,
                error?.config);
        });
};
