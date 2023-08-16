/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
