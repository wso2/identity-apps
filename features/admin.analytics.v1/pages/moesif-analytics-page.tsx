/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { GearIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MoesifCollectorKeySettings from "../components/moesif-collector-key-settings";
import MoesifCanvasIframe from "../components/moesif-canvas-iframe";
import { MoesifDashboardType } from "../models/moesif-analytics";

/**
 * Props for the MoesifAnalyticsPage component.
 */
interface MoesifAnalyticsPageProps {
    /**
     * Which dashboard to display.
     */
    dashboardType: MoesifDashboardType;
}

/**
 * Moesif Analytics dashboard page.
 *
 * Reads the workspace ID from the deployment extensions config and renders the
 * appropriate Moesif embedded analytics dashboard inside an iframe.
 */
const MoesifAnalyticsPage: FunctionComponent<MoesifAnalyticsPageProps> = (
    props: MoesifAnalyticsPageProps
): ReactElement => {
    const { dashboardType } = props;

    const { t } = useTranslation();

    const moesifConfig: Record<string, unknown> = useSelector((state: AppState) => {
        const extensions: Record<string, unknown> =
            (state?.config?.deployment?.extensions as Record<string, unknown>) ?? {};
        const analytics: Record<string, unknown> =
            (extensions?.analytics as Record<string, unknown>) ?? {};

        return (analytics?.moesif as Record<string, unknown>) ?? {};
    });

    const isCollectorKeySettingsEnabled: boolean = useSelector((state: AppState) => {
        const extensions: Record<string, unknown> =
            (state?.config?.deployment?.extensions as Record<string, unknown>) ?? {};
        const analytics: Record<string, unknown> =
            (extensions?.analytics as Record<string, unknown>) ?? {};
        const collectorKey: Record<string, unknown> =
            (analytics?.collectorKey as Record<string, unknown>) ?? {};

        return !!(collectorKey?.settingsEnabled);
    });

    const [ isSettingsOpen, setIsSettingsOpen ] = useState<boolean>(false);

    // Base URL of the Moesif Embedded Portal, e.g. "https://www.moesif.com".
    // Configured via deployment extensions: extensions.analytics.moesif.embeddedPortalUrl
    const embeddingDomain: string = (moesifConfig?.embeddedPortalUrl as string) ?? "";

    const isLoginDashboard: boolean = dashboardType === MoesifDashboardType.LOGIN;

    return (
        <>
            <PageLayout
                data-componentid={ `moesif-analytics-${ dashboardType }-page` }
                pageTitle={
                    isLoginDashboard
                        ? t("extensions:develop.moesifAnalytics.loginPage.title")
                        : t("extensions:develop.moesifAnalytics.registrationPage.title")
                }
                title={
                    isLoginDashboard
                        ? t("extensions:develop.moesifAnalytics.loginPage.heading")
                        : t("extensions:develop.moesifAnalytics.registrationPage.heading")
                }
                description={
                    isLoginDashboard
                        ? t("extensions:develop.moesifAnalytics.loginPage.description")
                        : t("extensions:develop.moesifAnalytics.registrationPage.description")
                }
                action={
                    isCollectorKeySettingsEnabled ? (
                        <Tooltip
                            title={ t(
                                "extensions:develop.moesifAnalytics.collectorKeySettings.settingsIconTooltip"
                            ) }
                        >
                            <IconButton
                                data-componentid="moesif-collector-key-settings-icon-btn"
                                onClick={ () => setIsSettingsOpen(true) }
                                size="large"
                                aria-label={ t(
                                    "extensions:develop.moesifAnalytics.collectorKeySettings.settingsIconTooltip"
                                ) }
                            >
                                <GearIcon />
                            </IconButton>
                        </Tooltip>
                    ) : null
                }
            >
                <MoesifCanvasIframe
                    data-componentid={ `moesif-canvas-iframe-${ dashboardType }` }
                    embeddingDomain={ embeddingDomain }
                />
            </PageLayout>
            { isCollectorKeySettingsEnabled && (
                <MoesifCollectorKeySettings
                    data-componentid="moesif-collector-key-settings-dialog"
                    open={ isSettingsOpen }
                    onClose={ () => setIsSettingsOpen(false) }
                />
            ) }
        </>
    );
};

export default MoesifAnalyticsPage;
