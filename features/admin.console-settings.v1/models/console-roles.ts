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

/**
 * Enum for the API resource collection types.
 */
export enum APIResourceCollectionTypes {
    /**
     * Represents a tenant collection.
     */
    TENANT = "tenant",
    /**
     * Represents an organization collection.
     */
    ORGANIZATION = "organization"
}

/**
 * Represents an API resource collection.
 */
export interface APIResourceCollectionInterface {
    /**
     * The unique identifier for the collection.
     */
    id: string;
    /**
     * The name of the collection.
     */
    name: string;
    /**
     * The display name of the collection.
     */
    displayName: string;
    /**
     * The type of the collection, which can be 'tenant' or 'organization'.
     */
    type: APIResourceCollectionTypes;
    /**
     * The details of the API resources in the collection.
     */
    apiResources?: APIResourceCollectionDetailsInterface;
    /**
     * The self link for the collection.
     */
    self: string;
}

/**
 * Represents the details of an API resource collection.
 */
export interface APIResourceCollectionDetailsInterface {
    /**
     * Set of read scopes.
     */
    read: APIResourceCollectionPermissionCategoryInterface[],
    /**
     * Set of write scopes.
     */
    write: APIResourceCollectionPermissionCategoryInterface[],
}

/**
 * Represents an API resource collection permission category.
 */
export interface APIResourceCollectionPermissionCategoryInterface {
    /**
     * The unique identifier for the category.
     */
    id: string;
    /**
     * The display name of the category.
     */
    name: string;
    /**
     * Set of scopes.
     */
    scopes: APIResourceCollectionPermissionScopeInterface[];
    /**
     * The self link for the category.
     */
    self: string;
}

/**
 * Represents an API resource collection permission scope.
 */
export interface APIResourceCollectionPermissionScopeInterface {
    /**
     * The display name of the scope.
     */
    displayName: string;
    /**
     * The unique identifier for the scope.
     */
    name: string;
}

/**
 * Represents an API response containing a list of API resource collections.
 */
export interface APIResourceCollectionResponseInterface {
    /**
     * The total number of results in the response.
     */
    totalResults: number;

    /**
     * An array of API resource collections.
     */
    apiResourceCollections: APIResourceCollectionInterface[];
}
