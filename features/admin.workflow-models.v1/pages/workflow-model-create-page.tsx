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
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import "./workflow-model-create-page.scss";
// eslint-disable-next-line import/order
import { addAlert } from "@wso2is/core/store";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { addWorkflowModel } from "../api";
import ConfigurationsForm, { ConfigurationsFormRef } from "../components/create/configuration-details-form";
import GeneralWorkflowModelDetailsForm, {
    GeneralWorkflowModelDetailsFormRef
} from "../components/create/general-workflow-model-details-form";
import {
    OptionDetails,
    WorkflowModelPayload,
    WorkflowTemplate
} from "../models";
import { ApprovalSteps, ConfigurationsFormValuesInterface, GeneralDetailsFormValuesInterface,
    WorkflowModelFormDataInterface }
    from "../models/ui";

/**
 * Interface which captures create workflow model props.
 */
type CreateWorkflowModelProps = IdentifiableComponentInterface;

/**
 * Component to handle creation of a new workflow model
 *
 * @param props - Props injected to the component.
 *
 * @returns the workflow model creation page
 */
const WorkflowModelCreatePage:
FunctionComponent<CreateWorkflowModelProps> = (props: CreateWorkflowModelProps): ReactElement => {

    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const generalWorkflowModelDetailsFormRef: MutableRefObject<GeneralWorkflowModelDetailsFormRef> = useRef<
        GeneralWorkflowModelDetailsFormRef
    >(null);
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<ConfigurationsFormRef>(null);

    const [ workflowModelFormData, setWorkflowModelFormData ] = useState<WorkflowModelFormDataInterface>(null);
    //Set relevant scopes
    const workflowModelFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userStores
    );
    const hasWorkflowModelCreatePermission: boolean = useRequiredScopes(workflowModelFeatureConfig?.scopes?.update);
    const [ isWorkflowModelCreateRequestLoading, setIsWorkflowModelCreateRequestLoading ] =
    useState<boolean>(false);
    const [ activeStep, setActiveStep ] = useState<number>(0);
    const [ hasErrors, setHasErrors ] = useState<boolean>(false);

    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        setWorkflowModelFormData((prevData: WorkflowModelFormDataInterface) => ({
            ...prevData,
            generalDetails: values
        }));
        setActiveStep(1);
    };

    const onConfigurationDetailsFormSubmit = (values: ConfigurationsFormValuesInterface) => {

        const hasInvalidSteps: boolean = values.approvalSteps.some(
            (step: ApprovalSteps) => step.users.length === 0 && step.roles.length === 0
        );

        if (hasInvalidSteps) {
            setHasErrors(true);

            return;
        }
        setWorkflowModelFormData((prevData: WorkflowModelFormDataInterface) => ({
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

        const workflowModelPayload: WorkflowModelPayload = {
            name: workflowModelFormData.generalDetails.name,
            // eslint-disable-next-line sort-keys
            description: workflowModelFormData.generalDetails.description,
            engine: "workflowImplSimple",
            template: workflowTemplate,
            approvalTask: "Approval Required",
            approvalTaskDescription: "Approval is needed to complete this task"
        };

        handleWorkflowModelRegistration(workflowModelPayload);
        setActiveStep(2);
    };

    /**
     * Handles the workflow model creation.
     *
     * @param data - workflow model creation data.
     */
    const handleWorkflowModelRegistration = (workflowModelPayload: WorkflowModelPayload): void => {
        setIsWorkflowModelCreateRequestLoading(true);
        addWorkflowModel(workflowModelPayload).then((response: any) => {
            dispatch(
                addAlert({
                    description: t("workflowModels:notifications.addWorkflowModel.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("workflowModels:notifications.addWorkflowModel.success.message")
                })
            );
            // Is delay message needed?
            history.push(AppConstants.getPaths().get("WORKFLOW_MODEL_EDIT").replace(":id", response.id));
        })
            .catch((error: AxiosError) => {
                if ( !error.response || error.response.status === 401 ) {
                    dispatch(
                        addAlert({
                            description: t("console:manage.features.workflowModels.notifications." +
                                "createPermission." +
                                "error.description"),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.workflowModels.notifications.createPermission." +
                                "error.message")
                        })
                    );
                }

                dispatch(
                    addAlert({
                        description: t(
                            "workflowModels:notifications.addWorkflowModel.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("workflowModels:notifications.addWorkflowModel.genericError.description")
                    })
                );

                setIsWorkflowModelCreateRequestLoading(false);
            });
    };

    return (
        <PageLayout
            title={ t("workflowModels:pageLayout.create.title") }
            contentTopMargin={ true }
            description={ t("workflowModels:pageLayout.create.title") }
            className="workflow-model-create-page-layout"
            data-componentid={ `${componentId}-page-layout` }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths()?.get("WORKFLOW_MODELS"));
                },
                text: t("workflowModels:pageLayout.create.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            <EmphasizedSegment
                padded="very"
                data-componentid={ `${componentId}-segment` }
            >
                <Stepper
                    activeStep={ activeStep }
                    orientation="vertical"
                    className="workflow-model-create-stepper"
                    data-componentid={ `${componentId}-stepper` }
                >
                    <Step data-componentid={ `${componentId}-step-1` }>
                        <StepLabel
                            optional={
                                (<Typography
                                    variant="body2"
                                    data-componentid={ `${componentId}-step-1-description` }
                                >
                                    { t("workflowModels:pageLayout.create.stepper.step1.description") }
                                </Typography>)
                            }
                        >
                            <Typography
                                variant="h4"
                                data-componentid={ `${componentId}-step-1-title` }
                            >
                                { t("workflowModels:pageLayout.create.stepper.step1.title") }
                            </Typography>
                        </StepLabel>
                        <StepContent data-componentid={ `${componentId}-step-1-content` }>
                            <GeneralWorkflowModelDetailsForm
                                ref={ generalWorkflowModelDetailsFormRef }
                                isReadOnly={ !hasWorkflowModelCreatePermission }
                                initialValues={ workflowModelFormData?.generalDetails ?? {} }
                                onSubmit={ onGeneralDetailsFormSubmit }
                                data-componentid={ `${componentId}-general-details-form` }
                            />
                            <Button
                                variant="contained"
                                disabled={ false }
                                onClick={ () => {
                                    if (generalWorkflowModelDetailsFormRef?.current?.triggerSubmit)
                                        generalWorkflowModelDetailsFormRef.current.triggerSubmit();
                                } }
                                loading={ isWorkflowModelCreateRequestLoading }
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
                                (<Typography
                                    variant="body2"
                                    data-componentid={ `${componentId}-step-2-description` }
                                >
                                    { t("workflowModels:pageLayout.create.stepper.step2.description") }
                                </Typography>)
                            }
                        >
                            <Typography
                                variant="h4"
                                data-componentid={ `${componentId}-step-2-title` }
                            >
                                { t("workflowModels:pageLayout.create.stepper.step2.title") }
                            </Typography>
                        </StepLabel>
                        <StepContent data-componentid={ `${componentId}-step-2-content` }>
                            <ConfigurationsForm
                                ref={ configurationsFormRef }
                                isReadOnly={ !hasWorkflowModelCreatePermission }
                                initialValues={ workflowModelFormData?.configurations ?? {} }
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
                                    disabled={ !hasWorkflowModelCreatePermission
                                || isWorkflowModelCreateRequestLoading }
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
                                    loading={ isWorkflowModelCreateRequestLoading }
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
 * Default props for workflow model create component.
 */
WorkflowModelCreatePage.defaultProps = {
    "data-componentid": "create-workflow-model"
};

export default WorkflowModelCreatePage;
