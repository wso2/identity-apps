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
 * Class containing profile operation constants.
 */
export class ProfileConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    // SCIM2 schema IDs
    public static readonly SCIM2_CORE_SCHEMA: string = "urn:ietf:params:scim:schemas:core:2.0";
    public static readonly SCIM2_CORE_USER_SCHEMA: string = "urn:ietf:params:scim:schemas:core:2.0:User";
    public static readonly SCIM2_ENT_USER_SCHEMA: string = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
    /**
     * @deprecated This variable is deprecated. Use `SCIM2_SYSTEM_USER_SCHEMA` instead.
     */
    public static readonly SCIM2_WSO2_USER_SCHEMA: string = "urn:scim:wso2:schema";
    public static readonly SCIM2_SYSTEM_USER_SCHEMA: string = "urn:scim:wso2:schema";
    /**
     * @deprecated This variable is deprecated. Use `SCIM2_CUSTOM_USER_SCHEMA` instead.
     */
    public static readonly SCIM2_WSO2_CUSTOM_SCHEMA: string = "urn:scim:wso2:schema";
    public static readonly SCIM2_CUSTOM_USER_SCHEMA: string = "urn:scim:schemas:extension:custom:User";

    // API errors
    public static readonly SCHEMA_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR: string = "Received an invalid status " +
        "code while retrieving the profile schemas.";

    public static readonly SCHEMA_FETCH_REQUEST_ERROR: string = "An error occurred while fetching the profile " +
        "schemas.";

    public static readonly PROFILE_INFO_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR: string = "Received an invalid " +
        "status code while retrieving profile info.";

    public static readonly PROFILE_INFO_FETCH_REQUEST_ERROR: string = "An error occurred while fetching the profile " +
        "info.";

    public static readonly PROFILE_INFO_UPDATE_REQUEST_INVALID_RESPONSE_CODE_ERROR: string = "Received an invalid " +
        "status code while updating profile info.";

    public static readonly PROFILE_INFO_UPDATE_REQUEST_ERROR: string = "An error occurred while updating the " +
        "profile info.";

    public static readonly ACCOUNT_SWITCH_REQUEST_ERROR: string = "An error occurred while switching the account.";
    public static readonly GRAVATAR_IMAGE_FETCH_REQUEST_ERROR: string = "An error occurred while fetching the " +
        "gravatar.";

    /**
     * Set of SCIM2 schema names.
     */
    public static readonly SCIM2_SCHEMA_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ACTIVE", "active")
        .set("EMAILS", "emails")
        .set("USERNAME", "userName")
        .set("NAME", "name")
        .set("ADDRESSES", "addresses")
        .set("PHONE_NUMBERS", "phoneNumbers")
        .set("GROUPS", "groups")
        .set("ROLES", "roles")
        .set("ROLES_DEFAULT", "roles.default")
        .set("PROFILE_URL", "profileUrl")
        .set("ACCOUNT_LOCKED", "accountLocked")
        .set("ACCOUNT_DISABLED", "accountDisabled")
        .set("ONETIME_PASSWORD", "oneTimePassword")
        .set("DOB", "dateOfBirth")
        .set("LOCAL_CREDENTIAL_EXISTS", "localCredentialExists")
        .set("USER_SOURCE_ID", "userSourceId")
        .set("ACTIVE", "active")
        .set("RESROUCE_TYPE", "ResourceType")
        .set("EXTERNAL_ID", "ExternalID")
        .set("META_DATA", "MetaData")
        .set("IDP_TYPE", "idpType")
        .set("IMS", "ims")
        .set("PHOTOS", "photos")
        .set("META_VERSION", "meta.version")
        .set("MOBILE", "phoneNumbers.mobile")
        .set("EMAIL_ADDRESSES", "emailAddresses")
        .set("MOBILE_NUMBERS", "mobileNumbers")
        .set("VERIFIED_EMAIL_ADDRESSES", "verifiedEmailAddresses")
        .set("VERIFIED_MOBILE_NUMBERS", "verifiedMobileNumbers")
        .set("FIRST_NAME", "name.givenName")
        .set("LAST_NAME", "name.familyName")
        .set("ACCOUNT_STATE", "accountState")
        .set("PREFERRED_CHANNEL", "preferredChannel")
        .set("EMAIL_VERIFIED", "emailVerified")
        .set("PHONE_VERIFIED", "phoneVerified");

    /**
     * States if the SCIM schema is mutable.
     */
    public static readonly READONLY_SCHEMA: string = "READ_ONLY";

    /**
     * Default max length for a claim without a max length defined in schemas.
     */
    public static readonly CLAIM_VALUE_MAX_LENGTH: number = 255;

    public static readonly URI_CLAIM_VALUE_MAX_LENGTH: number = 1024;
    public static readonly MAX_MOBILE_NUMBERS_ALLOWED: number = 10;
    public static readonly MAX_EMAIL_ADDRESSES_ALLOWED: number = 10;
    public static readonly MAX_MULTI_VALUES_ALLOWED: number = 10;

    // Mobile and email verification

    public static readonly USER_CLAIM_UPDATE_CONNECTOR: string = "user-claim-update";

    public static readonly ENABLE_MOBILE_VERIFICATION: string = "UserClaimUpdate.MobileNumber.EnableVerification";

    public static readonly ENABLE_EMAIL_VERIFICATION: string = "UserClaimUpdate.Email.EnableVerification";

    // Self sign up
    public static readonly SELF_SIGN_UP_CONNECTOR: string = "self-sign-up";
    public static readonly SELF_SIGN_UP_ENABLE_SEND_OTP_IN_EMAIL: string = "SelfRegistration.OTP.SendOTPInEmail";
}
