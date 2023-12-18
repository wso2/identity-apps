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
import useResourceEndpoints from "@wso2is/common/src/hooks/use-resource-endpoints";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";
import { ConnectionManagementConstants } from "../constants/connection-constants";
import { NotificationSenderSMSInterface } from "../models/authenticators";
import {
    ApplicationBasicInterface,
    ConnectedAppsInterface,
    ConnectionClaimsInterface,
    ConnectionGroupInterface,
    ConnectionInterface,
    ConnectionListResponseInterface,
    ConnectionRolesInterface,
    ConnectionTemplateInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface,
    FederatedAuthenticatorMetaInterface,
    ImplicitAssociaionConfigInterface,
    JITProvisioningResponseInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../models/connection";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Function to create a connection.
 *
 * @param connection - Connection settings data.
 */
export const createConnection = (
    connection: ConnectionInterface
): Promise<AxiosResponse<ConnectionInterface>> => {

    const requestConfig: AxiosRequestConfig = {
        data: connection,
        headers: {
            "Accept": "application/json",
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
 * Hook to get the connection list with limit and offset.
 *
 * @param limit - Maximum Limit of the connection List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 * @param shouldFetch - Should fetch from the network. If false, will return results from cache.
 * @param expectEmpty - If true, will allow returning empty results.
 *
 * @returns Requested connections.
 */
export const useGetConnections = <Data = ConnectionListResponseInterface, Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string,
    shouldFetch: boolean = true,
    expectEmpty: boolean = false
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

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
        url: resourceEndpoints.identityProviders
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !expectEmpty && !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Function to get the connection list with limit and offset.
 *
 * @param limit - Maximum Limit of the connection List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 *
 * @returns Requested connections.
 * @throws IdentityAppsApiException.
 */
export const getConnections = (
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string
): Promise<ConnectionListResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
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
        url: store?.getState()?.config?.endpoints?.identityProviders
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response?.status !== 200) {
                throw new IdentityAppsApiException(
                    ConnectionManagementConstants.CONNECTIONS_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response?.status,
                    response?.request,
                    response,
                    response?.config);
            }

            return Promise.resolve(response?.data as ConnectionListResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.CONNECTIONS_FETCH_ERROR,
                error?.stack,
                error?.response?.data?.code,
                error?.request,
                error?.response,
                error?.config);
        });
};

/**
 * Hook to get the basic information about the application.
 *
 * @param id - ID of the application.
 *
 * @returns requested application details.
 */
