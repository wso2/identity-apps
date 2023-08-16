/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";

/**
 * The interface of the email provider config properties attribute.
 */
export interface EmailProviderConfigPropertiesInterface {
    key: string;
    value: string;
}

/**
 * The interface of the API response for email provider config editing.
 */
export interface EmailProviderConfigAPIResponseInterface {
    name?: string;
    smtpServerHost?: string;
    smtpPort?: number;
    fromAddress?: string;
    userName?: string;
    password?: string;
    properties?: EmailProviderConfigPropertiesInterface[];
}

/**
 * The interface for email provider config form.
 */
export interface EmailProviderConfigFormValuesInterface {
    smtpServerHost?: string;
    smtpPort?: number;
    fromAddress?: string;
    userName?: string;
    password?: string;
    displayName?: string;
    replyToAddress?: string;
}

export interface EmailProviderConfigFormErrorValidationsInterface {
    smtpServerHost?: string;
    smtpPort?: string;
    fromAddress?: string;
    replyToAddress?: string;
    userName?: string;
    password?: string;
    displayName?: string;
}

/**
 * Prop-types for the email provider config page component.
 */
export type EmailProvidersPageInterface = IdentifiableComponentInterface
