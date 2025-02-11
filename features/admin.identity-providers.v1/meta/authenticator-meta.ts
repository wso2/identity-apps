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

import {
    FederatedAuthenticatorConstants
} from "@wso2is/admin.connections.v1/constants/federated-authenticator-constants";
import { LocalAuthenticatorConstants } from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { AuthenticatorLabels } from "@wso2is/admin.connections.v1/models/authenticators";
import get from "lodash-es/get";
import { ReactNode } from "react";
import { getAuthenticatorIcons } from "../configs/ui";
import { AuthenticatorCategories, LocalAuthenticatorInterface } from "../models";

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
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .BASIC_AUTHENTICATOR_ID ]: "Login users with username and password " +
                "credentials.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Get users Identity first to " +
                "control the authentication flow.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: "Login users with passkey, " +
                "FIDO security key or biometrics.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .TOTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "Time-Based One Time passcode.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "Login users with " +
                "existing Google accounts.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GITHUB_AUTHENTICATOR_ID ]: "Login users with " +
                "existing GitHub accounts.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.FACEBOOK_AUTHENTICATOR_ID ]: "Login users with " +
                "existing Facebook accounts.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.TWITTER_AUTHENTICATOR_ID ]: "Login users with " +
                "existing Twitter accounts.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID ]: "Authenticate users with " +
                "Enterprise OIDC connections.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID ]: "Authenticate users with " +
                "Enterprise SAML connections.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .EMAIL_OTP_AUTHENTICATOR_ID ]: "Email users a one-time passcode to " +
                "log in passwordless.",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS
                .EMAIL_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication " +
                "using one-time passcode sent via email.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .SMS_OTP_AUTHENTICATOR_ID ]: "Two-factor authentication using " +
                "SMS one-time passcode.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .MAGIC_LINK_AUTHENTICATOR_ID ]: "Email users a magic link to " +
                "log in passwordless",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.APPLE_AUTHENTICATOR_ID ]: "Login users with " +
            "their Apple IDs.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .BACKUP_CODE_AUTHENTICATOR_ID ]: "Two-factor authentication " +
            "recovery option.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID ]: "Limit the number " +
            "of active user sessions.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .X509_CERTIFICATE_AUTHENTICATOR_ID ]: "Authenticate clients using " +
                "client certificates.",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .PUSH_AUTHENTICATOR_ID ]: "Two-factor authentication via " +
                "mobile push notifications."
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
            [ AuthenticatorCategories.ENTERPRISE ]: "applications:edit.sections." +
                "signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.enterprise.heading",
            [ AuthenticatorCategories.LOCAL ]: "applications:edit.sections." +
                "signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.basic.heading",
            [ AuthenticatorCategories.SECOND_FACTOR ]: "applications:edit.sections." +
                "signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.mfa.heading",
            [ AuthenticatorCategories.SOCIAL ]: "applications:edit.sections." +
                "signOnMethod.sections.authenticationFlow.sections.stepBased." +
                "addAuthenticatorModal.content.authenticatorGroups.social.heading",
            [ AuthenticatorCategories.RECOVERY ]: "applications:edit.sections." +
            "signOnMethod.sections.authenticationFlow.sections.stepBased." +
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
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.identifierFirst,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .JWT_BASIC_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.jwtBasic,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.fido,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .X509_CERTIFICATE_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.x509,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.totp,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.BASIC_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.basic,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.sessionExecutor,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .EMAIL_OTP_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.emailOTP,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.smsOTP,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .MAGIC_LINK_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.magicLink,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS
                .BACKUP_CODE_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.backupCode,
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.PUSH_AUTHENTICATOR_ID ]: getAuthenticatorIcons()?.push
        }, authenticatorId);

        return icon ?? getAuthenticatorIcons().default;
    }

    /**
     * Get Custom Authenticator Icon.
     *
     * Currently authenticator id is being used to fetch the respective authenticator icon.
     * Existing function could not be used since the id and the name of
     * custom authenticators are not pre defined.
     * For custom local authenticators, it returns the authenticator's own image URI if available,
     * or falls back to a default custom authenticator icon.
     *
     * @returns Custom Authenticator Icon.
     */
    public static getCustomAuthenticatorIcon(authenticator: LocalAuthenticatorInterface): string {
        if (authenticator?.image) {
            return authenticator.image;
        }

        return getAuthenticatorIcons()?.customAuthenticator;
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
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.MAGIC_LINK_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.PUSH_AUTHENTICATOR_ID ]: "Predefined",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "Google",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GITHUB_AUTHENTICATOR_ID ]: "GitHub",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.FACEBOOK_AUTHENTICATOR_ID ]: "Facebook",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.TWITTER_AUTHENTICATOR_ID ]: "Twitter",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID ]: "OIDC",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID ]: "SAML",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID ]: "Predefined",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: "Predefined",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.APPLE_AUTHENTICATOR_ID ]: "Apple",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.HYPR_AUTHENTICATOR_ID ]: "HYPR"
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
            [ LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.BASIC_AUTHENTICATOR_NAME ]: "username-and-password",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.BASIC_AUTHENTICATOR_ID ]: "username-and-password",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.FIDO_AUTHENTICATOR_ID ]: "fido",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID ]: "totp",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID ]: "sms-otp",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID ]: "email-otp",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.PUSH_AUTHENTICATOR_ID ]: "push",
            [ LocalAuthenticatorConstants.AUTHENTICATOR_IDS.IDENTIFIER_FIRST_AUTHENTICATOR_ID ]: "identifier-first",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GOOGLE_OIDC_AUTHENTICATOR_ID ]: "google",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GITHUB_AUTHENTICATOR_ID ]: "github",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.FACEBOOK_AUTHENTICATOR_ID ]: "facebook",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.TWITTER_AUTHENTICATOR_ID ]: "twitter",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID ]: "enterprise-oidc",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID ]: "enterprise-saml",
            [ FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.APPLE_AUTHENTICATOR_ID ]: "apple"
        }, authenticatorId);
    }
}
