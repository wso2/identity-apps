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
import { getEmptyPlaceholderIllustrations } from "../../configs/ui";
import { AppUtils } from "../../utils/app-utils";
import { EventPublisher } from "../../utils/event-publisher";

interface RouteErrorBoundaryProps {
    children: ReactNode;
    routeName?: string;
}

const ROUTE_ERROR_EVENT_ID: string = "route-error-boundary";

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

    const handleError = (error: Error, errorInfo: React.ErrorInfo): void => {
        EventPublisher.getInstance().publish(ROUTE_ERROR_EVENT_ID, {
            componentStack: errorInfo?.componentStack ?? "N/A",
            message: error?.message ?? "Unknown error",
            name: error?.name ?? "Error",
            route: routeName ?? "unknown"
        });
    };

    const renderFallback = (): ReactNode => {
        const genericErrorSubtitles: ReactNode[] = [
            (
                <Trans
                    key="subtitle-0"
                    i18nKey="myAccount:placeholders.genericError.subtitles.0"
                >
                    Something went wrong while displaying this page.
                </Trans>
            ),
            (
                <Trans
                    key="subtitle-1"
                    i18nKey="myAccount:placeholders.genericError.subtitles.1"
                >
                    You can try navigating to other sections using the side panel.
                </Trans>
            )
        ];

        return (
            <div className="route-error-boundary">
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleRetry }>
                            { t("myAccount:placeholders.genericError.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    subtitle={ genericErrorSubtitles }
                    title={ t("myAccount:placeholders.genericError.title") }
                />
            </div>
        );
    };

    return (
        <ErrorBoundary
            fallback={ renderFallback() }
            handleError={ handleError }
            onChunkLoadError={ AppUtils.onChunkLoadError }
        >
            { children }
        </ErrorBoundary>
    );
};

export default RouteErrorBoundary;
