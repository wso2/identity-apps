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

import {AuthenticateSessionUtil, AuthenticateUserKeys} from "@wso2is/authenticate";
import axios, {AxiosResponse} from "axios";
import log from "log";
import {ServiceResourcesEndpoint} from "../configs";
import {ConsentInterface, ConsentReceiptInterface, ConsentState, UpdateReceiptInterface} from "../models/consents";

/**
 * Fetches the consents from the API.
 *
 * @param {ConsentState} state consent state ex: ACTIVE, REVOKED.
 * @return {Promise<ConsentInterface[]>} a promise containing the response.
 */
export const getConsents = (state: ConsentState): Promise<ConsentInterface[]> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const headers = {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        const params = {
            piiPrincipalId: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME),
            state
        };

        return axios.get(ServiceResourcesEndpoint.consents, {params, headers})
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to get consents."));
                }
                return Promise.resolve(response.data as ConsentInterface[]);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Fetches the consent receipt when an ID is passed in.
 *
 * @param {string} id receipt ID.
 * @return {Promise<ConsentReceiptInterface>} a promise containing the response.
 */
export const getConsentReceipt = (id: string): Promise<ConsentReceiptInterface> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const url = ServiceResourcesEndpoint.receipts + `/${id}`;
        const headers = {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        return axios.get(url, {headers})
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to get consent receipt."));
                }
                return Promise.resolve(response.data as ConsentReceiptInterface);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Revokes the consent of an application when the receipt.
 *
 * @param {string} id receipt ID.
 * @return {Promise<any>} a promise containing the response.
 */
export const revokeConsent = (id: string): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const url = ServiceResourcesEndpoint.receipts + `/${id}`;
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        };

        return axios.delete(url, {headers})
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to get consent receipt."));
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Updates the already consented claims list.
 *
 * @param receipt receipt object.
 * @return {Promise<any>} a promise containing the response.
 */
export const updateConsentedClaims = (receipt): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const headers = {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        const body: UpdateReceiptInterface = {
            collectionMethod: "Web Form - User Portal",
            jurisdiction: receipt.jurisdiction,
            language: receipt.language,
            policyURL: receipt.policyUrl,
            services: receipt.services.map((service) => ({
                purposes: service.purposes.map((purpose) => ({
                    consentType: purpose.consentType,
                    piiCategory: purpose.piiCategory.map((category) => ({
                        piiCategoryId: category.piiCategoryId,
                        validity: category.validity
                    })),
                    primaryPurpose: purpose.primaryPurpose,
                    purposeCategoryId: [1],
                    purposeId: purpose.purposeId,
                    termination: purpose.termination,
                    thirdPartyDisclosure: purpose.thirdPartyDisclosure,
                    thirdPartyName: purpose.thirdPartyName
                })),
                service: service.service,
                serviceDescription: service.serviceDescription,
                serviceDisplayName: service.serviceDisplayName,
                tenantDomain: service.tenantDomain
            }))
        };

        return axios.post(ServiceResourcesEndpoint.consents, body, {headers})
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to get consent receipt."));
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};
