/**
 * Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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
import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    SBACInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    LinkButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Header, Label, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { ApprovalTaskComponent } from "./approval-task";
import { fetchPendingApprovalDetails } from "../api";
import { getTableIcons } from "../configs";
import { ApprovalStatus, ApprovalTaskDetails, ApprovalTaskListItemInterface } from "../models";

/**
 * Prop types for the approvals list component.
 */
interface ApprovalsListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * Resolve the label color of the task.
     *
     * @param status - Approval status to resolve the tag color for.
     */
    resolveApprovalTagColor?: (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED |
            ApprovalStatus.BLOCKED | ApprovalStatus.APPROVED | ApprovalStatus.REJECTED
    ) => SemanticCOLORS;
    /**
     * Handles updating the status of the task.
     *
     * @param id - The ID of the approval task.
     * @param status - The new status to update the approval task to.
     */
    updateApprovalStatus?: (
        id: string,
        status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
    ) => void;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Application list.
     */
    list: ApprovalTaskListItemInterface[];
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Search query string
     */
    searchResult?: number;
    /**
     * Fetch approvals list
     */
    getApprovalsList?: () => void;
    /**
     * Approval status filter.
     */
    filterStatus?: string;
    /**
     * Handle the change of filter status.
     */
    onChangeStatusFilter?: (status: string) => void;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
    /**
     * Approvals URL.
     */
    approvalsUrl?: string;
}

/**
 * Approvals list component.
 *
 * @param props - Props injected to the approvals list component.
 * @returns JSX.Element
 */
