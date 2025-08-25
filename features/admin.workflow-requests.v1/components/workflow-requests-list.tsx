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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { getOperationTypeTranslationKey } from "@wso2is/common.workflow-approvals.v1/utils/approval-utils";
import { IdentifiableComponentInterface, LoadableComponentInterface, SBACInterface } from "@wso2is/core/models";
import {
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import moment from "moment";
import React, { ReactElement, ReactNode, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "semantic-ui-react";
import {
    WorkflowInstanceListItemInterface,
    WorkflowInstanceStatus
} from "../models/workflowRequests";
import "./workflow-requests-list.scss";

/**
 * Props interface for the Workflow Requests List component.
 */
interface WorkflowRequestsListProps
    extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
        IdentifiableComponentInterface {

    /**
     * Array of workflow request objects to be rendered in the list.
     */
    workflowRequestsList: WorkflowInstanceListItemInterface[];
    /**
     * Optional prop to indicate if the component is in a loading state.
     */
    isLoading: boolean;
    /**
     * Optional number specifying the default limit for list items shown.
     */
    defaultListItemLimit?: number;
    /**
     * Callback to handle viewing workflow request details.
     *
     * @param workflowRequest - The workflow request item to view details for.
     */
    handleWorkflowRequestView: (workflowRequest: WorkflowInstanceListItemInterface) => void;
    /**
     * Optional callback to be triggered when the search query is cleared.
     */
    onSearchQueryClear?: () => void;
    /**
     * Current search query string used to filter the list.
     */
    searchQuery?: string;
    /**
     * Flag to control whether action buttons should be shown for each list item.
     */
    showListItemActions?: boolean;
}

/**
 * This component renders the workflow requests list.
 *
 * @param props - Props injected to the component.
 *
 * @returns workflow requests list component.
 */
const WorkflowRequestsList: React.FunctionComponent<WorkflowRequestsListProps> = (
    props: WorkflowRequestsListProps
): ReactElement => {

    const {
        isLoading,
        workflowRequestsList,
        onSearchQueryClear,
        handleWorkflowRequestView,
        searchQuery,
        ["data-componentid"]: componentId = "workflow-requests-list"
    } = props;

    const { t } = useTranslation([ "approvalWorkflows" ]);

    /**
     * Shows list placeholders.
     *
     * @returns placeholders for the list component when list is empty.
     */
    const showPlaceholders = (): ReactElement => {
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${componentId}-empty-placeholder-search` }
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("approvalWorkflows:form.placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("approvalWorkflows:form.placeholders.emptySearch.title") }
                    subtitle={ [
                        t("approvalWorkflows:form.placeholders.emptySearch.subtitles", { searchQuery })
                    ] }
                />
            );
        }

        if ((workflowRequestsList?.length === 0)) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${componentId}-empty-placeholder-readonly` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("approvalWorkflows:form.placeholders.emptyListReadOnly.title") }
                    subtitle={ [ t("approvalWorkflows:form.placeholders.emptyListReadOnly.subtitles") ] }
                />
            );
        }

        return null;
    };

    /**
     * Resolves the status color for workflow instance status.
     *
     * @param status - The status of the workflow instance.
     * @returns A string color name based on status.
     */
    const resolveInstanceStatusColor = (
        status: WorkflowInstanceStatus
    ): string => {
        switch (status) {
            case WorkflowInstanceStatus.APPROVED:
                return "green";
            case WorkflowInstanceStatus.PENDING:
                return "yellow";
            case WorkflowInstanceStatus.REJECTED:
            case WorkflowInstanceStatus.FAILED:
                return "red";
            case WorkflowInstanceStatus.DELETED:
                return "grey";
            default:
                return "grey";
        }
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => [];

    /**
     * Resolves data table columns.
     *
     * @returns Table columns
     */
    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "workflowInstanceId",
            id: "workflowInstanceId",
            key: "workflowInstanceId",
            render: (workflowRequest: WorkflowInstanceListItemInterface): ReactNode => (
                <div className="workflow-requests-list-event-type-cell">
                    <Header as="h6" className="workflow-requests-list-event-type">
                        { t(getOperationTypeTranslationKey(workflowRequest.eventType)) }
                    </Header>
                </div>
            ),
            title: t("approvalWorkflows:list.columns.workflowInstanceId")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "status",
            id: "status",
            key: "status",
            render: (workflowRequest: WorkflowInstanceListItemInterface): ReactNode => {
                const color: string = resolveInstanceStatusColor(workflowRequest.status as WorkflowInstanceStatus);

                return (
                    <span className="workflow-requests-list-status-cell">
                        <span className={ `status-indicator ${color}` } />
                        <Header as="h6" className="workflow-requests-list-status-text">
                            { formatStatus(workflowRequest.status) }
                        </Header>
                    </span>
                );
            },
            title: t("approvalWorkflows:list.columns.status")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "createdAt",
            id: "createdAt",
            key: "createdAt",
            render: (workflowRequest: WorkflowInstanceListItemInterface): ReactNode => (
                <Header as="h6" className="workflow-requests-list-date-cell">
                    { getFriendlyDate(workflowRequest.createdAt) }
                </Header>
            ),
            title: t("approvalWorkflows:list.columns.createdAt")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "updatedAt",
            id: "updatedAt",
            key: "updatedAt",
            render: (workflowRequest: WorkflowInstanceListItemInterface): ReactNode => (
                <Header as="h6" className="workflow-requests-list-date-cell">
                    { getFriendlyDate(workflowRequest.updatedAt) }
                </Header>
            ),
            title: t("approvalWorkflows:list.columns.updatedAt")
        }
    ];

    const getFriendlyDate = (dateString: string): string => {
        if (!dateString) return "-";
        const now: Date = new Date();
        const date: Date = new Date(dateString);
        const diffMs: number = now.getTime() - date.getTime();
        const diffDays: number = diffMs / (1000 * 60 * 60 * 24);

        if (diffMs < 0) {
            return moment(dateString).format("MMM DD, YYYY, hh:mm A");
        }

        if (diffDays <= 30) {
            return moment(dateString).fromNow();
        } else {
            return moment(dateString).format("MMM DD, YYYY, hh:mm A");
        }
    };

    // Helper to convert status to proper case
    const formatStatus = (status: string): string => {
        if (!status) return "-";

        switch (status.toUpperCase()) {
            case "PENDING":
                return t("approvalWorkflows:status.pending");
            case "APPROVED":
                return t("approvalWorkflows:status.approved");
            case "REJECTED":
                return t("approvalWorkflows:status.rejected");
            case "FAILED":
                return t("approvalWorkflows:status.failed");
            case "DELETED":
                return t("approvalWorkflows:status.deleted");
            default:
                return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        }
    };

    return (
        <>
            <DataTable<WorkflowInstanceListItemInterface>
                data-componentid={ `${componentId}-list` }
                className="workflow-requests-table"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                placeholders={ showPlaceholders() }
                data={ workflowRequestsList }
                onRowClick={ (e: SyntheticEvent, workflowRequestItem: WorkflowInstanceListItemInterface): void => {
                    handleWorkflowRequestView(workflowRequestItem);
                } }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                showHeader={ true }
            />
        </>
    );
};

export default WorkflowRequestsList;
