/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import SMSSenderConstants from "../constants/sms-sender-constants";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Delete sms notification senders with name SMSPublisher.
 *
 * @returns  A promise containing the response.
 */
const deleteSMSPublisher = (): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.smsPublisher
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    SMSSenderConstants.ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            let errorMessage: string = SMSSenderConstants.ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER;

            if (error.response?.data?.code ===
                SMSSenderConstants.ErrorMessages.SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS.getErrorCode()) {
                errorMessage = SMSSenderConstants.ErrorMessages.SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS
                    .getErrorMessage();
            }
            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);

        });
};

export default deleteSMSPublisher;
