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
    ConditionExpressionMetaInterface,
    ConditionExpressionsMetaDataInterface,
    OperatorInterface
} from "@wso2is/admin.rules.v1/models/meta";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionWithoutIdInterface,
    RuleConditionWithoutIdInterface,
    RuleWithoutIdInterface
} from "@wso2is/admin.rules.v1/models/rules";
import { getValueInput, isListOperator, isValueLessOperator } from "@wso2is/admin.rules.v1/utils/operators";
import {
    AtomicConditionInterface,
    ConditionValueInterface,
    ExpressionConditionInterface,
    FieldReferenceInterface,
    BranchRuleInterface,
    RuleFieldDefinitionInterface
} from "../models/rule-expression";

/**
 * Names a field, leaving out a qualifier that is empty rather than sending it as one.
 *
 * @param name      - The field name.
 * @param qualifier - The qualifier, if any.
 * @returns The field reference.
 */
const toFieldReference = (name: string, qualifier?: string): FieldReferenceInterface =>
    qualifier ? { name, qualifier } : { name };

/**
 * Indexes the operators each field publishes by the field's name, so that what an operator takes is read from the
 * server rather than from its name alone.
 *
 * @param metadata - The rule metadata as the flow metadata publishes it.
 * @returns The published operators by field name.
 */
const toOperatorsByField = (metadata: RuleFieldDefinitionInterface[]): Map<string, OperatorInterface[]> =>
    new Map((metadata ?? []).map((definition: RuleFieldDefinitionInterface): [ string, OperatorInterface[] ] =>
        [ definition.field?.name, definition.operators ]));

/**
 * Puts an atomic condition in the shape the rule editor holds.
 *
 * @param condition - The atomic condition as the flow API carries it.
 * @param operators - The operators the condition's field publishes, if known.
 * @returns The editor's expression.
 */
const toEditorCondition = (
    condition: AtomicConditionInterface,
    operators?: OperatorInterface[]
): ConditionExpressionWithoutIdInterface => {
    const base: ConditionExpressionWithoutIdInterface = {
        field: condition?.field?.name ?? "",
        ...(condition?.field?.qualifier !== undefined && { qualifier: condition.field.qualifier }),
        operator: condition?.operator ?? ""
    };
    const value: ConditionValueInterface = condition?.value;

    if (isValueLessOperator(base.operator, operators) && !value) {
        // An operator that checks the field alone takes no value.
        return base;
    }

    if (value?.type === "field") {
        return { ...base, valueField: value.field?.name ?? "", valueFieldQualifier: value.field?.qualifier ?? "" };
    }

    if (isListOperator(base.operator, operators)) {
        return { ...base, values: Array.isArray(value?.literal) ? value.literal.map(String) : [] };
    }

    return {
        ...base,
        value: value?.literal === undefined || value?.literal === null || Array.isArray(value.literal)
            ? ""
            : String(value.literal)
    };
};

/**
 * Puts a branch's rule in the shape the rule editor holds.
 *
 * @param expression - The rule as the flow API carries it.
 * @param metadata   - The rule metadata as the flow metadata publishes it.
 * @returns The editor's rule, or undefined for the default branch.
 */
export const toEditorRule = (
    expression: BranchRuleInterface,
    metadata?: RuleFieldDefinitionInterface[]
): RuleWithoutIdInterface | undefined => {
    if (!expression) {
        return undefined;
    }

    const operatorsByField: Map<string, OperatorInterface[]> = toOperatorsByField(metadata);

    return {
        condition: AdjoiningOperatorTypes.Or,
        // The editor gives every condition and expression its ids as it loads, so none are made up here.
        rules: (expression.conditions ?? []).map(
            (condition: ExpressionConditionInterface): RuleConditionWithoutIdInterface => ({
                condition: AdjoiningOperatorTypes.And,
                expressions: (condition.conditions ?? []).map((atomic: AtomicConditionInterface) =>
                    toEditorCondition(atomic, operatorsByField.get(atomic?.field?.name)))
            }) as RuleConditionWithoutIdInterface)
    } as RuleWithoutIdInterface;
};

/**
 * Puts what the rule editor holds in the shape the flow API carries.
 *
 * @param rule     - The editor's rule.
 * @param metadata - The rule metadata as the flow metadata publishes it.
 * @returns The rule, or undefined for the default branch.
 */
