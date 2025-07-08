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
import Divider from "@oxygen-ui/react/Divider";
import Grid from "@oxygen-ui/react/Grid";
import Skeleton from "@oxygen-ui/react/Skeleton";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Heading,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import "../../pages/approval-workflow-edit-page.scss";
import { Dispatch } from "redux";
import { deleteApprovalWorkflowById, updateApprovalWorkflow } from "../../api/approval-workflow";
import { useGetWorkflowAssociations } from "../../api/use-get-workflow-associations";
import {
    addWorkflowAssociation,
    deleteWorkflowAssociationById
} from "../../api/workflow-associations";
import {
    ApprovalWorkflowPayload,
    OptionDetails,
    WorkflowDetails,
    WorkflowTemplate,
    WorkflowTemplateParameters
} from "../../models/approval-workflows";
import {
    ApprovalSteps,
    ApprovalWorkflowFormDataInterface,
    ConfigurationsFormValuesInterface,
    DropdownPropsInterface,
    GeneralDetailsFormValuesInterface,
    WorkflowOperationsDetailsFormValuesInterface
} from "../../models/ui";
import { WorkflowAssociationPayload, WorkflowOperations } from "../../models/workflow-associations";
import ConfigurationsForm, { ConfigurationsFormRef } from "../create/configuration-details-form";
import GeneralApprovalWorkflowDetailsForm, {
    GeneralApprovalWorkflowDetailsFormRef
} from "../create/general-approval-workflow-details-form";
import WorkflowOperationsDetailsForm, {
    WorkflowOperationsDetailsFormRef,
    operations
} from "../create/workflow-operations-details-form";

/**
 * Prop types for the approval workflow edit component.
 */
interface EditApprovalWorkflowPropsInterface extends IdentifiableComponentInterface {
    /**
     * Approval workflow details.
     */
    approvalWorkflowDetails: WorkflowDetails;
    /**
     * ID of the approval workflow.
     */
    approvalWorkflowId: string;
    /**
     * Whether the form is read-only.
     */
    isReadOnly?: boolean;
    /**
     * Whether the approval workflow details are currently loading.
     */
    isLoading?: boolean;
    /**
     * Callback to refresh or mutate the approval workflow details.
     */
    mutateApprovalWorkflowDetails?: () => void;
}

/**
 * This renders a component to edit an approval workflow.
 *
 * @param props - Props injected to the component.
 * @returns Edit approval workflow component.
 */
