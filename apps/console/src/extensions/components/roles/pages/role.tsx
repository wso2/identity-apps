/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getRolesList, getUserStoreList } from "@wso2is/core/api";
import { AlertInterface, AlertLevels, RoleListInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    HelpPanelLayout,
    HelpPanelTabInterface,
    ListLayout,
    PageLayout,
    PrimaryButton,
    Markdown
} from "@wso2is/react-components";
import find from "lodash-es/find";
import React, { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    AppUtils,
    ConfigReducerStateInterface,
    getHelpPanelActionIcons,
    HelpPanelUtils,
    PortalDocumentationStructureInterface,
    UIConstants,
    toggleHelpPanelVisibility
} from "../../../../features/core";
import { deleteRoleById, searchRoleList } from "../../../../features/roles/api";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "../../../../features/roles/constants";
import { SearchRoleInterface } from "../../../../features/roles/models";
import { CreateRoleWizard, RoleList } from "../components";
import { getHelpPanelIcons } from "../../../../features/applications/configs";
import helpDoc from "../data/role.md";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import { StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";

const ROLES_SORTING_OPTIONS: DropdownItemProps[] = [
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

const filterOptions: DropdownItemProps[] = [
    {
        key: "all",
        text: "Show All",
        value: "all"
    },
    {
        key: APPLICATION_DOMAIN,
        text: "Application Domain",
        value: APPLICATION_DOMAIN
    },
    {
        key: INTERNAL_DOMAIN,
        text: "Internal Domain",
        value: INTERNAL_DOMAIN
    }
];

/**
 * React component to list User Roles.
 *
 * @return {ReactElement}
 */
const RolesPage = (): ReactElement => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const [ showHelpPanel, setShowHelpPanel ] = useState<boolean>(false);
    const [ tabsActiveIndex, setTabsActiveIndex ] = useState<number>(0);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isListUpdated, setListUpdated ] = useState(false);
    // TODO: Check the usage and delete if not required.
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ userStore, setUserStore ] = useState(undefined);
    const [ filterBy, setFilterBy ] = useState<string>("all");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    // TODO: Check the usage and delete if not required.
    const [ isEmptyResults, setIsEmptyResults ] = useState<boolean>(false);
    const [ isRoleListFetchRequestLoading, setRoleListFetchRequestLoading ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ initialRolList, setInitialRoleList ] = useState<RoleListInterface>();
    const [ paginatedRoles, setPaginatedRoles ] = useState<RoleListInterface>();

    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(ROLES_SORTING_OPTIONS[ 0 ]);
    const roleHelpShownStatusKey = "isRoleHelpShown";

    useEffect(() => {
        if (searchQuery == "") {
            getRoles();
        }
        if (helpPanelShown()) {
            dispatch(toggleHelpPanelVisibility(true));
            setShowHelpPanel(!showHelpPanel);
            setHelpPanelShown();
        }
    },[ initialRolList?.Resources?.length != 0 ]);

    useEffect(() => {
        getRoles();
        setListUpdated(false);
    }, [ isListUpdated ]);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        getRoles();
    }, [ filterBy ]);

    useEffect(() => {
        getRoles();
    }, [ userStore ]);

    const getRoles = () => {
        setRoleListFetchRequestLoading(true);

        getRolesList(userStore)
            .then((response) => {
                if (response.status === 200) {
                    const roleResources = response.data.Resources;

                    if (roleResources && roleResources instanceof Array) {
                        response.data.Resources = roleResources.filter((role: RolesInterface) => {
                            if (role.displayName?.includes(APPLICATION_DOMAIN)) {
                                return false;
                            }

                            if (role.displayName?.includes(INTERNAL_DOMAIN)) {
                                return false;
                            }

                            if (role.displayName === "system") {
                                return false;
                            }

                            if (role.displayName === "everyone") {
                                return false;
                            }

                            return role;
                        });
                        setInitialRoleList(response.data);
                        setRolesPage(0, listItemLimit, response.data);
                    }
                }
            })
            .finally(() => {
                setRoleListFetchRequestLoading(false);
            });
    };

    /**
     * Get whether to show the help panel
     * Help panel only shows for the first time
     */
    const helpPanelShown = (): boolean => {

        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        return !isEmpty(userPreferences) &&
            !userPreferences.identityAppsSettings?.devPortal?.[roleHelpShownStatusKey];
    };

    /**
     * Set status of first time help panel is shown
     */
    const setHelpPanelShown = (): void => {
        const userPreferences: StorageIdentityAppsSettingsInterface = AppUtils.getUserPreferences();

        if (isEmpty(userPreferences) || !userPreferences?.identityAppsSettings?.devPortal) {
            return;
        }

        const newPref: StorageIdentityAppsSettingsInterface = cloneDeep(userPreferences);
        newPref.identityAppsSettings.devPortal[roleHelpShownStatusKey] = true;
        AppUtils.setUserPreferences(newPref);
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
        getUserStoreList()
            .then((response) => {
                if (storeOptions === []) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store, index) => {
                        storeOption = {
                            key: index,
                            text: store.name,
                            value: store.name
                        };
                        storeOptions.push(storeOption);
                    }
                );
                setUserStoresList(storeOptions);
            });

        setUserStoresList(storeOptions);
    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(find(ROLES_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    const searchRoleListHandler = (searchQuery: string) => {
        const searchData: SearchRoleInterface = {
            filter: searchQuery,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:SearchRequest"],
            startIndex: 1
        };

        setSearchQuery(searchQuery);

        searchRoleList(searchData)
            .then((response) => {

                if (response.status === 200) {
                    const results = response?.data?.Resources;

                    let updatedResults = [];
                    if (results) {
                        updatedResults = results;
                    }

                    const updatedData = {
                        ...results,
                        ...results?.data?.Resources,
                        Resources: updatedResults
                    };

                    setInitialRoleList(updatedData);
                    setPaginatedRoles(updatedData);
                }
        });
    };

    /**
     * Util method to paginate retrieved role list.
     *
     * @param offsetValue pagination offset value
     * @param itemLimit pagination item limit
     */
    const setRolesPage = (offsetValue: number, itemLimit: number, roleList: RoleListInterface) => {
        const updatedData = {
            ...roleList,
            ...roleList.Resources,
            Resources: roleList?.Resources?.slice(offsetValue, itemLimit + offsetValue)
        };
        setPaginatedRoles(updatedData);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue = (data.activePage as number - 1) * listItemLimit;
        setListOffset(offsetValue);
        setRolesPage(offsetValue, listItemLimit, initialRolList);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
        setRolesPage(listOffset, data.value as number, initialRolList);
    };

    const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setFilterBy(data.value as string);
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
     * @param role - Role ID which needs to be deleted
     */
    const handleOnDelete = (role: RolesInterface): void => {
        deleteRoleById(role.id).then(() => {
            handleAlerts({
                description: t(
                    "console:manage.features.roles.notifications.deleteRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.roles.notifications.deleteRole.success.message"
                )
            });
            setListUpdated(true);
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
            getRoles();
            return;
        }

        searchRoleListHandler(query);
    };

    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            data-testid="role-mgt-roles-list-advanced-search"
            onFilter={ handleUserFilter  }
            filterAttributeOptions={ [
                {
                    key: 0,
                    text: "Name",
                    value: "displayName"
                }
            ] }
            filterAttributePlaceholder={
                t("console:manage.features.roles.advancedSearch.form.inputs.filterAttribute." +
                    "placeholder")
            }
            filterConditionsPlaceholder={
                t("console:manage.features.roles.advancedSearch.form.inputs.filterCondition" +
                    ".placeholder")
            }
            filterValuePlaceholder={
                t("console:manage.features.roles.advancedSearch.form.inputs.filterValue" +
                    ".placeholder")
            }
            placeholder={ t("console:manage.features.roles.advancedSearch.placeholder") }
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
        setSearchQuery(null);
        getRoles();
    };

    const helpPanelTabs: HelpPanelTabInterface[] = [
        {
            content: (
                    <Markdown
                        source={ helpDoc }
                        data-testid={ `role-help-panel-configs-tab-markdown-renderer` }
                    />
                ),
            heading: "Help",
            hidden: false,
            icon: {
                icon: <Icon disabled size="large" name='question circle outline' className="ml-0"/>
            }
        }
    ];

    return (
        <HelpPanelLayout
            activeIndex={ tabsActiveIndex }
            sidebarDirection="right"
            sidebarMiniEnabled={ true }
            tabs={ helpPanelTabs }
            onHelpPanelPinToggle={ () => HelpPanelUtils.togglePanelPin() }
            isPinned={ HelpPanelUtils.isPanelPinned() }
            icons={ {
                close: getHelpPanelActionIcons().close,
                pin: getHelpPanelActionIcons().pin,
                unpin: getHelpPanelActionIcons().unpin
            } }
            sidebarToggleTooltip={ t("console:develop.features.helpPanel.actions.open") }
            pinButtonTooltip={ t("console:develop.features.helpPanel.actions.pin") }
            unpinButtonTooltip={ t("console:develop.features.helpPanel.actions.unPin") }
            onHelpPanelVisibilityChange={ (isVisible: boolean) => {
                dispatch(toggleHelpPanelVisibility(isVisible))
                setShowHelpPanel(!showHelpPanel)
            } }
            visible={ showHelpPanel }
        >
        <PageLayout
            action={
                (isRoleListFetchRequestLoading || !(!searchQuery && paginatedRoles?.Resources?.length <= 0))
                && (
                    <PrimaryButton
                        data-testid="role-mgt-roles-list-add-button"
                        onClick={ () => setShowWizard(true) }
                    >
                        <Icon
                            data-testid="role-mgt-roles-list-add-button-icon"
                            name="add"
                        />
                        { t("console:manage.features.roles.list.buttons.addButton", { type: "Role" }) }
                    </PrimaryButton>
                )
            }
            title={ t("console:manage.pages.roles.title") }
            description={
                `Create roles and assign permissions to collectively manage access to the ${
                    config.ui.productName } console.`
            }
        >
            {
                !isEmptyResults &&
                <ListLayout
                    advancedSearch={ advancedSearchFilter() }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ handleListSortingStrategyOnChange }
                    sortStrategy={ listSortingStrategy }
                    showPagination={ paginatedRoles?.Resources?.length > 0 }
                    showTopActionPanel={
                        isRoleListFetchRequestLoading || !(!searchQuery && paginatedRoles?.Resources?.length <= 0)
                    }
                    totalPages={ Math.ceil(initialRolList?.Resources?.length / listItemLimit) }
                    totalListSize={ initialRolList?.Resources?.length }
                >
                    <RoleList
                        advancedSearch={ advancedSearchFilter() }
                        data-testid="role-mgt-roles-list"
                        handleRoleDelete={ handleOnDelete }
                        showHeader={ true }
                        showRoleType={ false }
                        isGroup={ false }
                        isLoading={ isRoleListFetchRequestLoading }
                        onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        roleList={ paginatedRoles }
                        searchQuery={ searchQuery }
                    />
                </ListLayout>
            }
            {
                showWizard && (
                    <CreateRoleWizard
                        data-testid="role-mgt-create-role-wizard"
                        isAddGroup={ false }
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
                        submitStep={ "UserList" }
                    />
                )
            }
        </PageLayout>
        </HelpPanelLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RolesPage;
