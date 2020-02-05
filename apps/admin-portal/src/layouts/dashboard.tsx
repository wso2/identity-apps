/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { getProfileInfo } from "@wso2is/core/api";
import { AuthReducerStateInterface, ChildRouteInterface, RouteInterface } from "@wso2is/core/models";
import { ContextUtils } from "@wso2is/core/utils";
import { Footer, Header, Logo, ProductBrand, SidePanel } from "@wso2is/react-components";
import classNames from "classnames";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Responsive } from "semantic-ui-react";
import { ProtectedRoute } from "../components";
import { dashboardLayoutRoutes, LogoImage, routes, SidePanelIcons, SidePanelMiscIcons } from "../configs";
import { UIConstants } from "../constants";
import { history } from "../helpers";
import { AppState } from "../store";

/**
 * Default header height to be used in state initialisations
 * @type {number}
 */
const DEFAULT_HEADER_HEIGHT: number = 59;
/**
 * Default footer height to be used in state initialisations
 * @type {number}
 */
const DEFAULT_FOOTER_HEIGHT: number = 60;

/**
 * Dashboard layout Prop types.
 */
interface DashboardLayoutPropsInterface {
    fluid?: boolean;
}

/**
 * Dashboard layout.
 *
 * @return {JSX.Element}
 */
