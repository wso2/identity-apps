/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

export interface DeviceResponseInterface {
    id: string;
    userId: string;
    userName?: string;
    deviceName: string;
    deviceModel: string;
    status: string;
    registeredAt: string;
}

export interface DevicePatchRequestInterface {
    deviceName: string;
}

export interface PolicyExpressionInterface {
    field: string;
    operator: string;
    value: string | number | boolean;
}

export interface PolicyRuleInterface {
    condition: "AND" | "OR";
    expressions: PolicyExpressionInterface[];
}

export interface DevicePolicyRequestInterface {
    name: string;
    rule: PolicyRuleInterface;
}

export interface DevicePolicyResponseInterface {
    id: string;
    name: string;
    ruleId?: string;
}

export type DevicePlatformType = "android" | "ios" | "macos" | "windows";

export interface DevicePolicyMetadataValueOptionInterface {
    name: string;
    displayName: string;
}

export interface DevicePolicyFieldDefinitionInterface {
    field: {
        name: string;
        displayName: string;
    };
    operators: {
        name: string;
        displayName: string;
    }[];
    value: {
        inputType: "INPUT" | "OPTIONS";
        valueType: "STRING" | "NUMBER" | "BOOLEAN";
        values?: DevicePolicyMetadataValueOptionInterface[];
    };
}
