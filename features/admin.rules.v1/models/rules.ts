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
 * Enum to represent the rule condition types.
 */
export enum AdjoiningOperatorTypes {
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
 * Interface to represent the condition expression data.
 */
export interface ConditionExpressionInterface {
    id: string;
    field: string;
    operator: string;
    value: string;
}

/**
 * Interface to represent the condition expressions data.
 */
export type ConditionExpressionsInterface = ConditionExpressionInterface[];

/**
 * Interface to represent the rule condition data.
 */
export interface RuleConditionInterface {
    id: string;
    condition: string;
    expressions: ConditionExpressionsInterface;
}

/**
 * Interface to represent the rule conditions data.
 */
export type RuleConditionsInterface = RuleConditionInterface[];

/**
 * Interface to represent the rule data.
 */
export interface RuleInterface {
    condition: string;
    id: string;
    rules: RuleConditionsInterface;
    execution?: string;
}

/**
 * Interface to represent the rules data.
 */
export type RulesInterface = RuleInterface[];

/**
 * Interface to represent the rules execution data.
 */
export interface RuleExecuteCollectionInterface {
    fallbackExecution?: string;
    rules: RulesInterface;
}

/**
 * Interface to represent the condition expressions data without `id`.
 */
export type ConditionExpressionWithoutIdInterface = Omit<ConditionExpressionInterface, "id">;

/**
 * Interface to represent the rule condition data without `id`.
 */
export type RuleConditionWithoutIdInterface = Omit<RuleConditionInterface, "id"> & {
    expressions: ConditionExpressionWithoutIdInterface[];
};

/**
 * Interface to represent the rule data without `id`.
 */
export type RuleWithoutIdInterface = Omit<RuleInterface, "id"> & {
    rules: RuleConditionWithoutIdInterface[];
};

/**
 * Interface to represent the rules data without `id`.
 */
export type RulesWithoutIdInterface = RuleWithoutIdInterface[];

/**
 * Interface to represent the rules execution data without `id`.
 */
export interface RuleExecuteCollectionWithoutIdInterface {
    fallbackExecution?: string;
    rules: RulesWithoutIdInterface;
}
