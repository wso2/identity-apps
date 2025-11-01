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

import { CommonUtils } from "@wso2is/core/utils";
import { EmptyPlaceholder, ErrorBoundary, LinkButton } from "@wso2is/react-components";
import React, { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { getEmptyPlaceholderIllustrations } from "../configs/ui";

interface RouteErrorBoundaryProps {
    children: ReactNode;
    routeName?: string;
}

/**
 * Route-level Error Boundary that isolates errors to specific routes.
 *
 * @param props - Props for the component.
 * @returns Route error boundary component.
 */
const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children, routeName }: RouteErrorBoundaryProps) => {
    const { t } = useTranslation();

    const handleRetry = (): void => {
        CommonUtils.refreshPage();
    };

    const handleError = (error: Error): void => {
        console.error("Route Error Boundary caught an error:", error, routeName);
    };

    const renderFallback = (): ReactNode => (
        <div className="route-error-boundary">
            <EmptyPlaceholder
                action={
                    <LinkButton onClick={ handleRetry }>
                        { t("console:common.placeholders.brokenPage.action") }
                    </LinkButton>
                }
                image={ getEmptyPlaceholderIllustrations().brokenPage }
                imageSize="tiny"
                subtitle={ [
                    <Trans
                        key="subtitle-0"
                        i18nKey="console:common.placeholders.brokenPage.subtitles.0"
                    >
                        Something went wrong while displaying this page.
                    </Trans>,
                    <Trans
                        key="subtitle-1"
                        i18nKey="console:common.placeholders.brokenPage.subtitles.1"
                    >
                        You can try navigating to other sections using the side panel.
                    </Trans>
                ] }
                title={ t("console:common.placeholders.brokenPage.title") }
            />
        </div>
    );

    return (
        <ErrorBoundary fallback={ renderFallback() } handleError={ handleError } onChunkLoadError={ () => {} }>
            { children }
        </ErrorBoundary>
    );
};

export default RouteErrorBoundary;
