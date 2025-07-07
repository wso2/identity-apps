/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { GearIcon } from "@oxygen-ui/react-icons";
import { useRequiredScopes } from "@wso2is/access-control";
import { getMiscellaneousIcons } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Button,
    DocumentationLink, EmphasizedSegment, GenericIcon,
    PageLayout,
    Popup,
    ResourceTab,
    ResourceTabPaneInterface,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, List, MenuItem, TabProps } from "semantic-ui-react";
import AuditLogsPage from "./audit-logs-page";
import DiagnosticLogsPage from "./diagnostic-logs-page";
import { TabIndex } from "../models/log-models";
import "./logs.scss";

/**
 * Proptypes for the logs page component.
 */
type LogsPageInterface = IdentifiableComponentInterface;

/**
 * Logs monitoring page.
 *
 * @param props - {@link LogsPageInterface} Props injected to the component.
 *
 * @returns Logs Page {@link React.ReactElement}
 */
const LogsPage: FunctionComponent<LogsPageInterface> = (props: LogsPageInterface): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(TabIndex.DIAGNOSTIC_LOGS);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const hasAuditLogAccessPermissions: boolean = useRequiredScopes(featureConfig?.auditLogs?.scopes?.feature);

    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
    };

    const renderLogView = (): ReactElement => {
        return (
            <ResourceTab
                activeIndex={ activeTabIndex }
                data-componentid={ `${componentId}-log-tabs` }
                defaultActiveIndex={ 0 }
                onTabChange={ handleTabChange }
                panes={ resolveLogTabPanes() }
            />
        );
    };

    const resolveLogTabPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [];

        {
            featureConfig.diagnosticLogs?.enabled &&
                panes.push({
                    componentId: "diagnostic-logs",
                    menuItem: (
                        <MenuItem key="text" className="item-with-chip">
                            { t("extensions:develop.monitor.logs.tabs.diagnostic") }
                        </MenuItem>
                    ),
                    render: renderLogContentDiagnosticNew
                });
        }

        {
            featureConfig.auditLogs?.enabled &&
                hasAuditLogAccessPermissions &&
                panes.push({
                    componentId: "audit-logs",
                    menuItem: (
                        <MenuItem key="text" className="item-with-chip">
                            { t("extensions:develop.monitor.logs.tabs.audit") }
                        </MenuItem>
                    ),
                    render: renderLogContentAuditNew
                });
        }

        return panes;
    };

    const renderLogContentDiagnosticNew = (): ReactElement => {
        return <DiagnosticLogsPage data-componentid={ componentId } />;
    };

    const renderLogContentAuditNew = (): ReactElement => {
        return <AuditLogsPage />;
    };

    const handleSettingsButton = (): void => {
        history.push(AppConstants.getPaths().get("LOG_SETTINGS"));
    };

    const renderLogPublishSettings = (): ReactElement => {

        if (featureConfig?.auditLogs.disabledFeatures?.includes(FeatureFlagConstants
            .FEATURE_FLAG_KEY_MAP.REMOTE_LOG_PUBLISH)) {

            return <></>;
        }

        return (
            <EmphasizedSegment
                className="mt-0 mb-5"
                data-componentid="log-publish-configuration"
            >
                <List>
                    <List.Item>
                        <Grid verticalAlign="middle">
                            <Grid.Column
                                floated="left"
                                mobile={ 16 }
                                computer={ 8 }
                                verticalAlign="middle"
                            >
                                <List.Content verticalAlign="middle">
                                    <GenericIcon
                                        icon={ getMiscellaneousIcons().tenantIcon }
                                        floated="left"
                                        size="mini"
                                        spaced="right"
                                        verticalAlign="middle"
                                        inline
                                        square
                                        transparent
                                    />
                                    <List.Header
                                        data-componentid="application-consumer-account-link-title"
                                        className="logs-title"
                                    >
                                        { t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
                                    </List.Header>
                                    <List.Description
                                        data-componentid="application-consumer-account-link-description"
                                    >
                                        { t("console:manage.features.serverConfigs.remoteLogPublishing.description") }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column
                                mobile={ 16 }
                                computer={ 4 }
                                textAlign={ "right" }
                            >
                                { (
                                    <Popup
                                        trigger={ (
                                            <Button
                                                className="log-publish-settings-button"
                                                data-componentid="navigate-to-log-publish-settings-button"
                                                onClick={ handleSettingsButton }
                                            >
                                                <GearIcon /> Configure
                                            </Button>
                                        ) }
                                        content={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
                                        position="top right"
                                        size="mini"
                                        hideOnScroll
                                        inverted
                                    />
                                ) }
                            </Grid.Column>
                        </Grid>
                    </List.Item>
                </List>
            </EmphasizedSegment>
        );
    };

    return (
        <div className="diagnostic-logs">
            <PageLayout
                title={ t("extensions:develop.monitor.pageHeader.title") }
                pageTitle="Logs"
                description={
                    (<>
                        { t("extensions:develop.monitor.pageHeader.description") }
                        <DocumentationLink link={ getLink("manage.logs.learnMore") }>
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>)
                }
                data-componentid={ `${componentId}-layout` }
            >
                { renderLogPublishSettings() }
                { renderLogView() }
            </PageLayout>
        </div>
    );
};

/**
 * Default props for the component.
 */
LogsPage.defaultProps = {
    "data-componentid": "logs-page"
};

export default LogsPage;
