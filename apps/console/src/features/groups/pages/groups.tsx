/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { getUserStoreList } from "@wso2is/core/api";
import { AlertInterface, AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import find from "lodash-es/find";
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
    UserStoreProperty,
    getAUserStore,
    getEmptyPlaceholderIllustrations,
    store
} from "../../core";
import { OrganizationUtils } from "../../organizations/utils";
import { UserStorePostData } from "../../userstores";
import { deleteGroupById, getGroupList, searchGroupList } from "../api";
import { GroupList } from "../components";
import { CreateGroupWizard } from "../components/wizard";
import { GroupsInterface, SearchGroupInterface } from "../models";

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

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    // TODO: Check the usage and delete id not required.
    const [ isEmptyResults, setIsEmptyResults ] = useState<boolean>(false);
    const [ isGroupsListRequestLoading, setGroupsListRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ groupsError, setGroupsError ] = useState<boolean>(false);

    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>([]);
    const [ paginatedGroups, setPaginatedGroups ] = useState<GroupsInterface[]>([]);

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(GROUPS_SORTING_OPTIONS[ 0 ]);

    useEffect(() => {
        if(searchQuery == "") {
            getGroups();
        }
    },[ groupList.length != 0 ]);

    useEffect(() => {
        getGroups();
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        getGroups();
    }, [ userStore ]);

    useEffect(() => {
        if (!OrganizationUtils.isCurrentOrganizationRoot()) {
            return;
        }

        SharedUserStoreUtils.getReadOnlyUserStores().then((response) => {
            setReadOnlyUserStoresList(response);
        });
    }, [ userStore ]);

    const getGroups = () => {
        setGroupsListRequestLoading(true);

        getGroupList(userStore)
            .then((response) => {
                if (response.status === 200) {
                    const groupResources = response.data.Resources;

                    if (groupResources && groupResources instanceof Array && groupResources.length !== 0) {
                        const updatedResources = groupResources.filter((role: GroupsInterface) => {
                            return !role.displayName.includes("Application/")
                                && !role.displayName.includes("Internal/");
                        });

                        response.data.Resources = updatedResources;
                        setGroupsList(updatedResources);
                        setGroupsPage(0, listItemLimit, updatedResources);
                    } else {
                        setPaginatedGroups([]);
                        setIsEmptyResults(true);
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
                }
            }).catch((error) => {
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
            })
            .finally(() => {
                setGroupsListRequestLoading(false);
            });
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [
            {
                key: -2,
                text: "All user stores",
                value: null
            },
            {
                key: -1,
                text: "Primary",
                value: "primary"
            }
        ];

        let storeOption = {
            key: null,
            text: "",
            value: ""
        };

        setUserStore(storeOptions[ 0 ].value);

        if (OrganizationUtils.isCurrentOrganizationRoot()) {
            getUserStoreList(store.getState().config.endpoints.userStores)
                .then((response) => {
                    if (storeOptions === []) {
                        storeOptions.push(storeOption);
                    }

                    response.data.map((store, index) => {
                        getAUserStore(store.id).then((response: UserStorePostData) => {
                            const isDisabled = response.properties.find(
                                (property: UserStoreProperty) => property.name === "Disabled")?.value === "true";

                            if (!isDisabled) {
                                storeOption = {
                                    key: index,
                                    text: store.name,
                                    value: store.name
                                };
                                storeOptions.push(storeOption);
                            }
                        });
                    }
                    );

                    setUserStoresList(storeOptions);
                });
        }

        setUserStoresList(storeOptions);
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
        let searchData: SearchGroupInterface = {
            filter: searchQuery,
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
            ],
            startIndex: 1
        };

        if (userStore) {
            searchData = { ...searchData, domain: userStore };
        }

        setSearchQuery(searchQuery);

        searchGroupList(searchData).then(response => {
            if (response.status === 200) {
                const results = response.data.Resources;
                let updatedResults = [];

                if (results) {
                    updatedResults = results.filter((role: RolesInterface) => {
                        return !role.displayName.includes("Application/") && !role.displayName.includes("Internal/");
                    });
                }
                setGroupsList(updatedResults);
                setPaginatedGroups(updatedResults);
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
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setUserStore(data.value as string);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;

        setListOffset(offsetValue);
        setGroupsPage(offsetValue, listItemLimit, groupList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setGroupsPage(listOffset, data.value as number, groupList);
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
            getGroups();

            return;
        }

        searchRoleListHandler(query);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        getGroups();
    };

    return (
        <PageLayout
            action={
                (isGroupsListRequestLoading || !(!searchQuery && paginatedGroups?.length <= 0))
                && (
                    <Show when={ AccessControlConstants.GROUP_WRITE }>
                        <PrimaryButton
                            data-testid="group-mgt-groups-list-add-button"
                            onClick={ () => setShowWizard(true) }
                        >
                            <Icon name="add"/>
                            { t("console:manage.features.roles.list.buttons.addButton", { type: "Group" }) }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("console:manage.pages.groups.title") }
            description={ t("console:manage.pages.groups.subTitle") }
        >
            <ListLayout
                advancedSearch={ (
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
                        defaultSearchOperator="sw"
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                sortStrategy={ listSortingStrategy }
                rightActionPanel={
                    (<Dropdown
                        data-testid="group-mgt-groups-list-stores-dropdown"
                        selection
                        options={ userStoreOptions && userStoreOptions }
                        placeholder={ t("console:manage.features.groups.list.storeOptions") }
                        value={ userStore && userStore }
                        onChange={ handleDomainChange }
                    />)
                }
                showPagination={ paginatedGroups.length > 0  }
                showTopActionPanel={ isGroupsListRequestLoading
                    || !(!searchQuery
                        && !groupsError
                        && userStoreOptions.length < 3
                        && paginatedGroups?.length <= 0) }
                totalPages={ Math.ceil(groupList?.length / listItemLimit) }
                totalListSize={ groupList?.length }
            >
                { groupsError
                    ? (<EmptyPlaceholder
                        subtitle={ [ t("console:manage.features.groups.placeholders.groupsError.subtitles.0"),
                            t("console:manage.features.groups.placeholders.groupsError.subtitles.1") ] }
                        title={ t("console:manage.features.groups.placeholders.groupsError.title") }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                    />) :
                    (<GroupList
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                data-testid="group-mgt-groups-list-advanced-search"
                                onFilter={ handleUserFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: "Name",
                                        value: "displayName"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:manage.features.groups.advancedSearch.form.inputs.filterAttribute" +
                                        ".placeholder")
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
                                defaultSearchOperator="sw"
                                triggerClearQuery={ triggerClearQuery }
                            />
                        ) }
                        data-testid="group-mgt-groups-list"
                        handleGroupDelete={ handleOnDelete }
                        isLoading={ isGroupsListRequestLoading }
                        onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        groupList={ paginatedGroups }
                        searchQuery={ searchQuery }
                        readOnlyUserStores={ readOnlyUserStoresList }
                        featureConfig={ featureConfig }
                    />)
                }
            </ListLayout>
            {
                showWizard && (
                    <CreateGroupWizard
                        data-testid="group-mgt-create-group-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
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
