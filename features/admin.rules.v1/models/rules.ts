/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Enum to represent the rule executions.
 */
export enum RuleExecutions {
    PreIssueAccessToken = "PreIssueAccessToken",
    PrePasswordUpdate = "prePasswordUpdate",
    PreProfileUpdate = "preProfileUpdate",
    PreLogin = "preLogin",
    PostLogin = "postLogin",
    InLogin = "inLogin",
    PreRegistration = "preRegistration",
    InRegistration = "inRegistration",
    InPasswordExpiry = "inPasswordExpiry"
}

/**
 * Interface to represent the rule execution data.
 */
export interface ListDataInterface {
    name: string;
    displayName: string;
}

/**
 * Interface to represent the rule execution data.
 */
export interface LinkInterface {
    href: string;
    method: string;
    rel: string;
}

/**
 * Interface to represent the rule execution meta data.
 */
export interface RuleExecutionMetaDataInterface {
    id: string
    name: string
}

/**
 * Enum to represent the rule condition types.
 */
export enum ConditionTypes {
    And = "AND",
    Or = "OR"
}

/**
 * Enum to represent the rule expression field types.
 */
export enum ExpressionFieldTypes {
    Field = "field",
    Operator = "operator",
    Value = "value"
}

/**
 * Enum to represent the rule expression operators.
 */
export interface ExpressionInterface {
    id: string;
    field: string;
    operator: string;
    value: string;
    order: number;
}

/**
 * Interface to represent the rule conditions.
 */
export interface RuleConditionsInterface {
    id: string;
    condition: string;
    order: number;
    expressions: ExpressionInterface[];
}

/**
 * Interface to represent the rule instance.
 */
export interface RuleInterface {
    id: string;
    execution?: string
    conditions: RuleConditionsInterface[];
}

/**
 * Interface to represent the rule component data.
 */
export interface RuleComponentDataInterface {
    id: string;
    type: string;
    name: string;
    description: string;
    status: string,
    endpoint: {
        uri: string,
        authentication: {
            type: string
        }
    },
    rules: RuleInterface[];
}

/**
 * Interface to represent the value of a rule component.
 */
export interface RuleComponentExpressionValueInterface {
    inputType: "input" | "options";
    valueType: string;
    valueReferenceAttribute?: string;
    valueDisplayAttribute?: string;
    links?: LinkInterface[];
    values?: ListDataInterface[];
}

/**
 * Interface to represent the rule component meta.
 */
export interface RuleComponentMetaInterface {
    field: ListDataInterface,
    operators: ListDataInterface[],
    value: RuleComponentExpressionValueInterface;
}

/**
 * Interface to represent the rule component meta data.
 */
export type RuleComponentMetaDataInterface = RuleComponentMetaInterface[];
