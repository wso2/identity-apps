/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { IdentityClient } from "@wso2/identity-oidc-js";
import { HttpMethods, HttpCodes } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import { store } from "../../core";
import {
    CreateSecretTypeRequestModel,
    DeleteSecretTypeRequestModel,
    GetSecretTypeRequestModel,
    GetSecretTypeResponseModel,
    SecretTypeModel,
    UpdateSecretTypeRequestModel,
    UpdateSecretTypeResponseModel
} from "../models/secret-type";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";

const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

/**
 * Create a secret type.
 * @param body {CreateSecretTypeRequestModel}
 */
export const createSecretType = async (
    { body }: CreateSecretTypeRequestModel
): Promise<AxiosResponse<SecretTypeModel>> => {

    const requestConfig: Record<string, any> = {
        data: body,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.createSecretType
    };

    try {
        const response: AxiosResponse<SecretTypeModel> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.CREATED) {
            return Promise.reject(new IdentityAppsApiException(`Failed to create the secret type ${ body.name }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};

/**
 * Get the created secret type.
 * @param secretType { secretType: string }
 */
export const getSecretType = async (
    { params }: GetSecretTypeRequestModel
): Promise<AxiosResponse<GetSecretTypeResponseModel>> => {

    const requestConfig: Record<string, any> = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.getSecretType + `/${ params.secretType }`
    };

    try {
        const response: AxiosResponse<SecretTypeModel> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to get the secret type ${ params.secretType }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};

export const updateSecretType = async (
    { body, params }: UpdateSecretTypeRequestModel
): Promise<AxiosResponse<UpdateSecretTypeResponseModel>> => {

    const requestConfig: Record<string, any> = {
        data: body,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.updateSecretType + `/${ params.secretType }`
    };

    try {
        const response: AxiosResponse<SecretTypeModel> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to update the secret type ${ params.secretType }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};

export const deleteSecretType = async (
    { params }: DeleteSecretTypeRequestModel
): Promise<AxiosResponse<unknown>> => {

    const requestConfig: Record<string, any> = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.deleteSecretType + `/${ params.secretType }`
    };

    try {
        const response: AxiosResponse<SecretTypeModel> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.NO_CONTENT) {
            return Promise.reject(new IdentityAppsApiException(`Failed to delete the secret type ${ params.secretType }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};
