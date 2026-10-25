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

import { SelectChangeEvent } from "@oxygen-ui/react/Select";
import React, { MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import RulesContext, { HiddenConfigurationInterface, RuleLimitsInterface } from "../contexts/rules-context";
import {
    ConditionExpressionMetaInterface,
    ConditionExpressionsMetaDataInterface,
    OperatorInterface,
    OperatorValueInputType,
    RuleExecutionMetaDataInterface
} from "../models/meta";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionInterface,
    ConditionExpressionsInterface,
    ExpressionFieldTypes,
    RuleConditionInterface,
    RuleExecuteCollectionInterface,
    RuleExecuteCollectionWithoutIdInterface,
    RuleInterface,
    RuleWithoutIdInterface
} from "../models/rules";
import addIds from "../utils/add-ids";
import cleanInstance from "../utils/clean-instance";
import { getValueInput } from "../utils/operators";

interface RuleContextRefInterface extends RuleExecuteCollectionInterface {
    isMultipleRules: boolean;
}

// Reference to hold the latest context value
const RuleContextRef: { ruleInstance: RuleContextRefInterface | undefined } = {
    ruleInstance: undefined
};

/**
 * Method to get the context value
 *
 * @returns RuleInstanceData
 */
const toRuleValue = (
    ruleInstance: RuleContextRefInterface
): RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface => {
    if (!ruleInstance) {
        return null;
    }

    // Check if the ruleInstance has multiple rules. An editor opened without initial data has none until they are
    // seeded, and is reported as having no value until then.
    if (ruleInstance.isMultipleRules) {
        if (!Array.isArray(ruleInstance.rules)) {
            return null;
        }

        // Return RuleExecuteCollectionWithoutIdInterface if there are multiple rules
        return cleanInstance(Object.freeze(ruleInstance) as RuleExecuteCollectionInterface, true);
    }

    if (ruleInstance?.rules?.length > 0) {
        // Return RuleWithoutIdInterface when there is only a single rule
        return cleanInstance(Object.freeze(ruleInstance)?.rules[0]) as RuleInterface;
    }

    return null;
};

/**
 * Method to get the context value
 *
 * @returns RuleInstanceData
 */
export const getRuleInstanceValue = (): RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface =>
    toRuleValue(RuleContextRef.ruleInstance);

/**
 * Applies one edit to an expression.
 *
 * @param expression   - The expression being edited.
 * @param fieldName    - The part of it that changed.
 * @param changedValue - The new value of that part.
 * @param operators    - Operators the expression's field publishes, which say what each one takes.
 * @returns The edited expression.
 */
const applyExpressionChange = (
    expression: ConditionExpressionInterface,
    fieldName: ExpressionFieldTypes,
    changedValue: string | string[],
    operators?: OperatorInterface[]
): ConditionExpressionInterface => {
    const { value: _value, values: _values, ...withoutValue } = expression;
    const { valueField: _valueField, valueFieldQualifier: _valueFieldQualifier, ...withoutAnyValue } = withoutValue;
    const readsField: boolean = expression.valueField !== undefined;
    const valueInput: OperatorValueInputType = getValueInput(expression.operator, operators);

    const withEnteredValue = (base: ConditionExpressionInterface): ConditionExpressionInterface => {
        const baseInput: OperatorValueInputType = getValueInput(base.operator, operators);

        if (baseInput === "none") {
            return base;
        }

        return baseInput === "list" ? { ...base, values: [] } : { ...base, value: "" };
    };

    if (fieldName === ExpressionFieldTypes.Qualifier && !changedValue) {
        // Clearing a qualifier removes it: a field that takes no qualifier -- every action field -- must not be
        // sent one, not even an empty one, and the API rejects it if it is.
        const { qualifier: _qualifier, ...withoutQualifier } = expression;

        return withoutQualifier;
    }

    if (fieldName === ExpressionFieldTypes.Operator) {
        const nextInput: OperatorValueInputType = getValueInput(changedValue as string, operators);

        if (nextInput === "none") {
            // An operator that checks the field alone takes no value, whether entered or read.
            return { ...withoutAnyValue, operator: changedValue as string };
        }
        if (readsField) {
            return { ...expression, operator: changedValue as string };
        }

        return nextInput === "list"
            ? { ...withoutAnyValue, operator: changedValue as string, values: expression.values ?? [] }
            : { ...withoutAnyValue, operator: changedValue as string, value: expression.value ?? "" };
    }

    if (valueInput === "none") {
        if (fieldName === ExpressionFieldTypes.Field) {
            return { ...withoutAnyValue, field: changedValue as string };
        }
        if ([ ExpressionFieldTypes.Value, ExpressionFieldTypes.Values, ExpressionFieldTypes.ValueSource,
            ExpressionFieldTypes.ValueField, ExpressionFieldTypes.ValueFieldQualifier ].includes(fieldName)) {
            // A condition that checks the field alone has no value to set.
            return expression;
        }
    }

    if (fieldName === ExpressionFieldTypes.ValueSource) {
        return changedValue === "field"
            ? { ...withoutAnyValue, valueField: expression.valueField ?? "", valueFieldQualifier: "" }
            : withEnteredValue(withoutAnyValue);
    }

    if (fieldName === ExpressionFieldTypes.ValueField) {
        // A qualifier picks a value within the field it was chosen for, so a new field starts without one.
        return { ...withoutAnyValue, valueField: changedValue as string, valueFieldQualifier: "" };
    }

    if (fieldName === ExpressionFieldTypes.ValueFieldQualifier) {
        return { ...expression, valueFieldQualifier: changedValue as string };
    }

    if (fieldName === ExpressionFieldTypes.Field && readsField) {
        return withEnteredValue({ ...withoutAnyValue, field: changedValue as string });
    }

    if (valueInput === "list") {
        if (fieldName === ExpressionFieldTypes.Field) {
            // A new field starts from an empty set, as it would from an empty value.
            return { ...withoutValue, field: changedValue as string, values: [] };
        }
        if (fieldName === ExpressionFieldTypes.Value) {
            // A single value has no place on a set comparison; it is what a field change resets.
            return expression;
        }
    }

    if (readsField && fieldName === ExpressionFieldTypes.Value) {
        // An entered value has no place on a comparison with another field.
        return expression;
    }

    return { ...expression, [fieldName]: changedValue };
};

