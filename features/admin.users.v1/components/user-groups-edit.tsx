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

import Box from "@oxygen-ui/react/Box";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { updateResources } from "@wso2is/admin.core.v1/api/bulk-operations";
import { AppState } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { getGroupList, useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import {
    GroupListInterface,
    GroupsInterface,
    GroupsMemberInterface
} from "@wso2is/admin.groups.v1/models/groups";
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
    ItemTypeLabelPropsInterface,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FormEvent,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    Grid,
    Modal
} from "semantic-ui-react";
import { UserGroupsListTable } from "./user-groups-list";

/**
 * Number of groups fetched per page once the user scrolls past the first response.
 */
const GROUPS_PAGE_SIZE: number = 50;

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

    const [ groupsList, setGroupsList ] = useState<GroupsInterface[]>([]);
    const [ selectedGroupsList, setSelectedGroupList ] = useState<GroupsInterface[]>([]);
    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState<boolean>(false);
    const [ isSelectAllGroupsChecked, setIsSelectAllGroupsChecked ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ searchValue, setSearchValue ] = useState<string>(null);
    const [ fetchedGroups, setFetchedGroups ] = useState<GroupsInterface[]>(undefined);
    const [ totalGroupCount, setTotalGroupCount ] = useState<number>(0);
    const [ storeGroupCount, setStoreGroupCount ] = useState<number>(null);
    const [ isShowingSelectedGroups, setIsShowingSelectedGroups ] = useState<boolean>(false);

    // Bumped by a search or a re-fetch, so a page of an older fetch is dropped when it arrives late.
    const groupFetchSequence: MutableRefObject<number> = useRef<number>(0);
    // Identifies the first response, so a revalidation with the same groups keeps the scrolled pages.
    const firstPageSignature: MutableRefObject<string> = useRef<string>(null);
    const loadedGroupsRef: MutableRefObject<GroupsInterface[]> = useRef<GroupsInterface[]>([]);
    const isLoadingMoreRef: MutableRefObject<boolean> = useRef<boolean>(false);
    // Read by the scroll callback, as an observer from an earlier render can still call it.
    const canLoadMoreRef: MutableRefObject<boolean> = useRef<boolean>(false);

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
        null,
        null,
        searchQuery,
        domain,
        excludedAttributes
    );

    /**
     * Display names of the groups the user already belongs to.
     */
    const assignedGroupNames: Set<string> = useMemo(() => {
        const names: Set<string> = new Set<string>();

        if (user?.groups?.length > 0) {
            user.groups.forEach((userGroup: GroupsMemberInterface) => {
                const groupDomain: string = userGroup?.display?.split("/")[0];

                if (userGroup?.display && groupDomain !== APPLICATION_DOMAIN && groupDomain !== INTERNAL_DOMAIN) {
                    names.add(userGroup.display);
                }
            });
        }

        return names;
    }, [ user?.groups ]);

    const isLoading: boolean = useMemo(() => {
        return isGroupsListFetchRequestLoading || isGroupsListFetchRequestValidating;
    }, [ isGroupsListFetchRequestLoading, isGroupsListFetchRequestValidating ]);

    const hasMoreGroups: boolean = (fetchedGroups?.length ?? 0) < totalGroupCount;
    const canLoadMoreGroups: boolean = hasMoreGroups && !isShowingSelectedGroups && !groupsListFetchRequestError;

    canLoadMoreRef.current = canLoadMoreGroups;

    /**
     * Loads the next page and appends it. Called when the end of the list is scrolled into view.
     * Re-created after each page, so the list checks again whether its end is still in view.
     */
    const loadMoreGroups: () => void = useCallback((): void => {
        if (isLoadingMoreRef.current || !canLoadMoreRef.current) {
            return;
        }

        const loaded: GroupsInterface[] = loadedGroupsRef.current ?? [];

        if (loaded.length >= totalGroupCount) {
            return;
        }

        const sequence: number = groupFetchSequence.current;

        isLoadingMoreRef.current = true;

        getGroupList(domain, excludedAttributes, GROUPS_PAGE_SIZE, loaded.length + 1, searchQuery)
            .then((response: AxiosResponse<GroupListInterface>) => {
                if (sequence !== groupFetchSequence.current) {
                    return;
                }

                const page: GroupsInterface[] = response?.data?.Resources ?? [];
                const merged: GroupsInterface[] = [ ...loaded ];
                const seen: Set<string> = new Set<string>(loaded.map((group: GroupsInterface) => group.id));

                // Groups can be added or removed between two pages, so keep the first copy of a group.
                page.forEach((group: GroupsInterface) => {
                    if (!seen.has(group.id)) {
                        seen.add(group.id);
                        merged.push(group);
                    }
                });

                // Nothing new came back, so asking again would request the same window. Stop here.
                if (merged.length === loaded.length) {
                    setTotalGroupCount(loaded.length);
                    if (!searchQuery) {
                        setStoreGroupCount(loaded.length);
                    }

                    return;
                }

                loadedGroupsRef.current = merged;
                setFetchedGroups(merged);
            })
            .catch(() => {
                if (sequence !== groupFetchSequence.current) {
                    return;
                }

                dispatch(
                    addAlert({
                        description: t("console:manage.features.roles.edit.groups.notifications" +
                            ".fetchError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.edit.groups.notifications.fetchError.message")
                    })
                );
            })
            .finally(() => {
                if (sequence === groupFetchSequence.current) {
                    isLoadingMoreRef.current = false;
                }
            });
    }, [ domain, excludedAttributes, searchQuery, totalGroupCount, fetchedGroups, dispatch, t ]);

    /**
     * A search replaces the list, so any page still in flight for the previous query is stale.
     */
    useEffect(() => {
        groupFetchSequence.current += 1;
        isLoadingMoreRef.current = false;
    }, [ searchQuery ]);

    /**
     * Starts the list from the first response. Further pages are fetched only when the user scrolls.
     */
    useEffect(() => {
        if (!originalGroupsList) {
            return;
        }

        const firstPage: GroupsInterface[] = originalGroupsList.Resources ?? [];
        const signature: string = `${ searchQuery }|${ originalGroupsList.totalResults }:${ firstPage.map(
            (group: GroupsInterface) => group.id).join(",") }`;

        if (signature === firstPageSignature.current) {
            return;
        }

        firstPageSignature.current = signature;
        groupFetchSequence.current += 1;
        isLoadingMoreRef.current = false;
        loadedGroupsRef.current = firstPage;
        setFetchedGroups(firstPage);
        // A server that caps the listing reports the capped number, so no further page is requested.
        setTotalGroupCount(originalGroupsList.totalResults ?? firstPage.length);
        // The unfiltered total is kept for the selection count while a search reports its own.
        if (!searchQuery) {
            setStoreGroupCount(originalGroupsList.totalResults ?? firstPage.length);
        }
    }, [ originalGroupsList ]);

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
     * Whether every listed group is selected. Compared by id, as the selection is kept across searches.
     */
    const areAllListedGroupsSelected = (listed: GroupsInterface[], selected: GroupsInterface[]): boolean =>
        listed.length > 0
        && listed.every((group: GroupsInterface) =>
            selected.some((item: GroupsInterface) => item.id === group.id));

    /**
     * Groups to list. A search lists its matches only, and the selection outside them is kept for later.
     */
    const buildListedGroups = (
        baseList: GroupsInterface[],
        selected: GroupsInterface[],
        query: string
    ): GroupsInterface[] => {
        // Do not show the group if the group is already assigned to the user.
        const listed: GroupsInterface[] = baseList.filter((group: GroupsInterface) =>
            !assignedGroupNames.has(group.displayName));

        if (query) {
            return listed;
        }

        selected?.forEach((group: GroupsInterface) => {
            if (!listed.some((item: GroupsInterface) => item.id === group.id)) {
                listed.push(group);
            }
        });

        return listed;
    };

    /**
     * Rebuilds the list when a page arrives or the query changes.
     */
    useEffect(() => {
        if (!showAddNewRoleModal || !fetchedGroups || isShowingSelectedGroups) {
            return;
        }

        // A rejected listing lists no rows rather than the rows of the previous query.
        const listed: GroupsInterface[] = buildListedGroups(groupsListFetchRequestError ? [] : fetchedGroups,
            selectedGroupsList, searchQuery);

        setGroupsList(listed);
        // A group that arrives later is not selected on the user's behalf. It clears the header checkbox instead.
        setIsSelectAllGroupsChecked(areAllListedGroupsSelected(listed, selectedGroupsList));
    }, [ fetchedGroups, searchQuery, groupsListFetchRequestError ]);

    /**
     * Switches the list between the selection and the loaded groups.
     */
    useEffect(() => {
        if (!showAddNewRoleModal) {
            return;
        }

        const listed: GroupsInterface[] = isShowingSelectedGroups
            ? [ ...selectedGroupsList ]
            : buildListedGroups(groupsListFetchRequestError ? [] : fetchedGroups ?? [], selectedGroupsList,
                searchQuery);

        setGroupsList(listed);
        setIsSelectAllGroupsChecked(areAllListedGroupsSelected(listed, selectedGroupsList));
    }, [ isShowingSelectedGroups ]);

    /**
     * Ticks or unticks the listed groups. Groups selected outside the list stay selected.
     */
    const selectAllGroups = () => {
        if (!isSelectAllGroupsChecked) {
            const selected: GroupsInterface[] = [ ...selectedGroupsList ];

            groupsList.forEach((group: GroupsInterface) => {
                if (!selected.some((item: GroupsInterface) => item.id === group.id)) {
                    selected.push(group);
                }
            });
            setSelectedGroupList(selected);
        } else {
            setSelectedGroupList(selectedGroupsList.filter((item: GroupsInterface) =>
                !groupsList.some((group: GroupsInterface) => group.id === item.id)));
        }
        setIsSelectAllGroupsChecked(!isSelectAllGroupsChecked && groupsList.length > 0);
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
        handleUnselectedListSearch.cancel();
        setSearchQuery(null);
        setSearchValue(null);
        setIsShowingSelectedGroups(false);
        setSelectedGroupList([]);
        setGroupsList(buildListedGroups(fetchedGroups ?? [], [], null));
        setIsSelectAllGroupsChecked(false);
        setAddNewRoleModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        handleUnselectedListSearch.cancel();
        setIsSelectAllGroupsChecked(false);
        setSearchQuery(null);
        setSearchValue(null);
        setIsShowingSelectedGroups(false);
        setAddNewRoleModalView(false);
    };

    const handleUnselectedListSearch: DebouncedFunc<(e: FormEvent<HTMLInputElement>, query: string) => void>
    = useCallback(debounce((e: FormEvent<HTMLInputElement>, query: string) => {
        setIsShowingSelectedGroups(false);

        if (isEmpty(query.trim())) {
            setSearchValue(null);
            setSearchQuery(null);
        } else {
            const processedQuery: string = "displayName co " + query;

            setSearchValue(query);
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

    /**
     * Number of groups that can still be assigned, as the groups the user already belongs to are not listed.
     */
    const resolveAssignableGroupCount = (): number => {
        const selectedCount: number = selectedGroupsList?.length ?? 0;

        // A store that cannot count its groups can report fewer than are selected.
        return Math.max(storeGroupCount - assignedGroupNames.size, selectedCount);
    };

    /**
     * Describes what the list holds when it is not the plain group list.
     */
    const resolveListStatus = (): string => {
        if (isShowingSelectedGroups) {
            return t("user:updateUser.groups.addGroupsModal.showingSelectedGroups");
        }

        if (!searchQuery) {
            return null;
        }

        // Matches the user already belongs to are not listed, so they are not counted either.
        const assignedMatchCount: number = (fetchedGroups ?? []).filter((group: GroupsInterface) =>
            assignedGroupNames.has(group.displayName)).length;

        return t("user:updateUser.groups.addGroupsModal.matchingGroups", {
            search: searchValue,
            total: Math.max(totalGroupCount - assignedMatchCount, 0)
        });
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
                        isListEmpty={ groupsList?.length === 0 && !canLoadMoreGroups }
                        isLoading={ isLoading && !isShowingSelectedGroups }
                        hasMore={ canLoadMoreGroups }
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
                <Box mt={ 1 }>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {
                            storeGroupCount !== null && (
                                <Heading
                                    subHeading
                                    as="h6"
                                    compact
                                    data-componentid="user-mgt-update-groups-modal-selected-count"
                                    data-testid="user-mgt-update-groups-modal-selected-count"
                                >
                                    { t("user:updateUser.groups.addGroupsModal.selectedOfTotal", {
                                        selected: selectedGroupsList?.length ?? 0,
                                        total: resolveAssignableGroupCount()
                                    }) }
                                </Heading>
                            )
                        }
                        {
                            (isShowingSelectedGroups || selectedGroupsList?.length > 0) && (
                                <LinkButton
                                    compact
                                    data-componentid="user-mgt-update-groups-modal-show-selected-button"
                                    data-testid="user-mgt-update-groups-modal-show-selected-button"
                                    onClick={ () => {
                                        handleUnselectedListSearch.flush();
                                        setIsShowingSelectedGroups(!isShowingSelectedGroups);
                                    } }
                                >
                                    {
                                        isShowingSelectedGroups
                                            ? t("user:updateUser.groups.addGroupsModal.showAll")
                                            : t("user:updateUser.groups.addGroupsModal.showSelected")
                                    }
                                </LinkButton>
                            )
                        }
                    </Box>
                    {
                        !isLoading && !groupsListFetchRequestError && resolveListStatus() && (
                            <Heading
                                subHeading
                                as="h6"
                                compact
                                data-componentid="user-mgt-update-groups-modal-list-status"
                                data-testid="user-mgt-update-groups-modal-list-status"
                            >
                                { resolveListStatus() }
                            </Heading>
                        )
                    }
                    {
                        canLoadMoreGroups && !isLoading && (
                            <Heading
                                subHeading
                                as="h6"
                                compact
                                data-componentid="user-mgt-update-groups-modal-list-incomplete"
                                data-testid="user-mgt-update-groups-modal-list-incomplete"
                            >
                                {
                                    searchQuery
                                        ? t("user:updateUser.groups.addGroupsModal.scrollForMore")
                                        : t("user:updateUser.groups.addGroupsModal.listIncomplete")
                                }
                            </Heading>
                        )
                    }
                </Box>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
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
