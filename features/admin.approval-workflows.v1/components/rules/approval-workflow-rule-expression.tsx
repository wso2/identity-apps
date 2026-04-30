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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Fab from "@oxygen-ui/react/Fab";
import FormControl from "@oxygen-ui/react/FormControl";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import { MinusIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import useRulesContext from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import {
    ConditionExpressionMetaInterface,
    ListDataInterface
} from "@wso2is/admin.rules.v1/models/meta";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionInterface,
    ExpressionFieldTypes
} from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    ReactElement,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import WorkflowClaimSelector, { WorkflowClaimOptionInterface } from "./workflow-claim-selector";
import WorkflowConditionValueInput from "./workflow-condition-value-input";
import { APPROVAL_WORKFLOW_RULE_FIELDS } from "../../constants/approval-workflow-constants";
import {
    WorkflowClaimFieldGroupInterface,
    WorkflowClaimGroupFieldType,
    buildWorkflowClaimMetaGroups,
    getClaimUriFromWorkflowClaimField,
    getWorkflowClaimDisplayName,
    getWorkflowClaimGroupFromField,
    isWorkflowClaimGroupField,
    isWorkflowClaimMeta
} from "../../utils/workflow-claim-utils";

/**
 * Field select options interface.
 */
interface FieldSelectionOptionInterface {
    displayName: string;
    name: string;
}

/**
 * Props interface of {@link ApprovalWorkflowRuleExpression}
 */
export interface ApprovalWorkflowRuleExpressionPropsInterface extends IdentifiableComponentInterface {
    expression: ConditionExpressionInterface;
    ruleId: string;
    conditionId: string;
    index: number;
    isConditionLast: boolean;
    isConditionExpressionRemovable: boolean;
    readonly?: boolean;
    submissionAttempted?: boolean;
}

/**
 * Rule expression component for approval workflow conditions.
 * Includes workflow claim group selector support.
 *
 * @param props - Props injected to the component.
 * @returns ApprovalWorkflowRuleExpression component.
 */
