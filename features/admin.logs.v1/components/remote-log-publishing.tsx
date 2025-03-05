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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FC, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { RemoteLoggingConfigForm } from "./remote-logging-config-form";
import useRemoteLogPublishingConfiguration from "../api/use-remote-log-publishing-configuration";
import { LogType } from "../models/remote-log-publishing";

/**
 * Props interface of {@link RemoteLogPublishing}
 */
interface RemoteLogPublishingInterface extends IdentifiableComponentInterface {
    // Log type.
    logType: LogType;
}

/**
 * Component to hold the remote log publishing configurations.
 *
 * @param props - Props injected to the component.
 * @returns Remote log publishing component.
 */
export const RemoteLogPublishing: FC<RemoteLogPublishingInterface> = ({
    ["data-componentid"]: componentId = "remote-log-publishing",
    logType
}: RemoteLogPublishingInterface): ReactElement => {

    const {
        data: remoteLogPublishingConfigs,
        isLoading: isRemoteLogPublishingConfigsLoading,
        error: remoteLogPublishingConfigRetrievalError,
        mutate: mutateRemoteLoggingRequest
    } = useRemoteLogPublishingConfiguration(true, logType);

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

    return (
        <RemoteLoggingConfigForm
            mutateRemoteLoggingRequest={ mutateRemoteLoggingRequest }
            logType={ logType }
            logConfigData={ remoteLogPublishingConfigs }
            data-componentid={ `${componentId}-${logType}-form` }
        />
    );
};

export default RemoteLogPublishing;
