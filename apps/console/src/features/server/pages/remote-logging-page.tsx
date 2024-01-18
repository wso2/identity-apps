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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AppConstants, history } from "../../core";
import {
    useRemoteLogPublishingConfigs
} from "../api/server";
import { RemoteLoggingConfigForm } from "../components/remote-logging-config-form";
import { LogType, RemoteLogPublishingConfigurationInterface } from "../models/server";

type RemoteLoggingPageInterface = IdentifiableComponentInterface;

export const RemoteLoggingPage: FC<RemoteLoggingPageInterface> = (
    props: RemoteLoggingPageInterface
): ReactElement => {

    const { [ "data-componentid" ]: componentId } = props;

    const {
        data: remoteLogPublishingConfigs,
        isLoading: isRemoteLogPublishingConfigsLoading,
        error: remoteLogPublishingConfigRetrievalError,
        mutate: mutateRemoteLoggingRequest
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

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("SERVER"));
    };

    return (
        <PageLayout
            title={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
            pageTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.pageTitle") }
            description={ <>{ t("console:manage.features.serverConfigs.remoteLogPublishing.description") }</> }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:manage.pages.rolesEdit.backButton", { type: "Server" })
            } }
            bottomMargin={ false }
            isLoading={ isRemoteLogPublishingConfigsLoading }
        >
            <RemoteLoggingConfigForm
                mutateRemoteLoggingRequest={ mutateRemoteLoggingRequest }
                logType={ LogType.AUDIT }
                logConfig={ remoteLogPublishingConfigs?.find(
                    (config: RemoteLogPublishingConfigurationInterface) =>
                        config.logType.toLowerCase() === LogType.AUDIT.toString()
                ) }
            />
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
RemoteLoggingPage.defaultProps = {
    "data-componentid": "remote-logging-page"
};

export default RemoteLoggingPage;