const ApprovalWorkflowRuleExpression: FunctionComponent<ApprovalWorkflowRuleExpressionPropsInterface> = ({
    ["data-componentid"]: _componentId = "workflow-condition-expression",
    expression,
    ruleId: _ruleId,
    conditionId: _conditionId,
    index,
    isConditionLast,
    isConditionExpressionRemovable,
    readonly: isReadonly,
    submissionAttempted = false
}: ApprovalWorkflowRuleExpressionPropsInterface): ReactElement => {
    const [ isResourceMissing, setIsResourceMissing ] = useState<boolean>(false);

    const {
        conditionExpressionsMeta,
        updateConditionExpression,
        addNewRuleConditionExpression,
        removeRuleConditionExpression,
        hidden
    } = useRulesContext();

    const { t } = useTranslation();

    const workflowClaimMetaGroups: WorkflowClaimFieldGroupInterface[] = useMemo(
        () => buildWorkflowClaimMetaGroups(conditionExpressionsMeta, {
            initiatorClaim: t("approvalWorkflows:pageLayout.create.ruleConditions.fields.initiatorClaim"),
            userClaim: t("approvalWorkflows:pageLayout.create.ruleConditions.fields.userClaim")
        }),
        [ conditionExpressionsMeta ]
    );

    const workflowClaimMetaGroupMap: Map<string, ConditionExpressionMetaInterface[]> = useMemo(
        () =>
            new Map<string, ConditionExpressionMetaInterface[]>(
                workflowClaimMetaGroups.map(
                    (group: WorkflowClaimFieldGroupInterface) => [ group.field.name, group.claims ]
                )
            ),
        [ workflowClaimMetaGroups ]
    );

    const fieldSelectionOptions: FieldSelectionOptionInterface[] = useMemo(() => {
        const baseFieldOptions: FieldSelectionOptionInterface[] = conditionExpressionsMeta
            ?.filter((item: ConditionExpressionMetaInterface) => !isWorkflowClaimMeta(item))
            ?.filter((item: ConditionExpressionMetaInterface) => !hidden?.conditions?.includes(item.field?.name))
            ?.map((item: ConditionExpressionMetaInterface) => ({
                displayName: item.field?.displayName,
                name: item.field?.name
            })) ?? [];
        const workflowClaimFieldOptions: FieldSelectionOptionInterface[] = workflowClaimMetaGroups
            .filter(
                (group: WorkflowClaimFieldGroupInterface) => !hidden?.conditions?.includes(group.field?.name)
            )
            .map((group: WorkflowClaimFieldGroupInterface) => group.field);

        return [ ...baseFieldOptions, ...workflowClaimFieldOptions ];
    }, [ conditionExpressionsMeta, hidden?.conditions, workflowClaimMetaGroups ]);

    const showValueError: boolean = submissionAttempted && (
        !expression.value?.trim() ||
        (expression.field === APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_AUDIENCE &&
            expression.value === RoleAudienceTypes.APPLICATION)
    );

    const findMetaValuesAgainst: ConditionExpressionMetaInterface = conditionExpressionsMeta.find(
        (expressionMeta: ConditionExpressionMetaInterface) => expressionMeta?.field?.name === expression.field
    );
    const selectedWorkflowClaimGroup: WorkflowClaimGroupFieldType | null = getWorkflowClaimGroupFromField(
        expression.field
    );
    const workflowClaimOptions: WorkflowClaimOptionInterface[] = selectedWorkflowClaimGroup
        ? (workflowClaimMetaGroupMap.get(selectedWorkflowClaimGroup) ?? []).map(
            (claimMeta: ConditionExpressionMetaInterface) => ({
                claimUri: getClaimUriFromWorkflowClaimField(claimMeta?.field?.name),
                fieldName: claimMeta?.field?.name,
                id: claimMeta?.field?.name,
                label: getWorkflowClaimDisplayName(claimMeta?.field?.displayName)
            })
        )
        : [];
    const displayedFieldValue: string = selectedWorkflowClaimGroup ?? expression.field;

    return (
        <Box
            sx={ { position: "relative" } }
            key={ index }
            className="box-container"
            data-componentid={ _componentId }
        >
            { isResourceMissing && (
                <Alert
                    severity="warning"
                    className="alert-warning"
                    sx={ { mb: 2 } }
                    data-componentid={ "workflow-condition-expression-alert" }
                >
                    <AlertTitle className="alert-title">
                        <Trans i18nKey={ t("actions:fields.rules.alerts.resourceNotFound.title") }>
                            The resource linked to this rule is no longer available.
                        </Trans>
                    </AlertTitle>
                    <Trans i18nKey={ t("actions:fields.rules.alerts.resourceNotFound.description") }>
                        Please update to a valid resource.
                    </Trans>
                </Alert>
            ) }
            <FormControl fullWidth size="small">
                <Select
                    disabled={ isReadonly }
                    value={ displayedFieldValue }
                    data-componentid={ "workflow-condition-expression-input-field-select" }
                    MenuProps={ {
                        disablePortal: false,
                        sx: { zIndex: 9999 }
                    } }
                    onChange={ (e: SelectChangeEvent) => {
                        const selectedFieldValue: string = e.target.value;
                        const newField: string | undefined = isWorkflowClaimGroupField(selectedFieldValue)
                            ? workflowClaimMetaGroupMap.get(selectedFieldValue)?.[0]?.field?.name
                            : selectedFieldValue;
                        const meta: ConditionExpressionMetaInterface | undefined =
                            conditionExpressionsMeta.find(
                                (expressionMeta: ConditionExpressionMetaInterface) =>
                                    expressionMeta?.field?.name === newField
                            );

                        const defaultOperator: string = meta?.operators?.[0]?.name || "";

                        if (!newField) {
                            return;
                        }

                        updateConditionExpression(
                            newField,
                            _ruleId,
                            _conditionId,
                            expression.id,
                            ExpressionFieldTypes.Field,
                            true
                        );

                        updateConditionExpression(
                            defaultOperator,
                            _ruleId,
                            _conditionId,
                            expression.id,
                            ExpressionFieldTypes.Operator,
                            true
                        );

                        updateConditionExpression(
                            "",
                            _ruleId,
                            _conditionId,
                            expression.id,
                            ExpressionFieldTypes.Value,
                            true
                        );
                    } }
                >
                    { fieldSelectionOptions.map((item: FieldSelectionOptionInterface, index: number) => (
                        <MenuItem value={ item.name } key={ `${expression.id}-${index}` }>
                            { item.displayName }
                        </MenuItem>
                    )) }
                </Select>
            </FormControl>
            { /* If the selected field is a workflow claim group, display the claim selector. */ }
            { selectedWorkflowClaimGroup && workflowClaimOptions.length > 0 && (
                <FormControl fullWidth size="small" sx={ { mt: 1 } }>
                    <WorkflowClaimSelector
                        claimOptions={ workflowClaimOptions }
                        conditionId={ _conditionId }
                        expressionField={ expression.field }
                        expressionId={ expression.id }
                        expressionOperator={ expression.operator }
                        readonly={ isReadonly }
                        ruleId={ _ruleId }
                    />
                </FormControl>
            ) }
            <FormControl sx={ { mb: 1, minWidth: 120, mt: 1 } } size="small">
                <Select
                    disabled={ isReadonly }
                    value={ expression.operator }
                    data-componentid={ "workflow-condition-expression-input-operator-select" }
                    MenuProps={ {
                        disablePortal: false,
                        sx: { zIndex: 9999 }
                    } }
                    onChange={ (e: SelectChangeEvent) => {
                        updateConditionExpression(
                            e.target.value,
                            _ruleId,
                            _conditionId,
                            expression.id,
                            ExpressionFieldTypes.Operator,
                            true
                        );
                    } }
                >
                    { findMetaValuesAgainst?.operators?.map((item: ListDataInterface, index: number) => (
                        <MenuItem value={ item.name } key={ `${expression.id}-${index}` }>
                            { item.displayName }
                        </MenuItem>
                    )) }
                </Select>
            </FormControl>
            <FormControl fullWidth size="small" error={ showValueError }>
                <WorkflowConditionValueInput
                    conditionId={ _conditionId }
                    expressionId={ expression.id }
                    expressionValue={ expression.value }
                    findMetaValuesAgainst={ findMetaValuesAgainst }
                    metaValue={ findMetaValuesAgainst?.value }
                    ruleId={ _ruleId }
                    setIsResourceMissing={ setIsResourceMissing }
                    hiddenResources={ hidden?.resources }
                    hiddenValues={ hidden?.values }
                    readonly={ isReadonly }
                    showValidationError={ showValueError }
                />
                { showValueError &&
                    findMetaValuesAgainst?.field?.name !== APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_AUDIENCE && (
                    <FormHelperText>
                        { t("approvalWorkflows:pageLayout.create.ruleConditions.fields.valueRequired") }
                    </FormHelperText>
                ) }
            </FormControl>
            { ((!isReadonly) || (isReadonly && !isConditionLast)) && (
                <FormControl sx={ { mt: 1 } } size="small">
                    <Button
                        disabled={ isReadonly }
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={ () => {
                            addNewRuleConditionExpression(
                                _ruleId,
                                _conditionId,
                                AdjoiningOperatorTypes.And,
                                expression.id
                            );
                        } }
                        className="add-button"
                        startIcon={ !isReadonly ? <PlusIcon /> : null }
                    >
                        { t("rules:buttons.and") }
                    </Button>
                </FormControl>
            ) }

            { isConditionExpressionRemovable && !isReadonly && (
                <Fab
                    aria-label="delete"
                    size="small"
                    sx={ { position: "absolute" } }
                    className="remove-button"
                    onClick={ () => removeRuleConditionExpression(_ruleId, expression.id) }
                >
                    <MinusIcon className="remove-button-icon" />
                </Fab>
            ) }
        </Box>
    );
};

export default ApprovalWorkflowRuleExpression;
