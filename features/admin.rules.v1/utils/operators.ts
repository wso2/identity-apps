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

import { OperatorInterface, OperatorValueInputType } from "../models/meta";

/**
 * Operators whose right-hand side is a set of values rather than one.
 */
const LIST_OPERATORS: string[] = [ "in", "notIn" ];

/**
 * Operators that check the field alone, so a condition using one takes no value.
 */
const VALUE_LESS_OPERATORS: string[] = [ "isBlank", "isNotBlank", "isEmpty", "isNotEmpty" ];

/**
 * Operators that check whether a multi-valued value has entries.
 */
const EMPTINESS_OPERATORS: string[] = [ "isEmpty", "isNotEmpty" ];

/**
 * Operators that check whether a single value is there.
 */
const BLANK_OPERATORS: string[] = [ "isBlank", "isNotBlank" ];

/**
 * Operators that order numbers as well as comparing them.
 */
const NUMERIC_OPERATORS: string[] = [ "equals", "notEquals", "greaterThan", "lessThan" ];

/**
 * Operators for everything compared as text, dates and booleans included.
 */
const TEXT_OPERATORS: string[] = [
    "equals", "notEquals", "contains", "notContains", "startsWith", "endsWith"
];

/**
 * What decides which operators a qualified value accepts, as the qualifier's resource describes it.
 */
export interface OperatorConstraintsInterface {
    /**
     * Whether the qualifier names a value that holds more than one value.
     */
    multiValued?: boolean;
    /**
     * Data type of the value the qualifier names.
     */
    dataType?: string;
}

/**
 * The value a condition using an operator takes.
 *
 * @param operator  - Operator name.
 * @param operators - Operators the field publishes, if at hand.
 * @returns `none`, `single` or `list`.
 */
export const getValueInput = (operator: string, operators?: OperatorInterface[]): OperatorValueInputType => {
    const published: OperatorValueInputType | undefined = operators?.find(
        (candidate: OperatorInterface) => candidate?.name === operator)?.valueInput;

    if (published) {
        return published;
    }
    if (VALUE_LESS_OPERATORS.includes(operator)) {
        return "none";
    }

    return LIST_OPERATORS.includes(operator) ? "list" : "single";
};

/**
 * Whether an operator compares against a set of values.
 *
 * @param operator  - Operator name.
 * @param operators - Operators the field publishes, if at hand.
 * @returns true for `in` and `notIn`.
 */
export const isListOperator = (operator: string, operators?: OperatorInterface[]): boolean =>
    getValueInput(operator, operators) === "list";

/**
 * Whether an operator checks the field alone, so a condition using it takes no value.
 *
 * @param operator  - Operator name.
 * @param operators - Operators the field publishes, if at hand.
 * @returns true for `isBlank`, `isNotBlank`, `isEmpty` and `isNotEmpty`.
 */
export const isValueLessOperator = (operator: string, operators?: OperatorInterface[]): boolean =>
    getValueInput(operator, operators) === "none";

/**
 * Narrows a field's operators to those the chosen qualifier actually supports.
 *
 * @param operators   - Operators the field publishes.
 * @param constraints - What the chosen qualifier's resource says about its values, if anything.
 * @returns The operators that apply.
 */
export const narrowOperators = (
    operators: OperatorInterface[],
    constraints?: OperatorConstraintsInterface
): OperatorInterface[] => {
    if (!operators || !constraints
        || (constraints.multiValued === undefined && constraints.dataType === undefined)) {
        return operators;
    }

    let allowed: string[] = [ ...TEXT_OPERATORS, ...BLANK_OPERATORS ];

    if (constraints.multiValued) {
        allowed = [ ...LIST_OPERATORS, ...EMPTINESS_OPERATORS ];
    } else if ([ "INTEGER", "DECIMAL" ].includes(constraints.dataType?.toUpperCase())) {
        allowed = [ ...NUMERIC_OPERATORS, ...BLANK_OPERATORS ];
    }

    return operators.filter((operator: OperatorInterface) => allowed.includes(operator.name));
};
