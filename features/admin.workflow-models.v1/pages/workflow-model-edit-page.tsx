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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ResourceTab, ResourceTabPaneInterface, TabPageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { updateWorkflowModel, useGetWorkflowModelDetails } from "../api";
import WorkflowModelConfigurationSettings from "../components/edit/workflow-model-configuration-settings";
import WorkflowModelGeneralSettings from "../components/edit/workflow-model-general-settings";
import { WorkflowModelEditTabIDs } from "../constants/workflow-model-constants";
import { WorkflowModelPayload, WorkflowTemplate } from "../models";
import {
    ApprovalSteps,
    ConfigurationsFormValuesInterface,
    GeneralDetailsFormValuesInterface,
    WorkflowModelFormDataInterface
} from "../models/ui";
import "./workflow-model-edit.scss";

type WorkflowModelEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

const WorkflowModelEditPage: FunctionComponent<WorkflowModelEditPagePropsInterface> = ({
    match,
    ["data-componentid"]: componentId = "workflow-model-edit-page"
}: WorkflowModelEditPagePropsInterface): ReactElement => {
    const workflowModelId: string = match.params["id"]?.split("#")[0];
    const [ approvalProcessFormData, setApprovalProcessFormData ] = useState<WorkflowModelFormDataInterface>(null);
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const {
        data: workflowModelDetails,
        isLoading: isWorkflowModelDetailsRequestLoading,
        error: workflowModelDetailsRequestError,
        remainingRetryCount: workflowModelDetailsRequestRemainingRetryCount,
        mutate: mutateWorkflowModelDetails
    } = useGetWorkflowModelDetails(workflowModelId);

    /**
         * Handles the workflow model details request error.
         */
    useEffect(() => {
        if (workflowModelDetailsRequestError) {
            // Since workflow model creation can be delayed,
            // 404 error is ignored until the maximum retry count is reached.
            if (workflowModelDetailsRequestError.response?.status === 404
                    && workflowModelDetailsRequestRemainingRetryCount > 0) {
                return;
            }

            dispatch(addAlert(
                {
                    description: t("workflowModels:notifications.fetchworkflowModels.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("workflowModels:notifications.fetchUserstores.genericError.message")
                }
            ));
        }
    }, [ workflowModelDetailsRequestError ]);

    useEffect(() => {
        setApprovalProcessFormData({
            generalDetails: {
                name: workflowModelDetails?.name,
                description: workflowModelDetails?.description,
                engine: workflowModelDetails?.engine
            },
            configurations: {
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
        });
    }, [ workflowModelDetails ]);

    const onGeneralDetailsFormSubmit = (values: GeneralDetailsFormValuesInterface) => {
        const updatedData: any = {
            ...approvalProcessFormData,
            generalDetails: values
        };

        setApprovalProcessFormData(updatedData);
        createPayload(updatedData);
    };

    const onConfigurationDetailsFormSubmit = (values: ConfigurationsFormValuesInterface) => {
        const updatedData: any = {
            ...approvalProcessFormData,
            configurations: values
        };

        setApprovalProcessFormData(updatedData);
        createPayload(updatedData);
    };

    const createPayload = (updatedApprovalProcessFormData: WorkflowModelFormDataInterface) => {
        const workflowTemplate: WorkflowTemplate = {
            name: "MultiStepApprovalTemplate",
            steps:
            updatedApprovalProcessFormData.configurations.approvalSteps.map((step: ApprovalSteps, index: number) => ({
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
    };

    const handleWorkflowModelUpdate = (workflowModelPayload: WorkflowModelPayload): void => {
        updateWorkflowModel(workflowModelId, workflowModelPayload)
            .then(() => {
                mutateWorkflowModelDetails();
                dispatch(
                    addAlert({
                        description: t("workflowModels:notifications.updateWorkflowModel" +
                            ".success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("workflowModels:notifications.updateWorkflowModel" +
                            ".success.message")
                    })
                );
            })
            .catch( (error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description:
                                t("workflowModels: notifications.updateWorkflowModel" +
                                    ".error.description",
                                { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t("workflowModels:notifications.updateWorkflowModel" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("workflowModels:notifications.updateWorkflowModel" +
                                ".genericError.message")
                        })
                    );
                }
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
                <ResourceTab.Pane controlledSegmentation attached={ false }>
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
            title={ <>{ workflowModelDetails?.name }</> }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("WORKFLOW_MODELS"));
                },
                text: t("workflowModels:pageLayout.edit.back")
            } }
            titleTextAlign="left"
            isLoading={ isWorkflowModelDetailsRequestLoading || !workflowModelDetails }
            data-componentid={ `${ componentId }-layout` }
            className="workflow-model-edit-page"
        >
            <ResourceTab
                className="remote-user-store-edit-section"
                panes={ panes }
                defaultActiveTab={ WorkflowModelEditTabIDs.GENERAL }
                isLoading={ isWorkflowModelDetailsRequestLoading || !workflowModelDetails }
                data-componentid={ `${ componentId }-tabs` }
                controlTabRedirectionInternally
            />
        </TabPageLayout>
    );
};

export default WorkflowModelEditPage;
