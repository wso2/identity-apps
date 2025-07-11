import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

const BASE = "http://localhost:8900/api/v1";

export const getProfileTraitById = (traitId: string): Promise<any> => {
    return httpClient({
        method: HttpMethods.GET,
        url: `${BASE}/enrichment-rules/${traitId}`
    }).then(handleResponse).catch(handleError);
};

export const createProfileTrait = (traitData: any): Promise<any> => {
    return httpClient({
        method: HttpMethods.POST,
        url: `${BASE}/enrichment-rules`,
        data: traitData
    }).then(handleResponse).catch(handleError);
};

export const updateProfileTrait = (traitId: string, updatedData: any): Promise<any> => {
    return httpClient({
        method: HttpMethods.PATCH,
        url: `${BASE}/enrichment-rules/${traitId}`,
        data: updatedData
    }).then(handleResponse).catch(handleError);
};

export const deleteProfileTrait = (traitId: string): Promise<any> => {
    return httpClient({
        method: HttpMethods.DELETE,
        url: `${BASE}/enrichment-rules/${traitId}`
    }).then(handleResponse).catch(handleError);
};

// Utility handlers
const handleResponse = (response: AxiosResponse) => {
    if (response.status !== 200 && response.status !== 201) {
        throw new IdentityAppsApiException(response.data?.description, null, response.status, response.request, response, response.config);
    }
    return Promise.resolve(response.data);
};

const handleError = (error: AxiosError) => {
    throw new IdentityAppsApiException(
        error.message,
        error.stack,
        error.response?.data?.code,
        error.request,
        error.response,
        error.config
    );
};
