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
import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertInterface, AlertLevels, RolesInterface, UserstoreListResponseInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import find from "lodash-es/find";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { commonConfig } from "../../admin-extensions-v1/configs";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    FeatureConfigInterface,
    SharedUserStoreUtils,
    UIConstants,
    UserStoreProperty,
    getAUserStore,
    getEmptyPlaceholderIllustrations
} from "../../admin-core-v1";
import { RootOnlyComponent } from "../../admin-organizations-v1/components";
import { useGetCurrentOrganizationType } from "../../admin-organizations-v1/hooks/use-get-organization-type";
import { getUserStoreList } from "../../admin-userstores-v1/api";
import { CONSUMER_USERSTORE, PRIMARY_USERSTORE } from "../../admin-userstores-v1/constants";
import { UserStorePostData } from "../../admin-userstores-v1/models/user-stores";
import { deleteGroupById, useGroupList } from "../api";
import { GroupList } from "../components";
import { CreateGroupWizardUpdated } from "../components/wizard/create-group-wizard-updated";
import { GroupConstants } from "../constants";
import { GroupsInterface, WizardStepsFormTypes } from "../models";

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
 * @returns Groups page component.
 */
const GroupsPage: FunctionComponent<any> = (): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ userStoreOptions, setUserStoresList ] = useState<DropdownItemProps[]>([]);
    const [ userStore, setUserStore ] = useState(
        commonConfig?.primaryUserstoreOnly ? PRIMARY_USERSTORE : CONSUMER_USERSTORE);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ readOnlyUserStoresList, setReadOnlyUserStoresList ] = useState<string[]>(undefined);
    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>([]);
    const [ paginatedGroups, setPaginatedGroups ] = useState<GroupsInterface[]>([]);
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(GROUPS_SORTING_OPTIONS[ 0 ]);

    const { isSuperOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const {
        data,
        error: groupsError,
        isLoading: isGroupsListRequestLoading,
        mutate: mutateGroupsFetchRequest
    } = useGroupList(userStore, "members,roles", searchQuery, true);

    /**
     * Indicates whether the currently selected user store is read-only or not.
     */
    const isReadOnlyUserStore: boolean = useMemo(() => {
        if (readOnlyUserStoresList?.includes(userStore)) {
            return true;
        }

        return false;
    }, [ userStore ]);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        const updatedResources: GroupsInterface[] = data?.Resources?.filter((role: GroupsInterface) => {
            return !role.displayName.includes("Application/")
                    && !role.displayName.includes("Internal/");
        });

        setGroupsList(updatedResources);
        setGroupsPage(0, listItemLimit, updatedResources);
    },[ data ] );

    useEffect(() => {
        if (groupsError) {
            dispatch(addAlert({
                description: groupsError?.response?.data?.description ?? groupsError?.response?.data?.detail
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.description"),
                level: AlertLevels.ERROR,
                message: groupsError?.response?.data?.message
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
            }));
        }
    },[ groupsError ]);

    useEffect(() => {
        if (!isSuperOrganization()) {
            return;
        }

        SharedUserStoreUtils.getReadOnlyUserStores().then((response: string[]) => {
            setReadOnlyUserStoresList(response);
        });
    }, [ userStore ]);

    /**
     * The following function fetches the user store list and sets it to the state.
     */
    const getUserStores = () => {
        const storeOptions: DropdownItemProps[] = [
            {
                key: -1,
                text: "Primary",
                value: PRIMARY_USERSTORE
            }
        ];

        let storeOption: DropdownItemProps = {
            key: null,
            text: "",
            value: ""
        };

        if (isSuperOrganization() || isFirstLevelOrganization()) {
            getUserStoreList()
                .then((response: AxiosResponse<UserstoreListResponseInterface[]>) => {
                    if (storeOptions?.length === 0) {
                        storeOptions.push(storeOption);
                    }

                    response.data.map((store: UserstoreListResponseInterface, index: number) => {
                        getAUserStore(store.id).then((response: UserStorePostData) => {
                            const isDisabled: boolean = response.properties.find(
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
     * @param event - The event.
     * @param data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        setListSortingStrategy(find(GROUPS_SORTING_OPTIONS, (option: DropdownItemProps) => {
            return data.value === option.value;
        }));
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
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        if (data.value === GroupConstants.ALL_USER_STORES_OPTION_VALUE) {
            setUserStore(null);
        } else {
            setUserStore(data.value as string);
        }
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = (data.activePage as number - 1) * listItemLimit;

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

            mutateGroupsFetchRequest();
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

    return (
        <PageLayout
            action={
                (!isGroupsListRequestLoading && paginatedGroups?.length > 0)
                && (
                    <Show when={ AccessControlConstants.GROUP_WRITE }>
                        <PrimaryButton
                            data-testid="group-mgt-groups-list-add-button"
                            onClick={ () => setShowWizard(true) }
                        >
                            <Icon name="add"/>
                            { t("roles:list.buttons.addButton", { type: "Group" }) }
                        </PrimaryButton>
                    </Show>
                )
            }
            title={ t("pages:groups.title") }
            pageTitle={ t("pages:groups.title") }
            description={ t("pages:groups.subTitle") }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        data-testid="group-mgt-groups-list-advanced-search"
                        onFilter={ (query: string) => setSearchQuery(query)  }
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
                        disableSearchAndFilterOptions={ data?.totalResults <= 0 && !searchQuery }
                    />
                ) }
                currentListSize={ listItemLimit }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                sortStrategy={ listSortingStrategy }
                rightActionPanel={ (
                    <RootOnlyComponent>
                        <Dropdown
                            data-testid="group-mgt-groups-list-stores-dropdown"
                            selection
                            options={ userStoreOptions && userStoreOptions }
                            placeholder={ t("console:manage.features.groups.list.storeOptions") }
                            onChange={ handleDomainChange }
                            defaultValue={ PRIMARY_USERSTORE }
                        />
                    </RootOnlyComponent>
                ) }
                showPagination={ paginatedGroups?.length > 0  }
                totalPages={ Math.ceil(groupList?.length / listItemLimit) }
                totalListSize={ groupList?.length }
                isLoading={ isGroupsListRequestLoading }
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
                                onFilter={ (query: string) => setSearchQuery(query) }
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
                                disableSearchAndFilterOptions={ data?.totalResults <= 0 && !searchQuery }
                            />
                        ) }
                        data-testid="group-mgt-groups-list"
                        handleGroupDelete={ handleOnDelete }
                        onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                        onSearchQueryClear={ () => {
                            setTriggerClearQuery(!triggerClearQuery);
                            setSearchQuery("");
                        } }
                        groupList={ paginatedGroups }
                        searchQuery={ searchQuery }
                        readOnlyUserStores={ readOnlyUserStoresList }
                        featureConfig={ featureConfig }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                    />)
                }
            </ListLayout>
            {
                showWizard && (
                    <CreateGroupWizardUpdated
                        data-testid="group-mgt-create-group-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        onCreate={ () => mutateGroupsFetchRequest() }
                        requiredSteps={ [
                            WizardStepsFormTypes.BASIC_DETAILS,
                            WizardStepsFormTypes.ROLE_LIST
                        ] }
                        showStepper={ isSuperOrganization() }
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
