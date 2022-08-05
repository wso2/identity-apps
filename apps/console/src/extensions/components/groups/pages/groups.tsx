/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    EmptyPlaceholder,
    GridLayout,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import find from "lodash-es/find";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    UIConstants,
    getEmptyPlaceholderIllustrations
} from "../../../../features/core";
import { EventPublisher } from "../../../../features/core/utils";
import {
    GroupsInterface,
    SearchGroupInterface,
    deleteGroupById,
    getGroupList,
    searchGroupList
} from "../../../../features/groups";
import { GroupConstants } from "../../../../features/groups/constants";
import { CONSUMER_USERSTORE, getUserStores } from "../../../../features/userstores";
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
 * @return {ReactElement}
 */
const GroupsPage: FunctionComponent<any> = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userStoreOptions ] = useState([]);
    const [ userStore ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ isGroupsListRequestLoading, setGroupsListRequestLoading ] = useState<boolean>(false);
    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isReadOnlyUserStoresListLoading, setReadOnlyUserStoresListLoading ] = useState<boolean>(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ groupsError, setGroupsError ] = useState<boolean>(false);
    const [ userStoreListLoading, setUserStoreListLoading ] = useState<boolean>(false);
    const [ , setUserStoreError ] = useState<boolean>(false);
    const [ userStoreList, setUserStoreList ] = useState<DropdownItemProps[]>(undefined);
    const [ userStoreCount, setUserStoreCount ] = useState<number>(0);

    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>([]);
    const [ paginatedGroups, setPaginatedGroups ] = useState<GroupsInterface[]>([]);
    const [ paginatedFilteredGroups, setPaginatedFilteredGroups ] = useState<GroupsInterface[]>([]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(GROUPS_SORTING_OPTIONS[ 0 ]);
    const excludeMembers: string = "members";

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const [ userStoreOption, setuserStoreOption ] = useState<string>();

    // Load user stores from API and set the dropdown to all user stores option
    useEffect(() => {
        getUserStoreList();
        setuserStoreOption(GroupConstants.ALL_GROUPS);
    }, []);

    useEffect(() => {
        if (isListUpdated) {
            getGroups(excludeMembers);
            setListUpdated(false);
        }
    }, [ isListUpdated ]);

    useEffect(() => {
        getGroups(excludeMembers);
    }, [ userStore ]);

    useEffect(() => {
        SharedUserStoreUtils.getReadOnlyUserStores().then((response) => {
            setReadOnlyUserStoresList(response);
        }).finally(() => {
            setReadOnlyUserStoresListLoading(false);
        });
    }, [ userStore ]);

    useEffect(() => {
        filterUserStores(userStoreOption);
    }, [ paginatedGroups ]);

    const getGroups = (excludedAttributes?: string) => {
        setGroupsListRequestLoading(true);

        getGroupList(userStore, excludedAttributes)
            .then((response) => {
                if (response.status === 200) {
                    const groupResources = response.data.Resources;

                    if (groupResources && groupResources instanceof Array && groupResources.length !== 0) {
                        setGroupsList(groupResources);
                        setGroupsPage(0, listItemLimit, groupResources);
                    } else {
                        setPaginatedGroups([]);
                        setPaginatedFilteredGroups([]);
                    }
                    setGroupsError(false);
                } else {
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
                }
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description ?? error?.response?.data?.detail
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
                }));
                setGroupsError(true);
                setGroupsList([]);
                setPaginatedGroups([]);
                setPaginatedFilteredGroups([]);
            })
            .finally(() => {
                setGroupsListRequestLoading(false);
                setLoading(false);
            });
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(find(GROUPS_SORTING_OPTIONS, (option) => {
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

        searchGroupList(searchData).then(response => {
            if (response.status === 200) {
                const results = response.data.Resources;
                let updatedResults = [];

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
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     * @param list - Role list.
     */
    const setGroupsPage = (offsetValue: number, itemLimit: number, list: GroupsInterface[]) => {
        setPaginatedGroups(list?.slice(offsetValue, itemLimit + offsetValue));
        setPaginatedFilteredGroups(list?.slice(offsetValue, itemLimit + offsetValue));
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;

        setGroupsPage(offsetValue, listItemLimit, groupList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setGroupsPage(0, data.value as number, groupList);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
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
            setListUpdated(true);
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
     * @param {string} query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        if (query === null || query === "displayName sw ") {
            getGroups(excludeMembers);

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
        getGroups(excludeMembers);
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
        setPaginatedFilteredGroups(groupList.filter((group: GroupsInterface) => {
            return (group.displayName.includes(option.toUpperCase()));
        }));
    };
    
    /**
     * Get the user stores list
     */
    const getUserStoreList = (): void => {
        setUserStoreListLoading(true);

        getUserStores(null)
            .then((response) => {
                const userStoreArray: DropdownItemProps[] = response?.map((item, index) => {
                    return {
                        key: index,
                        text: (item.name === CONSUMER_USERSTORE) ? "DEFAULT" : item.name,
                        value: item.name
                    };
                });

                setUserStoreError(false);
                setUserStoreList(userStoreArray);
                setUserStoreCount(userStoreArray?.length);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.users.notifications.fetchUserStores.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.users.notifications.fetchUserStores.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.users.notifications.fetchUserStores.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUserStores.genericError.message")
                }));

                return;
            })
            .finally(() => {
                setUserStoreListLoading(false);
            });
    };

    /**
     * Add the default 'All user stores' option to dropdown list
     */
    const addDefaultValueToDropDownOptions = (): DropdownItemProps[] => {
        return union([ {
            key: "all",
            text: "All user stores",
            value: "all"
        } ], userStoreList);
    };

    return (
        <PageLayout
            action={
                !isLoading
                && (
                    (isGroupsListRequestLoading || !(!searchQuery && paginatedFilteredGroups?.length <= 0))
                    && hasRequiredScopes(featureConfig?.groups, featureConfig?.groups?.scopes?.create, allowedScopes)
                )
                && (
                    userStoreOption === CONSUMER_USERSTORE 
                    || userStoreOption === GroupConstants.ALL_GROUPS
                ) && (
                    <PrimaryButton
                        loading={ isGroupsListRequestLoading }
                        disabled={ isGroupsListRequestLoading }
                        data-testid="group-mgt-groups-list-add-button"
                        onClick={ () => {
                            eventPublisher.publish("manage-groups-click-create-new-group");
                            setShowWizard(true);
                        } }
                    >
                        <Icon name="add"/>
                        { t("console:manage.features.roles.list.buttons.addButton", { type: "Group" }) }
                    </PrimaryButton>
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
            <GridLayout
                isLoading={ isLoading }
                showTopActionPanel={ false }
            >
                <ListLayout
                    advancedSearch={ advancedSearchFilter() }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleListSortingStrategyOnChange }
                    sortStrategy={ listSortingStrategy }
                    showPagination={ paginatedFilteredGroups.length > 0  }
                    showTopActionPanel={ isGroupsListRequestLoading
                    || !(!searchQuery
                        && !groupsError
                        && userStoreOptions.length < 3
                        && paginatedFilteredGroups?.length < 0) }
                    totalPages={ Math.ceil(groupList?.length / listItemLimit) }
                    totalListSize={ groupList?.length }
                    leftActionPanel={
                        // Show the user store dropdown when there is more than one user store
                        userStoreCount > 1 &&
                        (
                            <Dropdown
                                data-componentid="group-mgt-groups-list-userstore-dropdown"
                                selection
                                options={ addDefaultValueToDropDownOptions() }
                                onChange={ (e, data) => {
                                    filterUserStore(e, data);
                                } }
                                loading={ userStoreListLoading }
                                text={ (userStoreOption === CONSUMER_USERSTORE) ? "DEFAULT" : userStoreOption }
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
                        ) :
                        (
                            <GroupList
                                advancedSearch={ advancedSearchFilter() }
                                data-testid="group-mgt-groups-list"
                                handleGroupDelete={ handleOnDelete }
                                isLoading={ isGroupsListRequestLoading || isReadOnlyUserStoresListLoading }
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
            </GridLayout>
            {
                showWizard && (
                    <CreateGroupWizard
                        data-testid="group-mgt-create-group-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
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
