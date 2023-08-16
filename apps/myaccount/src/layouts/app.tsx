/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
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
                                                render={ (renderProps: RouteComponentProps) =>
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
