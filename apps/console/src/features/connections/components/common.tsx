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

import { lazy } from "react";
import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";

export const getAuthenticatorList = (): any => {
    return {
        [ AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("./authenticators/email-otp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("./authenticators/sms-otp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ AuthenticatorManagementConstants.TOTP_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("./authenticators/totp/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: true
        },
        [ AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("./authenticators/fido/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: false
        },
        [ AuthenticatorManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID ]: {
            content: {
                quickStart: lazy(() => import("./authenticators/magic-link/quick-start"))
            },
            isComingSoon: false,
            isEnabled: true,
            useAuthenticatorsAPI: true
        }
    };
};
