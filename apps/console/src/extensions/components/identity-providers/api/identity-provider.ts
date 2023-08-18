/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../../../features/core";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../features/core/hooks/use-request";
import { SMSOTPConstants } from "../constants";
import { NotificationSenderSMSInterface } from "../models";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get all sms notification senders with name SMSPublisher.
 *
 * @returns  A promise containing the response.
 */
export const useSMSNotificationSenders = <Data = NotificationSenderSMSInterface[], Error = RequestErrorInterface>():
    RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.notificationSendersEndPoint + "/sms"
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

/**
 * Add sms notification senders with name SMSPublisher.
 *
 * @returns  A promise containing the response.
 */
export const addSMSPublisher = (): Promise<NotificationSenderSMSInterface> => {
    //SMS Notification sender with name SMSPublisher.
    const smsProvider: NotificationSenderSMSInterface = {
        contentType: "FORM",
        name: "SMSPublisher",
        properties: [
            {
                key: "channel.type",
                value: "choreo"
            }
        ],
        provider: "choreo",
        providerURL: "https://console.choreo.dev/"
    };

    const requestConfig: RequestConfigInterface = {
        data: smsProvider,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.notificationSendersEndPoint + "/sms"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<NotificationSenderSMSInterface>) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    SMSOTPConstants.ERROR_IN_CREATING_SMS_NOTIFICATION_SENDER,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as NotificationSenderSMSInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                SMSOTPConstants.ERROR_IN_CREATING_SMS_NOTIFICATION_SENDER,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Delete sms notification senders with name SMSPublisher.
 *
 * @returns  A promise containing the response.
 */
export const deleteSMSPublisher = (): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.notificationSendersEndPoint + "/sms/SMSPublisher"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    SMSOTPConstants.ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            let errorMessage: string = SMSOTPConstants.ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER;

            if (error.response?.data?.code ===
                SMSOTPConstants.ErrorMessages.SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS.getErrorCode()) {
                errorMessage = SMSOTPConstants.ErrorMessages.SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS
                    .getErrorMessage();
            }
            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);

        });
};
