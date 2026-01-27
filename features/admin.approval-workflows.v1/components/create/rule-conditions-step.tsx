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

import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DataTable, TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label, SemanticICONS } from "semantic-ui-react";
import RuleConfigurationModal from "./rule-configuration-modal";
import { DropdownPropsInterface } from "../../models/ui";
import "./rule-conditions-step.scss";

/**
 * Props interface for RuleConditionsStep component.
 */
interface RuleConditionsStepPropsInterface extends IdentifiableComponentInterface {
    /**
     * Selected operations to configure rules for.
     */
    selectedOperations: DropdownPropsInterface[];
    /**
     * Current rule configurations for operations.
     */
    operationRules: Record<string, RuleWithoutIdInterface>;
    /**
     * Callback to update rule for a specific operation.
     */
    onRuleUpdate: (operationValue: string, rule: RuleWithoutIdInterface) => void;
    /**
     * Whether the form is in read-only mode.
     */
    isReadOnly?: boolean;
}

/**
 * Component for configuring rules per operation in approval workflow creation.
 */
const RuleConditionsStep: FunctionComponent<RuleConditionsStepPropsInterface> = (
    props: RuleConditionsStepPropsInterface
): ReactElement => {
    const {
        selectedOperations,
        operationRules,
        onRuleUpdate,
        isReadOnly = false,
        ["data-componentid"]: componentId = "rule-conditions-step"
    } = props;

    const { t } = useTranslation();

    const [ editingOperation, setEditingOperation ] = useState<DropdownPropsInterface | null>(null);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);

    /**
     * Opens the rule configuration modal for a specific operation.
     */
    const handleEditRule = (operation: DropdownPropsInterface): void => {
        setEditingOperation(operation);
        setIsModalOpen(true);
    };

    /**
     * Closes the rule configuration modal.
     */
    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setEditingOperation(null);
    };

    /**
     * Saves the configured rule for the editing operation.
     */
    const handleSaveRule = (rule: RuleWithoutIdInterface): void => {
        if (editingOperation) {
            onRuleUpdate(editingOperation.value, rule);
        }
        handleCloseModal();
    };

    /**
     * Checks if a rule is configured for an operation.
     */
    const isRuleConfigured = (operationValue: string): boolean => {
        const rule: RuleWithoutIdInterface = operationRules?.[operationValue];

        return rule && rule.rules && rule.rules.length > 0;
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (isReadOnly) {
            return [];
        }

        return [
            {
                "data-componentid": `${componentId}-list-item-edit-button`,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, operation: DropdownPropsInterface): void => {
                    handleEditRule(operation);
                },
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "text",
            id: "operation",
            key: "operation",
            width: 6,
            render: (operation: DropdownPropsInterface): ReactNode => (
                <div className="operation-name" data-componentid={ `${componentId}-operation-${operation.value}` }>
                    { operation.text }
                </div>
            ),
            title: t("approvalWorkflows:pageLayout.create.ruleConditions.table.operation")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "status",
            id: "status",
            key: "status",
            textAlign: "center",
            width: 6,
            render: (operation: DropdownPropsInterface): ReactNode => (
                isRuleConfigured(operation.value) ? (
                    <Label size="mini" className="configured-label">
                        { t("approvalWorkflows:pageLayout.create.ruleConditions.configured") }
                    </Label>
                ) : (
                    <Label size="mini">
                        { t("approvalWorkflows:pageLayout.create.ruleConditions.notConfigured") }
                    </Label>
                )
            ),
            title: t("approvalWorkflows:pageLayout.create.ruleConditions.table.rules")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            width: 4,
            title: t("approvalWorkflows:pageLayout.create.ruleConditions.table.actions")
        }
    ];

    return (
        <div className="rule-conditions-step" data-componentid={ componentId }>
            <DataTable<DropdownPropsInterface>
                data-componentid={ `${componentId}-data-table` }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ selectedOperations }
                onRowClick={ (e: SyntheticEvent, operation: DropdownPropsInterface): void => {
                    if (!isReadOnly) {
                        handleEditRule(operation);
                    }
                } }
            />

            { isModalOpen && editingOperation && (
                <RuleConfigurationModal
                    operation={ editingOperation }
                    initialRule={ operationRules?.[editingOperation.value] }
                    onSave={ handleSaveRule }
                    onClose={ handleCloseModal }
                    data-componentid={ `${componentId}-modal` }
                />
            ) }
        </div>
    );
};

export default RuleConditionsStep;
