/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpErrorResponseDataInterface, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import {
    PresentationDefinition,
    PresentationDefinitionCreationModel,
    PresentationDefinitionUpdateModel
} from "../models/presentation-definitions";

const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Create a new presentation definition.
 *
 * @param data - The presentation definition data to create.
 * @returns Promise with the created definition.
 */
export const addPresentationDefinition = (
    data: PresentationDefinitionCreationModel
): Promise<PresentationDefinition> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.vpTemplates
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response?.data))
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};

/**
 * Update an existing presentation definition.
 *
 * @param definitionId - The ID of the definition to update.
 * @param data - The updated data.
 * @returns Promise with the updated definition.
 */
export const updatePresentationDefinition = (
    definitionId: string,
    data: PresentationDefinitionUpdateModel
): Promise<PresentationDefinition> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.vpTemplates}/${definitionId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response?.data))
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};

/**
 * Delete a presentation definition.
 *
 * @param definitionId - The ID of the definition to delete.
 * @returns Promise with the response.
 */
export const deletePresentationDefinition = (definitionId: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.vpTemplates}/${definitionId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response))
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};
