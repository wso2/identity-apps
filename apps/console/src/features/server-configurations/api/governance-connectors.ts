/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { IdentityClient } from "@asgardio/oidc-js";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import { store } from "../../core";
import { ServerConfigurationsConstants } from "../constants";
import { GovernanceConnectorInterface } from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

export const getData = (url: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: url
    };

    return httpClient(requestConfig)
        .then((response) => {
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
        .catch((error) => {
            throw new IdentityAppsApiException(
                ServerConfigurationsConstants.CONFIGS_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

export const updateConfigurations = (data: object, url: string): Promise<any> => {
    const requestConfig = {
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
        .catch((error) => {
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
 * @returns {Promise<any>} a promise containing the data.
 */
export const getConnectorCategories = (): Promise<any> => {
    return getData(store.getState().config.endpoints.governanceConnectorCategories);
};

/**
 * Retrieve governance connector category.
 *
 * @returns {Promise<any>} a promise containing the data.
 */
export const getConnectorCategory = (categoryId: string): Promise<any> => {
    return getData(store.getState().config.endpoints.governanceConnectorCategories + "/" + categoryId);
};

/**
 * Update governance connector configurations.
 *
 * @param data request payload
 * @param categoryId ID of the connector category
 * @param connectorId ID of the connector
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateGovernanceConnector = (data: object, categoryId: string, connectorId: string): Promise<any> => {
    const url = store.getState().config.endpoints.governanceConnectorCategories +
        "/" + categoryId + "/connectors/" + connectorId;
    return updateConfigurations(data, url);
};

/**
 * Get governance connector configurations.
 *
 * @param categoryId ID of the connector category
 * @returns {Promise<any>} a promise containing the response.
 */
export const getGovernanceConnectors = (categoryId: string): Promise<GovernanceConnectorInterface[]> => {
    const url = store.getState().config.endpoints.governanceConnectorCategories +
        "/" + categoryId + "/connectors/";
    return getData(url);
};

/**
 * Retrieve server configurations.
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const getServerConfigurations = (): Promise<any> => {
    return getData(store.getState().config.endpoints.serverConfigurations);
};

/**
 * Update server configurations.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateServerConfigurations = (data: object): Promise<any> => {
    return updateConfigurations(data, store.getState().config.endpoints.serverConfigurations);
};
