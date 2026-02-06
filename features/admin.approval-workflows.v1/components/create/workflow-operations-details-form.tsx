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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogContentText from "@oxygen-ui/react/DialogContentText";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Grid from "@oxygen-ui/react/Grid";
import Switch from "@oxygen-ui/react/Switch";
import TextField from "@oxygen-ui/react/TextField";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import { DataTable, Heading, Hint, TableColumnInterface } from "@wso2is/react-components";
import React, {
    ForwardRefExoticComponent,
    ForwardedRef,
    MutableRefObject,
    ReactElement,
    ReactNode,
    RefAttributes,
    SyntheticEvent,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import AutoCompleteRenderOption from "./auto-complete-render-option";
import RuleConfigurationModal from "./rule-configuration-modal";
import { useGetWorkflowAssociations } from "../../api/use-get-workflow-associations";
import { DropdownPropsInterface, WorkflowOperationsDetailsFormValuesInterface } from "../../models/ui";
import "./general-approval-workflow-details-form.scss";
import "./workflow-operations-details-form.scss";

/**
 * This component renders the workflow operation details form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The workflow operation details form component.
 */
interface WorkflowOperationsDetailsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the form is read-only or not.
     */
    isReadOnly: boolean;
    /**
     * Callback to be called on form submit.
     * @param values - Form values.
     * @returns void
     */
    onSubmit?: (values: WorkflowOperationsDetailsFormValuesInterface) => void;
    /**
     * Initial values for the form.
     */
    initialValues?: Partial<WorkflowOperationsDetailsFormValuesInterface>;
    /**
     * Whether the component is used in edit page or not.
     */
    isEditPage?: boolean;
    /**
     * Callback to be called when operations selection changes.
     * @param operations - Selected operations.
     * @returns void
     */
    onChange?: (operations: DropdownPropsInterface[]) => void;
    /**
     * The workflow ID being edited (optional, only for edit mode).
     */
    workflowId?: string;
    /**
     * Current rule configurations for operations.
     */
    operationRules?: Record<string, RuleWithoutIdInterface>;
    /**
     * Callback to update rule for a specific operation.
     */
    onRuleUpdate?: (operationValue: string, rule: RuleWithoutIdInterface) => void;
}

/**
 * Dropdown options for operations.
 */
export const operations: DropdownPropsInterface[] = [
    { key: "operation1", text: "Add User", value: "ADD_USER" },
    { key: "operation2", text: "Remove User", value: "DELETE_USER" },
    { key: "operation3", text: "Create Role", value: "ADD_ROLE" },
    { key: "operation4", text: "Add or Remove Users from Role", value: "UPDATE_ROLES_OF_USERS" },
    { key: "operation5", text: "Self Register User", value: "SELF_REGISTER_USER" }
    // { key: "operation3", text: "Remove Role", value: "DELETE_ROLE" },
    // { key: "operation4", text: "Remove User Claims", value: "DELETE_USER_CLAIMS" },
    // { key: "operation6", text: "Update Role Name", value: "UPDATE_ROLE_NAME" },
    // { key: "operation8", text: "Update User Attributes", value: "UPDATE_USER_CLAIMS" }
    // { key: "operation9", text: "Manage Users in a Role", value: "UPDATE_USERS_OF_ROLES" }
];

export interface WorkflowOperationsDetailsFormRef {
    triggerSubmit: () => void;
    refreshWorkflowAssociations: () => void;
}

/**
 * This component renders the workflow operations form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The workflow operations form component.
 */
