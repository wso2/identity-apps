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
import { getLoginSession, isLoggedSession } from "./session";
import { ConsentInterface, ConsentState, ConsentReceiptInterface } from '../models/consents';

export const getConsents = async (state: ConsentState) => {
    if (isLoggedSession()) {
        const consentsUrl = ServiceResourcesEndpoint.consents;
        const token = getLoginSession("access_token");
        const headers = {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"

        };
        const params = {
            piiPrincipalId: getLoginSession("authenticated_user"),
            state: state
        };

        try {
            const response = await axios.get(consentsUrl, { params, headers });
            return response.data as ConsentInterface[];
        }
        catch (error) {
            log.error(error);
        }
    }
};

export const getConsentReceipt = async (id: string) => {
    if (isLoggedSession()) {
        const receiptsUrl = ServiceResourcesEndpoint.receipts + `/${id}`;
        const token = getLoginSession("access_token");
        const headers = {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"

        };

        try {
            const response = await axios.get(receiptsUrl, { headers });
            return response.data as ConsentReceiptInterface;
        }
        catch (error) {
            log.error(error);
        }
    }
}
