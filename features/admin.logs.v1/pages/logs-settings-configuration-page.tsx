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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useRemoteLogPublishingConfiguration from "../api/use-remote-log-publishing-configuration";
import RemoteLoggingConfigForm from "../components/remote-logging-config-form";
import { LogType } from "../models/remote-log-publishing";

type LogsSettingsConfigurationPageInterface = IdentifiableComponentInterface;

const LogsSettingsConfigurationPage: FunctionComponent<LogsSettingsConfigurationPageInterface> = ({
    ["data-componentid"]: _componentId = "logs-settings-configuration-page"
}: LogsSettingsConfigurationPageInterface): ReactElement => {

    const { t } = useTranslation();
    const logType: LogType = useMemo(() => {
        const path: string[] = history.location.pathname.split("/");
        const actionType: string = path[path.length - 1];

        if (actionType === "audit") {
            return LogType.AUDIT;
        } else if (actionType === "diagnostics") {
            return LogType.DIAGNOSTICS;
        }

        return LogType.AUDIT; // Ensure a default return value if neither condition matches
    }, [ history.location.pathname ]);

    const {
        data: logConfig,
        error: logConfigFetchRequestError,
        isLoading: islogConfigLoading,
        mutate: mutatelogConfig
    } = useRemoteLogPublishingConfiguration(true, logType);

    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOG_SETTINGS"));
    };

    return (
        <div>
            <PageLayout
                title={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
                pageTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.pageTitle") }
                description={ t("console:manage.features.serverConfigs.remoteLogPublishing.descriptionWithLogType",
                    { logType: logType.toLowerCase() } ) }
                backButton={ {
                    "data-componentid": `${_componentId}-${logType}-page-back-button`,
                    onClick: () => handleBackButtonClick(),
                    text: t("console:manage.features.serverConfigs.remoteLogPublishing.backButtonText")
                } }
                data-componentid={ `${_componentId}-layout` }
            >
                <RemoteLoggingConfigForm
                    logType={ logType }
                    initialData={ logConfig }
                    mutateRemoteLoggingRequest={ mutatelogConfig }
                    isLoading={ islogConfigLoading }
                />
            </PageLayout>
        </div>
    );
};

export default LogsSettingsConfigurationPage;