export const DashboardLayout: React.FunctionComponent<DashboardLayoutPropsInterface> = (
    props: DashboardLayoutPropsInterface
): JSX.Element => {

    const { fluid } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const profileDetails: AuthReducerStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);

    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(routes[0]);
    const [ mobileSidePanelVisibility, setMobileSidePanelVisibility ] = React.useState<boolean>(false);
    const [ headerHeight, setHeaderHeight ] = React.useState<number>(DEFAULT_HEADER_HEIGHT);
    const [ footerHeight, setFooterHeight ] = React.useState<number>(DEFAULT_FOOTER_HEIGHT);
    const [ isMobileViewport, setIsMobileViewport ] = React.useState<boolean>(false);

    const classes = classNames(
        "layout",
        "dashboard-layout",
        {
            [ "fluid-dashboard-layout" ]: fluid
        }
    );

    useEffect(() => {
        if (_.isEmpty(profileDetails)) {
            dispatch(getProfileInfo(() => null));
        }
    }, []);

    useEffect(() => {
        setSelectedRoute(getInitialActiveRoute());
    }, []);

    useEffect(() => {
        if (headerHeight === document.getElementById("app-header").offsetHeight) {
            return;
        }
        setHeaderHeight(document.getElementById("app-header").offsetHeight);
    });

    useEffect(() => {
        if (footerHeight === document.getElementById("app-footer").offsetHeight) {
            return;
        }
        setFooterHeight(document.getElementById("app-footer").offsetHeight);
    });

    /**
     * Gets the active route on initial app loading time.
     *
     * @return { RouteInterface | ChildRouteInterface } Initially active route.
     */
    const getInitialActiveRoute = (): RouteInterface | ChildRouteInterface => {
        let found: boolean = false;
        let activeRoute: RouteInterface | ChildRouteInterface = null;

        const recurse = (routesArr: RouteInterface[] | ChildRouteInterface[]) => {
            for (const route of routesArr) {
                activeRoute = route;

                if (isActiveRoute(route)) {
                    found = true;
                    break;
                } else {
                    if (route.children && route.children.length && route.children.length > 0) {
                        recurse(route.children);
                        if (found) {
                            break;
                        }
                    }
                }
                activeRoute = null;
            }
        };

        recurse(routes);

        return activeRoute;
    };

    /**
     * Handles side panel toggle click.
     */
    const handleSidePanelToggleClick = () => {
        setMobileSidePanelVisibility(!mobileSidePanelVisibility);
    };

    /**
     * Handles side panel pusher on click.
     */
    const handleSidePanelPusherClick = () => {
        setMobileSidePanelVisibility(false);
    };

    /**
     * Handles side panel item click event.
     *
     * @param { RouteInterface | ChildRouteInterface } route - Clicked on route.
     */
    const handleSidePanelItemClick = (route: RouteInterface | ChildRouteInterface) => {
        if (!route.children) {
            setSelectedRoute(route);
            history.push(route.path);

            if (isMobileViewport) {
                setMobileSidePanelVisibility(false);
            }
        }
    };

    /**
     * Checks if the URL path is similar to the path of the route that's passed in.
     *
     * @param { Route | ChildRoute } route - Route to be evaluated.
     * @return {boolean} If the route is active or not.
     */
    const isActiveRoute = (route: RouteInterface | ChildRouteInterface): boolean => {
        const pathname = window.location.pathname.split("/").pop();
        if (route.path) {
            const urlTokens = route.path.split("/");
            return pathname === urlTokens[1];
        } else if (!route.path && route.children && route.children.length > 0) {
            return route.children.some((childRoute) => {
                return pathname === childRoute.path
            })
        }
    };

    /**
     * Handles the layout on change event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - On change event.
     * @param {any} width - Width of the browser window.
     */
    const handleLayoutOnUpdate = (event: React.SyntheticEvent<HTMLElement>, { width }) => {
        if (width < Responsive.onlyTablet.minWidth) {
            setIsMobileViewport(true);
            return;
        }

        if (!isMobileViewport) {
            return;
        }

        setIsMobileViewport(false);
    };

    return (
        <Responsive
            className={ classes }
            fireOnMount
            onUpdate={ handleLayoutOnUpdate }
        >
            <Header
                brand={ (
                    <ProductBrand
                        style={ { marginTop: 0 } }
                        logo={ <Logo image={ LogoImage }  /> }
                        name={ ContextUtils.getRuntimeConfig().applicationName }
                    />
                ) }
                brandLink={ ContextUtils.getRuntimeConfig().appHomePath }
                basicProfileInfo={ profileDetails }
                fluid={ !isMobileViewport ? fluid : false }
                isProfileInfoLoading={ isProfileInfoLoading }
                userDropdownLinks={ [
                    {
                        name: "Logout",
                        to: "/logout"
                    }
                ] }
                profileInfo={ profileDetails.profileInfo }
                showUserDropdown={ true }
                onSidePanelToggleClick={ handleSidePanelToggleClick }
            />
            <SidePanel
                bordered="right"
                caretIcon={ SidePanelMiscIcons.caretRight }
                desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
                fluid={ !isMobileViewport ? fluid : false }
                footerHeight={ footerHeight }
                headerHeight={ headerHeight }
                mobileSidePanelVisibility={ mobileSidePanelVisibility }
                onSidePanelItemClick={ handleSidePanelItemClick }
                onSidePanelPusherClick={ handleSidePanelPusherClick }
                icons={ SidePanelIcons }
                routes={ routes }
                selected={ selectedRoute }
            >
                <Switch>
                    {
                        dashboardLayoutRoutes.map((route, index) => {
                            if (route.children && route.children.length > 0) {
                                return route.children.map((child, i) => {
                                    return (
                                        child.protected ?
                                            (
                                                <ProtectedRoute
                                                    component={ child.component }
                                                    path={ child.path }
                                                    key={ i }
                                                />
                                            )
                                            :
                                            (
                                                <Route
                                                    path={ child.path }
                                                    render={ (renderProps) =>
                                                        (<child.component { ...renderProps } />)
                                                    }
                                                    key={ i }
                                                />
                                            )
                                    );
                                });
                            }
                            return (
                                route.protected ?
                                    (
                                        <ProtectedRoute
                                            component={ route.component }
                                            path={ route.path }
                                            key={ index }
                                        />
                                    )
                                    :
                                    (
                                        <Route
                                            path={ route.path }
                                            render={ (renderProps) =>
                                                (<route.component { ...renderProps } />)
                                            }
                                            key={ index }
                                        />
                                    )
                            );
                        })
                    }
                </Switch>
            </SidePanel>
            <Footer
                copyright={
                    ContextUtils.getRuntimeConfig().copyrightText
                        ? ContextUtils.getRuntimeConfig().copyrightText
                        : null
                }
                fixed="bottom"
                fluid={ !isMobileViewport ? fluid : false }
                links={ [
                    {
                        name: t("common:privacy"),
                        to: "/privacy"
                    }
                ] }
            />
        </Responsive>
    );
};

/**
 * Default props for the dashboard layout.
 */
DashboardLayout.defaultProps = {
    fluid: true
};
