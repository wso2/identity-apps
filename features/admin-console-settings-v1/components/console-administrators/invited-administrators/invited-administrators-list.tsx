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
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, ListLayout, PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import InvitedAdministratorsTable from "./invited-administrators-table";
import { AccessControlConstants } from "../../../../admin-access-control-v1/constants/access-control";
import {
    AdvancedSearchWithBasicFilters,
    UIConstants,
    getEmptyPlaceholderIllustrations
} from "../../../../core";
import { useGetCurrentOrganizationType } from "../../../../organizations/hooks/use-get-organization-type";
import { deleteParentOrgInvite } from "../../../../users/components/guests/api/invite";
import { UserManagementConstants } from "../../../../users/constants";
import { UserInviteInterface } from "../../../../users/models";
import { PRIMARY_USERSTORE } from "../../../../userstores/constants";
import { UserStoreDropdownItem } from "../../../../userstores/models";
import useAdministrators from "../../../hooks/use-administrators";
import InviteNewAdministratorWizard from "../invite-new-administrator-wizard/invite-new-administrator-wizard";

/**
 * Props interface of {@link InvitedAdministratorsList}
 */
interface InvitedAdministratorsListProps extends IdentifiableComponentInterface {
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
     * List of available user stores.
     */
    availableUserStores: UserStoreDropdownItem[]
}

/**
 * Component to list and manage invited administrators.
 *
 * @param props - Props injected to the component.
 * @returns Invited administrators list component.
 */
const InvitedAdministratorsList: React.FunctionComponent<InvitedAdministratorsListProps> = (
    props: InvitedAdministratorsListProps
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

    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ showInviteNewAdministratorModal, setShowInviteNewAdministratorModal ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState(false);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(PRIMARY_USERSTORE.toLocaleLowerCase());

    const {
        invitedAdministrators,
        adminUserListFetchError,
        isNextPageAvailable,
        isAdministratorsListFetchRequestLoading,
        mutateInvitedAdministratorsListFetchRequest
    } = useAdministrators(
        listItemLimit,
        listOffset,
        searchQuery,
        null,
        selectedUserStore,
        UserManagementConstants.GROUPS_ATTRIBUTE
    );

    const { isFirstLevelOrganization, isSuperOrganization } = useGetCurrentOrganizationType();

    const handleUserDelete = (user: UserInviteInterface, onComplete: () => void): Promise<void> => {
        return deleteParentOrgInvite(user.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("invite:notifications.deleteInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("invite:notifications.deleteInvite.success.message")
                }));

                mutateInvitedAdministratorsListFetchRequest();
            }).catch(() => {
                dispatch(addAlert({
                    description: t("invite:notifications.deleteInvite.genericError." +
                    "description"),
                    level: AlertLevels.ERROR,
                    message: t("invite:notifications.deleteInvite.genericError.message")
                }));
            })
            .finally(() => onComplete());
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param query - Search query for filtering users.
     */
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

    const handleSelectedUserStoreChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setSelectedUserStore(data.value as string);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
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
            currentListSize={ invitedAdministrators?.invitations?.length }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            data-componentid={ `${componentId}-list-layout` }
            onPageChange={ handlePaginationChange }
            showPagination={ true }
            showTopActionPanel={ true }
            showPaginationPageLimit={ true }
            totalPages={ Math.ceil(invitedAdministrators?.invitations?.length / listItemLimit) }
            totalListSize={ invitedAdministrators?.invitations?.length }
            isLoading={ isAdministratorsListFetchRequestLoading }
            onSearchQueryClear={ handleSearchQueryClear }
            paginationOptions={ {
                disableNextButton: !isNextPageAvailable
            } }
            rightActionPanel={
                isFirstLevelOrganization() || isSuperOrganization()
                    ? (<Dropdown
                        data-testid="user-mgt-user-list-userstore-dropdown"
                        selection
                        options={ availableUserStores }
                        onChange={ handleSelectedUserStoreChange }
                        defaultValue={ PRIMARY_USERSTORE.toLocaleLowerCase() }
                    />) : null
            }
            topActionPanelExtension={ (
                <Show when={ AccessControlConstants.USER_WRITE }>
                    <PrimaryButton
                        data-componentid={ `${ componentId }-add-button` }
                        onClick={ () => setShowInviteNewAdministratorModal(true) }
                    >
                        <Icon data-componentid={ `${componentId}-add-button-icon` } name="add" />
                        Invite New User
                    </PrimaryButton>
                </Show>
            ) }
        >
            { adminUserListFetchError
                ? (<EmptyPlaceholder
                    subtitle={ [ t("users:placeholders.userstoreError.subtitles.0"),
                        t("users:placeholders.userstoreError.subtitles.1") ] }
                    title={ t("users:placeholders.userstoreError.title") }
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                />)
                : (<InvitedAdministratorsTable
                    defaultListItemLimit={ defaultListItemLimit }
                    administrators={ invitedAdministrators?.invitations }
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
                />)
            }

            { showInviteNewAdministratorModal && (
                <InviteNewAdministratorWizard
                    onClose={ () => setShowInviteNewAdministratorModal(false) }
                />
            ) }
        </ListLayout>
    );
};

InvitedAdministratorsList.defaultProps = {
    "data-componentid": "invited-administrators-list",
    selection: false,
    showListItemActions: true,
    showMetaContent: true
};

export default InvitedAdministratorsList;
