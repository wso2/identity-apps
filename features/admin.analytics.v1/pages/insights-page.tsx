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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { GearIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import OrgInsightsPage from "@wso2is/admin.org-insights.v1/pages/org-insights";
import { PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MoesifCanvasIframe from "../components/moesif-canvas-iframe";

interface InsightsFlagsInterface {
    dashboardEnabled: boolean;
    embeddingDomain: string;
    settingsEnabled: boolean;
}

const useInsightsFlags = (): InsightsFlagsInterface => useSelector((state: AppState) => {
    const extensions: Record<string, unknown> =
        (state?.config?.deployment?.extensions as Record<string, unknown>) ?? {};
    const analytics: Record<string, unknown> =
        (extensions?.analytics as Record<string, unknown>) ?? {};
    const moesif: Record<string, unknown> =
        (analytics?.moesif as Record<string, unknown>) ?? {};
    const collectorKey: Record<string, unknown> =
        (analytics?.collectorKey as Record<string, unknown>) ?? {};

    return {
        dashboardEnabled: !!(moesif?.dashboardEnabled),
        embeddingDomain: (moesif?.embeddedPortalUrl as string) ?? "",
        settingsEnabled: !!(collectorKey?.settingsEnabled)
    };
});

interface CloudInsightsPagePropsInterface {
    embeddingDomain: string;
    showSettingsIcon: boolean;
}

/**
 * Cloud insights view — embedded Moesif Canvas dashboard. The gear icon to navigate to
 * the analytics settings page is only rendered when settings are enabled.
 */
const CloudInsightsPage: FunctionComponent<CloudInsightsPagePropsInterface> = (
    { embeddingDomain, showSettingsIcon }: CloudInsightsPagePropsInterface
): ReactElement => {
    const { t } = useTranslation();

    const navigateToSettings: () => void = (): void => {
        history.push(AppConstants.getPaths().get("INSIGHTS_SETTINGS"));
    };

    return (
        <PageLayout
            data-componentid="insights-page"
            pageTitle={ t("insights:pageTitle") }
            title={ t("insights:title") }
            action={ showSettingsIcon ? (
                <Tooltip title={ t(
                    "extensions:develop.moesifAnalytics.collectorKeySettings.settingsIconTooltip"
                ) }>
                    <IconButton
                        data-componentid="insights-page-settings-btn"
                        onClick={ navigateToSettings }
                        size="large"
                        aria-label={ t(
                            "extensions:develop.moesifAnalytics.collectorKeySettings.settingsIconTooltip"
                        ) }
                    >
                        <GearIcon />
                    </IconButton>
                </Tooltip>
            ) : null }
        >
            <MoesifCanvasIframe
                data-componentid="moesif-canvas-iframe"
                embeddingDomain={ embeddingDomain }
            />
        </PageLayout>
    );
};

/**
 * Unified Insights page.
 *
 * - Moesif dashboard enabled (with embedding domain): renders the embedded Moesif Canvas
 *   dashboards. A gear icon on the page header navigates to /insights/settings.
 * - Moesif dashboard disabled but settings enabled: redirects to /insights/settings so the
 *   sidebar "Insights" link lands directly on the configuration page.
 * - Otherwise: falls back to the legacy OrgInsightsPage.
 */
const InsightsPage: FunctionComponent = (): ReactElement => {
    const { dashboardEnabled, embeddingDomain, settingsEnabled }: InsightsFlagsInterface =
        useInsightsFlags();

    const isMoesifDashboardAvailable: boolean = dashboardEnabled && !!embeddingDomain;
    const shouldRedirectToSettings: boolean = !isMoesifDashboardAvailable && settingsEnabled;

    useEffect(() => {
        if (shouldRedirectToSettings) {
            history.replace(AppConstants.getPaths().get("INSIGHTS_SETTINGS"));
        }
    }, [ shouldRedirectToSettings ]);

    if (isMoesifDashboardAvailable) {
        return (
            <CloudInsightsPage
                embeddingDomain={ embeddingDomain }
                showSettingsIcon={ settingsEnabled }
            />
        );
    }

    if (shouldRedirectToSettings) {
        return <Box />;
    }

    return <OrgInsightsPage />;
};

export default InsightsPage;
