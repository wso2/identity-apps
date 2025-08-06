/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

// Keep statement as this to avoid cyclic dependency. Do not import from config index.
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";

/**
 * Class containing claim constants.
 */
export class ClaimManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("MOBILE_VERIFICATION_BY_PRIVILEGED_USERS", "attributeVerification.mobileVerificationByPrivilegedUser");

    /**
     * Claim URI Attribute key.
     */
    public static readonly CLAIM_URI_ATTRIBUTE_KEY: string = "claimURI";

    /**
     * Key for the URL search param for Dialect state.
     */
    public static readonly DIALECT_STATE_URL_SEARCH_PARAM_KEY: string = "state";

    /**
     * URL Search param for newly created Dialects.
     */
    public static readonly NEW_DIALECT_URL_SEARCH_PARAM: string = `?${
        ClaimManagementConstants.DIALECT_STATE_URL_SEARCH_PARAM_KEY }=new`;

    /**
     * Key for the URL search param for Local Claim state.
     */
    public static readonly LOCAL_CLAIM_STATE_URL_SEARCH_PARAM_KEY: string = "state";

    /**
     * URL Search param for Local Claim state.
     */
    public static readonly NEW_LOCAL_CLAIM_URL_SEARCH_PARAM: string = `?${
        ClaimManagementConstants.LOCAL_CLAIM_STATE_URL_SEARCH_PARAM_KEY }=new`;

    /**
     *  The feature flag to enable/disable the distinct attribute profiles feature.
     */
    public static readonly DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG: string =
        "attributeDialects.distinct.attribute.profiles";

    // API errors
    public static readonly ADD_DIALECT_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while adding a new dialect.";

    public static readonly ADD_LOCAL_CLAIM_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while adding a new dialect.";

    public static readonly EXTERNAL_CLAIM_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the external claim.";

    public static readonly EXTERNAL_CLAIM_FETCH_REQUEST_ERROR: string = "An error occurred while fetching the " +
        "external claim.";

    public static readonly EXTERNAL_CLAIM_UPDATE_REQUEST_INVALID_RESPONSE_CODE_ERROR: string = "Received an invalid " +
        "status code while updating the external claim.";

    public static readonly EXTERNAL_CLAIM_UPDATE_REQUEST_ERROR: string = "An error occurred while updating the " +
        "external claim.";

    /**
     * Map to access the attribute dialect ids.
     */
    public static readonly ATTRIBUTE_DIALECT_IDS: Map<string, any> = new Map<string, any>()
        .set("AXSCHEMA", "aHR0cDovL2F4c2NoZW1hLm9yZw")
        .set("EIDAS_LEGAL", "aHR0cDovL2VpZGFzLmV1cm9wYS5ldS9hdHRyaWJ1dGVzL2xlZ2FscGVyc29u")
        .set("EIDAS_NATURAL", "aHR0cDovL2VpZGFzLmV1cm9wYS5ldS9hdHRyaWJ1dGVzL25hdHVyYWxwZXJzb24")
        .set("OPENID_NET", "aHR0cDovL3NjaGVtYS5vcGVuaWQubmV0LzIwMDcvMDUvY2xhaW1z")
        .set("XML_SOAP", "aHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eQ")
        .set("LOCAL", "local")
        .set("OIDC", "aHR0cDovL3dzbzIub3JnL29pZGMvY2xhaW0")
        .set("SCIM2_SCHEMAS_CORE", "dXJuOmlldGY6cGFyYW1zOnNjaW06c2NoZW1hczpjb3JlOjIuMA")
        .set("SCIM2_SCHEMAS_CORE_USER", "dXJuOmlldGY6cGFyYW1zOnNjaW06c2NoZW1hczpjb3JlOjIuMDpVc2Vy")
        .set("SCIM2_SCHEMAS_EXT_ENT_USER",
            "dXJuOmlldGY6cGFyYW1zOnNjaW06c2NoZW1hczpleHRlbnNpb246ZW50ZXJwcmlzZToyLjA6VXNlcg")
        .set("SCIM_SCHEMAS_CORE", "dXJuOnNjaW06c2NoZW1hczpjb3JlOjEuMA")
        .set("SCIM2_SCHEMAS_EXT_SYSTEM", "dXJuOnNjaW06d3NvMjpzY2hlbWE")
        .set("SCIM2_FOR_AGENTS", "dXJuOnNjaW06d3NvMjphZ2VudDpzY2hlbWE");

    /**
     * Set of dialects packed OOTB.
     */
    public static readonly DEFAULT_DIALECTS: string[] = [
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("AXSCHEMA"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_LEGAL"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_NATURAL"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("LOCAL"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE_USER"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_ENT_USER"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM_SCHEMAS_CORE")
    ];

    public static readonly SYSTEM_DIALECTS: string[] = [
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("LOCAL"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE_USER"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_ENT_USER"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM_SCHEMAS_CORE"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("XML_SOAP"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_SYSTEM"),
        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_FOR_AGENTS")
    ];

    public static readonly CUSTOM_MAPPING: string = SCIMConfigs.custom;

    public static readonly OIDC_MAPPING: string[] = [
        SCIMConfigs.oidc
    ];

    public static readonly AGENT_SCIM_SCHEMA_MAPPING: string[] = [
        "urn:scim:wso2:agent:schema"
    ];

    public static readonly AXSCHEMA_MAPPING: string = "http://axschema.org";

    public static readonly OIDC: string = "oidc";
    public static readonly SCIM: string = "scim";
    public static readonly AXSCHEMA: string = "axschema";
    public static readonly EIDAS: string = "eidas";
    public static readonly AGENT: string = "agent";
    public static readonly OTHERS: string = "others";

    public static readonly SCIM_TABS: {
        name: string;
        uri: string;
        isAttributeButtonEnabled: boolean;
        attributeButtonText: string;
    }[] = [
            {
                attributeButtonText: "",
                isAttributeButtonEnabled: false,
                name: "Core Schema",
                uri: "urn:ietf:params:scim:schemas:core:2.0"
            },
            {
                attributeButtonText: "claims:external.pageLayout.edit.attributeMappingPrimaryAction",
                isAttributeButtonEnabled: true,
                name: "User Schema",
                uri: "urn:ietf:params:scim:schemas:core:2.0:User"
            },
            {
                attributeButtonText: "claims:external.pageLayout.edit.attributeMappingPrimaryAction" ,
                isAttributeButtonEnabled: true,
                name: "Enterprise Schema",
                uri: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
            },
            {
                attributeButtonText: "claims:external.pageLayout.edit.attributeMappingPrimaryAction" ,
                isAttributeButtonEnabled: false,
                name: "System Schema",
                uri: "urn:scim:wso2:schema"
            },
            {
                attributeButtonText: "",
                isAttributeButtonEnabled: true,
                name: "Core 1.0 Schema",
                uri: "urn:scim:schemas:core:1.0"
            },
            {
                attributeButtonText: "",
                isAttributeButtonEnabled: true,
                name: "Agent Schema",
                uri: "urn:scim:wso2:agent:schema"
            }
        ];

    public static readonly EIDAS_TABS: {
        name: string;
        uri: string;
    }[] = [
            { name: "eIDAS/Legal Person", uri: "http://eidas.europa.eu/attributes/legalperson" },
            { name: "eIDAS/Natural Person", uri: "http://eidas.europa.eu/attributes/naturalperson" }
        ];

    /**
     * Display names of User Id & Username to
     * identify.
     */
    public static readonly USER_ID_CLAIM_URI: string = "http://wso2.org/claims/userid";
    public static readonly USER_NAME_CLAIM_URI: string = "http://wso2.org/claims/username";
    public static readonly GROUPS_CLAIM_URI: string = "http://wso2.org/claims/groups";
    public static readonly ROLES_CLAIM_URI: string = "http://wso2.org/claims/roles";
    public static readonly APPLICATION_ROLES_CLAIM_URI: string = "http://wso2.org/claims/applicationRoles";
    public static readonly LOCATION_CLAIM_URI: string = "http://wso2.org/claims/location";
    public static readonly EMAIL_CLAIM_URI: string = "http://wso2.org/claims/emailaddress";
    public static readonly EMAIL_ADDRESSES_CLAIM_URI: string = "http://wso2.org/claims/emailAddresses";
    public static readonly VERIFIED_EMAIL_ADDRESSES_CLAIM_URI: string = "http://wso2.org/claims/verifiedEmailAddresses";
    public static readonly MOBILE_CLAIM_URI: string = "http://wso2.org/claims/mobile";
    public static readonly MOBILE_NUMBERS_CLAIM_URI: string = "http://wso2.org/claims/mobileNumbers";
    public static readonly VERIFIED_MOBILE_NUMBERS_CLAIM_URI: string = "http://wso2.org/claims/verifiedMobileNumbers";

    public static readonly GROUPS_CLAIM_NAME: string = "groups";
    public static readonly ROLES_CLAIM_NAME: string = "roles";
    public static readonly APPLICATION_ROLES_CLAIM_NAME: string = "application_roles";

    public static readonly EMPTY_STRING: string = "";
    public static readonly EXCLUDED_USER_STORES_CLAIM_PROPERTY: string = "ExcludedUserStores";

    public static readonly USER_STORE_CONFIG_SUPPORTED_CLAIMS: string[] = [
        ClaimManagementConstants.EMAIL_ADDRESSES_CLAIM_URI,
        ClaimManagementConstants.VERIFIED_EMAIL_ADDRESSES_CLAIM_URI,
        ClaimManagementConstants.MOBILE_NUMBERS_CLAIM_URI,
        ClaimManagementConstants.VERIFIED_MOBILE_NUMBERS_CLAIM_URI
    ];

    public static readonly SYSTEM_CLAIM_PROPERTY_NAME: string = "isSystemClaim";

    public static readonly AGENT_CLAIM_PROPERTY_NAME: string = "isAgentClaim";

    /**
     * Claim property name for uniqueness validation scope.
     */
    public static readonly UNIQUENESS_SCOPE_PROPERTY_NAME: string = "uniquenessScope";
    /**
     * Claim property name for shared profile value resolving method.
     */
    public static readonly SHARED_PROFILE_VALUE_RESOLVING_METHOD_PROPERTY_NAME: string =
        "sharedProfileValueResolvingMethod";

    /**
     * List of restricted property keys that cannot be used in claim properties.
     */
    public static readonly RESTRICTED_PROPERTY_KEYS: string[] = [ "isUnique", "isAgentClaim" ];

    /**
     * The error code that is returned when there is no item in the list
     */
    public static readonly RESOURCE_NOT_FOUND_ERROR_CODE: string = "CMT-50017";

    /**
     * The character length of the regex field.
     */
    public static readonly REGEX_FIELD_MAX_LENGTH: number = 255;
    public static readonly REGEX_FIELD_MIN_LENGTH: number = 3;

    /**
     * Default scim2 custom user schema URI.
     */
    public static readonly DEFAULT_SCIM2_CUSTOM_USER_SCHEMA_URI: string = "urn:scim:schemas:extension:custom:User";
}

/**
 * Unique identifiers for claim edit tabs.
 *
 * @readonly
 */
export enum ClaimTabIDs {
    GENERAL = "general",
    ATTRIBUTE_MAPPINGS = "attribute-mappings",
    ADDITIONAL_PROPERTIES = "additional-properties"
}
