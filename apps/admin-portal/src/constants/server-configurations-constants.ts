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

export class ServerConfigurationsConstants {

	/**
	 * Private constructor to avoid object instantiation from outside the class.
	 *
	 * @hideconstructor
	 */
	/* eslint-disable @typescript-eslint/no-empty-function */
	private constructor() { }

	/**
	 * UUID of the identity governance account management policies category.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID: string =
		"QWNjb3VudCBNYW5hZ2VtZW50IFBvbGljaWVz";

	/**
	 * UUID of the identity governance self sign up connector.
	 *
	 * @constant
	 * @type {string}
	 */
	public static readonly SELF_SIGN_UP_CONNECTOR_ID: string = "c2VsZi1zaWduLXVw";

	/**
	 * Self registration API Keywords constants.
	 */
	public static readonly SELF_REGISTRATION_ENABLE: string = "SelfRegistration.Enable";
	public static readonly ACCOUNT_LOCK_ON_CREATION: string = "SelfRegistration.LockOnCreation";
	public static readonly SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED: string =
		"SelfRegistration.Notification.InternallyManage";
	public static readonly RE_CAPTCHA: string = "SelfRegistration.ReCaptcha";
	public static readonly VERIFICATION_CODE_EXPIRY_TIME: string = "SelfRegistration.VerificationCode.ExpiryTime";
	public static readonly SMS_OTP_EXPIRY_TIME: string = "SelfRegistration.VerificationCode.SMSOTP.ExpiryTime";
	public static readonly CALLBACK_REGEX: string = "SelfRegistration.CallbackRegex";
}
