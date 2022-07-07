/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
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
import { Header, Icon, Popup, SemanticICONS } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    history
} from "../../core";
import { getEmptyPlaceholderIllustrations } from "../../core/configs/ui";
import { deleteOrganization } from "../api";
import { OrganizationIcon } from "../configs";
import { OrganizationManagementConstants } from "../constants";
import { OrganizationInterface, OrganizationListInterface } from "../models";

/**
 *
 * Proptypes for the organizations list component.
 */
export interface OrganizationListPropsInterface
    extends LoadableComponentInterface,
    IdentifiableComponentInterface {
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Organization list.
     */
    list: OrganizationListInterface;
    /**
     * On organization delete callback.
     */
    onOrganizationDelete?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, organization: OrganizationInterface) => void;
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

/**
 * Organization list component.
 *
 * @param {OrganizationListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OrganizationList: FunctionComponent<OrganizationListPropsInterface> = (
    props: OrganizationListPropsInterface
): ReactElement => {
    const {
        defaultListItemLimit,
        isLoading,
        list,
        onOrganizationDelete,
        onListItemClick,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        isSetStrongerAuth,
        isRenderedOnPortal,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);


    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingOrganization, setDeletingOrganization ] = useState<OrganizationInterface>(undefined);

    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Redirects to the organizations edit page when the edit button is clicked.
     *
     * @param {string} organizationId - Organization id.
     */
    const handleOrganizationEdit = (organizationId: string): void => {
        history.push({
            pathname: AppConstants.getPaths()
                .get("ORGANIZATION_UPDATE")
                .replace(":id", organizationId)
        });
    };

    /**
     * Deletes an organization when the delete organization button is clicked.
     *
     * @param {string} organizationId - Organization id.
     */
    const handleOrganizationDelete = (organizationId: string): void => {
        deleteOrganization(organizationId)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.success" +
                            ".description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.success.message"
                        )
                    })
                );

                setShowDeleteConfirmationModal(false);
                onOrganizationDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        setAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications.deleteOrganization.error" +
                                ".message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    setAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.genericError" +
                            ".message"
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
                render: (organization: OrganizationInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <GenericIcon
                                bordered
                                defaultIcon
                                relaxed="very"
                                size="micro"
                                shape="rounded"
                                spaced="right"
                                hoverable={ false }
                                icon={ OrganizationIcon }
                            />
                            { organization.id === OrganizationManagementConstants.ROOT_ORGANIZATION_ID
                               && (< Header.Content >
                                   <Icon
                                       className="mr-2 ml-0 vertical-aligned-baseline"
                                       size="small"
                                       name="circle"
                                       color="green"
                                   />
                               </Header.Content>)
                            }
                            <Header.Content>
                                { organization.name }
                                <Header.Subheader
                                    className="truncate ellipsis"
                                    data-componentid={ `${ componentId }-item-sub-heading` }
                                >
                                    { organization.ref?.length > 80 ? (
                                        <Popup
                                            content={ organization.ref }
                                            trigger={ <span>{ organization.ref }</span> }
                                        />
                                    ) : (
                                        organization.ref
                                    ) }
                                </Header.Subheader>
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
                "data-componentid": `${ componentId }-item-edit-button`,
                hidden: (): boolean =>
                    !isFeatureEnabled(
                        featureConfig?.organizations,
                        OrganizationManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_UPDATE")
                    ),
                icon: (): SemanticICONS => {
                    return !hasRequiredScopes(
                        featureConfig?.organizations,
                        featureConfig?.organizations?.scopes?.update,
                        allowedScopes
                    )
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, organization: OrganizationInterface): void =>
                    handleOrganizationEdit(organization.id),
                popupText: (): string => {
                    return !hasRequiredScopes(
                        featureConfig?.organizations,
                        featureConfig?.organizations?.scopes?.update,
                        allowedScopes
                    )
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-delete-button`,
                hidden: () => {
                    return !hasRequiredScopes(
                        featureConfig?.organizations,
                        featureConfig?.organizations?.scopes?.delete,
                        allowedScopes
                    );
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, organization: OrganizationInterface): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingOrganization(organization);
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
        if (searchQuery && (isEmpty(list) || list?.organizations?.length === 0)) {
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
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        // When the search returns empty.
        if (isEmpty(list) || list?.organizations?.length === 0) {
            return (
                <EmptyPlaceholder
                    className={ !isRenderedOnPortal ? "list-placeholder" : "" }
                    action={
                        onEmptyListPlaceholderActionClick && (
                            <Show when={ AccessControlConstants.ORGANIZATION_WRITE }>
                                <PrimaryButton
                                    onClick={ () => {
                                        eventPublisher.publish(componentId + "-click-new-organization-button");
                                        onEmptyListPlaceholderActionClick();
                                    } }
                                >
                                    <Icon name="add" />
                                    { t("console:manage.features.organizations.placeholders.emptyList.action") }
                                </PrimaryButton>
                            </Show>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ t("console:manage.features.organizations.placeholders.emptyList.subtitles.0") ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<OrganizationInterface>
                className="organizations-table"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ !isSetStrongerAuth && resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list?.organizations }
                onRowClick={ (e: SyntheticEvent, organization: OrganizationInterface): void => {
                    onListItemClick && onListItemClick(e, organization);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && showPlaceholders() !== null }
                data-componentid={ componentId }
            />
            { deletingOrganization && (
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="warning"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t(
                        "console:manage.features.organizations.confirmations.deleteOrganization." + "assertionHint"
                    ) }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowDeleteConfirmationModal(false);
                        setAlert(null);
                    } }
                    onPrimaryActionClick={ (): void => handleOrganizationDelete(deletingOrganization.id) }
                    data-componentid={ `${ componentId }-delete-confirmation-modal` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${ componentId }-delete-confirmation-modal-header` }>
                        { t("console:manage.features.organizations.confirmations.deleteOrganization.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        warning
                        data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
                    >
                        { t("console:manage.features.organizations.confirmations.deleteOrganization.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-delete-confirmation-modal-content` }>
                        <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                        { t("console:manage.features.organizations.confirmations.deleteOrganization.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

/**
 * Default props for the component.
 */
OrganizationList.defaultProps = {
    "data-componentid": "organization-list",
    selection: true,
    showListItemActions: true
};
