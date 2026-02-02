/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Typography from "@oxygen-ui/react/Typography";
import Box from "@oxygen-ui/react/Box";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useMemo } from "react";
import { RouteComponentProps } from "react-router";
import OnboardingWizard from "../components/onboarding-wizard";
import Header from "../components/shared/header";
import { ContentArea } from "../components/shared/onboarding-styles";
import { OnboardingComponentIds } from "../constants";
import { useOnboardingStatus } from "../hooks/use-onboarding-status";
import { ApplicationType, OnboardingChoice, OnboardingData } from "../models";

/**
 * Props interface for OnboardingPage component.
 */
type OnboardingPageProps = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Onboarding page component.
 * Owns the page layout (header, container) and delegates step logic to OnboardingWizard.
 */
/**
 * Map of URL param values to ApplicationType enum.
 */
const APP_TYPE_MAP: Record<string, ApplicationType> = {
    browser: ApplicationType.BROWSER,
    machine: ApplicationType.MACHINE,
    mobile: ApplicationType.MOBILE,
    spa: ApplicationType.BROWSER,
    web: ApplicationType.BROWSER
};

/**
 * Map of URL param values to OnboardingChoice enum.
 */
const CHOICE_MAP: Record<string, OnboardingChoice> = {
    setup: OnboardingChoice.SETUP,
    tour: OnboardingChoice.TOUR
};

const OnboardingPage: FunctionComponent<OnboardingPageProps> = (props: OnboardingPageProps): ReactElement => {
    const {
        location,
        ["data-componentid"]: componentId = OnboardingComponentIds.PAGE
    } = props;

    /**
     * Parse URL params to get initial onboarding data.
     * Supported params: apptype, choice, appname
     */
    const initialData: OnboardingData = useMemo(() => {
        const params: URLSearchParams = new URLSearchParams(location.search);
        const data: OnboardingData = {};

        const appType: string | null = params.get("apptype");

        if (appType && APP_TYPE_MAP[appType.toLowerCase()]) {
            data.applicationType = APP_TYPE_MAP[appType.toLowerCase()];
        }

        const choice: string | null = params.get("choice");

        if (choice && CHOICE_MAP[choice.toLowerCase()]) {
            data.choice = CHOICE_MAP[choice.toLowerCase()];
        }

        const appName: string | null = params.get("appname");

        if (appName) {
            data.applicationName = appName;
        }

        return data;
    }, [ location.search ]);

    /**
     * Main wizard container with full viewport height.
     */
    const StyledOnboardingPage: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
        backgroundColor: (theme as any).customComponents?.Onboarding?.properties?.background
            ?? theme.palette.grey[50],
        display: "flex",
        flexDirection: "column",
        height: "100vh"
    }));

    const { markOnboardingComplete } = useOnboardingStatus();

    const handleComplete = useCallback(
        async (data: OnboardingData): Promise<void> => {
            // eslint-disable-next-line no-console
            console.log("Onboarding completed with data:", data);

            await markOnboardingComplete();
            history.push(AppConstants.getAppHomePath());
        },
        [markOnboardingComplete]
    );

    const handleSkip = useCallback(async (): Promise<void> => {
        // eslint-disable-next-line no-console
        console.log("Onboarding skipped");

        await markOnboardingComplete();
        history.push(AppConstants.getAppHomePath());
    }, [markOnboardingComplete]);

    return (
        <StyledOnboardingPage data-componentid={componentId}>
            <Header />
            <ContentArea>
                <OnboardingWizard
                    data-componentid={ `${componentId}-wizard` }
                    initialData={ initialData }
                    onComplete={ handleComplete }
                    onSkip={ handleSkip }
                />
            </ContentArea>
        </StyledOnboardingPage>
    );
};

OnboardingPage.displayName = "OnboardingPage";

export default OnboardingPage;
