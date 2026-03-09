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
import Rules from "@wso2is/admin.rules.v1/components/rules";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ConditionExpressionMetaInterface } from "@wso2is/admin.rules.v1/models/meta";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { RulesProvider } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FLOW_TYPE, OPERATION_FIELD_MAPPING } from "../../constants/approval-workflow-constants";
import { DropdownPropsInterface } from "../../models/ui";
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
}

/**
 * Props interface for RuleConfigurationModalContent component.
 */
interface RuleConfigurationModalContentPropsInterface extends IdentifiableComponentInterface {
    onSave: (rule: RuleWithoutIdInterface | null) => void;
    onClose: () => void;
    operationName: string;
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
        ["data-componentid"]: componentId = "rule-configuration-modal-content"
    } = props;

    const { t } = useTranslation();
    const { ruleInstance, removeRule } = useRulesContext();
    const [ pendingDeleteRuleId, setPendingDeleteRuleId ] = useState<string | null>(null);

    /**
     * Handles saving the configured rule.
     */
    const handleSave = (): void => {
        if (ruleInstance) {
            onSave(ruleInstance as RuleWithoutIdInterface);
        } else {
            onSave(null);
        }
    };

    /**
     * Intercepts the trash button click to show a confirmation modal.
     */
    const handleRemoveRuleRequest = (ruleId: string): void => {
        setPendingDeleteRuleId(ruleId);
    };

    /**
     * Confirms removal of the rule after user accepts the confirmation.
     * After removing the rule, save the empty state and close the modal.
     */
    const handleConfirmRemoveRule = (): void => {
        if (pendingDeleteRuleId) {
            removeRule(pendingDeleteRuleId);
            onSave(null);
        }
        setPendingDeleteRuleId(null);
    };

    return (
        <>
            <DialogContent
                className="rule-configuration-modal-content"
                dividers
            >
                <Rules
                    data-componentid={ `${componentId}-rules` }
                    disableLastRuleDelete={ false }
                    onRemoveRule={ handleRemoveRuleRequest }
                    executeText="Engage"
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
                            data-componentid={ `${componentId}-finish-button` }
                        >
                            { t("common:finish") }
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
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.confirmClear.title") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${componentId}-delete-rule-confirmation-message` }
                >
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.confirmClear.message", {
                        operation: operationName
                    }) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${componentId}-delete-rule-confirmation-content` }
                >
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.confirmClear.content") }
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
        ["data-componentid"]: componentId = "rule-configuration-modal"
    } = props;

    const { t } = useTranslation();

    // Fetch rules metadata for approvalWorkflow flow
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

        return rulesMetaData.filter((meta: ConditionExpressionMetaInterface) => {
            return allowedFields.includes(meta.field.name);
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
                        data-componentid={ componentId }
                    />
                </RulesProvider>
            ) }
        </Dialog>
    );
};

export default RuleConfigurationModal;
