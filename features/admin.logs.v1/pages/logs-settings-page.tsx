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

import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Typography from "@oxygen-ui/react/Typography";
import { DocumentIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    GenericIcon,
    PageLayout
} from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import "./logs.scss";
import { LogTypeCardInterface } from "../models/log-settings-models";
import { LogType } from "../models/remote-log-publishing";
import "./logs-settings-page.scss";

/**
 * Proptypes for the logs page component.
 */
export type LogsSettingsPageInterface = IdentifiableComponentInterface;

/**
 * Logs monitoring page.
 *
 * @param props - {@link LogsSettingsPageInterface} Props injected to the component.
 *
 * @returns Logs Page {@link React.ReactElement}
 */
const LogsSettingsPage: FunctionComponent<LogsSettingsPageInterface> = ({
    ["data-componentid"]: componentId = "logs-settings-page"
}: LogsSettingsPageInterface): ReactElement => {

    const { t } = useTranslation();

    const logTypesCardsInfo = (): LogTypeCardInterface[] => {
        return [
            {
                description: t("console:manage.features.serverConfigs.remoteLogPublishing.logTypes.audit.description"),
                disabled: false,
                featureStatusKey: "",
                heading: t("console:manage.features.serverConfigs.remoteLogPublishing.logTypes.audit.name"),
                icon: <DocumentIcon size="small" className="icon"/>,
                identifier: LogType.AUDIT,
                route: AppConstants.getPaths().get("LOG_SETTINGS_AUDIT")
            },
            {
                description:
                    t("console:manage.features.serverConfigs.remoteLogPublishing.logTypes.diagnostics.description"),
                disabled: false,
                featureStatusKey: "",
                heading: t("console:manage.features.serverConfigs.remoteLogPublishing.logTypes.diagnostics.name"),
                icon: <DocumentIcon size="small" className="icon"/>,
                identifier: LogType.DIAGNOSTICS,
                route: AppConstants.getPaths().get("LOG_SETTINGS_DIAGNOSTICS")
            } ];
    };

    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGS"));
    };

    return (
        <div className="diagnostic-logs">
            <PageLayout
                title={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
                pageTitle={ t("console:manage.features.serverConfigs.remoteLogPublishing.pageTitle") }
                description={ t("console:manage.features.serverConfigs.remoteLogPublishing.description") }
                backButton={ {
                    "data-componentid": `${ componentId }-page-back-button`,
                    onClick: () => handleBackButtonClick(),
                    text: t("console:manage.features.serverConfigs.remoteLogPublishing.backButtonText")
                } }
                data-componentid={ `${componentId}-layout` }
            >
                <div className="log-types-grid-wrapper" data-componentid={ `${ componentId }-grid` }>
                    <div className="log-types-grid">
                        { logTypesCardsInfo().map((cardProps: LogTypeCardInterface) => {
                            return (
                                <Card
                                    key={ cardProps.identifier }
                                    className={ classNames("log-type", { "disabled": cardProps.disabled }) }
                                    data-componentid={ `${ cardProps.identifier }-log-type-card` }
                                    onClick={ () => history.push(cardProps.route) }
                                >
                                    <CardContent className="log-type-header">
                                        <div>
                                            <GenericIcon
                                                size="micro"
                                                icon={ (
                                                    <Avatar
                                                        variant="square"
                                                        randomBackgroundColor
                                                        backgroundColorRandomizer={ cardProps.identifier }
                                                        className="log-type-icon-container"
                                                    >
                                                        { cardProps.icon }
                                                    </Avatar>
                                                ) }
                                                inline
                                                transparent
                                                shape="square"
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="h6">
                                                { cardProps.heading }
                                            </Typography>
                                        </div>
                                    </CardContent>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            {  cardProps.description }
                                        </Typography>
                                    </CardContent>
                                </Card>
                            );
                        }) }
                    </div>
                </div>
            </PageLayout>
        </div>
    );
};

export default LogsSettingsPage;
