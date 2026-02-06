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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Button from "@oxygen-ui/react/Button";
import useGetRulesMeta from "@wso2is/admin.rules.v1/api/use-get-rules-meta";
import Rules from "@wso2is/admin.rules.v1/components/rules";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ConditionExpressionMetaInterface } from "@wso2is/admin.rules.v1/models/meta";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { RulesProvider } from "@wso2is/admin.rules.v1/providers/rules-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, ContentLoader, Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
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
    onSave: (rule: RuleWithoutIdInterface) => void;
    /**
     * Callback when modal is closed.
     */
    onClose: () => void;
}

/**
 * Props interface for RuleConfigurationModalContent component.
 */
interface RuleConfigurationModalContentPropsInterface {
    operationName: string;
    hasInitialRule: boolean;
    onSave: (rule: RuleWithoutIdInterface) => void;
    onClose: () => void;
    componentId: string;
}

/**
 * Inner component that accesses RulesContext.
 */
const RuleConfigurationModalContent: FunctionComponent<RuleConfigurationModalContentPropsInterface> = (
    props: RuleConfigurationModalContentPropsInterface
): ReactElement => {
    const {
        operationName,
        hasInitialRule,
        onSave,
        onClose,
        componentId
    } = props;

    const { t } = useTranslation();
    const { addNewRule, ruleInstance } = useRulesContext();

    const [ isHasRule, setIsHasRule ] = useState<boolean>(hasInitialRule);
    const [ wasRuleDeleted, setWasRuleDeleted ] = useState<boolean>(false);

    /**
     * Watch for ruleInstance changes to detect when rule is deleted.
     */
    useEffect(() => {
        if (!ruleInstance) {
            // If there was a rule before (either initial or user added one), it was deleted
            if (isHasRule) {
                setWasRuleDeleted(true);
            }
            setIsHasRule(false);
        }
    }, [ ruleInstance ]);

    /**
     * Add a new rule when user clicks configure button.
     */
    useEffect(() => {
        if (isHasRule && !ruleInstance) {
            addNewRule();
        }
    }, [ isHasRule ]);

    /**
     * Handles saving the configured rule.
     */
    const handleSave = (): void => {
        if (ruleInstance) {
            onSave(ruleInstance as RuleWithoutIdInterface);
        } else {
            // Save with null/empty rule if no rule configured
            onSave(null);
        }
    };

    return (
        <>
            <Modal.Content scrolling className="rule-configuration-modal-content">
                { isHasRule ? (
                    <Rules
                        data-componentid={ `${componentId}-rules` }
                        disableLastRuleDelete={ false }
                    />
                ) : (
                    <Alert
                        className="no-rule-alert"
                        icon={ false }
                        data-componentid={ `${componentId}-no-rule-info-box` }
                    >
                        <AlertTitle
                            className="alert-title"
                            data-componentid={ `${componentId}-rule-info-box-title` }
                        >
                            { t("approvalWorkflows:pageLayout.create.ruleConditions.noRuleConfigured.title") }
                        </AlertTitle>
                        <Trans
                            i18nKey="approvalWorkflows:pageLayout.create.ruleConditions.noRuleConfigured.message"
                            values={ { operation: operationName } }
                            components={ [ <Code key="operation">{ operationName }</Code> ] }
                        />
                        <div className="configure-rule-button-container">
                            <Button
                                onClick={ () => setIsHasRule(true) }
                                variant="outlined"
                                size="small"
                                className="secondary-button"
                                data-componentid={ `${componentId}-configure-rule-button` }
                            >
                                { t("approvalWorkflows:pageLayout.create.ruleConditions.configureRuleButton") }
                            </Button>
                        </div>
                    </Alert>
                ) }
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={ onClose }
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    { t("common:cancel") }
                </LinkButton>
                { (isHasRule || wasRuleDeleted) && (
                    <PrimaryButton
                        onClick={ handleSave }
                        data-componentid={ `${componentId}-finish-button` }
                    >
                        { t("common:finish") }
                    </PrimaryButton>
                ) }
            </Modal.Actions>
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
        <Modal
            open
            onClose={ onClose }
            size="small"
            className="rule-configuration-modal"
            data-componentid={ componentId }
        >
            <Modal.Header>
                <Heading as="h3">
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.modal.title", {
                        operation: operation.text
                    }) }
                </Heading>
                <p className="modal-subtitle">
                    { t("approvalWorkflows:pageLayout.create.ruleConditions.modal.subtitle") }
                </p>
            </Modal.Header>

            { isRulesMetaLoading ? (
                <Modal.Content>
                    <ContentLoader dimmer />
                </Modal.Content>
            ) : (
                <RulesProvider
                    conditionExpressionsMetaData={ filteredConditionExpressionsMeta }
                    initialData={ initialRule }
                    isMultipleRules={ false }
                    hidden={ {} }
                >
                    <RuleConfigurationModalContent
                        operationName={ operation.text }
                        hasInitialRule={ !!(initialRule?.rules?.length > 0) }
                        onSave={ onSave }
                        onClose={ onClose }
                        componentId={ componentId }
                    />
                </RulesProvider>
            ) }
        </Modal>
    );
};

export default RuleConfigurationModal;
