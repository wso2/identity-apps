/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing userstore operation constants.
 */
export class UserstoreConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    // API errors
    public static readonly USERSTORES_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR: string = "Received an invalid " +
        "status code while retrieving userstores.";

    public static readonly USERSTORES_FETCH_REQUEST_ERROR: string = "An error occurred while fetching the " +
        "userstores.";

    /**
     * Customer user store identifier.
     */
    public static readonly CUSTOMER_USER_STORE_MAPPING: string = "Customer";
}
