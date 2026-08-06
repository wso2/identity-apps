/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    ContentLoader,
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Header, Icon, List, SemanticICONS } from "semantic-ui-react";
import { Dispatch } from "redux";
import { deletePresentationDefinition, getConnectedConnections } from "../api/presentation-definitions";
import {
    ConnectedConnectionsResponseInterface,
    PresentationDefinitionListItem
} from "../models/presentation-definitions";

interface PresentationDefinitionListProps extends IdentifiableComponentInterface {
    isLoading: boolean;
    list: PresentationDefinitionListItem[];
    mutateList: () => void;
    onAddClick: () => void;
    searchQuery?: string;
    onSearchQueryClear?: () => void;
}

/**
 * Presentation Definition list component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const PresentationDefinitionList: FunctionComponent<PresentationDefinitionListProps> = ({
    isLoading,
    list,
    mutateList,
    onAddClick,
    searchQuery,
    onSearchQueryClear,
    "data-componentid": componentId = "presentation-definition-list"
}: PresentationDefinitionListProps): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const presentationDefinitionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.presentationDefinitions
    );

    const hasCreatePermission: boolean = useRequiredScopes(
        presentationDefinitionsFeatureConfig?.scopes?.create
    );
    const hasUpdatePermission: boolean = useRequiredScopes(
        presentationDefinitionsFeatureConfig?.scopes?.update
    );
    const hasDeletePermission: boolean = useRequiredScopes(
        presentationDefinitionsFeatureConfig?.scopes?.delete
    );

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ showDeleteBlockedModal, setShowDeleteBlockedModal ] = useState<boolean>(false);
    const [ currentDeletion, setCurrentDeletion ] = useState<PresentationDefinitionListItem>(null);
    const [ connectedConnectionNames, setConnectedConnectionNames ] = useState<string[]>(undefined);
    const [ isConnectionsLoading, setIsConnectionsLoading ] = useState<boolean>(false);

    const handleDeleteInitiation = (definition: PresentationDefinitionListItem): void => {
        setIsConnectionsLoading(true);
        setCurrentDeletion(definition);
        getConnectedConnections(definition.id)
            .then((response: ConnectedConnectionsResponseInterface) => {
                if (response?.count === 0) {
                    setShowDeleteConfirmation(true);
                } else {
                    setConnectedConnectionNames(
                        (response?.connectedConnections ?? []).map((c) => c.name)
                    );
                    setShowDeleteBlockedModal(true);
                }
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t(
                        "presentationDefinitions:notifications.deleteDefinition.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.deleteDefinition.error.message")
                }));
            })
            .finally(() => setIsConnectionsLoading(false));
    };

    const handleDelete = (definition: PresentationDefinitionListItem): void => {
        deletePresentationDefinition(definition.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("presentationDefinitions:notifications.deleteDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.deleteDefinition.success.message")
                }));
                mutateList();
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("presentationDefinitions:notifications.deleteDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.deleteDefinition.error.message")
                }));
            });
    };

    const resolveTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${componentId}-item-edit-button`,
            hidden: (): boolean => !hasUpdatePermission,
            icon: (): SemanticICONS => "pencil alternate",
            onClick: (_e: SyntheticEvent, definition: PresentationDefinitionListItem): void =>
                history.push(
                    AppConstants.getPaths().get("VP_DEFINITION_EDIT").replace(":id", definition.id)
                ),
            popupText: (): string => t("common:edit"),
            renderer: "semantic-icon"
        },
        {
            "data-componentid": `${componentId}-item-delete-button`,
            hidden: (): boolean => !hasDeletePermission,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_e: SyntheticEvent, definition: PresentationDefinitionListItem): void => {
                handleDeleteInitiation(definition);
            },
            popupText: (): string => t("common:delete"),
            renderer: "semantic-icon"
        }
    ];

    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "name",
            id: "name",
            key: "name",
            render: (definition: PresentationDefinitionListItem): ReactNode => (
                <Header
                    image
                    as="h6"
                    className="header-with-icon"
                    data-componentid={ `${componentId}-item-heading` }
                >
                    <AppAvatar
                        image={
                            (<AnimatedAvatar
                                name={ definition.name }
                                size="mini"
                                data-componentid={ `${componentId}-item-avatar` }
                            />)
                        }
                        size="mini"
                        spaced="right"
                        data-componentid={ `${componentId}-item-image` }
                    />
                    <Header.Content>{ definition.name }</Header.Content>
                </Header>
            ),
            title: t("presentationDefinitions:list.columns.name")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "description",
            id: "description",
            key: "description",
            render: (definition: PresentationDefinitionListItem): ReactNode => (
                <div>{ definition.description || "-" }</div>
            ),
            title: t("presentationDefinitions:list.columns.description")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("presentationDefinitions:list.columns.actions")
        }
    ];

    const showPlaceholders = (): ReactElement => {
        if (!list || list.length === 0) {
            if (searchQuery) {
                return (
                    <EmptyPlaceholder
                        className="list-placeholder mr-0"
                        action={
                            (<PrimaryButton
                                data-componentid={ `${componentId}-empty-search-placeholder-clear-button` }
                                onClick={ onSearchQueryClear }
                            >
                                { t("common:clearSearch") }
                            </PrimaryButton>)
                        }
                        image={ getEmptyPlaceholderIllustrations().emptySearch }
                        imageSize="tiny"
                        subtitle={ [
                            t("presentationDefinitions:placeholders.emptySearch.subtitle1"),
                            t("presentationDefinitions:placeholders.emptySearch.subtitle2")
                        ] }
                        title={ t("presentationDefinitions:placeholders.emptySearch.title") }
                        data-componentid={ `${componentId}-empty-search-placeholder` }
                    />
                );
            }

            return (
                <EmptyPlaceholder
                    className="list-placeholder mr-0"
                    action={
                        (<Show when={ presentationDefinitionsFeatureConfig?.scopes?.create }>
                            <PrimaryButton
                                data-componentid={ `${componentId}-empty-placeholder-add-button` }
                                onClick={ onAddClick }
                            >
                                <Icon name="add" />
                                { t("presentationDefinitions:buttons.addDefinition") }
                            </PrimaryButton>
                        </Show>)
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ t("presentationDefinitions:placeholders.emptyList.subtitle") ] }
                    data-componentid={ `${componentId}-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<PresentationDefinitionListItem>
                className="presentation-definitions-table"
                isLoading={ isLoading }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ (_e: SyntheticEvent, definition: PresentationDefinitionListItem): void => {
                    history.push(
                        AppConstants.getPaths().get("VP_DEFINITION_EDIT").replace(":id", definition.id)
                    );
                } }
                placeholders={ showPlaceholders() }
                selectable={ true }
                showHeader={ false }
                transparent={ !isLoading && showPlaceholders() !== null }
                data-componentid={ componentId }
            />
            { showDeleteConfirmation && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ (): void => setShowDeleteConfirmation(false) }
                    type="negative"
                    open={ showDeleteConfirmation }
                    assertionHint={ t("presentationDefinitions:list.confirmations.deleteItem.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmation(false) }
                    onPrimaryActionClick={ (): void => {
                        handleDelete(currentDeletion);
                        setShowDeleteConfirmation(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("presentationDefinitions:list.confirmations.deleteItem.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("presentationDefinitions:list.confirmations.deleteItem.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("presentationDefinitions:list.confirmations.deleteItem.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { showDeleteBlockedModal && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-blocked-modal` }
                    onClose={ (): void => setShowDeleteBlockedModal(false) }
                    type="negative"
                    open={ showDeleteBlockedModal }
                    secondaryAction={ t("common:close") }
                    onSecondaryActionClick={ (): void => setShowDeleteBlockedModal(false) }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${componentId}-delete-blocked-modal-header` }>
                        { t(
                            "presentationDefinitions:list.confirmations.deleteBlockedByConnections.header",
                            "Unable to Delete"
                        ) }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-delete-blocked-modal-message` }
                    >
                        { t(
                            "presentationDefinitions:list.confirmations.deleteBlockedByConnections.message",
                            "There are connections using this presentation definition."
                        ) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${componentId}-delete-blocked-modal-content` }>
                        { t(
                            "presentationDefinitions:list.confirmations.deleteBlockedByConnections.content",
                            "Remove the associations from these connections before deleting:"
                        ) }
                        <Divider hidden />
                        <List ordered className="ml-6">
                            { isConnectionsLoading ? (
                                <ContentLoader />
                            ) : (
                                connectedConnectionNames?.map((name: string, index: number) => (
                                    <List.Item key={ index }>{ name }</List.Item>
                                ))
                            ) }
                        </List>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};
