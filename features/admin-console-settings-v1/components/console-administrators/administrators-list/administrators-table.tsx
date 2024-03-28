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

import Chip from "@oxygen-ui/react/Chip";
import { UserstoreConstants } from "@wso2is/core/constants";
import { getUserNameWithoutDomain, hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    RolesInterface,
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
import moment from "moment";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Label, ListItemProps, SemanticICONS } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    UserBasicInterface,
    UserRoleInterface,
    getEmptyPlaceholderIllustrations
} from "../../../../core";
import { useGetCurrentOrganizationType } from "../../../../organizations/hooks/use-get-organization-type";
import { useServerConfigs } from "../../../../server-configurations";
import { UserManagementConstants } from "../../../../admin-users-v1/constants";
import { UserListInterface } from "../../../../admin-users-v1/models";
import { UserManagementUtils } from "../../../../admin-users-v1/utils";
import useConsoleRoles from "../../../hooks/use-console-roles";
import "./administrators-table.scss";

/**
 * Props interface of {@link AdministratorsTable}
 */
interface AdministratorsTablePropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Admin list.
     */
    administrators: UserListInterface;
    /**
     * User delete callback.
     */
    onUserDelete?: (user: UserBasicInterface, onComplete: () => void) => void;
    /**
     * On user edit callback.
     */
    onUserEdit?: (user: UserBasicInterface) => void;
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
const AdministratorsTable: React.FunctionComponent<AdministratorsTablePropsInterface> = (
    props: AdministratorsTablePropsInterface): ReactElement => {

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
        onUserEdit,
        searchQuery,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const { data: serverConfigs } = useServerConfigs();
    const { isSubOrganization } = useGetCurrentOrganizationType();

    const { consoleRoles } = useConsoleRoles(null, null);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state?.config?.ui?.features?.users;
    });
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);
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
                render: (user: UserBasicInterface): ReactNode => {
                    const header: string = getUserNameWithoutDomain(user?.userName);
                    const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);
                    const isNameAvailable: boolean = user.name?.familyName !== undefined ||
                        user.name?.givenName !== undefined;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ user.userName.split("/")?.length > 1
                                    ? user.userName.split("/")[ 1 ]
                                    : user.userName.split("/")[ 0 ]
                                }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                { header }
                                { resolveMyselfLabel(user) }
                                {
                                    (isNameAvailable) &&
                                        (<Header.Subheader
                                            data-componentid={ `${ componentId }-item-sub-heading` }
                                        >
                                            { subHeader }
                                        </Header.Subheader>)
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "roles",
                id: "roles",
                key: "roles",
                render: (user: UserBasicInterface): ReactNode => {
                    const generateColor = (display: string) => {
                        const hues: { [key: string]: number } = {
                            A: 0,
                            B: 60,
                            C: 120,
                            D: 180,
                            E: 240,
                            F: 300
                        };

                        const hash: number = display.split("").reduce((acc: number, char: string) =>
                            acc + char.charCodeAt(0), 0);
                        const baseHue: number = hash % 360;

                        const firstChar: string = display[0].toUpperCase();
                        const predefinedHue: number = hues[firstChar] || baseHue;

                        return `hsl(${predefinedHue} 70% 80% / 50%)`;
                    };

                    const maxRolesToShow: number = 5;
                    const consoleRolesToShow: UserRoleInterface[] = user.roles
                        .filter((role: UserRoleInterface) =>
                            consoleRoles?.Resources?.some((consoleRole: RolesInterface) => {
                                return consoleRole.id === role.value;
                            })
                        )
                        .slice(0, maxRolesToShow);

                    const rolesToOmit: UserRoleInterface[] = user.roles
                        .filter((role: UserRoleInterface) =>
                            consoleRoles?.Resources?.some((consoleRole: RolesInterface) => {
                                return consoleRole.id === role.value;
                            })
                        )
                        .slice(consoleRolesToShow.length);

                    return (
                        <div className="role-tag-list">
                            { consoleRolesToShow.map((role: UserRoleInterface) => (
                                <Chip
                                    key={ role.value }
                                    label={ role.display }
                                    size="small"
                                    sx={ { backgroundColor: generateColor(role.display) } }
                                />
                            )) }
                            { rolesToOmit.length > 0 && (
                                <Chip
                                    key="more-chip"
                                    label={ `+ ${rolesToOmit.length} More` }
                                    size="small"
                                    sx={ { backgroundColor: "#ccc" } }
                                />
                            ) }
                        </div>
                    );
                },
                title: "Roles"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "meta.lastModified",
                id: "meta.lastModified",
                key: "meta.lastModified",
                render: (user: UserBasicInterface): ReactNode => {
                    const now: moment.Moment = moment(new Date());
                    const receivedDate: moment.Moment = moment(user?.meta?.lastModified);

                    return t("console:common.dateTime.humanizedDateString", {
                        date: moment.duration(now.diff(receivedDate)).humanize()
                    });
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

        // TODO: Add edit option for internal users onboarded as admins.
        const actions: TableActionsInterface[] = [
            {
                "data-componentid": "administrators-list-item-edit-button",
                hidden: (): boolean => !isFeatureEnabled(featureConfig,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : "PRIMARY";

                    return (
                        !hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString()))
                        ? "eye"
                        : "pencil alternate";

                },
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void => {
                    onUserEdit(user);
                },
                popupText: (user: UserBasicInterface): string => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : "PRIMARY";

                    return (
                        !hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString()))
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            "data-componentid": "administrators-list-item-delete-button",
            hidden: (user: UserBasicInterface): boolean => {
                const userStore: string = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]
                    : UserstoreConstants.PRIMARY_USER_STORE;

                return !isFeatureEnabled(featureConfig,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || isPrivilegedUser
                    || !hasRequiredScopes(featureConfig, featureConfig?.scopes?.delete, allowedScopes)
                    || readOnlyUserStores?.includes(userStore.toString())
                    || (getUserNameWithoutDomain(user?.userName) === serverConfigs?.realmConfig?.adminUser &&
                            !isSubOrganization())
                    || authenticatedUser?.includes(getUserNameWithoutDomain(user?.userName));
            },
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, user: UserBasicInterface): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingUser(user);
            },
            popupText: (): string => t("users:usersList.list.iconPopups.delete"),
            renderer: "semantic-icon"
        });

        return actions;
    };

    /**
     * Returns a label if your own account is listed.
     *
     * @param user - each admin user belonging to a row of the table.
     * @returns the label indication of your own account.
     */
    const resolveMyselfLabel = (user: UserBasicInterface): ReactNode => {
        if (authenticatedUser?.includes(getUserNameWithoutDomain(user?.userName))) {
            return (
                <Label size="small">
                    Me
                </Label>
            );
        }

        return null;
    };

    /**
     * Shows list placeholders.
     *
     * @returns placeholder for empty admins list
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && administrators?.totalResults === 0) {
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

        if (administrators?.totalResults === 0) {
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
            <DataTable<UserBasicInterface>
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
                data={ administrators?.Resources }
                onColumnSelectionChange={ onColumnSelectionChange }
                onRowClick={ (e: SyntheticEvent, user: UserBasicInterface): void => {
                    onUserEdit(user);
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ true }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                className="console-administrators-table"
                data-componentid={ componentId }
            />
            {
                deletingUser && (
                    <ConfirmationModal
                        primaryActionLoading={ isLoading }
                        data-componentid={ `${ componentId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("user:deleteUser.confirmationModal.assertionHint") }
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
                        <ConfirmationModal.Header data-componentid={ `${ componentId }-confirmation-modal-header` }>
                            { t("user:deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={ `${ componentId }-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("extensions:manage.guest.deleteUser.confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-componentid={ `${ componentId }-confirmation-modal-content` }>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { t("extensions:manage.guest.deleteUser.confirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
AdministratorsTable.defaultProps = {};

export default AdministratorsTable;
