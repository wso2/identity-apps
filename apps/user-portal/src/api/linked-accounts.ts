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

import { AuthenticateSessionUtil, SignInUtil } from "@wso2is/authenticate";
import { AxiosHttpClient } from "@wso2is/http";
import { ServiceResourcesEndpoint } from "../configs";
import { HttpMethods, LinkedAccountInterface } from "../models";
import { onHttpRequestError, onHttpRequestFinish, onHttpRequestStart, onHttpRequestSuccess } from "../utils";

/**
 * Initialize an axios Http client.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();
httpClient.init(true, onHttpRequestStart, onHttpRequestSuccess, onHttpRequestError, onHttpRequestFinish);

/**
 * Retrieve the user account associations of the currently authenticated user.
 *
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const getAssociations = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.associations
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`Failed to retrieve the linked accounts`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve the linked accounts - ${ error }`);
        });
};

/**
 * Add new associate account for the currently authenticated user.
 *
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const addAccountAssociation = (data: object): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.associations
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to link the account - ${ error }`);
        });
};

/**
 * Remove a user account association for the currently authenticated user.
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const removeAssociation = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        params: {},
        url: ServiceResourcesEndpoint.associations
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            // TODO: handle response when API support is available.
        })
        .catch((error) => {
            // TODO: handle error when API support is available.
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
    const requestParams = {
        "client_id": CLIENT_ID,
        "tenant-domain": account.tenantDomain,
        "username": account.username,
        "userstore-domain": account.userStoreDomain
    };

    return SignInUtil.sendAccountSwitchRequest(requestParams, CLIENT_HOST)
        .then((response) => {
            AuthenticateSessionUtil.initUserSession(response,
                SignInUtil.getAuthenticatedUser(response.idToken));
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to switch the account - ${ error }`);
        });
};
