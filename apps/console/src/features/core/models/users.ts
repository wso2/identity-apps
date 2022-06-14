/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { 
    LinkInterface,
    MultiValueAttributeInterface,
    NameInterface
} from "@wso2is/core/models";

/**
 * Captures role details of the user.
 */
interface UserRoleInterface {
    $ref: string,
    display: string,
    value: string
}

/**
 * Captures meta details of the user.
 */
export interface UserMetaInterface {
    created: string;
    location: string;
    lastModified: string;
    resourceType: string;
}

/**
 *  Captures the basic details of the user.
 */
export interface UserBasicInterface {
    id: string;
    userName: string;
    emails?: string[] | MultiValueAttributeInterface[];
    name: NameInterface;
    meta: UserMetaInterface;
    profileUrl: string;
    roles?: UserRoleInterface[];
}

/**
 *  Captures application list properties.
 */
export interface UserListInterface {
    /**
     * Number of results that match the listing operation.
     */
    totalResults?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    startIndex?: number;
    /**
     * Number of elements in the returned page.
     */
    itemsPerPage?: number;
    /**
     * Set of applications.
     */
    Resources?: UserBasicInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];
}
