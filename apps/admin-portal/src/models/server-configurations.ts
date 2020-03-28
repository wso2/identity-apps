/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the License); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 *  Captures the configurations related to user self sign up.
 */
export interface SelfSignUpConfigurationsInterface {
	enable?: string[];
	accountLockOnCreation?: string[];
	internalNotificationManagement?: string[];
	reCaptcha?: string[];
	verificationCodeExpiryTime?: string;
	smsOTPExpiryTime?: string;
	callbackRegex?: string;
}

/**
 *  Captures the configurations related to user account recovery.
 */
export interface AccountRecoveryConfigurationsInterface {
	callbackRegex?: string;
	enableForcedChallengeQuestions?: string[];
	enableNotificationPasswordRecovery?: string[];
	enableReCaptchaForNotificationPasswordRecovery?: string[];
	enableReCaptchaForQuestionPasswordRecovery?: string[];
	enableReCaptchaForUsernameRecovery?: string[];
	enableSecurityQuestionPasswordRecovery?: string[];
	enableUsernameRecovery?: string[];
	notificationCheckBoxes?: string[];
	notificationInternallyManaged?: string[];
	passwordRecoveryMinAnswers?: string;
	reCaptchaMaxFailedAttempts?: string;
	recoveryLinkExpiryTime?: string;
	smsOTPExpiryTime?: string;
}
