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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { IdentityAppsError } from "@wso2is/core/errors";

/**
 * Class containing connection management constants.
 */
export class ConnectionManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly IMPLICIT_ACCOUNT_LINKING_ATTRIBUTES: string[] = [
        ClaimManagementConstants.USER_NAME_CLAIM_URI,
        ClaimManagementConstants.EMAIL_CLAIM_URI,
        ClaimManagementConstants.MOBILE_CLAIM_URI
    ];

    public static readonly CONNECTIONS_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching identity providers.";

    public static readonly CONNECTIONS_FETCH_ERROR: string = "An error occurred while fetching " +
    "the identity providers.";

    public static readonly LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the local authenticator.";

    public static readonly LOCAL_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the " +
        "local authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating the multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the " +
        "multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_UPDATE_ERROR: string = "An error occurred while updating the " +
        "multi-factor authenticator.";

    public static readonly CONNECTION_JIT_PROVISIONING_UPDATE_ERROR: string = "An error occurred while" +
        " updating the JIT provisioning configurations of the identity provider.";

    public static readonly CONNECTION_CERTIFICATE_UPDATE_ERROR: string = "An error occurred while updating " +
        "the certificate of the identity provider.";

    public static readonly CONNECTION_CLAIMS_UPDATE_ERROR: string = "An error occurred while updating claims " +
        "configurations of the identity provider.";

    public static readonly CONNECTION_IMPLICIT_ASSOCIATION_UPDATE_ERROR: string = "An error occurred while " +
        "updating implicit association configurations of the identity provider.";

    /**
     * Identity provider create limit reached error.
    **/
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "IDP-60035",
        "idp:notifications.apiLimitReachedError.error.description",
        "idp:notifications.apiLimitReachedError.error.message",
        "cec1f247-32fd-4624-9915-f469195a53ac"
    );

    public static readonly ORG_ENTERPRISE_CONNECTION_ID: string  = "organization-enterprise-idp";

    public static readonly SHOW_PREDEFINED_TEMPLATES_IN_EXPERT_MODE_SETUP: boolean = false;

    public static readonly GOOGLE_PRIVATE_KEY: string = "google_prov_private_key";
    public static readonly USER_ID_IN_CLAIMS: string = "IsUserIdInClaims";
}

export class SIWEConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * SIWE Scope mappings.
     */
    public static readonly SIWE_SCOPE_DICTIONARY: Record<string, string> = {
        OPENID: "openid",
        PROFILE: "profile"
    };
}
