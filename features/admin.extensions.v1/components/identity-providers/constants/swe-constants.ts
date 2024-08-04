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
 * Class containing Sign In With Ethereum IDP constants.
 */
export class SIWEConstants {

    public static readonly SIWE_REGISTRATION_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-SIWE-00001";
    public static readonly SIWE_REGISTRATION_ERROR_CODE: string = "ASG-CON-SIWE-00002";

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
]     */
    private constructor() { }

    public static readonly SIWE_CLIENT_REGISTRATION_DOCS_URL: string = "https://docs.login.xyz/servers/" +
        "oidc-provider/hosted-oidc-provider#openid-connect-client-registration";

    // eslint-disable-next-line max-len
    public static readonly SIWE_CLIENT_REGISTRATION_CURL_COMMAND: string = "curl -X POST https://oidc.signinwithethereum.org/register -H 'Content-Type: application/json' -d '{\"redirect_uris\": [ \"${commonauth}\" ]}'";

    /**
     * SIWE Scope mappings.
]     */
    public static readonly SIWE_SCOPE_DICTIONARY: Record<string, string> = {
        OPENID: "openid",
        PROFILE: "profile"
    };

    /**
     * Properties keys for the SWE authenticator.
     */
    public static readonly SWE_AUTHENTICATOR_PROPERTY_KEYS: Record<string, string> = {
        CALLBACK_URL: "callbackUrl",
        CLIENT_ID: "ClientId",
        CLIENT_SECRET: "ClientSecret"
    }
}
