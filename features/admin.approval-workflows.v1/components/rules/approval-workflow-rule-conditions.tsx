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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import { PlusIcon } from "@oxygen-ui/react-icons";
import useRulesContext from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionInterface,
    RuleConditionInterface,
    RuleConditionsInterface,
    RuleInterface
} from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement
} from "react";
import { useTranslation } from "react-i18next";
import ApprovalWorkflowRuleExpression from "./approval-workflow-rule-expression";
import "./approval-workflow-rule-conditions.scss";

/**
 * Props interface of {@link ApprovalWorkflowRuleConditions}
 */
export interface ApprovalWorkflowRuleConditionsPropsInterface extends IdentifiableComponentInterface {
    readonly?: boolean;
    rule: RuleInterface;
    submissionAttempted?: boolean;
}

/**
 * Approval-workflow-specific rule conditions component.
 *
 * Renders condition expressions for workflow rule fields including user.domain,
 * user.groups, user.roles, role.id, role.audience, user.claims, initiator.claims, etc.
 *
 * @param props - Props injected to the component.
 * @returns Rule conditions component.
 */
const ApprovalWorkflowRuleConditions: FunctionComponent<ApprovalWorkflowRuleConditionsPropsInterface> = ({
    ["data-componentid"]: componentId = "approval-workflow-rules-condition",
    readonly,
    rule: ruleInstance,
    submissionAttempted
}: ApprovalWorkflowRuleConditionsPropsInterface): ReactElement => {
    const ruleConditions: RuleConditionsInterface = ruleInstance.rules;

    const { addNewRuleConditionExpression } = useRulesContext();

    const { t } = useTranslation();

    return (
        <div data-componentid={ componentId }>
            { ruleConditions?.map(
                (condition: RuleConditionInterface, index: number) =>
                    ruleInstance?.condition === AdjoiningOperatorTypes.Or && (
                        <Fragment key={ index }>
                            { condition.condition === AdjoiningOperatorTypes.And && (
                                <>
                                    { condition.expressions?.map(
                                        (expression: ConditionExpressionInterface, exprIndex: number) => (
                                            <Box sx={ { mt: 2 } } key={ exprIndex }>
                                                { (condition.expressions.length === (exprIndex + 1)) }
                                                <ApprovalWorkflowRuleExpression
                                                    expression={ expression }
                                                    ruleId={ ruleInstance.id }
                                                    conditionId={ condition.id }
                                                    index={ exprIndex }
                                                    isConditionLast={
                                                        condition.expressions.length === (exprIndex + 1)
                                                    }
                                                    isConditionExpressionRemovable={
                                                        condition.expressions.length > 1 ||
                                                        ruleInstance.rules.length > 1
                                                    }
                                                    readonly={ readonly }
                                                    submissionAttempted={ submissionAttempted }
                                                />
                                            </Box>
                                        )
                                    ) }
                                </>
                            ) }
                            { ((!readonly && (condition.expressions?.length > 0)) ||
                                (readonly && (condition.expressions?.length !== index))) && (
                                <Divider sx={ { mb: 1, mt: 2 } }>
                                    <Button
                                        disabled={ readonly }
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        onClick={ () =>
                                            addNewRuleConditionExpression(
                                                ruleInstance.id,
                                                condition.id,
                                                AdjoiningOperatorTypes.Or
                                            )
                                        }
                                        startIcon={ !readonly ? <PlusIcon /> : null }
                                    >
                                        { t("rules:buttons.or") }
                                    </Button>
                                </Divider>
                            ) }
                        </Fragment>
                    )
            ) }
        </div>
    );
};

export default ApprovalWorkflowRuleConditions;
