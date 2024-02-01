/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing governance connector constants.
 */
export class ValidationConfigConstants {

    /**
     * Constants for validation configurations.
     */
    public static readonly VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS: {
        MIN_LENGTH: number,
        MIN_VALUE: number;
        PASSWORD_MAX_LENGTH: number;
        PASSWORD_MAX_VALUE: number;
        PASSWORD_MIN_LENGTH: number;
        PASSWORD_MIN_VALUE: number;
    } = {

        MIN_LENGTH: 1,
        MIN_VALUE: 0,
        PASSWORD_MAX_LENGTH: 2,
        PASSWORD_MAX_VALUE: 30,
        PASSWORD_MIN_LENGTH: 1,
        PASSWORD_MIN_VALUE: 8
    };

}

/**
 * Error constants for validation configuration.
 */
export class ValidationManagementConstants {
    public static readonly CONFIGURATION_STATUS_UPDATE_ERROR: string = "An error occurred while updating " +
        "validation configurations.";

    public static readonly CONFIGURATION_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating validation configurations.";
}
