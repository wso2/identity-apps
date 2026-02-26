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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import OnboardingWizard from "../components/onboarding-wizard";
import Header from "../components/shared/header";
import { ContentArea } from "../components/shared/onboarding-styles";
import { OnboardingComponentIds } from "../constants";
import { useOnboardingStatus } from "../hooks/use-onboarding-status";
import { OnboardingDataInterface, ParsedWizardUrlParamsInterface } from "../models";
import { parseWizardUrlParams } from "../utils/parse-wizard-url-params";

/**
 * Props interface for OnboardingPage component.
 */
type OnboardingPageProps = IdentifiableComponentInterface & RouteComponentProps;

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

const OnboardingPage: FunctionComponent<OnboardingPageProps> = (props: OnboardingPageProps): ReactElement => {
    const {
        location,
        ["data-componentid"]: componentId = OnboardingComponentIds.PAGE
    } = props;

    /**
     * Parse URL params to get initial onboarding data and step.
     * Returns only fields explicitly present in the URL — wizard defaults apply for absent fields.
     */
    const { step: initialStep, data: initialData }: ParsedWizardUrlParamsInterface = useMemo(
        () => parseWizardUrlParams(location.search),
        [ location.search ]
    );

    const {
        shouldShowOnboarding,
        isLoading,
        markOnboardingComplete
    } = useOnboardingStatus();

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features
    );
    const hasRequiredCreateScopes: boolean = useRequiredScopes(
        featureConfig?.onboarding?.scopes?.create as string[]
    );

    // Route guard: redirect to home if user shouldn't see onboarding or lacks scopes
    useEffect(() => {
        if (!isLoading && (!shouldShowOnboarding || !hasRequiredCreateScopes)) {
            history.push(AppConstants.getAppHomePath());
        }
    }, [ isLoading, shouldShowOnboarding, hasRequiredCreateScopes ]);

    const handleComplete: (data: OnboardingDataInterface) => Promise<void> = useCallback(
        async (data: OnboardingDataInterface): Promise<void> => {
            await markOnboardingComplete();

            const applicationId: string | undefined = data.createdApplication?.applicationId;

            if (applicationId) {
                history.push(
                    AppConstants.getPaths()
                        .get("APPLICATION_EDIT")
                        .replace(":id", applicationId)
                );
            } else {
                history.push(AppConstants.getAppHomePath());
            }
        },
        [ markOnboardingComplete ]
    );

    const handleSkip: () => Promise<void> = useCallback(async (): Promise<void> => {
        await markOnboardingComplete();
        history.push(AppConstants.getAppHomePath());
    }, [ markOnboardingComplete ]);

    if (isLoading || !shouldShowOnboarding || !hasRequiredCreateScopes) {
        return null;
    }

    return (
        <StyledOnboardingPage data-componentid={ componentId }>
            <Header />
            <ContentArea>
                <OnboardingWizard
                    data-componentid={ `${componentId}-wizard` }
                    initialData={ initialData }
                    initialStep={ initialStep }
                    onComplete={ handleComplete }
                    onSkip={ handleSkip }
                />
            </ContentArea>
        </StyledOnboardingPage>
    );
};

OnboardingPage.displayName = "OnboardingPage";

export default OnboardingPage;
