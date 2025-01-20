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

export interface AttributeDTO {
    attributeValue: string;
    attributeDataType: string;
    attributeId: string;
    attributeCategory: string;
}

export interface PolicyInterface {
    policy: string;
    policyId: string;
    active: boolean;
    promote: boolean;
    policyType: string;
    policyEditor: string | null;
    policyEditorData: any[];
    policyOrder: number;
    version: string;
    lastModifiedTime: string;
    lastModifiedUser: string | null;
    attributeDTOs: AttributeDTO[];
    policySetIdReferences: string[];
    policyIdReferences: string[];
}

export interface PolicyListInterface {
    policySet: PolicyInterface[];
    "numberOfPages": number;
}

export interface PolicyAlgorithmRequestInterface {
    policyCombiningAlgorithm: string;
}

export type AlgorithmResponseInterface = string;

export interface AlgorithmOption {
    value: number;
    label: string;
    description: string;
}

export interface PublishPolicyDataInterface {
    policyIds: string[];
    subscriberIds: string[];
    action: string;
    enable: boolean;
    order: number;
}
