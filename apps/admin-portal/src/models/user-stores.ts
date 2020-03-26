/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 /**
  * Type of query param objects
  */
export interface QueryParams {
    limit: number;
    offset: number;
    filter: string;
    sort: string;
}

/**
 * Type of object returned in a user store list
 */
export interface UserStoreListItem {
    id: string;
    name: string;
    description: string;
    self: string;
}

/**
 * Type of a user store property
 */
export interface UserStoreProperty {
    name: string;
    value: string;
}

/**
 * Type of object that is used to add or update a user store
 */
export interface UserStorePostData {
    typeId: string;
    description: string;
    name: string;
    properties: UserStoreProperty[];
}

/**
 * User Store object returned by retrieval 
 */
export interface UserStore {
    typeName: string;
    typeId: string;
    name: string;
    description: string;
    className: string;
    properties: UserStoreProperty[];
}

/**
 * Type of object passed to Test a JDBC connection
 */
export interface TestConnection{
    driverName: string;
    connectionURL: string;
    username: string;
    connectionPassword: string;
}

/**
 * Type of object return by Types list endpoint
 */
export interface TypeResponse{
    typeId: string;
    typeName: string;
    className: string;
}

/**
 * The type of properties object in Type object
 */
export interface TypeProperty{
    name: string;
    defaultValue: string;
    description: string;
}

/**
 * The type of object returned by the type meta endpoint
 */
export interface Type{
    name: string;
    typeName: string;
    typeId: string;
    className: string;
    description: string;
    properties: {
        Mandatory: TypeProperty[];
        Optional: TypeProperty[];
        Advanced: TypeProperty[];
    };
}

/**
 * Type of patch data 
 */
export interface PatchData {
    operation: "REPLACE";
    path: string;

    value: string;
    
}
