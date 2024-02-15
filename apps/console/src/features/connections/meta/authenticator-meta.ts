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

import get from "lodash-es/get";
import { ReactNode, lazy } from "react";
import { getConnectionIcons } from "../configs/ui";
import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";
import { AuthenticatorCategories, AuthenticatorLabels } from "../models/authenticators";

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
            [ AuthenticatorManagementConstants.BASIC_AUTHENTICATOR_ID ]: "Login users with username and password " +
                "credentials.",
            [ AuthenticatorManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Get users Identity first to " +
                "control the authentication flow.",
            [ AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Login users with passkey, FIDO security key " +
                "or biometrics.",
            [ AuthenticatorManagementConstants.TOTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "Time-Based One Time passcode.",
            [ AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_ID ]: "Authenticate users with " +
                "Enterprise OIDC connections.",
            [ AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID ]: "Authenticate users with " +
                "Enterprise SAML connections.",
            [ AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "one-time passcode sent via email.",
            [ AuthenticatorManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication " +
                "using one-time passcode sent via email.",
            [ AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "SMS one-time passcode.",
            [ AuthenticatorManagementConstants.LEGACY_SMS_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "SMS one-time passcode.",
            [ AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: "Email users a magic link to " +
                "log in passwordless",
            [ AuthenticatorManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID ]: "Two-factor authentication " +
                "recovery option.",
            [ AuthenticatorManagementConstants.X509_CERTIFICATE_AUTHENTICATOR_ID ]: "Authenticate clients using " +
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
    public static getAuthenticatorLabels(authenticatorId: string): string[] {

        return get({
            [ AuthenticatorManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: [ AuthenticatorLabels.HANDLERS ],
            [ AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS,
                AuthenticatorLabels.PASSKEY
            ],
            [ AuthenticatorManagementConstants.TOTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SECOND_FACTOR, AuthenticatorLabels.MULTI_FACTOR
            ],
            [ AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.OIDC
            ],
            [ AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.SAML
            ],
            [ AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.MULTI_FACTOR
            ],
            [ AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.MULTI_FACTOR
            ],
            [ AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: [
                AuthenticatorLabels.PASSWORDLESS
            ]
        }, authenticatorId);
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
                "addAuthenticatorModal.content.authenticatorGroups.social.heading",
            [ AuthenticatorCategories.RECOVERY ]: "console:develop.features." +
                "applications.edit.sections.signOnMethod.sections.authenticationFlow.sections.stepBased." +
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
            AuthenticatorManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID
            ]: getConnectionIcons()?.identifierFirst,
            [ AuthenticatorManagementConstants.JWT_BASIC_AUTHENTICATOR_ID ]: getConnectionIcons()?.jwtBasic,
            [ AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID ]: getConnectionIcons()?.fido,
            [ AuthenticatorManagementConstants.X509_CERTIFICATE_AUTHENTICATOR_ID ]: getConnectionIcons()?.x509,
            [ AuthenticatorManagementConstants.TOTP_AUTHENTICATOR_ID ]: getConnectionIcons()?.totp,
            [ AuthenticatorManagementConstants.BASIC_AUTHENTICATOR_ID ]: getConnectionIcons()?.basic,
            [
            AuthenticatorManagementConstants.ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID
            ]: getConnectionIcons()?.sessionExecutor,
            [ AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: getConnectionIcons()?.emailOTP,
            [ AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: getConnectionIcons()?.smsOTP,
            [ AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: getConnectionIcons()?.magicLink,
            [ AuthenticatorManagementConstants.BACKUP_CODE_AUTHENTICATOR_ID ]: getConnectionIcons()?.backupCode,
            [
            AuthenticatorManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID
            ]: getConnectionIcons()?.organizationSSO
        }, authenticatorId);

        return icon ?? getConnectionIcons().default;
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
            [ AuthenticatorManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Predefined",
            [ AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID ]: "Predefined",
            [ AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: "Predefined",
            [ AuthenticatorManagementConstants.TOTP_AUTHENTICATOR_ID ]: "Predefined",
            [ AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_ID ]: "OIDC",
            [ AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID ]: "SAML",
            [ AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "Predefined",
            [ AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "Predefined"
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
            AuthenticatorLabels.PASSKEY,
            AuthenticatorLabels.API_AUTHENTICATION
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
            [ AuthenticatorManagementConstants.BASIC_AUTHENTICATOR_ID ]: "username-and-password",
            [ AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID ]: "fido",
            [ AuthenticatorManagementConstants.TOTP_AUTHENTICATOR_ID ]: "totp",
            [ AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: "sms-otp",
            [ AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: "email-otp",
            [ AuthenticatorManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "identifier-first",
            [ AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_ID ]: "enterprise-oidc",
            [ AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID ]: "enterprise-saml"
        }, authenticatorId);
    }

    public static getAuthenticators(): any {
        return {
            [ AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import("../components/authenticators/email-otp/quick-start"))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: false
            },
            [ AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import("../components/authenticators/sms-otp/quick-start"))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: false
            },
            [ AuthenticatorManagementConstants.TOTP_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import("../components/authenticators/totp/quick-start"))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: true
            },
            [ AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import("../components/authenticators/fido/quick-start"))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: true
            },
            [ AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: {
                content: {
                    quickStart: lazy(() => import("../components/authenticators/magic-link/quick-start"))
                },
                isComingSoon: false,
                isEnabled: true,
                useAuthenticatorsAPI: true
            }
        };
    }
}
