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

import { 
    ConfirmationModal,
    EmptyPlaceholder, 
    PrimaryButton,
    ResourceList, 
    ResourceListItem
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { RemoteRepoDetails } from "./remote-repository-details";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { AppConstants, UIConstants } from "../../constants";
import { history } from "../../helpers";
import { InterfaceRemoteRepoConfig } from "../../models";

interface RemoteRepoListProp {
    repoObjectList: InterfaceRemoteRepoConfig[];
    handleConfigDelete: (repoConfig: InterfaceRemoteRepoConfig) => void;
    showCreateWizard: (state: boolean) => void;
    handleOnTrigger: (repoConfig: InterfaceRemoteRepoConfig) => void;
}

export const RemoteRepoList: FunctionComponent<RemoteRepoListProp> = (props: RemoteRepoListProp): ReactElement => {

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

    const generateMetaContent = (repoObject: InterfaceRemoteRepoConfig) => {
        return (
            <div>
                <p>{`Successfull Deployments : ${repoObject.successfulDeployments} , 
                Failed Deployments : ${repoObject.failedDeployments}`}</p>
            </div>
        )
    };

    return (
        <>
            <ResourceList
                className="config-list"
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                fill={ !showPlaceholders() }
                celled={ false }
                divided={ true }
            >
                {
                    repoObjectList && repoObjectList instanceof Array && repoObjectList.length > 0
                        ? repoObjectList.map((repoObject: InterfaceRemoteRepoConfig, index) => (
                            <ResourceListItem
                                key={ index }
                                actionsFloated="right"
                                metaContent={ generateMetaContent(repoObject) }
                                metaColumnWidth={ 5 }
                                actionsColumnWidth={ 4 }
                                itemDescription={ repoObject.lastDeployed ? 
                                    `Last Deployed : ${repoObject.lastDeployed}` : "" 
                                }
                                actions={ [
                                    {
                                        hidden: repoObject.lastDeployed == undefined,
                                        icon: "eye",
                                        onClick: () => {
                                            setCurrentDetailsConfig(repoObject);
                                            setShowConfigDetailsModal(true);
                                        },
                                        popupText: "View Status",
                                        type: "button"
                                    },
                                    {
                                        icon: "retweet",
                                        onClick: (): void => { handleOnTrigger(repoObject) },
                                        popupText: "Trigger Config",
                                        type: "button"
                                    },
                                    {
                                        icon: "pencil alternate",
                                        onClick: (): void => handleRemoteRepoEdit(repoObject.id),
                                        popupText: "Edit Config",
                                        type: "button"
                                    },
                                    {
                                        icon: "trash alternate",
                                        onClick: () => {
                                            setCurrentDeleteConfig(repoObject);
                                            setShowDeleteConfirmationModal(!showConfigDeleteConfirmation);
                                        },
                                        popupText: "Delete Config",
                                        type: "button"
                                    }
                                ] }
                                itemHeader={ repoObject.name }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
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
