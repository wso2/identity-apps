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
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Button, Responsive } from "semantic-ui-react";
import { ProtectedRoute } from "../components";
import { LogoImage, routes, SidePanelIcons, SidePanelMiscIcons } from "../configs";
import { UIConstants } from "../constants";
import { AppConfig, history } from "../helpers";
import { AppConfigInterface } from "../models";
import { AppState } from "../store";
import { filteredRoutes } from "../utils";
import { BaseLayout } from "./base";

/**
 * Dashboard layout Prop types.
 */
interface DashboardLayoutPropsInterface {
    fluid?: boolean;
}

/**
 * Dashboard layout.
 *
 * @param {DashboardLayoutPropsInterface} props - Props injected to the component.
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
    const [ headerHeight, setHeaderHeight ] = React.useState<number>(UIConstants.DEFAULT_HEADER_HEIGHT);
    const [ footerHeight, setFooterHeight ] = React.useState<number>(UIConstants.DEFAULT_FOOTER_HEIGHT);
    const [ isMobileViewport, setIsMobileViewport ] = React.useState<boolean>(false);

    const appConfig: AppConfigInterface = useContext(AppConfig);

    const classes = classNames(
        "layout",
        "dashboard-layout",
        {
            ["fluid-dashboard-layout"]: fluid
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

                // Terminate the evaluation if the route is
                // not supposed to be displayed on the side panel.
                if (!route.showOnSidePanel) {
                    return;
                }

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
                return pathname === childRoute.path;
            });
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
        <BaseLayout>
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
                    userDropdownInfoAction={ (
                        <Button
                            size="tiny"
                            primary
                            onClick={
                                () => {
                                    window.open(`${USER_PORTAL_CLIENT_HOST_DEFAULT}/${USER_PORTAL_BASENAME}`);
                                }
                            }
                        >
                            { t("common:personalInfo") }
                        </Button>
                    ) }
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
                    routes={ appConfig && filteredRoutes(appConfig) }
                    selected={ selectedRoute }
                >
                    <Switch>
                        {
                            appConfig
                            ? filteredRoutes(appConfig).map((route, index) => {
                                if (route.children && route.children.length > 0) {
                                    return route.children.map((child, i) => {
                                        return (
                                            child.redirectTo
                                                ? <Redirect key={ i } to={ child.redirectTo } />
                                                : child.protected
                                                    ? (
                                                        <ProtectedRoute
                                                            component={ child.component ? child.component : null }
                                                            path={ child.path }
                                                            key={ i }
                                                            exact={ child.exact }
                                                        />
                                                    )
                                                    : (
                                                        <Route
                                                            path={ child.path }
                                                            render={ (renderProps) =>
                                                                child.component
                                                                    ? <child.component { ...renderProps } />
                                                                    : null
                                                            }
                                                            key={ i }
                                                            exact={ child.exact }
                                                        />
                                                    )
                                        );
                                    });
                                }
                                return (
                                    route.redirectTo
                                        ? <Redirect key={ index } to={ route.redirectTo } />
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
                                );
                            })
                            : null
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
        </BaseLayout>
    );
};

/**
 * Default props for the dashboard layout.
 */
DashboardLayout.defaultProps = {
    fluid: true
};
