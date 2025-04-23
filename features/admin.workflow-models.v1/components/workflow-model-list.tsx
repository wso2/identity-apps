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
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { getTableIcons } from "../configs";
import WorkflowModelConstants, { engineNameMap, templateNameMap } from "../constants/workflow-model-constants";
import { WorkflowListItemInterface } from "../models";

/**
 * Props interface for the Workflow Model List component.
 */
interface WorkflowModelListProps
    extends SBACInterface<FeatureConfigInterface>,
        LoadableComponentInterface,
        IdentifiableComponentInterface {

    /**
     * Optional number specifying the default limit for list items shown.
     */
    defaultListItemLimit?: number;

    /**
     * Array of workflow model objects to be rendered in the list.
     */
    workflowModelList: WorkflowListItemInterface[];

    /**
     * Optional callback to handle the deletion of a workflow model item.
     *
     * @param group - The workflow model item to be deleted.
     */
    handleWorkflowModelDelete?: (workflow: WorkflowListItemInterface) => void;

    /**
     * Optional callback to be triggered when the search query is cleared.
     */
    onSearchQueryClear?: () => void;

    /**
     * Current search query string used to filter the list.
     */
    searchQuery?: string;

    /**
     * Flag to control whether action buttons (e.g., edit/delete) should be shown for each list item.
     */
    showListItemActions?: boolean;
}


export const WorkflowModelList: React.FunctionComponent<WorkflowModelListProps> = (
    props: WorkflowModelListProps
): ReactElement => {

    const {
        isLoading,
        workflowModelList,
        onSearchQueryClear,
        handleWorkflowModelDelete,
        searchQuery,
        ["data-componentid"]: componentId
    } = props;

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const { t } = useTranslation();

    const [ showWorkflowModelDeleteConfirmation, setShowWorkflowModelDeleteConfirmationModal ] = useState(false);
    const [ currentDeletedWorkflowModel, setCurrentDeletedWorkflowModel ] = useState<WorkflowListItemInterface>();
    const isPrivilegedUser: any = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const hasWorkflowModelCreatePermissions: boolean = useRequiredScopes(featureConfig?.userStores?.scopes?.create);
    const hasWorkflowModelUpdatePermissions: boolean = useRequiredScopes(featureConfig?.userStores?.scopes?.update);
    const hasWorkflowModelDeletePermissions: boolean = useRequiredScopes(featureConfig?.userStores?.scopes?.delete);

    const handleWorkflowModelEdit = (workflowModelId: string) => {
        history.push(AppConstants.getPaths().get("WORKFLOW_MODEL_EDIT").replace(":id", workflowModelId));
    };

    const showPlaceholders = (): ReactElement => {
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${componentId}-empty-placeholder-search` }
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("roles:list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0", { searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (workflowModelList?.length === 0) {
            if (!hasWorkflowModelCreatePermissions) {
                return (
                    <EmptyPlaceholder
                        data-componentid={ `${componentId}-empty-placeholder-readonly` }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("workflowModels:placeholders.emptyListReadOnly.title") }
                        subtitle={ [ t("workflowModels:placeholders.emptyListReadOnly.subtitles") ] }
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
                                        history.push(WorkflowModelConstants.getPaths().get("WORKFLOW_MODEL_CREATE")) }
                                >
                                    <Icon name="add"/>
                                    { t("roles:list.emptyPlaceholders.emptyRoleList.action",
                                        { type: "Workflow Model" }) }
                                </PrimaryButton>
                            </Show>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("roles:list.emptyPlaceholders.emptyRoleList.title", { type: "workflow model" }) }
                        subtitle={ [
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.0", { type: "workflow models" }),
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.1", { type: "workflow model" }),
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.2", { type: "workflow model" })
                        ] }
                    />
                );
            }
        }

        return null;
    };

    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${componentId}-list-item-edit-button`,
            icon: (): SemanticICONS => hasWorkflowModelUpdatePermissions ? "pencil alternate" : "eye",
            onClick: (e: SyntheticEvent, workflowListItem: WorkflowListItemInterface): void => {
                handleWorkflowModelEdit(workflowListItem?.id);
            },
            popupText: (): string => hasWorkflowModelUpdatePermissions ? t("common:edit") : t("common:view"),
            renderer: "semantic-icon"
        },
        {
            "data-componentid": `${componentId}-list-item-delete-button`,
            hidden: (): boolean => !hasWorkflowModelDeletePermissions || isPrivilegedUser,
            icon: () => "trash alternate",
            onClick: (e: SyntheticEvent, process: WorkflowListItemInterface): void => {
                setCurrentDeletedWorkflowModel(process);
                setShowWorkflowModelDeleteConfirmationModal(true);
            },
            popupText: (): string => t("roles:list.popups.delete", { type: "workflow model" }),
            renderer: "semantic-icon"
        }
    ];

    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "name",
            id: "name",
            key: "name",
            render: (workflowModel: WorkflowListItemInterface): ReactNode => (
                <Header image as="h6" className="header-with-icon">
                    <GenericIcon
                        bordered
                        defaultIcon
                        relaxed="very"
                        size="micro"
                        shape="rounded"
                        spaced="right"
                        hoverable={ false }
                        icon={ getTableIcons().header.default }
                    />
                    <Header.Content>
                        { workflowModel.name }
                        <Header.Subheader>
                            { engineNameMap[workflowModel.engine] ?? workflowModel.engine }
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            ),
            title: t("console:manage.features.groups.list.columns.name")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "workflowTemplate",
            id: "workflowTemplate",
            key: "workflowTemplate",
            render: (workflowModel: WorkflowListItemInterface): ReactNode => (
                <Label circular size="tiny">
                    { templateNameMap[workflowModel.template] ?? workflowModel.template }
                </Label>
            ),
            title: t("console:manage.features.groups.list.columns.association")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("console:manage.features.groups.list.columns.actions")
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
                data={ workflowModelList }
                onRowClick={ (e: SyntheticEvent, workflowListItem: WorkflowListItemInterface): void => {
                    handleWorkflowModelEdit(workflowListItem?.id);
                } }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                showHeader={ false }
            />
            { showWorkflowModelDeleteConfirmation && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ (): void => setShowWorkflowModelDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showWorkflowModelDeleteConfirmation }
                    assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
                    assertionType="checkbox"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowWorkflowModelDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        handleWorkflowModelDelete(currentDeletedWorkflowModel);
                        setShowWorkflowModelDeleteConfirmationModal(false);
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
                        { t("roles:list.confirmations.deleteItem.message", { type: "workflow model" }) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${componentId}-delete-confirmation-modal-content` }>
                        { t("roles:list.confirmations.deleteItem.content", { type: "workflow model" }) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

/**
 * Default props for the component.
 */
WorkflowModelList.defaultProps = {
    "data-componentid": "workflow-model-list"
};

export default WorkflowModelList;

