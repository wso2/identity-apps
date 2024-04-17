/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import find from "lodash-es/find";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations
} from "../../../../admin.core.v1";
import { EventPublisher } from "../../../../admin.core.v1/utils";
import {
    GroupsInterface,
    SearchGroupInterface,
    deleteGroupById,
    searchGroupList,
    useGroupList
} from "../../../../admin.groups.v1";
import { GroupConstants } from "../../../../admin.groups.v1/constants";
import { useUserStores } from "../../../../admin.userstores.v1/api/user-stores";
import { CONSUMER_USERSTORE } from "../../../../admin.userstores.v1/constants/user-store-constants";
import { UserStoreListItem } from "../../../../admin.userstores.v1/models/user-stores";
import { UserStoreUtils } from "../../../utils/user-store-utils";
import { GroupList } from "../groups-list";
import { CreateGroupWizard } from "../wizard";

const GROUPS_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

/**
 * React component to list User Groups.
 *
 * @returns the React Element to list User Groups.
 */
const GroupsPage: FunctionComponent<any> = (): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ userStoreOptions ] = useState([]);
    const [ userStore ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isReadOnlyUserStoresListLoading, setReadOnlyUserStoresListLoading ] = useState<boolean>(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ groupsError, setGroupsError ] = useState<boolean>(false);
    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>([]);
    const [ paginatedGroups, setPaginatedGroups ] = useState<GroupsInterface[]>([]);
    const [ paginatedFilteredGroups, setPaginatedFilteredGroups ] = useState<GroupsInterface[]>([]);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(GROUPS_SORTING_OPTIONS[ 0 ]);
    const excludeMembers: string = "members";

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const [ userStoreOption, setuserStoreOption ] = useState<string>(GroupConstants.ALL_GROUPS);
    const [ enabledUserStores, setEnabledUserStores ] = useState<UserStoreListItem[]>([]);

    const {
        data: originalGroupList,
        isLoading: isGroupListFetchRequestLoading,
        error: groupListFetchRequestError,
        mutate: mutateGroupListFetchRequest,
        response: groupListFetchRequestResponse
    } = useGroupList(userStore, excludeMembers);

    const {
        data: userStoreList,
        isLoading: isUserStoreListFetchRequestLoading,
        error: userStoreListFetchRequestError
    } = useUserStores(null);

    /**
     * Moderate Groups response from the API.
     */
    useEffect(() => {
        if (!originalGroupList) {
            return;
        }

        if (groupListFetchRequestResponse.status === 200) {
            const groupResources: GroupsInterface[] = originalGroupList.Resources;

            if (groupResources && groupResources instanceof Array && groupResources.length !== 0) {
                setGroupsList(groupResources);
                setGroupsPage(0, listItemLimit, groupResources);
            } else {
                setPaginatedGroups([]);
                setPaginatedFilteredGroups([]);
            }

            setGroupsError(false);

            return;
        }

        dispatch(addAlert({
            description: t("console:manage.features.groups.notifications." +
                "fetchGroups.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
        }));
        setGroupsError(true);
        setGroupsList([]);
        setPaginatedGroups([]);
        setPaginatedFilteredGroups([]);
    }, [ originalGroupList ]);

    /**
     * Handles Group list fetch request errors.
     */
    useEffect(() => {
        if (!groupListFetchRequestError) {
            return;
        }

        dispatch(addAlert({
            description: groupListFetchRequestError?.response?.data?.description
                ?? groupListFetchRequestError?.response?.data?.detail
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.description"),
            level: AlertLevels.ERROR,
            message: groupListFetchRequestError?.response?.data?.message
            ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
        }));
        setGroupsError(true);
        setGroupsList([]);
        setPaginatedGroups([]);
        setPaginatedFilteredGroups([]);
    }, [ groupListFetchRequestError ]);

    /**
     * Handles Userstore list fetch request errors.
     */
    useEffect(() => {
        if (!userStoreListFetchRequestError) {
            return;
        }

        if (userStoreListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: userStoreListFetchRequestError?.response?.data?.description
                    ?? userStoreListFetchRequestError?.response?.data?.detail
                        ?? t("userstores:notifications.fetchUserstores.genericError." +
                        "description"),
                level: AlertLevels.ERROR,
                message: userStoreListFetchRequestError?.response?.data?.message
                    ?? t("userstores:notifications.fetchUserstores.genericError.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("userstores:notifications.fetchUserstores.genericError." +
                "description"),
            level: AlertLevels.ERROR,
            message: t("userstores:notifications.fetchUserstores.genericError.message")
        }));
    }, [ userStoreListFetchRequestError ]);

    /**
     * Handles readonly userstore list fetch request.
     */
    useEffect(() => {
        if (!userStoreList || readOnlyUserStoresList || isReadOnlyUserStoresListLoading) {
            return;
        }

        const filteredUserStores: UserStoreListItem[] = userStoreList.filter(
            (store: UserStoreListItem) => store.enabled);

        setEnabledUserStores(filteredUserStores);
        setReadOnlyUserStoresListLoading(true);

        UserStoreUtils.getReadOnlyUserStores(filteredUserStores)
            .then((response: string[]) => {
                setReadOnlyUserStoresList(response);
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            })
            .finally(() => {
                setReadOnlyUserStoresListLoading(false);
            });
    }, [ userStoreList ]);

    /**
     * Filter User Stores.
     */
    useEffect(() => {
        filterUserStores(userStoreOption);
    }, [ paginatedGroups ]);

    /**
     * Sets the list sorting strategy.
     *
     * @param event - The event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(find(GROUPS_SORTING_OPTIONS, (option: DropdownItemProps) => {
            return data.value === option.value;
        }));
    };

    const searchRoleListHandler = (searchQuery: string) => {
        const searchData: SearchGroupInterface = {
            filter: searchQuery,
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1
        };

        setSearchQuery(searchQuery);

        searchGroupList(searchData)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    const results: RolesInterface[] = response.data.Resources;
                    let updatedResults: GroupsInterface[] = [];

                    if (results) {
                        updatedResults = results.filter((role: RolesInterface) => {
                            return role.displayName;
                        });
                    }
                    setGroupsList(updatedResults);
                    setPaginatedGroups(updatedResults);
                    setPaginatedFilteredGroups(updatedResults);
                }
            });
    };

    /**
     * Util method to paginate retrieved email template type list.
     *
     * @param offsetValue - pagination offset value.
     * @param itemLimit - pagination item limit.
     * @param list - Role list.
     */
    const setGroupsPage = (offsetValue: number, itemLimit: number, list: GroupsInterface[]) => {
        setPaginatedGroups(list?.slice(offsetValue, itemLimit + offsetValue));
        setPaginatedFilteredGroups(list?.slice(offsetValue, itemLimit + offsetValue));
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = (data.activePage as number - 1) * listItemLimit;

        setGroupsPage(offsetValue, listItemLimit, groupList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setGroupsPage(0, data.value as number, groupList);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     *
     * @param role - Role which needs to be deleted
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteGroupById(role.id).then(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.groups.notifications.deleteGroup.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.groups.notifications.deleteGroup.success.message"
                )
            });

            mutateGroupListFetchRequest();
        }).catch(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.groups.notifications.deleteGroup.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.groups.notifications.deleteGroup.error.message"
                )
            });
        });
    };

    /**
     * Handles the `onFilter` callback action from the
     * roles search component.
     *
     * @param query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === null || query === "displayName sw ") {
            mutateGroupListFetchRequest();

            return;
        }

        searchRoleListHandler(query);
    };

    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            data-testid="group-mgt-groups-list-advanced-search"
            onFilter={ handleUserFilter  }
            filterAttributeOptions={ [
                {
                    key: 0,
                    text: "Name",
                    value: "displayName"
                }
            ] }
            filterAttributePlaceholder={
                t("console:manage.features.groups.advancedSearch.form.inputs.filterAttribute.placeholder")
            }
            filterConditionsPlaceholder={
                t("console:manage.features.groups.advancedSearch.form.inputs.filterCondition" +
                    ".placeholder")
            }
            filterValuePlaceholder={
                t("console:manage.features.groups.advancedSearch.form.inputs.filterValue" +
                    ".placeholder")
            }
            placeholder={ t("console:manage.features.groups.advancedSearch.placeholder") }
            defaultSearchAttribute="displayName"
            defaultSearchOperator="co"
            triggerClearQuery={ triggerClearQuery }
        />
    );

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        mutateGroupListFetchRequest();
    };

    /**
     * Filter user store for groups.
     */
    const filterUserStore = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
        setuserStoreOption(data.value.toString());
        filterUserStores(data.value.toString());
    };

    /**
     * Handles the user store wise filtering for groups.
     */
    const filterUserStores = (option: string): void => {
        if(option === GroupConstants.ALL_GROUPS){
            setPaginatedFilteredGroups(paginatedGroups);

            return;
        }
        setPaginatedFilteredGroups(groupList?.filter((group: GroupsInterface) => {
            return (group.displayName.includes(option.toUpperCase()));
        }));
    };

    /**
     * Add the default 'All user stores' option to dropdown list
     */
    const addDefaultValueToDropDownOptions = (): DropdownItemProps[] => {

        const userStoreOptions: DropdownItemProps[] = cloneDeep(enabledUserStores)?.map(
            (item: UserStoreListItem, index: number) => {
                return {
                    key: index,
                    text: item.name.toUpperCase(),
                    value: item.name.toUpperCase()
                };
            });

        return union([ {
            key: GroupConstants.ALL_GROUPS,
            text: GroupConstants.ALL_GROUPS,
            value: GroupConstants.ALL_GROUPS
        } ], userStoreOptions);
    };

    return (
        <PageLayout
            pageTitle="Groups"
            action={
                !isGroupListFetchRequestLoading
                && (
                    userStoreOption === CONSUMER_USERSTORE
                    || userStoreOption === GroupConstants.ALL_GROUPS
                )
                && originalGroupList.totalResults > 0
                && (
                    <Show
                        when={ featureConfig?.groups?.scopes?.create }
                    >
                        <PrimaryButton
                            data-testid="group-mgt-groups-list-add-button"
                            onClick={ () => {
                                eventPublisher.publish("manage-groups-click-create-new-group");
                                setShowWizard(true);
                            } }
                        >
                            <Icon name="add"/>
                            { t("roles:list.buttons.addButton", { type: "Group" }) }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("extensions:manage.groups.heading") }
            description={ (
                <>
                    { t("extensions:manage.groups.subHeading") }
                    <DocumentationLink
                        link={ getLink("manage.groups.learnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </>
            ) }
        >
            <ListLayout
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                sortStrategy={ listSortingStrategy }
                showPagination={ paginatedFilteredGroups?.length > 0  }
                showTopActionPanel={ isGroupListFetchRequestLoading
                    || !(!searchQuery
                        && !groupsError
                        && userStoreOptions.length < 3
                        && paginatedFilteredGroups?.length < 0) }
                totalPages={ Math.ceil(groupList?.length / listItemLimit) }
                totalListSize={ groupList?.length }
                isLoading={ isGroupListFetchRequestLoading }
                leftActionPanel={
                    // Show the user store dropdown when there is more than one user store
                    enabledUserStores?.length > 1 && (
                        <Dropdown
                            data-componentid="group-mgt-groups-list-userstore-dropdown"
                            selection
                            options={ addDefaultValueToDropDownOptions() }
                            onChange={ (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
                                filterUserStore(e, data);
                            } }
                            loading={ isUserStoreListFetchRequestLoading }
                            text={ userStoreOption }
                        />
                    )
                }
            >
                { groupsError
                    ? (
                        <EmptyPlaceholder
                            subtitle={ [ t("console:manage.features.groups.placeholders.groupsError.subtitles.0"),
                                t("console:manage.features.groups.placeholders.groupsError.subtitles.1") ] }
                            title={ t("console:manage.features.groups.placeholders.groupsError.title") }
                            image={ getEmptyPlaceholderIllustrations().genericError }
                            imageSize="tiny"
                        />
                    )
                    : (
                        <GroupList
                            advancedSearch={ advancedSearchFilter() }
                            data-testid="group-mgt-groups-list"
                            handleGroupDelete={ handleOnDelete }
                            onEmptyListPlaceholderActionClick={ () => {
                                eventPublisher.publish("manage-groups-click-create-new-group");
                                setShowWizard(true);
                            } }
                            onSearchQueryClear={ handleSearchQueryClear }
                            groupList={ paginatedFilteredGroups }
                            searchQuery={ searchQuery }
                            readOnlyUserStores={ readOnlyUserStoresList }
                            featureConfig={ featureConfig }
                            selectedUserStoreOption={ userStoreOption }
                        />
                    )
                }
            </ListLayout>
            {
                showWizard && (
                    <CreateGroupWizard
                        data-testid="group-mgt-create-group-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => mutateGroupListFetchRequest() }
                        requiredSteps={ [ "BasicDetails" ] }
                        submitStep={ "BasicDetails" }
                    />
                )
            }
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GroupsPage;
