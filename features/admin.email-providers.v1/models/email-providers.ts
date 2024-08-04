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
