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
 * Class containing profile operation constants.
 */
export class ProfileConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    // SCIM2 schema IDs
    public static readonly SCIM2_CORE_USER_SCHEMA: string = "urn:ietf:params:scim:schemas:core:2.0:User";
    public static readonly SCIM2_ENT_USER_SCHEMA: string = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
    public static readonly SCIM2_WSO2_USER_SCHEMA: string = "urn:scim:wso2:schema";
    public static readonly SCIM2_WSO2_CUSTOM_SCHEMA: string = "urn:scim:wso2:schema";

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
     * @constant
     * @type {Map<string, string>}
     * @default
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
        .set("META_VERSION", "meta.version");

    /**
     * States if the SCIM schema is mutable.
     */
    public static readonly READONLY_SCHEMA: string = "READ_ONLY";
}
