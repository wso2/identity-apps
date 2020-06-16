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

export interface UserstoreListResponseInterface {
    /**
     * base64 url encoded value of domain name.
     * example: SkRCQy1TRUNPTkRBUlk
     */
    id: string;
    /**
     *  Domain name of the secondary user store.
     *  example: JDBC-SECONDARY
     */
    name: string;
    /**
     * Userstore description.
     * example: Some description of the user store
     */
    description: string;
    /**
     * Location of the created/updated resource.
     * example: /t/{tenant-domain}/api/server/v1/userstores/SkRCQy1TRUNPTkRBUlk
     */
    self: string;
    /**
     * Requested configured user store property for the set.
     */
    properties: UserstorePropertiesResponseInterface[];
}

/**
 * Available User Store Properties interface.
 */
export interface UserstorePropertiesResponseInterface {
    /**
     * Name.
     * example: ConnectionName
     */
    name: string;
    /**
     * Value.
     * example: CN=,DC=
     */
    value: string;
}
