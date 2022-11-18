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

import { ChildRouteInterface, RouteInterface } from "@wso2is/core/models";
import { RouteUtils as CommonRouteUtils, CommonUtils, RouteUtils } from "@wso2is/core/utils";
import {
    ContentLoader,
    DashboardLayout as DashboardLayoutSkeleton,
    EmptyPlaceholder,
    ErrorBoundary,
    LinkButton,
    SidePanel,
    useMediaContext,
    useUIElementSizes
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, PropsWithChildren, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { fetchApplications } from "../api";
import { ProtectedRoute } from "../components";
import { getDashboardLayoutRoutes, getEmptyPlaceholderIllustrations } from "../configs";
import { AppConstants, UIConstants } from "../constants";
import { history } from "../helpers";
import { ApplicationList, ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";
import { setMobileSidePanelVisibility, toggleApplicationsPageVisibility } from "../store/actions";
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

    const {
        fluid,
        location
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { isMobileViewport } = useMediaContext();
    const { headerHeight, footerHeight } = useUIElementSizes({
        footerHeight: UIConstants.DEFAULT_FOOTER_HEIGHT,
        headerHeight: UIConstants.DEFAULT_HEADER_HEIGHT,
        topLoadingBarHeight: UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT
    });

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isApplicationsPageVisible: boolean = useSelector((state: AppState) => state.global.isApplicationsPageVisible);
    const isMobileSidePanelVisible: boolean = useSelector((state: AppState) => state.global.isMobileSidePanelVisible);

    const [
        selectedRoute,
        setSelectedRoute
    ] = useState<RouteInterface | ChildRouteInterface>(getDashboardLayoutRoutes()[ 0 ]);
    const [ dashboardLayoutRoutes, setDashboardLayoutRoutes ] = useState<RouteInterface[]>([]);

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
            .then((response: ApplicationList) => {
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
     * Handles side panel pusher on click.
     */
    const handleSidePanelPusherClick = (): void => {
        dispatch(setMobileSidePanelVisibility(false));
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

        if (isMobileViewport) {
            dispatch(setMobileSidePanelVisibility(false));
        }

        setSelectedRoute(route);
        history.push(route.path);
    };

    return (
        <DashboardLayoutSkeleton
            fluid={ fluid }
            sidePanel={ (
                <SidePanel
                    desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
                    fluid={ false }
                    footerHeight={ footerHeight }
                    headerHeight={ headerHeight }
                    hoverType="background"
                    mobileSidePanelVisibility={ isMobileSidePanelVisible }
                    onSidePanelItemClick={ handleSidePanelItemClick }
                    onSidePanelPusherClick={ handleSidePanelPusherClick }
                    routes={ RouteUtils.sanitizeForUI(dashboardLayoutRoutes, []) }
                    selected={ selectedRoute }
                    translationHook={ t }
                    allowedScopes={ allowedScopes }
                />
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
                <Suspense fallback={ <ContentLoader /> }>
                    <Switch>
                        {
                            dashboardLayoutRoutes.map((route: RouteInterface, index: number) => (
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
