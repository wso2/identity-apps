/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { LocalAuthenticatorInterface } from "@wso2is/admin.identity-providers.v1/models/identity-provider";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ServerConfigurationsConstants } from "../constants";
import {
    GovernanceCategoryForOrgsInterface,
    GovernanceConnectorInterface,
    RealmConfigInterface,
    RevertGovernanceConnectorConfigInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance());

/**
 * Get governance connector categories.
 *
 *
 * @returns the governance connector categories.
 */
export const useGovernanceConnectorCategories = <
    Data = GovernanceCategoryForOrgsInterface[],
    Error = RequestErrorInterface
>
    (shouldFetch: boolean = true): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.governanceConnectorCategories
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig: null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * Get governance connectors of a given category.
 *
 * @param categoryId - ID of the connector category
 * @returns the governance connector.
 */
export const useGovernanceConnectors = <
    Data = GovernanceConnectorInterface[],
    Error = RequestErrorInterface
    >(
        categoryId: string,
        shouldFetch: boolean = true
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.governanceConnectorCategories + "/"
            + categoryId + "/connectors/"
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig: null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * Get details of a governance connector.
 *
 * @param categoryId - ID of the connector category
 * @param connectorId - ID of the connector
 * @returns the governance connector.
 */
export const useGetGovernanceConnectorById = <
    Data = GovernanceConnectorInterface,
    Error = RequestErrorInterface
    >(
        categoryId: string,
        connectorId: string,
        shouldFetch: boolean = true
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.governanceConnectorCategories + "/"
            + categoryId + "/connectors/" + connectorId
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig: null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

export const getData = (url: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: url
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ServerConfigurationsConstants.CONFIGS_FETCH_REQUEST_INVALID_STATUS_CODE_ERROR,
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
                ServerConfigurationsConstants.CONFIGS_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

export const updateConfigurations = (data: UpdateGovernanceConnectorConfigInterface, url: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: url
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ServerConfigurationsConstants.CONFIGS_UPDATE_REQUEST_INVALID_STATUS_CODE_ERROR,
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
                ServerConfigurationsConstants.CONFIGS_UPDATE_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Retrieve governance connector categories.
 *
 * @returns a promise containing the data.
 */
export const getConnectorCategories = (): Promise<any> => {
    return getData(store.getState().config.endpoints.governanceConnectorCategories);
};

/**
 * Retrieve governance connector category.
 *
 * @returns a promise containing the data.
 */
export const getConnectorCategory = (categoryId: string): Promise<any> => {
    return getData(store.getState().config.endpoints.governanceConnectorCategories + "/" + categoryId);
};

/**
 * Update governance connector configurations.
 *
 * @param data - request payload
 * @param categoryId - ID of the connector category
 * @param connectorId - ID of the connector
 * @returns a promise containing the response.
 */
export const updateGovernanceConnector = (data: UpdateGovernanceConnectorConfigInterface, categoryId: string,
    connectorId: string): Promise<any> => {
    const url: string = store.getState().config.endpoints.governanceConnectorCategories +
        "/" + categoryId + "/connectors/" + connectorId;

    return updateConfigurations(data, url);
};

/**
 * Revert governance connector configurations.
 *
 * @param categoryId - ID of the connector category
 * @param connectorId - ID of the connector
 * @param requestBody - request payload
 * @returns a promise containing the response.
 */
export const revertGovernanceConnectorProperties = (
    categoryId: string,
    connectorId: string,
    requestBody: RevertGovernanceConnectorConfigInterface
): Promise<any> => {
    const url: string = store.getState().config.endpoints.governanceConnectorCategories +
        "/" + categoryId + "/connectors/revert";

    const requestConfig: AxiosRequestConfig = {
        data: requestBody,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        params: {
            connectorId: connectorId
        },
        url: url
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ServerConfigurationsConstants.CONFIGS_REVERT_REQUEST_INVALID_STATUS_CODE_ERROR,
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
                ServerConfigurationsConstants.CONFIGS_REVERT_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get governance connector configurations.
 *
 * @param categoryId - ID of the connector category
 * @returns a promise containing the response.
 */
export const getGovernanceConnectors = (categoryId: string): Promise<GovernanceConnectorInterface[]> => {
    const url: string = store.getState().config.endpoints.governanceConnectorCategories +
        "/" + categoryId + "/connectors/";

    return getData(url);
};

/**
 * Retrieve server configurations.
 *
 * @returns a promise containing the response.
 */
export const getServerConfigurations = (): Promise<any> => {
    return getData(store.getState().config.endpoints.serverConfigurations);
};

/**
 * Update server configurations.
 *
 * @param data - request payload
 *
 * @returns a promise containing the response.
 */
export const updateServerConfigurations = (data: UpdateGovernanceConnectorConfigInterface): Promise<any> => {
    return updateConfigurations(data, store.getState().config.endpoints.serverConfigurations);
};

/**
 * Retrieve governance connector details.
 *
 * @returns a promise containing the data.
 */
export const getConnectorDetails = (categoryId: string, connectorId: string): Promise<any> => {
    return getData(store.getState().config.endpoints.governanceConnectorCategories + "/" + categoryId +
        "/connectors/" + connectorId);
};

interface ServerConfigurationCorsInterface {
    allowAnyOrigin: boolean;
    allowGenericHttpRequests: boolean;
    allowSubdomains: boolean;
    exposedHeaders: string[];
    maxAge: number;
    supportAnyHeader: boolean;
    supportedHeaders: {[key: string]: string}[];
    supportedMethods: string[];
    supportsCredentials: boolean;
}

export interface ServerConfigurationsInterface {
    authenticators: LocalAuthenticatorInterface;
    cors: ServerConfigurationCorsInterface;
    realmConfig: RealmConfigInterface;
    homeRealmIdentifiers: string[];
    idleSessionTimeoutPeriod: string[];
    provisioning: any;
    rememberMePeriod: string;
}
