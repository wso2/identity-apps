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

import { ConditionExpressionWithoutIdInterface, RuleConditionWithoutIdInterface, RuleWithoutIdInterface }
    from "@wso2is/admin.rules.v1/models/rules";
import {
    DevicePolicyExpressionInterface,
    DevicePolicyRuleGroupInterface,
    DevicePolicyRuleInterface,
    DevicePolicyRuleRequestInterface
} from "../models/device-policy";

/**
 * Converts a rule returned by the policies API to the format of the rules component. The API wraps each
 * value with its type, while the rules component works with plain values.
 *
 * @param rule - Rule returned by the policies API.
 * @returns Rule for the rules component.
 */
export const toRuleData = (rule?: DevicePolicyRuleInterface): RuleWithoutIdInterface => ({
    condition: "OR",
    rules: (rule?.rules ?? [])
        .filter((group: DevicePolicyRuleGroupInterface) => group.expressions?.length > 0)
        .map((group: DevicePolicyRuleGroupInterface) => ({
            condition: "AND",
            expressions: group.expressions.map((expression: DevicePolicyExpressionInterface) => ({
                field: expression.field,
                operator: expression.operator,
                value: expression.value?.value
            }))
        }))
});

/**
 * Converts a rule of the rules component to the format the policies API accepts.
 *
 * @param rule - Rule from the rules component.
 * @returns Rule for the policies API.
 */
export const toRuleRequest = (rule: RuleWithoutIdInterface): DevicePolicyRuleRequestInterface => ({
    condition: "OR",
    rules: rule.rules.map((group: RuleConditionWithoutIdInterface) => ({
        condition: "AND",
        expressions: group.expressions.map((expression: ConditionExpressionWithoutIdInterface) => ({
            field: expression.field,
            operator: expression.operator,
            value: expression.value ?? ""
        }))
    }))
});

/**
 * Checks whether a rule has at least one condition and a value for every condition.
 *
 * @param rule - Rule from the rules component.
 * @returns Whether the rule can be saved.
 */
export const isRuleComplete = (rule: RuleWithoutIdInterface): boolean =>
    rule?.rules?.length > 0 && rule.rules.every((group: RuleConditionWithoutIdInterface) =>
        group.expressions?.length > 0 && group.expressions.every(
            (expression: ConditionExpressionWithoutIdInterface) => !!expression.field && !!expression.operator
                && !!expression.value
        )
    );
