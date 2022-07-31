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
import { AuthenticatorMeta } from "../../meta";
import { FederatedAuthenticatorMetaDataInterface } from "../../models";

/**
 * The set of connectors shipped OOTB by Identity Server.
 * TODO: Remove this mapping once there's an API to get the list of connectors.
 * @returns {FederatedAuthenticatorMetaDataInterface[]}
 */
export const getFederatedAuthenticators = (): FederatedAuthenticatorMetaDataInterface[] => {
    return [
        {
            authenticatorId: "T2ZmaWNlMzY1QXV0aGVudGljYXRvcg",
            description: "Seamless integration with Office 365.",
            displayName: "Office 365",
            icon: getIdPIcons().office365,
            name: "Office365Authenticator"
        },
        {
            authenticatorId: "VHdpdHRlckF1dGhlbnRpY2F0b3I",
            description: "Login users with existing Twitter accounts.",
            displayName: "Twitter",
            icon: getIdPIcons().twitter,
            name: "TwitterAuthenticator"
        },
        {
            authenticatorId: "RmFjZWJvb2tBdXRoZW50aWNhdG9y",
            description: "Login users with existing Facebook accounts.",
            displayName: "Facebook",
            icon: getIdPIcons().facebook,
            name: "FacebookAuthenticator"
        },
        {
            authenticatorId: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
            description: "Login users with existing Google accounts.",
            displayName: "Google",
            icon: getIdPIcons().google,
            name: "GoogleOIDCAuthenticator"
        },
        {
            authenticatorId: "TWljcm9zb2Z0V2luZG93c0xpdmVBdXRoZW50aWNhdG9y",
            description: "Login users with their Microsoft Live accounts.",
            displayName: "Microsoft Windows Live",
            icon: getIdPIcons().microsoft,
            name: "MicrosoftWindowsLiveAuthenticator"
        },
        {
            authenticatorId: "UGFzc2l2ZVNUU0F1dGhlbnRpY2F0b3I",
            description: "Login users with WS Federation.",
            displayName: "Passive STS",
            icon: getIdPIcons().wsFed,
            name: "PassiveSTSAuthenticator"
        },
        {
            authenticatorId: "WWFob29PQXV0aDJBdXRoZW50aWNhdG9y",
            description: "Login users with their Yahoo accounts.",
            displayName: "Yahoo",
            icon: getIdPIcons().yahoo,
            name: "YahooOAuth2Authenticator"
        },
        {
            authenticatorId: "SVdBS2VyYmVyb3NBdXRoZW50aWNhdG9y",
            description: "Login users to Microsoft Windows servers.",
            displayName: "IWA Kerberos",
            icon: getIdPIcons().iwaKerberos,
            name: "IWAKerberosAuthenticator"
        },
        {
            authenticatorId: "U0FNTFNTT0F1dGhlbnRpY2F0b3I",
            description: "Login users with their accounts using SAML protocol.",
            displayName: "SAML",
            icon: getIdPIcons().saml,
            name: "SAMLSSOAuthenticator"
        },
        {
            authenticatorId: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
            description: "Login users with their accounts using OpenID Connect protocol.",
            displayName: "OpenID Connect",
            icon: getIdPIcons().oidc,
            name: "OpenIDConnectAuthenticator"
        },
        {
            authenticatorId: "RW1haWxPVFA",
            description: AuthenticatorMeta.getAuthenticatorDescription("RW1haWxPVFA"),
            displayName: "Email OTP",
            icon: getIdPIcons().emailOTP,
            name: "EmailOTP"
        },
        {
            authenticatorId: "U01TT1RQ",
            description: AuthenticatorMeta.getAuthenticatorDescription("U01TT1RQ"),
            displayName: "SMS OTP",
            icon: getIdPIcons().smsOTP,
            name: "SMSOTP"
        }
    ];
};
