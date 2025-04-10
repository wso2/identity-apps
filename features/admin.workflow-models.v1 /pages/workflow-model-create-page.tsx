import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import ApprovalProcessesConstants from "../constants/workflow-model-constants";
import React, { MutableRefObject, useRef, useState } from "react";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import Button from "@oxygen-ui/react/Button";
import Step from "@oxygen-ui/react/Step";
import StepContent from "@oxygen-ui/react/StepContent";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import Typography from "@oxygen-ui/react/Typography";
import GeneralApprovalProcessDetailsForm, {
    GeneralApprovalProcessDetailsFormRef
} from "../components/create/general-workflow-model-details-form";
import { ApprovalProcessFormDataInterface, ConfigurationsFormValuesInterface } from "../models/ui";
import { GeneralDetailsFormValuesInterface } from "../models/ui";
import { useTranslation } from "react-i18next";
import ConfigurationsForm, { ConfigurationsFormRef } from "../components/create/configuration-details-form";
import "./approval-process-create-page.scss";
import { useRequiredScopes } from "@wso2is/access-control";
import {
    WorkflowDetails,
    WorkflowModelPayload,
    WorkflowTemplate,
    WorkflowTemplateParameters,
    WorkflowTemplateResponse
} from "../models";
import { addWorkflowModel } from "../api";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { AxiosError } from "axios";

