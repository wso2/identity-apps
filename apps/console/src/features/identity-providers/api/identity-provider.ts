/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { identityProviderConfig } from "../../../extensions/configs";
import { store } from "../../core";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { IdentityProviderManagementConstants } from "../constants";
import {
    AuthenticatorInterface,
    AuthenticatorTypes,
    ConnectedAppsInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface,
    FederatedAuthenticatorMetaInterface,
    IdentityProviderClaimsInterface,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderResponseInterface,
    IdentityProviderRolesInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateListResponseInterface,
    JITProvisioningResponseInterface,
    LocalAuthenticatorInterface,
    MultiFactorAuthenticatorInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());
const httpClientAll = AsgardeoSPAClient.getInstance().httpRequestAll.bind(AsgardeoSPAClient.getInstance());

/**
 * Creates Identity Provider.
 *
 * @param identityProvider - Identity provider settings data.
 */
export const createIdentityProvider = (identityProvider: object): Promise<any> => {
    const requestConfig = {
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
 * @deprecated Use `useIdentityProviderList` hook instead.
 * @param limit - \{number\}  Maximum Limit of the IdP List.
 * @param offset - \{number\} Offset for get to start.
 * @param filter - \{number\} Search filter.
 * @param requiredAttributes - \{number\} Extra attribute to be included in the list response. ex:`isFederationHub`
 *
 * @returns \{Promise<IdentityProviderListResponseInterface>\} A promise containing the response.
 */
export const getIdentityProviderList = (
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string
): Promise<IdentityProviderListResponseInterface> => {

    const requestConfig = {
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
 * Hook to get the IDP list with limit and offset.
 *
 * @param limit - \{number\} Maximum Limit of the IdP List.
 * @param offset - \{number\} Offset for get to start.
 * @param filter - \{string\} Search filter.
 * @param requiredAttributes - \{string\} Extra attribute to be included in the list response. ex:`isFederationHub`
 *
 * @returns \{RequestResultInterface\<Data, Error\>\}
 */
export const useIdentityProviderList = <Data = IdentityProviderListResponseInterface, Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string
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

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Gets detail about the Identity Provider.
 *
 * @param id - Identity Provider Id.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getIdentityProviderDetail = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + id
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get idp details from: "));
            }

            return Promise.resolve(response.data as IdentityProviderResponseInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

export const getAllIdentityProvidersDetail = (
    ids: Set<string>
): Promise<IdentityProviderResponseInterface[]> => {

    const requests = [];

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
                    "Failed to get Identity Providers details.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as IdentityProviderResponseInterface[]);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Failed to get Identity Providers details.",
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });

};

/**
 * Deletes an IdP when the relevant id is passed in.
 *
 * @param id - ID of the IdP.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const deleteIdentityProvider = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.identityProviders + "/" + id
    };

    return httpClient(requestConfig)
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
 * @param idp - Identity Provider.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const updateIdentityProviderDetails = (idp: IdentityProviderInterface): Promise<any> => {

    const { id, ...rest } = idp;
    const replaceOps = [];

    for (const key in rest) {
        if(rest[key] !== undefined) {
            replaceOps.push({
                "operation": "REPLACE",
                "path": "/" + key,
                "value": rest[key]
            });
        }
    }


    const requestConfig = {
        data: replaceOps,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.identityProviders + "/" + id
    };

    return httpClient(requestConfig)
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
 * @param idpId - ID of the Identity Provider.
 * @param authenticator - Federated Authenticator.
 * @returns \{Promise<any>\} A promise containing the response.
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/federated-authenticators/" + authenticatorId
    };

    return httpClient(requestConfig)
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
 * @param idpId - ID of the Identity Provider.
 * @param authenticatorId - ID of the Federated Authenticator.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getFederatedAuthenticatorDetails = (idpId: string, authenticatorId: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/federated-authenticators/" + authenticatorId
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Failed to get federated authenticator details for: " + authenticatorId)
                );
            }

            return Promise.resolve(response.data as FederatedAuthenticatorListItemInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator details.
 *
 * @param id - ID of the Federated Authenticator.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getFederatedAuthenticatorMeta = (id: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/federated-authenticators/" + id
    };

    return httpClient(requestConfig)
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
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getFederatedAuthenticatorsList = (): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/federated-authenticators"
    };

    return httpClient(requestConfig)
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
 * @param idpId - ID of the Identity Provider.
 * @param authenticatorId - ID of the Federated Authenticator.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getFederatedAuthenticatorMetadata = (authenticatorId: string): Promise<any> => {

    const requestConfig = {
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
 * Get outbound provisioning connector metadata.
 *
 * @param connectorId - ID of the outbound provisioning connector.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getOutboundProvisioningConnectorMetadata = (connectorId: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/outbound-provisioning-connectors/" +
            connectorId
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get outbound provisioning connector metadata for: "
                    + connectorId));
            }

            return Promise.resolve(response.data as OutboundProvisioningConnectorMetaInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get outbound provisioning connector.
 *
 * @param idpId - Identity provider ID.
 * @param connectorId - ID of the outbound provisioning connector.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getOutboundProvisioningConnector = (idpId: string, connectorId: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/provisioning/outbound-connectors/"
            + connectorId
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get outbound provisioning connector for: "
                    + connectorId));
            }

            return Promise.resolve(response.data as OutboundProvisioningConnectorInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update a outbound provisioning connector of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param connector - Outbound provisioning connector.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const updateOutboundProvisioningConnector = (
    idpId: string,
    connector: OutboundProvisioningConnectorInterface
): Promise<any> => {

    const { connectorId, ...rest } = connector;

    const requestConfig = {
        data: rest,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/provisioning/outbound-connectors/" + connectorId
    };

    return httpClient(requestConfig)
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
 * Update JIT provisioning configs of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param configs - JIT provisioning configs.
 * @returns \{Promise<IdentityProviderInterface>\} A promise containing the response.
 */
export const updateJITProvisioningConfigs = (
    idpId: string,
    configs: JITProvisioningResponseInterface
): Promise<IdentityProviderInterface> => {

    const requestConfig = {
        data: configs,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/provisioning/jit"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update jit configuration: " + idpId));
            }

            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.IDENTITY_PROVIDER_JIT_PROVISIONING_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export const getJITProvisioningConfigs = (
    idpId: string
): Promise<IdentityProviderInterface> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/provisioning/jit"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get jit configuration: " + idpId));
            }

            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.IDENTITY_PROVIDER_JIT_PROVISIONING_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });

};

