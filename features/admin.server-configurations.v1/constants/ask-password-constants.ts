/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { ServerConfigurationsConstants } from "./server-configurations-constants";

export class AskPasswordFormConstants {

    /**
     * Private constructor to avoid object instantiation from outside the class.
     *
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly allowedConnectorFields: string[] = [
        ServerConfigurationsConstants.ASK_PASSWORD_ENABLE,
        ServerConfigurationsConstants.ASK_PASSWORD_LOCK_ON_CREATION,
        ServerConfigurationsConstants.ASK_PASSWORD_ACCOUNT_ACTIVATION,
        ServerConfigurationsConstants.ASK_PASSWORD_OTP_EXPIRY_TIME,
        ServerConfigurationsConstants.ASK_PASSWORD_EMAIL_OTP,
        ServerConfigurationsConstants.ASK_PASSWORD_SMS_OTP,
        ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_LOWERCASE,
        ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_NUMERIC,
        ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_UPPERCASE,
        ServerConfigurationsConstants.ASK_PASSWORD_OTP_LENGTH
    ];
}
