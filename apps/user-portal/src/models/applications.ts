/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * Application list model.
 */
export interface ApplicationList {
    /**
     * The total number of results matching the query.
     */
    totalResults: number;
    /**
     * The 1-based index of the first result in the current set of results.
     */
    startIndex: number;
    /**
     * Number of results returned in response.
     */
    count: number;
    /**
     * List of applications matching the query.
     */
    applications: Application[];
    /**
     * Navigation links.
     */
    links: Link[];
}

/**
 * Application model.
 */
export interface Application {
    /**
     * Unique ID (UUID) to represent the application.
     */
    id: string;
    /**
     * Name for the application.
     */
    name: string;
    /**
     * Description for the application.
     */
    description: string;
    /**
     * Image to represent the application.
     */
    image: string;
    /**
     * URL to access the application.
     */
    accessUrl: string;
    /**
     * Flag to handle if the application is favoured or not.
     */
    favourite: boolean;
    /**
     * List of tags.
     */
    tags: string[];
}

/**
 * Link model.
 */
export interface Link {
    /**
     * Path to the target resource.
     */
    href: string;
    /**
     * Describes how the current context is related to the target resource.
     */
    rel: string;
}
