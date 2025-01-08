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
import { createContext } from "react";
import { ConditionTypes, ExpressionInterface, RuleComponentMetaDataInterface, RuleInterface } from "../models/rules";

/**
 * Interface for the RulesContext.
 */
export interface RulesContextInterface {
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
    conditionExpressionsMeta: RuleComponentMetaDataInterface;

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
    addNewRuleCondition: (ruleId: string, previousConditionInstanceId: string, conditionType: ConditionTypes) => void;

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
        fieldName: keyof ExpressionInterface
    ) => void;
}

/**
 * Create the context
 */
const RulesContext: React.Context<RulesContextInterface | undefined> =
    createContext<RulesContextInterface | undefined>(undefined);

RulesContext.displayName = "RulesContext";

export default RulesContext;
