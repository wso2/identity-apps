/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { SCIMConfigs } from "../../admin-extensions-v1/configs/scim";

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
        .set("SCIM_SCHEMAS_CORE", "dXJuOnNjaW06c2NoZW1hczpjb3JlOjEuMA");

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
    ]

    public static readonly CUSTOM_MAPPING: string = SCIMConfigs.custom;

    public static readonly OIDC_MAPPING: string[] = [
        SCIMConfigs.oidc
    ];

    public static readonly AXSCHEMA_MAPPING: string = "http://axschema.org";

    public static readonly OIDC: string = "oidc";
    public static readonly SCIM: string = "scim";
    public static readonly AXSCHEMA: string = "axschema";
    public static readonly EIDAS: string = "eidas";
    public static readonly OTHERS: string = "others";

    public static readonly SCIM_TABS: {
        name: string;
        uri: string;
    }[] = [
        { name: "Core Schema", uri: "urn:ietf:params:scim:schemas:core:2.0" },
        { name: "User Schema", uri: "urn:ietf:params:scim:schemas:core:2.0:User" },
        { name: "Enterprise Schema", uri: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" },
        { name: "Core 1.0 Schema", uri: "urn:scim:schemas:core:1.0" }
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
    public static readonly MOBILE_CLAIM_URI: string = "http://wso2.org/claims/mobile";

    public static readonly GROUPS_CLAIM_NAME: string = "groups";
    public static readonly ROLES_CLAIM_NAME: string = "roles";
    public static readonly APPLICATION_ROLES_CLAIM_NAME: string = "application_roles";

    public static readonly EMPTY_STRING: string = "";

    /**
     * The error code that is returned when there is no item in the list
     */
     public static readonly RESOURCE_NOT_FOUND_ERROR_CODE: string = "CMT-50017";

     /**
     * The character length of the regex field.
     */
     public static readonly REGEX_FIELD_MAX_LENGTH: number = 255;
     public static readonly REGEX_FIELD_MIN_LENGTH: number = 3;
}
