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
import { store } from "@wso2is/admin.core.v1/store";
import { HttpErrorResponseDataInterface, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
    ConnectedIdpsResponseInterface,
    ConnectionClaimMappingsResponseInterface,
    IssuerConfigListResponseInterface,
    PresentationDefinitionInterface,
    PresentationDefinitionCreationModelInterface,
    PresentationDefinitionUpdateModelInterface
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
    data: PresentationDefinitionCreationModelInterface
): Promise<PresentationDefinitionInterface> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.presentationDefinitions
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                return Promise.reject(new Error("Failed to create the presentation definition."));
            }

            return Promise.resolve(response?.data);
        })
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
    data: PresentationDefinitionUpdateModelInterface
): Promise<PresentationDefinitionInterface> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.presentationDefinitions}/${definitionId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update the presentation definition."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};

/**
 * Delete a presentation definition.
 *
 * @param definitionId - The ID of the definition to delete.
 * @returns Promise with the response.
 */
export const deletePresentationDefinition = (definitionId: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.presentationDefinitions}/${definitionId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                return Promise.reject(new Error("Failed to delete the presentation definition."));
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};

/**
 * Get connections that reference a presentation definition.
 *
 * @param definitionId - The ID of the presentation definition.
 * @returns Promise with the connected connections response.
 */
export const getConnectedIdps = (
    definitionId: string
): Promise<ConnectedIdpsResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.presentationDefinitions}/${definitionId}/connected-idps`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to fetch connected IDPs."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};

/**
 * Fetch the claim mappings configured for a specific identity provider (connection).
 * Used to determine whether a PD claim is already in use before allowing edits or deletion.
 *
 * @param idpId - The UUID of the identity provider.
 * @returns Promise resolving to the IDP's claim configuration.
 */
export const fetchConnectionClaimMappings = (
    idpId: string
): Promise<ConnectionClaimMappingsResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.identityProviders}/${idpId}/claims`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to fetch connection claim mappings."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};

/**
 * Replace all trusted issuer configurations for a specific credential (idempotent PUT).
 * The supplied list entirely replaces what is stored; at least one entry is required.
 *
 * @param definitionId - The ID of the parent presentation definition.
 * @param credentialId - The credential query identifier.
 * @param data - The complete list of issuer configs to store.
 * @returns Promise with the stored issuer config list echoed back.
 */
export const replaceIssuerConfigs = (
    definitionId: string,
    credentialId: string,
    data: IssuerConfigListResponseInterface
): Promise<IssuerConfigListResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.presentationDefinitions}/${definitionId}/credentials/${encodeURIComponent(credentialId)}/issuer-configs`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                return Promise.reject(new Error("Failed to replace issuer configurations."));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};
