import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { WorkflowDetails, WorkflowModelPayload, WorkflowTemplate } from "../models";
import useGetWorkflowModelDetails from "../api/use-get-workflow-model-details";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { WorkflowModelEditTabIDs } from "../constants/approval-processes-constants";
import { GenericIcon, Popup, ResourceTab, ResourceTabPaneInterface, TabPageLayout } from "@wso2is/react-components";
import WorkflowModelGeneralSettings from "../components/edit/workflow-model-general-settings";
import WorkflowModelConfigurationSettings from "../components/edit/workflow-model-configuration-settings";
import { ApprovalProcessFormDataInterface, ApprovalSteps, ConfigurationsFormValuesInterface, GeneralDetailsFormValuesInterface } from "../models/ui";
import { GeneralApprovalProcessDetailsFormRef } from "../components/create/general-approval-process-details-form";
import { ConfigurationsFormRef } from "../components/create/configuration-details-form";
import { updateWorkflowModel } from "../api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { useTranslation } from "react-i18next";
import { Dispatch } from "redux";
import './workflow-model-edit.scss'

type WorkflowModelEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

const WorkflowModelEditPage: FunctionComponent<WorkflowModelEditPagePropsInterface> = ({
    match
}: WorkflowModelEditPagePropsInterface): ReactElement => {
    const workflowModelId: string = match.params["id"]?.split("#")[0];
    const [approvalProcessFormData, setApprovalProcessFormData] = useState<ApprovalProcessFormDataInterface>(null);
    const dispatch: Dispatch = useDispatch();
    const {t} = useTranslation();

    const {
        data: workflowModelDetails,
        isLoading: isWorkflowModelDetailsRequestLoading,
        error: workflowModelDetailsRequestError,
        remainingRetryCount: workflowModelDetailsRequestRemainingRetryCount,
        mutate: mutateWorkflowModelDetails
    } = useGetWorkflowModelDetails(workflowModelId);

    useEffect(() => {
        console.log("Engine",workflowModelDetails?.engine)
        setApprovalProcessFormData({
            generalDetails: {
                name: workflowModelDetails?.name,
                description: workflowModelDetails?.description,
                engine: workflowModelDetails?.engine
            },
            configurations:{
                approvalSteps: workflowModelDetails?.template?.steps?.map(step => {
                            const stepData: ApprovalSteps = {
                                roles: [],
                                users: []
                            };
                            step.options?.forEach(option => {
                                if (option.entity === "roles") {
                                    stepData.roles = option.values;
                                } else if (option.entity === "users") {
                                    stepData.users = option.values;
                                }
                            });
                            return stepData;
                        })
            }
        })
    },[workflowModelDetails])


    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        const updatedData = {
            ...approvalProcessFormData,
            generalDetails: values
        };
        setApprovalProcessFormData(updatedData);
        createPayload(updatedData); 
    };

    const onConfigurationDetailsFormSubmit = (values: ConfigurationsFormValuesInterface) => {      
            const updatedData = {
                ...approvalProcessFormData,
                configurations: values
            };
            setApprovalProcessFormData(updatedData);
            createPayload(updatedData); 
    };

    useEffect(()=>{
        console.log("Complete Updated Details: ", approvalProcessFormData);
    },[approvalProcessFormData]);
    
    const createPayload = (updatedApprovalProcessFormData: ApprovalProcessFormDataInterface) => {
        const workflowTemplate: WorkflowTemplate = {
            name: "MultiStepApprovalTemplate",
            steps: updatedApprovalProcessFormData.configurations.approvalSteps.map((step, index) => ({
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
            name: updatedApprovalProcessFormData.generalDetails.name,
            description: updatedApprovalProcessFormData.generalDetails.description,
            engine: "workflowImplSimple",
            template: workflowTemplate,
            approvalTask: "Approval Required"
        };

        handleWorkflowModelUpdate(workflowModelPayload);
        console.log("Final Payload", workflowModelPayload);
    }

    const handleWorkflowModelUpdate = (workflowModelPayload: WorkflowModelPayload): void => {
        updateWorkflowModel(workflowModelId, workflowModelPayload).then((response: WorkflowDetails) => {
            mutateWorkflowModelDetails();
            console.log("Request sent");
            dispatch(
                addAlert({
                    description: "Workflow Model has been updated successfully!",
                    level: AlertLevels.SUCCESS,
                    message: "Workflow Model updated successfully!"
                })
            );
        });
    };
    

    const panes: ResourceTabPaneInterface[] = [
        {
            menuItem: "General",
            "data-tabid": WorkflowModelEditTabIDs.GENERAL,
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <WorkflowModelGeneralSettings
                        workflowModel={ workflowModelDetails }
                        workflowModelId={ workflowModelId }
                        isReadOnly={ false }
                        onSubmit={ onGeneralDetailsFormSubmit }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: "Configurations",
            "data-tabid": WorkflowModelEditTabIDs.CONFIGURATIONS,
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false } >
                    <div className="workflow-model-configuration-settings">
                    <WorkflowModelConfigurationSettings
                        workflowModel={ workflowModelDetails }
                        workflowModelId={ workflowModelId }
                        isReadOnly={ false }
                        onSubmit={ onConfigurationDetailsFormSubmit }
                    />
                    </div>
                    
                </ResourceTab.Pane>
            )
        }
    ];
    
    return (
        <TabPageLayout
            title={<>{workflowModelDetails?.name}</>}
            backButton={{
                onClick: () => {
                    history.push(AppConstants.getPaths().get("WORKFLOW_DEFINITIONS"));
                },
                text: "Go back to workflow models"
            }}
            titleTextAlign="left"
            isLoading={isWorkflowModelDetailsRequestLoading || !workflowModelDetails}
            className="workflow-model-edit-page"
        >
            <ResourceTab
                className="remote-user-store-edit-section"
                panes={panes}
                defaultActiveTab={WorkflowModelEditTabIDs.GENERAL}
                isLoading={isWorkflowModelDetailsRequestLoading || !workflowModelDetails}
                controlTabRedirectionInternally
            />
        </TabPageLayout>
    );
};

export default WorkflowModelEditPage;
