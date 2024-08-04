/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { AuthenticatedUserInfo, BasicUserInfo } from "@asgardeo/auth-react";
import { TokenConstants } from "../constants";

/**
 * Utility class for authenticate operations.
 */
export class AuthenticateUtils {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    /**
     * Checks if the logged in user has login scope.
     *
     * @returns `boolean` True or false.
     */
    public static hasLoginPermission(allowedScopes: string): boolean {
        const scopes: string[] = allowedScopes?.split(" ");

        return scopes?.includes(TokenConstants.LOGIN_SCOPE);
    }

    /**
     * Checks if the logged in user has a specific scope.
     *
     * @returns `boolean` True or false.
     */
    public static hasScope(scope: string, allowedScopes: string): boolean {
        const scopes: string[] = allowedScopes?.split(" ");

        return scopes?.includes(scope);
    }

    /**
     * Check if the logged in user has atleast one scope.
     *
     * @returns `boolean` True or false.
     */
    public static hasScopes(scope: string[], allowedScopes: string): boolean {
        const userScopes: string[] = allowedScopes?.split(" ");

        return scope.every((i:string) => userScopes?.includes(i));
    }

    /**
     * Get the authentication callback URL from the session storage.
     *
     * @param app - `string` The name of the app.
     * @returns Authentication Callback from session.
     */
    public static getAuthenticationCallbackUrl(app: string): string {
        return window.sessionStorage.getItem(`auth_callback_url_${app}`);
    }

    /**
     * Validates the authentication callback URL by checking if starts with the matcher value.
     *
     * @param app - `string` The name of the app.
     * @param matcher - `string` Matcher value.
     * @returns `boolean` Authentication Callback from session.
     */
    public static isValidAuthenticationCallbackUrl(app: string, matcher: string): boolean {

        if (!AuthenticateUtils.getAuthenticationCallbackUrl(app)
            || typeof AuthenticateUtils.getAuthenticationCallbackUrl(app) !== "string" ) {

            return false;
        }

        return AuthenticateUtils.getAuthenticationCallbackUrl(app).startsWith(matcher);
    }

    /**
     * Update the authentication callback URL in the session storage.
     * This is used to improve UX in automatic sign-out scenarios due to session timeouts etc.
     *
     * @param app - `string` The name of the app.
     * @param location - `string` history path.
     */
    public static updateAuthenticationCallbackUrl(app: string, location: string): void {
        window.sessionStorage.setItem(`auth_callback_url_${app}`, location);
    }

    /**
     * @param app - `string` The name of the app.
     * Removes the authentication callback URL from the session storage.
     */
    public static removeAuthenticationCallbackUrl(app: string): void {
        window.sessionStorage.removeItem(`auth_callback_url_${app}`);
    }

    /**
    * Tenant domain decoded from the subject claim of the ID Token.
    *
    * @param sub - `string` Subject claim of the ID Token.
    * @returns `string` Tenant domain.
    */
    public static deriveTenantDomainFromSubject(sub: string): string {
        const subParts: string[] = sub.split("@");
        const tenantDomain: string = subParts[ subParts.length - 1 ];

        return tenantDomain;
    }

    /**
    * Get sign in data of the user
    *
    * @param response - `BasicUserInfo` Sign in user data response
    * @returns `AuthenticatedUserInfo` Associated user's information
    */
    public static getSignInState(response: BasicUserInfo, tenantDomain?: string): AuthenticatedUserInfo {

        /**
         * Here, 'providedUsername' contains the username value from the ID Token,
         * whereas 'username' includes the 'sub' attribute of the ID Token.
         */
        return {
            allowedScopes: response?.allowedScopes,
            displayName: response?.displayName,
            display_name: response?.displayName,
            email: response?.email,
            providedUsername: response?.username,
            scope: response?.allowedScopes,
            tenantDomain: tenantDomain ? tenantDomain : AuthenticateUtils.deriveTenantDomainFromSubject(response?.sub),
            username: response?.sub
        };
    }
}
