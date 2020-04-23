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

import { IdPIcons } from "../../../configs";

export const FederatedAuthenticators = [
    {
        authenticatorId: "T2ZmaWNlMzY1QXV0aGVudGljYXRvcg",
        icon: IdPIcons.office365,
        name: "Office365Authenticator"
    },
    {
        authenticatorId: "VHdpdHRlckF1dGhlbnRpY2F0b3I",
        icon: IdPIcons.twitter,
        name: "TwitterAuthenticator"
    },
    {
        authenticatorId: "RmFjZWJvb2tBdXRoZW50aWNhdG9y",
        icon: IdPIcons.facebook,
        name: "FacebookAuthenticator"
    },
    {
        authenticatorId: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
        icon: IdPIcons.google,
        name: "GoogleOIDCAuthenticator"
    },
    {
        authenticatorId: "TWljcm9zb2Z0V2luZG93c0xpdmVBdXRoZW50aWNhdG9y",
        icon: IdPIcons.microsoft,
        name: "MicrosoftWindowsLiveAuthenticator"
    },
    {
        authenticatorId: "UGFzc2l2ZVNUU0F1dGhlbnRpY2F0b3I",
        icon: IdPIcons.wsFed,
        name: "PassiveSTSAuthenticator"
    },
    {
        authenticatorId: "WWFob29PQXV0aDJBdXRoZW50aWNhdG9y",
        icon: IdPIcons.yahoo,
        name: "YahooOAuth2Authenticator"
    },
    {
        authenticatorId: "SVdBS2VyYmVyb3NBdXRoZW50aWNhdG9y",
        icon: IdPIcons.iwaKerberos,
        name: "IWAKerberosAuthenticator"
    },
    {
        authenticatorId: "U0FNTFNTT0F1dGhlbnRpY2F0b3I",
        icon: IdPIcons.saml,
        name: "SAMLSSOAuthenticator"
    },
    {
        authenticatorId: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
        icon: IdPIcons.oidc,
        name: "OpenIDConnectAuthenticator"
    },
    {
        authenticatorId: "RW1haWxPVFA",
        icon: IdPIcons.emailOTP,
        name: "EmailOTP"
    },
    {
        authenticatorId: "U01TT1RQ",
        icon: IdPIcons.smsOTP,
        name: "SMSOTP"
    }
];
