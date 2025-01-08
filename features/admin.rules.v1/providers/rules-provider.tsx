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

import { SelectChangeEvent } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import RulesContext from "../contexts/rules-context";
import {
    ConditionTypes,
    ExpressionFieldTypes,
    ExpressionInterface,
    RuleComponentMetaDataInterface,
    RuleConditionsInterface,
    RuleExecutionMetaDataInterface,
    RuleInterface
} from "../models/rules";

// Refference to hold the latest context value
const RuleContextRef: { ruleInstance: RuleInterface[] | undefined } = { ruleInstance: undefined };

/**
 * Method to get the context value
 *
 * @returns RuleInstanceData
 */
export const getRuleInstanceValue = () => RuleContextRef.ruleInstance;

/**
 * Provider for the RulesContext
 *
 * @param children - ReactNode
 * @param metaData - RuleComponentMetaDataInterface
 * @param initialData - RuleInterface[] | null
 * @returns RulesProvider
 */
export const RulesProvider = ({
    children,
    metaData,
    initialData,
    ruleExecutions
}: {
    children: ReactNode;
    metaData: RuleComponentMetaDataInterface;
    initialData: RuleInterface[] | [];
    ruleExecutions: RuleExecutionMetaDataInterface;
}) => {
    const [ rulesInstance, setRuleInstance ] = useState<RuleInterface[] | []>(initialData);

    const conditionsMeta: RuleExecutionMetaDataInterface | undefined[] = ruleExecutions ?? [];
    const conditionExpressionsMeta: RuleComponentMetaDataInterface | undefined[] = metaData ?? [];

    // Update the ref whenever the context value changes
    RuleContextRef.ruleInstance = rulesInstance;

    const getNewRuleInstanceConditionExpression = (): ExpressionInterface => {
        const newRuleConditionExpressionUUID: string = uuidv4();

        return {
            field: metaData?.[0]?.field?.name,
            id: newRuleConditionExpressionUUID,
            operator: metaData?.[0]?.operators?.[0]?.name,
            order: 0,
            value: ""
        };
    };

    /**
     * Method to create a new rule instance condition.
     *
     * @param condition - ConditionTypes
     * @returns RuleConditionsInterface
     */
    const getNewRuleInstanceCondition = (
        condition: ConditionTypes,
        orderIndex: number = 0
    ): RuleConditionsInterface => {
        const newRuleConditionUUID: string = uuidv4();

        return {
            condition: condition,
            expressions: [ getNewRuleInstanceConditionExpression() ],
            id: newRuleConditionUUID,
            order: orderIndex
        };
    };

    /**
     * Method to create a new rule instance.
     *
     * @returns RuleInterface
     */
    const getNewRuleInstance = (): RuleInterface => {
        const newRuleUUID: string = uuidv4();

        return {
            conditions: [ getNewRuleInstanceCondition(ConditionTypes.And) ],
            execution: conditionsMeta?.[0]?.value,
            id: newRuleUUID
        };
    };

    useEffect(() => {
        // If the initial data is not provided, create a new instance.
        if (!initialData) {
            setRuleInstance([ getNewRuleInstance() ]);
        }
    }, []);

    /**
     * Method to add a new rule.
     */
    const handleAddNewRule = () => {
        const newRuleInstance: RuleInterface = getNewRuleInstance();

        setRuleInstance((prev: RuleInterface[]) => {
            return [ ...prev, newRuleInstance ];
        });
    };

    /**
     * Method to remove a rule.
     *
     * @param id - string
     */
    const handleRemoveRule = (id: string) => {
        setRuleInstance((prev: RuleInterface[]) => {
            return prev.filter((rule: RuleInterface) => rule?.id !== id);
        });
    };

    /**
     * Method to remove a rule condition instance.
     *
     * @param id - string
     */
    const handleRuleExecutionTypeChange = (event: SelectChangeEvent, id: string) => {
        const changedValue: string = event.target.value as string;

        setRuleInstance((prev: RuleInterface[]) => {
            return prev.map((rule: RuleInterface) => {
                if (rule.id === id) {
                    return { ...rule, execution: changedValue };
                }

                return rule;
            });
        });
    };

    /**
     * Method to update the rule condition expression value.
     *
     * @param event - SelectChangeEvent | React.ChangeEvent
     * @param ruleId - string
     * @param conditionId - string
     * @param expressionId - string
     * @param fieldName - ExpressionFieldTypes
     */
    const handleRuleConditionExpressionValueChange = (
        changedValue: string,
        ruleId: string,
        conditionId: string,
        expressionId: string,
        fieldName: ExpressionFieldTypes
    ) => {
        setRuleInstance((prev: RuleInterface[]) => {
            return prev.map((rule: RuleInterface) => {
                if (rule.id === ruleId) {
                    return {
                        ...rule,
                        conditions: rule.conditions.map((condition: RuleConditionsInterface) => {
                            if (condition.id === conditionId) {
                                return {
                                    ...condition,
                                    expressions: condition.expressions.map((expression: ExpressionInterface) => {
                                        if (expression.id === expressionId) {
                                            return {
                                                ...expression,
                                                [fieldName]: changedValue
                                            };
                                        }

                                        return expression;
                                    })
                                };
                            }

                            return condition;
                        })
                    };
                }

                return rule;
            });
        });
    };

    /**
     * Method to add a new rule condition.
     *
     * @param ruleId - string
     * @param previousConditionId - string
     * @param conditionType - ConditionTypes
     */
    const handleAddRuleCondition = (ruleId: string, previousConditionId: string, conditionType: ConditionTypes) => {
        setRuleInstance((prev: RuleInterface[]) => {
            return prev.map((rule: RuleInterface) => {
                if (rule.id === ruleId) {
                    // Clone conditions to avoid mutating the original state
                    const updatedConditions: RuleConditionsInterface[] = [ ...rule.conditions ];

                    // Find the index of the item with the matching id
                    const index: number = updatedConditions.findIndex(
                        (condition: RuleConditionsInterface) => condition.id === previousConditionId
                    );

                    if (index === -1) {
                        return rule;
                    }

                    // Insert the new condition after the matched condition
                    updatedConditions.splice(index + 1, 0, getNewRuleInstanceCondition(conditionType, index + 1));

                    return {
                        ...rule,
                        conditions: updatedConditions
                    };
                }

                return rule;
            });
        });
    };

    /**
     * Method to remove a rule condition.
     *
     * @param ruleId - string
     * @param conditionId - string
     */
    const handleRemoveRuleCondition = (ruleId: string, conditionId: string) => {
        setRuleInstance((prev: RuleInterface[]) => {
            return prev.map((rule: RuleInterface) => {
                if (rule.id === ruleId) {
                    // Clone conditions to avoid mutating the original state
                    const updatedConditions: RuleConditionsInterface[] = rule.conditions.filter(
                        (condition: RuleConditionsInterface, index: number) => {
                            // Skip the condition that is being removed
                            if (condition.id === conditionId) {
                                const nextCondition: RuleConditionsInterface = rule.conditions[index + 1];

                                // Handle special case where "OR" is followed by "AND"
                                if (condition.condition === "OR" && nextCondition?.condition === "AND") {
                                    nextCondition.condition = "OR";
                                }

                                return false; // Exclude the removed condition
                            }

                            return true; // Keep other conditions
                        }
                    );

                    return {
                        ...rule,
                        conditions: updatedConditions
                    };
                }

                return rule;
            });
        });
    };

    return (
        <RulesContext.Provider
            value={ {
                addNewRule: handleAddNewRule,
                addNewRuleCondition: handleAddRuleCondition,
                conditionExpressionsMeta: conditionExpressionsMeta,
                conditionsMeta: conditionsMeta,
                removeRule: handleRemoveRule,
                removeRuleCondition: handleRemoveRuleCondition,
                rulesInstance: rulesInstance,
                updateRuleConditionExpression: handleRuleConditionExpressionValueChange,
                updateRuleExecution: handleRuleExecutionTypeChange
            } }
        >
            { children }
        </RulesContext.Provider>
    );
};
