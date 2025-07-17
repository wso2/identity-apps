/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import {
    AdvancedSearchWithBasicFilters
} from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters"; // No specific rule found
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui"; // No specific rule found
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants"; // No specific rule found
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { groupConfig, userstoresConfig } from "@wso2is/admin.extensions.v1/configs";
import {
    RemoteUserStoreManagerType
} from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
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
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { deleteGroupById, useGroupList } from "../api/groups";
import { GroupList } from "../components/group-list";
import { CreateGroupWizard } from "../components/wizard/create-group-wizard";
import { WizardStepsFormTypes } from "../models/groups";

/**
 * React component to list User Groups.
 *
 * @returns Groups page component.
 */
const GroupsPage: FunctionComponent<any> = (): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const { readOnlyUserStoreNamesList, isUserStoreReadOnly, mutateUserStoreList, userStoresList } = useUserStores();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const systemReservedUserStores: string[] = useSelector(
        (state: AppState) => state?.config?.ui?.systemReservedUserStores
    );

    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(1);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ userStore, setUserStore ] = useState(userstoresConfig.primaryUserstoreName);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);

    const {
        data,
        error: groupsError,
        isLoading: isGroupsListRequestLoading,
        mutate: mutateGroupsFetchRequest
    } = useGroupList(
        listItemLimit,
        listOffset,
        searchQuery,
        userStore,
        "members,roles",
        true
    );

    const isUserstoreDeleteDisabled: boolean = !groupConfig?.allowGroupDeleteForRemoteUserstores
        && userStore !== userstoresConfig.primaryUserstoreName;
    const isUserstoreAddDisabled: boolean = !groupConfig?.allowGroupAddForRemoteUserstores
        && userStore !== userstoresConfig.primaryUserstoreName;

    /**
     * Indicates whether the currently selected user store is read-only or not.
     */
    const isReadOnlyUserStore: boolean = useMemo(() => {
        return isUserStoreReadOnly(userStore);
    }, [ userStore, readOnlyUserStoreNamesList ]);

    const userStoreOptions: DropdownItemProps[] = useMemo(() => {
        const storeOptions: DropdownItemProps[] = [
            {
                key: -1,
                text: userstoresConfig.primaryUserstoreName,
                value: userstoresConfig.primaryUserstoreName
            }
        ];

        if (userStoresList?.length > 0) {
            userStoresList.forEach((store: UserStoreListItem, index: number) => {
                if (store.enabled && store.name !== userstoresConfig.primaryUserstoreName &&
                    !systemReservedUserStores?.includes(store.name)
                ) {
                    const storeOption: DropdownItemProps = {
                        disabled: store.typeName === RemoteUserStoreManagerType.RemoteUserStoreManager,
                        key: index,
                        text: store.name,
                        value: store.name
                    };

                    storeOptions.push(storeOption);
                }
            });
        }

        return storeOptions;
    }, [ userStoresList ]);

    useEffect(() => {
        mutateUserStoreList();
    }, []);

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

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setUserStore(data?.value as string);
        setListOffset(1);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        const offsetValue: number = (data.activePage as number - 1) * listItemLimit + 1;

        setListOffset(offsetValue);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the `onFilter` callback action from the
     * groups search component.
     *
     * @param query - Search query.
     */
    const handleGroupFilter = (query: string): void => {
        setSearchQuery(query);
        setListOffset(1);
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
                (!isGroupsListRequestLoading && data?.totalResults > 0)
                && !isUserstoreAddDisabled
                && !isReadOnlyUserStore
                && (
                    <Show
                        when={ featureConfig?.groups?.scopes?.create }
                    >
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
            description={ (
                <>
                    { t("pages:groups.subTitle") }
                    <DocumentationLink
                        link={ getLink("manage.groups.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        data-testid="group-mgt-groups-list-advanced-search"
                        onFilter={ handleGroupFilter }
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
                        disableSearchAndFilterOptions={ data?.totalResults <= 0 && !searchQuery }
                    />
                ) }
                currentListSize={ data?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                rightActionPanel={ (
                    <Dropdown
                        data-testid="group-mgt-groups-list-stores-dropdown"
                        selection
                        options={ userStoreOptions }
                        placeholder={ t("console:manage.features.groups.list.storeOptions") }
                        onChange={ handleDomainChange }
                        defaultValue={ userstoresConfig.primaryUserstoreName }
                    />
                ) }
                showPagination={ true }
                totalPages={ Math.ceil(data?.totalResults / listItemLimit) }
                totalListSize={ data?.totalResults }
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
                        data-testid="group-mgt-groups-list"
                        handleGroupDelete={ handleOnDelete }
                        onEmptyListPlaceholderActionClick={ () => setShowWizard(true) }
                        onSearchQueryClear={ () => {
                            setTriggerClearQuery(!triggerClearQuery);
                            handleGroupFilter(null);
                        } }
                        groupList={ data?.Resources }
                        searchQuery={ searchQuery }
                        featureConfig={ featureConfig }
                        isReadOnlyUserStore={ isReadOnlyUserStore }
                        isUserstoreAddDisabled={ isUserstoreAddDisabled }
                        isUserstoreDeleteDisabled={ isUserstoreDeleteDisabled }
                    />)
                }
            </ListLayout>
            {
                showWizard && (
                    <CreateGroupWizard
                        data-componentid="group-mgt-create-group-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        onCreate={ () => mutateGroupsFetchRequest() }
                        requiredSteps={ [
                            WizardStepsFormTypes.BASIC_DETAILS,
                            WizardStepsFormTypes.ROLE_LIST
                        ] }
                        userSelectedUserStore={ userStore }
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
