/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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
import { HttpCodes, HttpMethods } from "@wso2is/core/models";
import { AxiosInstance, AxiosResponse } from "axios";
import { store } from "../../admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import {
    CreateSecretRequest,
    CreateSecretResponse,
    DeleteSecretRequest,
    GetSecretListRequest,
    GetSecretListResponse,
    GetSecretRequest,
    GetSecretResponse,
    UpdateSecretRequest,
    UpdateSecretResponse
} from "../models/secret";
import { SecretTypeModel } from "../models/secret-type";

const httpClient: AxiosInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

export const createSecret = async ({
    body,
    params
}: CreateSecretRequest): Promise<AxiosResponse<CreateSecretResponse>> => {
    const requestConfig: Record<string, any> = {
        data: body,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.createSecret + `/${params.secretType}`
    };

    try {
        const response: AxiosResponse<CreateSecretResponse> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.CREATED) {
            return Promise.reject(new IdentityAppsApiException(`Failed to create the secret ${body.name}.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getSecret = async ({ params }: GetSecretRequest): Promise<AxiosResponse<GetSecretResponse>> => {
    const requestConfig: Record<string, any> = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.getSecret + `/${params.secretType}/${params.secretName}`
    };

    try {
        const response: AxiosResponse<GetSecretResponse> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to get the secret ${params.secretName}.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const patchSecret = async ({
    body,
    params
}: UpdateSecretRequest): Promise<AxiosResponse<UpdateSecretResponse>> => {
    const requestConfig: Record<string, any> = {
        data: body,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.updateSecret + `/${params.secretType}/${params.secretName}`
    };

    try {
        const response: AxiosResponse<UpdateSecretResponse> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to update the secret ${params.secretName}.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Get the created secret type.
 * @param secretType - Secret type.
 */
export const getSecretList = async ({
    params
}: GetSecretListRequest): Promise<AxiosResponse<GetSecretListResponse>> => {
    const requestConfig: Record<string, any> = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.getSecretList + `/${params.secretType}`
    };

    try {
        const response: AxiosResponse<GetSecretListResponse> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(
                new IdentityAppsApiException(`Failed to get the secret list of ${params.secretType}.`)
            );
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Hook to get the secret type list.
 *
 * @param type - Secret type.
 * @returns Secret list GET hook.
 */
export const useGetSecrets = <Data = GetSecretListResponse, Error = RequestErrorInterface>(
    type: string
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.getSecretList}/${type}`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export const deleteSecret = async ({ params }: DeleteSecretRequest): Promise<AxiosResponse<unknown>> => {
    const requestConfig: Record<string, any> = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.deleteSecret + `/${params.secretType}/${params.secretName}`
    };

    try {
        const response: AxiosResponse<SecretTypeModel> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.NO_CONTENT) {
            return Promise.reject(new IdentityAppsApiException(`Failed to delete the secret ${params.secretType}.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
