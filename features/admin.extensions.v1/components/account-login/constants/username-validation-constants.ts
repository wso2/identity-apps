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
 * Class containing username validation constants.
 */
export class UsernameValidationConstants {

    /**
     * Constants for username validation configurations.
     */
    public static readonly VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS: {
        MIN_LENGTH: number,
        MIN_VALUE: number;
        USERNAME_MAX_LENGTH: number;
        USERNAME_MAX_VALUE: number;
        USERNAME_MIN_LENGTH: number;
        USERNAME_MIN_VALUE: number;
    } = {
        MIN_LENGTH: 1,
        MIN_VALUE: 0,
        USERNAME_MAX_LENGTH: 2,
        USERNAME_MAX_VALUE: 50,
        USERNAME_MIN_LENGTH: 1,
        USERNAME_MIN_VALUE: 3
    };

    /**
     * Constants for username validation default constants.
     */
     public static readonly VALIDATION_DEFAULT_CONSTANTS: {
        USERNAME_MAX: string;
        USERNAME_MIN: string;
    } = {
        USERNAME_MAX: "50",
        USERNAME_MIN: "3"
    };
}
