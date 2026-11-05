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

/**
 * Function library as returned in the list response.
 */
export interface FunctionLibraryInterface {
    /**
     * Id of the function library, used to address it in the API. It is URL safe, unlike the name.
     */
    id: string;
    name: string;
    description?: string;
    self?: string;
}

/**
 * Function library as returned by the get-by-id endpoint.
 */
export interface FunctionLibraryResponseInterface extends FunctionLibraryInterface {
    "content-ref": string;
}

/**
 * Response returned by the function libraries list endpoint. When there are no libraries, the API
 * returns only `count`.
 */
export interface FunctionLibraryListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count: number;
    scriptLibraries?: FunctionLibraryInterface[];
}

/**
 * Payload used to create a new function library.
 */
export interface CreateFunctionLibraryInterface {
    name: string;
    description?: string;
    content: string;
}

/**
 * Payload used to update an existing function library. A different name renames the library.
 */
export interface UpdateFunctionLibraryInterface {
    name: string;
    description: string;
    content: string;
}
