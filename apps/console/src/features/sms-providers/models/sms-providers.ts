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

export interface SMSProviderAPIResponseInterface {
    name: string;
    provider: string;
    providerURL: string;
    key: string;
    secret: string;
    sender: string;
    contentType: string;
    properties: SMSProviderPropertiesInterface[];
}

export interface SMSProviderPropertiesInterface {
    key: string;
    value: string;
}

export interface SMSProviderPropertiesObjectInterface {
    [key: string]: string;
}

export interface SMSProviderInterface {
    name: string;
    provider?: string;
    providerURL?: string;
    key?: string;
    twilioKey?: string;
    vonageKey?: string;
    secret?: string;
    twilioSecret?: string;
    vonageSecret?: string;
    sender?: string;
    twilioSender?: string;
    vonageSender?: string;
    contentType?: ContentType;
    headers?: string;
    payload?: string;
    httpMethod?: string;
}

export interface SMSProviderAPIInterface {
    name?: string;
    provider: string;
    providerURL?: string;
    key: string;
    secret: string;
    sender: string;
    contentType: string;
    properties: SMSProviderPropertiesInterface[];
}

export interface SMSProviderSettingsState {
    selectedProvider: string | null;
    providerParams: {
        [key: string]: SMSProviderInterface;
    };
}

export enum ContentType {
    JSON = "JSON",
    FORM = "FORM"
}

export interface SMSProviderConfigFormErrorValidationsInterface {
    provider?: string;
    providerURL?: string;
    payload?: string;
    key?: string;
    secret?: string;
    sender?: string;
    contentType?: string;
    twilioKey?: string;
    twilioSecret?: string;
    twilioSender?: string;
    vonageKey?: string;
    vonageSecret?: string;
    vonageSender?: string;
}

export interface SMSProviderCardInterface {
    id: number,
    key: string,
    name: string,
    icon: any
}
