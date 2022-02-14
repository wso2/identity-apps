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
import { ReactNode } from "react";
import { identityProviderConfig } from "../../../extensions";
import { getAuthenticatorIcons } from "../configs";
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
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ]: "Login users with username and password " +
            "credentials.",
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Get users Identity first to " +
            "control the authentication flow.",
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Provide secure and fast passwordless " +
            "login experience using FIDO2.",
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
            "Time-Based One Time passcode.",
            [ IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "Login users with " +
            "existing Google accounts.",
            [ IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID ]: "Login users with " +
            "existing GitHub accounts.",
            [ IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID ]: "Login users with " +
            "existing Facebook accounts.",
            [ IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID ]: "Login users with " +
            "existing Twitter accounts.",
            [ IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID ]: "Authenticate users with " +
            "Enterprise OIDC connections.",
            [ IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID ]: "Authenticate users with " +
            "Enterprise SAML connections.",
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
            "one-time passcode sent via email.",
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
            "SMS one-time passcode."
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
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: identityProviderConfig.fidoTags,
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
            ],
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.MULTI_FACTOR
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
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ]: "Username & Password",
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Security Key/Biometrics",
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: "TOTP",
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "Email OTP",
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Identifier First",
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "SMS OTP"
        }, authenticatorId);
    }

    /**
     * Get Authenticator Icon.
     *
     * @param {string} authenticatorId - Authenticator ID.
     *
     * @return {string}
     */
    public static getAuthenticatorIcon(authenticatorId: string): any {

        const icon: ReactNode = get({
            [
            IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID
            ]: getAuthenticatorIcons()?.identifierFirst,
            [ IdentityProviderManagementConstants.JWT_BASIC_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.jwtBasic,
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.fido,
            [ IdentityProviderManagementConstants.X509_CERTIFICATE_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.x509,
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.totp,
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.basic,
            [
            IdentityProviderManagementConstants.ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID
            ]: getAuthenticatorIcons()?.sessionExecutor,
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.emailOTP,
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.smsOTP
        }, authenticatorId);

        return icon ?? getAuthenticatorIcons().default;
    }

    /**
     * Get Authenticator Type display name.
     *
     * @param {string} authenticatorId - Authenticator ID.
     *
     * @return {string}
     */
    public static getAuthenticatorCategory(authenticatorId: string): string {

        return get({
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "Google",
            [ IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID ]: "GitHub",
            [ IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID ]: "Facebook",
            [ IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID ]: "Twitter",
            [ IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID ]: "OIDC",
            [ IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID ]: "SAML",
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "Predefined"
        }, authenticatorId);
    }

    /**
     * Get the list of allowed filter tags in the UI.
     *
     * `/authenticators/meta/tags` API gives out all the tags which includes `Request-Path` etc.
     * Hence moderation has to be made.
     *
     * @return {string[]}
     */
    public static getAllowedFilterTags(): string[] {

        return [
            AuthenticatorLabels.MULTI_FACTOR,
            AuthenticatorLabels.PASSWORDLESS,
            AuthenticatorLabels.OIDC,
            AuthenticatorLabels.SOCIAL,
            AuthenticatorLabels.SAML
        ];
    }

    /**
     * Get Authenticator template name.
     *
     * @param {string} authenticatorId - Authenticator ID.
     *
     * @return {string}
     */
    public static getAuthenticatorTemplateName(authenticatorId: string): string {

        return get({
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR ]: "username-and-password",
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ]: "username-and-password",
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: "fido",
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: "totp",
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "sms-otp",
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "email-otp",
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "identifier-first",
            [ IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "google",
            [ IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID ]: "github",
            [ IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID ]: "facebook",
            [ IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID ]: "twitter",
            [ IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID ]: "enterprise-oidc",
            [ IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID ]: "enterprise-saml"
        }, authenticatorId);
    }
}
