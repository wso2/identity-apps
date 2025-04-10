import React, { ReactElement, ReactNode, SyntheticEvent, useState } from 'react'
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { LoadableComponentInterface, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { WorkflowDetails, WorkflowListItemInterface } from '../models';
import { AnimatedAvatar, AppAvatar, ConfirmationModal, DataTable, EmptyPlaceholder, GenericIcon, LinkButton, PrimaryButton, TableActionsInterface, TableColumnInterface } from '@wso2is/react-components';
import { UIConstants } from '@wso2is/admin.core.v1/constants/ui-constants';
import { Header, Icon, Label } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { getTableIcons } from "../configs";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";


interface ApprovalProcessListProps extends SBACInterface<FeatureConfigInterface>,
LoadableComponentInterface, TestableComponentInterface {

    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Groups list.
     */
    approvalProcessList: WorkflowListItemInterface[];
    /**
     * Group delete callback.
     * @param group - Deleting group.
     */
    handleApprovalProcessDelete?: (group: WorkflowListItemInterface) => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, group: WorkflowListItemInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;

}

/**
 * List component for Approval Process Management list
 *
 * @param props - Props injected to the component.
 * @returns Approval list component.
 */
export const ApprovalProcessList: React.FunctionComponent<ApprovalProcessListProps> = (props: ApprovalProcessListProps): ReactElement => {

    const {
        isLoading,
        approvalProcessList,
        handleApprovalProcessDelete,
        searchQuery,
        onListItemClick,
        selection
    } = props
    console.log("Received ", approvalProcessList);

    const { t } = useTranslation();

    const [ showApprovalProcessDeleteConfirmation, setShowApprovalProcessDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedApprovalProcess, setCurrentDeletedApprovalProcess ] = useState<WorkflowListItemInterface>();

    const generateHeaderContent = (name: string): ReactElement | string  => {
        return (
            <>

            </>
        )
    }

    const handleWorkflowModelEdit = (workflowModelId: string) => {
        history.push(AppConstants.getPaths().get("WORKFLOW_MODEL_EDIT").replace(":id",workflowModelId));
    }

        /**
     * Shows list placeholders.
     *
     * @returns Empty placeholders.
     */
        const showPlaceholders = (): ReactElement => {
            // When the search returns empty.
            if (searchQuery) {
                return (
                    <EmptyPlaceholder
                        action={ (
                            <LinkButton
                                // onClick={ null }
                            >
                                { t("roles:list.emptyPlaceholders.search.action") }
                            </LinkButton>
                        ) }
                        // image={ getEmptyPlaceholderIllustrations().emptySearch }
                        imageSize="tiny"
                        title={ t("roles:list.emptyPlaceholders.search.title") }
                        subtitle={ [
                            t("roles:list.emptyPlaceholders.search.subtitles.0",
                                { searchQuery: searchQuery }),
                            t("roles:list.emptyPlaceholders.search.subtitles.1")
                        ] }
                    />
                );
            }
            if (approvalProcessList?.length === 0) {
                return (
                    <EmptyPlaceholder
                        action={ (
                            // <Show
                            //     when={ featureConfig?.groups?.scopes?.create }
                            // >
                                <PrimaryButton
                                    onClick={ null }
                                >
                                    <Icon name="add"/>
                                    { t("roles:list.emptyPlaceholders.emptyRoleList.action",
                                        { type: "Group" }) }
                                </PrimaryButton>
                            // </Show>
                        ) }
                        image={ null }
                        imageSize="tiny"
                        title={null}
                        subtitle={null}
                    />
                );
            }
    
            return null;
        
            return null;
        };

        const resolveTableActions = (): TableActionsInterface[] => {
            return [
                {
                    "data-componentid": "approval-process-list-item-edit-button",
                    "data-testid": "approval-process-list-item-edit-button",
                    icon: () => "pencil alternate",
                    onClick: (e: SyntheticEvent, workflowListItem: WorkflowListItemInterface): void => {
                        console.log("Edit clicked for", process);
                        handleWorkflowModelEdit(workflowListItem?.id)
                    },
                    popupText: () => t("common:edit"),
                    renderer: "semantic-icon"
                },
                {
                    "data-componentid": "approval-process-list-item-delete-button",
                    "data-testid": "approval-process-list-item-delete-button",
                    icon: () => "trash alternate",
                    onClick: (e: SyntheticEvent, process: WorkflowListItemInterface): void => {
                        setCurrentDeletedApprovalProcess(process);
                        setShowApprovalProcessDeleteConfirmationModal(!showApprovalProcessDeleteConfirmation);
                    },
                    popupText: (): string => t("roles:list.popups.delete", { type:      "Group" }),
                    renderer: "semantic-icon"
                }
            ];
        };

    /**
     * Resolves data table columns.
     *
     * @returns Table Columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (approvalProcess: WorkflowListItemInterface): ReactNode => (
                    <Header 
                        image as="h6" 
                        className="header-with-icon"
                    >
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
                            {approvalProcess.name}
                            <Header.Subheader>                                       
                                { approvalProcess.engine }
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
                render: (approvalProcess: WorkflowListItemInterface): ReactNode => (
                    <Label circular size="tiny">
                        { approvalProcess.template }
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
    };

    console.log("Received ", approvalProcessList);


  return (
    <>
    <DataTable<WorkflowListItemInterface>
        className="approval-processes-table"
        isLoading={ true}
        loadingStateOptions={{
            count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
            imageType: "square"
        }}
        actions={resolveTableActions()}
        columns={resolveTableColumns()}
        placeholders={ showPlaceholders() }
        data={approvalProcessList}
        onRowClick={(e: SyntheticEvent, workflowListItem: WorkflowListItemInterface): void => {
            handleWorkflowModelEdit(workflowListItem?.id);
        }}
        showHeader={false}
    />
    {
        showApprovalProcessDeleteConfirmation &&
            (<ConfirmationModal
                onClose={ (): void => setShowApprovalProcessDeleteConfirmationModal(false) }
                type="negative"
                open={ showApprovalProcessDeleteConfirmation }
                assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
                assertionType="checkbox"
                primaryAction="Confirm"
                secondaryAction="Cancel"
                onSecondaryActionClick={ (): void => setShowApprovalProcessDeleteConfirmationModal(false) }
                onPrimaryActionClick={ (): void => {
                    handleApprovalProcessDelete(currentDeletedApprovalProcess);
                    setShowApprovalProcessDeleteConfirmationModal(false);
                } }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("roles:list.confirmations.deleteItem.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached negative>
                    { t("roles:list.confirmations.deleteItem.message",
                        { type: "group" }) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("roles:list.confirmations.deleteItem.content",
                        { type: "group" }) }
                </ConfirmationModal.Content>
            </ConfirmationModal>)
            }
    </>
  )
}

export default ApprovalProcessList
