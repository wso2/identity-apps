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
import { FunctionComponent, SVGProps } from "react";

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
    provider?: string;
    providerURL?: string;
    smtpServerHost?: string;
    smtpPort?: number;
    fromAddress?: string;
    userName?: string;
    password?: string;
    authType?: string;
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
    authType?: string;
    clientId?: string;
    clientSecret?: string;
    tokenEndpoint?: string;
    scopes?: string;
    header?: string;
    value?: string;
    accessToken?: string;
}

export interface EmailProviderConfigFormErrorValidationsInterface {
    smtpServerHost?: string;
    smtpPort?: string;
    fromAddress?: string;
    replyToAddress?: string;
    userName?: string;
    password?: string;
    displayName?: string;
    authType?: string;
    clientId?: string;
    clientSecret?: string;
    tokenEndpoint?: string;
    scopes?: string;
    header?: string;
    value?: string;
    accessToken?: string;
}

/**
 * Enum for HTTP email provider authentication types.
 */
export enum AuthType {
    NONE = "NONE",
    BASIC = "BASIC",
    CLIENT_CREDENTIAL = "CLIENT_CREDENTIAL",
    BEARER = "BEARER",
    API_KEY = "API_KEY"
}

/**
 * Interface for the HTTP email provider auth type dropdown options.
 */
export interface HTTPEmailAuthDropdownChild {
    key: AuthType;
    text: string;
    value: AuthType;
}

/**
 * The interface for the HTTP-based email provider form values.
 */
export interface HTTPEmailProviderFormInterface {
    providerURL?: string;
    contentType?: string;
    httpMethod?: string;
    headers?: string;
    body?: string;
    authType?: AuthType;
    userName?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    tokenEndpoint?: string;
    scopes?: string;
    accessToken?: string;
    apiKeyHeader?: string;
    apiKeyValue?: string;
}

export interface HTTPEmailProviderFormErrorValidationsInterface {
    providerURL?: string;
    contentType?: string;
    httpMethod?: string;
    body?: string;
    authType?: string;
    userName?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    tokenEndpoint?: string;
    scopes?: string;
    accessToken?: string;
    apiKeyHeader?: string;
    apiKeyValue?: string;
}

/**
 * Interface for email provider card (SMTP / HTTP).
 */
export interface EmailProviderCardInterface {
    id: number;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    key: string;
    name: string;
}

/**
 * Prop-types for the email provider config page component.
 */
export type EmailProvidersPageInterface = IdentifiableComponentInterface
