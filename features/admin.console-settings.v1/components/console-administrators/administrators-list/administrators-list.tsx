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
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    UserBasicInterface,
    UserRoleInterface,
    getEmptyPlaceholderIllustrations,
    history
} from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { UserManagementConstants } from "@wso2is/admin.users.v1/constants";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import { UserStoreDropdownItem } from "@wso2is/admin.userstores.v1/models";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, ListLayout, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import AdministratorsTable from "./administrators-table";
import useAdministrators from "../../../hooks/use-administrators";
import useBulkAssignAdministratorRoles from "../../../hooks/use-bulk-assign-user-roles";
import AddExistingUserWizard from "../add-existing-user-wizard/add-existing-user-wizard";
import InviteNewAdministratorWizard from "../invite-new-administrator-wizard/invite-new-administrator-wizard";

/**
 * Props interface of {@link AdministratorsList}
 */
interface AdministratorsListProps extends IdentifiableComponentInterface {
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * List of available user stores
     */
    availableUserStores: UserStoreDropdownItem[]
}

/**
 * Enum for add administrator modes.
 */
enum AddAdministratorModes {
    /**
     * To add an existing user as an administrator.
     */
    AddExisting = "addExistingUser",
    /**
     * To invite a new user as an administrator.
     */
    InviteParentUser = "inviteParentUser"
}

/**
 * Component to list and manage administrators.
 *
 * @param props - Props injected to the component.
 * @returns Administrators list component.
 */