const EditApprovalWorkflow: FunctionComponent<EditApprovalWorkflowPropsInterface> = (
    props: EditApprovalWorkflowPropsInterface
): ReactElement => {
    const {
        approvalWorkflowDetails,
        approvalWorkflowId,
        isReadOnly = false,
        mutateApprovalWorkflowDetails,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const workflowIdFilter: string = `workflowId eq ${approvalWorkflowId}`;

    const generalApprovalWorkflowDetailsFormRef: MutableRefObject<GeneralApprovalWorkflowDetailsFormRef> = useRef<
        GeneralApprovalWorkflowDetailsFormRef
    >(null);
    const workflowOperationsDetailsFormRef: MutableRefObject<WorkflowOperationsDetailsFormRef> = useRef<
        WorkflowOperationsDetailsFormRef
    >(null);
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<ConfigurationsFormRef>(null);

    const [ showApprovalWorkflowDeleteConfirmation, setShowApprovalWorkflowDeleteConfirmationModal ] = useState(false);
    const [ approvalProcessFormData, setApprovalProcessFormData ] = useState<ApprovalWorkflowFormDataInterface>(null);
    const [ operationDetails, setOperationDetails ] = useState<WorkflowOperations[]>(null);
    const [ matchedOperations, setMatchedOperations ] = useState<WorkflowOperationsDetailsFormValuesInterface>(null);
    const [ hasErrors, setHasErrors ] = useState<boolean>(false);
    const [ stepValues, setStepValues ] = useState<ConfigurationsFormValuesInterface>();
    const [ isGeneralDetailsSubmitted, setGeneralDetailsSubmitted ] = useState<boolean>(false);

    const {
        data: workflowAssociationDetails,
        isLoading: isWorkflowAssociationDetailsRequestLoading,
        error: workflowAssociationDetailsRequestError,
        mutate: mutateWorkflowAssociationDetails
    } = useGetWorkflowAssociations(null, null, workflowIdFilter);

    /**
     * Populate `operationDetails` state when workflow association details are fetched.
     */
    useEffect(() => {
        if (workflowAssociationDetails) {
            const ops: WorkflowOperations[] = workflowAssociationDetails.workflowAssociations.map(
                (association: { id: string; operation: string }) => ({
                    associationId: association.id,
                    operation: association.operation
                })
            );

            setOperationDetails(ops);
        }
    }, [ workflowAssociationDetails ]);

    /**
     * Show an alert if fetching workflow association details fails.
     */
    useEffect(() => {
        if (workflowAssociationDetailsRequestError) {
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
    }, [ workflowAssociationDetailsRequestError ]);

    /**
     * Update matched operations state based on selected operations and existing associations.
     */
    useEffect(() => {
        if (!operationDetails || !operations) {
            return;
        }

        const matchedOps: DropdownPropsInterface[] = operations.filter((operation: DropdownPropsInterface) =>
            operationDetails.some((op: WorkflowOperations) => op.operation === operation.value)
        );

        setMatchedOperations((prev: WorkflowOperationsDetailsFormValuesInterface) => ({
            ...prev,
            matchedOperations: matchedOps
        }));
    }, [ operationDetails, operations ]);

    /**
     * Initialize the approval process form data from approval workflow details.
     */
    useEffect(() => {
        if (!approvalWorkflowDetails) return;

        const steps: ApprovalSteps[] = approvalWorkflowDetails.template?.steps?.map(
            (step: WorkflowTemplateParameters) => {
                const stepData: ApprovalSteps = {
                    roles: [],
                    users: []
                };

                step.options?.forEach((option: OptionDetails) => {
                    if (option.entity === "roles") {
                        stepData.roles = option.values;
                    } else if (option.entity === "users") {
                        stepData.users = option.values;
                    }
                });

                return stepData;
            }
        ) ?? [];

        setApprovalProcessFormData({
            configurations: {
                approvalSteps: steps
            },
            generalDetails: {
                description: approvalWorkflowDetails.description,
                engine: approvalWorkflowDetails.engine,
                name: approvalWorkflowDetails.name
            },
            workflowOperationsDetails: {
                matchedOperations: []
            }
        });

        setStepValues({ approvalSteps: steps });
    }, [ approvalWorkflowDetails ]);

    /**
     * Trigger configuration form submit only after general form
     * submission is complete and approval process form data is updated.
     */
    useEffect(()=>{
        if (approvalProcessFormData && isGeneralDetailsSubmitted) {
            // Only now, after general form submit is successful, trigger config form submit.
            configurationsFormRef?.current?.triggerSubmit();
            setGeneralDetailsSubmitted(false);
        }
    },[ approvalProcessFormData, isGeneralDetailsSubmitted ]);

    /**
     * Handles submission of the general details form.
     */
    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        const updatedData: any = {
            ...approvalProcessFormData,
            generalDetails: values
        };

        setApprovalProcessFormData(updatedData);
        setGeneralDetailsSubmitted(true);
    };

    /**
     * Handles submission of the configuration form.
     */
    const onConfigurationDetailsFormSubmit = (values: ConfigurationsFormValuesInterface) => {
        const updatedData: any = {
            ...approvalProcessFormData,
            configurations: values
        };

        setApprovalProcessFormData(updatedData);
        createPayload(updatedData);
    };

    /**
     * Creates the approval workflow payload and triggers update.
     */
    const createPayload = (updatedApprovalProcessFormData: ApprovalWorkflowFormDataInterface) => {
        const workflowTemplate: WorkflowTemplate = {
            name: "MultiStepApprovalTemplate",
            steps: updatedApprovalProcessFormData.configurations.approvalSteps.map(
                (step: ApprovalSteps, index: number) => ({
                    options: [
                        {
                            entity: "roles",
                            values: step.roles
                        },
                        {
                            entity: "users",
                            values: step.users
                        }
                    ].filter((option: { entity: string; values: string[] }) => option.values.length > 0),
                    step: index + 1
                })
            )
        };

        const approvalWorkflowPayload: ApprovalWorkflowPayload = {
            description: updatedApprovalProcessFormData.generalDetails.description,
            engine: "WorkflowEngine",
            name: updatedApprovalProcessFormData.generalDetails.name,
            template: workflowTemplate
        };

        handleApprovalWorkflowUpdate(approvalWorkflowPayload);
    };

    /**
     * Sends the approval workflow update request.
     */
    const handleApprovalWorkflowUpdate = (approvalWorkflowPayload: ApprovalWorkflowPayload): void => {
        updateApprovalWorkflow(approvalWorkflowId, approvalWorkflowPayload)
            .then(() => {
                mutateApprovalWorkflowDetails?.();
                dispatch(
                    addAlert({
                        description: t(
                            "approvalWorkflows:notifications.updateApprovalWorkflow.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t("approvalWorkflows:notifications.updateApprovalWorkflow.success.message")
                    })
                );
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "approvalWorkflows:notifications.updateApprovalWorkflow" + ".error.description",
                                { description: error.response.data.detail }
                            ),
                            level: AlertLevels.ERROR,
                            message: t("approvalWorkflows:notifications.updateApprovalWorkflow.error.description")
                        })
                    );
                } else {
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
                }
            });
    };

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Sends a request to delete the approval workflow.
     */
    const handleApprovalWorkflowDelete = (approvalWorkflowId: string): void => {
        deleteApprovalWorkflowById(approvalWorkflowId)
            .then(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "deleteApprovalWorkflow.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.approvalWorkflows.notifications.deleteApprovalWorkflow.success.message"
                    )
                });
                history.push(AppConstants.getPaths().get("APPROVAL_WORKFLOWS"));
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "deleteApprovalWorkflow.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.approvalWorkflows.notifications." +
                            "deleteApprovalWorkflow.error.message"
                    )
                });
            });
    };

    /**
     * Validates configuration form steps and submits them if valid.
     */
    const handleConfigSubmit = (values: ConfigurationsFormValuesInterface) => {
        const hasInvalidSteps: boolean = values.approvalSteps.some(
            (step: ApprovalSteps) => step.users.length === 0 && step.roles.length === 0
        );

        if (hasInvalidSteps) {
            setHasErrors(true);
            setStepValues(values);

            return;
        }
        setHasErrors(false);
        onConfigurationDetailsFormSubmit(values);
    };

    /**
     * Handles submission of the workflow operations details form.
     * Detects added and removed operations and syncs associations.
     */
    const onWorkflowOperationsDetailsFormSubmit = (values: WorkflowOperationsDetailsFormValuesInterface) => {
        const currentOperations: any = values.matchedOperations.map((op: DropdownPropsInterface) => op.value);

        // Find newly added operations
        const addedOperations: any = currentOperations.filter(
            (op: string) => !operationDetails.some((prev: WorkflowOperations) => prev.operation === op)
        );

        // Find deleted operations WITH their associationId
        const deletedOperations: any = operationDetails.filter(
            (prev: WorkflowOperations) => !currentOperations.includes(prev.operation)
        );

        for (const operation of addedOperations) {
            const associationName: string = `Association for ${operation ?? operation}`;
            const workflowAssociationPayload: WorkflowAssociationPayload = {
                associationName,
                operation: operation,
                workflowId: approvalWorkflowId
            };

            handleWorkflowAssociationsRegistration(workflowAssociationPayload);
        }

        for (const operation of deletedOperations) {
            handleWorkflowAssociationDeletion(operation.associationId);
        }
    };

    /**
     * Sends request to register a new workflow-operation association.
     */
    const handleWorkflowAssociationsRegistration = (workflowAssociationPayload: WorkflowAssociationPayload): void => {
        addWorkflowAssociation(workflowAssociationPayload)
            .then(() => {
                mutateWorkflowAssociationDetails();
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "approvalWorkflows:notifications.addWorkflowAssociation.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t(
                        "approvalWorkflows:notifications.addWorkflowAssociation.genericError.description"
                    )
                });
            });
    };

    /**
     * Sends request to delete a workflow-operation association by ID.
     */
    const handleWorkflowAssociationDeletion = (associationId: string): void => {
        deleteWorkflowAssociationById(associationId)
            .then(() => {
                mutateWorkflowAssociationDetails();
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "approvalWorkflows:notifications.deleteWorkflowAssociation.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "approvalWorkflows:notifications.deleteWorkflowAssociation.genericError.description"
                    )
                });
            });
    };

    /**
     * Handles update button click.
     */
    const handleUpdateButtonClick = (): void => {
        const isEdited: boolean = generalApprovalWorkflowDetailsFormRef?.current?.isFormEdited();

        if (isEdited) {
            generalApprovalWorkflowDetailsFormRef.current.triggerSubmit();
        } else {
            configurationsFormRef?.current?.triggerSubmit();
        }
        workflowOperationsDetailsFormRef?.current?.triggerSubmit();
    };

    const renderLoadingSkeleton = (): ReactElement => {
        return (
            <div data-componentid={ `${componentId}-loading-skeleton` }>
                <Skeleton component="h1" width={ "40%" } />
                <Skeleton />
                <br />
                <Skeleton component="h1" width={ "40%" } />
                <Skeleton />
            </div>
        );
    };

    /**
     * The following function  renders the approval workflow delete confirmation modal.
     *
     * @returns delete confirmation modal.
     */
    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            data-componentid={ `${componentId}-delete-confirmation-modal` }
            onClose={ (): void => setShowApprovalWorkflowDeleteConfirmationModal(false) }
            type="negative"
            open={ showApprovalWorkflowDeleteConfirmation }
            assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
            assertionType="checkbox"
            primaryAction="Confirm"
            secondaryAction="Cancel"
            onSecondaryActionClick={ (): void => setShowApprovalWorkflowDeleteConfirmationModal(false) }
            onPrimaryActionClick={ (): void => {
                handleApprovalWorkflowDelete(approvalWorkflowId);
                setShowApprovalWorkflowDeleteConfirmationModal(false);
            } }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-delete-confirmation-modal-header` }>
                { t("roles:list.confirmations.deleteItem.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${componentId}-delete-confirmation-modal-message` }
            >
                { t("roles:list.confirmations.deleteItem.message", { type: "approval workflow" }) }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-delete-confirmation-modal-content` }>
                { t("roles:list.confirmations.deleteItem.content", { type: "approval workflow" }) }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        <>
            <EmphasizedSegment padded="very">
                { isWorkflowAssociationDetailsRequestLoading && !approvalWorkflowDetails ? (
                    renderLoadingSkeleton()
                ) : (
                    <>
                        <div className="workflow-model-general-settings">
                            <GeneralApprovalWorkflowDetailsForm
                                ref={ generalApprovalWorkflowDetailsFormRef }
                                isReadOnly={ isReadOnly }
                                initialValues={ approvalProcessFormData?.generalDetails ?? {} }
                                approvalWorkflowId={ approvalWorkflowId }
                                onSubmit={ onGeneralDetailsFormSubmit }
                                data-componentid={ `${componentId}-general-details-form` }
                            />
                        </div>

                        <Divider className="divider-container" />
                        <div className="workflow-association-operations">
                            <WorkflowOperationsDetailsForm
                                ref={ workflowOperationsDetailsFormRef }
                                isReadOnly={ isReadOnly }
                                initialValues={ matchedOperations }
                                onSubmit={ onWorkflowOperationsDetailsFormSubmit }
                                data-componentid={ `${componentId}-general-details-form` }
                                isEditPage={ true }
                            />
                        </div>

                        <Divider className="divider-container" />

                        <div className="workflow-model-configuration-settings">
                            <Grid className="operations-autocomplete-header">
                                <Heading as="h6">{ "Approval Steps" }</Heading>
                            </Grid>
                            <ConfigurationsForm
                                ref={ configurationsFormRef }
                                isReadOnly={ isReadOnly }
                                initialValues={ stepValues }
                                onSubmit={ handleConfigSubmit }
                                hasErrors={ hasErrors }
                                isEditPage={ true }
                                data-componentid={ `${componentId}-configurations-form` }
                            />
                        </div>

                        <PrimaryButton
                            type="submit"
                            disabled={ isReadOnly }
                            onClick={ () => {
                                handleUpdateButtonClick();
                            } }
                            data-componentid={ `${componentId}-update-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </>
                ) }
            </EmphasizedSegment>
            <DangerZoneGroup
                sectionHeader={ t("common:dangerZone") }
                data-componentid={ `${componentId}-danger-zone-group` }
            >
                <DangerZone
                    actionTitle={ t("approvalWorkflows:form.dangerZone.delete.actionTitle") }
                    header={ t("approvalWorkflows:form.dangerZone.delete.header") }
                    subheader={ t("approvalWorkflows:form.dangerZone.delete.subheader") }
                    onActionClick={ () => setShowApprovalWorkflowDeleteConfirmationModal(true) }
                    data-componentid={ `${componentId}-danger-zone` }
                />
            </DangerZoneGroup>
            { showApprovalWorkflowDeleteConfirmation && deleteConfirmation() }
        </>
    );
};

export default EditApprovalWorkflow;
