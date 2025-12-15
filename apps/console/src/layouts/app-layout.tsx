/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { PreLoader } from "@wso2is/admin.core.v1/components/pre-loader";
import { ProtectedRoute } from "@wso2is/admin.core.v1/components/protected-route";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { AppUtils } from "@wso2is/admin.core.v1/utils/app-utils";
import { createBrokenPageFallback, createRouteErrorHandler } from "@wso2is/admin.core.v1/utils/error-boundary-utils";
import { RouteInterface } from "@wso2is/core/models";
import {
    CookieConsentBanner,
    ErrorBoundary
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, Suspense, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { getAppLayoutRoutes } from "../configs/routes";

/**
 * Implementation of the Main app layout skeleton.
 * Used to render all the layouts that's being used inside the app.
 *
 * @returns App Layout.
 */
const AppLayout: FunctionComponent<Record<string, unknown>> = (): ReactElement => {

    const { t } = useTranslation();

    const [ appRoutes, setAppRoutes ] = useState<RouteInterface[]>(getAppLayoutRoutes());
    const isCookieConsentBannerEnabled: boolean = useSelector((state: AppState) => {
        return state.config.ui.isCookieConsentBannerEnabled;
    });
    const appHomePath: string = useSelector((state: AppState) => state.config.deployment.appHomePath);

    const handleRouteChunkError: ((_error: Error, _errorInfo: React.ErrorInfo) => void) = createRouteErrorHandler(appHomePath);

    const brokenPageFallback: ReactNode = createBrokenPageFallback(t);

    /**
     * Listen for base name changes and updated the layout routes.
     */
    useEffect(() => {
        setAppRoutes(getAppLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    return (
        <>
            <ErrorBoundary
                onChunkLoadError={ AppUtils.onChunkLoadError }
                handleError={ handleRouteChunkError }
                fallback={ brokenPageFallback }
            >
                <Suspense fallback={ <PreLoader /> }>
                    <Switch>
                        {
                            appRoutes.map((route: RouteInterface, index: number) => (
                                route.redirectTo
                                    ? <Redirect to={ route.redirectTo } key={ index } />
                                    : route.protected
                                        ? (
                                            <ProtectedRoute
                                                component={ route.component ? route.component : null }
                                                path={ route.path }
                                                key={ index }
                                                exact={ route.exact }
                                            />
                                        )
                                        : (
                                            <Route
                                                path={ route.path }
                                                render={ (renderProps: RouteComponentProps) => {
                                                    if (!route.component) {
                                                        return null;
                                                    }

                                                    return (
                                                        <ErrorBoundary
                                                            onChunkLoadError={ AppUtils.onChunkLoadError }
                                                            handleError={ handleRouteChunkError }
                                                            fallback={ brokenPageFallback }
                                                        >
                                                            <route.component { ...renderProps } />
                                                        </ErrorBoundary>
                                                    );
                                                } }
                                                key={ index }
                                                exact={ route.exact }
                                            />
                                        )
                            ))
                        }
                    </Switch>
                </Suspense>
                {
                    isCookieConsentBannerEnabled && (
                        <CookieConsentBanner
                            inverted
                            domainCookie
                            title={ (
                                <div className="title" data-testid="cookie-consent-banner-content-title">
                                    <Trans
                                        i18nKey={ t("console:common.cookieConsent.content") }
                                    >
                                        We use cookies to ensure that you get the best overall experience.
                                        These cookies are used to maintain an uninterrupted continuous
                                        session whilst providing smooth and personalized services.
                                        To learn more about how we use cookies, refer our <a
                                            href={ store.getState()?.config?.ui?.cookiePolicyUrl ?? "" }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-testid="login-page-cookie-policy-link"
                                        >
                                        Cookie Policy
                                        </a>.
                                    </Trans>
                                </div>
                            ) }
                            confirmButtonText={ t("console:common.cookieConsent.confirmButton") }
                        />
                    )
                }
            </ErrorBoundary>
        </>
    );
};

export default AppLayout;
