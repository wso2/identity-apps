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

import { IdentityAppsError } from "@wso2is/core/errors";

export class SMSProviderConstants {

    private constructor() { }

    public static readonly SMS_PROVIDER_CONFIG_NAME: string = "SMSPublisher";
    public static readonly TWILIO_SMS_PROVIDER: string = "TwilioSMSProvider";
    public static readonly TWILIO: string = "Twilio";
    public static readonly VONAGE_SMS_PROVIDER: string = "VonageSMSProvider";
    public static readonly VONAGE: string = "Vonage";
    public static readonly CUSTOM_SMS_PROVIDER: string = "CustomSMSProvider";
    public static readonly CUSTOM: string = "Custom";

	public static readonly SMS_PROVIDER_CONFIG_FETCH_ERROR_CODE: string = "ASG-SPC-00001";
    public static readonly SMS_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-SPC-00002";
	public static readonly SMS_PROVIDER_CONFIG_UPDATE_ERROR_CODE: string = "ASG-SP-00003";
	public static readonly SMS_PROVIDER_CONFIG_DELETE_ERROR_CODE: string = "ASG-SP-60004";
    public static readonly SMS_PROVIDER_CONFIG_NOT_FOUND_ERROR_CODE: string = "NSM-60006";
    public static readonly SMS_PROVIDER_CONFIG_UNABLE_TO_DISABLE_ERROR_CODE: string = "NSM-60008";

    public static readonly SMS_PROVIDER_CONFIG_FIELD_MIN_LENGTH: number = 0;
    public static readonly SMS_PROVIDER_CONFIG_FIELD_MAX_LENGTH: number = 100;
    public static readonly SMS_PROVIDER_CONFIG_TEMPLATE_FIELD_MAX_LENGTH: number = 1020;
    public static readonly SMS_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	public static ErrorMessages: {
        SMS_PROVIDER_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
        SMS_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
        SMS_PROVIDER_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
        SMS_PROVIDER_CONFIG_DELETE_ERROR_CODE: IdentityAppsError;
    } = {
        SMS_PROVIDER_CONFIG_DELETE_ERROR_CODE: new IdentityAppsError(
            SMSProviderConstants.SMS_PROVIDER_CONFIG_DELETE_ERROR_CODE,
            "An error occurred while deleting the sms provider configurations.",
            "Error while deleting sms provider configurations",
            null
        ),
        SMS_PROVIDER_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
            SMSProviderConstants.SMS_PROVIDER_CONFIG_FETCH_ERROR_CODE,
            "An error occurred while fetching the sms provider configurations.",
            "Error while fetching the sms provider configurations",
            null
        ),
        SMS_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
            SMSProviderConstants.SMS_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
            "Received an invalid status code while fetching the sms provider configurations.",
            "Invalid Status Code while fetching the sms provider configurations",
            null
        ),
        SMS_PROVIDER_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
            SMSProviderConstants.SMS_PROVIDER_CONFIG_UPDATE_ERROR_CODE,
            "An error occurred while updating the sms provider configurations.",
            "Error while updating the sms provider configurations",
            null
        )
    };
}