/**
 * Provider for the RulesContext
 *
 * @param children - ReactNode
 * @param conditionExpressionsMetaData - ConditionExpressionsMetaDataInterface
 * @param initialData - RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface
 * @param ruleExecutionsMetaData - RuleExecutionMetaDataInterface
 * @param hidden - HiddenConfigurationInterface
 * @param limits - RuleLimitsInterface
 * @returns RulesProvider
 */
export const RulesProvider = ({
    children,
    initialData,
    isMultipleRules = false,
    conditionExpressionsMetaData,
    ruleExecutionMetaData,
    onChange,
    hidden = { conditions: [], resources: [], values: [] },
    limits = {}
}: {
    children: ReactNode;
    isMultipleRules?: boolean;
    conditionExpressionsMetaData: ConditionExpressionsMetaDataInterface;
    initialData: RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface;
    ruleExecutionMetaData?: RuleExecutionMetaDataInterface;
    onChange?: (rule: RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface) => void;
    hidden?: HiddenConfigurationInterface;
    limits?: RuleLimitsInterface;
}) => {
    let RuleExecutionData: any = addIds(initialData);

    // Check if initialData is a single rule object and if it doesn't have fallbackExecution
    // transform it to a collection
    if (RuleExecutionData && !RuleExecutionData?.fallbackExecution) {
        RuleExecutionData = {
            ...(isMultipleRules && { fallbackExecution: "" }),
            rules: [ RuleExecutionData ]
        };
    }

    const [ ruleComponentInstance, setRuleComponentInstance ] =
        useState<RuleExecuteCollectionInterface>(RuleExecutionData ?? undefined);

    const ruleComponentInstanceConditionExpressionsMeta: ConditionExpressionsMetaDataInterface | undefined =
        conditionExpressionsMetaData ?? undefined;
    const ruleComponentInstanceExecutionsMeta: RuleExecutionMetaDataInterface | undefined =
        ruleExecutionMetaData ?? undefined;

    // Update the ref whenever the context value changes
    RuleContextRef.ruleInstance = {
        ...ruleComponentInstance,
        isMultipleRules
    };

    // Held in a ref so that a caller passing a fresh closure on every render does not restart the
    // effect below, which would report a change on every render rather than on every edit.
    const onChangeRef: MutableRefObject<typeof onChange> = useRef(onChange);

    onChangeRef.current = onChange;

    // What was last reported, so that mounting an editor -- or re-rendering it with the same rule --
    // is not mistaken for an edit.
    const lastReportedRef: MutableRefObject<string> = useRef<string>(null);

    useEffect(() => {
        const value: RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface =
            toRuleValue({ ...ruleComponentInstance, isMultipleRules });
        const serialized: string = JSON.stringify(value);

        if (lastReportedRef.current === null) {
            lastReportedRef.current = serialized;

            return;
        }

        if (serialized !== lastReportedRef.current) {
            lastReportedRef.current = serialized;
            onChangeRef.current?.(value);
        }
    }, [ ruleComponentInstance ]);

    useEffect(() => {
        // If the initial data is not provided, add a new rule execution.
        if (!initialData && ruleComponentInstanceConditionExpressionsMeta) {
            setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
                return {
                    ...prev,
                    ...(isMultipleRules && { fallbackExecution: ruleExecutionMetaData?.fallbackExecutions?.[0]?.name }),
                    rules: [ getNewRuleInstance() ]
                };
            });
        }
    }, [ ruleComponentInstanceConditionExpressionsMeta ]);

    /**
     * Method to get the rule instance.
     *
     * @returns RuleInstanceData
     */
    const getRuleInstance = (): RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface => {
        if (ruleComponentInstance) {
            if (isMultipleRules) {
                return cleanInstance(ruleComponentInstance, true);
            }

            if (ruleComponentInstance.rules?.length > 0) {
                return cleanInstance(ruleComponentInstance.rules[0], isMultipleRules);
            }
        }

        return null;
    };

    /**
     * Method to get a new rule expression.
     *
     * @returns Rule Expression
     */
    const getNewConditionExpressionInstance = (): ConditionExpressionInterface => {
        const operators: OperatorInterface[] = conditionExpressionsMetaData?.[0]?.operators;
        const operator: string = operators?.[0]?.name;
        const valueInput: OperatorValueInputType = getValueInput(operator, operators);

        return {
            field: conditionExpressionsMetaData?.[0]?.field?.name,
            id: uuidv4(),
            operator,
            ...(valueInput === "single" && { value: "" }),
            ...(valueInput === "list" && { values: [] })
        };
    };

    /**
     * The operators a field publishes, which say what value each of them takes.
     *
     * @param fieldName - Name of the field.
     * @returns The field's operators, or undefined when the metadata has none for it.
     */
    const operatorsOf = (fieldName: string): OperatorInterface[] | undefined =>
        conditionExpressionsMetaData?.find(
            (meta: ConditionExpressionMetaInterface) => meta?.field?.name === fieldName)?.operators;

    /**
     * Method to get a new rule.
     *
     * @param condition - AdjoiningOperatorTypes
     * @returns Rule
     */
    const getNewRuleConditionInstance = (
        condition: AdjoiningOperatorTypes
    ): RuleConditionInterface => {
        return {
            condition: condition,
            expressions: [ getNewConditionExpressionInstance() ],
            id: uuidv4()
        };
    };

    /**
     * Method to get a new rule execute instance.
     *
     * @returns Rule Execute Instance
     */
    const getNewRuleInstance = (): RuleInterface => {
        return {
            condition: AdjoiningOperatorTypes.Or,
            id: uuidv4(),
            isRuleInstanceTouched: false,
            rules: [ getNewRuleConditionInstance(AdjoiningOperatorTypes.And) ]
        };
    };

    /**
     * Method to add a new rule.
     */
    const handleAddNewRule = () => {
        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: [ ...prev?.rules, getNewRuleInstance() ]
            };
        });
    };

    /**
     * Method to remove a rule.
     *
     * @param id - string
     */
    const handleRemoveRule = (id: string) => {
        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: prev?.rules?.filter(
                    (ruleExecution: RuleInterface) => ruleExecution?.id !== id)
            };
        });
    };

    /**
     * Method to clear a rule.
     *
     * @param id - string
     */
    const handleClearRule = (id: string) => {
        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: prev?.rules?.map((rule: RuleInterface) =>
                    rule.id === id ? getNewRuleInstance() : rule
                )
            };
        });
    };

    /**
     * Method to update a rule execution.
     *
     * @param event - SelectChangeEvent
     * @param id - string
     */
    const handleRuleExecutionTypeChange = (event: SelectChangeEvent, id: string) => {
        const changedValue: string = event.target.value as string;

        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: prev?.rules?.map((ruleExecution: RuleInterface) => {
                    if (ruleExecution.id === id) {
                        return {
                            ...ruleExecution,
                            execution: changedValue,
                            isRuleInstanceTouched: true
                        };
                    }

                    return ruleExecution;
                })
            };
        });
    };

    /**
     * Method to update a rules default execution.
     *
     * @param event - SelectChangeEvent
     */
    const handleRulesFallbackExecutionTypeChange = (event: SelectChangeEvent) => {
        const changedValue: string = event.target.value as string;

        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return { ...prev, fallbackExecution: changedValue };
        });
    };

    /**
     * Method to update the rule expression value.
     *
     * @param event - SelectChangeEvent | React.ChangeEvent
     * @param ruleExecutionId - string
     * @param conditionId - string
     * @param expressionId - string
     * @param fieldName - ExpressionFieldTypes
     */
    const handleConditionExpressionValueChange = (
        changedValue: string | string[],
        ruleId: string,
        conditionId: string,
        expressionId: string,
        fieldName: ExpressionFieldTypes,
        isOnChange: boolean
    ) => {
        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: prev?.rules?.map((rule: RuleInterface) => {
                    if (rule.id === ruleId) {
                        return {
                            ...rule,
                            rules: rule.rules?.map((condition: RuleConditionInterface) => {
                                // Handle undefined or empty rules
                                if (!condition) return condition;

                                if (condition.id === conditionId) {

                                    return {
                                        ...condition,
                                        expressions: condition.expressions.map(
                                            (expression: ConditionExpressionInterface) => {
                                                if (expression.id === expressionId) {
                                                    return applyExpressionChange(
                                                        expression, fieldName, changedValue,
                                                        operatorsOf(expression.field));
                                                }

                                                return expression;
                                            }
                                        )
                                    };
                                }

                                return condition;
                            }),
                            ...(isOnChange && { isRuleInstanceTouched: true })
                        };
                    }

                    return rule;
                })
            };
        });
    };


    /**
     * Method to add a new condition expression.
     *
     * @param ruleId - string
     * @param conditionId - string
     * @param expressionType - AdjoiningOperatorTypes
     * @param previousExpressionId - string
     */
    const handleAddConditionExpression = (
        ruleId: string,
        conditionId: string,
        expressionType: AdjoiningOperatorTypes,
        previousExpressionId?: string
    ) => {
        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: prev?.rules?.map((rule: RuleInterface) => {
                    if (rule.id === ruleId) {
                        return {
                            ...rule,
                            isRuleInstanceTouched: true,
                            rules: rule.rules?.flatMap((condition: RuleConditionInterface) => {
                                if (expressionType === AdjoiningOperatorTypes.Or) {
                                    if (condition.id === conditionId) {
                                        // Insert new condition after the matched condition
                                        return [
                                            condition,
                                            getNewRuleConditionInstance(AdjoiningOperatorTypes.And)
                                        ];
                                    }

                                    return [ condition ];
                                } else {
                                    return {
                                        ...condition,
                                        expressions: condition.expressions.flatMap(
                                            (expression: ConditionExpressionInterface) => {
                                                if (expression.id === previousExpressionId) {
                                                    // Insert new expression after the matched expression
                                                    return [
                                                        expression,
                                                        getNewConditionExpressionInstance()
                                                    ];
                                                }

                                                return [ expression ];
                                            }
                                        )
                                    };
                                }
                            })
                        };
                    }

                    return rule;
                })
            };
        });
    };

    /**
     * Method to remove a condition expression.
     *
     * @param ruleId - string
     * @param expressionId - string
     */
    const handleRemoveConditionExpression = (ruleId: string, expressionId: string) => {
        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: prev?.rules?.map((rule: RuleInterface) => {
                    if (rule.id === ruleId) {
                        return {
                            ...rule,
                            isRuleInstanceTouched: true,
                            rules: rule.rules?.flatMap((condition: RuleConditionInterface) => {
                                // Remove the expression if it matches
                                const updatedExpressions: ConditionExpressionsInterface = condition.expressions.filter(
                                    (expression: ConditionExpressionInterface) => expression.id !== expressionId
                                );

                                // If there are no expressions left, remove the condition
                                if (updatedExpressions.length === 0) {
                                    return [];
                                }

                                return [
                                    {
                                        ...condition,
                                        expressions: updatedExpressions
                                    }
                                ];
                            })
                        };
                    }

                    return rule;
                })
            };
        });
    };

    return (
        <RulesContext.Provider
            value={ {
                addNewRule: handleAddNewRule,
                addNewRuleConditionExpression: handleAddConditionExpression,
                clearRule: handleClearRule,
                conditionExpressionsMeta: ruleComponentInstanceConditionExpressionsMeta,
                hidden: hidden,
                isMultipleRules: isMultipleRules,
                limits: limits,
                removeRule: handleRemoveRule,
                removeRuleConditionExpression: handleRemoveConditionExpression,
                ruleExecuteCollection: ruleComponentInstance,
                ruleExecutionsMeta: ruleComponentInstanceExecutionsMeta,
                ruleInstance: getRuleInstance(),
                updateConditionExpression: handleConditionExpressionValueChange,
                updateRuleExecution: handleRuleExecutionTypeChange,
                updateRulesFallbackExecution: handleRulesFallbackExecutionTypeChange
            } }
        >
            { children }
        </RulesContext.Provider>
    );
};
