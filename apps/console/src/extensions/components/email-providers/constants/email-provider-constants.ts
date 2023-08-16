/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentityAppsError } from "@wso2is/core/errors";

export class EmailProviderConstants {

    private constructor() { }
    
    public static readonly EMAIL_PROVIDER_CONFIG_NAME: string = "EmailPublisher";
    public static readonly REPLY_TO_ADDRESS_KEY: string = "mail.smtp.replyTo";
    public static readonly SIGNATURE_KEY: string = "mail.smtp.signature";

	public static readonly EMAIL_PROVIDER_CONFIG_FETCH_ERROR_CODE: string = "ASG-EPC-00001";
    public static readonly EMAIL_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-EPC-00002";
	public static readonly EMAIL_PROVIDER_CONFIG_UPDATE_ERROR_CODE: string = "ASG-EP-00003";
	public static readonly EMAIL_PROVIDER_CONFIG_DELETE_ERROR_CODE: string = "ASG-EP-60004";
    public static readonly EMAIL_PROVIDER_CONFIG_NOT_FOUND_ERROR_CODE: string = "NSM-60006";

    public static readonly EMAIL_PROVIDER_CONFIG_FIELD_MIN_LENGTH: number = 0;
    public static readonly EMAIL_PROVIDER_CONFIG_FIELD_MAX_LENGTH: number = 100;
    public static readonly EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	public static ErrorMessages: {
        EMAIL_PROVIDER_CONFIG_FETCH_ERROR_CODE: IdentityAppsError;
        EMAIL_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: IdentityAppsError;
        EMAIL_PROVIDER_CONFIG_UPDATE_ERROR_CODE: IdentityAppsError;
        EMAIL_PROVIDER_CONFIG_DELETE_ERROR_CODE: IdentityAppsError;
    } = {
        EMAIL_PROVIDER_CONFIG_DELETE_ERROR_CODE: new IdentityAppsError(
            EmailProviderConstants.EMAIL_PROVIDER_CONFIG_DELETE_ERROR_CODE,
            "An error occurred while deleting the email provider configurations.",
            "Error while deleting email provider configurations",
            null
        ),
        EMAIL_PROVIDER_CONFIG_FETCH_ERROR_CODE: new IdentityAppsError(
            EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FETCH_ERROR_CODE,
            "An error occurred while fetching the email provider configurations.",
            "Error while fetching the email provider configurations",
            null
        ),
        EMAIL_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE: new IdentityAppsError(
            EmailProviderConstants.EMAIL_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
            "Received an invalid status code while fetching the email provider configurations.",
            "Invalid Status Code while fetching the email provider configurations",
            null
        ),
        EMAIL_PROVIDER_CONFIG_UPDATE_ERROR_CODE: new IdentityAppsError(
            EmailProviderConstants.EMAIL_PROVIDER_CONFIG_UPDATE_ERROR_CODE,
            "An error occurred while updating the email provider configurations.",
            "Error while updating the email provider configurations",
            null
        )
    };
}
