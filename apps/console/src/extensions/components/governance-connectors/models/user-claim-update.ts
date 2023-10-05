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
export interface UserClaimUpdateFormValuesInterface {
    /**
     * Trigger a verification notification when user's email address is updated.
     */
    enableEmailVerification: boolean;
    /**
     * Trigger a notification to the existing email address when the user attempts to update the existing email address.
     */
    enableEmailNotification: boolean;
    /**
     * Validity time of the email confirmation link in minutes.
     */
    emailVerificationExpiryTime: number;
    /**
     * Allow privileged users to initiate mobile number verification on update.
     */
    enableMobileVerification: boolean;
    /**
     * Trigger a verification SMS OTP when user's mobile number is updated.
     */
    enableMobileNotification: boolean;
    /**
     * Validity time of the mobile number confirmation OTP in minutes.
     */
    mobileVerificationExpiryTime: number;
}

/**
* User claim update API Request values interface.
*/
export interface UserClaimUpdateAPIRequestInterface {
    /**
     * Trigger a verification notification when user's email address is updated.
     */
    "UserClaimUpdate.Email.EnableVerification": boolean;
    /**
     * Trigger a notification to the existing email address when the user attempts to update the existing email address.
     */
    "UserClaimUpdate.Email.EnableNotification": boolean;
    /**
     * Validity time of the email confirmation link in minutes.
     */
    "UserClaimUpdate.Email.VerificationCode.ExpiryTime": string;
    /**
     * Allow privileged users to initiate mobile number verification on update.
     */
    "UserClaimUpdate.MobileNumber.EnableVerification": boolean;
    /**
     * Trigger a verification SMS OTP when user's mobile number is updated.
     */
    "UserClaimUpdate.MobileNumber.EnableVerificationByPrivilegedUser": boolean;
    /**
     * Validity time of the mobile number confirmation OTP in minutes.
     */
    "UserClaimUpdate.MobileNumber.VerificationCode.ExpiryTime": string;
}