export const useGetApplicationDetails = <Data = ApplicationBasicInterface, Error = RequestErrorInterface>(
    id?: string
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: resourceEndpoints.applications + "/" + id
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
 * Hook to get connected apps of the connection.
 *
 * @param idpId - ID of the Connection.
 *
 * @returns requested connected apps.
 */
export const useGetConnectionConnectedApps = <Data = ConnectedAppsInterface, Error = RequestErrorInterface>(
    idpId: string
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: resourceEndpoints.identityProviders + "/" + idpId + "/connected-apps/"
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
 * Deletes an connection when the relevant id is passed in.
 *
 * @param id - ID of the connection.
 * @returns A promise containing the response.
 */
export const deleteConnection = (id: string): Promise<any> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.identityProviders + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                return Promise.reject(new Error("Failed to delete the identity provider."));
            }

            return Promise.resolve(response);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Hook to get the connection template.
 *
 * @param templateId - Id value of the template.
 *
 * @returns Requested connection template.
 */
export const useGetConnectionTemplate = <Data = ConnectionTemplateInterface, Error = RequestErrorInterface>(
    templateId: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: resourceEndpoints.extensions + "/connections/" + templateId + "/template"
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

/**
 * Hook to get the connection template list with limit and offset.
 *
 * @param limit - Maximum Limit of the connection templates.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 *
 * @returns Requested connections.
 */
export const useGetConnectionTemplates = <Data = any, Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: resourceEndpoints.extensions + "/connections"
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
 * Function to fetch meta details of the connection.
 *
 * @param limit - Maximum Limit of the connection templates.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 *
 * @returns Requested connections.
 */
export const getConnectionTemplates = (
    limit?: number,
    offset?: number,
    filter?: string
): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: store.getState().config.endpoints.extensions + "/connections"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get connection templates."));
            }

            return Promise.resolve(response.data as ConnectionTemplateInterface[]);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Hook to get the meta details of connection.
 *
 * @param extensionId - ID of the connection.
 *
 * @returns Meta data of the connection.
 */
export const useGetConnectionMetaData = <Data = any, Error = RequestErrorInterface>(
    extensionId?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: resourceEndpoints.extensions + "/connections/" + extensionId + "/metadata"
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

/**
 * Function to fetch meta details of the connection.
 *
 * @param id - Template ID of the connection.
 * @returns A promise containing the response.
 */
export const getConnectionMetaData = (id: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.extensions + "/connections/" + id + "/metadata"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get connection meta details for: " + id));
            }

            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Gets connection details.
 *
 * @param id - Connection Id.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getConnectionDetails = (id: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get idp details from: "));
            }

            return Promise.resolve(response.data as any);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update role mappings of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param mappings - IDP role mappings.
 * @returns A promise containing the response.
 */
export const updateConnectionRoleMappings = (
    idpId: string,
    mappings: ConnectionRolesInterface
): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        data: mappings,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/roles"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get outbound provisioning connector metadata.
 *
 * @param connectorId - ID of the outbound provisioning connector.
 * @returns A promise containing the response.
 */
export const getOutboundProvisioningConnectorMetadata = (
    connectorId: string
): Promise<OutboundProvisioningConnectorMetaInterface> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/outbound-provisioning-connectors/" +
            connectorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get outbound provisioning connector metadata for: "
                    + connectorId));
            }

            return Promise.resolve(response.data as OutboundProvisioningConnectorMetaInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
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
 * Update a outbound provisioning connector of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param connector - Outbound provisioning connector.
 * @returns A promise containing the response.
 */
export const updateOutboundProvisioningConnector = (
    idpId: string,
    connector: OutboundProvisioningConnectorInterface
): Promise<any> => {

    const { connectorId, ...rest } = connector;

    const requestConfig: RequestConfigInterface = {
        data: rest,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/provisioning/outbound-connectors/" + connectorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get outbound provisioning connector.
 *
 * @param idpId - Identity provider ID.
 * @param connectorId - ID of the outbound provisioning connector.
 * @returns A promise containing the response.
 */
export const getOutboundProvisioningConnector = (idpId: string, connectorId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/provisioning/outbound-connectors/"
            + connectorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get outbound provisioning connector for: "
                    + connectorId));
            }

            return Promise.resolve(response.data as OutboundProvisioningConnectorInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
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
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/provisioning/outbound-connectors/"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update JIT provisioning configs of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param configs - JIT provisioning configs.
 * @returns A promise containing the response.
 */
export const updateJITProvisioningConfigs = (
    idpId: string,
    configs: JITProvisioningResponseInterface
): Promise<ConnectionInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: configs,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/provisioning/jit"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update jit configuration: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.CONNECTION_JIT_PROVISIONING_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Get connected apps of the IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @returns  A promise containing the response.
 */
export const getConnectedApps = (idpId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
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
 * Update identity provider details.
 *
 * @param connection - Connection.
 * @returns A promise containing the response.
 */
export const updateIdentityProviderDetails = (connection: ConnectionInterface): Promise<any> => {

    const { id, ...rest } = connection;
    const replaceOps: any = [];

    for (const key in rest) {
        if(rest[key] !== undefined) {
            replaceOps.push({
                "operation": "REPLACE",
                "path": "/" + key,
                "value": rest[key]
            });
        }
    }

    const requestConfig: RequestConfigInterface = {
        data: replaceOps,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.identityProviders + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + id));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator metadata.
 *
 * @param idpId - ID of the Identity Provider.
 * @param authenticatorId - ID of the Federated Authenticator.
 * @returns A promise containing the response.
 */
export const getFederatedAuthenticatorDetails = (idpId: string, authenticatorId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/federated-authenticators/" + authenticatorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error("Failed to get federated authenticator details for: " + authenticatorId)
                );
            }

            return Promise.resolve(response.data as FederatedAuthenticatorListItemInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator details.
 *
 * @param id - ID of the Federated Authenticator.
 * @returns A promise containing the response.
 */
export const getFederatedAuthenticatorMeta = (id: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/federated-authenticators/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticator meta details for: " + id));
            }

            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update a federated authenticators list of a specified IDP.
 *
 * @param authenticatorList -
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
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/federated-authenticators/"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Update a federated authenticator of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param authenticator - Federated Authenticator.
 * @returns A promise containing the response.
 */
export const updateFederatedAuthenticator = (
    idpId: string,
    authenticator: FederatedAuthenticatorListItemInterface
): Promise<any> => {
    const { authenticatorId, ...rest } = authenticator;

    const requestConfig: RequestConfigInterface = {
        data: rest,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/federated-authenticators/" + authenticatorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator metadata.
 *
 * @param idpId - ID of the Identity Provider.
 * @param authenticatorId - ID of the Federated Authenticator.
 * @returns A promise containing the response.
 */
export const getFederatedAuthenticatorMetadata = (authenticatorId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
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
 * Update certificates of the IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param data - data to be updated
 * @returns A promise containing the response.
 */
export const updateIDPCertificate = <T = Record<string, unknown>>(
    idpId: string,
    data: T
): Promise<ConnectionInterface> => {

    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.CONNECTION_CERTIFICATE_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update claims of a specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param configs - Claims configs.
 * @returns A promise containing the response.
 */
export const updateClaimsConfigs = (
    idpId: string,
    configs: ConnectionClaimsInterface
): Promise<ConnectionInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: configs,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/claims"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.CONNECTION_CLAIMS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update implicit association configuration of the specified IDP.
 *
 * @param idpId - ID of the Identity Provider.
 * @param configs - implicit association configs.
 * @returns A promise containing the response.
 */
export const updateImplicitAssociationConfig = (
    idpId: string,
    configs: ImplicitAssociaionConfigInterface
): Promise<ConnectionInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: configs,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/implicit-association"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update implicit association" +
                " configs for identity provider: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.CONNECTION_IMPLICIT_ASSOCIATION_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get all sms notification senders with name SMSPublisher.
 *
 * @returns  A promise containing the response.
 */
export const useSMSNotificationSenders = <Data = NotificationSenderSMSInterface[], Error = RequestErrorInterface>():
    RequestResultInterface<Data, Error> => {
    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: resourceEndpoints.notificationSendersEndPoint + "/sms"
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
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.notificationSendersEndPoint + "/sms"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<NotificationSenderSMSInterface>) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    AuthenticatorManagementConstants.ERROR_IN_CREATING_SMS_NOTIFICATION_SENDER,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as NotificationSenderSMSInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                AuthenticatorManagementConstants.ERROR_IN_CREATING_SMS_NOTIFICATION_SENDER,
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
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.notificationSendersEndPoint + "/sms/SMSPublisher"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    AuthenticatorManagementConstants.ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            let errorMessage: string = AuthenticatorManagementConstants.ERROR_IN_DELETING_SMS_NOTIFICATION_SENDER;

            if (error.response?.data?.code ===
                AuthenticatorManagementConstants.ErrorMessages
                    .SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS.getErrorCode()) {
                errorMessage = AuthenticatorManagementConstants.ErrorMessages
                    .SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS.getErrorMessage();
            }
            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);

        });
};

/**
 * Get connection groups list.
 *
 * @returns the groups list of the connection.
 */
export const useConnectionGroups = <Data = ConnectionGroupInterface[], Error = RequestErrorInterface>
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
 * Update connection groups list.
 *
 * @returns the updated connection groups.
 */
export const updateConnectionGroup = (idpId: string, idpGroups: ConnectionGroupInterface[]):
    Promise<ConnectionGroupInterface[]> => {

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

            return Promise.resolve(response.data as ConnectionGroupInterface[]);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get claims configurations.
 *
 * @returns the claim configurations of the connection.
 */
export const useClaimConfigs = <Data = ConnectionClaimsInterface, Error = RequestErrorInterface>
    (idpId: string): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId + "/claims"
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