const WorkflowOperationsDetailsForm: ForwardRefExoticComponent<RefAttributes<WorkflowOperationsDetailsFormRef> &
    WorkflowOperationsDetailsPropsInterface> = forwardRef(
        (
            {
                isReadOnly,
                onSubmit,
                initialValues,
                isEditPage,
                onChange,
                workflowId,
                operationRules = {},
                onRuleUpdate,
                ["data-componentid"]: componentId
                = "workflow-operations"
            }: WorkflowOperationsDetailsPropsInterface,
            ref: ForwardedRef<WorkflowOperationsDetailsFormRef>
        ): ReactElement => {

            const { t } = useTranslation();
            const dispatch: Dispatch = useDispatch();

            const triggerFormSubmit: MutableRefObject<() => void> = useRef<(() => void) | null>(null);

            const [ selectedOperations, setSelectedOperations ] = useState<DropdownPropsInterface[]>([]);
            const [ editingOperation, setEditingOperation ] = useState<DropdownPropsInterface | null>(null);
            const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
            const [ confirmClearOperation, setConfirmClearOperation ] = useState<DropdownPropsInterface | null>(null);

            // Fetch existing workflow associations for all operations.
            // For edit mode with workflowId, fetch only current workflow's associations.
            // For create mode or without workflowId, fetch all associations to check conflicts.
            const {
                data: workflowAssociationsData,
                error: workflowAssociationsError,
                mutate: mutateWorkflowAssociations
            } = useGetWorkflowAssociations(null, null, null);

            // Fetch current workflow's associations separately when in edit mode
            const {
                data: currentWorkflowAssociationsData
            } = useGetWorkflowAssociations(
                null,
                null,
                workflowId ? `workflowId eq ${workflowId}` : null,
                !!workflowId
            );

            useImperativeHandle(ref, () => ({
                refreshWorkflowAssociations: () => {
                    mutateWorkflowAssociations();
                },
                triggerSubmit: () => {
                    if (triggerFormSubmit.current) {
                        triggerFormSubmit.current();
                    }
                }
            }));

            useEffect(() => {
                if (initialValues?.matchedOperations) {
                    setSelectedOperations(initialValues?.matchedOperations);
                }
            }, [ initialValues ]);

            /**
             * Refresh workflow associations when initial values change (indicating an update occurred).
             */
            useEffect(() => {
                if (initialValues?.matchedOperations && isEditPage) {
                    mutateWorkflowAssociations();
                }
            }, [ initialValues?.matchedOperations ]);

            const validateForm = ():
                Partial<WorkflowOperationsDetailsFormValuesInterface> => {
                const error: Partial<WorkflowOperationsDetailsFormValuesInterface> = {};

                if (selectedOperations.length === 0) {
                    error.matchedOperations = t(
                        "approvalWorkflows:forms.operations.dropDown.nullValidationErrorMessage"
                    );
                }

                return error;
            };

            /**
             * Show an alert if fetching workflow associations fails.
             */
            useEffect(() => {
                if (workflowAssociationsError) {
                    dispatch(
                        addAlert({
                            description: t(
                                "approvalWorkflows:notifications.fetchWorkflowAssociations.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t("approvalWorkflows:notifications.fetchWorkflowAssociations.genericError.message")
                        })
                    );
                }
            }, [ workflowAssociationsError ]);

            const isOperationDisabled = (operation: DropdownPropsInterface): boolean => {
                if (!workflowAssociationsData?.workflowAssociations) {
                    return false;
                }

                // Check if this operation has any workflow association
                const hasAssociation: boolean = workflowAssociationsData.workflowAssociations.some(
                    (association: { operation: string }) => association.operation === operation.value
                );

                if (!hasAssociation) {
                    return false;
                }

                // If in edit mode with workflowId, check if the operation belongs to current workflow
                if (workflowId && currentWorkflowAssociationsData?.workflowAssociations) {
                    const belongsToCurrentWorkflow: boolean = currentWorkflowAssociationsData.workflowAssociations.some(
                        (association: { operation: string }) => association.operation === operation.value
                    );

                    // Disable if it has an association but doesn't belong to current workflow
                    return !belongsToCurrentWorkflow;
                }

                // In create mode, disable all operations with existing associations
                return true;
            };

            /**
             * Handles the selection change in the autocomplete.
             * @param selectedOperations - The newly selected operations.
             */
            const handleOperationSelectionChange = (
                event: SyntheticEvent,
                newSelectedOperations: DropdownPropsInterface[]
            ): void => {
                setSelectedOperations(newSelectedOperations);
                onChange?.(newSelectedOperations);
            };

            /**
             * Checks if a rule is configured for an operation.
             */
            const isRuleConfigured = useCallback((operationValue: string): boolean => {
                const rule: RuleWithoutIdInterface = operationRules?.[operationValue];

                return rule && rule.rules && rule.rules.length > 0;
            }, [ operationRules ]);

            /**
             * Opens the rule configuration modal for a specific operation.
             */
            const handleOpenRuleModal = (operation: DropdownPropsInterface): void => {
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
                if (editingOperation && onRuleUpdate) {
                    onRuleUpdate(editingOperation.value, rule);
                }
                handleCloseModal();
            };

            /**
             * Handles toggle switch change for engagement column.
             * Toggle ON = open rule modal. Toggle OFF = show confirmation then clear.
             */
            const handleEngagementToggle = (operation: DropdownPropsInterface): void => {
                if (isRuleConfigured(operation.value)) {
                    // Show confirmation dialog before clearing rules
                    setConfirmClearOperation(operation);
                } else {
                    // Open the rule configuration modal directly
                    handleOpenRuleModal(operation);
                }
            };

            /**
             * Confirms clearing rules for an operation.
             */
            const handleConfirmClearRules = (): void => {
                if (confirmClearOperation && onRuleUpdate) {
                    onRuleUpdate(confirmClearOperation.value, null);
                }
                setConfirmClearOperation(null);
            };

            /**
             * Resolves data table columns for the operations table.
             */
            const resolveTableColumns = (): TableColumnInterface[] => [
                {
                    allowToggleVisibility: false,
                    dataIndex: "text",
                    id: "operation",
                    key: "operation",
                    width: 8,
                    render: (operation: DropdownPropsInterface): ReactNode => (
                        <div
                            className="operation-name"
                            data-componentid={ `${componentId}-operation-${operation.value}` }
                        >
                            { operation.text }
                        </div>
                    ),
                    title: t("approvalWorkflows:pageLayout.create.ruleConditions.table.operation")
                },
                {
                    allowToggleVisibility: false,
                    dataIndex: "engagement",
                    id: "engagement",
                    key: "engagement",
                    textAlign: "right",
                    width: 8,
                    render: (operation: DropdownPropsInterface): ReactNode => {
                        const configured: boolean = isRuleConfigured(operation.value);

                        return (
                            <div
                                className="engagement-toggle"
                                data-componentid={ `${componentId}-engagement-${operation.value}` }
                            >
                                <span className={ `engagement-label ${configured ? "configured" : ""}` }>
                                    { configured
                                        ? t("approvalWorkflows:pageLayout.create.ruleConditions.engagement.configured")
                                        : t("approvalWorkflows:pageLayout.create.ruleConditions.engagement.always")
                                    }
                                </span>
                                <Switch
                                    checked={ configured }
                                    onClick={ (e: React.MouseEvent) => {
                                        e.preventDefault();
                                        handleEngagementToggle(operation);
                                    } }
                                    disabled={ isReadOnly }
                                    size="small"
                                    data-componentid={ `${componentId}-engagement-toggle-${operation.value}` }
                                />
                            </div>
                        );
                    },
                    title: t("approvalWorkflows:pageLayout.create.ruleConditions.engagement.column")
                }
            ];

            return (
                <FinalForm
                    onSubmit={ (values: WorkflowOperationsDetailsFormValuesInterface) => {
                        onSubmit?.({
                            ...values,
                            matchedOperations: selectedOperations.map((operation: DropdownPropsInterface) => operation)
                        });
                        // Refresh workflow associations data after form submission
                        mutateWorkflowAssociations();
                    } }
                    initialValues={ initialValues }
                    validate={ validateForm }
                    render={ ({ handleSubmit, errors }: FormRenderProps) => {
                        triggerFormSubmit.current = handleSubmit;

                        return (
                            <form onSubmit={ handleSubmit } className="workflow-operations-details-form">
                                <Grid
                                    xs={ 12 }
                                    sm={ 4 }
                                    md={ 7 }
                                    data-componentid={ `${componentId}-field-role-autocomplete-container` }
                                >
                                    <div className="operations-autocomplete">
                                        <Grid width={ 16 } className="operations-autocomplete-header">
                                            <Heading as="h6">
                                                { t("approvalWorkflows:forms.operations.dropDown.label") }
                                            </Heading>
                                        </Grid>

                                        <Autocomplete
                                            className="operations-autocomplete-input"
                                            data-componentid={ `${componentId}-field-operation-autocomplete` }
                                            multiple
                                            disableCloseOnSelect
                                            options={ operations }
                                            disabled={ isReadOnly }
                                            getOptionLabel={ (option: DropdownPropsInterface) => option.text }
                                            getOptionDisabled={ (option: DropdownPropsInterface) =>
                                                isOperationDisabled(option)
                                            }
                                            value={ selectedOperations }
                                            renderTags={ () => null }
                                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                                <TextField
                                                    { ...params }
                                                    placeholder={
                                                        t("approvalWorkflows:forms.operations.dropDown.placeholder")
                                                    }
                                                    helperText={ errors.matchedOperations }
                                                    error={ !!errors.matchedOperations }
                                                    data-componentid={ `${componentId}-field-operation-search` }
                                                />
                                            ) }
                                            onChange={ handleOperationSelectionChange }
                                            filterOptions={ (
                                                options: DropdownPropsInterface[],
                                                { inputValue }: { inputValue: string }
                                            ) =>
                                                options.filter((option: DropdownPropsInterface) =>
                                                    option.text
                                                        .toLowerCase()
                                                        .includes(inputValue.toLowerCase())
                                                )
                                            }
                                            isOptionEqualToValue={ (
                                                option: DropdownPropsInterface,
                                                value: DropdownPropsInterface
                                            ) => option.value === value.value }
                                            renderOption={ (
                                                props: React.HTMLAttributes<HTMLLIElement>,
                                                option: DropdownPropsInterface,
                                                { selected }: { selected: boolean }
                                            ) => {
                                                const disabled: boolean = isOperationDisabled(option);
                                                const subTitle: string = disabled
                                                    ? t(
                                                        "approvalWorkflows:forms.operations.dropDown." +
                                                        "alreadyAssignedMessage",
                                                        { defaultValue: "Already assigned to another workflow" }
                                                    )
                                                    : undefined;

                                                return (
                                                    <AutoCompleteRenderOption
                                                        selected={ selected }
                                                        displayName={ option.text }
                                                        subTitle={ subTitle }
                                                        disabled={ disabled }
                                                        renderOptionProps={ props }
                                                        data-componentid={
                                                            `${componentId}-option-operation-${option.key}`
                                                        }
                                                    />
                                                );
                                            } }
                                        />
                                        { isEditPage && (<Hint className="hint" compact>
                                            { t("approvalWorkflows:pageLayout.create.stepper.step2.hint") }
                                        </Hint>) }
                                    </div>
                                </Grid>

                                { selectedOperations.length > 0 && (
                                    <Grid xs={ 12 } className="operations-table-container">
                                        <DataTable<DropdownPropsInterface>
                                            data-componentid={ `${componentId}-operations-data-table` }
                                            actions={ [] }
                                            columns={ resolveTableColumns() }
                                            data={ selectedOperations }
                                            onRowClick={ () => void 0 }
                                        />
                                    </Grid>
                                ) }

                                { isModalOpen && editingOperation && (
                                    <RuleConfigurationModal
                                        operation={ editingOperation }
                                        initialRule={ operationRules?.[editingOperation.value] }
                                        onSave={ handleSaveRule }
                                        onClose={ handleCloseModal }
                                        data-componentid={ `${componentId}-rule-config-modal` }
                                    />
                                ) }

                                <Dialog
                                    open={ !!confirmClearOperation }
                                    onClose={ () => setConfirmClearOperation(null) }
                                    data-componentid={ `${componentId}-confirm-clear-dialog` }
                                >
                                    <DialogTitle>
                                        { t("approvalWorkflows:pageLayout.create.ruleConditions.confirmClear.title") }
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            { t(
                                                "approvalWorkflows:pageLayout.create.ruleConditions" +
                                                ".confirmClear.message",
                                                { operation: confirmClearOperation?.text }
                                            ) }
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={ () => setConfirmClearOperation(null) }
                                            variant="text"
                                        >
                                            { t("common:cancel") }
                                        </Button>
                                        <Button
                                            onClick={ handleConfirmClearRules }
                                            variant="contained"
                                            color="error"
                                        >
                                            { t("common:confirm") }
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </form>
                        );
                    } }
                />

            );
        }
    );

export default WorkflowOperationsDetailsForm;
