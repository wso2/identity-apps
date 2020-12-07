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

import { StrictGenericAuthenticatorInterface } from "../../../identity-providers";
import { getAuthenticatorIcons } from "../../configs";

export const getSelectedLocalAuthenticators = (): StrictGenericAuthenticatorInterface[] => {
    return [
        {
            id: "SWRlbnRpZmllckV4ZWN1dG9y",
            image: getAuthenticatorIcons()?.identifierFirst,
            name: "IdentifierExecutor"
        },
        {
            id: "SldUQmFzaWNBdXRoZW50aWNhdG9y",
            image: getAuthenticatorIcons()?.jwtBasic,
            name: "JWTBasicAuthenticator"
        },
        {
            id: "RklET0F1dGhlbnRpY2F0b3I",
            image: getAuthenticatorIcons()?.fido,
            name: "FIDOAuthenticator"
        },
        {
            id: "eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg",
            image: getAuthenticatorIcons()?.x509,
            name: "x509CertificateAuthenticator"
        },
        {
            id: "dG90cA",
            image: getAuthenticatorIcons()?.totp,
            name: "totp"
        },
        {
            id: "QmFzaWNBdXRoZW50aWNhdG9y",
            image: getAuthenticatorIcons()?.basic,
            name: "BasicAuthenticator"
        },
        {
            id: "U2Vzc2lvbkV4ZWN1dG9y",
            image: getAuthenticatorIcons()?.sessionExecutor,
            name: "SessionExecutor"
        }
    ];
};

export const getSelectedFederatedAuthenticators = (): StrictGenericAuthenticatorInterface[] => {
    return [
        {
            id: "TWljcm9zb2Z0V2luZG93c0xpdmVBdXRoZW50aWNhdG9y",
            image: getAuthenticatorIcons()?.microsoft,
            name: "MicrosoftWindowsLiveAuthenticator"
        },
        {
            id: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
            image: getAuthenticatorIcons()?.google,
            name: "GoogleOIDCAuthenticator"
        },
        {
            id: "U01TT1RQ",
            image: getAuthenticatorIcons()?.smsOTP,
            name: "SMSOTP"
        },
        {
            id: "VHdpdHRlckF1dGhlbnRpY2F0b3I",
            image: getAuthenticatorIcons()?.twitter,
            name: "TwitterAuthenticator"
        },
        {
            id: "RW1haWxPVFA",
            image: getAuthenticatorIcons()?.emailOTP,
            name: "EmailOTP"
        },
        {
            id: "WWFob29PQXV0aDJBdXRoZW50aWNhdG9y",
            image: getAuthenticatorIcons()?.yahoo,
            name: "YahooOAuth2Authenticator"
        },
        {
            id: "SVdBS2VyYmVyb3NBdXRoZW50aWNhdG9y",
            image: undefined,
            name: "IWAKerberosAuthenticator"
        },
        {
            id: "RmFjZWJvb2tBdXRoZW50aWNhdG9y",
            image: getAuthenticatorIcons()?.facebook,
            name: "FacebookAuthenticator"
        },
        {
            id: "T2ZmaWNlMzY1QXV0aGVudGljYXRvcg",
            image: getAuthenticatorIcons()?.office365,
            name: "Office365Authenticator"
        }
    ];
};