const AdministratorsList: React.FunctionComponent<AdministratorsListProps> = (
    props: AdministratorsListProps
): ReactElement => {
    const {
        defaultListItemLimit,
        showMetaContent,
        readOnlyUserStores,
        selection,
        showListItemActions,
        availableUserStores,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const { isSubOrganization, isFirstLevelOrganization, isSuperOrganization } = useGetCurrentOrganizationType();
    const { unassignAdministratorRoles } = useBulkAssignAdministratorRoles();

    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ showAddExistingUserWizard, setShowAddExistingUserWizard ] = useState<boolean>(false);
    const [ showInviteNewAdministratorModal, setShowInviteNewAdministratorModal ] = useState<boolean>(false);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(userstoresConfig?.primaryUserstoreName);

    const {
        administrators,
        isNextPageAvailable,
        isAdministratorsListFetchRequestLoading,
        mutateAdministratorsListFetchRequest,
        adminUserListFetchError
    } = useAdministrators(
        listItemLimit,
        listOffset,
        searchQuery,
        null,
        selectedUserStore,
        UserManagementConstants.GROUPS_ATTRIBUTE
    );

    const [ loading, setLoading ] = useState(false);

    const handleUserEdit = (user: UserBasicInterface) => {
        history.push(
            AppConstants.getPaths()
                .get("CONSOLE_ADMINISTRATORS_EDIT")
                .replace(":id", user.id)
        );
    };

    const handleUserDelete = (user: UserBasicInterface & UserRoleInterface, onComplete: () => void): void => {
        unassignAdministratorRoles(
            user,
            () => {
                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "users:notifications.revokeAdmin.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.revokeAdmin.genericError.message")
                    })
                );
            },
            () => {
                mutateAdministratorsListFetchRequest();
                onComplete();
                dispatch(
                    addAlert<AlertInterface>({
                        description: t("users:notifications.revokeAdmin.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("users:notifications.revokeAdmin.success.message")
                    })
                );
            }
        );
    };

    const handleSelectedUserStoreChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setSelectedUserStore(data.value as string);
    };

    const handleListFilter = (query: string): void => {
        setSearchQuery(query);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    const renderAdministratorAddOptions = (): ReactElement => {
        if (isSubOrganization()) {
            const getAddUserOptions = () => {
                const options: DropdownItemProps[] = [
                    {
                        "data-componentid": `${ componentId }-add-existing-user-dropdown-item`,
                        key: 1,
                        text: t("consoleSettings:administrators.add.options.addExistingUser"),
                        value: AddAdministratorModes.AddExisting
                    },
                    {
                        "data-componentid": `${ componentId }-invite-new-user-dropdown-item`,
                        key: 2,
                        text: t("consoleSettings:administrators.add.options.inviteParentUser"),
                        value: AddAdministratorModes.InviteParentUser
                    }
                ];

                return options;
            };

            return (
                <Dropdown
                    data-componentid={ `${ componentId }-add-administrator-dropdown` }
                    direction="left"
                    floating
                    icon={ null }
                    trigger={ (
                        <PrimaryButton
                            data-componentid={ `${ componentId }-add-button` }
                            className="add-administrator-dropdown-trigger"
                        >
                            <Icon data-componentid={ `${componentId}-add-button-icon` } name="add" />
                            { t("consoleSettings:administrators.add.action") }
                            <Icon name="dropdown" className="add-administrator-dropdown-chevron"/>
                        </PrimaryButton>
                    ) }
                >
                    <Dropdown.Menu >
                        { getAddUserOptions().map((option: DropdownItemProps) => (
                            <Dropdown.Item
                                key={ option.value as string }
                                onClick={ () => {
                                    if (option.value === AddAdministratorModes.AddExisting) {
                                        setShowAddExistingUserWizard(true);
                                    } else {
                                        setShowInviteNewAdministratorModal(true);
                                    }
                                } }
                                { ...option }
                            />
                        )) }
                    </Dropdown.Menu>
                </Dropdown>
            );
        }

        return (
            <PrimaryButton
                data-componentid={ `${componentId}-add-button` }
                onClick={ () => setShowAddExistingUserWizard(true) }
            >
                <Icon data-componentid={ `${componentId}-add-button-icon` } name="add" />
                { t("consoleSettings:administrators.add.action") }
            </PrimaryButton>
        );
    };

    return (
        <ListLayout
            advancedSearch={ (
                <AdvancedSearchWithBasicFilters
                    onFilter={ handleListFilter }
                    filterAttributeOptions={ [
                        {
                            key: 0,
                            text: t(
                                "users:advancedSearch.form.dropdown." +
                                    "filterAttributeOptions.username"
                            ),
                            value: "userName"
                        },
                        {
                            key: 1,
                            text: t(
                                "users:advancedSearch.form.dropdown." +
                                    "filterAttributeOptions.email"
                            ),
                            value: "emails"
                        },
                        {
                            key: 2,
                            text: "First Name",
                            value: "name.givenName"
                        },
                        {
                            key: 3,
                            text: "Last Name",
                            value: "name.familyName"
                        }
                    ] }
                    filterAttributePlaceholder={ t(
                        "users:advancedSearch.form.inputs.filterAttribute. " + "placeholder"
                    ) }
                    filterConditionsPlaceholder={ t(
                        "users:advancedSearch.form.inputs.filterCondition" + ".placeholder"
                    ) }
                    filterValuePlaceholder={ t(
                        "users:advancedSearch.form.inputs.filterValue" + ".placeholder"
                    ) }
                    placeholder={ "Search by Username" }
                    defaultSearchAttribute={ "userName" }
                    defaultSearchOperator="co"
                    triggerClearQuery={ triggerClearQuery }
                />
            ) }
            currentListSize={ administrators?.Resources?.length }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            data-componentid={ `${componentId}-list-layout` }
            onPageChange={ handlePaginationChange }
            showPagination={ true }
            showTopActionPanel={ true }
            showPaginationPageLimit={ true }
            totalPages={ Math.ceil(administrators?.totalResults / listItemLimit) }
            totalListSize={ administrators?.totalResults }
            isLoading={ isAdministratorsListFetchRequestLoading }
            onSearchQueryClear={ handleSearchQueryClear }
            paginationOptions={ {
                disableNextButton: !isNextPageAvailable
            } }
            rightActionPanel={
                isFirstLevelOrganization() || isSuperOrganization()
                    ? (
                        <Dropdown
                            data-testid="user-mgt-user-list-userstore-dropdown"
                            selection
                            options={ availableUserStores }
                            onChange={ handleSelectedUserStoreChange }
                            defaultValue={ PRIMARY_USERSTORE.toLocaleLowerCase() }
                        />
                    ) : null
            }
            topActionPanelExtension={ (
                <Show when={ [ ...featureConfig?.users?.scopes?.create, ...featureConfig?.userRoles?.scopes?.update ] }>
                    { renderAdministratorAddOptions() }
                </Show>
            ) }
        >
            { adminUserListFetchError
                ? (
                    <EmptyPlaceholder
                        subtitle={ [ t("users:placeholders.userstoreError.subtitles.0"),
                            t("users:placeholders.userstoreError.subtitles.1") ] }
                        title={ t("users:placeholders.userstoreError.title") }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                    />
                ): (
                    <AdministratorsTable
                        defaultListItemLimit={ defaultListItemLimit }
                        administrators={ administrators }
                        onUserEdit={ handleUserEdit }
                        onUserDelete={ handleUserDelete }
                        isLoading={ loading }
                        readOnlyUserStores={ readOnlyUserStores }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                        triggerClearQuery={ triggerClearQuery }
                        onEmptyListPlaceholderActionClick={ () => null }
                        onIsLoading={ setLoading }
                        selection={ selection }
                        showListItemActions={ showListItemActions }
                        showMetaContent={ showMetaContent }
                        data-componentid={ `${componentId}-table` }
                    />
                )
            }
            { showAddExistingUserWizard && (
                <AddExistingUserWizard
                    onSuccess={ () => mutateAdministratorsListFetchRequest() }
                    onClose={ () => setShowAddExistingUserWizard(false) }
                />
            ) }
            { showInviteNewAdministratorModal && (
                <InviteNewAdministratorWizard
                    onClose={ () => setShowInviteNewAdministratorModal(false) }
                />
            ) }
        </ListLayout>
    );
};

AdministratorsList.defaultProps = {
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};

export default AdministratorsList;
