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

import { ConditionExpressionInterface, ConditionValueType, ExpressionFieldTypes } from "../models/rules";

/**
 * One edit to an expression, as `applyExpressionChange` takes it.
 */
export interface ExpressionChangeInterface {
    /**
     * The part of the expression that changes.
     */
    fieldName: ExpressionFieldTypes;
    /**
     * The new value of that part.
     */
    value: string;
}

/**
 * Reads an expression's value as the value input shows it.
 *
 * @param expression - The expression.
 * @returns A field reference when the value is read from a field, otherwise the literal.
 */
export const toConditionValue = (expression: ConditionExpressionInterface): ConditionValueType => {
    if (expression.valueField !== undefined) {
        return {
            field: {
                name: expression.valueField,
                ...(expression.valueFieldQualifier && { qualifier: expression.valueFieldQualifier })
            },
            type: "field"
        };
    }

    return { literal: expression.value ?? "", type: "literal" };
};

/**
 * The edits that give an expression the value the value input chose.
 *
 * @param expression - The expression being edited.
 * @param next       - The value chosen.
 * @returns The edits, in the order they are applied.
 */
export const toExpressionChanges = (
    expression: ConditionExpressionInterface,
    next: ConditionValueType
): ExpressionChangeInterface[] => {
    const readsField: boolean = expression.valueField !== undefined;
    const changes: ExpressionChangeInterface[] = [];

    if (next.type === "field") {
        if (!readsField) {
            changes.push({ fieldName: ExpressionFieldTypes.ValueSource, value: "field" });
        }
        // A new field clears the qualifier, so the qualifier is set after it.
        changes.push({ fieldName: ExpressionFieldTypes.ValueField, value: next.field.name });
        if (next.field.qualifier) {
            changes.push({ fieldName: ExpressionFieldTypes.ValueFieldQualifier, value: next.field.qualifier });
        }

        return changes;
    }

    if (readsField) {
        changes.push({ fieldName: ExpressionFieldTypes.ValueSource, value: "literal" });
    }
    changes.push({ fieldName: ExpressionFieldTypes.Value, value: next.literal });

    return changes;
};
