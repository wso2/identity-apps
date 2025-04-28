/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import OxygenAlert, { AlertProps } from "@oxygen-ui/react/Alert";
import AppShell from "@oxygen-ui/react/AppShell";
import Container from "@oxygen-ui/react/Container";
import Navbar from "@oxygen-ui/react/Navbar";
import Snackbar from "@oxygen-ui/react/Snackbar";
import useUserPreferences from "@wso2is/common.ui.v1/hooks/use-user-preferences";
import { AlertInterface, AnnouncementBannerInterface, ChildRouteInterface, RouteInterface } from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import {
    RouteUtils as CommonRouteUtils,
    CommonUtils, CookieStorageUtils,
    RouteUtils,
    URLUtils
} from "@wso2is/core/utils";
import { I18n, I18nModuleConstants, LanguageChangeException } from "@wso2is/i18n";
import {
    Alert,
    ContentLoader,
    EmptyPlaceholder,
    ErrorBoundary,
    LinkButton
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import moment from "moment";
import React, { FunctionComponent, PropsWithChildren, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { StaticContext } from "react-router";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { fetchApplications } from "../api";
import { Header, ProtectedRoute } from "../components";
import { getDashboardLayoutRoutes, getEmptyPlaceholderIllustrations } from "../configs";
import { AppConstants, UIConstants } from "../constants";
import { history } from "../helpers";
import { Application, ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";
import { toggleApplicationsPageVisibility } from "../store/actions";
import { AppUtils, CommonUtils as MyAccountCommonUtils, filterRoutes } from "../utils";

/**
 * Dashboard page layout component Prop types.
 */
export interface DashboardLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Dashboard layout.
 *
 * @param props - Props injected to the component.
 * @returns Dashboard Layout component.
 */
export const DashboardLayout: FunctionComponent<PropsWithChildren<DashboardLayoutPropsInterface>> = (
    props: PropsWithChildren<DashboardLayoutPropsInterface & RouteComponentProps>
): ReactElement => {
    const { location } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { setPreferences, leftNavbarCollapsed } = useUserPreferences();

    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const isApplicationsPageVisible: boolean = useSelector((state: AppState) => state.global.isApplicationsPageVisible);

    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(
        getDashboardLayoutRoutes()[ 0 ]
    );
    const [ announcement, setAnnouncement ] = useState<AnnouncementBannerInterface>();
    const [ showAnnouncement, setShowAnnouncement ] = useState<boolean>(true);
    const [ dashboardLayoutRoutes, setDashboardLayoutRoutes ] = useState<RouteInterface[]>(getDashboardLayoutRoutes());
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    useEffect(() => {
        const localeCookie: string = CookieStorageUtils.getItem("ui_lang");

        if (localeCookie) {
            handleLanguageSwitch(localeCookie.replace("_", "-"));
        }
    }, []);

    /**
     * Handles language switch action.
     * @param language - Selected language.
     */
    const handleLanguageSwitch = (language: string): void => {
        moment.locale(language ?? "en");
        I18n.instance.changeLanguage(language).catch((error: string | Record<string, unknown>) => {
            throw new LanguageChangeException(language, error);
        });

        const cookieSupportedLanguage: string = language.replace("-", "_");

        CookieStorageUtils.setCookie(
            I18nModuleConstants.PREFERENCE_STORAGE_KEY,
            cookieSupportedLanguage,
            { days: 30 },
            URLUtils.getDomain(window.location.href),
            { secure: true }
        );
    };


    /**
     * Performs pre-requisites for the side panel items visibility.
     */
    useEffect(() => {
        if (isApplicationsPageVisible !== undefined) {
            return;
        }

        // Fetches the list of applications to see if the list is empty.
        // If it is empty, hides the side panel item.
        fetchApplications(null, null, null)
            .then((response: { applications: Application[]; }) => {
                if (isEmpty(response.applications)) {
                    dispatch(toggleApplicationsPageVisibility(false));

                    return;
                }

                dispatch(toggleApplicationsPageVisibility(true));
            })
            .catch(() => {
                dispatch(toggleApplicationsPageVisibility(false));
            });
    }, [ dispatch, isApplicationsPageVisible ]);

    /**
     * Listen for base name changes and updated the layout routes.
     */
    useEffect(() => {
        if (isApplicationsPageVisible === undefined || !config) {
            return;
        }

        const routes: RouteInterface[] = getDashboardLayoutRoutes().filter((route: RouteInterface) => {

            if (allowedScopes.includes("internal_user_impersonate")) {
                if (route.path === "/") {
                    route.redirectTo = AppConstants.getPaths().get("APPLICATIONS");
                } else if (route.path != AppConstants.getPaths().get("APPLICATIONS")) {
                    return false;
                }
            } else {
                if (route.path === AppConstants.getPaths().get("APPLICATIONS") && !isApplicationsPageVisible) {
                    return false;
                }
            }

            return route;
        });

        setDashboardLayoutRoutes(filterRoutes(routes, config.ui?.features));
    }, [ AppConstants.getTenantQualifiedAppBasename(), config, isApplicationsPageVisible, allowedScopes ]);

    /**
     * On location change, update the selected route.
     */
    useEffect(() => {
        if (!location?.pathname) {
            return;
        }

        setSelectedRoute(CommonRouteUtils.getInitialActiveRoute(location.pathname, dashboardLayoutRoutes));
    }, [ location.pathname, dashboardLayoutRoutes ]);

    /**
     * Handles alert system initialize action.
     *
     * @param system - Alert system instance.
     */
    const handleAlertSystemInitialize = (system: System) => {
        dispatch(initializeAlertSystem(system));
    };

    useEffect(() => {
        if (isEmpty(config)) {
            return;
        }

        if (
            !config?.ui?.announcements ||
            !(config?.ui?.announcements instanceof Array) ||
            config?.ui?.announcements.length < 1
        ) {
            return;
        }

        setAnnouncement(
            CommonUtils.getValidAnnouncement(config.ui.announcements, MyAccountCommonUtils.getSeenAnnouncements())
        );
    }, [ config ]);

    const handleAnnouncementDismiss = () => {
        setShowAnnouncement(false);
    };

    /**
     * Callback for side panel hamburger click.
     */
    const handleSidePanelToggleClick = (): void => {
        setPreferences({ leftNavbarCollapsed: !leftNavbarCollapsed });
    };

    return (
        <>
            <Alert
                dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ alert }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
            { announcement ? (
                <Snackbar
                    open={ showAnnouncement }
                    anchorOrigin={ { horizontal: "center", vertical: "top" } }
                    onClose={ handleAnnouncementDismiss }
                >
                    <OxygenAlert
                        severity={ announcement.color as AlertProps[ "severity" ] }
                        onClose={ handleAnnouncementDismiss }
                    >
                        { announcement.message }
                    </OxygenAlert>
                </Snackbar>
            ) : null }
            <AppShell
                header={ <Header handleSidePanelToggleClick={ handleSidePanelToggleClick } /> }
                navigation={ (
                    <Navbar
                        items={ [
                            {
                                id: "myaccount-navbar",
                                items: RouteUtils.sanitizeForUI(dashboardLayoutRoutes, []).map(
                                    (route: RouteInterface) => {
                                        return {
                                            "data-componentid": `side-panel-items-${ kebabCase(route.id) }`,
                                            "data-testid":  `side-panel-items-${ kebabCase(route.id) }`,
                                            icon: route.icon,
                                            label: t(route.name),
                                            onClick: () => history.push(route.path),
                                            selected: selectedRoute?.path === route.path
                                        };
                                    }
                                ),
                                label: ""
                            }
                        ] }
                        fill={ "solid" }
                        open={ !leftNavbarCollapsed as boolean }
                        collapsible={ false }
                    />
                ) }
            >
                <Container maxWidth="lg">
                    <ErrorBoundary
                        onChunkLoadError={ AppUtils.onChunkLoadError }
                        fallback={ (
                            <EmptyPlaceholder
                                action={
                                    (<LinkButton onClick={ () => CommonUtils.refreshPage() }>
                                        { t("myAccount:placeholders.genericError.action") }
                                    </LinkButton>)
                                }
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
                        <Suspense fallback={ <ContentLoader /> }>
                            <Switch>
                                { dashboardLayoutRoutes.map((route: RouteInterface, index: number) =>
                                    route.redirectTo
                                        ? (
                                            <Redirect to={ route.redirectTo } key={ index } />
                                        ) : route.protected ? (
                                            <ProtectedRoute
                                                component={ route.component ? route.component : null }
                                                path={ route.path }
                                                key={ index }
                                                exact={ route.exact }
                                            />
                                        ) : (
                                            <Route
                                                path={ route.path }
                                                render={ (
                                                    renderProps: RouteComponentProps<
                                                    {
                                                        [ x: string ]: string;
                                                    },
                                                    StaticContext,
                                                    unknown
                                                >
                                                ) => (route.component ? <route.component { ...renderProps } /> : null) }
                                                key={ index }
                                                exact={ route.exact }
                                            />
                                        )
                                ) }
                            </Switch>
                        </Suspense>
                    </ErrorBoundary>
                </Container>
            </AppShell>
        </>
    );
};

/**
 * Default props for the component.
 */
DashboardLayout.defaultProps = {
    fluid: true
};
