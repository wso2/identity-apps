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
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useRequest, { 
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../features/core/hooks/use-request";
import { store } from "../../../../features/core/store";
import { EventManagementConstants } from "../constants";
import { EventPublishingAPIResponseInterface }  from "../models";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get event configurations.
 * 
 * @returns the event configurations of the tenant.
 */
export const useEventConfig = <Data = EventPublishingAPIResponseInterface[], Error = RequestErrorInterface> 
    (): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.eventsEndpoint
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
 * Update event configurations.
 * 
 * @param data - the updated event configurations.
 * @returns a promise to update the event configurations.
 */
export const updateEventConfigurations = (data:EventPublishingAPIResponseInterface[]): 
    Promise<EventPublishingAPIResponseInterface> => {
    
    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.PUT ,
        url: store.getState().config.endpoints.eventsEndpoint
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    EventManagementConstants.ErrorMessages.EVENT_CONFIGURATION_UPDATE_INVALID_STATUS_CODE_ERROR
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as EventPublishingAPIResponseInterface);
        }).catch((error: AxiosError) => {
            let errorMessage: string = EventManagementConstants.ErrorMessages.EVENTS_CONFIGURATION_UPDATE_ERROR
                .getErrorMessage();

            if (error.response?.data?.code === EventManagementConstants.EVENT_UPDATE_ACTIVE_SUBS_ERROR_CODE_BE) {
                errorMessage = EventManagementConstants.ErrorMessages.EVENT_CONFIGURATION_UPDATE_ACTIVE_SUBS_ERROR
                    .getErrorMessage();
            }
            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};
