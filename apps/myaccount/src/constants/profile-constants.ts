/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing constants required for profile related operations.
 */
export class ProfileConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    // API errors
    public static readonly CHANGE_PASSWORD_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code while changing the users password.";

    public static readonly CHANGE_PASSWORD_ERROR: string = "Error occurred while changing the users password.";

    public static readonly GLOBE: string = "globe";
}

/**
 * Enum for locale joining symbol.
 *
 * @readonly
 */
export enum LocaleJoiningSymbol {
    HYPHEN = "-",
    UNDERSCORE = "_"
}

export enum MobileVerificationRecoveryScenario {
    MOBILE_VERIFICATION_ON_UPDATE = "MOBILE_VERIFICATION_ON_UPDATE",
    MOBILE_VERIFICATION_ON_VERIFIED_LIST_UPDATE = "MOBILE_VERIFICATION_ON_VERIFIED_LIST_UPDATE"
}
