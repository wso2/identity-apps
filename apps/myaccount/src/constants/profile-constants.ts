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
    /**
     *  The feature flag to enable/disable the distinct attribute profiles feature.
     */
    public static readonly DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG: string =
        "personalInfo.distinct.attribute.profiles";

    public static readonly USERNAME_CLAIM_NAME: string = "userName";
    public static readonly MOBILE: string = "mobile";

    /**
     * Account state constants.
     */
    public static readonly ACCOUNT_STATE_PENDING_SR: string = "PENDING_SR";

    /**
     * Preferred channel constants.
     */
    public static readonly PREFERRED_CHANNEL_EMAIL: string = "EMAIL";

    /**
     * SCIM schema constants.
     */
    public static readonly ACCOUNT_STATE: string = "ACCOUNT_STATE";
    public static readonly PREFERRED_CHANNEL: string = "PREFERRED_CHANNEL";
    public static readonly EMAIL_VERIFIED: string = "EMAIL_VERIFIED";
    public static readonly PHONE_VERIFIED: string = "PHONE_VERIFIED";
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

/**
 * Enum for recovery scenario.
 *
 * @readonly
 */
export enum RecoveryScenario {
    SELF_SIGN_UP = "SELF_SIGN_UP"
}
