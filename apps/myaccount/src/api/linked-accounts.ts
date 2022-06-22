/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AsgardeoSPAClient, BasicUserInfo } from "@asgardeo/auth-react";
import { HttpMethods, LinkedAccountInterface } from "../models";
import { store } from "../store";

/**
 * OAuth object.
 *
 * @type {OAuthSingletonInterface}
 */
const oAuth = AsgardeoSPAClient.getInstance();

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = oAuth.httpRequest.bind(oAuth);

/**
 * Retrieve the user account associations of the currently authenticated user.
 *
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const getAssociations = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.associations
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject("Failed to retrieve the linked accounts");
            }

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
export const addAccountAssociation = (data: Record<string, unknown>): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.associations
    };

    return httpClient(requestConfig)
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
export const removeLinkedAccount = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.associations }/${ id }`
    };

    return httpClient(requestConfig)
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
export const removeAllLinkedAccounts = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.associations
    };

    return httpClient(requestConfig)
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
export const switchAccount = (account: LinkedAccountInterface): Promise<any> => {

    return oAuth
        .requestCustomGrant({
            attachToken: false,
            data: {
                client_id: "{{clientID}}",
                grant_type: "account_switch",
                scope: "{{scope}}",
                "tenant-domain": account.tenantDomain,
                token: "{{token}}",
                username: account.username,
                "userstore-domain": account.userStoreDomain
            },
            id: "account-switch",
            returnsSession: true,
            signInRequired: true
        })
        .then((response: BasicUserInfo) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