/**
 * Update claims of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param configs - Claims configs.
 * @returns \{Promise<IdentityProviderInterface>\} A promise containing the response.
 */
export const updateClaimsConfigs = (
    idpId: string,
    configs: IdentityProviderClaimsInterface
): Promise<IdentityProviderInterface> => {

    const requestConfig = {
        data: configs,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/claims"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as IdentityProviderInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.IDENTITY_PROVIDER_CLAIMS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Gets the identity provider template list with limit and offset.
 *
 * @param limit - \{number\} Maximum Limit of the identity provider template List.
 * @param offset - \{number\} Offset for get to start.
 * @param filter - \{string\} Search filter.
 *
 * @returns \{Promise<IdentityProviderTemplateListResponseInterface>\} A promise containing the response.
 */
export const getIdentityProviderTemplateList = (limit?: number, offset?: number,
    filter?: string): Promise<IdentityProviderTemplateListResponseInterface> => {
    const requestConfig = {
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
 * @returns \{Promise<IdentityProviderTemplateInterface>\} A promise containing the response.
 */
export const getIdentityProviderTemplate = (templateId: string): Promise<IdentityProviderTemplateInterface> => {
    const requestConfig = {
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
 * Update role mappings of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param mappings - IDP role mappings.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const updateIDPRoleMappings = (
    idpId: string,
    mappings: IdentityProviderRolesInterface
): Promise<any> => {

    const requestConfig = {
        data: mappings,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/roles"
    };

    return httpClient(requestConfig)
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
 * Get the list of local authenticators.
 *
 * @returns \{Promise\<LocalAuthenticatorInterface[]\>\} Response as a promise.
 * @throws \{IdentityAppsApiException\}
 */
export const getLocalAuthenticators = (): Promise<LocalAuthenticatorInterface[]> => {

    const requestConfig = {
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
 * @param id - \{string\} Authenticator ID.
 * @returns \{Promise<AuthenticatorInterface>\} Response as a promise.
 * @throws \{IdentityAppsApiException\}
 */
export const getLocalAuthenticator = (id: string): Promise<AuthenticatorInterface> => {

    const requestConfig = {
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
 * Get all authenticators in the server. i.e LOCAL & FEDERATED both.
 *
 * @param filter - \{string\}  Search filter.
 *
 * @param type - \{AuthenticatorTypes\} Authenticator Type.
 *
 * @returns \{Promise\<AuthenticatorInterface[]\>\} Response as a promise.
 */
export const getAuthenticators = (filter?: string, type?: AuthenticatorTypes): Promise<AuthenticatorInterface[]> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter
        },
        url: store.getState().config.endpoints.authenticators
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<AuthenticatorInterface[]>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            // Extend the API response with the locally defined array from config.
            const authenticators: AuthenticatorInterface[] = [
                ...response.data,
                ...identityProviderConfig.authenticatorResponseExtension
            ];

            // If `type` is defined, only return authenticators of that type.
            if (type) {
                return Promise.resolve(authenticators.filter((authenticator: AuthenticatorInterface) => {
                    return authenticator.type === type;
                }));
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.AUTHENTICATORS_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get all authenticator tags
 *
 * @returns \{Promise\<string[]\>\} Response as a promise.
 * @throws \{IdentityAppsApiException\}
 */
export const getAuthenticatorTags = (): Promise<string[]> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.authenticatorTags
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<string[]>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.AUTHENTICATOR_TAGS_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                IdentityProviderManagementConstants.AUTHENTICATOR_TAGS_FETCH_ERROR,
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
 * @param id - \{string\} Authenticator ID.
 * @returns \{Promise<MultiFactorAuthenticatorInterface>\} Response as a promise.
 * @throws \{IdentityAppsApiException\}
 */
export const getMultiFactorAuthenticatorDetails = (id: string): Promise<MultiFactorAuthenticatorInterface> => {

    const requestConfig = {
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
 * @param id - \{string\} Authenticator ID.
 * @param payload - \{MultiFactorAuthenticatorInterface\} Request payload.
 *
 * @returns \{Promise<MultiFactorAuthenticatorInterface>\} Response as a promise.
 */
export const updateMultiFactorAuthenticatorDetails = (
    id: string,
    payload: MultiFactorAuthenticatorInterface
): Promise<MultiFactorAuthenticatorInterface> => {

    const requestConfig = {
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
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getOutboundProvisioningConnectorsList = (): Promise<OutboundProvisioningConnectorListItemInterface[]> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/outbound-provisioning-connectors"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to fetch outbound provisioning connectors"));
            }

            return Promise.resolve(response.data as OutboundProvisioningConnectorListItemInterface[]);
        }).catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update certificates of the IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param data - 
 * @returns \{Promise<IdentityProviderInterface>\} A promise containing the response.
 */
export const updateIDPCertificate = (
    idpId: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: any
): Promise<IdentityProviderInterface> => {

    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
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
 * @returns \{Promise<OutboundProvisioningConnectorListItemInterface>\} A promise containing the response.
 */
export const updateOutboundProvisioningConnectors = (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    connectorList: any,
    idpId: string
): Promise<OutboundProvisioningConnectorListItemInterface> => {

    const requestConfig = {
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
 * Update a federated authenticators list of a specified IDP.
 *
 * @param authenticatorList - 
 * @param idpId - ID of the Identity Provider.
 * @returns \{Promise<FederatedAuthenticatorListResponseInterface>\} A promise containing the response.
 */
export const updateFederatedAuthenticators = (
    authenticatorList: FederatedAuthenticatorListResponseInterface,
    idpId: string
): Promise<any> => {

    const requestConfig = {
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
 * Get connected apps of the IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @returns \{Promise<any>\} A promise containing the response.
 */
export const getIDPConnectedApps = (idpId: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/connected-apps/"
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Failed to get connected apps for the IDP: " + idpId)
                );
            }

            return Promise.resolve(response.data as ConnectedAppsInterface);
        }).catch((error) => {
            return Promise.reject(error);
        });
};
