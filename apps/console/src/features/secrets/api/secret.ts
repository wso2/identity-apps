import { IdentityClient } from "@wso2/identity-oidc-js";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import { store } from "../../core";
import { HttpCodes } from "../configs/http-codes";
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

const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

export const createSecret = async (
    { body, params }: CreateSecretRequest
): Promise<AxiosResponse<CreateSecretResponse>> => {

    const requestConfig: Record<string, any> = {
        data: body,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.createSecret + `/${ params.secretType }`
    };

    try {
        const response: AxiosResponse<CreateSecretResponse> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.CREATED) {
            return Promise.reject(new Error(`Failed to create the secret ${ body.name }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};

export const getSecret = async (
    { params }: GetSecretRequest
): Promise<AxiosResponse<GetSecretResponse>> => {

    const requestConfig: Record<string, any> = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.getSecret + `/${ params.secretType }/${ params.secretName }`
    };

    try {
        const response: AxiosResponse<GetSecretResponse> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new Error(`Failed to get the secret ${ params.secretName }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};

export const updateSecret = async (
    { body, params }: UpdateSecretRequest
): Promise<AxiosResponse<UpdateSecretResponse>> => {

    const requestConfig: Record<string, any> = {
        data: body,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.updateSecret + `/${ params.secretType }/${ params.secretName }`
    };

    try {
        const response: AxiosResponse<UpdateSecretResponse> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new Error(`Failed to update the secret ${ params.secretName }.`));
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
export const getSecretList = async (
    { params }: GetSecretListRequest
): Promise<AxiosResponse<GetSecretListResponse>> => {

    const requestConfig: Record<string, any> = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.getSecretList + `/${ params.secretType }`
    };

    try {
        const response: AxiosResponse<GetSecretListResponse> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new Error(`Failed to get the secret list of ${ params.secretType }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};

export const deleteSecret = async (
    { params }: DeleteSecretRequest
): Promise<AxiosResponse<unknown>> => {

    const requestConfig: Record<string, any> = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.deleteSecret + `/${ params.secretType }/${ params.secretName }`
    };

    try {
        const response: AxiosResponse<SecretTypeModel> = await httpClient(requestConfig);
        if (response.status !== HttpCodes.NO_CONTENT) {
            return Promise.reject(new Error(`Failed to delete the secret ${ params.secretType }.`));
        }
        return response;
    } catch (error) {
        return Promise.reject(error);
    }

};
