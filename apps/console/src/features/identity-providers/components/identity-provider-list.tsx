/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    ContentLoader,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Header, Icon, Label, List, SemanticICONS } from "semantic-ui-react";
import { handleIDPDeleteError } from "./utils";
import { getApplicationDetails } from "../../applications/api";
import { ApplicationBasicInterface } from "../../applications/models";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { deleteIdentityProvider, getIDPConnectedApps } from "../api";
import { IdentityProviderManagementConstants } from "../constants";
import {
    ConnectedAppInterface,
    ConnectedAppsInterface,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface,
    StrictIdentityProviderInterface
} from "../models";

/**
 * Proptypes for the identity provider list component.
 */
interface IdentityProviderListPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * IdP list.
     */
    list: IdentityProviderListResponseInterface;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On IdP delete callback.
     */
    onIdentityProviderDelete?: () => void;
    /**
     * On list item select callback.
     * @param event - Click event.
     * @param idp - Selected IDP
     */
    onListItemClick?: (event: SyntheticEvent, idp: IdentityProviderInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
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
}

/**
 * Identity provider list component.
 *
 * @param props - Props injected to the component.
 * @returns Identity Provider List component.
 */
export const IdentityProviderList: FunctionComponent<IdentityProviderListPropsInterface> = (
    props: IdentityProviderListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        isLoading,
        list,
        onEmptyListPlaceholderActionClick,
        onIdentityProviderDelete,
        onListItemClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingIDP, setDeletingIDP ] = useState<StrictIdentityProviderInterface>(undefined);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [ showDeleteErrorDueToConnectedAppsModal, setShowDeleteErrorDueToConnectedAppsModal ] =
        useState<boolean>(false);
    const [ loading, setLoading ] = useState(false);
    const [ isAppsLoading, setIsAppsLoading ] = useState(true);

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    /**
     * Redirects to the identity provider edit page when the edit button is clicked.
     *
     * @param idpId - Identity provider id.
     */
    const handleIdentityProviderEdit = (idpId: string): void => {
        history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", idpId));
    };

    /**
     * Deletes an identity provider when the delete identity provider button is clicked.
     *
     * @param idpId - Identity provider id.
     */
    const handleIdentityProviderDeleteAction = (idpId: string): void => {

        setIsAppsLoading(true);
        getIDPConnectedApps(idpId)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    setDeletingIDP(list.identityProviders.find(idp => idp.id === idpId));
                    setShowDeleteConfirmationModal(true);
                } else {
                    setShowDeleteErrorDueToConnectedAppsModal(true);
                    const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
                        return getApplicationDetails(app.appId);
                    });

                    const results: ApplicationBasicInterface[] = await Promise.all(
                        appRequests.map(response => response.catch(error => {
                            dispatch(addAlert({
                                description: error?.description
                                    || "Error occurred while trying to retrieve connected applications.",
                                level: AlertLevels.ERROR,
                                message: error?.message || "Error Occurred."
                            }));
                        }))
                    );

                    const appNames: string[] = [];

                    results.forEach((app) => {
                        appNames.push(app.name);
                    });
                    setConnectedApps(appNames);
                }
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.description
                        || "Error occurred while trying to retrieve connected applications.",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Error Occurred."
                }));
            })
            .finally(() => {
                setIsAppsLoading(false);
            });
    };

    /**
     * Deletes an identity provider when the delete identity provider button is clicked.
     *
     * @param idpId - Identity provider id.
     */
    const handleIdentityProviderDelete = (idpId: string): void => {

        setLoading(true);
        deleteIdentityProvider(idpId)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.deleteIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.deleteIDP.success.message")
                }));
            })
            .catch((error) => {
                handleIDPDeleteError(error);
            })
            .finally(() => {
                setLoading(false);
                setShowDeleteConfirmationModal(false);
                setDeletingIDP(undefined);
                onIdentityProviderDelete();
            });
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns Placeholder.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>Clear search query</LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.features.idp.placeHolders.emptyIDPSearchResults.title") }
                    subtitle={ [
                        t("console:develop.features.idp.placeHolders.emptyIDPSearchResults.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("console:develop.features.idp.placeHolders.emptyIDPSearchResults.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    className="list-placeholder"
                    action={ onEmptyListPlaceholderActionClick && (
                        <Show when={ AccessControlConstants.IDP_WRITE }>
                            <PrimaryButton
                                onClick={ onEmptyListPlaceholderActionClick }
                            >
                                <Icon name="add"/>
                                { t("console:develop.features.idp.buttons.addIDP") }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("console:develop.features.idp.placeHolders.emptyIDPList.subtitles.0")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table columns.
     *
     * @returns Data Table Columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (idp: IdentityProviderInterface): ReactNode => {
                    const isOrgIdp = (idp.federatedAuthenticators.defaultAuthenticatorId ===
                        IdentityProviderManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID);

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${testId}-item-heading` }
                        >
                            {
                                idp.image
                                    ? (
                                        <AppAvatar
                                            size="mini"
                                            name={ idp.name }
                                            image={ idp.image }
                                            spaced="right"
                                            data-testid={ `${testId}-item-image` }
                                        />
                                    )
                                    : (
                                        <AppAvatar
                                            image={ (
                                                <AnimatedAvatar
                                                    name={ idp.name }
                                                    size="mini"
                                                    data-testid={ `${testId}-item-image-inner` }
                                                />
                                            ) }
                                            size="mini"
                                            spaced="right"
                                            data-testid={ `${testId}-item-image` }
                                        />
                                    )
                            }
                            <Header.Content>
                                { idp.name }
                                {
                                    isOrgIdp && (
                                        <Label
                                            size="mini"
                                            color="teal">
                                            Organization IDP
                                        </Label>
                                    )
                                }
                                <Header.Subheader data-testid={ `${testId}-item-sub-heading` }>
                                    { idp.description }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:develop.features.idp.list.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:develop.features.idp.list.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns Data Table Actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                "data-testid": `${ testId }-item-edit-button`,
                hidden: (): boolean => false,
                icon: (): SemanticICONS =>
                    hasRequiredScopes(featureConfig?.identityProviders,
                        featureConfig?.identityProviders?.scopes?.update, allowedScopes)
                        ? "pencil alternate"
                        : "eye",
                onClick: (e: SyntheticEvent, idp: IdentityProviderInterface): void =>
                    handleIdentityProviderEdit(idp.id),
                popupText: (): string =>
                    hasRequiredScopes(featureConfig?.identityProviders,
                        featureConfig?.identityProviders?.scopes?.update, allowedScopes)
                        ? t("common:edit")
                        : t("common:view"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${ testId }-item-delete-button`,
                hidden: (idp: IdentityProviderInterface): boolean =>
                    IdentityProviderManagementConstants.DELETING_FORBIDDEN_IDPS.includes(idp.name)
                    || !hasRequiredScopes(featureConfig?.identityProviders,
                        featureConfig?.identityProviders?.scopes?.delete, allowedScopes),
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, idp: IdentityProviderInterface): void =>
                    handleIdentityProviderDeleteAction(idp.id),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <>
            <DataTable<IdentityProviderInterface>
                className="identity-providers-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions()  }
                columns={ resolveTableColumns() }
                data={ list?.identityProviders?.filter((idp: IdentityProviderInterface) => idp.name !== "LOCAL") }
                onRowClick={ (e: SyntheticEvent, idp: IdentityProviderInterface): void => {
                    handleIdentityProviderEdit(idp.id);
                    onListItemClick && onListItemClick(e, idp);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                deletingIDP && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingIDP?.name }
                        assertionHint={ t("console:develop.features.authenticationProvider."+
                        "confirmations.deleteIDP.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleIdentityProviderDelete(deletingIDP.id) }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                            { t("console:develop.features.idp.confirmations.deleteIDP.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("console:develop.features.idp.confirmations.deleteIDP.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                            { t("console:develop.features.idp.confirmations.deleteIDP.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showDeleteErrorDueToConnectedAppsModal && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                        type="negative"
                        open={ showDeleteErrorDueToConnectedAppsModal }
                        secondaryAction={ t("common:close") }
                        onSecondaryActionClick={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                        data-testid={ `${ testId }-delete-idp-confirmation` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-delete-idp-confirmation` }>
                            { t("console:develop.features.idp.confirmations.deleteIDPWithConnectedApps.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${ testId }-delete-idp-confirmation` }
                        >
                            { t("console:develop.features.idp.confirmations.deleteIDPWithConnectedApps.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                            { t("console:develop.features.idp.confirmations.deleteIDPWithConnectedApps.content") }
                            <Divider hidden />
                            <List ordered className="ml-6">
                                {
                                    isAppsLoading ? (
                                        <ContentLoader/>
                                    ) :
                                        connectedApps?.map((app, index) => {
                                            return (
                                                <List.Item key={ index }>{ app }</List.Item>
                                            );
                                        })
                                }
                            </List>
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default proptypes for the IDP list.
 */
IdentityProviderList.defaultProps = {
    "data-testid": "idp-list",
    selection: true,
    showListItemActions: true
};
