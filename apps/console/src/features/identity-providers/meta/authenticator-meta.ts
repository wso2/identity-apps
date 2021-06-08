/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import get from "lodash-es/get";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorCategories, AuthenticatorLabels } from "../models";

export class AuthenticatorMeta {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    private constructor() { }

    /**
     * Get the Authenticator description.
     *
     * @param {string} authenticatorId - Authenticator ID.
     *
     * @return {string}
     */
    public static getAuthenticatorDescription(authenticatorId: string): string {
        
        return get({
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ]: "Authenticates users with user " +
            "name and password credentials.",
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Get users Identity first to " +
            "control the authentication flow.",
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Provides secure and fast passwordless " +
            "login experience.",
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: "Authenticate users using Time-Based One " +
            "Time Password.",
            [ IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "Authenticate users with " +
            "existing Google accounts.",
            [ IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID ]: "Authenticate users with " +
            "existing GitHub accounts.",
            [ IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID ]: "Authenticate users with " +
            "existing Facebook accounts.",
            [ IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID ]: "Authenticate users with " +
            "existing Twitter accounts.",
            [ IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID ]: "Enterprise login via OpenID " +
            "Connect protocol.",
            [ IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID ]: "Enterprise login via SAML " +
            "protocol."
        }, authenticatorId);
    }

    /**
     * Get Authenticator Labels.
     *
     * @param {string} authenticatorId - Authenticator ID.
     *
     * @return {string[]}
     */
    public static getAuthenticatorLabels(authenticatorId: string): string[] {
        
        return get({
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: [ AuthenticatorLabels.HANDLERS ],
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SECOND_FACTOR, AuthenticatorLabels.PASSWORDLESS, AuthenticatorLabels.MULTI_FACTOR
            ],
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SECOND_FACTOR, AuthenticatorLabels.MULTI_FACTOR
            ],
            [ IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.OIDC
            ],
            [ IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SAML
            ]
        }, authenticatorId);
    }

    /**
     * Get Authenticator Type display name.
     *
     * @param {AuthenticatorCategories} type - Type.
     *
     * @return {string}
     */
    public static getAuthenticatorTypeDisplayName(type: AuthenticatorCategories): string {
        
        return get({
            [ AuthenticatorCategories.ENTERPRISE ]: "console:develop.features." +
            "applications.edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
            "addAuthenticatorModal.content.authenticatorGroups.enterprise.heading",
            [ AuthenticatorCategories.LOCAL ]: "console:develop.features." +
            "applications.edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
            "addAuthenticatorModal.content.authenticatorGroups.basic.heading",
            [ AuthenticatorCategories.SECOND_FACTOR ]: "console:develop.features." +
            "applications.edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
            "addAuthenticatorModal.content.authenticatorGroups.mfa.heading",
            [ AuthenticatorCategories.SOCIAL ]: "console:develop.features." +
            "applications.edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
            "addAuthenticatorModal.content.authenticatorGroups.social.heading"
        }, type);
    }

    /**
     * Get Authenticator display name.
     *
     * @param {string} authenticatorId - Authenticator ID.
     *
     * @return {string}
     */
    public static getAuthenticatorDisplayName(authenticatorId: string): string {
        
        return get({
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR ]: "Username & Password",
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ]: "Username & Password"
        }, authenticatorId);
    }
}