export const ApprovalsList: FunctionComponent<ApprovalsListPropsInterface> = (
    props: ApprovalsListPropsInterface
): JSX.Element => {

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        approvalsUrl,
        getApprovalsList,
        onChangeStatusFilter,
        resolveApprovalTagColor,
        updateApprovalStatus,
        defaultListItemLimit,
        filterStatus,
        isLoading,
        list,
        selection = true,
        searchResult,
        showListItemActions = true,
        isSubmitting,
        [ "data-componentid" ]: componentId = "approvals-list"
    } = props;

    const [ isApprovalTaskDetailsLoading, setApprovalTaskDetailsLoading ] = useState<boolean>(false);
    const [ approval, setApproval ] = useState<ApprovalTaskDetails>(undefined);
    const [ openApprovalTaskModal, setOpenApprovalTaskModal ] = useState<boolean>(false);

    useEffect(() => {
        if (approval === undefined) {
            return;
        }

        setOpenApprovalTaskModal(true);
    }, [ approval ]);

    const getApprovalTaskDetails = (approval: ApprovalTaskListItemInterface): void => {
        setApprovalTaskDetailsLoading(true);

        fetchPendingApprovalDetails(approval.id, approvalsUrl)
            .then((response: ApprovalTaskDetails) => {
                let selectedApprovalTask: ApprovalTaskDetails = response;

                selectedApprovalTask = {
                    ...selectedApprovalTask,
                    createdTimeInMillis: approval.createdTimeInMillis,
                    operationType: approval?.taskType,
                    taskStatus: approval?.approvalStatus
                };
                setApproval(selectedApprovalTask);
            })
            .catch((error: any) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("common:approvalsPage.notifications.fetchApprovalDetails.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("common:approvalsPage.notifications.fetchApprovalDetails.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("common:approvalsPage.notifications.fetchApprovalDetails.genericError.message")
                }));
            })
            .finally(() => {
                setApprovalTaskDetailsLoading(false);
            });
    };

    /**
     * Handler for the approval detail button click.
     *
     * @param approval - The approval task list item to get details for.
     */
    const handleApprovalDetailClick = (approval: ApprovalTaskListItemInterface): void => {
        getApprovalTaskDetails(approval);
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React.ReactElement
     */
    const showPlaceholders = (): ReactElement => {
        if (searchResult === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ getApprovalsList }>
                            { t("common:approvalsPage.placeholders.emptySearchResults.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("common:approvalsPage.placeholders.emptySearchResults.title") }
                    subtitle={ [
                        t("common:approvalsPage.placeholders.emptySearchResults.subtitles.0"),
                        t("common:approvalsPage.placeholders.emptySearchResults.subtitles.1"),
                        t("common:approvalsPage.placeholders.emptySearchResults.subtitles.2")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.length === 0 && filterStatus !== ApprovalStatus.ALL) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ () => onChangeStatusFilter(ApprovalStatus.ALL) }>
                            { t("common:approvalsPage.placeholders.emptySearchResults.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("common:approvalsPage.placeholders.emptyApprovalFilter.title") }
                    subtitle={ [
                        t("common:approvalsPage.placeholders.emptyApprovalFilter.subtitles.0",
                            { status: filterStatus }),
                        t("common:approvalsPage.placeholders.emptyApprovalFilter.subtitles.1",
                            { status: filterStatus }),
                        t("common:approvalsPage.placeholders.emptyApprovalFilter.subtitles.2")
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        if (list?.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("common:approvalsPage.placeholders.emptyApprovalList.title") }
                    subtitle={ [
                        t("common:approvalsPage.placeholders.emptyApprovalList.subtitles.0"),
                        t("common:approvalsPage.placeholders.emptyApprovalList.subtitles.1"),
                        t("common:approvalsPage.placeholders.emptyApprovalList.subtitles.2")
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table actions.
     *
     * @returns TableActionsInterface[]
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                "data-testid": `${ componentId }-item-claim-button`,
                hidden: (approval: ApprovalTaskListItemInterface): boolean =>
                    approval?.approvalStatus === ApprovalStatus.APPROVED ||
                    approval?.approvalStatus === ApprovalStatus.REJECTED ||
                    approval?.approvalStatus === ApprovalStatus.RESERVED ||
                    approval?.approvalStatus === ApprovalStatus.BLOCKED,
                icon: (): SemanticICONS => "hand pointer outline",
                onClick: (e: SyntheticEvent, approval: ApprovalTaskListItemInterface): void =>
                    updateApprovalStatus(approval?.id, ApprovalStatus.CLAIM),
                popupText: (): string => t("common:assignYourself"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${ componentId }-item-release-button`,
                hidden: (approval: ApprovalTaskListItemInterface): boolean =>
                    approval?.approvalStatus === ApprovalStatus.APPROVED ||
                    approval?.approvalStatus === ApprovalStatus.REJECTED ||
                    approval?.approvalStatus === ApprovalStatus.READY ||
                    approval?.approvalStatus === ApprovalStatus.BLOCKED,
                icon: (): SemanticICONS => "paper plane",
                onClick: (e: SyntheticEvent, approval: ApprovalTaskListItemInterface): void =>
                    updateApprovalStatus(approval?.id, ApprovalStatus.RELEASE),
                popupText: (): string => t("common:unassign"),
                renderer: "semantic-icon"
            }
        ];

    };

    function formatApprovalName(taskType?: string): string {
        if (!taskType || typeof taskType !== "string") {
            return "approval request";
        }

        switch (taskType) {
            case "ADD_USER":
                return "user creation request";
            case "DELETE_USER":
                return "user removal request";
            case "ADD_ROLE":
                return "role creation request";
            case "UPDATE_ROLES_OF_USERS":
                return "user role assignment update request";
            default:
                return "approval request";
        }
    }

    function getHeaderText(status?: string): string {
        switch (status) {
            case ApprovalStatus.APPROVED:
                return "Request Approved:";
            case ApprovalStatus.REJECTED:
                return "Request Rejected:";
            default:
                return "Approval Required:";
        }
    }

    function getMessageContent(approval: ApprovalTaskListItemInterface): ReactNode {
        const taskName: string = formatApprovalName(approval?.taskType);

        switch (approval?.approvalStatus) {
            case ApprovalStatus.APPROVED:
                return (
                    <>
                        The <strong>{ taskName }</strong> has been approved and completed successfully.
                    </>
                );
            case ApprovalStatus.REJECTED:
                return (
                    <>
                        The <strong>{ taskName }</strong> has been rejected.
                    </>
                );
            default:
                return (
                    <>
                        You have a new <strong>{ taskName }</strong> awaiting your approval.
                    </>
                );
        }
    }

    /**
     * Resolves data table columns.
     *
     * @returns TableColumnInterface[]
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (approval: ApprovalTaskListItemInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${componentId}-item-heading` }
                        >
                            <GenericIcon
                                bordered
                                defaultIcon
                                relaxed="very"
                                size="micro"
                                shape="rounded"
                                spaced="right"
                                hoverable={ false }
                                icon={ getTableIcons().header.default } />
                            <Header.Content>
                                { getHeaderText(approval?.approvalStatus) }
                                <Label circular>
                                    { getMessageContent(approval) }
                                </Label>

                                <Header.Subheader data-componentid={ `${componentId}-item-sub-heading` }>
                                    <div className="pb-2">
                                        <Label
                                            circular
                                            size="mini"
                                            className="micro mr-2 ml-0 vertical-aligned-baseline"
                                            color={ resolveApprovalTagColor(approval.approvalStatus) } />
                                        { approval.approvalStatus }
                                    </div>
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("common:approvalsPage.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("common:approvalsPage.list.columns.actions")
            }
        ];
    };

    return (
        <>
            <DataTable<ApprovalTaskListItemInterface>
                className="approvals-table"
                externalSearch={ null }
                isLoading={ isLoading || isApprovalTaskDetailsLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ (e: SyntheticEvent, approval: ApprovalTaskListItemInterface): void => {
                    handleApprovalDetailClick(approval);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !(isLoading || isApprovalTaskDetailsLoading) && (showPlaceholders() !== null) }
                data-componentid={ componentId }
            />
            <ApprovalTaskComponent
                resolveApprovalTagColor={ resolveApprovalTagColor }
                onCloseApprovalTaskModal={ () => setOpenApprovalTaskModal(false) }
                openApprovalTaskModal={ openApprovalTaskModal }
                approval={ approval }
                updateApprovalStatus={ updateApprovalStatus }
                isSubmitting = { isSubmitting }
            />
        </>
    );
};
