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

/**
 * Configuration Model
 */
export interface ConfigurationModel {
    authenticators: AuthenticatorStruct[];
    cors: CorsStruct;
    homeRealmIdentifiers: string[];
    idleSessionTimeoutPeriod: string;
    provisioning: ProvisioningStruct;
    rememberMePeriod: string;
}

/**
 * @desc A structural model of {@link ConfigurationModel}
 */
export interface ProvisioningStruct {
    inbound: {
        scim: {
            enableProxyMode: boolean;
        };
    };
}

/**
 * @desc A structural model of {@link ConfigurationModel}
 */
export interface AuthenticatorStruct {
    displayName: string;
    id: string;
    isEnabled: boolean;
    name: string;
    self: string;
    type: string;
}

/**
 * @desc A structural model of {@link ConfigurationModel}
 */
export interface CorsStruct {
    allowAnyOrigin: boolean;
    allowGenericHttpRequests: boolean;
    allowSubdomains: boolean;
    exposedHeaders: string[];
    maxAge: number;
    supportAnyHeader: boolean;
    supportedHeaders: string[];
    supportedMethods: string[];
    supportsCredentials: boolean;
}
