/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { UserstoreConstants } from "@wso2is/core/constants";
import { getUserNameWithoutDomain, hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    SBACInterface
} from "@wso2is/core/models";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, ListItemProps, SemanticICONS } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations
} from "../../../../admin.core.v1";
import { useServerConfigs } from "../../../../admin-server-configurations-v1";
import { UserInviteInterface } from "../../../../admin-users-v1/components/guests/models/invite";
import { UserManagementConstants } from "../../../../admin-users-v1/constants";

/**
 * Props interface of {@link InvitedAdministratorsTable}
 */
interface InvitedAdministratorsTablePropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Admin list.
     */
    administrators: UserInviteInterface[];
    /**
     * User delete callback.
     */
    onUserDelete?: (user: UserInviteInterface, onComplete: () => void) => void;
    /**
     * On user edit callback.
     */
    onUserEdit?: (user: UserInviteInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Trigger to clear the search query.
     */
    triggerClearQuery?: boolean;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Callback to inform the new set of visible columns.
     * @param columns - New columns for the accepted admins table.
     */
    onColumnSelectionChange?: (columns: TableColumnInterface[]) => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, data: ListItemProps) => void;
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
     * Is the list loading.
     */
    isLoading?: boolean;
    /**
     * Callback to inform the loading state.
     */
    onIsLoading?: (isLoading: boolean) => void;
}

/**
 * Component to render the list of onboarded/accepted admins in a table.
 *
 * @param props - Props injected to the component.
 * @returns Admins table component.
 */
const InvitedAdministratorsTable: React.FunctionComponent<InvitedAdministratorsTablePropsInterface> = (
    props: InvitedAdministratorsTablePropsInterface): ReactElement => {

    const {
        triggerClearQuery,
        administrators,
        defaultListItemLimit,
        onUserDelete,
        isLoading,
        onIsLoading,
        readOnlyUserStores,
        onColumnSelectionChange,
        onListItemClick,
        onSearchQueryClear,
        selection,
        showListItemActions,
        searchQuery,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const { data: serverConfigs } = useServerConfigs();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserInviteInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state?.config?.ui?.features?.users;
    });
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    /**
     * Resolves data table columns.
     *
     * @returns the columns of the accepted admin users table.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (user: UserInviteInterface): ReactNode => {
                    const header: string = user?.username;
                    const subHeader: string = user?.email;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={
                                    user.username.split("/")?.length > 1
                                        ? user.username.split("/")[ 1 ]
                                        : user.username.split("/")[ 0 ]
                                }
                                size="mini"
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                { header }
                                { subHeader && (
                                    <Header.Subheader
                                        data-componentid={ `${ componentId }-item-sub-heading` }
                                    >
                                        { subHeader }
                                    </Header.Subheader>
                                ) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (user: UserInviteInterface): ReactNode => {
                    return <span>{ user?.status }</span>;
                },
                title: "Last Modified"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ""
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns actions of the accepted admin users table.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                "data-componentid": "administrators-list-item-delete-button",
                hidden: (user: UserInviteInterface): boolean => {
                    const userStore: string = user?.username?.split("/").length > 1
                        ? user?.username?.split("/")[0]
                        : UserstoreConstants.PRIMARY_USER_STORE;

                    return !isFeatureEnabled(featureConfig,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                        || isPrivilegedUser
                        || !hasRequiredScopes(featureConfig, featureConfig?.scopes?.delete, allowedScopes)
                        || readOnlyUserStores?.includes(userStore.toString())
                        || ((getUserNameWithoutDomain(user?.username) === serverConfigs?.realmConfig?.adminUser
                        || authenticatedUser?.includes(getUserNameWithoutDomain(user?.username))));
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, user: UserInviteInterface): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingUser(user);
                },
                popupText: (): string => t("users:usersList.list.iconPopups.delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Shows list placeholders.
     *
     * @returns placeholder for empty admins list
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && isEmpty(administrators)) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("users:usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("users:usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("users:usersList.search.emptyResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("users:usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (isEmpty(administrators)) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ "There are no collaborator users associated with your organization at the moment." ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<UserInviteInterface>
                externalSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ () => null }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("users:advancedSearch.form.dropdown." +
                                                "filterAttributeOptions.username"),
                                value: "userName"
                            },
                            {
                                key: 1,
                                text: t("users:advancedSearch.form.dropdown." +
                                                "filterAttributeOptions.email"),
                                value: "emails"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("users:advancedSearch.form.inputs" +
                                            ".filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("users:advancedSearch.form.inputs" +
                                            ".filterCondition.placeholder")
                        }
                        filterValuePlaceholder={
                            t("users:advancedSearch.form.inputs.filterValue" +
                                            ".placeholder")
                        }
                        placeholder={ t("users:advancedSearch.placeholder") }
                        defaultSearchAttribute="userName"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                    />
                ) }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ administrators }
                onColumnSelectionChange={ onColumnSelectionChange }
                onRowClick={ (e: SyntheticEvent, user: UserInviteInterface): void => {
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ true }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-componentid={ componentId }
            />
            {
                deletingUser && (
                    <ConfirmationModal
                        primaryActionLoading={ isLoading }
                        data-componentid={ `${componentId}-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={
                            t("invite:confirmationModal.deleteInvite.assertionHint")
                        }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => {
                            onIsLoading(true);
                            onUserDelete(deletingUser, () => {
                                setShowDeleteConfirmationModal(false);
                                setDeletingUser(undefined);
                                onIsLoading(false);
                            });
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-componentid={ `${componentId}-confirmation-modal-header` }>
                            { t("invite:confirmationModal.deleteInvite.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={ `${componentId}-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("invite:confirmationModal.deleteInvite.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-componentid={ `${componentId}-confirmation-modal-content` }>
                            { t("invite:confirmationModal.deleteInvite.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            { alert && alertComponent }
        </>
    );
};

InvitedAdministratorsTable.defaultProps = {
    "data-componentid": "invited-administrators"
};

export default InvitedAdministratorsTable;
