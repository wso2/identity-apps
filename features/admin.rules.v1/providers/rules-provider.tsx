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

import { SelectChangeEvent } from "@oxygen-ui/react/Select";
import React, { ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import RulesContext from "../contexts/rules-context";
import { ConditionExpressionsMetaDataInterface, RuleExecutionMetaDataInterface } from "../models/meta";
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
import { addIds, removeIds } from "../utils/add-remove-ids";

// Refference to hold the latest context value
const RuleContextRef: { ruleInstance: RuleExecuteCollectionInterface | undefined } = {
    ruleInstance: undefined
};

/**
 * Method to get the context value
 *
 * @returns RuleInstanceData
 */
export const getRuleInstanceValue = (): RuleExecuteCollectionWithoutIdInterface =>
    removeIds(Object.freeze(RuleContextRef.ruleInstance));

/**
 * Provider for the RulesContext
 *
 * @param children - ReactNode
 * @param conditionExpressionsMetaData - ConditionExpressionsMetaDataInterface
 * @param initialData - RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface
 * @param ruleExecutionsMetaData - RuleExecutionMetaDataInterface
 * @returns RulesProvider
 */
export const RulesProvider = ({
    children,
    initialData,
    conditionExpressionsMetaData,
    ruleExecutionMetaData
}: {
    children: ReactNode;
    conditionExpressionsMetaData: ConditionExpressionsMetaDataInterface;
    initialData: RuleExecuteCollectionWithoutIdInterface | RuleWithoutIdInterface;
    ruleExecutionMetaData: RuleExecutionMetaDataInterface;
}) => {
    let RuleExecutionData: any = addIds(initialData);

    // Check if initialData is a single rule object and if it doesn't have fallbackExecution
    // transform it to a collection
    if (RuleExecutionData && !RuleExecutionData?.fallbackExecution) {
        RuleExecutionData = {
            fallbackExecution: "",
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
    RuleContextRef.ruleInstance = ruleComponentInstance;

    /**
     * Method to get a new rule expression.
     *
     * @returns Rule Expression
     */
    const getNewConditionExpressionInstance = (): ConditionExpressionInterface => {
        return {
            field: conditionExpressionsMetaData?.[0]?.field?.name,
            id: uuidv4(),
            operator: conditionExpressionsMetaData?.[0]?.operators?.[0]?.name,
            value: ""
        };
    };

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
            rules: [ getNewRuleConditionInstance(AdjoiningOperatorTypes.And) ]
        };
    };

    useEffect(() => {
        // If the initial data is not provided, add a new rule execution.
        if (!initialData) {
            setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
                return {
                    ...prev,
                    fallbackExecution: ruleExecutionMetaData?.fallbackExecutions?.[0]?.name,
                    rules: [ getNewRuleInstance() ]
                };
            });
        }
    }, []);

    /**
     * Method to add a new rule.
     */
    const handleAddNewRule = () => {
        const newRuleInstance: RuleInterface = getNewRuleInstance();

        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return { ...prev, rules: [ ...prev.rules, newRuleInstance ] };
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
                rules: prev.rules?.filter(
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
                rules: prev.rules?.map((rule: RuleInterface) =>
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
                rules: prev.rules?.map((ruleExecution: RuleInterface) => {
                    if (ruleExecution.id === id) {
                        return { ...ruleExecution, execution: changedValue };
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
        changedValue: string,
        ruleId: string,
        conditionId: string,
        expressionId: string,
        fieldName: ExpressionFieldTypes
    ) => {
        setRuleComponentInstance((prev: RuleExecuteCollectionInterface) => {
            return {
                ...prev,
                rules: prev.rules?.map((rule: RuleInterface) => {
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
                                                    return {
                                                        ...expression,
                                                        [fieldName]: changedValue
                                                    };
                                                }

                                                return expression;
                                            }
                                        )
                                    };
                                }

                                return condition;
                            })
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
                rules: prev.rules?.map((rule: RuleInterface) => {
                    if (rule.id === ruleId) {
                        return {
                            ...rule,
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
                rules: prev.rules?.map((rule: RuleInterface) => {
                    if (rule.id === ruleId) {
                        return {
                            ...rule,
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
                removeRule: handleRemoveRule,
                removeRuleConditionExpression: handleRemoveConditionExpression,
                ruleExecuteCollection: ruleComponentInstance,
                ruleExecutionsMeta: ruleComponentInstanceExecutionsMeta,
                updateConditionExpression: handleConditionExpressionValueChange,
                updateRuleExecution: handleRuleExecutionTypeChange,
                updateRulesFallbackExecution: handleRulesFallbackExecutionTypeChange
            } }
        >
            { children }
        </RulesContext.Provider>
    );
};
