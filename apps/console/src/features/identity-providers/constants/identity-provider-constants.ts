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
 * Identity provider settings key in local storage.
 * @defaultValue
 */
export const IDENTITY_PROVIDER_SETTINGS_STORAGE_KEY: string = "identity_provider_settings";

/**
 * Path to the identity provider page.
 * @defaultValue
 */
export const IDENTITY_PROVIDER_PAGE_PATH: string  = "/identity-providers";

/**
 * Class containing app constants.
 */
export class IdentityProviderConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Paths for the identity provider management config files.
     */
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public static readonly IDENTITY_PROVIDER_MGT_CONFIG_PATHS: any = {
        META: "configs/identity-provider-mgt.meta.json"
    };

    /**
     * Internal domain name.
     *
     */
    public static readonly INTERNAL_DOMAIN: string  = "Internal/";

    /**
     * Application domain name.
     *
     */
    public static readonly APPLICATION_DOMAIN: string  = "Application/";

    /**
     * data-tabIds of the panes in the IdP settings
     *
     */
    public static readonly ADVANCED_TAB_ID: string  = "advanced";
    public static readonly ATTRIBUTES_TAB_ID: string  = "attributes";
    public static readonly CONNECTED_APPS_TAB_ID: string  = "connected-apps";
    public static readonly GENERAL_TAB_ID: string  = "general";
    public static readonly JIT_PROVISIONING_TAB_ID: string  = "jit-provisioning";
    public static readonly OUTBOUND_PROVISIONING_TAB_ID: string  = "outbound-provisioning";
    public static readonly SETTINGS_TAB_ID: string  = "settings";
    public static readonly IDENTITY_PROVIDER_GROUPS_TAB_ID: string  = "identity-provider-groups";
    public static readonly CLAIM_APP_ROLE: string  = "http://wso2.org/claims/groups";
    public static readonly CLAIM_USERNAME: string  = "http://wso2.org/claims/username";
    public static readonly CLAIM_ROLE: string  = "http://wso2.org/claims/role";

    public static readonly CLAIM_CONFIG_FIELD_MAX_LENGTH: number  = 100;
    public static readonly CLAIM_CONFIG_FIELD_MIN_LENGTH: number  = 1;

    /**
     * Maximum length of the IdP name.
     */
    public static readonly IDP_NAME_MAX_LENGTH: number = 120;

    /**
     * Minimum length of the IdP name.
     */
    public static readonly IDP_NAME_MIN_LENGTH: number = 3;

    /**
     * Maximum length of the IdP description.
     */
    public static readonly IDP_DESCRIPTION_MAX_LENGTH: number = 300;

    /**
     * Minimum length of the IdP description.
     */
    public static readonly IDP_DESCRIPTION_MIN_LENGTH: number = 3;

    /**
     * Maximum length of the JWKS URL.
     */
    public static readonly JWKS_URL_MAX_LENGTH: number = 2048;

    /**
     * Minimum length of the JWKS URL.
     */
    public static readonly JWKS_URL_MIN_LENGTH: number = 10;

    /**
     * Key for user id in claims.
     */
    public static readonly USER_ID_IN_CLAIMS: string = "IsUserIdInClaims";

}

export const GOOGLE_IDP_NAME: string  = "Google";

export const GOOGLE_IDP_ID: string  = "8ea23303-49c0-4253-b81f-82c0fe6fb4a0";
export const OIDC_IDP_ID: string  = "oidc-idp";
export const ENTERPRISE_IDP_ID: string  = "enterprise-idp";
export const ORG_ENTERPRISE_IDP_ID: string  = "organization-enterprise-idp";
