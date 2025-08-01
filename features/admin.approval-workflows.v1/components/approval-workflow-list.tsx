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
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface, LoadableComponentInterface, SBACInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { WorkflowListItemInterface } from "../models/approval-workflows";

/**
 * Props interface for the Approval Workflow List component.
 */
interface ApprovalWorkflowListProps
    extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
        IdentifiableComponentInterface {

    /**
     * Array of approval workflow objects to be rendered in the list.
     */
    approvalWorkflowList: WorkflowListItemInterface[];
    /**
     * Optional prop to indicate if the component is in a loading state.
     */
    isLoading: boolean;
    /**
     * Optional number specifying the default limit for list items shown.
     */
    defaultListItemLimit?: number;
    /**
     * Optional callback to handle the deletion of an approval workflow item.
     *
     * @param workflow - The approval workflow item to be deleted.
     */
    handleApprovalWorkflowDelete?: (workflow: WorkflowListItemInterface) => void;
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
 * This component renders the approval workflow List.
 *
 * @param props - Props injected to the component.
 *
 * @returns approval workflow list component.
 */
const ApprovalWorkflowList: React.FunctionComponent<ApprovalWorkflowListProps> = (
    props: ApprovalWorkflowListProps
): ReactElement => {

    const {
        isLoading,
        approvalWorkflowList,
        onSearchQueryClear,
        handleApprovalWorkflowDelete,
        searchQuery,
        ["data-componentid"]: componentId = "approval-workflow-list"
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showApprovalWorkflowDeleteConfirmation, setShowApprovalWorkflowDeleteConfirmationModal ] = useState(false);
    const [ currentDeletedApprovalWorkflow, setCurrentDeletedApprovalWorkflow ] = useState<WorkflowListItemInterface>();
    const isPrivilegedUser: any = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const hasApprovalWorkflowCreatePermissions: boolean = useRequiredScopes(featureConfig?.workflows?.scopes?.create);
    const hasApprovalWorkflowUpdatePermissions: boolean = useRequiredScopes(featureConfig?.workflows?.scopes?.update);
    const hasApprovalWorkflowDeletePermissions: boolean = useRequiredScopes(featureConfig?.workflows?.scopes?.delete);

    const handleApprovalWorkflowEdit = (approvalWorkflowId: string) => {
        history.push(AppConstants.getPaths().get("APPROVAL_WORKFLOW_EDIT").replace(":id", approvalWorkflowId));
    };

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

        if ((approvalWorkflowList?.length === 0)) {
            if (!hasApprovalWorkflowCreatePermissions) {
                return (
                    <EmptyPlaceholder
                        data-componentid={ `${componentId}-empty-placeholder-readonly` }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("approvalWorkflows:form.placeholders.emptyListReadOnly.title") }
                        subtitle={ [ t("approvalWorkflows:form.placeholders.emptyListReadOnly.subtitles") ] }
                    />
                );
            } else {
                return (
                    <EmptyPlaceholder
                        data-componentid={ `${componentId}-empty-placeholder-create` }
                        action={ (
                            <Show when={ featureConfig?.groups?.scopes?.create }>
                                <PrimaryButton
                                    onClick={ () =>
                                        history.push(AppConstants.getPaths().get("APPROVAL_WORKFLOW_CREATE")) }
                                >
                                    <Icon name="add"/>
                                    { t("approvalWorkflows:form.placeholders.emptyList.action") }
                                </PrimaryButton>
                            </Show>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("approvalWorkflows:form.placeholders.emptyList.title") }
                        subtitle={ [
                            t("approvalWorkflows:form.placeholders.emptyList.subtitles" )
                        ] }
                    />
                );
            }
        }

        return null;
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${componentId}-list-item-edit-button`,
            icon: (): SemanticICONS => hasApprovalWorkflowUpdatePermissions ? "pencil alternate" : "eye",
            onClick: (e: SyntheticEvent, workflowListItem: WorkflowListItemInterface): void => {
                handleApprovalWorkflowEdit(workflowListItem?.id);
            },
            popupText: (): string => hasApprovalWorkflowUpdatePermissions ? t("common:edit") : t("common:view"),
            renderer: "semantic-icon"
        },
        {
            "data-componentid": `${componentId}-list-item-delete-button`,
            hidden: (): boolean => !hasApprovalWorkflowDeletePermissions || isPrivilegedUser,
            icon: () => "trash alternate",
            onClick: (e: SyntheticEvent, process: WorkflowListItemInterface): void => {
                setCurrentDeletedApprovalWorkflow(process);
                setShowApprovalWorkflowDeleteConfirmationModal(true);
            },
            popupText: (): string => t("approvalWorkflows:pageLayout.list.popups.delete"),
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
            dataIndex: "name",
            id: "name",
            key: "name",
            render: (approvalWorkflow: WorkflowListItemInterface): ReactNode => (
                <Header image as="h6" className="header-with-icon">
                    <AppAvatar
                        image={ (
                            <AnimatedAvatar
                                name={ approvalWorkflow?.name[ 0 ] }
                                size="mini"
                                data-componentid={ `${ componentId }-item-image-inner` }
                            />
                        ) }
                        size="mini"
                        spaced="right"
                        data-componentid={ `${ componentId }-item-image` }
                    />
                    <Header.Content>
                        { approvalWorkflow.name }
                        { approvalWorkflow.description && (
                            <Header.Subheader>
                                { approvalWorkflow.description.length > 90
                                    ? approvalWorkflow.description.slice(0, 90) + "..."
                                    : approvalWorkflow.description
                                }
                            </Header.Subheader>
                        ) }
                    </Header.Content>
                </Header>
            ),
            title: t("console:manage.features.approvalWorkflows.list.columns.name")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("console:manage.features.approvalWorkflows.list.columns.actions")
        }
    ];

    return (
        <>
            <DataTable<WorkflowListItemInterface>
                data-componentid={ `${componentId}-list` }
                className="workflow-models-table"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                placeholders={ showPlaceholders() }
                data={ approvalWorkflowList }
                onRowClick={ (e: SyntheticEvent, workflowListItem: WorkflowListItemInterface): void => {
                    handleApprovalWorkflowEdit(workflowListItem?.id);
                } }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                showHeader={ false }
            />
            { showApprovalWorkflowDeleteConfirmation && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ (): void => setShowApprovalWorkflowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showApprovalWorkflowDeleteConfirmation }
                    assertionHint={ t("approvalWorkflows:confirmation.hint") }
                    assertionType="checkbox"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowApprovalWorkflowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        handleApprovalWorkflowDelete(currentDeletedApprovalWorkflow);
                        setShowApprovalWorkflowDeleteConfirmationModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${componentId}-delete-confirmation-modal-header` }>
                        { t("approvalWorkflows:confirmation.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                    >
                        { t("approvalWorkflows:confirmation.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${componentId}-delete-confirmation-modal-content` }>
                        { t("approvalWorkflows:confirmation.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default ApprovalWorkflowList;

