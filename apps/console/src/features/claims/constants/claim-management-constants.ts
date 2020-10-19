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

/**
 * Class containing claim constants.
 */
export class ClaimManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Claim URI Attribute key.
     * @constant
     * @type {number}
     * @default
     */
    public static readonly CLAIM_URI_ATTRIBUTE_KEY: string = "claimURI";

    /**
     * Key for the URL search param for Dialect state.
     * @constant
     * @type {string}
     */
    public static readonly DIALECT_STATE_URL_SEARCH_PARAM_KEY = "state";

    /**
     * URL Search param for newly created Dialects.
     * @constant
     * @type {string}
     */
    public static readonly NEW_DIALECT_URL_SEARCH_PARAM = `?${
        ClaimManagementConstants.DIALECT_STATE_URL_SEARCH_PARAM_KEY }=new`;

    /**
     * Key for the URL search param for Local Claim state.
     * @constant
     * @type {string}
     */
    public static readonly LOCAL_CLAIM_STATE_URL_SEARCH_PARAM_KEY = "state";

    /**
     * URL Search param for Local Claim state.
     * @constant
     * @type {string}
     */
    public static readonly NEW_LOCAL_CLAIM_URL_SEARCH_PARAM = `?${
        ClaimManagementConstants.LOCAL_CLAIM_STATE_URL_SEARCH_PARAM_KEY }=new`;

    // API errors
    public static readonly ADD_DIALECT_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while adding a new dialect.";
    public static readonly ADD_LOCAL_CLAIM_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while adding a new dialect.";
}
