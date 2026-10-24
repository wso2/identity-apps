/**
 * Copyright (c) 2026-2026, WSO2 LLC. (https://www.wso2.com).
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

import {
    ExpressionValueInterface,
    ListDataInterface,
    OperatorInterface
} from "@wso2is/admin.rules.v1/models/meta";

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
 * What a field is compared against: a literal given in the rule, or another field read when the rule
 * is evaluated.
 */
export interface ConditionValueInterface {
    /**
     * Whether the value is a `literal` given in the rule or another `field`.
     */
    type: "literal" | "field";
    /**
     * A list for `in` and `notIn`, a single value for every other operator.
     */
    literal?: string | string[];
    /**
     * The field whose value is used, when `type` is `field`.
     */
    field?: FieldReferenceInterface;
}

/**
 * A single comparison of a field against a value, or a check of the field alone.
 */
export interface AtomicConditionInterface {
    /**
     * The field being compared.
     */
    field: FieldReferenceInterface;
    /**
     * The comparison operator.
     */
    operator: string;
    /**
     * Absent for an operator that checks the field alone, such as `isBlank` or `isEmpty`.
     */
    value?: ConditionValueInterface;
}

/**
 * A group of atomic conditions that must all hold.
 */
export interface ExpressionConditionInterface {
    /**
     * How the conditions are combined. Always AND.
     */
    operator: "AND";
    /**
     * Conditions that must all hold.
     */
    conditions: AtomicConditionInterface[];
}

/**
 * A branch's rule, as the flow API carries it: it holds when any one of its conditions holds.
 */
export interface BranchRuleInterface {
    /**
     * How the condition groups are combined. Always OR.
     */
    operator: "OR";
    /**
     * Condition groups, any one of which makes the rule hold.
     */
    conditions: ExpressionConditionInterface[];
}

/**
 * A field a condition in a flow can be written against, as the flow metadata publishes it.
 */
export interface RuleFieldDefinitionInterface {
    /**
     * The field, with its name and display name.
     */
    field: ListDataInterface & {
        /**
         * How a value within the field is picked. Absent on a field that names a single value.
         */
        qualifier?: ExpressionValueInterface;
    };
    /**
     * The operators the field supports.
     */
    operators: OperatorInterface[];
    /**
     * How the field's value is entered, as a literal or read from another field.
     */
    value: {
        /**
         * How a literal is entered.
         */
        literal?: ExpressionValueInterface;
        /**
         * The fields a value may be read from. Absent when only literals are allowed.
         */
        field?: {
            /**
             * Names of the fields the value may be read from.
             */
            names: string[];
        };
    };
}
