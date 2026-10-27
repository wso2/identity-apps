/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
    Qualifier = "qualifier",
    Operator = "operator",
    Value = "value",
    Values = "values",
    /**
     * Switches where the value comes from: `literal` for one entered in the rule, `field` for one read
     * from another field.
     */
    ValueSource = "valueSource",
    ValueField = "valueField",
    ValueFieldQualifier = "valueFieldQualifier"
}

/**
 * Interface to represent the condition expression data.
 */
export interface ConditionExpressionInterface {
    id: string;
    field: string;
    /**
     * Selects one value within a field that names a family of them -- a claim URI, for instance.
     */
    qualifier?: string;
    operator: string;
    /**
     * The single value compared against. Absent for `in` and `notIn`, which carry `values`, and for an
     * operator that checks the field alone, such as `isBlank`, which takes no value.
     */
    value?: string;
    /**
     * The set of values for `in` and `notIn`. Absent for every other operator.
     */
    values?: string[];
    /**
     * The field the value is read from, for a value read from another field rather than entered.
     * Present, possibly empty while it is being chosen, exactly when the value comes from a field;
     * `value` and `values` are then absent.
     */
    valueField?: string;
    /**
     * Picks a value within `valueField`, for a field that names a family of values.
     */
    valueFieldQualifier?: string;
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
    isRuleInstanceTouched?: boolean;
}

/**
 * Interface to represent the rules data.
 */
type RulesInterface = RuleInterface[];

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
export type RuleConditionWithoutIdInterface = Omit<RuleConditionInterface, "id" | "expressions"> & {
    expressions: ConditionExpressionWithoutIdInterface[];
};

/**
 * Interface to represent the rule data without `id`.
 */
export type RuleWithoutIdInterface = Omit<RuleInterface, "id" | "rules"> & {
    rules: RuleConditionWithoutIdInterface[];
};

/**
 * Interface to represent the rules data without `id`.
 */
type RulesWithoutIdInterface = RuleWithoutIdInterface[];

/**
 * Interface to represent the rules execution data without `id`.
 */
export interface RuleExecuteCollectionWithoutIdInterface {
    fallbackExecution?: string;
    rules: RulesWithoutIdInterface;
}

/**
 * A field, and for a field that names a family of values, the qualifier that picks one.
 */
export interface FieldReferenceInterface {
    /**
     * Name of the field.
     */
    name: string;
    /**
     * Picks a value within the field, such as a claim URI. Absent for a field that names a single value.
     */
    qualifier?: string;
}

/**
 * What a condition compares its field with: a literal entered in the rule, or another field read when
 * the rule is evaluated.
 */
export type ConditionValueType =
    | { type: "literal"; literal: string }
    | { type: "field"; field: FieldReferenceInterface };

/**
 * A field a condition's value may be read from, as the value input offers it.
 */
export interface FieldOptionInterface {
    /**
     * Name of the field.
     */
    name: string;
    /**
     * Label shown for the field.
     */
    label: string;
    /**
     * The values a field that names a family of them can pick from -- its claims, for instance. Absent on
     * a field that names a single value, which takes no qualifier.
     */
    qualifiers?: QualifierOptionInterface[];
    /**
     * Whether the qualifier is typed in rather than picked, for a field that publishes no list of them.
     */
    isQualifierTyped?: boolean;
}

/**
 * One value within a field, as the value input offers it.
 */
export interface QualifierOptionInterface {
    /**
     * What is saved.
     */
    value: string;
    /**
     * What is shown.
     */
    label: string;
    /**
     * Data type of the values the qualifier names, used to offer only compatible ones.
     */
    dataType?: string;
}

/**
 * A known literal the value input offers, for a field whose values form a known set.
 */
export interface LiteralOptionInterface {
    /**
     * What is saved.
     */
    value: string;
    /**
     * What is shown.
     */
    label: string;
}
