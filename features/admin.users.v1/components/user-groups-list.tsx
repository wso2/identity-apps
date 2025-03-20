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

import Box from "@oxygen-ui/react/Box/Box";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { updateGroupDetails } from "@wso2is/admin.groups.v1/api/groups";
import { GroupsMemberInterface, PatchGroupDataInterface } from "@wso2is/admin.groups.v1/models/groups";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileInfoInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
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
import { Divider, DropdownProps, Header, Icon, Label, PaginationProps, SemanticICONS } from "semantic-ui-react";
import "./user-roles-list.scss";

interface UserGroupsEditPropsInterface extends IdentifiableComponentInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Is the component loading
     */
    isLoading?: boolean;
    /**
     * Is the component in read only mode
     */
    isReadOnly?: boolean;
    /**
     * Callback to open the add new group modal
     */
    handleOpenAddNewGroupModal: () => void;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
}

export const UserGroupsListTable: FunctionComponent<UserGroupsEditPropsInterface> = (
    props: UserGroupsEditPropsInterface
): ReactElement => {

    const {
        user,
        isLoading,
        isReadOnly,
        handleOpenAddNewGroupModal,
        handleUserUpdate,
        "data-componentid": componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ paginatedGroups, setPaginatedGroups ] = useState<GroupsMemberInterface[]>(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingGroup, setDeletingGroup ] = useState<GroupsMemberInterface>(undefined);
    const [ isDeleting, setDeleting ] = useState<boolean>(false);

    const userGroupsList: GroupsMemberInterface[] = user?.groups;

    /**
     * Set initial selected roles options
     */
    useEffect(() => {
        setGroupsPage(0, listItemLimit, userGroupsList, searchQuery);
    }, [ user, searchQuery ]);

    /**
     * Util method to paginate retrieved groups  list.
     *
     * @param offsetValue - pagination offset value.
     * @param itemLimit - pagination item limit.
     * @param list - Role list.
     */
    const setGroupsPage = (
        offsetValue: number,
        itemLimit: number,
        list: GroupsMemberInterface[],
        searchQuery?: string
    ) => {
        if (!list) {
            setPaginatedGroups([]);

            return;
        }

        if (!isEmpty(searchQuery)) {
            const filteredList: GroupsMemberInterface[] = list.filter((group: GroupsMemberInterface) => {
                return group.display.toLowerCase().includes(searchQuery.toLowerCase());
            });

            setPaginatedGroups(filteredList?.slice(offsetValue, itemLimit + offsetValue));

            return;
        }

        setPaginatedGroups(list?.slice(offsetValue, itemLimit + offsetValue));
    };


    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = (data.activePage as number - 1) * listItemLimit;

        setListOffset(offsetValue);
        setGroupsPage(offsetValue, listItemLimit, userGroupsList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setGroupsPage(listOffset, data.value as number, userGroupsList);
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    const resolveTotalPages = (): number => {
        return Math.ceil(userGroupsList?.length / listItemLimit);
    };

    const unassignUserFromGroup = (group: GroupsMemberInterface) => {
        const operationData: PatchGroupDataInterface = {
            Operations: [ {
                "op": "remove",
                "path": `members[value eq ${user.id}]`
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateGroupDetails(group.value, operationData)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.groups.notifications.updateGroup.success.message")
                }));
                handleUserUpdate(user.id);
            }).catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.updateGroup.error.message")
                }));
            }).finally(() => {
                setDeleting(false);
                setDeletingGroup(undefined);
                setShowDeleteConfirmationModal(false);
            });
    };

    /**
     * Resolves data table columns.
     *
     * @returns the data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "groupName",
                id: "groupName",
                key: "groupName",
                render: (group: GroupsMemberInterface): ReactNode => {
                    const userGroup: string[] = group?.display?.split("/");
                    const userGroupName: string = userGroup.length === 1
                        ? userGroup[0]
                        : userGroup[1];

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ group.display }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <div>
                                { userGroupName as ReactNode }
                            </div>
                        </Header>
                    );
                },
                title: (
                    <div className="pl-3">
                        { t("user:updateUser.groups.editGroups.groupList.headers.1") }
                    </div>
                )
            },
            {
                allowToggleVisibility: false,
                dataIndex: "domain",
                id: "domain",
                key: "domain",
                render: (group: GroupsMemberInterface): ReactNode => {
                    const userGroup: string[] = group?.display?.split("/");
                    const domain: string = userGroup.length === 1
                        ? userstoresConfig.primaryUserstoreName
                        : userGroup[0];

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <Label size="mini">
                                { domain }
                            </Label>
                        </Header>
                    );
                },
                title: (
                    <div className="pl-3">
                        { t("user:updateUser.groups.editGroups.groupList.headers.0") }
                    </div>
                )
            }
        ];

        defaultColumns.push(
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ""
            }
        );

        return defaultColumns;
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                "data-componentid": `${ componentId }-user-list-item-delete-button`,
                "data-testid": `${ componentId }-user-list-item-delete-button`,
                hidden: (): boolean => isReadOnly,
                icon: (): SemanticICONS =>  "trash alternate",
                onClick: (e: SyntheticEvent, group: GroupsMemberInterface): void => {
                    setDeletingGroup(group);
                    setShowDeleteConfirmationModal(true);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    /**
     * Shows list placeholders.
     *
     * @returns Placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("users:usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    data-testid="user-mgt-empty-groups-list"
                    title={ t("user:updateUser.groups.editGroups." +
                        "groupList.emptyListPlaceholder.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (paginatedGroups?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid="user-mgt-empty-groups-list"
                    title={ t("user:updateUser.groups.editGroups." +
                        "groupList.emptyListPlaceholder.title") }
                    subtitle={ [
                        t("user:updateUser.groups.editGroups." +
                                "groupList.emptyListPlaceholder.subTitle.0"),
                        t("user:updateUser.groups.editGroups." +
                            "groupList.emptyListPlaceholder.subTitle.1"),
                        t("user:updateUser.groups.editGroups." +
                            "groupList.emptyListPlaceholder.subTitle.2")
                    ] }
                    action={
                        !isReadOnly && (
                            <PrimaryButton
                                data-testid="user-mgt-empty-groups-list-assign-group-button"
                                onClick={ handleOpenAddNewGroupModal }
                                loading={ isLoading }
                                disabled={ isLoading }
                            >
                                <Icon name="plus"/>
                                { t("applicationRoles:roleGroups.assignGroup") }
                            </PrimaryButton>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                />
            );
        }

        return null;
    };

    return (
        <EmphasizedSegment
            className="list-user-roles-section"
            data-testid="user-mgt-groups-list"
            padded="very"
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {
                    (!!searchQuery || paginatedGroups?.length > 0) &&  (
                        <div>
                            <Heading as="h4">
                                { t("user:updateUser.groups.editGroups.heading") }
                            </Heading>
                            <Heading subHeading ellipsis as="h6">
                                { t("user:updateUser.groups.editGroups.subHeading") }
                            </Heading>
                        </div>
                    )
                }
                { !isReadOnly && (!!searchQuery || paginatedGroups?.length > 0) && (
                    <PrimaryButton
                        data-testid="user-mgt-groups-list-update-button"
                        onClick={ handleOpenAddNewGroupModal }
                    >
                        <Icon name="plus"/>
                        { t("applicationRoles:roleGroups.assignGroup") }
                    </PrimaryButton>
                ) }
            </Box>
            <Divider hidden/>
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        data-testid="group-mgt-groups-list-advanced-search"
                        onFilter={ (query: string) => setSearchQuery(query?.trim()) }
                        disableSearchFilterDropdown
                        filterAttributeOptions={ [] }
                        placeholder={ t("console:manage.features.groups.advancedSearch.placeholder") }
                        defaultSearchAttribute={ "" }
                        defaultSearchOperator={ "" }
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={ paginatedGroups?.length }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-componentid={ `${ componentId }-user-groups-list-layout` }
                data-testid={ `${ componentId }-user-groups-list-layout` }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ resolveTotalPages() }
                totalListSize={ userGroupsList?.length }
                showPaginationPageLimit={ !isReadOnly }
                showTopActionPanel={ (!!searchQuery || userGroupsList?.length > 0) }
            >
                <DataTable<GroupsMemberInterface>
                    isLoading={ isLoading }
                    loadingStateOptions={ {
                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                        imageType: "circular"
                    } }
                    actions={ resolveTableActions() }
                    columns={ resolveTableColumns() }
                    data={ paginatedGroups }
                    onRowClick={ () =>  null }
                    placeholders={ showPlaceholders() }
                    selectable={ false }
                    showHeader={ true }
                    data-testid={ componentId }
                />
            </ListLayout>
            <ConfirmationModal
                primaryActionLoading={ isDeleting }
                data-testid={ `${ componentId }-confirmation-modal` }
                data-componentid={ `${ componentId }-confirmation-modal` }
                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                type="negative"
                open={ showDeleteConfirmationModal }
                primaryAction="Confirm"
                secondaryAction="Cancel"
                onSecondaryActionClick={ (): void => {
                    setShowDeleteConfirmationModal(false);
                } }
                onPrimaryActionClick={ (): void => {
                    setDeleting(true);
                    unassignUserFromGroup(deletingGroup);
                } }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ componentId }-confirmation-modal-header` }
                    data-componentid={ `${ componentId }-confirmation-modal-header` }
                >
                    { t("users:confirmations.unassignGroup.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Content
                    data-testid={ `${ componentId }-confirmation-modal-content` }
                    data-componentid={ `${ componentId }-confirmation-modal-content` }
                >
                    { t("users:confirmations.unassignGroup.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </EmphasizedSegment>
    );
};

/**
 * Default props for user groups list tab component.
 */
UserGroupsListTable.defaultProps = {
    "data-componentid": "edit-user-groups"
};
