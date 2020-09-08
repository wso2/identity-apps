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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ListLayout, PageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { UIConstants } from "../../core";
import { deleteRemoteRepoConfig, getRemoteRepoConfigList, triggerConfigDeployment } from "../api";
import { CreateRemoteRepoConfig, RemoteRepoList } from "../components";
import { InterfaceRemoteRepoConfig, InterfaceRemoteRepoListResponse } from "../models";

const RemoteRepoConfig: FunctionComponent = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ remoteRepoConfig, setRemoteRepoConfig ] = useState<InterfaceRemoteRepoConfig[]>();
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isListUpdated, setListUpdated ] = useState(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    useEffect(() => {
        getRemoteConfigList();
    }, []);

    useEffect(() => {
        getRemoteConfigList();
        setListUpdated(false);
    }, [ isListUpdated ]);

    const getRemoteConfigList = () => {
        getRemoteRepoConfigList().then((response: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            if (response.status === 200) {
                setRemoteRepoConfig(response.data.remotefetchConfigurations);
            }
        }).catch(() => {
            //Handle Error
        })
    }

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle config deletion action.
     *
     * @param role - Config ID which needs to be deleted
     */
    const handleOnDelete = (config: InterfaceRemoteRepoConfig): void => {
        deleteRemoteRepoConfig(config.id).then(() => {
            handleAlerts({
                description: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.message"
                )
            });
            setListUpdated(true);
        });
    };

    /**
     * Function which will handle config trigger.
     * @param config Config ID which needs to be triggered
     */
    const handleOnTrigger = (config: InterfaceRemoteRepoConfig): void => {
        triggerConfigDeployment(config.id).then(() => {
            handleAlerts({
                description: t(
                    "devPortal:components.remoteConfig.notifications.triggerConfig.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.remoteConfig.notifications.triggerConfig.success.message"
                )
            });
            setListUpdated(true);
        });
    }

    return (
        <PageLayout
                title="Remote Repository Deployment Configuration"
                description="Configure a remote repository to work seamlessly with the identity server."
            >
                <ListLayout
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                onPageChange={ () => {
                        //onPageChange Handler
                     } }
                    showPagination={ false }
                    showTopActionPanel={ false }
                    totalPages={ Math.ceil(remoteRepoConfig?.length / listItemLimit) }
                    totalListSize={ remoteRepoConfig?.length }
                >
                    <RemoteRepoList
                        showCreateWizard={ setShowWizard }
                        handleConfigDelete={ handleOnDelete }
                        repoObjectList={ remoteRepoConfig }
                        handleOnTrigger={ handleOnTrigger }
                    />
                </ListLayout>
                {
                showWizard && (
                    <CreateRemoteRepoConfig
                        data-testid="role-mgt-create-role-wizard"
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => setListUpdated(true) }
                    />
                )
            }
        </PageLayout>
    )
}

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteRepoConfig;
