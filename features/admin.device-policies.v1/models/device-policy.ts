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

export interface PolicyExpressionInterface {
    field: string;
    operator: string;
    value: string;
}

export interface PolicyRuleInterface {
    condition: "AND" | "OR";
    expressions: PolicyExpressionInterface[];
}

export interface PolicyResourceRequestInterface {
    target: string;
    resourceType?: "RULE" | "ACTION";
    rule: PolicyRuleInterface;
}

export interface PolicyRequestInterface {
    name: string;
    resources: PolicyResourceRequestInterface[];
}

export interface DevicePolicyExpressionValueInterface {
    type: string;
    value: string;
}

export interface DevicePolicyExpressionInterface {
    field: string;
    displayName: string;
    operator: string;
    value: DevicePolicyExpressionValueInterface;
}

export interface DevicePolicyRuleGroupInterface {
    expressions: DevicePolicyExpressionInterface[];
}

export interface DevicePolicyFullRuleInterface {
    rules: DevicePolicyRuleGroupInterface[];
}

export interface PolicyResourceResponseInterface {
    id: string;
    target: string;
    resourceType: "RULE" | "ACTION";
    resourceId: string;
    rule?: DevicePolicyFullRuleInterface;
}

export interface DevicePolicyResponseInterface {
    id: string;
    name: string;
    resources?: PolicyResourceResponseInterface[];
}

export interface PolicyListItemInterface {
    id: string;
    name: string;
    self?: string;
}

export interface PolicyListLinkInterface {
    href: string;
    rel: string;
}

export interface PolicyListResponseInterface {
    totalResults: number;
    startIndex: number;
    count: number;
    policies: PolicyListItemInterface[];
    links?: PolicyListLinkInterface[];
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
