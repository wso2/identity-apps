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
import { RoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    RoleListInterface,
    RolesInterface
} from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../core/configs/ui";
import { AppState } from "../../../core/store/index";
import { RoleAudienceTypes } from "../../../roles/constants/role-constants";

/**
 * Props interface of {@link ConsoleRolesTable}
 */
export interface ConsoleRolesTableProps extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     * Roles list.
     */
    roleList: RoleListInterface;
    /**
     * Role delete callback.
     */
    onRoleDelete?: (role: RolesInterface) => void;
    /**
     * Role edit callback.
     */
    onRoleEdit?: (role: RolesInterface) => void;
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
     * Is the current org a sub org.
     */
    isSubOrg?: boolean;
}

/**
 * Table component to list roles.
 *
 * @param props - Props injected to the component.
 * @returns Console roles table component.
 */
const ConsoleRolesTable: FunctionComponent<ConsoleRolesTableProps> = (
    props: ConsoleRolesTableProps
): ReactElement => {
    const {
        onRoleDelete,
        onRoleEdit,
        isSubOrg,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        roleList,
        searchQuery,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRoles);
    const administratorRoleDisplayName: string = useSelector(
        (state: AppState) => state?.config?.ui?.administratorRoleDisplayName);

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedRole, setCurrentDeletedRole ] = useState<RolesInterface>();

    /**
     * Shows list placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && roleList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-componentid={ `${ componentId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("roles:list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (roleList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-empty-list-empty-placeholder` }
                    action={ !isSubOrg && (
                        <Show when={ AccessControlConstants.ROLE_WRITE }>
                            <PrimaryButton
                                data-componentid={ `${ componentId }-empty-list-empty-placeholder-add-button` }
                                onClick={ onEmptyListPlaceholderActionClick }
                            >
                                <Icon name="add"/>
                                { t("roles:list.emptyPlaceholders.emptyRoleList.action",
                                    { type: "Role" }) }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ !isSubOrg && t("roles:list.emptyPlaceholders.emptyRoleList.title",
                        { type: "role" }) }
                    subtitle={ isSubOrg
                        ? [
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                { type: "roles" })
                        ]
                        : [
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                { type: "roles" }),
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.1",
                                { type: "role" }),
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.2",
                                { type: "role" })
                        ]
                    }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (role: RolesInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-componentid={ `${ componentId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ role?.displayName[ 0 ] }
                                    size="mini"
                                    data-componentid={ `${ componentId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-componentid={ `${ componentId }-item-image` }
                        />
                        <Header.Content>
                            { role?.displayName }
                        </Header.Content>
                    </Header>
                ),
                title: t("roles:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "audience",
                id: "audience",
                key: "audience",
                render: (role: RolesInterface) => (
                    <Header as="h6" data-componentid={ `${ componentId }-col-2-item-heading` }>
                        <Header.Content>
                            <Header.Subheader data-componentid={ `${ componentId }-col-2-item-sub-heading` }>
                                { role?.audience?.type.charAt(0).toUpperCase() + role?.audience?.type.slice(1) }
                                {
                                    RoleAudienceTypes.APPLICATION === role?.audience?.type.toUpperCase() && (
                                        <Label
                                            size="mini"
                                            className="client-id-label"
                                        >
                                            { role?.audience?.display }
                                        </Label>
                                    )
                                }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: (
                    <div className="pl-3">
                        { t("roles:list.columns.audience") }
                    </div>
                )
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];
    };

    /**
     * Resolves data table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                icon: (): SemanticICONS =>
                    hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes)
                        ? "pencil alternate"
                        : "eye",
                onClick: (e: SyntheticEvent, role: RolesInterface): void =>
                    hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes)
                        && onRoleEdit(role),
                popupText: (): string =>
                    hasRequiredScopes(featureConfig, featureConfig?.scopes?.update, allowedScopes)
                        ? t("roles:list.popups.edit",
                            { type: "Role" })
                        : t("common:view"),
                renderer: "semantic-icon"
            },
            {
                hidden: (role: RolesInterface) => isSubOrg || (role?.displayName === RoleConstants.ADMIN_ROLE ||
                    role?.displayName === RoleConstants.ADMIN_GROUP ||
                    role?.displayName === administratorRoleDisplayName)
                    || !hasRequiredScopes(featureConfig, featureConfig?.scopes?.delete, allowedScopes),
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, role: RolesInterface): void => {
                    setCurrentDeletedRole(role);
                    setShowDeleteConfirmationModal(!showRoleDeleteConfirmation);
                },
                popupText: (): string => t("roles:list.popups.delete",
                    { type: "Role" }),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <>
            <DataTable<RolesInterface>
                loadingStateOptions={ { imageType: "square" } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ roleList?.Resources }
                onRowClick={ (_: SyntheticEvent, role: RolesInterface): void => {
                    onRoleEdit(role);
                } }
                placeholders={ showPlaceholders() }
                data-componentid={ componentId }
            />
            {
                showRoleDeleteConfirmation && (
                    <ConfirmationModal
                        data-componentid={ `${ componentId }-delete-item-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showRoleDeleteConfirmation }
                        assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => {
                            onRoleDelete(currentDeletedRole);
                            setShowDeleteConfirmationModal(false);
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("roles:list.confirmations.deleteItem.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("roles:list.confirmations.deleteItem.message",
                                { type: "role" }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("roles:list.confirmations.deleteItem.content",
                                { type: "role" }) }
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
ConsoleRolesTable.defaultProps = {
    "data-componentid": "console-roles-table"
};

export default ConsoleRolesTable;
