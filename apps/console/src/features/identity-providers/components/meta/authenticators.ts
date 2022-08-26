/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getIdPIcons } from "../../configs";
import { IdentityProviderManagementConstants } from "../../constants";
import { AuthenticatorMeta } from "../../meta";
import { FederatedAuthenticatorMetaDataInterface } from "../../models";

/**
 * The metadata set of connectors shipped OOTB by Identity Server.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns {FederatedAuthenticatorMetaDataInterface[]}
 */
const getKnownConnectorMetadata = (): FederatedAuthenticatorMetaDataInterface[] => {
    return [
        {
            authenticatorId: IdentityProviderManagementConstants.OFFICE_365_AUTHENTICATOR_ID,
            description: "Seamless integration with Office 365.",
            displayName: "Office 365",
            icon: getIdPIcons().office365,
            name: IdentityProviderManagementConstants.OFFICE_365_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID,
            description: "Login users with existing Twitter accounts.",
            displayName: "Twitter",
            icon: getIdPIcons().twitter,
            name: IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID,
            description: "Login users with existing Facebook accounts.",
            displayName: "Facebook",
            icon: getIdPIcons().facebook,
            name: IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID,
            description: "Login users with existing Google accounts.",
            displayName: "Google",
            icon: getIdPIcons().google,
            name: IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.MS_LIVE_AUTHENTICATOR_ID,
            description: "Login users with their Microsoft Live accounts.",
            displayName: "Microsoft Windows Live",
            icon: getIdPIcons().microsoft,
            name: IdentityProviderManagementConstants.MS_LIVE_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.PASSIVE_STS_AUTHENTICATOR_ID,
            description: "Login users with WS Federation.",
            displayName: "Passive STS",
            icon: getIdPIcons().wsFed,
            name: IdentityProviderManagementConstants.PASSIVE_STS_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.IWA_KERBEROS_AUTHENTICATOR_ID,
            description: "Login users to Microsoft Windows servers.",
            displayName: "IWA Kerberos",
            icon: getIdPIcons().iwaKerberos,
            name: IdentityProviderManagementConstants.IWA_KERBEROS_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID,
            description: "Login users with their accounts using SAML protocol.",
            displayName: "SAML",
            icon: getIdPIcons().saml,
            name: IdentityProviderManagementConstants.SAML_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_ID,
            description: "Login users with their accounts using OpenID Connect protocol.",
            displayName: "OpenID Connect",
            icon: getIdPIcons().oidc,
            name: IdentityProviderManagementConstants.OIDC_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_ID,
            description: AuthenticatorMeta
                .getAuthenticatorDescription(IdentityProviderManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_ID),
            displayName: "Email OTP",
            icon: getIdPIcons().emailOTP,
            name: IdentityProviderManagementConstants.LEGACY_EMAIL_OTP_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID,
            description: AuthenticatorMeta.getAuthenticatorDescription("U01TT1RQ"),
            displayName: "SMS OTP",
            icon: getIdPIcons().smsOTP,
            name: IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_NAME
        }
    ];
};

/**
 * The metadata set of connectors that we know are supported by Identity Server.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns {FederatedAuthenticatorMetaDataInterface[]}
 */
const getKnownExternalConnectorMetadata = (): FederatedAuthenticatorMetaDataInterface[] => {
    return [
        {
            authenticatorId: IdentityProviderManagementConstants.YAHOO_AUTHENTICATOR_ID,
            description: "Login users with their Yahoo accounts.",
            displayName: "Yahoo",
            icon: getIdPIcons().yahoo,
            name: IdentityProviderManagementConstants.YAHOO_AUTHENTICATOR_NAME
        },
        {
            authenticatorId: IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID,
            description: "Login users with existing GitHub accounts",
            displayName: "GitHub",
            icon: getIdPIcons().github,
            name: IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_NAME
        }
    ];
};

/**
 * The metadata set of connectors that are added by user.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns {FederatedAuthenticatorMetaDataInterface[]}
 */
const getExternalConnectorMetadataExtensions = (): FederatedAuthenticatorMetaDataInterface[] => {
    return window[ "AppUtils" ]?.getConfig()?.extensions?.connectors ?? [];
};

/**
 * The metadata set of all the connectors that are available.
 * TODO: Remove this mapping once there's an API to get the connector icons, etc.
 * @returns {FederatedAuthenticatorMetaDataInterface[]}
 */
export const getConnectorMetadata = (): FederatedAuthenticatorMetaDataInterface[] => {

    return [
        ...getKnownConnectorMetadata(),
        ...getKnownExternalConnectorMetadata(),
        ...getExternalConnectorMetadataExtensions()
    ];
};
