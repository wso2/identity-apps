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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    PageLayout,
    ResourceTab } from "@wso2is/react-components";
import { AppState, FeatureConfigInterface } from "apps/console/src/features/core";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { TabProps } from "semantic-ui-react";
import { AuditLogsPage } from "../../audit-logs/audit-logs";
import { DiagnosticLogsPage } from "../../diagnostic-logs/diagnostic-logs";
import { TabIndex } from "../models/log-models";

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
const LogsPage: FunctionComponent<LogsPageInterface> = (
    props: LogsPageInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(TabIndex.DIAGNOSTIC_LOGS);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const { t } = useTranslation();

    const handleTabChange = (e: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
    };

    const renderLogView = (): ReactElement => {

        return (
            <ResourceTab
                activeIndex= { activeTabIndex }
                data-testid= { `${componentId}-log-tabs` }
                defaultActiveIndex={ 0 }
                onTabChange={ handleTabChange }
                panes= { resolveLogTabPanes() }
            />
        );
    };

    const resolveLogTabPanes = (): LogTabPane[] => {
        const panes: LogTabPane[] = [];

        { featureConfig.diagnosticLogs?.enabled &&  panes.push({
            componentId: "diagnostic-logs",
            menuItem: {
                content: "Diagnostic"
            },
            render: renderLogContentDiagnosticNew
        }); }


        { featureConfig.auditLogs?.enabled && panes.push({
            componentId: "audit-logs",
            menuItem: {
                content: "Audit"
            },
            render: renderLogContentAuditNew
        }); }

        return panes;
    };

    const renderLogContentDiagnosticNew = () : ReactElement => {
        return (
            <DiagnosticLogsPage/>
        );
    };

    const renderLogContentAuditNew = () : ReactElement => {
        return (
            <AuditLogsPage/>
        );
    };

    return (
        <div className="diagnostic-logs">
            <PageLayout
                title={ t("extensions:develop.monitor.pageHeader.title") }
                pageTitle="Logs"
                description={
                    t("extensions:develop.monitor.pageHeader.description")
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
LogsPage.defaultProps = {
    "data-componentid": "logs-page"
};


/**
 * Interface for the Log Tab Pane.
 */
interface LogTabPane {
    componentId: string;
    menuItem: {
        content: string;
    };
    render: () => React.ReactElement;
}


export default LogsPage;
