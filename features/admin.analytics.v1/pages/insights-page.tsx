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
import {
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import OrgInsightsPage from "@wso2is/admin.org-insights.v1/pages/org-insights";
import { ContentLoader, PageLayout } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetMoesifPublisher } from "../api/use-get-moesif-publisher";
import MoesifCanvasIframe from "../components/moesif-canvas-iframe";
import { MoesifPublisherInterface } from "../models/moesif-analytics";

interface InsightsFlagsInterface {
    advancedAnalyticsUpgradeEnabled: boolean;
    embeddingDomain: string;
    insightsEnabled: boolean;
    moesifTermsOfServiceUrl: string;
    settingsEnabled: boolean;
    termsOfServiceUrl: string;
}

/**
 * Determines whether advanced analytics (the embedded Moesif dashboards) is enabled, based on the
 * publisher configuration returned by the get-publishers API.
 *
 * - `enableAllPublishers === true`: every publisher is on (the enablement map may be empty) → enabled.
 * - Otherwise: enabled only when at least one publisher in the enablement map is on.
 * - No publisher data (e.g. a 404 when no publisher is configured, or any fetch error): disabled.
 *
 * @param publisher - Publisher configuration from the get-publishers API, if available.
 * @returns Whether advanced analytics is enabled for the organization.
 */
const isAdvancedAnalyticsEnabled = (publisher?: MoesifPublisherInterface): boolean => {
    if (!publisher) {
        return false;
    }

    if (publisher.enableAllPublishers) {
        return true;
    }

    return Object.values(publisher.eventPublisherEnablement ?? {}).some((enabled: boolean) => enabled);
};

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
        advancedAnalyticsUpgradeEnabled: !!(moesif?.advancedAnalyticsUpgradeEnabled),
        embeddingDomain: (moesif?.embeddedPortalUrl as string) ?? "",
        insightsEnabled: !!(state?.config?.ui?.features?.insights?.enabled),
        moesifTermsOfServiceUrl: (moesif?.moesifTermsOfServiceUrl as string) ?? "",
        settingsEnabled: !!(collectorKey?.settingsEnabled),
        termsOfServiceUrl: (moesif?.termsOfServiceUrl as string) ?? ""
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
 * Advanced analytics enablement is determined by the get-publishers API:
 * - Advanced analytics enabled (with embedding domain): renders the embedded Moesif Canvas
 *   dashboards. A gear icon on the page header navigates to /insights/settings.
 * - Not enabled + legacy insights disabled: redirects to /insights/settings.
 * - Not enabled + legacy insights enabled: renders OrgInsightsPage with upgrade prompt.
 */
const InsightsPage: FunctionComponent = (): ReactElement => {
    const {
        advancedAnalyticsUpgradeEnabled,
        embeddingDomain,
        insightsEnabled,
        moesifTermsOfServiceUrl,
        settingsEnabled,
        termsOfServiceUrl
    }: InsightsFlagsInterface = useInsightsFlags();

    // The dashboards can only be embedded when an embedding domain is configured, so defer the
    // publisher lookup until then. A 404 (no publisher configured) is handled gracefully as disabled.
    const {
        data: moesifPublisher,
        isLoading: isPublisherLoading
    }: RequestResultInterface<MoesifPublisherInterface, RequestErrorInterface> =
        useGetMoesifPublisher(!!embeddingDomain);

    const isMoesifDashboardAvailable: boolean = useMemo(
        () => !!embeddingDomain && isAdvancedAnalyticsEnabled(moesifPublisher),
        [ embeddingDomain, moesifPublisher ]
    );
    const shouldRedirectToSettings: boolean =
        !isPublisherLoading && !isMoesifDashboardAvailable && !insightsEnabled;

    useEffect(() => {
        if (shouldRedirectToSettings) {
            history.replace(AppConstants.getPaths().get("INSIGHTS_SETTINGS"));
        }
    }, [ shouldRedirectToSettings ]);

    if (isPublisherLoading) {
        return <ContentLoader />;
    }

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

    return (
        <OrgInsightsPage
            showUpgradeCard={ advancedAnalyticsUpgradeEnabled }
            termsOfServiceUrl={ termsOfServiceUrl }
            moesifTermsOfServiceUrl={ moesifTermsOfServiceUrl }
        />
    );
};

export default InsightsPage;