export const fromEditorRule = (
    rule: RuleWithoutIdInterface,
    metadata?: RuleFieldDefinitionInterface[]
): BranchRuleInterface | undefined => {
    if (!rule) {
        return undefined;
    }

    const operatorsByField: Map<string, OperatorInterface[]> = toOperatorsByField(metadata);

    return {
        conditions: (rule.rules ?? []).map((condition: RuleConditionWithoutIdInterface): ExpressionConditionInterface => ({
            conditions: (condition.expressions ?? []).map(
                (expression: ConditionExpressionWithoutIdInterface): AtomicConditionInterface => ({
                    field: toFieldReference(expression.field, expression.qualifier),
                    operator: expression.operator,
                    ...(!isValueLessOperator(expression.operator, operatorsByField.get(expression.field)) && {
                        value: expression.valueField !== undefined
                            ? {
                                field: toFieldReference(expression.valueField, expression.valueFieldQualifier),
                                type: "field"
                            }
                            : {
                                literal: isListOperator(expression.operator, operatorsByField.get(expression.field))
                                    ? (expression.values ?? [])
                                    : (expression.value ?? ""),
                                type: "literal"
                            }
                    })
                })),
            operator: "AND"
        })),
        operator: "OR"
    };
};

/**
 * Puts the flow's rule metadata in the shape the rule editor reads.
 *
 * @param definitions - The rule metadata as the flow metadata publishes it.
 * @returns The editor's metadata, or undefined when the flow publishes none.
 */
export const toEditorMetadata = (
    definitions: RuleFieldDefinitionInterface[]
): ConditionExpressionsMetaDataInterface | undefined => {
    if (!definitions) {
        return undefined;
    }

    return definitions.map((definition: RuleFieldDefinitionInterface): ConditionExpressionMetaInterface => ({
        field: { displayName: definition.field?.displayName, name: definition.field?.name },
        ...(definition.field?.qualifier && { qualifier: definition.field.qualifier }),
        operators: definition.operators,
        value: definition.value?.literal,
        ...(definition.value?.field?.names?.length > 0 && { valueFieldNames: definition.value.field.names })
    }));
};

/**
 * Whether a field reference names a field, and the qualifier that field needs to pick a value.
 *
 * @param reference   - The field reference.
 * @param definitions - The rule metadata by field name, empty when the flow publishes none.
 * @returns True when the reference is complete.
 */
const isReferenceComplete = (
    reference: FieldReferenceInterface,
    definitions: Map<string, RuleFieldDefinitionInterface>
): boolean => {
    if (!reference?.name?.trim()) {
        return false;
    }

    // A field that picks one of a family of values -- a claim -- needs to say which.
    return !definitions.get(reference.name)?.field?.qualifier || !!reference.qualifier?.trim();
};

/**
 * Whether an atomic condition has everything the server needs: a field (and its qualifier where the field
 * takes one), an operator, and a value -- a non-empty literal, or a complete reference to another field.
 * An operator that checks the field alone needs no value, and must have none.
 *
 * @param condition   - The atomic condition.
 * @param definitions - The rule metadata by field name, empty when the flow publishes none.
 * @returns True when the condition is complete.
 */
const isConditionComplete = (
    condition: AtomicConditionInterface,
    definitions: Map<string, RuleFieldDefinitionInterface>
): boolean => {
    if (!isReferenceComplete(condition?.field, definitions) || !condition?.operator?.trim()) {
        return false;
    }

    const value: ConditionValueInterface = condition.value;

    if (getValueInput(condition.operator, definitions.get(condition.field.name)?.operators) === "none") {
        return value === undefined || value === null;
    }

    if (value?.type === "field") {
        return isReferenceComplete(value.field, definitions);
    }

    if (Array.isArray(value?.literal)) {
        return value.literal.length > 0;
    }

    return value?.literal !== undefined && value?.literal !== null && String(value.literal).trim() !== "";
};

/**
 * Whether a branch's rule is complete: it has at least one condition, and every condition in it is complete.
 *
 * @param expression - The rule, or undefined for the default branch, which needs none.
 * @param metadata   - The rule metadata as the flow metadata publishes it.
 * @returns True when the expression can be saved.
 */
export const isRuleComplete = (
    expression: BranchRuleInterface,
    metadata: RuleFieldDefinitionInterface[]
): boolean => {
    if (!expression) {
        return true;
    }

    const definitions: Map<string, RuleFieldDefinitionInterface> = new Map(
        (metadata ?? []).map((definition: RuleFieldDefinitionInterface) => [ definition.field?.name, definition ])
    );
    const conditions: AtomicConditionInterface[] = (expression.conditions ?? []).flatMap(
        (condition: ExpressionConditionInterface) => condition.conditions ?? []);

    return conditions.length > 0
        && conditions.every((condition: AtomicConditionInterface) => isConditionComplete(condition, definitions));
};
