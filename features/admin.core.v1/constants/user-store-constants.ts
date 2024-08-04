/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
 * Class containing shared user store constants.
 */
export class SharedUserStoreConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */

    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly PRIMARY_USER_STORE = "Primary";
    public static readonly READONLY_USER_STORE = "ReadOnly";

    /**
     * Primary user store property values
     */
    public static readonly PRIMARY_USERSTORE_PROPERTY_VALUES = {
        PasswordJavaScriptRegEx: "^[\\S]{5,30}$",
        RolenameJavaScriptRegEx: "^[\\S]{3,30}$",
        UsernameJavaScriptRegEx: "^[\\S]{3,30}$"
    };

    /**
     * User store regEx properties
     */
    public static readonly USERSTORE_REGEX_PROPERTIES = {
        PasswordRegEx: "PasswordJavaScriptRegEx",
        RolenameRegEx: "RolenameJavaScriptRegEx",
        UsernameRegEx: "UsernameJavaScriptRegEx"
    }
}
