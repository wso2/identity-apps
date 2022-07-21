/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by organizationlicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { deleteOrganizationRole } from "../api/organization-role";
import { OrganizationRoleManagementConstants } from "../constants";
import { OrganizationRoleListItemInterface } from "../models";

/**
 *
 * Proptypes for the organization role list component.
 */
interface OrganizationRolesListPropsInterface
    extends SBACInterface<FeatureConfigInterface>,
        LoadableComponentInterface,
        TestableComponentInterface,
        IdentifiableComponentInterface {
    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Organization role list.
     */
    list: Array<OrganizationRoleListItemInterface>
    /**
     * On organization role delete callback.
     */
    onOrganizationRoleDelete?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, organization: OrganizationRoleListItemInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Current Organization id
     */
    organizationId: string;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show sign on methods condition
     */
    isSetStrongerAuth?: boolean;
    /**
     * Is the list rendered on a portal.
     */
    isRenderedOnPortal?: boolean;
}

export const OrganizationRoleList: FunctionComponent<OrganizationRolesListPropsInterface> = (
    props: OrganizationRolesListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        featureConfig,
        isLoading,
        list,
        onOrganizationRoleDelete,
        onListItemClick,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        organizationId,
        searchQuery,
        selection,
        showListItemActions,
        isSetStrongerAuth,
        isRenderedOnPortal,
        ["data-testid"]: testId,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingOrganizationRole, setDeletingOrganizationRole ] = useState<OrganizationRoleListItemInterface>(
        undefined
    );

    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    /**
     * Redirects to the organization role edit page when the edit button is clicked.
     *
     * @param {string} organizationId - Organization id.
     */
    const handleOrganizationEdit = (organizationId: string): void => {
        history.push({
            pathname: AppConstants.getPaths()
                .get("ORGANIZATION_ROLE_UPDATE")
                .replace(":id", organizationId)
        });
    };

    /**
     * Deletes an organization when the delete organization button is clicked.
     *
     * @param {string} roleId - Selected Role id.
     */
    const handleOrganizationDelete = (roleId: string): void => {
        deleteOrganizationRole(organizationId, roleId)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.success" +
                            ".description" // ToDo
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            // ToDo
                            "console:manage.features.organizations.notifications.deleteOrganization.success.message"
                        )
                    })
                );

                setShowDeleteConfirmationModal(false);
                onOrganizationRoleDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        setAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications.deleteOrganization.error" +
                                ".message" // ToDo
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    setAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization" +
                            ".genericError.description" // ToDo
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.genericError" +
                            ".message" // ToDo
                        )
                    })
                );
            });
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (organizationRole: OrganizationRoleListItemInterface): ReactNode => {
                    return (
                        <Header image as="h6" className="header-with-icon" data-testid={ `${testId}-item-heading` }>
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ organizationRole.displayName }
                                        size="mini"
                                        data-testid={ `${testId}-item-image-inner` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${testId}-item-image` }
                            />
                            <Header.Content>
                                { organizationRole.displayName }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.organizations.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.organizations.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                "data-testid": `${testId}-item-edit-button`,
                hidden: (): boolean =>
                    !isFeatureEnabled(
                        featureConfig?.organizationsRoles,
                        OrganizationRoleManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_ROLE_UPDATE")
                    ),
                icon: (role: OrganizationRoleListItemInterface): SemanticICONS => {
                    return !hasRequiredScopes(
                        featureConfig?.organizationsRoles,
                        featureConfig?.organizationsRoles?.scopes?.update,
                        allowedScopes
                    ) || role.displayName === OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, role: OrganizationRoleListItemInterface): void =>
                    handleOrganizationEdit(role.id),
                popupText: (role: OrganizationRoleListItemInterface): string => {
                    return !hasRequiredScopes(
                        featureConfig?.organizationsRoles,
                        featureConfig?.organizationsRoles?.scopes?.update,
                        allowedScopes
                    ) || role.displayName === OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${testId}-item-delete-button`,
                hidden: (role: OrganizationRoleListItemInterface) => {
                    return !hasRequiredScopes(
                        featureConfig?.organizationsRoles,
                        featureConfig?.organizationsRoles?.scopes?.delete,
                        allowedScopes
                    ) || role.displayName === OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, role: OrganizationRoleListItemInterface): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingOrganizationRole(role);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && (isEmpty(list) || list?.length === 0)) {
            return (
                <EmptyPlaceholder
                    action={
                        (<LinkButton onClick={ onSearchQueryClear }>
                            { t("console:manage.placeholders.emptySearchResult.action") }
                        </LinkButton>)
                    }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:manage.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:manage.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-testid={ `${testId}-empty-search-placeholder` }
                />
            );
        }

        if (isEmpty(list) || list?.length === 0) {
            return (
                <EmptyPlaceholder
                    className={ !isRenderedOnPortal ? "list-placeholder" : "" }
                    action={
                        onEmptyListPlaceholderActionClick && (
                            <Show when={ AccessControlConstants.ORGANIZATION_ROLES_WRITE }>
                                <PrimaryButton
                                    onClick={ () => {
                                        // eventPublisher.publish(componentId + "-click-new-organization-button");
                                        onEmptyListPlaceholderActionClick();
                                    } }
                                >
                                    <Icon name="add"/>
                                    { t("console:manage.features.roles.list.emptyPlaceholders.search.action") }
                                </PrimaryButton>
                            </Show>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ "There are no organization roles at the momemnt" ] }
                    data-testid={ `${testId}-empty-placeholder` }
                />
            );
        }
    };

    return (
        <>
            <DataTable<OrganizationRoleListItemInterface>
                className="organization-roles-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ !isSetStrongerAuth && resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ (e: SyntheticEvent, role: OrganizationRoleListItemInterface): void => {
                    onListItemClick && onListItemClick(e, role);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                // transparent={ !isLoading && showPlaceholders() !== null }
                data-testid={ testId }
            />
            { deletingOrganizationRole && (
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="warning"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t(
                        "console:manage.features.roles.list.confirmations.deleteItem.assertionHint"
                    ) }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowDeleteConfirmationModal(false);
                        setAlert(null);
                    } }
                    onPrimaryActionClick={ (): void => handleOrganizationDelete(deletingOrganizationRole.id) }
                    data-testid={ `${testId}-delete-confirmation-modal` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-testid={ `${testId}-delete-org-role-confirmation-modal-header` }>
                        { t("console:manage.features.roles.list.confirmations.deleteItem.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-testid={ `${testId}-delete-org-role-confirmation-modal-message` }
                    >
                        { t("console:manage.features.roles.list.confirmations.deleteItem.message",
                            { type: "role" }) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-testid={ `${testId}-delete-confirmation-modal-content` }>
                        <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                        { t("console:manage.features.roles.list.confirmations.deleteItem.content",
                            { type: "role" }) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

/**
 * Default props for the component.
 */
OrganizationRoleList.defaultProps = {
    "data-componentid": "organization-roles",
    "data-testid": "organization-role-list",
    selection: true,
    showListItemActions: true
};
