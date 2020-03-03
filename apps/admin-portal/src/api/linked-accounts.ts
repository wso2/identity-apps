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

import { AuthenticateSessionUtil, SignInUtil } from "@wso2is/authentication";
import { AxiosHttpClient } from "@wso2is/http";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { HttpMethods, LinkedAccountInterface } from "../models";
import { SYSTEM_SCOPE } from "../constants";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve the user account associations of the currently authenticated user.
 *
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAssociations = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.associations
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Add new associate account for the currently authenticated user.
 *
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const addAccountAssociation = (data: object): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.associations
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Remove a linked account for the currently authenticated user.
 *
 * @return {Promise<any>}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeLinkedAccount = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ ServiceResourcesEndpoint.associations }/${ id }`
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Removes all linked accounts of the authenticated user.
 *
 * @remarks
 * The API treats all the associations as a single entity and when you
 * remove all the associations and add one again, already removed
 * associations are also added again.
 *
 * @return {Promise<any>}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeAllLinkedAccounts = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: ServiceResourcesEndpoint.associations
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Switches the logged in user's account to one of the linked accounts
 * associated to the corresponding user.
 *
 * @param {LinkedAccountInterface} account - The target account.
 * @return {Promise<any>}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const switchAccount = (account: LinkedAccountInterface): Promise<any> => {
    const requestParams = {
        "client_id": GlobalConfig.clientID,
        "scope": [ SYSTEM_SCOPE ],
        "tenant-domain": account.tenantDomain,
        "username": account.username,
        "userstore-domain": account.userStoreDomain
    };

    return SignInUtil.sendAccountSwitchRequest(requestParams, GlobalConfig.clientHost)
        .then((response) => {
            AuthenticateSessionUtil.initUserSession(response,
                SignInUtil.getAuthenticatedUser(response.idToken));
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
