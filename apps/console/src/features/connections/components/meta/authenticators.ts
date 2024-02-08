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

import { getConnectionIcons } from "../../configs/ui";
import { AuthenticatorManagementConstants } from "../../constants/autheticator-constants";
import { ConnectionManagementConstants } from "../../constants/connection-constants";
import { AuthenticatorMeta } from "../../meta/authenticator-meta";
import { FederatedAuthenticatorMetaDataInterface } from "../../models/authenticators";

/**
 * The metadata set of connectors shipped OOTB by Identity Server.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns List of FederatedAuthenticatorMetaDataInterface.
 */
const getKnownConnectorMetadata = (): FederatedAuthenticatorMetaDataInterface[] => {
    return [
        {
            authenticatorId: ConnectionManagementConstants.OFFICE_365_AUTHENTICATOR_ID,
            description: "Seamless integration with Office 365.",
            displayName: "Office 365",
            icon: getConnectionIcons().office365,
            name: ConnectionManagementConstants.OFFICE_365_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: ConnectionManagementConstants.TWITTER_AUTHENTICATOR_ID,
            description: "Login users with existing Twitter accounts.",
            displayName: "Twitter",
            icon: getConnectionIcons().twitter,
            name: ConnectionManagementConstants.TWITTER_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: ConnectionManagementConstants.FACEBOOK_AUTHENTICATOR_ID,
            description: "Login users with existing Facebook accounts.",
            displayName: "Facebook",
            icon: getConnectionIcons().facebook,
            name: ConnectionManagementConstants.FACEBOOK_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: ConnectionManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID,
            description: "Login users with existing Google accounts.",
            displayName: "Google",
            icon: getConnectionIcons().google,
            name: ConnectionManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: ConnectionManagementConstants.MS_LIVE_AUTHENTICATOR_ID,
            description: "Login users with their Microsoft Live accounts.",
            displayName: "Microsoft Windows Live",
            icon: getConnectionIcons().microsoft,
            name: ConnectionManagementConstants.MS_LIVE_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: AuthenticatorManagementConstants.PASSIVE_STS_AUTHENTICATOR_ID,
            description: "Login users with WS Federation.",
            displayName: "WS-Federation",
            icon: getConnectionIcons().wsFed,
            name: AuthenticatorManagementConstants.PASSIVE_STS_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: ConnectionManagementConstants.IWA_KERBEROS_AUTHENTICATOR_ID,
            description: "Login users to Microsoft Windows servers.",
            displayName: "IWA Kerberos",
            icon: getConnectionIcons().iwaKerberos,
            name: ConnectionManagementConstants.IWA_KERBEROS_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID,
            description: "Login users with their accounts using SAML protocol.",
            displayName: "SAML",
            icon: getConnectionIcons().saml,
            name: AuthenticatorManagementConstants.SAML_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_ID,
            description: "Login users with their accounts using OpenID Connect protocol.",
            displayName: "OpenID Connect",
            icon: getConnectionIcons().oidc,
            name: AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: AuthenticatorManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_ID,
            description: AuthenticatorMeta
                .getAuthenticatorDescription(AuthenticatorManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_ID),
            displayName: "Email OTP",
            icon: getConnectionIcons().emailOTP,
            name: AuthenticatorManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: AuthenticatorManagementConstants.LEGACY_SMS_OTP_AUTHENTICATOR_ID,
            description: AuthenticatorMeta
                .getAuthenticatorDescription(AuthenticatorManagementConstants.LEGACY_SMS_OTP_AUTHENTICATOR_ID),
            displayName: "SMS OTP",
            icon: getConnectionIcons().smsOTP,
            name: AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: ConnectionManagementConstants.APPLE_AUTHENTICATOR_ID,
            description: "Login users with their Apple IDs.",
            displayName: "Apple",
            icon: getConnectionIcons().apple,
            name: ConnectionManagementConstants.APPLE_AUTHENTICATOR_NAME
        }
    ];
};

/**
 * The metadata set of connectors that we know are supported by Identity Server.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns List of FederatedAuthenticatorMetaDataInterface.
 */
const getKnownExternalConnectorMetadata = (): FederatedAuthenticatorMetaDataInterface[] => {
    return [
        {
            authenticatorId: ConnectionManagementConstants.YAHOO_AUTHENTICATOR_ID,
            description: "Login users with their Yahoo accounts.",
            displayName: "Yahoo",
            icon: getConnectionIcons().yahoo,
            name: ConnectionManagementConstants.YAHOO_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: ConnectionManagementConstants.GITHUB_AUTHENTICATOR_ID,
            description: "Login users with existing GitHub accounts",
            displayName: "GitHub",
            icon: getConnectionIcons()?.githubAuthenticator,
            name: ConnectionManagementConstants.GITHUB_AUTHENTICATOR_NAME
        }
    ];
};

/**
 * The metadata set of connectors that are added by user.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns List of FederatedAuthenticatorMetaDataInterface.
 */
const getExternalConnectorMetadataExtensions = (): FederatedAuthenticatorMetaDataInterface[] => {
    return window[ "AppUtils" ]?.getConfig()?.extensions?.connectors ?? [];
};

/**
 * The metadata set of all the connectors that are available.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns List of FederatedAuthenticatorMetaDataInterface.
 */
export const getConnectorMetadata = (): FederatedAuthenticatorMetaDataInterface[] => {

    return [
        ...getKnownConnectorMetadata(),
        ...getExternalConnectorMetadataExtensions(),
        ...getKnownExternalConnectorMetadata()
    ];
};
