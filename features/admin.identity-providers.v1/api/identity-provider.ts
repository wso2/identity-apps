/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { IdentityProviderManagementConstants } from "../constants";
import {
    AuthenticatorInterface,
    ConnectedAppsInterface,
    FederatedAuthenticatorListResponseInterface,
    FederatedAuthenticatorMetaInterface,
    IdentityProviderGroupInterface,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderResponseInterface,
    IdentityProviderRolesInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateListResponseInterface,
    LocalAuthenticatorInterface,
    MultiFactorAuthenticatorInterface,
    OutboundProvisioningConnectorListItemInterface
} from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());
const httpClientAll: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequestAll.bind(AsgardeoSPAClient.getInstance());

/**
 * Creates Identity Provider.
 *
 * @param identityProvider - Identity provider settings data.
 */
export const createIdentityProvider = <T = Record<string, unknown>> (identityProvider: T): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data: identityProvider,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.identityProviders
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if ((response.status !== 201)) {
                return Promise.reject(new Error("Failed to create the application."));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the IdP list with limit and offset.
 *
 * @deprecated Use `useIdentityProviderList` hook instead.
 * @param limit - Maximum Limit of the IdP List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 *
 * @returns A promise containing the response.
 */
export const getIdentityProviderList = (
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string
): Promise<IdentityProviderListResponseInterface> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset,
            requiredAttributes
        },
        url: store.getState().config.endpoints.identityProviders
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get IdP list from: "));
            }

            return Promise.resolve(response.data as IdentityProviderListResponseInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Hook to get the IDP list with limit and offset.
 *
 * @param limit - Maximum Limit of the IdP List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 * @param shouldFetch - Should fetch the data.
 *
 * @returns Requested IDPs
 */
export const useIdentityProviderList = <Data = IdentityProviderListResponseInterface, Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset,
            requiredAttributes
        },
        url: store.getState().config.endpoints.identityProviders
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export const getAllIdentityProvidersDetail = (
    ids: Set<string>
): Promise<IdentityProviderResponseInterface[]> => {

    const requests: any = [];

    for (const id of ids) {
        requests.push({
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.identityProviders + "/" + id
        });
    }

    return httpClientAll(requests)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    "Failed to get connection details.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as IdentityProviderResponseInterface[]);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Failed to get connection details.",
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });

};

/**
 * Get federated authenticator metadata.
 *
 * @param authenticatorId - ID of the Federated Authenticator.
 * @returns A promise containing the response.
 */
export const getFederatedAuthenticatorMetadata = (authenticatorId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/federated-authenticators/" +
            authenticatorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticator metadata for: "
                    + authenticatorId));
            }

            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the identity provider template list with limit and offset.
 *
 * @param limit - Maximum Limit of the identity provider template List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 *
 * @returns A promise containing the response.
 */
export const getIdentityProviderTemplateList = (limit?: number, offset?: number,
    filter?: string): Promise<IdentityProviderTemplateListResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: store.getState().config.endpoints.identityProviders + "/templates"
    };

    return httpClient(requestConfig)
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

            return Promise.resolve(response.data as IdentityProviderTemplateListResponseInterface);
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
 * @param templateId - Id value of the template.
 * @returns A promise containing the response.
 */
export const getIdentityProviderTemplate = (templateId: string): Promise<IdentityProviderTemplateInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/templates/" + templateId
    };

    return httpClient(requestConfig)
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

            return Promise.resolve(response.data as IdentityProviderTemplateInterface);
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

/**
 * Get the list of local authenticators.
 *
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
 */
export const getLocalAuthenticators = (): Promise<LocalAuthenticatorInterface[]> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.localAuthenticators
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<LocalAuthenticatorInterface[]>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.LOCAL_AUTHENTICATORS_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get Local Authenticator details from `t/<TENANT>>/api/server/v1/configs/authenticators/<AUTHENTICATOR_ID>`
 *
 * @param id - Authenticator ID.
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
 */
