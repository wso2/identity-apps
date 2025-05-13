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
import Button from "@oxygen-ui/react/Button";
import Step from "@oxygen-ui/react/Step";
import StepContent from "@oxygen-ui/react/StepContent";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import "./approval-workflow-create-page.scss";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { addApprovalWorkflow } from "../api";
import { addWorkflowAssociation } from "../api/workflow-associations";
import ConfigurationsForm, { ConfigurationsFormRef } from "../components/create/configuration-details-form";
import GeneralApprovalWorkflowDetailsForm, {
    GeneralApprovalWorkflowDetailsFormRef
} from "../components/create/general-approval-workflow-details-form";
import WorkflowOperationsDetailsForm, {
    WorkflowOperationsDetailsFormRef
} from "../components/create/workflow-operations-details-form";
import { ApprovalWorkflowPayload, OptionDetails, WorkflowTemplate } from "../models";
import {
    ApprovalSteps,
    ConfigurationsFormValuesInterface,
    DropdownPropsInterface,
    GeneralDetailsFormValuesInterface,
    ApprovalWorkflowFormDataInterface,
    WorkflowOperationsDetailsFormValuesInterface
} from "../models/ui";
import { WorkflowAssociationPayload } from "../models/workflow-associations";

/**
 * Interface which captures create approval workflow props.
 */
type CreateApprovalWorkflowProps = IdentifiableComponentInterface;

/**
 * Component to handle creation of a new approval workflow
 *
 * @param props - Props injected to the component.
 *
 * @returns the approval workflow creation page
 */
