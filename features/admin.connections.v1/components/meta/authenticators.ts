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

import { getConnectionIcons } from "../../configs/ui";
import { FederatedAuthenticatorConstants } from "../../constants/federated-authenticator-constants";
import { LocalAuthenticatorConstants } from "../../constants/local-authenticator-constants";
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
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OFFICE_365_AUTHENTICATOR_ID,
            description: "Seamless integration with Office 365.",
            displayName: "Office 365",
            icon: getConnectionIcons().office365,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.OFFICE_365_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.TWITTER_AUTHENTICATOR_ID,
            description: "Login users with existing Twitter accounts.",
            displayName: "Twitter",
            icon: getConnectionIcons().twitter,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.TWITTER_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.FACEBOOK_AUTHENTICATOR_ID,
            description: "Login users with existing Facebook accounts.",
            displayName: "Facebook",
            icon: getConnectionIcons().facebook,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.FACEBOOK_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GOOGLE_OIDC_AUTHENTICATOR_ID,
            description: "Login users with existing Google accounts.",
            displayName: "Google",
            icon: getConnectionIcons().google,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.GOOGLE_OIDC_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.MS_LIVE_AUTHENTICATOR_ID,
            description: "Login users with their Microsoft Live accounts.",
            displayName: "Microsoft Windows Live",
            icon: getConnectionIcons().microsoft,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.MS_LIVE_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: LocalAuthenticatorConstants.AUTHENTICATOR_IDS.PASSIVE_STS_AUTHENTICATOR_ID,
            description: "Login users with WS Federation.",
            displayName: "WS-Federation",
            icon: getConnectionIcons().wsFed,
            name: LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.PASSIVE_STS_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.IWA_KERBEROS_AUTHENTICATOR_ID,
            description: "Login users to Microsoft Windows servers.",
            displayName: "IWA Kerberos",
            icon: getConnectionIcons().iwaKerberos,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.IWA_KERBEROS_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID,
            description: "Login users with their accounts using SAML protocol.",
            displayName: "SAML",
            icon: getConnectionIcons().saml,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.SAML_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID,
            description: "Login users with their accounts using OpenID Connect protocol.",
            displayName: "OpenID Connect",
            icon: getConnectionIcons().oidc,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.OIDC_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID,
            description: AuthenticatorMeta
                .getAuthenticatorDescription(FederatedAuthenticatorConstants.AUTHENTICATOR_IDS
                    .EMAIL_OTP_AUTHENTICATOR_ID),
            displayName: "Email OTP",
            icon: getConnectionIcons().emailOTP,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.EMAIL_OTP_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID,
            description: AuthenticatorMeta
                .getAuthenticatorDescription(FederatedAuthenticatorConstants.AUTHENTICATOR_IDS
                    .SMS_OTP_AUTHENTICATOR_ID),
            displayName: "SMS OTP",
            icon: getConnectionIcons().smsOTP,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.SMS_OTP_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.APPLE_AUTHENTICATOR_ID,
            description: "Login users with their Apple IDs.",
            displayName: "Apple",
            icon: getConnectionIcons().apple,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.APPLE_AUTHENTICATOR_NAME
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
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.YAHOO_AUTHENTICATOR_ID,
            description: "Login users with their Yahoo accounts.",
            displayName: "Yahoo",
            icon: getConnectionIcons().yahoo,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.YAHOO_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GITHUB_AUTHENTICATOR_ID,
            description: "Login users with existing GitHub accounts",
            displayName: "GitHub",
            icon: getConnectionIcons()?.githubAuthenticator,
            name: FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.GITHUB_AUTHENTICATOR_NAME
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
