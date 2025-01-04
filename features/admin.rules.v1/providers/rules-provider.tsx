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

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import { 
    RuleInterface,
    RuleConditionsInterface,
    RuleComponentMetaDataInterface,
    RuleExecutionMetaDataInterface,
    ConditionTypes,
    ExpressionInterface
} from "../models/rules";
import { v4 as uuidv4 } from "uuid";

/**
 * Interface for the RulesContext.
 */
interface RulesContextInterface {
    /**
     * Rules instance.
     */
    rulesInstance: RuleInterface[];

    /**
     * Conditions meta.
     */
    conditionsMeta: any;

    /**
     * Condition expressions meta.
     */
    conditionExpressionsMeta: any;

    /**
     * Method to add a new rule.
     */
    addNewRule: () => void;

    /**
     * Method to remove a rule.
     */
    removeRule: (id: string) => void;

    /**
     * Method to add a new rule condition.
     */
    addNewRuleCondition: (
        ruleId: string,
        previousConditionInstanceId: string,
        conditionType: ConditionTypes) => void;

    /**
     * Method to remove a rule condition.
     */
    removeRuleCondition: (ruleId: string, conditionId: string) => void;

    /**
     * Method to update the rule execution type.
     */
    updateRuleExecution: (event: SelectChangeEvent, id: string) => void;

    /**
     * Method to update the rule condition expression value.
     */
    updateRuleConditionExpression: (
        changedValue: string,
        ruleId: string,
        conidtionId: string,
        expressionId: string,
        fieldName: keyof ExpressionInterface) => void;
}

/**
 * Create the context
 */
const RulesContext = createContext<RulesContextInterface | undefined>(undefined);

// Refference to hold the latest context value
const RuleContextRef = { ruleInstance: undefined as RuleInterface[] | undefined };

/**
 * Method to get the context value
 * 
 * @returns RuleInstanceData
 */
export const getRuleContextValue = () => RuleContextRef.ruleInstance;

/**
 * Custom hook for accessing the context
 * 
 * @returns RulesComponent context
 */
export const useRulesContext = (): RulesContextInterface => {
    const context = useContext(RulesContext);

    if (!context) {
        throw new Error("useRulesContext must be used within a RulesProvider");
    }

    return context;
};

/**
 * Provider for the RulesContext
 * 
 * @param children - ReactNode
 * @param metaData - RuleComponentMetaDataInterface
 * @param initialData - RuleInterface[] | null
 * @returns RulesProvider
 */
