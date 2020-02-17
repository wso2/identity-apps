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

import { AuthenticatorIcons } from "../../../configs";

enum authenticatorType {
    SECOND_FACTOR = "secondary",
    FIRST_FACTOR = "first",
    SOCIAL = "social"
}

export interface AuthenticatorListInterface {
    authenticator?: string;
    authenticatorId?: string;
    displayName?: string;
    idp?: string;
    image?: any;
    type?: authenticatorType;
}

export const selectedLocalAuthenticators: AuthenticatorListInterface[] = [
    {
        authenticator: "BasicAuthenticator",
        displayName: "Basic",
        idp: "LOCAL",
        image: AuthenticatorIcons.basic,
        type: authenticatorType.FIRST_FACTOR,
    },
    {
        authenticator: "FIDOAuthenticator",
        displayName: "FIDO",
        idp: "LOCAL",
        image: AuthenticatorIcons.fido,
        type: authenticatorType.SECOND_FACTOR,
    },
    {
        authenticator: "totp",
        displayName: "TOTP",
        idp: "LOCAL",
        image: AuthenticatorIcons.totp,
        type: authenticatorType.SECOND_FACTOR,
    }
];

export const selectedFederatedAuthenticators: AuthenticatorListInterface[] = [
    {
        authenticator: "EmailOTP",
        authenticatorId: "RW1haWxPVFA",
        displayName: "Email OTP",
        image: AuthenticatorIcons.emailOTP,
        type: authenticatorType.SECOND_FACTOR,
    },
    {
        authenticator: "SMSOTP",
        authenticatorId: "U01TT1RQ",
        displayName: "SMS OTP",
        image: AuthenticatorIcons.smsOTP,
        type: authenticatorType.SECOND_FACTOR,
    },
    {
        authenticator: "GoogleOIDCAuthenticator",
        authenticatorId: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
        displayName: "Google",
        image: AuthenticatorIcons.google,
        type: authenticatorType.SOCIAL,
    },
    {
        authenticator: "FacebookAuthenticator",
        authenticatorId: "RmFjZWJvb2tBdXRoZW50aWNhdG9y",
        displayName: "Facebook",
        image: AuthenticatorIcons.facebook,
        type: authenticatorType.SOCIAL,
    },
];
