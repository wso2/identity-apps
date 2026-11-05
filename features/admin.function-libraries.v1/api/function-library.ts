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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpCodes, HttpMethods } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import {
    CreateFunctionLibraryInterface,
    FunctionLibraryListResponseInterface,
    FunctionLibraryResponseInterface,
    UpdateFunctionLibraryInterface
} from "../models/function-library";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Builds the resource URL of a function library. The API addresses a library by its id rather than its
 * name, since names may contain characters such as spaces that are not valid in a URL path.
 *
 * @param id - Id of the function library.
 * @returns Resource URL of the function library.
 */
const getFunctionLibraryURL = (id: string): string => {
    return `${ store.getState().config.endpoints.scriptLibraries }/${ id }`;
};

/**
 * Builds the multipart payload expected by the create and update endpoints. The script content
 * is sent as a file part.
 *
 * @param name - Name of the function library.
 * @param content - JavaScript content of the function library.
 * @param description - Description of the function library.
 * @param includeName - Whether to include the `name` part. On update, a different name renames the library.
 * @returns Multipart form data.
 */
export const buildFunctionLibraryFormData = (
    name: string,
    content: string,
    description: string,
    includeName: boolean
): FormData => {
    const formData: FormData = new FormData();

    if (includeName) {
        formData.append("name", name);
    }

    // The update endpoint clears the description when it is omitted, so it is always sent.
    formData.append("description", description ?? "");
    formData.append("content", new Blob([ content ], { type: "text/javascript" }), name);

    return formData;
};

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
        limit: number,
        offset: number
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

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        requestConfig,
        { shouldRetryOnError: false }
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

/**
 * Retrieve the details of a function library by id.
 *
 * @param id - Id of the function library.
 * @returns Function library details.
 */
export const getFunctionLibrary = async (
    id: string
): Promise<AxiosResponse<FunctionLibraryResponseInterface>> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: getFunctionLibraryURL(id)
    };

    try {
        const response: AxiosResponse<FunctionLibraryResponseInterface> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to get the function library ${ id }.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Retrieve the raw content of a function library by id.
 *
 * @param id - Id of the function library.
 * @returns Function library content as text.
 */
export const getFunctionLibraryContent = async (id: string): Promise<AxiosResponse<string>> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "*/*"
        },
        method: HttpMethods.GET,
        responseType: "text",
        url: `${ getFunctionLibraryURL(id) }/content`
    };

    try {
        const response: AxiosResponse<string> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(
                new IdentityAppsApiException(`Failed to get the content of function library ${ id }.`)
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
    const requestConfig: RequestConfigInterface = {
        data: buildFunctionLibraryFormData(library.name, library.content, library.description, true),
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
 * Update an existing function library. The library is renamed when `library.name` differs from its current
 * name. Since the id is derived from the name, the response carries the (possibly new) id of the library.
 *
 * @param id - Id of the function library to be updated.
 * @param library - Name, description and content to update.
 * @returns Axios response of the update request, with the updated function library.
 */
export const updateFunctionLibrary = async (
    id: string,
    library: UpdateFunctionLibraryInterface
): Promise<AxiosResponse<FunctionLibraryResponseInterface>> => {
    const requestConfig: RequestConfigInterface = {
        data: buildFunctionLibraryFormData(library.name, library.content, library.description, true),
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost
        },
        method: HttpMethods.PUT,
        url: getFunctionLibraryURL(id)
    };

    try {
        const response: AxiosResponse<FunctionLibraryResponseInterface> = await httpClient(requestConfig);

        if (response.status !== HttpCodes.OK) {
            return Promise.reject(new IdentityAppsApiException(`Failed to update the function library ${ id }.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Delete a function library by id.
 *
 * @param id - Id of the function library to be deleted.
 * @returns Axios response of the delete request.
 */
export const deleteFunctionLibrary = async (id: string): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost
        },
        method: HttpMethods.DELETE,
        url: getFunctionLibraryURL(id)
    };

    try {
        const response: AxiosResponse = await httpClient(requestConfig);

        if (response.status !== HttpCodes.NO_CONTENT) {
            return Promise.reject(new IdentityAppsApiException(`Failed to delete the function library ${ id }.`));
        }

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
