/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
     * @hideconstructor
     */
    private constructor() { }

    public static readonly SIWE_CLIENT_REGISTRATION_DOCS_URL: string = "https://docs.login.xyz/servers/" +
        "oidc-provider/hosted-oidc-provider#openid-connect-client-registration";

    // eslint-disable-next-line max-len
    public static readonly SIWE_CLIENT_REGISTRATION_CURL_COMMAND: string = "curl -X POST https://oidc.signinwithethereum.org/register -H 'Content-Type: application/json' -d '{\"redirect_uris\": [ \"${commonauth}\" ]}'";

    /**
     * SIWE Scope mappings.
     * @type {Record<string, string>}
     */
    public static readonly SIWE_SCOPE_DICTIONARY: Record<string, string> = {
        OPENID: "openid",
        PROFILE: "profile"
    };
}
