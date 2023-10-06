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

/**
* Form initial values interface.
*/
export interface PasswordResetFormValuesInterface {
     /**
     * User gets notified with a link to reset password.
     */
    enableRecoveryLink: boolean;
    /**
     * User gets notified with a one time password to try with SSO login.
     */
    enableOTP: boolean;
    /**
     * An OTP generated and stored in users claims.
     */
    enableOfflineOTP: boolean;
    /**
     * Validity time of the admin forced password reset code in minutes.
     */
    passwordResetExpiryTime: number;
}

/**
* User claim update API Request values interface.
*/
export interface PasswordResetAPIRequestInterface {
    /**
     * User gets notified with a link to reset password.
     */
    "Recovery.AdminPasswordReset.RecoveryLink": boolean;
    /**
     * User gets notified with a one time password to try with SSO login.
     */
    "Recovery.AdminPasswordReset.OTP": boolean;
    /**
     * An OTP generated and stored in users claims.
     */
    "Recovery.AdminPasswordReset.Offline": boolean;
    /**
     * Validity time of the admin forced password reset code in minutes.
     */
    "Recovery.AdminPasswordReset.ExpiryTime": string;
}
