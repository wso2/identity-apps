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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "../../admin.core.v1/configs/ui";
import { UIConstants } from "../../admin.core.v1/constants/ui-constants";
import { FeatureConfigInterface } from "../../admin.core.v1/models/config";
import { AppState } from "../../admin.core.v1/store";
import { IdentifiableComponentInterface, LoadableComponentInterface, SBACInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Label, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { 
    WorkflowInstanceListItemInterface,
    WorkflowInstanceStatus
} from "../models/workflowRequests";
import { humanizeDateString, formatDateString } from "../../admin.secrets.v1/utils/secrets.date.utils";
import moment from "moment";
import "../styles/workflow-requests.css";

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
     * Optional callback to handle the deletion of a workflow request item.
     *
     * @param workflowRequest - The workflow request item to be deleted.
     */
    handleWorkflowRequestDelete?: (workflowRequest: WorkflowInstanceListItemInterface) => void;
    /**
     * Optional callback to handle viewing workflow request details.
     *
     * @param workflowRequest - The workflow request item to view details for.
     */
    handleWorkflowRequestView?: (workflowRequest: WorkflowInstanceListItemInterface) => void;
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
        handleWorkflowRequestDelete,
        handleWorkflowRequestView,
        searchQuery,
        ["data-componentid"]: componentId = "workflow-requests-list"
    } = props;

    const { t } = useTranslation(["workflow-requests"]);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showWorkflowRequestDeleteConfirmation, setShowWorkflowRequestDeleteConfirmationModal ] = useState(false);
    const [ currentDeletedWorkflowRequest, setCurrentDeletedWorkflowRequest ] = useState<WorkflowInstanceListItemInterface>();
    const isPrivilegedUser: any = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);

    const hasWorkflowRequestDeletePermissions: boolean = useRequiredScopes(featureConfig?.workflowRequests?.scopes?.delete);
    const hasWorkflowRequestViewPermissions: boolean = useRequiredScopes(featureConfig?.workflowRequests?.scopes?.read);

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
                            { t("workflowRequests:form.placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("workflowRequests:form.placeholders.emptySearch.title") }
                    subtitle={ [
                        t("workflowRequests:form.placeholders.emptySearch.subtitles", { searchQuery })
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
                    title={ t("workflowRequests:form.placeholders.emptyListReadOnly.title") }
                    subtitle={ [ t("workflowRequests:form.placeholders.emptyListReadOnly.subtitles") ] }
                />
            );
        }

        return null;
    };

    /**
     * Resolves the status color for workflow instance status.
     *
     * @param status - The status of the workflow instance.
     * @returns The color for the status label.
     */
    const resolveInstanceStatusColor = (
        status: WorkflowInstanceStatus.ALL_TASKS | WorkflowInstanceStatus.PENDING | WorkflowInstanceStatus.APPROVED |
        WorkflowInstanceStatus.DELETED | WorkflowInstanceStatus.FAILED | WorkflowInstanceStatus.REJECTED,
    ): SemanticCOLORS => {
        switch (status) {
            case WorkflowInstanceStatus.APPROVED:
                return "green";
            case WorkflowInstanceStatus.PENDING:
                return "yellow";
            case WorkflowInstanceStatus.REJECTED:
                return "red";
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
    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${componentId}-list-item-delete-button`,
            hidden: (): boolean => !hasWorkflowRequestDeletePermissions || isPrivilegedUser,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, workflowRequestItem: WorkflowInstanceListItemInterface): void => {
                setCurrentDeletedWorkflowRequest(workflowRequestItem);
                setShowWorkflowRequestDeleteConfirmationModal(true);
            },
            popupText: (): string => t("workflowRequests:pageLayout.list.popups.delete"),
            renderer: "semantic-icon"
        }
    ];

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
                        {workflowRequest.eventType}
                    </Header>
                    <Header.Subheader>
                        {workflowRequest.requestInitiator || "-"} {resolveMeLabel(workflowRequest.requestInitiator, true)}
                    </Header.Subheader>
                </div>
            ),
            title: t("workflowRequests:list.columns.workflowInstanceId")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "status",
            id: "status",
            key: "status",
            render: (workflowRequest: WorkflowInstanceListItemInterface): ReactNode => {
                const color = resolveInstanceStatusColor(workflowRequest.status as WorkflowInstanceStatus);
                return (
                    <span className="workflow-requests-list-status-cell">
                        <span className={`status-indicator ${color}`} />
                        <Header as="h6" className="workflow-requests-list-status-text">
                            {formatStatus(workflowRequest.status)}
                        </Header>
                    </span>
                );
            },
            title: t("workflowRequests:list.columns.status")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "createdAt",
            id: "createdAt",
            key: "createdAt",
            render: (workflowRequest: WorkflowInstanceListItemInterface): ReactNode => (
                <Header as="h6" className="workflow-requests-list-date-cell">
                    {getFriendlyDate(workflowRequest.createdAt)}
                </Header>
            ),
            title: t("workflowRequests:list.columns.createdAt")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "updatedAt",
            id: "updatedAt",
            key: "updatedAt",
            render: (workflowRequest: WorkflowInstanceListItemInterface): ReactNode => (
                <Header as="h6" className="workflow-requests-list-date-cell">
                    {getFriendlyDate(workflowRequest.updatedAt)}
                </Header>
            ),
            title: t("workflowRequests:list.columns.updatedAt")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("workflowRequests:list.columns.actions")
        }
    ];

    const resolveMeLabel = (initiator: string, mini?: boolean): ReactNode => {
        if (authenticatedUser && initiator && authenticatedUser.includes(initiator)) {
            return (
                <Label size={mini ? "mini" : "small"} className="me-label">
                    Me
                </Label>
            );
        }
        return null;
    };

    // Helper to decide how to display the date
    const getFriendlyDate = (dateString: string): string => {
        if (!dateString) return "-";
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        
        if (diffMs < 0) {
            return formatDateString(dateString);
        }
        
        if (diffDays <= 30) {
            return moment(dateString).fromNow();
        } else {
            return formatDateString(dateString);
        }
    };

    // Helper to convert status to proper case
    const formatStatus = (status: string): string => {
        if (!status) return "-";
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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
            { showWorkflowRequestDeleteConfirmation && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ (): void => setShowWorkflowRequestDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showWorkflowRequestDeleteConfirmation }
                    assertionHint={ t("workflowRequests:confirmation.hint") }
                    assertionType="checkbox"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowWorkflowRequestDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        handleWorkflowRequestDelete(currentDeletedWorkflowRequest);
                        setShowWorkflowRequestDeleteConfirmationModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${componentId}-delete-confirmation-modal-header` }>
                        { t("workflowRequests:confirmation.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                    >
                        { t("workflowRequests:confirmation.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${componentId}-delete-confirmation-modal-content` }>
                        { t("workflowRequests:confirmation.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default WorkflowRequestsList;