const ApprovalProcessCreatePage = () => {
    const approvalProcessCreatePath: string = ApprovalProcessesConstants.getPaths().get("APPROVAL_PROCESS_CREATE");
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState<number>(0);
    const generalApprovalProcessDetailsFormRef: MutableRefObject<GeneralApprovalProcessDetailsFormRef> = useRef<
        GeneralApprovalProcessDetailsFormRef
    >(null);
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<ConfigurationsFormRef>(null);
    const [approvalProcessFormData, setApprovalProcessFormData] = useState<ApprovalProcessFormDataInterface>(null);
    const [isApprovalProcessCreateRequestLoading, setIsApprovalProcessCreateRequestLoading] = useState<boolean>(false);
    const hasApprovalProcessCreatePermission: boolean = useRequiredScopes(null);
    const dispatch: Dispatch = useDispatch();

    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        setApprovalProcessFormData((prevData: ApprovalProcessFormDataInterface) => ({
            ...prevData,
            generalDetails: values
        }));
        console.log("General Details Form Data Submitted.", approvalProcessFormData);
        setActiveStep(1);
    };

    const onConfigurationDetailsFormSubmit = (values: ConfigurationsFormValuesInterface) => {
        setApprovalProcessFormData((prevData: ApprovalProcessFormDataInterface) => ({
            ...prevData,
            configurations: values
        }));
        console.log("ConfigurationDetails form data are submitted", values);

        const workflowTemplate: WorkflowTemplate = {
            name: "MultiStepApprovalTemplate",
            steps: values.approvalSteps.map((step, index) => ({
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
                ].filter(option => option.values.length > 0)
            }))
        };

        const workflowModelPayload: WorkflowModelPayload = {
            name: approvalProcessFormData.generalDetails.name,
            description: approvalProcessFormData.generalDetails.description,
            engine: "workflowImplSimple",
            template: workflowTemplate,
            approvalTask: "Approval Required"
        };

        handleWorkflowModelRegistration(workflowModelPayload);
        console.log("Workflow Template Payload", workflowTemplate);
        setActiveStep(2);
    };

    const handleWorkflowModelRegistration = (approvalProcessPayload: WorkflowModelPayload): void => {
        addWorkflowModel(approvalProcessPayload).then((response: WorkflowDetails) => {
            console.log("Request sent");
            dispatch(
                addAlert({
                    description: t("remoteUserStores:pages.create.notifications.createUserStore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("remoteUserStores:pages.create.notifications.createUserStore.success.message")
                })
            );

            dispatch(
                addAlert({
                    description: t("userstores:notifications.delay.description"),
                    level: AlertLevels.WARNING,
                    message: t("userstores:notifications.delay.message")
                })
            );

            history.push(AppConstants.getPaths().get("WORKFLOW_DEFINITIONS"));
        });
        // .catch((error: AxiosError) => {
        //     if (
        //         error.response?.status === 403 &&
        //         error.response.data?.code === UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorCode()
        //     ) {
        //         dispatch(
        //             addAlert({
        //                 description: t(
        //                     UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorDescription()
        //                 ),
        //                 level: AlertLevels.ERROR,
        //                 message: t(UserStoreManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorMessage())
        //             })
        //         );
        //     }

        //     dispatch(
        //         addAlert({
        //             description: t(
        //                 "remoteUserStores:pages.create.notifications.createUserStore.genericError.description"
        //             ),
        //             level: AlertLevels.ERROR,
        //             message: t("remoteUserStores:pages.create.notifications.createUserStore.genericError.message")
        //         })
        //     );

        //     setIsUserStoreCreateRequestLoading(false);
        // });
    };

    return (
        <PageLayout
            title={"Create a Workflow Model"}
            contentTopMargin={true}
            description={"Follow the steps to create a new workflow model."}
            className="approval-process-create-page-layout"
            backButton={{
                onClick: () => {
                    history.push(AppConstants.getPaths().get("WORKFLOW_DEFINITIONS"));
                },
                text: "Go back to workflow models"
            }}
            titleTextAlign="left"
            bottomMargin={false}
            showBottomDivider
        >
            <EmphasizedSegment padded="very">
                <Stepper activeStep={activeStep} orientation="vertical" className="approval-process-create-stepper">
                    <Step>
                        <StepLabel
                            optional={
                                <Typography variant="body2">
                                    {"Provide the basic details of the workflow model you want to create."}
                                </Typography>
                            }
                        >
                            <Typography variant="h4">{"General Details"}</Typography>
                        </StepLabel>
                        <StepContent>
                            <GeneralApprovalProcessDetailsForm
                                ref={generalApprovalProcessDetailsFormRef}
                                isReadOnly={!hasApprovalProcessCreatePermission}
                                initialValues={approvalProcessFormData?.generalDetails ?? {}}
                                onSubmit={onGeneralDetailsFormSubmit}
                            />
                            <Button
                                variant="contained"
                                disabled={null}
                                onClick={() => {
                                    if (generalApprovalProcessDetailsFormRef?.current?.triggerSubmit)
                                        generalApprovalProcessDetailsFormRef.current.triggerSubmit();
                                }}
                                loading={isApprovalProcessCreateRequestLoading}
                                style={{ marginTop: "16px" }}
                            >
                                {t("common:next")}
                            </Button>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel
                            optional={
                                <Typography variant="body2">{"Configure the approval steps of the model."}</Typography>
                            }
                        >
                            <Typography variant="h4">{"Configuration Details"}</Typography>
                        </StepLabel>
                        <StepContent>
                            <ConfigurationsForm
                                ref={configurationsFormRef}
                                isReadOnly={false}
                                initialValues={approvalProcessFormData?.configurations ?? {}}
                                onSubmit={onConfigurationDetailsFormSubmit}
                            />
                            <div className="step-actions-container">
                                <Button
                                    variant="outlined"
                                    disabled={isApprovalProcessCreateRequestLoading}
                                    onClick={() => {
                                        setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
                                    }}
                                >
                                    {t("common:previous")}
                                </Button>
                                <Button
                                    variant="contained"
                                    disabled={null}
                                    onClick={() => {
                                        if (configurationsFormRef?.current?.triggerSubmit)
                                            configurationsFormRef.current.triggerSubmit();
                                    }}
                                    loading={isApprovalProcessCreateRequestLoading}
                                >
                                    {t("common:finish")}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                </Stepper>
            </EmphasizedSegment>
        </PageLayout>
    );
};

export default ApprovalProcessCreatePage;
