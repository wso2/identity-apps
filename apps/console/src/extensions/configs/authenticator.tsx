/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { AuthenticatorConfig } from "./models";
import { ChoreoButton } from "../components/shared/button/choreo-navigation-button";

export const authenticatorConfig : AuthenticatorConfig = {
    externalResourceButton: <ChoreoButton />,
    overriddenAuthenticatorIds: {
        SMS_OTP_AUTHENTICATOR_ID: "c21zLW90cC1hdXRoZW50aWNhdG9y"
    },
    overriddenAuthenticatorNames: {
        SMS_OTP_AUTHENTICATOR: "sms-otp-authenticator"
    } 
};
