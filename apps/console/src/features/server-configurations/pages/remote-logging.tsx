/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import { AlertInterface, AlertLevels } from "modules/core/src/models/core";
import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

import { Tab } from "semantic-ui-react";
import {
    useRemoteLogPublishingConfigs
} from "../api/server-config";
import { RemoteLoggingConfigForm } from "../forms/remote-logging-config-form";
import { LogType, RemoteLogPublishingConfigurationInterface } from "../models/governance-connectors";

export default function RemoteLogging(): ReactElement {

    const {
        data: remoteLogPublishingConfigs,
        isLoading: isRemoteLogPublishingConfigsLoading,
        error: remoteLogPublishingConfigRetrievalError
    } = useRemoteLogPublishingConfigs();

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();


    useEffect(() => {
        if (remoteLogPublishingConfigRetrievalError && !isRemoteLogPublishingConfigsLoading) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("console:manage.features.serverConfigs.remoteLogPublishing." + 
                    "notification.error.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.serverConfigs.remoteLogPublishing." + 
                    "notification.error.fetchError.message")
                })
            );
        }
    }, [ ]);

    const panes: any = [
        {
            menuItem: "Audit Logs",
            render: () => (
                <RemoteLoggingConfigForm
                    logType={ LogType.AUDIT }
                    logConfig={ remoteLogPublishingConfigs?.find(
                        (config: RemoteLogPublishingConfigurationInterface) => config.logType === LogType.AUDIT
                    ) }
                />    
            )
        },
        {
            menuItem: "Carbon Logs",
            render: () => (
                <RemoteLoggingConfigForm
                    logType={ LogType.CARBON }
                    logConfig={ remoteLogPublishingConfigs?.find(
                        (config: RemoteLogPublishingConfigurationInterface) => config.logType === LogType.CARBON
                    ) }
                /> 
            )
        }
    ];

    return (
        <PageLayout
            title={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
            pageTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.pageTitle") }
            description={ <>{ t("console:manage.features.serverConfigs.remoteLogPublishing.description") }</> }
            isLoading={ isRemoteLogPublishingConfigsLoading }
        >
            
            <Tab
                className="tabs resource-tabs"
                menu={ { pointing: true, secondary: true } }
                panes={ panes }
                renderActiveOnly
            />
           
        </PageLayout>
    );
}
