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

import { AxiosHttpClient } from "@wso2is/http";
import { GlobalConfig } from "../configs";
import { ApplicationBasic, ApplicationList, Claim, ClaimDialect, ExternalClaim, HttpMethods } from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve claims in local dialect.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getLocalClaims = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: "https://localhost:9443/api/server/v1/claim-dialects/local/claims"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get local claims from: "));
            }
            return Promise.resolve(response.data as Claim);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve claims dialects.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getClaimDialect = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: "https://localhost:9443/t/carbon.super/api/server/v1/claim-dialects"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get claim dialect from: "));
            }
            return Promise.resolve(response.data as ClaimDialect);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets claims in other dialects.
 *
 * @param dialectID Selected dialectID.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getExternalClaims = (dialectID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: "https://localhost:9443/t/carbon.super/api/server/v1/claim-dialects/" + dialectID + "/claims"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get external claims: "));
            }
            return Promise.resolve(response.data as ExternalClaim);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the basic information about the application.
 *
 * @param id ID of the application.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getApplicationDetails = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: "https://localhost:9443/t/carbon.super/api/server/v1/applications/" + id
    };

    // tslint:disable-next-line:max-line-length
    return httpClient.get(requestConfig.url, { headers: requestConfig.headers })
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get app from: "));
            }
            return Promise.resolve(response.data as ApplicationBasic);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Updates the application with basic details.
 *
 * @param app Basic info about the application.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const updateApplicationDetails = (app: ApplicationBasic): Promise<any> => {
    const requestConfig = {
        data: {
            accessUrl: app.accessUrl,
            description: app.description,
            imageUrl: app.imageUrl,
            name: app.name
        },
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: "https://localhost:9443/t/carbon.super/api/server/v1/applications/" + app.id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update application from: "));
            }
            return Promise.resolve(response.data as ApplicationBasic);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the application list with limit and offset.
 *
 * @param limit Maximum Limit of the application List.
 * @param offset Offset for get to start.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getApplicationList = (limit: string, offset: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: "https://localhost:9443/t/carbon.super/api/server/v1/applications?limit=" + limit + "&offset=" + offset
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get application list from: "));
            }
            return Promise.resolve(response.data as ApplicationList);
        }).catch((error) => {
            return Promise.reject(error);
        });
};
