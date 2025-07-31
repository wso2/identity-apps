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

import { FeatureAccessConfigInterface, Show, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
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
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, Label } from "semantic-ui-react";
import { WebhookListInterface, WebhookListItemInterface, WebhookStatus } from "../models/webhooks";
import "./webhook-list.scss";

export interface WebhookListPropsInterface extends IdentifiableComponentInterface {
    /**
     * Advanced search component.
     */
    advancedSearch?: ReactElement;
    /**
     * Feature configuration.
     */
    featureConfig?: FeatureConfigInterface;
    /**
     * Is the list loading.
     */
    isLoading?: boolean;
    /**
     * Webhook list.
     */
    list: WebhookListInterface;
    /**
     * Specifies whether the WebSub Hub adapter mode is enabled.
     */
    isWebSubHubAdapterMode?: boolean;
    /**
     * Callback for webhook deletion.
     */
    onWebhookDelete: (webhook: WebhookListItemInterface) => void;
    /**
     * Callback for webhook edit.
     */
    onWebhookEdit: (webhook: WebhookListItemInterface) => void;
    /**
     * Callback for empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Callback for search query clear.
     */
    onSearchQueryClear?: () => void;
    /**
     * Search query.
     */
    searchQuery?: string;
}

/**
 * Webhook list component.
 *
 * @param props - Props injected to the component.
 * @returns Webhook list component.
 */
