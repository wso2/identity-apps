/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { LocalAuthenticatorInterface } from "../../../features/identity-providers/models/identity-provider";
import { store } from "../../core";
import { ServerConfigurationsConstants } from "../constants";
import {
    GovernanceConnectorInterface,
    RealmConfigInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance());

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
