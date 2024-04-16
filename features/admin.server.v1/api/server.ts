/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { I18n } from "@wso2is/i18n";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../admin.core.v1";
import useRequest,
{ RequestConfigInterface, RequestErrorInterface, RequestResultInterface } from "../../admin.core.v1/hooks/use-request";
import { ServerConstants } from "../constants/server";
import { 
    AdminAdvisoryBannerConfigurationInterface, LogType, RemoteLogPublishingConfigurationInterface 
} from "../models/server";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().
    httpRequest.bind(AsgardeoSPAClient.getInstance());
    
/**
 * Hook to get the admin advisory banner configurations.
 * 
 * @returns admin advisory banner configurations.
 */
export const useAdminAdvisoryBannerConfigs = <Data = AdminAdvisoryBannerConfigurationInterface,
    Error = RequestErrorInterface>(shouldFetch: boolean = true): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.adminAdvisoryBanner
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * Update admin advisory banner configurations.
 *
 * @returns a promise containing the server configurations.
 */
export const updateAdminAdvisoryBannerConfiguration = (
    data: AdminAdvisoryBannerConfigurationInterface
) : Promise<AxiosResponse> => {

    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
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
                        ServerConstants.ADMIN_ADVISORY_BANNER_CONFIGS_INVALID_INPUT_ERROR,
                        null,
                        response.status,
                        response.request,
                        response,
                        response.config);
                }

                throw new IdentityAppsApiException(
                    ServerConstants.ADMIN_ADVISORY_BANNER_CONFIGS_UPDATE_REQUEST_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ServerConstants.ADMIN_ADVISORY_BANNER_CONFIGS_UPDATE_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get the remote log publishing configurations.
 * 
 * @returns remote log publishing configurations.
 */
export const useRemoteLogPublishingConfigs = <Data = RemoteLogPublishingConfigurationInterface[],
    Error = RequestErrorInterface>(shouldFetch: boolean = true): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.remoteLogging
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * Restore remote log publishing configurations.
 * 
 * @param logType - Log type.
 *
 * @returns a promise containing the response.
 */
export const restoreRemoteLogPublishingConfigurationByLogType = (logType: LogType): Promise<AxiosResponse> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.remoteLogging + "/" + logType
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                I18n.instance.t("console:manage.features.serverConfigs.remoteLogPublishing.errors.genericError"),
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update remote log publishing configurations.
 *
 * @returns a promise containing the response.
 */
export const updateRemoteLogPublishingConfigurationByLogType = (
    config: RemoteLogPublishingConfigurationInterface
): Promise<AxiosResponse> => {

    const { logType, ...data } = config;

    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.remoteLogging + "/" + logType
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                I18n.instance.t("console:manage.features.serverConfigs.remoteLogPublishing.errors.genericError"),
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
