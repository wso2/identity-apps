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
import { EmptyPlaceholder, LinkButton } from "@wso2is/react-components";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Trans, withTranslation, WithTranslation } from "react-i18next";
import { getEmptyPlaceholderIllustrations } from "../../configs/ui";

interface RouteErrorBoundaryProps extends WithTranslation {
    children: ReactNode;
    routeName?: string;
}

interface RouteErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

/**
 * Route-level Error Boundary that isolates errors to specific routes.
 */
class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
    constructor(props: RouteErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
        return {
            error,
            hasError: true
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("Route Error Boundary caught an error:", error, errorInfo);
    }

    componentDidUpdate(prevProps: RouteErrorBoundaryProps): void {
        if (this.state.hasError && prevProps.children !== this.props.children) {
            this.setState({ hasError: false, error: undefined });
        }
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: undefined });
        CommonUtils.refreshPage();
    };

    render(): ReactNode {
        const { hasError } = this.state;
        const { children, t } = this.props;

        if (hasError) {
            return (
                <div className="route-error-boundary">
                    <EmptyPlaceholder
                        action={
                            <LinkButton onClick={ this.handleRetry }>
                                { t("myAccount:placeholders.genericError.action") }
                            </LinkButton>
                        }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                        subtitle={ [
                            <Trans
                                key="subtitle-0"
                                i18nKey="myAccount:placeholders.genericError.subtitles.0"
                            >
                                Something went wrong while displaying this page.
                            </Trans>,
                            <Trans
                                key="subtitle-1"
                                i18nKey="myAccount:placeholders.genericError.subtitles.1"
                            >
                                You can try navigating to other sections using the side panel.
                            </Trans>
                        ] }
                        title={ t("myAccount:placeholders.genericError.title") }
                    />
                </div>
            );
        }

        return children;
    }
}

export default withTranslation()(RouteErrorBoundary);
