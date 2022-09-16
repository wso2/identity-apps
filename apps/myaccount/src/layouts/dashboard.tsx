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

import { AlertInterface, ChildRouteInterface, RouteInterface } from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import { RouteUtils as CommonRouteUtils, CommonUtils, RouteUtils } from "@wso2is/core/utils";
import {
    Alert,
    DashboardLayout as DashboardLayoutSkeleton,
    EmptyPlaceholder,
    ErrorBoundary,
    LinkButton,
    Media,
    SidePanel,
    TopLoadingBar,
    useMediaContext,
    useUIElementSizes
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, PropsWithChildren, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { fetchApplications } from "../api";
import {
    Footer,
    Header,
    PreLoader,
    ProtectedRoute
} from "../components";
import { getDashboardLayoutRoutes, getEmptyPlaceholderIllustrations } from "../configs";
import { AppConstants, UIConstants } from "../constants";
import { history } from "../helpers";
import { ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";
import { toggleApplicationsPageVisibility } from "../store/actions";
import { AppUtils, filterRoutes } from "../utils";

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
    const dispatch = useDispatch();
    const { isMobileViewport } = useMediaContext();
    const { headerHeight, footerHeight } = useUIElementSizes({
        footerHeight: UIConstants.DEFAULT_FOOTER_HEIGHT,
        headerHeight: UIConstants.DEFAULT_HEADER_HEIGHT,
        topLoadingBarHeight: UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT
    });

    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const isAJAXTopLoaderVisible: boolean = useSelector((state: AppState) => state.global.isGlobalLoaderVisible);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isApplicationsPageVisible = useSelector((state: AppState) => state.global.isApplicationsPageVisible);

    const [
        selectedRoute,
        setSelectedRoute
    ] = useState<RouteInterface | ChildRouteInterface>(getDashboardLayoutRoutes()[ 0 ]);
    const [ mobileSidePanelVisibility, setMobileSidePanelVisibility ] = useState(false);
    const [ dashboardLayoutRoutes, setDashboardLayoutRoutes ] = useState<RouteInterface[]>(getDashboardLayoutRoutes());

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
            .then((response) => {
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

        const routes: RouteInterface[] = getDashboardLayoutRoutes()
            .filter((route: RouteInterface) => {
                if (route.path === AppConstants.getPaths().get("APPLICATIONS") && !isApplicationsPageVisible) {
                    return false;
                }

                return route;
            });

        setDashboardLayoutRoutes(filterRoutes(routes, config.ui?.features));
    }, [ AppConstants.getTenantQualifiedAppBasename(), config, isApplicationsPageVisible ]);

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
     * Callback for side panel hamburger click.
     */
    const handleSidePanelToggleClick = (): void => {
        setMobileSidePanelVisibility(!mobileSidePanelVisibility);
    };

    /**
     * Callback for side panel pusher click.
     */
    const handleSidePanelPusherClick = (): void => {
        setMobileSidePanelVisibility(false);
    };

    /**
     * Handles side panel item click event.
     *
     * @param route - Clicked on route.
     */
    const handleSidePanelItemClick = (route: RouteInterface | ChildRouteInterface): void => {
        if (!route.path) {
            return;
        }

        setSelectedRoute(route);
        history.push(route.path);

        if (isMobileViewport) {
            setMobileSidePanelVisibility(false);
        }
    };

    /**
     * Handles alert system initialize action.
     *
     * @param system - Alert system instance.
     */
    const handleAlertSystemInitialize = (system: System) => {
        dispatch(initializeAlertSystem(system));
    };

    return (
        <DashboardLayoutSkeleton
            alert={ (
                <Alert
                    dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
                    alertsPosition="br"
                    alertSystem={ alertSystem }
                    alert={ alert }
                    onAlertSystemInitialize={ handleAlertSystemInitialize }
                    withIcon={ true }
                />
            ) }
            topLoadingBar={ (
                <TopLoadingBar
                    height={ UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT }
                    visibility={ isAJAXTopLoaderVisible }
                />
            ) }
            header={ (
                <Header
                    fluid={ false }
                    onSidePanelToggleClick={ handleSidePanelToggleClick }
                />
            ) }
            sidePanel={ (
                <SidePanel
                    desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
                    fluid={ false }
                    footerHeight={ footerHeight }
                    headerHeight={ headerHeight }
                    hoverType="background"
                    mobileSidePanelVisibility={ mobileSidePanelVisibility }
                    onSidePanelItemClick={ handleSidePanelItemClick }
                    onSidePanelPusherClick={ handleSidePanelPusherClick }
                    routes={ RouteUtils.sanitizeForUI(dashboardLayoutRoutes, []) }
                    selected={ selectedRoute }
                    translationHook={ t }
                    allowedScopes={ allowedScopes }
                />
            ) }
            footer={ (
                <Media greaterThan="mobile">
                    <Footer fluid={ false } />
                </Media>
            ) }
        >
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
                            dashboardLayoutRoutes.map((route, index) => (
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
            </ErrorBoundary>
        </DashboardLayoutSkeleton>
    );
};

/**
 * Default props for the component.
 */
DashboardLayout.defaultProps = {
    fluid: true
};
