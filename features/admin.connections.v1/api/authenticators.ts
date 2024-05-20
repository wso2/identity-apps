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
import useResourceEndpoints from "@wso2is/admin.core.v1/hooks/use-resource-endpoints";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";
import {
    ConnectionManagementConstants
} from "../constants/connection-constants";
import {
    AuthenticatorInterface,
    MultiFactorAuthenticatorInterface
} from "../models/authenticators";
import {
    ConnectionInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface,
    FederatedAuthenticatorMetaInterface
} from "../models/connection";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get all authenticators in the server.
 *
 * @param filter - Search filter.
 * @param type - Authenticator Type.
 *
 * @returns Response as a promise.
 */
export const useGetAuthenticators = <Data = AuthenticatorInterface[], Error = RequestErrorInterface>(
    filter?: string
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter
        },
        url: resourceEndpoints.authenticators
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
 * Hook to get all authenticator tags
 *
 * @returns Response as a promise.
 */
export const useGetAuthenticatorTags = <Data = string[], Error = RequestErrorInterface>(
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: resourceEndpoints.authenticatorTags
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

    const requestConfig: AxiosRequestConfig = {
        data: {
            operation: "UPDATE",
            properties: payload.properties
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.multiFactorAuthenticators }/connectors/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<MultiFactorAuthenticatorInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ConnectionManagementConstants.MULTI_FACTOR_AUTHENTICATOR_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.MULTI_FACTOR_AUTHENTICATOR_UPDATE_ERROR,
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

    const requestConfig: AxiosRequestConfig = {
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
                    ConnectionManagementConstants.LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.LOCAL_AUTHENTICATOR_FETCH_ERROR,
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

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.multiFactorAuthenticators }/connectors/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<MultiFactorAuthenticatorInterface>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ConnectionManagementConstants.MULTI_FACTOR_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionManagementConstants.MULTI_FACTOR_AUTHENTICATOR_FETCH_ERROR,
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
 * @param idpId - ID of the Identity Provider.
 * @param authenticatorId - ID of the Federated Authenticator.
 * @returns A promise containing the response.
 */
export const getFederatedAuthenticatorDetails = (idpId: string, authenticatorId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/federated-authenticators/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    AuthenticatorManagementConstants.ERROR_IN_FETCHING_FEDERATED_AUTHENTICATOR_META_DATA,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.response?.data?.message ?? AuthenticatorManagementConstants
                    .ERROR_IN_FETCHING_FEDERATED_AUTHENTICATOR_META_DATA,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.identityProviders + "/" + idpId +
            "/federated-authenticators/" + authenticatorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update connection: " + idpId));
            }

            return Promise.resolve(response.data as ConnectionInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Get federated authenticator details.
 *
 * @returns A promise containing the response.
 */
export const getFederatedAuthenticatorsList = (): Promise<FederatedAuthenticatorMetaInterface[]> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/federated-authenticators"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticators list"));
            }

            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface[]);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
