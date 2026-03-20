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
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import useGetRulesMeta from "@wso2is/admin.rules.v1/api/use-get-rules-meta";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ConditionExpressionMetaInterface } from "@wso2is/admin.rules.v1/models/meta";
import {
    ConditionExpressionWithoutIdInterface,
    RuleConditionWithoutIdInterface,
    RuleWithoutIdInterface
} from "@wso2is/admin.rules.v1/models/rules";
import { RulesProvider } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    addWorkflowAssociation,
    updateWorkflowAssociationById
} from "../../api/workflow-associations";
import { FLOW_TYPE, OPERATION_FIELD_MAPPING } from "../../constants/approval-workflow-constants";
import { DropdownPropsInterface } from "../../models/ui";
import { WorkflowAssociationPayload } from "../../models/workflow-associations";
import {
    INITIATOR_CLAIMS_FIELD,
    USER_CLAIMS_FIELD,
    getWorkflowClaimGroupFromField,
    isWorkflowClaimMeta
} from "../../utils/workflow-claim-utils";
import ApprovalWorkflowRules from "../rules/approval-workflow-rules";
import "./rule-configuration-modal.scss";

/**
 * Props interface for RuleConfigurationModal component.
 */
interface RuleConfigurationModalPropsInterface extends IdentifiableComponentInterface {
    /**
     * Operation being configured.
     */
    operation: DropdownPropsInterface;
    /**
     * Initial rule configuration (for editing).
     */
    initialRule?: RuleWithoutIdInterface;
    /**
     * Callback when rule is saved.
     */
    onSave: (rule: RuleWithoutIdInterface | null) => void;
    /**
     * Callback when modal is closed.
     */
    onClose: () => void;
    /**
     * Whether the modal is in edit mode (edit page context).
     */
    isEditMode?: boolean;
    /**
     * Association ID if the operation already has a persisted association.
     */
    associationId?: string;
    /**
     * Workflow ID for creating/updating associations.
     */
    workflowId?: string;
    /**
     * Callback after a successful backend save (create or update).
     * @param operationValue - The operation value.
     * @param associationId - The association ID (new or existing).
     * @param rule - The saved rule.
     */
    onAssociationSaved?: (operationValue: string, associationId: string, rule: RuleWithoutIdInterface | null) => void;
}

/**
 * Props interface for RuleConfigurationModalContent component.
 */
interface RuleConfigurationModalContentPropsInterface extends IdentifiableComponentInterface {
    onSave: (rule: RuleWithoutIdInterface | null) => void;
    onClose: () => void;
    operationName: string;
    /**
     * Whether the modal is in edit mode (edit page context).
     */
    isEditMode?: boolean;
    /**
     * The operation value (e.g., "ADD_USER").
     */
    operationValue: string;
    /**
     * Association ID if the operation already has a persisted association.
     */
    associationId?: string;
    /**
     * Workflow ID for creating/updating associations.
     */
    workflowId?: string;
    /**
     * Callback after a successful backend save.
     */
    onAssociationSaved?: (operationValue: string, associationId: string, rule: RuleWithoutIdInterface | null) => void;
}

/**
 * Inner component that accesses RulesContext.
 * Directly shows the rule editor without an intermediate "no rule configured" step.
 * RulesProvider auto-creates a new rule when initialData is not provided.
 */
