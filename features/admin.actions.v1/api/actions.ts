/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import useRequest, { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ActionsConstants } from "../constants";
import {
    ActionBasicResponseInterface,
    ActionInterface,
    ActionResponseInterface,
    ActionTypesResponseInterface,
    ActionUpdateInterface
} from "../models";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance());


/**
 * Create an Action.
 *
 * @param actionBody - Body of the Action that needed to be created.
 * @returns `Promise<null | IdentityAppsApiException>`
 */
export const createAction = (
    actionType: string, actionBody: ActionInterface
): Promise<ActionResponseInterface | void> => {

    const requestConfig: AxiosRequestConfig = {
        data: actionBody,
        method: HttpMethods.POST,
        url: `${
            store.getState().config.endpoints.actions
        }/${
            actionType
        }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 *
 * @param actionType - Type of the Action.
 * @returns `Promise<ActionResponseInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const useActionsDetailsByType = <Data = ActionResponseInterface[], Error = RequestErrorInterface>(
    actionType: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${
            store.getState().config.endpoints.actions
        }/${
            actionType
        }`
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
 *
 * @returns `Promise<ActionTypesResponseInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const useActionTypesDetails = <Data = ActionTypesResponseInterface[],
 Error = RequestErrorInterface>(): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${
            store.getState().config.endpoints.actions
        }/${
            ActionsConstants.TYPES_DIR
        }`
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
 * Update an Action.
 * @param actionType - Type of the Action.
 * @param actionId - Id of the Action.
 * @param actionBody - The updated Action configurations.
 * @returns a promise to update the Action configurations.
 */
export const updateAction = (actionType: string, actionId: string, actionBody: ActionUpdateInterface):
    Promise<ActionResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: actionBody,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.PATCH,
        url: `${
            store.getState().config.endpoints.actions
        }/${
            actionType
        }/${
            actionId
        }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ActionsConstants.ErrorMessages
                        .ACTION_UPDATE_ERROR_CODE.getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as ActionResponseInterface);
        }).catch((error: AxiosError) => {
            const errorMessage: string = ActionsConstants.ErrorMessages
                .ACTION_UPDATE_ERROR_CODE.getErrorMessage();

            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};

/**
 * Delete an Action.
 * @param actionType - Type of the Action.
 * @param actionId - Id of the Action.
 * @returns `Promise<null | IdentityAppsApiException>`.
 * @throws `IdentityAppsApiException`.
 */
export const deleteAction = (actionType: string, actionId: string):
    Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.DELETE,
        url: `${
            store.getState().config.endpoints.actions
        }/${
            actionType
        }/${
            actionId
        }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Activate an Action.
 * @param actionType - Type of the Action.
 * @param actionId - Id of the Action.
 * @returns `Promise<ActionBasicResponseInterface>`
 * @throws `IdentityAppsApiException`.
 */
export const activateAction = (actionType: string, actionId: string):
    Promise<ActionBasicResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.POST,
        url: `${
            store.getState().config.endpoints.actions
        }/${
            actionType
        }/${
            actionId
        }/${
            ActionsConstants.ACTIONS_ACTIVATE
        }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as ActionBasicResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Deactivate an Action.
 * @param actionType - Type of the Action.
 * @param actionId - Id of the Action.
 * @returns `Promise<ActionBasicResponseInterface>`
 * @throws `IdentityAppsApiException`.
 */
export const deactivateAction = (actionType: string, actionId: string):
    Promise<ActionBasicResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.POST,
        url: `${
            store.getState().config.endpoints.actions
        }/${
            actionType
        }/${
            actionId
        }/${
            ActionsConstants.ACTIONS_DEACTIVATE
        }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as ActionBasicResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
