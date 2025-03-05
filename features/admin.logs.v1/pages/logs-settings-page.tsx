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

import { useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    PageLayout,
    ResourceTab,
    ResourceTabPaneInterface,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { MenuItem, TabProps } from "semantic-ui-react";
import RemoteLogPublishing from "../components/remote-log-publishing";
import { TabIndex } from "../models/log-models";
import "./logs.scss";
import { LogType } from "../models/remote-log-publishing";

/**
 * Proptypes for the logs page component.
 */
type LogsSettingsPageInterface = IdentifiableComponentInterface;

/**
 * Logs monitoring page.
 *
 * @param props - {@link LogsSettingsPageInterface} Props injected to the component.
 *
 * @returns Logs Page {@link React.ReactElement}
 */
const LogsSettingsPage: FunctionComponent<LogsSettingsPageInterface> = (props: LogsSettingsPageInterface): ReactElement => {
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
                data-testid={ `${componentId}-log-tabs` }
                defaultActiveIndex={ 0 }
                onTabChange={ handleTabChange }
                panes={ resolveLogTabPanes() }
            />
        );
    };

    const resolveLogTabPanes = (): ResourceTabPaneInterface[] => {
        const panes: ResourceTabPaneInterface[] = [];

        {
            featureConfig.auditLogs?.enabled &&
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
        return <RemoteLogPublishing logType={ LogType.DIAGNOSTICS }/>;
    };

    const renderLogContentAuditNew = (): ReactElement => {
        return <RemoteLogPublishing logType={ LogType.AUDIT }/>;
    };

    return (
        <div className="diagnostic-logs">
            <PageLayout
                title={ t("console:manage.features.serverConfigs.remoteLogPublishing.title") }
                pageTitle="Logs Settings"
                description={
                    (<>
                        { t("console:manage.features.serverConfigs.remoteLogPublishing.description") }
                        <DocumentationLink link={ getLink("manage.logs.learnMore") }>
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>)
                }
                data-componentid={ `${componentId}-layout` }
            >
                { renderLogView() }
            </PageLayout>
        </div>
    );
};

/**
 * Default props for the component.
 */
LogsSettingsPage.defaultProps = {
    "data-componentid": "logs-settings-page"
};

export default LogsSettingsPage;
