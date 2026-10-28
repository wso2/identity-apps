/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

export type DevicePlatformType = "android" | "ios" | "macos" | "windows";

export interface DevicePolicyExpressionValueInterface {
    type: string;
    value: string;
}

export interface DevicePolicyExpressionInterface {
    field: string;
    operator: string;
    value: DevicePolicyExpressionValueInterface;
}

export interface DevicePolicyRuleGroupInterface {
    expressions: DevicePolicyExpressionInterface[];
}

export interface DevicePolicyRuleInterface {
    rules: DevicePolicyRuleGroupInterface[];
}

/**
 * A policy holds one resource per device platform. `target` is the platform.
 */
export interface DevicePolicyResourceInterface {
    target: string;
    resourceType: "RULE" | "ACTION";
    rule?: DevicePolicyRuleInterface;
}

export interface DevicePolicyInterface {
    id: string;
    name: string;
    type: string;
    resources?: DevicePolicyResourceInterface[];
}

export interface DevicePolicyListItemInterface {
    id: string;
    name: string;
    type: string;
    self?: string;
}

export interface DevicePolicyListResponseInterface {
    totalResults: number;
    startIndex: number;
    count: number;
    policies: DevicePolicyListItemInterface[];
}

export interface DevicePolicyExpressionRequestInterface {
    field: string;
    operator: string;
    value: string;
}

export interface DevicePolicyRuleGroupRequestInterface {
    condition: "AND";
    expressions: DevicePolicyExpressionRequestInterface[];
}

export interface DevicePolicyRuleRequestInterface {
    condition: "OR";
    rules: DevicePolicyRuleGroupRequestInterface[];
}

export interface DevicePolicyResourceRequestInterface {
    target: string;
    resourceType: "RULE";
    rule: DevicePolicyRuleRequestInterface;
}

export interface DevicePolicyCreateRequestInterface {
    name: string;
    type: string;
    resources: DevicePolicyResourceRequestInterface[];
}

export interface DevicePolicyUpdateRequestInterface {
    resources: DevicePolicyResourceRequestInterface[];
}
