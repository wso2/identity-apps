/**
 * Copyright (c) 2020-2026, WSO2 LLC. (https://www.wso2.com).
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
import { updateResources } from "@wso2is/admin.core.v1/api/bulk-operations";
import { AppState } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import { GroupsInterface, GroupsMemberInterface } from "@wso2is/admin.groups.v1/models/groups";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "@wso2is/admin.roles.v2/constants/role-constants";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import {
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { StringUtils } from "@wso2is/core/utils";
import {
    Heading,
    Hint,
    ItemTypeLabelPropsInterface,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError, AxiosRequestConfig } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Grid,
    Modal
} from "semantic-ui-react";
import { UserGroupsListTable } from "./user-groups-list";

/**
 * Number of groups fetched per page in the group assignment modal.
 */
const GROUPS_FETCH_LIMIT: number = 100;

interface UserGroupsPropsInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * On alert fired callback.
     */
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
}

export const UserGroupsList: FunctionComponent<UserGroupsPropsInterface> = (
    props: UserGroupsPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate,
        isReadOnly
    } = props;

    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const groupsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.groups);

    const groupUpdateScopes: string[] = groupsFeatureConfig?.scopes?.update ?? [];
    const hasGroupsUpdatePermission: boolean = useRequiredScopes(groupUpdateScopes);

    /**
     * Group memberships are updated through the SCIM2 Groups PATCH API, which requires
     * group update permission. Hence, the section is read only if the user lacks that
     * permission, in addition to the read only state passed down by the parent.
     */
    const isGroupsReadOnly: boolean = isReadOnly || !hasGroupsUpdatePermission;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ selectedGroupsList, setSelectedGroupList ] = useState<GroupsInterface[]>([]);
    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState<boolean>(false);
    const [ isSelectAllGroupsChecked, setIsSelectAllGroupsChecked ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);

    /**
     * Groups are fetched a page at a time and accumulated here, so that the modal is not
     * limited to the first page returned by the API.
     */
    const [ fetchedGroups, setFetchedGroups ] = useState<GroupsInterface[]>([]);
    const [ groupsStartIndex, setGroupsStartIndex ] = useState<number>(1);
    const [ hasMoreGroups, setHasMoreGroups ] = useState<boolean>(false);

    const domain: string = user?.userName?.split("/")?.length > 1
        ? user.userName.split("/")[0]
        : userstoresConfig.primaryUserstoreName;
    const excludedAttributes: string = "members,roles,meta";

    const {
        data: originalGroupsList,
        error: groupsListFetchRequestError,
        isLoading: isGroupsListFetchRequestLoading,
        isValidating: isGroupsListFetchRequestValidating
    } = useGroupList(
        GROUPS_FETCH_LIMIT,
        groupsStartIndex,
        searchQuery,
        domain,
        excludedAttributes
    );

    const groupsList: GroupsInterface[] = useMemo(() => {
        if (fetchedGroups?.length > 0) {
            const filteredGroups: GroupsInterface[] = [];

            fetchedGroups.map((group: GroupsInterface) => {
                let isGroupExistInUser: boolean = false;

                if (user?.groups?.length > 0) {
                    user.groups.forEach((userGroup: GroupsMemberInterface) => {
                        if (userGroup.display === group.displayName) {
                            isGroupExistInUser = true;
                        }
                    });
                }

                // Do not show the group if the group is already assigned to the user.
                if (!isGroupExistInUser) {
                    filteredGroups.push(group);
                }
            });

            return filteredGroups;
        }

        return [];
    }, [ fetchedGroups, user?.groups ]);

    const isLoading: boolean = useMemo(() => {
        return isGroupsListFetchRequestLoading || isGroupsListFetchRequestValidating;
    }, [ isGroupsListFetchRequestLoading, isGroupsListFetchRequestValidating ]);

    /**
     * Only the very first page should replace the list with a loading placeholder. Later
     * pages are appended below the groups that are already rendered.
     */
    const isInitialGroupsLoading: boolean = isLoading && fetchedGroups.length === 0;

    /**
     * Accumulate each page returned by the API.
     */
    useEffect(() => {
        if (!originalGroupsList) {
            return;
        }

        const page: GroupsInterface[] = originalGroupsList.Resources ?? [];
        const isPageFull: boolean = page.length === GROUPS_FETCH_LIMIT;

        setFetchedGroups((previousGroups: GroupsInterface[]) => {
            const merged: GroupsInterface[] = [ ...previousGroups ];

            // Guard against the same page being appended twice on revalidation.
            page.forEach((group: GroupsInterface) => {
                if (!merged.some((item: GroupsInterface) => item.id === group.id)) {
                    merged.push(group);
                }
            });

            return merged;
        });

        // A page that is not full is the last one. The listing is capped by the server's
        // maximum group list length, which is expected to be configured above the number
        // of groups in the server, so reaching the end here means the whole list is loaded.
        setHasMoreGroups(isPageFull);
    }, [ originalGroupsList ]);

    /**
     * Loads the next page of groups when the list is scrolled to the bottom.
     */
    const loadMoreGroups: () => void = useCallback(() => {
        if (!hasMoreGroups || isLoading) {
            return;
        }

        // The scroll observer can fire again before the state of the page in flight has
        // settled. Advance only once every group of the current page has been collected,
        // so that a page is never skipped or requested twice.
        if (fetchedGroups.length < groupsStartIndex - 1 + GROUPS_FETCH_LIMIT) {
            return;
        }

        setGroupsStartIndex((previousStartIndex: number) => previousStartIndex + GROUPS_FETCH_LIMIT);
    }, [ hasMoreGroups, isLoading, fetchedGroups.length, groupsStartIndex ]);

    /**
     * Restart pagination whenever the search query changes, so that results of the previous
     * query are not mixed with the new one.
     */
    useEffect(() => {
        setFetchedGroups([]);
        setGroupsStartIndex(1);
        setHasMoreGroups(false);
    }, [ searchQuery ]);

    /**
     * Whether every group currently listed is among the selected ones. The two lists are
     * compared by id rather than by length, because a selection made before a search is
     * kept while the listing narrows, and the counts can then match without the listed
     * groups being the selected ones.
     */
    const countSelectedAmongListed = (
        listed: GroupsInterface[],
        selected: GroupsInterface[]
    ): number =>
        listed.filter((group: GroupsInterface) =>
            selected.some((item: GroupsInterface) => item.id === group.id)).length;

    const areAllListedGroupsSelected = (
        listed: GroupsInterface[],
        selected: GroupsInterface[]
    ): boolean =>
        listed.length > 0
        && listed.every((group: GroupsInterface) =>
            selected.some((item: GroupsInterface) => item.id === group.id));

    /**
     * A newly loaded page brings in groups that are not selected yet, so the header
     * checkbox must stop claiming that everything in the list is selected.
     */
    useEffect(() => {
        setIsSelectAllGroupsChecked(areAllListedGroupsSelected(groupsList, selectedGroupsList));
    }, [ groupsList, selectedGroupsList ]);

    /**
     * Show error if group list fetch request failed.
     */
    useEffect(() => {
        if (groupsListFetchRequestError) {
            if (groupsListFetchRequestError.response && groupsListFetchRequestError.response.data &&
                groupsListFetchRequestError.response.data.description) {
                dispatch(
                    addAlert({
                        description: groupsListFetchRequestError.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.edit.groups.notifications.fetchError.message")
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: t("console:manage.features.roles.edit.groups.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.edit.groups.notifications.fetchError.message")
                })
            );
        }
    }, [ groupsListFetchRequestError ]);

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllGroups = () => {
        if (!isSelectAllGroupsChecked) {
            setSelectedGroupList(groupsList);
        } else {
            setSelectedGroupList([]);
        }
        setIsSelectAllGroupsChecked(!isSelectAllGroupsChecked);
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group: GroupsInterface) => {
        const checkedGroups: GroupsInterface[] = !isEmpty(selectedGroupsList)
            ? [ ...selectedGroupsList ]
            : [];

        const groupIndex: number = checkedGroups.findIndex(
            (selectedGroup: GroupsInterface) => selectedGroup.id === group.id);

        if (groupIndex !== -1) {
            checkedGroups.splice(groupIndex, 1);
        } else {
            checkedGroups.push(group);
        }

        setSelectedGroupList(checkedGroups);
        setIsSelectAllGroupsChecked(areAllListedGroupsSelected(groupsList, checkedGroups));
    };

    const handleOpenAddNewGroupModal = () => {
        setSearchQuery(null);
        setAddNewRoleModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setIsSelectAllGroupsChecked(false);
        setSearchQuery(null);
        setAddNewRoleModalView(false);
    };

    const handleUnselectedListSearch: DebouncedFunc<(e: FormEvent<HTMLInputElement>, query: string) => void>
    = useCallback(debounce((e: FormEvent<HTMLInputElement>, query: string) => {
        if (isEmpty(query.trim())) {
            setSearchQuery(null);
        } else {
            const processedQuery: string = "displayName co " + query;

            setSearchQuery(processedQuery);
        }
    }, 1000), []);

    useEffect(() => {
        return () => {
            handleUnselectedListSearch.cancel();
        };
    }, [ handleUnselectedListSearch ]);

    /**
     * This function handles assigning the roles to the user.
     *
     * @param user - User object
     * @param groups - Assigned groups
     */
    const updateUserGroup = (user: ProfileInfoInterface, groups: GroupsInterface[]) => {
        // If there are no groups to assign or the user is not available, return.
        if (groups?.length === 0 || !user) {
            return;
        }

        const bulkData: any = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ]
        };

        const addOperations: AxiosRequestConfig[] = [];

        let addOperation: AxiosRequestConfig = {
            data: {
                "Operations": [ {
                    "op": "add",
                    "value": {
                        "members": [ {
                            "display": user.userName,
                            "value": user.id
                        } ]
                    }
                } ]
            },
            method: "PATCH"
        };

        groups.map((group: GroupsInterface) => {
            addOperation = {
                ...addOperation,
                ...{ path: "/Groups/" + group.id }
            };
            addOperations.push(addOperation);
        });

        addOperations.map((operation: AxiosRequestConfig) => {
            bulkData.Operations.push(operation);
        });

        setIsSubmitting(true);

        updateResources(bulkData)
            .then(() => {
                onAlertFired({
                    description: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "success.message"
                    )
                });
                handleCloseAddNewGroupModal();
                handleUserUpdate(user.id);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                if (error?.response?.status === 404) {
                    return;
                }

                if (error?.response && error?.response?.data && error?.response?.data?.description) {
                    onAlertFired({
                        description: error.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "user:updateUser.groups.notifications.updateUserGroups." +
                            "error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "genericError.message"
                    )
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const resolveListItemLabel = (displayName: string): ItemTypeLabelPropsInterface => {
        const userGroup: string[]  = displayName?.split("/");

        let item: ItemTypeLabelPropsInterface = {
            labelColor: "olive",
            labelText: StringUtils.isEqualCaseInsensitive(primaryUserStoreDomainName, PRIMARY_USERSTORE)
                ? t("console:manage.features.users.userstores.userstoreOptions.primary")
                : primaryUserStoreDomainName
        };

        if (userGroup[0] !== APPLICATION_DOMAIN &&
            userGroup[0] !== INTERNAL_DOMAIN) {
            if (userGroup?.length > 1) {
                item = {
                    ...item,
                    labelText: userGroup[0]
                };
            }
        }

        return item;
    };

    const resolveListItem = (displayName: string): string => {
        const userGroup: string[]  = displayName?.split("/");

        if (userGroup?.length !== 1) {
            displayName = userGroup[1];
        }

        return displayName;
    };

    const addNewGroupModal = () => (
        <Modal
            data-testid="user-mgt-update-groups-modal"
            open={ showAddNewRoleModal }
            size="small"
        >
            <Modal.Header>
                { t("user:updateUser.groups.addGroupsModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("user:updateUser.groups.addGroupsModal.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content>
                <TransferComponent
                    selectionComponent
                    searchPlaceholder={ t("transferList:searchPlaceholder",
                        { type: "Groups" }) }
                    handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                        handleUnselectedListSearch(e, value);
                    } }
                    data-testid="user-mgt-update-groups-modal"
                    bordered={ false }
                >
                    <TransferList
                        bordered={ false }
                        isListEmpty={ groupsList?.length === 0 }
                        isLoading={ isInitialGroupsLoading }
                        hasMore={ hasMoreGroups }
                        loadMore={ loadMoreGroups }
                        listType="unselected"
                        listHeaders={ [
                            t("transferList:list.headers.0"),
                            t("transferList:list.headers.1")
                        ] }
                        handleHeaderCheckboxChange={ selectAllGroups }
                        isHeaderCheckboxChecked={ isSelectAllGroupsChecked }
                        emptyPlaceholderContent={ isEmpty(searchQuery)
                            ? t("transferList:list.emptyPlaceholders.users.roles.searchForResults", { type: "groups" })
                            : t("transferList:list.emptyPlaceholders.users.roles.unselected", { type: "groups" })
                        }
                        data-testid="user-mgt-update-groups-modal-unselected-groups-select-all-checkbox"
                        emptyPlaceholderDefaultContent={ t("transferList:list.emptyPlaceholders.default") }
                    >
                        {
                            groupsList?.map((group: GroupsInterface, index: number)=> {
                                return (
                                    <TransferListItem
                                        handleItemChange={
                                            () => handleUnassignedItemCheckboxChange(group)
                                        }
                                        key={ index }
                                        listItem={ resolveListItem(group?.displayName) }
                                        listItemId={ group?.id }
                                        listItemIndex={ index }
                                        listItemTypeLabel={ resolveListItemLabel(group?.displayName) }
                                        isItemChecked={ selectedGroupsList.findIndex((item: GroupsInterface) =>
                                            item.id === group.id) !== -1 }
                                        showSecondaryActions={ false }
                                        data-testid="user-mgt-update-groups-modal-unselected-groups"
                                    />
                                );
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    { !isInitialGroupsLoading && groupsList.length > 0 && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Hint
                                    compact
                                    data-componentid="user-mgt-update-groups-modal-selection-summary"
                                >
                                    { t("user:updateUser.groups.addGroupsModal.selectionSummary", {
                                        selected: countSelectedAmongListed(
                                            groupsList, selectedGroupsList),
                                        total: groupsList.length
                                    }) }
                                    {
                                        // A full page means there are more groups still to load.
                                        // Say so before the list is scrolled, so that selecting
                                        // all is never mistaken for selecting every group. Once
                                        // the last page has arrived the list is complete and
                                        // nothing more needs to be said.
                                        hasMoreGroups && (
                                            <>
                                                { " " }
                                                { t("user:updateUser.groups.addGroupsModal" +
                                                    ".listIncomplete") }
                                            </>
                                        )
                                    }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    ) }
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid="user-mgt-update-groups-modal-cancel-button"
                                floated="left"
                                onClick={ handleCloseAddNewGroupModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid="user-mgt-update-groups-modal-save-button"
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting || selectedGroupsList?.length === 0 }
                                onClick={ () => updateUserGroup(user, selectedGroupsList) }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
            <UserGroupsListTable
                handleOpenAddNewGroupModal={ handleOpenAddNewGroupModal }
                handleUserUpdate={ handleUserUpdate }
                isLoading={ isLoading }
                isReadOnly={ isGroupsReadOnly }
                user={ user }
            />
            { addNewGroupModal() }
        </>
    );
};
