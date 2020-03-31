/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AxiosHttpClient } from "@wso2is/http";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import {
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaInterface,
    HttpMethods,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderResponseInterface,
    IdentityProviderTemplateListInterface,
    IdentityProviderTemplateListItemInterface
} from "../models";
import { AxiosError, AxiosResponse } from "axios";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { IdentityProviderManagementConstants } from "../constants";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Creates Identity Provider.
 *
 * @param identityProvider Identity provider settings data.
 */
export const createIdentityProvider = (identityProvider: object): Promise<any> => {
    const requestConfig = {
        data: identityProvider,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.identityProviders
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if ((response.status !== 201)) {
                return Promise.reject(new Error("Failed to create the application."));
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the IdP list with limit and offset.
 *
 * @param {number} limit - Maximum Limit of the IdP List.
 * @param {number} offset - Offset for get to start.
 * @param {string} filter - Search filter.
 *
 * @return {Promise<IdentityProviderListResponseInterface>} A promise containing the response.
 */
export const getIdentityProviderList = (limit?: number, offset?: number,
                                   filter?: string): Promise<IdentityProviderListResponseInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: ServiceResourcesEndpoint.identityProviders
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get IdP list from: "));
            }
            return Promise.resolve(response.data as IdentityProviderListResponseInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets detail about the Identity Provider.
 *
 * @param id Identity Provider Id.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getIdentityProviderDetail = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProviders + "/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get idp details from: "));
            }
            return Promise.resolve(response.data as IdentityProviderResponseInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Deletes an IdP when the relevant id is passed in.
 *
 * @param id ID of the IdP.
 * @return {Promise<any>} A promise containing the response.
 */
export const deleteIdentityProvider = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: ServiceResourcesEndpoint.identityProviders + "/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(new Error("Failed to delete the identity provider."));
            }
            return Promise.resolve(response);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update identity provider details.
 *
 * @param idp Identity Provider.
 * @return {Promise<any>} A promise containing the response.
 */
export const updateIdentityProviderDetails = (idp: IdentityProviderInterface): Promise<any> => {

    const { id, ...rest } = idp;
    const replaceOps = [];

    for (const key in rest) {
        replaceOps.push({
            "operation": "REPLACE",
            "path": "/" + key,
            "value": rest[key]
        });
    }

    const requestConfig = {
        data: replaceOps,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: ServiceResourcesEndpoint.identityProviders + "/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + id));
            }
            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update a federated authenticator of a specified IDP.
 *
 * @param idpId ID of the Identity Provider.
 * @param authenticator Federated Authenticator.
 * @return {Promise<any>} A promise containing the response.
 */
export const updateFederatedAuthenticator = (
    idpId: string,
    authenticator: FederatedAuthenticatorListItemInterface
): Promise<any> => {

    const { authenticatorId, ...rest } = authenticator;

    const requestConfig = {
        data: rest,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: ServiceResourcesEndpoint.identityProviders + "/" + idpId + "/federated-authenticators/" + authenticatorId
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }
            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator metadata.
 *
 * @param idpId ID of the Identity Provider.
 * @param authenticatorId ID of the Federated Authenticator.
 * @return {Promise<any>} A promise containing the response.
 */
export const getFederatedAuthenticatorDetails = (idpId: string, authenticatorId: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProviders + "/" + idpId + "/federated-authenticators/" + authenticatorId
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticator details for: " + authenticatorId));
            }
            return Promise.resolve(response.data as FederatedAuthenticatorListItemInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator details.
 *
 * @param id ID of the Federated Authenticator.
 * @return {Promise<any>} A promise containing the response.
 */
export const getFederatedAuthenticatorMeta = (id: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProviders + "/meta/federated-authenticators/" + id
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticator meta details for: " + id));
            }
            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator details.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const getFederatedAuthenticatorsList = (): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProviders + "/meta/federated-authenticators"
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticators list"));
            }
            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator metadata.
 *
 * @param idpId ID of the Identity Provider.
 * @param authenticatorId ID of the Federated Authenticator.
 * @return {Promise<any>} A promise containing the response.
 */
export const getFederatedAuthenticatorMetadata = (authenticatorId: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProviders + "/meta/federated-authenticators/" + authenticatorId
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticator metadata for: "
                    + authenticatorId));
            }

            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the identity provider template list with limit and offset.
 *
 * @param {number} limit - Maximum Limit of the identity provider template List.
 * @param {number} offset - Offset for get to start.
 * @param {string} filter - Search filter.
 *
 * @return {Promise<IdentityProviderTemplateListInterface>} A promise containing the response.
 */
export const getIdentityProviderTemplateList = (limit?: number, offset?: number,
                                           filter?: string): Promise<IdentityProviderTemplateListInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: ServiceResourcesEndpoint.identityProviders + "/templates"
    };

    return httpClient.request(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants
                        .IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as IdentityProviderTemplateListInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Gets the identity provider template.
 *
 * @param templateId Id value of the template.
 * @return {Promise<IdentityProviderTemplateListItemInterface>} A promise containing the response.
 */
export const getIdentityProviderTemplate = (templateId: string): Promise<IdentityProviderTemplateListItemInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.identityProviders + "/templates/" + templateId
    };

    return httpClient.request(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants
                        .IDENTITY_PROVIDER_TEMPLATE_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as IdentityProviderTemplateListItemInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.IDENTITY_PROVIDER_TEMPLATE_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
