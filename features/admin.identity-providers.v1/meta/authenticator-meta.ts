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

import { identityProviderConfig } from "@wso2is/admin.extensions.v1";
import get from "lodash-es/get";
import { ReactNode } from "react";
import { getAuthenticatorIcons } from "../configs/ui";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorCategories, AuthenticatorLabels, FederatedAuthenticatorInterface } from "../models";

export class AuthenticatorMeta {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * Get the Authenticator description.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator description.
     */
    public static getAuthenticatorDescription(authenticatorId: string): string {

        return get({
            [ IdentityProviderManagementConstants.BASIC_AUTHENTICATOR_ID ]: "Login users with username and password " +
                "credentials.",
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Get users Identity first to " +
                "control the authentication flow.",
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Login users with passkey, " +
                "FIDO security key or biometrics.",
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
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "Email users a one-time passcode to " +
                "log in passwordless.",
            [ IdentityProviderManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication " +
                "using one-time passcode sent via email.",
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "SMS one-time passcode.",
            [ IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: "Email users a magic link to " +
                "log in passwordless",
            [ IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_ID ]: "Login users with " +
            "their Apple IDs.",
            [ IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID ]: "Two-factor authentication " +
            "recovery option.",
            [ IdentityProviderManagementConstants.ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID ]: "Limit the number " +
            "of active user sessions.",
            [ IdentityProviderManagementConstants.X509_CERTIFICATE_AUTHENTICATOR_ID ]: "Authenticate clients using " +
                "client certificates."
        }, authenticatorId);
    }

    /**
     * Get Authenticator Labels.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator labels.
     */
    public static getAuthenticatorLabels(authenticator: FederatedAuthenticatorInterface): string[] {

        const authenticatorId: string = authenticator?.authenticatorId;

        const authenticatorLabels: string[] = get({
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
                AuthenticatorLabels.PASSWORDLESS, AuthenticatorLabels.MULTI_FACTOR
            ],
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.MULTI_FACTOR
            ],
            [ IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS
            ],
            [ IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SOCIAL, AuthenticatorLabels.OIDC
            ],
            [ IdentityProviderManagementConstants.HYPR_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS
            ],
            [ IdentityProviderManagementConstants.IPROOV_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS
            ],
            [ IdentityProviderManagementConstants.ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.HANDLERS
            ]
        }, authenticatorId);

        if (authenticator?.tags?.includes(AuthenticatorLabels.API_AUTHENTICATION)) {
            if (authenticatorLabels) {
                return [ ...authenticatorLabels, AuthenticatorLabels.API_AUTHENTICATION ];
            } else {
                return [ AuthenticatorLabels.API_AUTHENTICATION ];
            }
        }

        return authenticatorLabels;
    }

    /**
     * Get Authenticator Type display name.
     *
     * @param type - Type.
     *
     * @returns Authenticator type display name.
     */
    public static getAuthenticatorTypeDisplayName(type: AuthenticatorCategories): string {

        return get({
            [ AuthenticatorCategories.ENTERPRISE ]: "applications:edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.enterprise.heading",
            [ AuthenticatorCategories.LOCAL ]: "applications:edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.basic.heading",
            [ AuthenticatorCategories.SECOND_FACTOR ]: "applications:edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.mfa.heading",
            [ AuthenticatorCategories.SOCIAL ]: "applications:edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.social.heading",
            [ AuthenticatorCategories.RECOVERY ]: "applications:edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.backupCodes.heading"
        }, type);
    }

    /**
     * Get Authenticator Icon.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator Icon.
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
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.smsOTP,
            [ IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.magicLink,
            [ IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.backupCode
        }, authenticatorId);

        return icon ?? getAuthenticatorIcons().default;
    }

    /**
     * Get Authenticator Type display name.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator type display name.
     */
    public static getAuthenticatorCategory(authenticatorId: string): string {

        return get({
            [ IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "Google",
            [ IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID ]: "GitHub",
            [ IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID ]: "Facebook",
            [ IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID ]: "Twitter",
            [ IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID ]: "OIDC",
            [ IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID ]: "SAML",
            [ IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "Predefined",
            [ IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_ID ]: "Apple",
            [ IdentityProviderManagementConstants.HYPR_AUTHENTICATOR_ID ]: "HYPR"
        }, authenticatorId);
    }

    /**
     * Get the list of allowed filter tags in the UI.
     *
     * `/authenticators/meta/tags` API gives out all the tags which includes `Request-Path` etc.
     * Hence moderation has to be made.
     *
     * @returns List of allowed filter tags.
     */
    public static getAllowedFilterTags(): string[] {

        return [
            AuthenticatorLabels.MULTI_FACTOR,
            AuthenticatorLabels.PASSWORDLESS,
            AuthenticatorLabels.OIDC,
            AuthenticatorLabels.SOCIAL,
            AuthenticatorLabels.SAML,
            AuthenticatorLabels.PASSKEY
        ];
    }

    /**
     * Get Authenticator template name.
     *
     * @param authenticatorId - Authenticator ID.
     *
     * @returns Authenticator template name.
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
            [ IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID ]: "enterprise-saml",
            [ IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_ID ]: "apple"
        }, authenticatorId);
    }
}