export const getLocalAuthenticator = (id: string): Promise<AuthenticatorInterface> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.localAuthenticators }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<AuthenticatorInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.LOCAL_AUTHENTICATOR_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get the details of a Multi-factor authenticator using the MFA connectors in Governance APIs.
 *
 * @param id - Authenticator ID.
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
 */
export const getMultiFactorAuthenticatorDetails = (id: string): Promise<MultiFactorAuthenticatorInterface> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.multiFactorAuthenticators }/connectors/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<MultiFactorAuthenticatorInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.MULTI_FACTOR_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.MULTI_FACTOR_AUTHENTICATOR_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update a Multi-factor authenticator.
 *
 * @param id - Authenticator ID.
 * @param payload - Request payload.
 *
 * @returns Response as a promise.
 */
export const updateMultiFactorAuthenticatorDetails = (
    id: string,
    payload: MultiFactorAuthenticatorInterface
): Promise<MultiFactorAuthenticatorInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: {
            operation: "UPDATE",
            properties: payload.properties
        },
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.multiFactorAuthenticators }/connectors/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<MultiFactorAuthenticatorInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.MULTI_FACTOR_AUTHENTICATOR_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.MULTI_FACTOR_AUTHENTICATOR_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Fetch the list of outbound provisioning connectors.
 *
 * @returns A promise containing the response.
 */
export const getOutboundProvisioningConnectorsList = (): Promise<OutboundProvisioningConnectorListItemInterface[]> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/outbound-provisioning-connectors"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to fetch outbound provisioning connectors"));
            }

            return Promise.resolve(response.data as OutboundProvisioningConnectorListItemInterface[]);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update certificates of the IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param data - data to be updated
 * @returns A promise containing the response.
 */
export const updateIDPCertificate = <T = Record<string, unknown>>(
    idpId: string,
    data: T
): Promise<IdentityProviderInterface> => {

    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update connection: " + idpId));
            }

            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.IDENTITY_PROVIDER_CERTIFICATE_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update the outbound provisioning connectors list of a specified IDP.
 *
 * @param connectorList -
 * @param idpId - ID of the Identity Provider.
 * @returns A promise containing the response.
 */
export const updateOutboundProvisioningConnectors = <T = Record<string,unknown>>(
    connectorList: T,
    idpId: string
): Promise<OutboundProvisioningConnectorListItemInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: connectorList,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/provisioning/outbound-connectors/"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update connection: " + idpId));
            }

            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update a federated authenticators list of a specified IDP.
 *
 * @param authenticatorList - List of Authenticators
 * @param idpId - ID of the Identity Provider.
 * @returns A promise containing the response.
 */
export const updateFederatedAuthenticators = (
    authenticatorList: FederatedAuthenticatorListResponseInterface,
    idpId: string
): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        data: authenticatorList,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/federated-authenticators/"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update connection: " + idpId));
            }

            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get connected apps of the IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @returns  A promise containing the response.
 */
export const getIDPConnectedApps = (idpId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/connected-apps/"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Failed to get connected apps for the IDP: " + idpId)
                );
            }

            return Promise.resolve(response.data as ConnectedAppsInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get identity provider groups list.
 *
 * @returns the groups list of the identity provider.
 */
export const useIdentityProviderGroups = <Data = IdentityProviderGroupInterface[], Error = RequestErrorInterface>
    (idpId: string): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/groups/"
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
 * Update identity provider groups list.
 *
 * @returns the updated identity provider groups.
 */
export const updateIdentityProviderGroup = (idpId: string, idpGroups: IdentityProviderGroupInterface[]):
    Promise<IdentityProviderGroupInterface[]> => {

    const requestConfig: RequestConfigInterface = {
        data: idpGroups,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/groups/"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to add connection group"));
            }

            return Promise.resolve(response.data as IdentityProviderGroupInterface[]);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
