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
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store/index";
import { RoleConstants as CommonRoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    RoleListInterface,
    RolePropertyInterface,
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
import React, { ReactElement, ReactNode, SyntheticEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { RoleDeleteErrorConfirmation } from "./wizard/role-delete-error-confirmation";
import { RoleAudienceTypes, RoleConstants } from "../constants/role-constants";

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
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        roleList,
        searchQuery,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const userRolesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRoles);
    const administratorRoleDisplayName: string = useSelector(
        (state: AppState) => state?.config?.ui?.administratorRoleDisplayName);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const isEditingSystemRolesAllowed: boolean =
        useSelector((state: AppState) => state?.config?.ui?.isSystemRolesEditAllowed);

    const isReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(userRolesFeatureConfig,
            RoleConstants.FEATURE_DICTIONARY.get("ROLE_UPDATE")) ||
            !hasRequiredScopes(userRolesFeatureConfig,
                userRolesFeatureConfig?.scopes?.update, allowedScopes);
    }, [ userRolesFeatureConfig, allowedScopes ]);

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
                    action={ (
                        <Show when={ featureConfig?.userRoles?.scopes?.create }>
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
                    title={ t("roles:list.emptyPlaceholders.emptyRoleList.title",
                        { type: "role" }) }
                    subtitle={ [
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
                render: (role: RolesInterface): ReactNode => {
                    const isSharedRole: boolean = role?.properties?.some(
                        (property: RolePropertyInterface) =>
                            property?.name === RoleConstants.IS_SHARED_ROLE &&
                        property?.value === "true");

                    return (
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
                                {
                                    isSharedRole && (
                                        <Label size="mini">
                                            { t("roles:list.labels.shared") }
                                        </Label>
                                    )
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("roles:list.columns.name")
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
                hidden: (role: RolesInterface) => role?.meta?.systemRole,
                icon: (): SemanticICONS =>
                    !isReadOnly
                        ? "pencil alternate"
                        : "eye",
                onClick: (e: SyntheticEvent, role: RolesInterface): void =>
                    !isReadOnly && handleRoleEdit(role?.id),
                popupText: (): string =>
                    !isReadOnly
                        ? t("common:edit")
                        : t("common:view"),
                renderer: "semantic-icon"
            },
            {
                hidden: (role: RolesInterface) => {
                    const isSharedRole: boolean = role?.properties?.some((property: RolePropertyInterface) =>
                        property?.name === RoleConstants.IS_SHARED_ROLE && property?.value === "true");

                    return role?.meta?.systemRole
                    || (
                        role?.displayName === CommonRoleConstants.ADMIN_ROLE ||
                        role?.displayName === CommonRoleConstants.ADMIN_GROUP ||
                        role?.displayName === administratorRoleDisplayName
                    )
                    || !isFeatureEnabled(userRolesFeatureConfig,
                        RoleConstants.FEATURE_DICTIONARY.get("ROLE_DELETE"))
                    || !hasRequiredScopes(userRolesFeatureConfig,
                        userRolesFeatureConfig?.scopes?.delete, allowedScopes)
                    || isSharedRole
                    || role?.displayName === t("user:editUser." +
                        "userActionZoneGroup.impersonateUserZone.actionTitle");
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, role: RolesInterface): void => {
                    onRoleDeleteClicked(role);
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
                onRowClick={
                    (_e: SyntheticEvent, role: RolesInterface): void => {
                        if (!isEditingSystemRolesAllowed && role?.meta?.systemRole) {
                            return;
                        }
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
                        assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
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
