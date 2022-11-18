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

import { ChildRouteInterface, ProfileInfoInterface, RouteInterface } from "@wso2is/core/models";
import { setMobileSidePanelVisibility } from "@wso2is/core/store";
import {
    ContentLoader,
    DashboardLayout as DashboardLayoutSkeleton,
    SidePanel,
    SidePanelPropsInterface,
    useMediaContext,
    useUIElementSizes
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    Suspense,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { commonConfig } from "../extensions";
import { getProfileInformation } from "../features/authentication/store";
import {
    AppConstants,
    AppState,
    AppViewTypes,
    ProtectedRoute,
    StrictAppViewTypes,
    UIConstants,
    getDashboardLayoutRoutes,
    getSidePanelMiscIcons,
    history
} from "../features/core";
import { setSelectedRoute } from "../features/core/store/actions";

/**
 * Prop-types of Dashboard layout component.
 */
interface DashboardLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Dashboard page layout.
 *
 * @param props - Props injected to the dashboard page layout component.
 * @returns Dashboard Layout.
 */
export const DashboardLayout: FunctionComponent<DashboardLayoutPropsInterface> = (
    props: DashboardLayoutPropsInterface
): ReactElement => {

    const {
        fluid
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();
    const { headerHeight, footerHeight } = useUIElementSizes({
        footerHeight: UIConstants.DEFAULT_FOOTER_HEIGHT,
        headerHeight: UIConstants.DEFAULT_HEADER_HEIGHT,
        topLoadingBarHeight: UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT
    });

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const organizationLoading: boolean = useSelector((state: AppState) => state?.organization?.getOrganizationLoading);
    const activeView: AppViewTypes = useSelector((state: AppState) => state.global.activeView);
    const selectedRoute: RouteInterface = useSelector((state: AppState) => state.routes?.selectedRoute);
    const isMobileSidePanelVisible: boolean = useSelector((state: AppState) => state.global.isMobileSidePanelVisible);
    const isLeftNavigationCategorized: boolean = useSelector((state: AppState) => {
        return state.config?.ui?.isLeftNavigationCategorized;
    });
    const sanitizedDevelopRoutes: RouteInterface[] = useSelector((state: AppState) => {
        return state.routes?.developeRoutes?.sanitizedRoutes;
    });
    const sanitizedManageRoutes: RouteInterface[] = useSelector((state: AppState) => {
        return state.routes?.manageRoutes?.sanitizedRoutes;
    });

    const [ routes, setRoutes ] = useState<(RouteInterface | ChildRouteInterface)[]>([]);
    const [ sidePanelOptions, setSidePanelOptions ] = useState<Partial<SidePanelPropsInterface>>({});
    const [ dashboardLayoutRoutes, setDashboardLayoutRoutes ] = useState<RouteInterface[]>(getDashboardLayoutRoutes());

    /**
     * Listen for base name changes and updated the layout routes.
     */
    useEffect(() => {
        setDashboardLayoutRoutes(getDashboardLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    /**
     * Fetch profile info if not available in redux store.
     */
    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            return;
        }

        dispatch(getProfileInformation());
    }, [ dispatch, profileInfo ]);

    /**
     * Set view specific states.
     */
    useEffect(() => {
        if (organizationLoading) {
            setRoutes([]);

            return;
        }

        if (activeView === StrictAppViewTypes.DEVELOP) {
            setSidePanelOptions({
                categorized: isLeftNavigationCategorized !== undefined
                    ? isLeftNavigationCategorized && commonConfig?.leftNavigation?.isLeftNavigationCategorized?.develop
                    : true,
                ordered: true
            });
            setRoutes(sanitizedDevelopRoutes);

            return;
        }

        if (activeView === StrictAppViewTypes.MANAGE) {
            setSidePanelOptions({
                categorized: isLeftNavigationCategorized !== undefined
                    ? isLeftNavigationCategorized && commonConfig?.leftNavigation?.isLeftNavigationCategorized?.manage
                    : true,
                skipCategoryLabelForSingleItemCategories: false
            });
            setRoutes(sanitizedManageRoutes);

            return;
        }

        setRoutes([]);
    }, [ activeView, sanitizedManageRoutes, sanitizedDevelopRoutes ]);

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

        dispatch(setSelectedRoute(route));
        history.push(route.path);
    };

    return (
        <DashboardLayoutSkeleton
            fluid={ fluid }
            sidePanel={  (
                <SidePanel
                    caretIcon={ getSidePanelMiscIcons().caretRight }
                    desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
                    fluid={ fluid }
                    footerHeight={ footerHeight }
                    headerHeight={ headerHeight }
                    hoverType="background"
                    mobileSidePanelVisibility={ isMobileSidePanelVisible }
                    onSidePanelItemClick={ handleSidePanelItemClick }
                    onSidePanelPusherClick={ handleSidePanelPusherClick }
                    translationHook={ t }
                    allowedScopes={ allowedScopes }
                    routes={ routes }
                    selected={ selectedRoute }
                    { ...sidePanelOptions }
                />
            ) }
        >
            <Suspense fallback={ <ContentLoader dimmer={ false } /> }>
                <Switch>
                    {
                        dashboardLayoutRoutes.map((route, index) => (
                            route.redirectTo
                                ? <Redirect to={ route.redirectTo }/>
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
        </DashboardLayoutSkeleton>
    );
};

/**
 * Default props for the component.
 */
DashboardLayout.defaultProps = {
    fluid: true
};
