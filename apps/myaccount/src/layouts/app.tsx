/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { RouteInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import {
    AppLayout as AppLayoutSkeleton,
    CookieConsentBanner,
    EmptyPlaceholder,
    ErrorBoundary,
    LinkButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { PreLoader, ProtectedRoute } from "../components";
import { getAppLayoutRoutes } from "../configs/routes";
import { getEmptyPlaceholderIllustrations } from "../configs/ui";
import { AppConstants } from "../constants";
import { AppState } from "../store";
import { AppUtils } from "../utils";

/**
 * Implementation of the Main app layout skeleton.
 * Used to render all the layouts that's being used inside the app.
 *
 * @returns App Layout template.
 */
export const AppLayout: FunctionComponent<Record<string, unknown>> = (): ReactElement => {

    const { t } = useTranslation();

    const [ appRoutes, setAppRoutes ] = useState<RouteInterface[]>(getAppLayoutRoutes());
    const isCookieConsentBannerEnabled: boolean = useSelector((state: AppState) => {
        return state.config.ui.isCookieConsentBannerEnabled;
    });

    /**
     * Listen for base name changes and updated the routes.
     */
    useEffect(() => {
        setAppRoutes(getAppLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    return (
        <AppLayoutSkeleton>
            <ErrorBoundary
                onChunkLoadError={ AppUtils.onChunkLoadError }
                fallback={ (
                    <EmptyPlaceholder
                        action={ (
                            <LinkButton onClick={ () => CommonUtils.refreshPage() }>
                                { t("myAccount:placeholders.genericError.action") }
                            </LinkButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().genericError }
                        imageSize="tiny"
                        subtitle={ [
                            t("myAccount:placeholders.genericError.subtitles.0"),
                            t("myAccount:placeholders.genericError.subtitles.1")
                        ] }
                        title={ t("myAccount:placeholders.genericError.title") }
                    />
                ) }
            >
                <Suspense fallback={ <PreLoader /> }>
                    <Switch>
                        {
                            appRoutes.map((route, index) => (
                                route.redirectTo
                                    ? <Redirect to={ route.redirectTo } />
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
                                                render={ (renderProps) =>
                                                    route.component
                                                        ? <route.component { ...renderProps } />
                                                        : null
                                                }
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
                                        i18nKey={ t("myAccount:components.cookieConsent.content") }
                                    >
                                        We use cookies to ensure that you get the best overall experience.
                                        These cookies are used to maintain an uninterrupted continuous
                                        session whilst providing smooth and personalized services.
                                        To learn more about how we use cookies, refer our <a
                                            href="https://wso2.com/cookie-policy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-testid="login-page-cookie-policy-link"
                                        >
                                        Cookie Policy
                                        </a>.
                                    </Trans>
                                </div>
                            ) }
                            confirmButtonText={ t("myAccount:components.cookieConsent.confirmButton") }
                        />
                    )
                }
            </ErrorBoundary>
        </AppLayoutSkeleton>
    );
};
