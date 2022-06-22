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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
    ConsentInterface,
    ConsentReceiptInterface,
    ConsentState,
    HttpMethods,
    PurposeModel,
    PurposeModelPartial,
    UpdateReceiptInterface
} from "../models";
import { store } from "../store";

/**
 * Initialize an axios Http client.
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());
const httpClientAll = AsgardeoSPAClient.getInstance().httpRequestAll.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches a list of consented applications of the currently authenticated user.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchConsentedApps = async (state: ConsentState, username: string): Promise<ConsentInterface[]> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            piiPrincipalId: username,
            state
        },
        url: store.getState().config.endpoints.consentManagement.consent.listAllConsents
    };

    return httpClient(requestConfig)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Fetch the consent receipt.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchConsentReceipt = (receiptId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.consentManagement.consent.consentReceipt + `/${receiptId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            return response.data as ConsentReceiptInterface;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Fetches all the purposes available in the system. The response
 * {@link PurposeModelPartial[]} will not contain the specific piiCategory information
 * of each of the purposes. Instead it's only returns the basic/partial information of
 * all the purpose in the system.
 *
 * Note on arguments: -
 * - {@link limit} will defaults to 0 if not provided. If limit is zero
 * the API will send all the records at once.
 * - {@link offset} will defaults to 0 if not provided. If the offset is zero
 * server will start searching the records starting from zero.
 *
 * @param {number | 0} limit Number of search results
 * @param {number | 0} offset Start index of the search
 * @return {Promise<PurposeModelPartial[]>} response data
 */
export const fetchAllPurposes = async (limit: number = 0, offset: number = 0): Promise<PurposeModelPartial[]> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: { "limit": limit, "offset": offset },
        url: store.getState().config.endpoints.consentManagement.purpose.list
    };

    try {
        const response: AxiosResponse = await httpClient(requestConfig);

        return Promise.resolve<PurposeModelPartial[]>(response.data as PurposeModelPartial[]);
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Fetches multiple {@link PurposeModel} by given a set of IDs. This function is useful
 * when we need to get some detailed information about a consent receipts' purpose(s).
 * This is because when the client use a method like {@link fetchConsentReceipt} it
 * only gives the receipt with limited information.
 *
 * Context: -
 * A consent can have many services, under services we have many purposes, and
 * each purpose has many pii-category claims.
 *
 * Example: -
 * Assume that we fetched a receipt {@link ConsentReceiptInterface} by its ID.
 * Now we can easily access all of its properties. Let's say now you want to
 * display all the piiCategories in each purpose regardless of whether the user
 * granted or denied that claim.
 *
 * However, now you will run into a limitation where {@link ConsentReceiptInterface}
 * only contains the granted claims in its: {@code receipt.services.each(purposes.
 * each(purpose.piiCategory))} array. In this case you have to use this method to get
 * detailed info about each of its purposes.
 *
 * Usage: -
 * This service method will accept multiple {@code purposeIDs} and aggregate
 * them to make concurrent requests for each ID. You can pass an {@code number[]}
 * argument which contains only one purposeID as well.
 *
 * @param {Iterable[]} purposeIDs
 * @return {PurposeModel[]} response data
 */
export const fetchPurposesByIDs = async (purposeIDs: Iterable<number>): Promise<PurposeModel[]> => {

    const requestConfigurations: AxiosRequestConfig[] = [];
    const url = store.getState().config.endpoints.consentManagement.purpose.getPurpose;

    for (const purposeID of purposeIDs) {
        const requestConfiguration: AxiosRequestConfig = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            /* Contains a additional path parameter :purposeId */
            url: `${ url }/${ purposeID }`
        };

        requestConfigurations.push(requestConfiguration);
    }

    try {
        const response: AxiosResponse[] = await httpClientAll(requestConfigurations);
        const models = response.map(res => res.data as PurposeModel);

        return Promise.resolve<PurposeModel[]>(models);
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Revoke the consent given to an application.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const revokeConsentedApp = (appId: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.consentManagement.consent.consentReceipt + `/${appId}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            // TODO: change the return type
            return response.data as ConsentReceiptInterface;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Intercepts and handles actions of type `UPDATE_CONSENTED_CLAIMS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
export const updateConsentedClaims = (receipt: ConsentReceiptInterface): Promise<any> => {
    const body: UpdateReceiptInterface = {
        collectionMethod: "Web Form - My Account",
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
                purposeCategoryId: [ 1 ],
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

    const requestConfig = {
        data: body,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.consentManagement.consent.addConsent
    };

    return httpClient(requestConfig)
        .then((response) => {
            return response.data as ConsentReceiptInterface;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