const WebhookList: FunctionComponent<WebhookListPropsInterface> = ({
    isLoading,
    list,
    isWebSubHubAdapterMode,
    onWebhookDelete,
    onWebhookEdit,
    onEmptyListPlaceholderActionClick,
    onSearchQueryClear,
    searchQuery,
    ["data-componentid"]: _componentId = "webhook-list"
}: WebhookListPropsInterface & { ["data-componentid"]?: string }): ReactElement => {
    const { t } = useTranslation();

    const webhooksFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.webhooks
    );

    const hasWebhookUpdatePermissions: boolean = useRequiredScopes(webhooksFeatureConfig?.scopes?.update);
    const hasWebhookDeletePermissions: boolean = useRequiredScopes(webhooksFeatureConfig?.scopes?.delete);
    const hasWebhookCreatePermissions: boolean = useRequiredScopes(webhooksFeatureConfig?.scopes?.create);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingWebhook, setDeletingWebhook ] = useState<WebhookListItemInterface | undefined>(undefined);

    /**
     * Redirects to the webhook edit page when the edit webhook is clicked.
     *
     * @param webhook - Webhook object.
     */
    const handleWebhookEdit = (webhook: WebhookListItemInterface): void => {
        onWebhookEdit(webhook);
    };

    /**
     * Deletes a webhook when the delete webhook button is clicked.
     *
     * @param webhook - Webhook which needs to be deleted.
     */
    const handleWebhookDelete = (webhook: WebhookListItemInterface): void => {
        if (!hasWebhookDeletePermissions) {
            return;
        }

        setDeletingWebhook(webhook);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Handles the webhook delete confirmation.
     */
    const handleWebhookDeleteConfirm = (): void => {
        if (!hasWebhookDeletePermissions) {
            return;
        }

        onWebhookDelete(deletingWebhook);
        setShowDeleteConfirmationModal(false);
        setDeletingWebhook(undefined);
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (webhook: WebhookListItemInterface): ReactNode => (
                    <Header image as="h6" className="header-with-icon">
                        <AppAvatar
                            image={ <AnimatedAvatar name={ webhook.name } size="mini" /> }
                            size="mini"
                            spaced="right"
                        />
                        <Header.Content>
                            <div className="webhook-name">{ webhook.name }</div>
                            <Header.Subheader className="webhook-endpoint">{ webhook.endpoint }</Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("webhooks:pages.list.columns.webhook")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "isActive",
                id: "status",
                key: "status",
                render: (webhook: WebhookListItemInterface): ReactNode => {
                    const isActive: boolean =
                        webhook.status === WebhookStatus.ACTIVE || webhook.status === WebhookStatus.PARTIALLY_ACTIVE;
                    const labelText: string = isActive
                        ? t("webhooks:common.status.active")
                        : t("webhooks:common.status.inactive");

                    return (
                        <Label
                            size="mini"
                            color={ isActive ? undefined : "grey" }
                            className={ `compact-label ${isActive ? "webhook-status-label active" : ""}` }
                        >
                            { labelText }
                        </Label>
                    );
                },
                textAlign: "center",
                title: t("webhooks:pages.list.columns.status")
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
     * Resolves data table actions based on permissions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [];

        actions.push({
            "data-componentid": `${_componentId}-item-edit-button`,
            icon: () => (hasWebhookUpdatePermissions ? "pencil alternate" : "eye"),
            onClick: (e: React.SyntheticEvent<Element, Event>, item: Record<string, any>): void => {
                const webhook: WebhookListItemInterface = item as WebhookListItemInterface;

                handleWebhookEdit(webhook);
            },
            popupText: (): string => (hasWebhookUpdatePermissions ? t("common:edit") : t("common:view")),
            renderer: "semantic-icon"
        });

        const isDeleteEnabled = (webhook: WebhookListItemInterface): boolean => {
            if (!isWebSubHubAdapterMode) {

                return true;
            }

            return webhook?.status === WebhookStatus.INACTIVE || webhook?.status === WebhookStatus.PARTIALLY_INACTIVE;
        };

        if (hasWebhookDeletePermissions) {
            actions.push({
                "data-componentid": `${_componentId}-item-delete-button`,
                hidden: (item: Record<string, any>): boolean => {
                    const webhook: WebhookListItemInterface = item as WebhookListItemInterface;

                    return !isDeleteEnabled(webhook);
                },
                icon: () => "trash alternate",
                onClick: (e: React.SyntheticEvent<Element, Event>, item: Record<string, any>): void => {
                    const webhook: WebhookListItemInterface = item as WebhookListItemInterface;

                    handleWebhookDelete(webhook);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            });
        }

        return actions;
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns Placeholder component.
     */
    const showPlaceholders = (): ReactElement => {
        if (searchQuery && list?.webhooks?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={
                        (<LinkButton onClick={ onSearchQueryClear }>
                            { t("console:develop.placeholders.emptySearchResult.action") }
                        </LinkButton>)
                    }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:develop.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-componentid={ `${_componentId}-empty-search-placeholder` }
                />
            );
        }

        if (list?.totalResults === 0 && !isLoading) {
            return (
                <EmptyPlaceholder
                    action={
                        (<Show when={ webhooksFeatureConfig?.scopes?.create }>
                            <PrimaryButton
                                onClick={ onEmptyListPlaceholderActionClick }
                                disabled={ !hasWebhookCreatePermissions }
                            >
                                <Icon name="add" />
                                { t("webhooks:pages.list.buttons.add") }
                            </PrimaryButton>
                        </Show>)
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ t("webhooks:pages.list.emptyList.subHeading") ] }
                    data-componentid={ `${_componentId}-empty-list-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<WebhookListItemInterface>
                className="webhooks-table"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: 10,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list?.webhooks }
                onRowClick={ (e: React.SyntheticEvent<Element, Event>, item: WebhookListItemInterface): void => {
                    handleWebhookEdit(item);
                } }
                placeholders={ showPlaceholders() }
                showHeader={ true }
                transparent={ !isLoading && showPlaceholders() !== null }
                data-componentid={ `${_componentId}-data-table` }
            />
            { deletingWebhook && hasWebhookDeletePermissions && (
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertion={ deletingWebhook.name }
                    assertionHint={ t("webhooks:confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowDeleteConfirmationModal(false);
                        setDeletingWebhook(undefined);
                    } }
                    onPrimaryActionClick={ (): void => handleWebhookDeleteConfirm() }
                    closeOnDimmerClick={ false }
                    data-componentid={ `${_componentId}-delete-confirmation-modal` }
                >
                    <ConfirmationModal.Header data-componentid={ `${_componentId}-delete-confirmation-modal-header` }>
                        { t("webhooks:confirmations.delete.heading") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${_componentId}-delete-confirmation-modal-message` }
                    >
                        { t("webhooks:confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content data-componentid={ `${_componentId}-delete-confirmation-modal-content` }>
                        { t("webhooks:confirmations.delete.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default WebhookList;
