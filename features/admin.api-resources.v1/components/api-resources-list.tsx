/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { AppState, UIConstants, getEmptyPlaceholderIllustrations, history } from "@wso2is/admin.core.v1";
import { ExtendedFeatureConfigInterface } from "@wso2is/admin.extensions.v1/configs/models";
import { deleteAPIResource } from "../api";
import { APIResourcesConstants } from "../constants";
import { APIResourceInterface } from "../models";
import { APIResourceUtils } from "../utils/api-resource-utils";

/**
 * Prop types for the API resources list component.
 */
interface APIResourcesListProps extends SBACInterface<ExtendedFeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * List of API Resources
     */
    apiResourcesList: APIResourceInterface[];
    /**
     * show if API resources list is still loading
     */
    isAPIResourcesListLoading: boolean;
    /**
     * Show add API wizard.
     */
    setShowAddAPIWizard: (show: boolean) => void;
    /**
     * On API resource delete callback.
     */
    onAPIResourceDelete?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, apiResource: APIResourceInterface) => void;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
}

/**
 * Users info page.
 *
 * @returns The users list table.
 */
export const APIResourcesList: FunctionComponent<APIResourcesListProps> = (
    props: APIResourcesListProps): ReactElement => {
    const {
        apiResourcesList,
        featureConfig,
        isAPIResourcesListLoading,
        setShowAddAPIWizard,
        onAPIResourceDelete,
        onListItemClick,
        showListItemActions,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingAPIResource, setDeletingAPIResource ] = useState<APIResourceInterface>(undefined);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    /**
     * Resolves data table columns.
     *
     * @returns TableColumnInterface[]
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (apiResource: APIResourceInterface): ReactNode => {

                    const displayName: string = apiResource ? apiResource.displayName : "";
                    const gwName: string = apiResource ? apiResource.gwName : "";
                    let shownName: string;

                    if (displayName && displayName !== "") {
                        shownName = displayName;
                    } else if (gwName && gwName !== "") {
                        shownName = gwName;
                    } else {
                        shownName = "";
                    }

                    return (
                        <Header
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${componentId}-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ shownName }
                                        size="mini"
                                        data-testid={ `${componentId}-item-display-name-avatar` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${componentId}-item-display-name` }
                            />
                            <Header.Content>
                                { shownName }
                                <Header.Subheader>
                                    {
                                        APIResourceUtils.checkIfAPIResourceManagedByChoreo(apiResource.gwName) && (
                                            <Label
                                                size="mini"
                                                className="choreo-label ml-0"
                                            >
                                                { t("extensions:develop.apiResource.managedByChoreoText") }
                                            </Label>
                                        )
                                    }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("extensions:develop.apiResource.table.name.column")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "identifier",
                id: "identifier",
                key: "identifier",
                render: (apiResource: APIResourceInterface): ReactNode => {
                    const identifier: string = apiResource ? apiResource.identifier : "";
                    let shownIdentifier: string = "";
                    const shownIdentifierClass: string = "client-id-label";

                    if (identifier && identifier !== "") {
                        shownIdentifier = identifier;
                    }

                    return (
                        <Header as="h6" data-testid={ `${componentId}-col-2-item-heading` }>
                            <Header.Content>
                                <Header.Subheader data-testid={ `${componentId}-col-2-item-sub-heading` }>
                                    { shownIdentifier }
                                    {
                                        shownIdentifier && (
                                            <Label
                                                pointing="left"
                                                size="mini"
                                                className={ shownIdentifierClass }
                                            >
                                                { t("extensions:develop.apiResource.table.identifier.label") }
                                            </Label>
                                        )
                                    }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("extensions:develop.apiResource.table.identifier.column")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("extensions:develop.apiResource.table.actions.column")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns TableActionsInterface[]
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                "data-componentid": `${componentId}-item-edit-button`,
                hidden: () => {
                    const hasScopesRead: boolean = !hasRequiredScopes(featureConfig?.apiResources,
                        featureConfig?.apiResources?.scopes?.read, allowedScopes);

                    const hasScopesUpdate: boolean = !hasRequiredScopes(featureConfig?.apiResources,
                        featureConfig?.apiResources?.scopes?.update, allowedScopes);

                    return hasScopesUpdate || hasScopesRead;
                },
                icon: (): SemanticICONS => {
                    return !hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.update, allowedScopes)
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, apiResource: APIResourceInterface): void => {
                    handleAPIResourceEdit(apiResource, e);
                },
                popupText: (): string => {
                    return !hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.update, allowedScopes)
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${componentId}-item-delete-button`,
                hidden: () => {
                    const hasScopes: boolean = !hasRequiredScopes(featureConfig?.apiResources,
                        featureConfig?.apiResources?.scopes?.delete, allowedScopes);

                    return hasScopes;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, apiResource: APIResourceInterface): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingAPIResource(apiResource);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement => {
        if ((!apiResourcesList) || (apiResourcesList && apiResourcesList.length === 0)) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    action={ (
                        <PrimaryButton
                            data-testid={ `${ componentId }-empty-placeholder-add-api-resource-button` }
                            onClick={ () => setShowAddAPIWizard(true) }
                        >
                            <Icon name="add" />
                            { t("extensions:develop.apiResource.addApiResourceButton") }
                        </PrimaryButton>
                    ) }
                    imageSize="tiny"
                    subtitle={ [ t("extensions:develop.apiResource.empty") ] }
                    data-testid={ `${componentId}-empty-search-placeholder-icon` }
                />
            );
        }

        return null;
    };

    /**
     * Deletes an API resource when the delete API resource button is clicked.
     *
     * @param apiResourceId - API resource ID.
     */
    const handleAPIResourceDelete = (apiResourceId: string): void => {

        setLoading(true);
        deleteAPIResource(apiResourceId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.deleteAPIResource.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.apiResource.notifications.deleteAPIResource.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                if (onAPIResourceDelete) {
                    onAPIResourceDelete();
                }
            })
            .catch((error: IdentityAppsApiException) => {
                switch (error?.code) {
                    case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".unauthorizedError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".unauthorizedError.message")
                        }));

                        break;

                    case APIResourcesConstants.NO_VALID_API_RESOURCE_ID_FOUND:
                    case APIResourcesConstants.API_RESOURCE_NOT_FOUND:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".notFoundError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".notFoundError.message")
                        }));

                        break;

                    default:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.deleteAPIResource" +
                                ".genericError.message")
                        }));
                }
            })
            .finally(() => {
                setLoading(false);
                setDeletingAPIResource(undefined);
            });
    };

    /**
     * Redirects to the API resource edit page
     *
     */
    const handleAPIResourceEdit = (apiResource: APIResourceInterface, e: SyntheticEvent<Element, Event>): void => {
        history.push(APIResourcesConstants.getPaths().get("API_RESOURCE_EDIT").replace(":id", apiResource.id));
        onListItemClick && onListItemClick(e, apiResource);
    };

    return (
        <>
            <DataTable<APIResourceInterface>
                className="api-resources-table"
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                showHeader={ false }
                data-componentid={ componentId }
                data-testid={ componentId }
                columns={ resolveTableColumns() }
                placeholders={ showPlaceholders() }
                actions={ resolveTableActions() }
                data={ apiResourcesList }
                transparent={ isAPIResourcesListLoading || showPlaceholders() !== null }
                isLoading={ isAPIResourcesListLoading }
                onRowClick={ function (e: SyntheticEvent<Element, Event>, apiResource: APIResourceInterface): void {
                    handleAPIResourceEdit(apiResource, e);
                } }
            />
            {
                deletingAPIResource && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("extensions:develop.apiResource.confirmations.deleteAPIResource." +
                            "assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                        } }
                        onPrimaryActionClick={ (): void => handleAPIResourceDelete(deletingAPIResource.id) }
                        data-testid={ `${componentId}-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${componentId}-delete-confirmation-modal-header` }
                        >
                            { t("extensions:develop.apiResource.confirmations.deleteAPIResource.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("extensions:develop.apiResource.confirmations.deleteAPIResource.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            { t("extensions:develop.apiResource.confirmations.deleteAPIResource.content") }
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
APIResourcesList.defaultProps = {
    "data-componentid": "api-resources",
    showListItemActions: true
};