export const RulesProvider = (
    { children, metaData, initialData, ruleExecutions }
    : { children: ReactNode,
        metaData: RuleComponentMetaDataInterface,
        initialData: RuleInterface[] | [],
        ruleExecutions: RuleExecutionMetaDataInterface }) => {

    const [ rulesInstance, setRuleInstance ] = useState<RuleInterface[] | []>(initialData);

    const conditionsMeta = ruleExecutions ?? [];
    const conditionExpressionsMeta = metaData ?? [];

    // Update the ref whenever the context value changes
    RuleContextRef.ruleInstance = rulesInstance;

    const getNewRuleInstanceConditionExpression = ():ExpressionInterface  => {

        const newRuleConditionExpressionUUID: string = uuidv4();
    
        return ({
            "id": newRuleConditionExpressionUUID,
            "field": metaData?.[0]?.field?.name,
            "operator": metaData?.[0]?.operators?.[0]?.name,
            "value": "",
            "order": 0
        });
    };

    /**
     * Method to create a new rule instance condition.
     * 
     * @param condition 
     * @returns 
     */
    const getNewRuleInstanceCondition = (
        condition: ConditionTypes,
        orderIndex = 0
    ):RuleConditionsInterface  => {

        const newRuleConditionUUID: string = uuidv4();
    
        return ({
            "id": newRuleConditionUUID,
            "condition": condition,
            "order": orderIndex,
            "expressions": [ getNewRuleInstanceConditionExpression() ]
        });
    };
    
    /**
     * Method to create a new rule instance.
     * 
     * @returns RuleInterface
     */
    const getNewRuleInstance = ():RuleInterface  => {

        const newRuleUUID: string = uuidv4();
    
        return ({
            id: newRuleUUID,
            execution: conditionsMeta?.[0]?.value,
            conditions: [ getNewRuleInstanceCondition(ConditionTypes.And) ]
        });
    };

    useEffect(() => {

        // If the initial data is not provided, create a new instance.
        if (!initialData) {
            setRuleInstance([getNewRuleInstance()]);
        }
    }, []);

    /**
     * Method to add a new rule.
     */
    const handleAddNewRule = () => {

        const newRuleInstance: RuleInterface = getNewRuleInstance();

        setRuleInstance((prev: RuleInterface[]) => {
            return [...prev, newRuleInstance];
        });
    };

    /**
     * Method to remove a rule.
     * 
     * @param id - string
     */
    const handleRemoveRule = (id: string) => {
    
        setRuleInstance((prev: RuleInterface[]) => {
            return prev.filter((rule) => rule?.id !== id);
        });
    };

    /**
     * Method to remove a rule condition instance.
     * 
     * @param id - string
     */
    const handleRuleExecutionTypeChange = 
        (event: SelectChangeEvent, id: string) => {

        const changedValue = event.target.value as string;

        setRuleInstance((prev: RuleInterface[]) => {
            return prev.map((rule) => {
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
     * @param fieldName - keyof ExpressionInterface
     */
    const handleRuleConditionExpressionValueChange = (
        changedValue: string,
        ruleId: string,
        conditionId: string,
        expressionId: string,
        fieldName: keyof ExpressionInterface
    ) => {

        setRuleInstance((prev: RuleInterface[]) => {

            return prev.map((rule) => {
                if (rule.id === ruleId) {
                    return {
                        ...rule,
                        conditions: rule.conditions.map((condition) => {
                            if (condition.id === conditionId) {
                                return {
                                    ...condition,
                                    expressions: condition.expressions.map(
                                        (expression) => {
                                            if (expression.id === expressionId) {
                                                return { 
                                                    ...expression, 
                                                    [fieldName]: changedValue
                                                };
                                            }

                                            return expression;
                                        }
                                    ),
                                };
                            }
                            return condition;
                        }),
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
    const handleAddRuleCondition = (
        ruleId: string,
        previousConditionId: string, 
        conditionType: ConditionTypes
    ) => {

        setRuleInstance((prev: RuleInterface[]) => {
            return prev.map((rule) => {
                if (rule.id === ruleId) {
                    // Clone conditions to avoid mutating the original state
                    const updatedConditions = [...rule.conditions];
                
                    // Find the index of the item with the matching id
                    const index = updatedConditions.findIndex((condition) => 
                        condition.id === previousConditionId);
                    
                    if (index === -1) {
                        return rule;
                    }
                
                    // Insert the new condition after the matched condition
                    updatedConditions.splice(index + 1, 0, 
                        getNewRuleInstanceCondition(conditionType, index + 1));
    
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
            return prev.map((rule) => {
                if (rule.id === ruleId) {

                    // Clone conditions to avoid mutating the original state
                    const updatedConditions = rule.conditions.filter(
                        (condition, index) => {

                            // Skip the condition that is being removed
                            if (condition.id === conditionId) {
                                const nextCondition = 
                                    rule.conditions[index + 1];
        
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
            value={{
                rulesInstance: rulesInstance,
                conditionsMeta: conditionsMeta,
                conditionExpressionsMeta: conditionExpressionsMeta,
                addNewRule: handleAddNewRule,
                removeRule: handleRemoveRule,
                addNewRuleCondition: handleAddRuleCondition,
                removeRuleCondition: handleRemoveRuleCondition,
                updateRuleExecution: handleRuleExecutionTypeChange,
                updateRuleConditionExpression: handleRuleConditionExpressionValueChange
            }}
        >
            {children}
        </RulesContext.Provider>
    );
};