const RuleConfigurationModalContent: FunctionComponent<RuleConfigurationModalContentPropsInterface> = (
    props: RuleConfigurationModalContentPropsInterface
): ReactElement => {
    const {
        onSave,
        onClose,
        operationName,
        isEditMode,
        operationValue,
        associationId,
        workflowId,
        onAssociationSaved,
        ["data-componentid"]: componentId = "rule-configuration-modal-content"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { ruleInstance, removeRule } = useRulesContext();
    const [ pendingDeleteRuleId, setPendingDeleteRuleId ] = useState<string | null>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ submissionAttempted, setSubmissionAttempted ] = useState<boolean>(false);

    /**
     * Handles saving the configured rule.
     * In create mode: saves locally. In edit mode: persists to backend.
     */
    const handleSave = (): void => {
        const rule: RuleWithoutIdInterface | null = ruleInstance
            ? (ruleInstance as RuleWithoutIdInterface)
            : null;

        const hasEmptyExpressionValues: boolean = !!(rule?.rules?.some(
            (condition: RuleConditionWithoutIdInterface) =>
                condition.expressions?.some(
                    (expr: ConditionExpressionWithoutIdInterface) => !expr.value?.trim()
                )
        ));

        if (hasEmptyExpressionValues) {
            setSubmissionAttempted(true);

            return;
        }

        if (!isEditMode) {
            onSave(rule);

            return;
        }

        setIsSubmitting(true);

        const payload: WorkflowAssociationPayload = {
            associationName: `Association for ${operationValue}`,
            operation: operationValue,
            workflowId: workflowId,
            ...(rule && rule.rules && rule.rules.length > 0 ? { rule } : {})
        };

        const apiCall: Promise<any> = associationId
            ? updateWorkflowAssociationById(associationId, payload)
            : addWorkflowAssociation(payload);

        apiCall
            .then((response: any) => {
                const savedAssociationId: string = associationId || response?.id;

                onSave(rule);
                onAssociationSaved?.(operationValue, savedAssociationId, rule);
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "approvalWorkflows:notifications.updateApprovalWorkflow.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "approvalWorkflows:notifications.updateApprovalWorkflow.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Intercepts the trash button click to show a confirmation modal.
     */
    const handleRemoveRuleRequest = (ruleId: string): void => {
        setPendingDeleteRuleId(ruleId);
    };

    /**
     * Confirms removal of the rule after user accepts the confirmation.
     * In edit mode with an existing association, updates the backend to remove the rule.
     */
    const handleConfirmRemoveRule = (): void => {
        if (!pendingDeleteRuleId) {
            return;
        }

        removeRule(pendingDeleteRuleId);

        if (!isEditMode || !associationId) {
            onSave(null);
            setPendingDeleteRuleId(null);

            return;
        }

        setIsSubmitting(true);

        const payload: WorkflowAssociationPayload = {
            associationName: `Association for ${operationValue}`,
            operation: operationValue,
            rule: {} as RuleWithoutIdInterface,
            workflowId: workflowId
        };

        updateWorkflowAssociationById(associationId, payload)
            .then(() => {
                onSave(null);
                onAssociationSaved?.(operationValue, associationId, null);
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "approvalWorkflows:notifications.updateApprovalWorkflow.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "approvalWorkflows:notifications.updateApprovalWorkflow.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                setIsSubmitting(false);
                setPendingDeleteRuleId(null);
            });
    };

    return (
        <>
            <DialogContent
                className="rule-configuration-modal-content"
                dividers
            >
                <ApprovalWorkflowRules
                    data-componentid={ `${componentId}-rules` }
                    disableLastRuleDelete={ false }
                    onRemoveRule={ handleRemoveRuleRequest }
                    executeText="Engage"
                    submissionAttempted={ submissionAttempted }
                />
            </DialogContent>
            <DialogActions>
                <Box className="rule-configuration-modal-actions">
                    <Stack direction="row" justifyContent="space-between">
                        <Button
                            variant="text"
                            onClick={ onClose }
                            data-componentid={ `${componentId}-cancel-button` }
                        >
                            { t("common:cancel") }
                        </Button>
                        <Button
                            variant="contained"
                            onClick={ handleSave }
                            disabled={ isSubmitting }
                            loading={ isSubmitting }
                            data-componentid={ `${componentId}-finish-button` }
                        >
                            { isEditMode ? t("common:update") : t("common:finish") }
                        </Button>
                    </Stack>
                </Box>
            </DialogActions>
            <ConfirmationModal
                onClose={ () => setPendingDeleteRuleId(null) }
                type="negative"
                open={ !!pendingDeleteRuleId }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ () => setPendingDeleteRuleId(null) }
                onPrimaryActionClick={ handleConfirmRemoveRule }
                data-componentid={ `${componentId}-delete-rule-confirmation` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${componentId}-delete-rule-confirmation-header` }
                >
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.confirmDelete.title") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${componentId}-delete-rule-confirmation-message` }
                >
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.confirmDelete.message", {
                        operation: operationName
                    }) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${componentId}-delete-rule-confirmation-content` }
                >
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.confirmDelete.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Modal component for configuring rules for a specific workflow operation.
 */
const RuleConfigurationModal: FunctionComponent<RuleConfigurationModalPropsInterface> = (
    props: RuleConfigurationModalPropsInterface
): ReactElement => {
    const {
        operation,
        initialRule,
        onSave,
        onClose,
        isEditMode,
        associationId,
        workflowId,
        onAssociationSaved,
        ["data-componentid"]: componentId = "rule-configuration-modal"
    } = props;

    const { t } = useTranslation();

    // Fetch rules metadata for approvalWorkflow flow.
    const {
        data: rulesMetaData,
        isLoading: isRulesMetaLoading
    } = useGetRulesMeta(FLOW_TYPE, true);

    /**
     * Filter condition expressions metadata based on operation type.
     */
    const filteredConditionExpressionsMeta: ConditionExpressionMetaInterface[] = useMemo(() => {
        if (!rulesMetaData) {
            return [];
        }

        const allowedFields: string[] = OPERATION_FIELD_MAPPING[operation.value] || [];
        const supportsUserClaims: boolean = allowedFields.includes(USER_CLAIMS_FIELD);
        const supportsInitiatorClaims: boolean = allowedFields.includes(INITIATOR_CLAIMS_FIELD);

        return rulesMetaData
            .filter((meta: ConditionExpressionMetaInterface) => {
                if (allowedFields.includes(meta.field.name)) {
                    return true;
                }

                const claimGroup: string | null = getWorkflowClaimGroupFromField(meta?.field?.name);

                if (claimGroup === USER_CLAIMS_FIELD) {
                    return supportsUserClaims;
                }

                if (claimGroup === INITIATOR_CLAIMS_FIELD) {
                    return supportsInitiatorClaims;
                }

                return false;
            })
            .sort((first: ConditionExpressionMetaInterface, second: ConditionExpressionMetaInterface) => {
                const firstIsWorkflowClaim: boolean = isWorkflowClaimMeta(first);
                const secondIsWorkflowClaim: boolean = isWorkflowClaimMeta(second);

                if (firstIsWorkflowClaim === secondIsWorkflowClaim) {
                    return 0;
                }

                return firstIsWorkflowClaim ? 1 : -1;
            });
    }, [ rulesMetaData, operation.value ]);

    return (
        <Dialog
            open
            onClose={ onClose }
            maxWidth="sm"
            fullWidth
            className="rule-configuration-modal"
            data-componentid={ componentId }
        >
            <DialogTitle>
                <Typography variant="h4">
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.modal.title", {
                        operation: operation.text
                    }) }
                </Typography>
                <Typography variant="body2">
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.modal.subtitle") }
                </Typography>
            </DialogTitle>

            { isRulesMetaLoading ? (
                <DialogContent>
                    <ContentLoader dimmer />
                </DialogContent>
            ) : (
                <RulesProvider
                    conditionExpressionsMetaData={ filteredConditionExpressionsMeta }
                    initialData={ initialRule }
                    isMultipleRules={ false }
                    hidden={ {} }
                >
                    <RuleConfigurationModalContent
                        onSave={ onSave }
                        onClose={ onClose }
                        operationName={ operation.text }
                        operationValue={ operation.value }
                        isEditMode={ isEditMode }
                        associationId={ associationId }
                        workflowId={ workflowId }
                        onAssociationSaved={ onAssociationSaved }
                        data-componentid={ componentId }
                    />
                </RulesProvider>
            ) }
        </Dialog>
    );
};

export default RuleConfigurationModal;
