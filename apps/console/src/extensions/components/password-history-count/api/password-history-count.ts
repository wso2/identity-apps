/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient, HttpRequestConfig } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../../../features/core";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../features/core/hooks/use-request";
import {
    GovernanceConnectorInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../../../../features/server-configurations";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: (
    config: HttpRequestConfig
) => Promise<AxiosResponse> = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

export const useGetPasswordHistoryCount = <
    Data = GovernanceConnectorInterface,
    Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState()?.config?.endpoints?.passwordHistory
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(
        requestConfig
    );

    return {
        data,
        error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};

export const updatePasswordHistoryCount = (
    data: UpdateGovernanceConnectorConfigInterface
): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState()?.config?.endpoints?.passwordHistory
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Received an invalid status code while updating the password validation.",
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
                "An error ocurred while updating the password validation.",
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};
