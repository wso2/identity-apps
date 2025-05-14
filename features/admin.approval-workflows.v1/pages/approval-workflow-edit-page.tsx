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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { useGetApprovalWorkflowDetails } from "../api/use-get-approval-workflow-details";
import EditApprovalWorkflow from "../components/edit/approval-workflow-edit";
import "./approval-workflow-edit-page.scss";
import { WorkflowDetails } from "../models/approval-workflows";

/**
 * Prop types for the approval workflow edit page.
 */
type ApprovalWorkflowEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * This renders the approval workflow edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns The Approval Workflow edit page.
 */
const ApprovalWorkflowEditPage: FunctionComponent<ApprovalWorkflowEditPagePropsInterface> = ({
    match,
    ["data-componentid"]: componentId = "approval-workflow-edit-page"
}: ApprovalWorkflowEditPagePropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const approvalWorkflowId: string = match.params["id"]?.split("#")[0];
    //Scopes should be defined accordingly
    const approvalWorkflowFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userStores
    );
    const hasApprovalWorkflowUpdatePermission: boolean = useRequiredScopes(
        approvalWorkflowFeatureConfig?.scopes?.update
    );

    const [ workflowDetails, setWorkflowDetails ] = useState<WorkflowDetails>(null);

    const {
        data: approvalWorkflowDetails,
        isLoading: isApprovalWorkflowDetailsRequestLoading,
        error: approvalWorkflowDetailsRequestError,
        mutate: mutateApprovalWorkflowDetails
    } = useGetApprovalWorkflowDetails(approvalWorkflowId, !isEmpty(approvalWorkflowId));

    /**
    * Handles the approval workflow details request error.
    */
    useEffect(() => {
        if (approvalWorkflowDetailsRequestError) {
            dispatch(addAlert(
                {
                    description: t("approvalWorkflows:notifications.fetchApprovalWorkflows.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("approvalWorkflows:notifications.fetchApprovalWorkflows.genericError.message")
                }
            ));
        }
    }, [ approvalWorkflowDetailsRequestError ]);

    useEffect(() => {
        setWorkflowDetails(approvalWorkflowDetails);
    }, [ approvalWorkflowDetails ]);

    const mutateWorkflowDetails = () => {
        mutateApprovalWorkflowDetails();
    };

    return (

        <PageLayout
            pageTitle={ t("pages:actions.title") }
            title={ <>{ approvalWorkflowDetails?.name }</> }
            description={ <>{ approvalWorkflowDetails?.description }</> }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("APPROVAL_WORKFLOWS"));
                },
                text: t("approvalWorkflows:pageLayout.edit.back")
            } }
            data-componentid={ null }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
        >
            <EditApprovalWorkflow
                approvalWorkflowDetails={ workflowDetails }
                approvalWorkflowId={ approvalWorkflowId }
                isReadOnly={ false }
                mutateApprovalWorkflowDetails={ mutateWorkflowDetails }
                isLoading={ isApprovalWorkflowDetailsRequestLoading }
            />
        </PageLayout>
    );
};

export default ApprovalWorkflowEditPage;