const ApprovalWorkflowCreatePage: FunctionComponent<CreateApprovalWorkflowProps> = (
    props: CreateApprovalWorkflowProps
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const generalApprovalWorkflowDetailsFormRef: MutableRefObject<GeneralApprovalWorkflowDetailsFormRef> = useRef<
        GeneralApprovalWorkflowDetailsFormRef
    >(null);
    const workflowOperationsDetailsFormRef: MutableRefObject<WorkflowOperationsDetailsFormRef> = useRef<
        WorkflowOperationsDetailsFormRef
    >(null);
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<ConfigurationsFormRef>(null);

    //Set relevant scopes
    const approvalWorkflowFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userStores
    );
    const hasApprovalWorkflowCreatePermission: boolean = useRequiredScopes(
        approvalWorkflowFeatureConfig?.scopes?.update
    );

    const [ approvalWorkflowFormData, setApprovalWorkflowFormData ] = useState<ApprovalWorkflowFormDataInterface>(null);
    const [ isApprovalWorkflowCreateRequestLoading, setIsApprovalWorkflowCreateRequestLoading ] = useState<boolean>(
        false
    );
    const [ activeStep, setActiveStep ] = useState<number>(0);
    const [ hasErrors, setHasErrors ] = useState<boolean>(false);

    /**
     * Handles the general details form submission.
     * @param values - Step 01 form values.
     */
    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        setApprovalWorkflowFormData((prevData: ApprovalWorkflowFormDataInterface) => ({
            ...prevData,
            generalDetails: values
        }));
        setActiveStep(1);
    };

    /**
     * Handles the workflow operation values submission.
     * @param values - Step 02 form values.
     */
    const onWorkflowOperationsDetailsFormSubmit = (values: WorkflowOperationsDetailsFormValuesInterface) => {
        setApprovalWorkflowFormData((prevData: ApprovalWorkflowFormDataInterface) => {
            return {
                ...prevData,
                workflowOperationsDetails: values
            };
        });
        setActiveStep(2);
    };

    /**
     * Handles the step details form submission.
     * @param values - Step 03 form values.
     */
    const onConfigurationDetailsFormSubmit = (values: ConfigurationsFormValuesInterface) => {
        //Check if there are any empty steps
        const hasInvalidSteps: boolean = values.approvalSteps.some(
            (step: ApprovalSteps) => step.users.length === 0 && step.roles.length === 0
        );

        if (hasInvalidSteps) {
            setHasErrors(true);

            return;
        }

        setApprovalWorkflowFormData((prevData: ApprovalWorkflowFormDataInterface) => ({
            ...prevData,
            configurations: values
        }));

        const workflowTemplate: WorkflowTemplate = {
            name: "MultiStepApprovalTemplate",
            steps: values.approvalSteps.map((step: ApprovalSteps, index: number) => ({
                step: index + 1,
                options: [
                    {
                        entity: "roles",
                        values: step.roles
                    },
                    {
                        entity: "users",
                        values: step.users
                    }
                ].filter((option: OptionDetails) => option.values.length > 0)
            }))
        };

        const approvalWorkflowPayload: ApprovalWorkflowPayload = {
            name: approvalWorkflowFormData.generalDetails.name,
            description: approvalWorkflowFormData.generalDetails.description,
            engine: "workflowImplSimple",
            template: workflowTemplate
        };

        handleApprovalWorkflowRegistration(approvalWorkflowPayload);
    };

    /**
     * Handles the workflow association creation.
     *
     * @param data - workflow association creation data.
     */
    const handleWorkflowAssociationsRegistration = (
        workflowAssociationPayload: WorkflowAssociationPayload
    ): Promise<any> => {
        return addWorkflowAssociation(workflowAssociationPayload)
            .then((response: any) => {
                return Promise.resolve(response);
            })
            .catch((error: AxiosError) => {
                return Promise.reject(error);
            });
    };

    /**
     * Handles the approval workflow creation.
     *
     * @param data - approval workflow creation data.
     */
    const handleApprovalWorkflowRegistration = (approvalWorkflowPayload: ApprovalWorkflowPayload): void => {
        setIsApprovalWorkflowCreateRequestLoading(true);

        addApprovalWorkflow(approvalWorkflowPayload)
            .then(async (response: any) => {
                try {
                    const associationPayloads: WorkflowAssociationPayload[] =
                        approvalWorkflowFormData.workflowOperationsDetails.matchedOperations.map(
                            (operation: DropdownPropsInterface) => ({
                                associationName: `Association for ${operation.value ?? operation.value}`,
                                operation: operation.value,
                                workflowId: response.id
                            })
                        );

                    // Wait for all associations to complete
                    await Promise.all(
                        associationPayloads.map((payload: WorkflowAssociationPayload) => {
                            return handleWorkflowAssociationsRegistration(payload);
                        })
                    );

                    dispatch(
                        addAlert({
                            description: t("approvalWorkflows:notifications.addApprovalWorkflow.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("approvalWorkflows:notifications.addApprovalWorkflow.success.message")
                        })
                    );

                    history.push(
                        AppConstants.getPaths()
                            .get("APPROVAL_WORKFLOW_EDIT")
                            .replace(":id", response.id)
                    );
                } catch (associationError) {
                    dispatch(
                        addAlert({
                            description: t(
                                "approvalWorkflows:notifications.addApprovalWorkflow.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t("approvalWorkflows:notifications.addApprovalWorkflow.genericError.description")
                        })
                    );
                } finally {
                    setIsApprovalWorkflowCreateRequestLoading(false);
                }
            })
            .catch((error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.approvalWorkflows.notifications." +
                                    "createPermission." +
                                    "error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.approvalWorkflows.notifications.createPermission." +
                                    "error.message"
                            )
                        })
                    );
                }

                dispatch(
                    addAlert({
                        description: t("approvalWorkflows:notifications.addApprovalWorkflow.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("approvalWorkflows:notifications.addApprovalWorkflow.genericError.description")
                    })
                );

                setIsApprovalWorkflowCreateRequestLoading(false);
            });
    };

    return (
        <PageLayout
            title={ t("approvalWorkflows:pageLayout.create.title") }
            contentTopMargin={ true }
            description={ t("approvalWorkflows:pageLayout.create.title") }
            className="workflow-model-create-page-layout"
            data-componentid={ `${componentId}-page-layout` }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths()?.get("APPROVAL_WORKFLOWS"));
                },
                text: t("approvalWorkflows:pageLayout.create.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            <EmphasizedSegment padded="very" data-componentid={ `${componentId}-segment` }>
                <Stepper
                    activeStep={ activeStep }
                    orientation="vertical"
                    className="workflow-model-create-stepper"
                    data-componentid={ `${componentId}-stepper` }
                >
                    <Step data-componentid={ `${componentId}-step-1` }>
                        <StepLabel
                            optional={
                                (<Typography variant="body2" data-componentid={ `${componentId}-step-1-description` }>
                                    { t("approvalWorkflows:pageLayout.create.stepper.step1.description") }
                                </Typography>)
                            }
                        >
                            <Typography variant="h4" data-componentid={ `${componentId}-step-1-title` }>
                                { t("approvalWorkflows:pageLayout.create.stepper.step1.title") }
                            </Typography>
                        </StepLabel>
                        <StepContent data-componentid={ `${componentId}-step-1-content` }>
                            <GeneralApprovalWorkflowDetailsForm
                                ref={ generalApprovalWorkflowDetailsFormRef }
                                isReadOnly={ !hasApprovalWorkflowCreatePermission }
                                initialValues={ approvalWorkflowFormData?.generalDetails ?? {} }
                                onSubmit={ onGeneralDetailsFormSubmit }
                                data-componentid={ `${componentId}-general-details-form` }
                            />
                            <Button
                                variant="contained"
                                disabled={ false }
                                onClick={ () => {
                                    if (generalApprovalWorkflowDetailsFormRef?.current?.triggerSubmit)
                                        generalApprovalWorkflowDetailsFormRef.current.triggerSubmit();
                                } }
                                loading={ isApprovalWorkflowCreateRequestLoading }
                                style={ { marginTop: "16px" } }
                                data-componentid={ `${componentId}-next-button` }
                            >
                                { t("common:next") }
                            </Button>
                        </StepContent>
                    </Step>

                    <Step data-componentid={ `${componentId}-step-2` }>
                        <StepLabel
                            optional={
                                (<Typography variant="body2" data-componentid={ `${componentId}-step-2-description` }>
                                    { t("approvalWorkflows:pageLayout.create.stepper.step2.description") }
                                </Typography>)
                            }
                        >
                            <Typography variant="h4" data-componentid={ `${componentId}-step-1-title` }>
                                { t("approvalWorkflows:pageLayout.create.stepper.step2.title") }
                            </Typography>
                        </StepLabel>
                        <StepContent data-componentid={ `${componentId}-step-2-content` }>
                            <WorkflowOperationsDetailsForm
                                ref={ workflowOperationsDetailsFormRef }
                                isReadOnly={ !hasApprovalWorkflowCreatePermission }
                                initialValues={ approvalWorkflowFormData?.workflowOperationsDetails ?? {} }
                                onSubmit={ onWorkflowOperationsDetailsFormSubmit }
                                data-componentid={ `${componentId}-workflow-operations-details-form` }
                            />
                            <div
                                className="step-actions-container"
                                data-componentid={ `${componentId}-step-actions-container` }
                            >
                                <Button
                                    variant="outlined"
                                    disabled={
                                        !hasApprovalWorkflowCreatePermission || isApprovalWorkflowCreateRequestLoading
                                    }
                                    onClick={ () => {
                                        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
                                    } }
                                    data-componentid={ `${componentId}-previous-button` }
                                >
                                    { t("common:previous") }
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={ null }
                                    onClick={ () => {
                                        if (workflowOperationsDetailsFormRef?.current?.triggerSubmit)
                                            workflowOperationsDetailsFormRef.current.triggerSubmit();
                                    } }
                                    loading={ isApprovalWorkflowCreateRequestLoading }
                                    data-componentid={ `${componentId}-finish-button` }
                                >
                                    { t("common:next") }
                                </Button>
                            </div>
                        </StepContent>
                    </Step>

                    <Step data-componentid={ `${componentId}-step-3` }>
                        <StepLabel
                            optional={
                                (<Typography variant="body2" data-componentid={ `${componentId}-step-3-description` }>
                                    { t("approvalWorkflows:pageLayout.create.stepper.step3.description") }
                                </Typography>)
                            }
                        >
                            <Typography variant="h4" data-componentid={ `${componentId}-step-2-title` }>
                                { t("approvalWorkflows:pageLayout.create.stepper.step3.title") }
                            </Typography>
                        </StepLabel>
                        <StepContent data-componentid={ `${componentId}-step-2-content` }>
                            <ConfigurationsForm
                                ref={ configurationsFormRef }
                                isReadOnly={ !hasApprovalWorkflowCreatePermission }
                                initialValues={ approvalWorkflowFormData?.configurations ?? {} }
                                hasErrors={ hasErrors }
                                onSubmit={ onConfigurationDetailsFormSubmit }
                                data-componentid={ `${componentId}-configurations-form` }
                            />
                            <div
                                className="step-actions-container"
                                data-componentid={ `${componentId}-step-actions-container` }
                            >
                                <Button
                                    variant="outlined"
                                    disabled={
                                        !hasApprovalWorkflowCreatePermission || isApprovalWorkflowCreateRequestLoading
                                    }
                                    onClick={ () => {
                                        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
                                        setHasErrors(false);
                                    } }
                                    data-componentid={ `${componentId}-previous-button` }
                                >
                                    { t("common:previous") }
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={ null }
                                    onClick={ () => {
                                        if (configurationsFormRef?.current?.triggerSubmit)
                                            configurationsFormRef.current.triggerSubmit();
                                    } }
                                    loading={ isApprovalWorkflowCreateRequestLoading }
                                    data-componentid={ `${componentId}-finish-button` }
                                >
                                    { t("common:finish") }
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                </Stepper>
            </EmphasizedSegment>
        </PageLayout>
    );
};

/**
 * Default props for approval workflow create component.
 */
ApprovalWorkflowCreatePage.defaultProps = {
    "data-componentid": "create-approval-workflow"
};

export default ApprovalWorkflowCreatePage;
