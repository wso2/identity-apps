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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
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
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { RoleDeleteErrorConfirmation } from "./wizard/role-delete-error-confirmation";
import { getEmptyPlaceholderIllustrations } from "../../core/configs/ui";
import { AppConstants } from "../../core/constants/app-constants";
import { history } from "../../core/helpers/history";
import { FeatureConfigInterface } from "../../core/models/config";
import { AppState } from "../../core/store/index";
import { RoleAudienceTypes } from "../constants/role-constants";

interface RoleListProps extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     * Roles list.
     */
    roleList: RoleListInterface;
    /**
     * Role delete callback.
     */
    handleRoleDelete?: (role: RolesInterface) => void;
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
 * List component for Role Management list
 *
 * @param props - contains the role list as a prop to populate
 */
export const RoleList: React.FunctionComponent<RoleListProps> = (props: RoleListProps): ReactElement => {

    const {
        handleRoleDelete,
        isSubOrg,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        roleList,
        searchQuery,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedRole, setCurrentDeletedRole ] = useState<RolesInterface>();
    const [ showDeleteErrorConnectedAppsModal, setShowDeleteErrorConnectedAppsModal ] = useState<boolean>(false);

    const handleRoleEdit = (roleId: string) => {
        history.push(AppConstants.getPaths().get("ROLE_EDIT").replace(":id", roleId));
    };

    /**
     * Function to handle role deletion button click.
     * If the role is in Application audience type, Info Modal will be shown
     * to inform the user that the role is connected to applications.
     *
     * @param role - Role to be deleted.
     */
    const onRoleDeleteClicked = (role: RolesInterface) => {
        setCurrentDeletedRole(role);
        if (role?.audience?.type?.toUpperCase() === RoleAudienceTypes.APPLICATION) {
            setShowDeleteErrorConnectedAppsModal(true);
        } else {
            setShowDeleteConfirmationModal(true);
        }
    };

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
                            { t("console:manage.features.roles.list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.roles.list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("console:manage.features.roles.list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("console:manage.features.roles.list.emptyPlaceholders.search.subtitles.1")
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
                                { t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.action",
                                    { type: "Role" }) }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ !isSubOrg && t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.title",
                        { type: "role" }) }
                    subtitle={ isSubOrg
                        ? [
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                { type: "roles" })
                        ]
                        : [
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                { type: "roles" }),
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.1",
                                { type: "role" }),
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.2",
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
                title: t("console:manage.features.roles.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "audience",
                id: "audience",
                key: "audience",
                render: (role: RolesInterface) => (
                    role?.audience && (
                        <Label size="mini">
                            { role.audience.type }
                            {
                                role.audience.type.toUpperCase() === RoleAudienceTypes.APPLICATION
                                    ? ` | ${role.audience.display} `
                                    : ""
                            }
                        </Label>
                    )
                ),
                title: (
                    <div className="pl-3">
                        { t("console:manage.features.roles.list.columns.audience") }
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
                    hasRequiredScopes(featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes)
                        ? "pencil alternate"
                        : "eye",
                onClick: (e: SyntheticEvent, role: RolesInterface): void =>
                    hasRequiredScopes(featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes)
                        && handleRoleEdit(role?.id),
                popupText: (): string =>
                    hasRequiredScopes(featureConfig?.roles, featureConfig?.roles?.scopes?.update, allowedScopes)
                        ? t("common:edit")
                        : t("common:view"),
                renderer: "semantic-icon"
            },
            {
                hidden: () => isSubOrg
                    || !hasRequiredScopes(featureConfig?.roles, featureConfig?.roles?.scopes?.delete, allowedScopes),
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, role: RolesInterface): void => {
                    onRoleDeleteClicked(role);
                },
                popupText: (): string => t("console:manage.features.roles.list.popups.delete",
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
                onRowClick={
                    (e: SyntheticEvent, role: RolesInterface): void => {
                        handleRoleEdit(role?.id);
                    }
                }
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
                        assertionHint={ t("console:manage.features.roles.list.confirmations.deleteItem.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => {
                            handleRoleDelete(currentDeletedRole);
                            setShowDeleteConfirmationModal(false);
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("console:manage.features.roles.list.confirmations.deleteItem.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("console:manage.features.roles.list.confirmations.deleteItem.message",
                                { type: "role" }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("console:manage.features.roles.list.confirmations.deleteItem.content",
                                { type: "role" }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showDeleteErrorConnectedAppsModal && (
                    <RoleDeleteErrorConfirmation
                        isOpen={ showDeleteErrorConnectedAppsModal }
                        onClose={ (): void => {
                            setShowDeleteErrorConnectedAppsModal(false);
                            setCurrentDeletedRole(undefined);
                        } }
                        selectedRole={ currentDeletedRole }
                        data-componentid={ `${ componentId }-role-delete-error-confirmation-modal` }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
RoleList.defaultProps = {
    "data-componentid": "role-mgt-roles-list"
};
