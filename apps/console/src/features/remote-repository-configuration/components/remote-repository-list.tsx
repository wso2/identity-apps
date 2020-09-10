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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, SemanticICONS } from "semantic-ui-react";
import { RemoteRepoDetails } from "./remote-repository-details";
import { AppConstants, EmptyPlaceholderIllustrations, UIConstants, history } from "../../core";
import { InterfaceRemoteRepoConfig } from "../models";

interface RemoteRepoListPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Repo objects list.
     */
    repoObjectList: InterfaceRemoteRepoConfig[];
    /**
     * Delete callback.
     * @param {InterfaceRemoteRepoConfig} repoConfig - Deleting repo config.
     */
    handleConfigDelete: (repoConfig: InterfaceRemoteRepoConfig) => void;
    /**
     * Flag to show the create wizard.
     * @param {boolean} state - Show/Hide state.
     */
    showCreateWizard: (state: boolean) => void;
    /**
     * On trigger.
     * @param {InterfaceRemoteRepoConfig} repoConfig
     */
    handleOnTrigger: (repoConfig: InterfaceRemoteRepoConfig) => void;
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
 * Remote repo list.
 *
 * @param {RemoteRepoListPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const RemoteRepoList: FunctionComponent<RemoteRepoListPropsInterface> = (
    props: RemoteRepoListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        isLoading,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const { repoObjectList, handleConfigDelete, showCreateWizard, handleOnTrigger } = props;

    const [ currentDeleteConfig, setCurrentDeleteConfig ] = useState<InterfaceRemoteRepoConfig>();
    const [ currentDetailsConfig, setCurrentDetailsConfig ] = useState<InterfaceRemoteRepoConfig>();
    const [ showConfigDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showConfigDetailsModal, setShowConfigDetailsModal ] = useState<boolean>(false);

    /**
     * Redirects to the identity provider edit page when the edit button is clicked.
     *
     * @param {string} configId - Identity provider id.
     */
    const handleRemoteRepoEdit = (configId: string): void => {
        history.push(AppConstants.PATHS.get("REMOTE_REPO_CONFIG_EDIT").replace(":id", configId));
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        if (!repoObjectList || repoObjectList?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={
                        <PrimaryButton onClick={ () => { showCreateWizard(true) } }>
                            <Icon name="add"/>
                            { t("devPortal:components:remoteConfig:placeholders.emptyList.action") }
                        </PrimaryButton>
                    }
                    title={ t("devPortal:components:remoteConfig:placeholders.emptyList.title") }
                    subtitle={ [
                        t("devPortal:components:remoteConfig:placeholders.emptyList.subtitles.0"),
                        t("devPortal:components:remoteConfig:placeholders.emptyList.subtitles.1"),
                        t("devPortal:components:remoteConfig:placeholders.emptyList.subtitles.2")
                    ] }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                />
            );
        }

        return null;
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
                title: t("devPortal:components.remoteConfig.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "lastDeployed",
                id: "lastDeployed",
                key: "lastDeployed",
                title: t("devPortal:components.remoteConfig.list.columns.lastDeployed")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "successfulDeployments",
                id: "successfulDeployments",
                key: "successfulDeployments",
                title: t("devPortal:components.remoteConfig.list.columns.successfulDeployments")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "failedDeployments",
                id: "failedDeployments",
                key: "failedDeployments",
                title: t("devPortal:components.remoteConfig.list.columns.failedDeployments")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("devPortal:components.remoteConfig.list.columns.actions")
            }
        ]
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return [];
        }

        return [
            {
                icon: (): SemanticICONS => "eye",
                onClick: (e: SyntheticEvent, repo: InterfaceRemoteRepoConfig) => {
                    setCurrentDetailsConfig(repo);
                    setShowConfigDetailsModal(true);
                },
                popupText: (): string => "Trigger Config",
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "retweet",
                onClick: (e: SyntheticEvent, repo: InterfaceRemoteRepoConfig) => handleOnTrigger(repo),
                popupText: (): string => "Trigger Config",
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, repo: InterfaceRemoteRepoConfig) => handleRemoteRepoEdit(repo.id),
                popupText: (): string => "Edit Config",
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, repo: InterfaceRemoteRepoConfig) => {
                    setCurrentDeleteConfig(repo);
                    setShowDeleteConfirmationModal(!showConfigDeleteConfirmation);
                },
                popupText: (): string => "Delete Config",
                renderer: "semantic-icon"
            }
        ]
    };

    return (
        <>
            <DataTable<InterfaceRemoteRepoConfig>
                className="remote-fetch-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ repoObjectList }
                onRowClick={ (e: SyntheticEvent, repo: InterfaceRemoteRepoConfig): void => {
                    handleRemoteRepoEdit(repo.id);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                showConfigDeleteConfirmation && 
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showConfigDeleteConfirmation }
                        assertion={ currentDeleteConfig.name }
                        assertionHint={ 
                            (
                                <p>
                                    <Trans
                                        i18nKey={ "devPortal:components:remoteConfig.list.confirmations.deleteItem." +
                                        "assertionHint" }
                                        tOptions={ { roleName: currentDeleteConfig.name } }
                                    >
                                        Please type <strong>{ currentDeleteConfig.name }</strong> to confirm.
                                    </Trans>
                                </p>
                            )
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => { 
                            handleConfigDelete(currentDeleteConfig);
                            setShowDeleteConfirmationModal(false);
                        } }
                    >
                        <ConfirmationModal.Header>
                            { t("devPortal:components:remoteConfig.list.confirmations.deleteConfig.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            { t("devPortal:components:remoteConfig.list.confirmations.deleteConfig.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("devPortal:components:remoteConfig.list.confirmations.deleteConfig.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
            }
            {
                showConfigDetailsModal && ( <RemoteRepoDetails 
                        onCloseHandler={ () => setShowConfigDetailsModal(false) }
                        repoObject={ currentDetailsConfig }
                /> )
            }
        </>
    )
};
