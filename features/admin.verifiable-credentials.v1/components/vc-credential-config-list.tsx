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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
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
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { deleteVCCredentialConfiguration } from "../api/verifiable-credentials";
import { VCCredentialConfigurationListItem } from "../models/verifiable-credentials";

interface VCCredentialConfigListProps extends IdentifiableComponentInterface {
    advancedSearch: ReactNode;
    isLoading: boolean;
    mutateConfigList: () => void;
    list: VCCredentialConfigurationListItem[];
    onSearchQueryClear?: () => void;
    searchQuery?: string;
    setShowAddConfigWizard: () => void;
}

/**
 * Verifiable Credentials configuration list component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const VCCredentialConfigList = ({
    advancedSearch,
    isLoading,
    list,
    mutateConfigList,
    onSearchQueryClear: _onSearchQueryClear,
    searchQuery: _searchQuery,
    setShowAddConfigWizard,
    ["data-componentid"]: componentId
}: VCCredentialConfigListProps): ReactElement => {
    const dispatch: any = useDispatch();
    const { t } = useTranslation();

    const [ showDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedConfig, setCurrentDeletedConfig ] = useState<VCCredentialConfigurationListItem>();

    /**
     * Handles configuration deletion.
     *
     * @param config - Configuration to be deleted.
     */
    const handleConfigDelete = (config: VCCredentialConfigurationListItem): void => {
        deleteVCCredentialConfiguration(config.id)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "verifiableCredentials:notifications.deleteConfig.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t("verifiableCredentials:notifications.deleteConfig.success.message")
                    })
                );
                mutateConfigList();
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "verifiableCredentials:notifications.deleteConfig.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t("verifiableCredentials:notifications.deleteConfig.error.message")
                    })
                );
            });
    };

    /**
     * Resolves table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-testid": `${componentId}-item-edit-button`,
                hidden: (): boolean => false,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_e: SyntheticEvent, config: VCCredentialConfigurationListItem): void =>
                    history.push(
                        AppConstants.getPaths().get("VC_CONFIG_EDIT").replace(":id", config.id)
                    ),
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${componentId}-item-delete-button`,
                hidden: (): boolean => false,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_e: SyntheticEvent, config: VCCredentialConfigurationListItem): void => {
                    setCurrentDeletedConfig(config);
                    setShowDeleteConfirmationModal(true);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
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
                dataIndex: "displayName",
                id: "displayName",
                key: "displayName",
                render: (config: VCCredentialConfigurationListItem): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${componentId}-item-heading` }
                        >
                            <AppAvatar
                                image={
                                    (<AnimatedAvatar
                                        name={ config.displayName }
                                        size="mini"
                                        data-testid={ `${componentId}-item-avatar` }
                                    />)
                                }
                                size="mini"
                                spaced="right"
                                data-testid={ `${componentId}-item-image` }
                            />
                            <Header.Content>
                                { config.displayName }
                                <Header.Subheader>
                                    <Label size="mini" className="compact">
                                        { config.scope }
                                    </Label>
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("verifiableCredentials:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "identifier",
                id: "identifier",
                key: "identifier",
                render: (config: VCCredentialConfigurationListItem): ReactNode => {
                    return <div>{ config.identifier }</div>;
                },
                title: t("verifiableCredentials:list.columns.identifier")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("verifiableCredentials:list.columns.actions")
            }
        ];
    };

    /**
     * Shows placeholder when there are no configurations.
     *
     * @returns React element.
     */
    const showPlaceholders = (): ReactElement => {
        if (!list || list?.length === 0) {
            return (
                <EmptyPlaceholder
                    className="list-placeholder mr-0"
                    action={
                        (<PrimaryButton
                            data-testid={ `${componentId}-empty-placeholder-add-button` }
                            onClick={ () => setShowAddConfigWizard() }
                        >
                            <Icon name="add" />
                            { t("verifiableCredentials:buttons.addConfig") }
                        </PrimaryButton>)
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ t("verifiableCredentials:placeholders.emptyList.subtitle") ] }
                    data-testid={ `${componentId}-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<VCCredentialConfigurationListItem>
                className="vc-configs-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ (_e: SyntheticEvent, config: VCCredentialConfigurationListItem): void => {
                    history.push(
                        AppConstants.getPaths().get("VC_CONFIG_EDIT").replace(":id", config.id)
                    );
                } }
                placeholders={ showPlaceholders() }
                selectable={ true }
                showHeader={ false }
                transparent={ !isLoading && showPlaceholders() !== null }
                data-testid={ componentId }
            />
            { showDeleteConfirmation && (
                <ConfirmationModal
                    data-testid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmation }
                    assertionHint={ t("verifiableCredentials:list.confirmations.deleteItem.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        handleConfigDelete(currentDeletedConfig);
                        setShowDeleteConfirmationModal(false);
                    } }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("verifiableCredentials:list.confirmations.deleteItem.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("verifiableCredentials:list.confirmations.deleteItem.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("verifiableCredentials:list.confirmations.deleteItem.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};
