/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpCodes, HttpMethods } from "@wso2is/core/models";
import { AxiosInstance, AxiosResponse } from "axios";
import {
    CreateFunctionLibraryInterface,
    FunctionLibraryListResponseInterface,
    FunctionLibraryResponseInterface,
    UpdateFunctionLibraryInterface
} from "../models/function-library";

const httpClient: AxiosInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Hook to get the paginated list of function libraries.
 *
 * @param limit - Maximum number of records to return.
 * @param offset - Number of records to skip for pagination.
 * @returns Function libraries list GET hook.
 */
export const useGetFunctionLibraries = <
    Data = FunctionLibraryListResponseInterface, Error = RequestErrorInterface
>(
        limit: number = 30,
        offset: number = 0
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset
        },
        url: store.getState().config.endpoints.scriptLibraries
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

/**
 * Retrieve the details of a function library by name.
 *
 * @param name - Name of the function library.
 * @returns Function library details.
 */
export const getFunctionLibrary = async (
    name: string
): Promise<AxiosResponse<FunctionLibraryResponseInterface>> => {
    const requestConfig: Record<string, any> = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.scriptLibraries }/${ name }`
    };

    try {
        const response: AxiosResponse<FunctionLibraryResponseInterface> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to get the function library ${ name }.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Retrieve the raw content of a function library by name.
 *
 * @param name - Name of the function library.
 * @returns Function library content as text.
 */
export const getFunctionLibraryContent = async (name: string): Promise<AxiosResponse<string>> => {
    const requestConfig: Record<string, any> = {
        headers: {
            Accept: "*/*"
        },
        method: HttpMethods.GET,
        responseType: "text",
        url: `${ store.getState().config.endpoints.scriptLibraries }/${ name }/content`
    };

    try {
        const response: AxiosResponse<string> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(
                new IdentityAppsApiException(`Failed to get the content of function library ${ name }.`)
            );
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Create a new function library.
 *
 * @param library - Name, description and content of the function library to be created.
 * @returns Axios response of the create request.
 */
export const createFunctionLibrary = async (
    library: CreateFunctionLibraryInterface
): Promise<AxiosResponse> => {
    const formData: FormData = new FormData();

    formData.append("name", library.name);
    if (library.description) {
        formData.append("description", library.description);
    }
    formData.append("content", new Blob([ library.content ], { type: "text/javascript" }), library.name);

    const requestConfig: Record<string, any> = {
        data: formData,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.scriptLibraries
    };

    try {
        const response: AxiosResponse = await httpClient(requestConfig);

        if (response.status !== HttpCodes.CREATED) {
            return Promise.reject(
                new IdentityAppsApiException(`Failed to create the function library ${ library.name }.`)
            );
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Update an existing function library.
 *
 * @param name - Name of the function library to be updated.
 * @param library - Description and content to update.
 * @returns Axios response of the update request.
 */
export const updateFunctionLibrary = async (
    name: string,
    library: UpdateFunctionLibraryInterface
): Promise<AxiosResponse> => {
    const formData: FormData = new FormData();

    if (library.description !== undefined) {
        formData.append("description", library.description);
    }
    formData.append("content", new Blob([ library.content ], { type: "text/javascript" }), name);

    const requestConfig: Record<string, any> = {
        data: formData,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost
        },
        method: HttpMethods.PUT,
        url: `${ store.getState().config.endpoints.scriptLibraries }/${ name }`
    };

    try {
        const response: AxiosResponse = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to update the function library ${ name }.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Delete a function library by name.
 *
 * @param name - Name of the function library to be deleted.
 * @returns Axios response of the delete request.
 */
export const deleteFunctionLibrary = async (name: string): Promise<AxiosResponse> => {
    const requestConfig: Record<string, any> = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.scriptLibraries }/${ name }`
    };

    try {
        const response: AxiosResponse = await httpClient(requestConfig);

        if (response.status !== HttpCodes.NO_CONTENT) {
            return Promise.reject(new IdentityAppsApiException(`Failed to delete the function library ${ name }.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
