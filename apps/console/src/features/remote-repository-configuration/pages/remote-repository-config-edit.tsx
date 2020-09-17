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
import { PageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AppConstants, history } from "../../core";
import { deleteRemoteRepoConfig, getRemoteRepoConfig, updateRemoteRepoConfig } from "../api";
import { RemoteRepoEdit } from "../components";
import { InterfaceEditDetails, InterfaceRemoteConfigDetails } from "../models";

const RemoteRepositoryEditPage: FunctionComponent = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const [ remoteConfig, setRemoteConfig ] = useState<InterfaceRemoteConfigDetails>(undefined);

    /**
     * Use effect for the initial component load.
     */
    useEffect(() => {
        const path = history.location.pathname.split("/");
        const id = path[ path.length - 1 ];

        getRemoteRepoConfig(id).then((response: AxiosResponse<InterfaceRemoteConfigDetails>)  => {
            if (response.status === 200) {
                setRemoteConfig(response.data);
            }
        })
    }, []);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("REMOTE_REPO_CONFIG"));
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * Function which will handle role deletion action.
     *
     * @param role - Role ID which needs to be deleted
     */
    const handleOnDelete = (config: InterfaceRemoteConfigDetails): void => {
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
        });
        history.push(AppConstants.getPaths().get("REMOTE_REPO_CONFIG"));
    };

    const handleOnConfigUpdate = (id: string, values: InterfaceEditDetails): void => {
        updateRemoteRepoConfig(id, values).then(() => {
            handleAlerts({
                description: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "devPortal:components.remoteConfig.notifications.deleteConfig.success.message"
                )
            });
        })
    }
    
    return (
        <PageLayout
            title={ remoteConfig ? remoteConfig.remoteFetchName : "" }
            contentTopMargin={ true }
            description={ "Edit remote repository configurations." }
            backButton={ {
                onClick: handleBackButtonClick,
                text: "Back to configs"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <RemoteRepoEdit 
                handleConfigDelete={ handleOnDelete }  
                configId={ remoteConfig?.id }
                onConfigUpdate={ handleOnConfigUpdate }
                configObject={ remoteConfig } 
            />
        </PageLayout>
    )
}

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default RemoteRepositoryEditPage;
