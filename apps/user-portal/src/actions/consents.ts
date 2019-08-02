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

import axios from "axios";
import log from "log";
import { ServiceResourcesEndpoint } from "../configs";
import { ConsentInterface, ConsentReceiptInterface, ConsentState } from "../models/consents";
import { getLoginSession, isLoggedSession } from "./session";

/**
 * Fetches the consents from the API.
 * @param {ConsentState} state consent state ex: ACTIVE, REVOKED
 * @return {Promise<ConsentInterface[]>} a promise containing the response
 */
export const getConsents = (state: ConsentState) => {
    if (isLoggedSession()) {
        const url = ServiceResourcesEndpoint.consents;
        const token = getLoginSession("access_token");
        const headers = {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        const params = {
            piiPrincipalId: getLoginSession("authenticated_user"),
            state
        };

        return axios
            .get(url, { params, headers })
            .then((response) => {
                return response.data as ConsentInterface[];
            })
            .catch((error) => {
                log.error(error);
                return Promise.reject(error);
            });
    }
};

/**
 * Fetches the consent receipt when an ID is passed in.
 * @param {string} id receipt ID
 * @return {Promise<ConsentReceiptInterface>} a promise containing the response
 */
export const getConsentReceipt = (id: string) => {
    if (isLoggedSession()) {
        const url = ServiceResourcesEndpoint.receipts + `/${id}`;
        const token = getLoginSession("access_token");
        const headers = {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        return axios
            .get(url, { headers })
            .then((response) => {
                return response.data as ConsentReceiptInterface;
            })
            .catch((error) => {
                log.error(error);
                return Promise.reject(error);
            });
    }
};

/**
 * Revokes the consent of an application when the receipt.
 * @param {string} id receipt ID
 * @return {Promise<AxiosResponse<any>>} a promise containing the response
 */
export const revokeConsent = (id: string) => {
    if (isLoggedSession()) {
        const url = ServiceResourcesEndpoint.receipts + `/${id}`;
        const token = getLoginSession("access_token");
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        };

        return axios
            .delete(url, { headers })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                log.error(error);
                return Promise.reject(error);
            });
    }
};
