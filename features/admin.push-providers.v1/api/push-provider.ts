/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AcceptHeaderValues, ContentTypeHeaderValues, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { PushProviderAPIInterface, PushProviderAPIResponseInterface } from "../models/push-providers";

const httpClient: (
    config: HttpRequestConfig
) => Promise<AxiosResponse> = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

export const createPushProvider = async (data: PushProviderAPIInterface):
    Promise<PushProviderAPIResponseInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: data,
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.pushProviders }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    "Push Provider creation failed!",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data as PushProviderAPIResponseInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export const updatePushProvider = async (data: PushProviderAPIInterface):
    Promise<HttpResponse | undefined> => {

    const requestConfig: RequestConfigInterface = {
        data: data,
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.pushProviders + "/PushPublisher"
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) =>  response)
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export const deletePushProvider = async (): Promise<AxiosResponse> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.pushProviders + "/PushPublisher"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) =>  response)
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};
