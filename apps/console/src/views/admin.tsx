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
import { AlertInterface, ChildRouteInterface, ProfileInfoInterface, RouteInterface } from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import { RouteUtils } from "@wso2is/core/utils";
import {
    Alert,
    ContentLoader,
    DashboardLayout as DashboardLayoutSkeleton,
    SidePanel,
    TopLoadingBar
} from "@wso2is/react-components";
import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    Suspense,
    SyntheticEvent,
    lazy,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Responsive } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    FeatureConfigInterface,
    Footer,
    Header,
    ProtectedRoute,
    SidePanelIcons,
    SidePanelMiscIcons,
    UIConstants,
    adminViewRoutes,
    history
} from "../features/core";
import { GovernanceConnectorCategoryInterface, GovernanceConnectorUtils } from "../features/server-configurations";

/**
 * Admin View Prop types.
 */
interface AdminViewPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Parent component for Admin features inherited from Dashboard layout skeleton.
 *
 * @param {AdminViewPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AdminView: FunctionComponent<AdminViewPropsInterface> = (
    props: AdminViewPropsInterface & RouteComponentProps
): ReactElement => {

    const {
        fluid,
        location
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const isAJAXTopLoaderVisible: boolean = useSelector((state: AppState) => state.global.isAJAXTopLoaderVisible);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);
    const governanceConnectorCategories: GovernanceConnectorCategoryInterface[] = useSelector(
        (state: AppState) => state.governanceConnector.categories);
    const [ governanceConnectorRoutesAdded, setGovernanceConnectorRoutesAdded ] = useState<boolean>(false);

    const [ filteredRoutes, setFilteredRoutes ] = useState<RouteInterface[]>(adminViewRoutes);
    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(adminViewRoutes[ 0 ]);
    const [ mobileSidePanelVisibility, setMobileSidePanelVisibility ] = useState<boolean>(false);
    const [ headerHeight, setHeaderHeight ] = useState<number>(UIConstants.DEFAULT_HEADER_HEIGHT);
    const [ footerHeight, setFooterHeight ] = useState<number>(UIConstants.DEFAULT_FOOTER_HEIGHT);
    const [ isMobileViewport, setIsMobileViewport ] = useState<boolean>(false);

    useEffect(() => {
        const pathname = location.pathname.replace(config.deployment.appBaseName, "");
        setSelectedRoute(RouteUtils.getInitialActiveRoute(pathname, filteredRoutes));
    }, [ filteredRoutes ]);

    useEffect(() => {
        // Filter the routes and get only the enabled routes defined in the app config.
        setFilteredRoutes(RouteUtils.filterEnabledRoutes<FeatureConfigInterface>(adminViewRoutes, featureConfig,
            allowedScopes));

        if (isEmpty(profileInfo)) {
            dispatch(getProfileInfo(null));
        }
    }, []);

    useEffect(() => {
        if (headerHeight === document.getElementById("app-header").offsetHeight) {
            return;
        }
        setHeaderHeight(document.getElementById("app-header").offsetHeight - UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT);
    });

    useEffect(() => {
        if (footerHeight === document.getElementById("app-footer").offsetHeight) {
            return;
        }
        setFooterHeight(document.getElementById("app-footer").offsetHeight);
    });

    useEffect(() => {
        if (governanceConnectorCategories !== undefined && governanceConnectorCategories.length > 0) {
            if (!governanceConnectorRoutesAdded) {

                const filteredRoutesClone = [ ...filteredRoutes ];

                governanceConnectorCategories.map((category: GovernanceConnectorCategoryInterface) => {
                    let subCategoryExists = false;
                    category.connectors?.map(connector => {
                        if (connector.subCategory !== "DEFAULT") {
                            subCategoryExists = true;
                            return;
                        }
                    });
                    if (subCategoryExists) {
                        // TODO: Implement sub category handling logic here.
                    }

                    filteredRoutesClone.unshift({
                        category: "adminPortal:components.sidePanel.categories.configurations",
                        component: lazy(() => import("../features/server-configurations/pages/governance-connectors")),
                        exact: true,
                        icon: {
                            icon: SidePanelIcons.connectors[ category.name ] ?? SidePanelIcons.connectors.default
                        },
                        id: category.id,
                        name: category.name,
                        path: AppConstants.PATHS.get("GOVERNANCE_CONNECTORS").replace(":id", category.id),
                        protected: true,
                        showOnSidePanel: true
                    });
                });

                setFilteredRoutes(filteredRoutesClone);
                setGovernanceConnectorRoutesAdded(true);
            }
        } else {
            GovernanceConnectorUtils.getGovernanceConnectors();
        }
    }, [ governanceConnectorCategories ]);

    /**
     * Handles side panel toggle click.
     */
    const handleSidePanelToggleClick = (): void => {
        setMobileSidePanelVisibility(!mobileSidePanelVisibility);
    };

    /**
     * Handles side panel pusher on click.
     */
    const handleSidePanelPusherClick = (): void => {
        setMobileSidePanelVisibility(false);
    };

    /**
     * Handles side panel item click event.
     *
     * @param { RouteInterface | ChildRouteInterface } route - Clicked on route.
     */
    const handleSidePanelItemClick = (route: RouteInterface | ChildRouteInterface): void => {
        if (route.path) {
            setSelectedRoute(route);
            history.push(route.path);

            if (isMobileViewport) {
                setMobileSidePanelVisibility(false);
            }
        }
    };

    /**
     * Handles the layout on change event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - On change event.
     * @param {any} width - Width of the browser window.
     */
    const handleLayoutOnUpdate = (event: SyntheticEvent<HTMLElement>, { width }): void => {
        if (width < Responsive.onlyTablet.minWidth) {
            setIsMobileViewport(true);
            return;
        }

        if (!isMobileViewport) {
            return;
        }

        setIsMobileViewport(false);
    };

    /**
     * Conditionally renders a route. If a route has defined a Redirect to
     * URL, it will be directed to the specified one. If the route is stated
     * as protected, It'll be rendered using the `ProtectedRoute`.
     *
     * @param route - Route to be rendered.
     * @param key - Index of the route.
     * @return {React.ReactNode} Resolved route to be rendered.
     */
    const renderRoute = (route, key): ReactNode => (
        route.redirectTo
            ? <Redirect key={ key } to={ route.redirectTo }/>
            : route.protected
            ? (
                <ProtectedRoute
                    component={ route.component ? route.component : null }
                    path={ route.path }
                    key={ key }
                    exact={ route.exact }
                />
            )
            : (
                <Route
                    path={ route.path }
                    render={ (renderProps): ReactNode =>
                        route.component
                            ? <route.component { ...renderProps } />
                            : null
                    }
                    key={ key }
                    exact={ route.exact }
                />
            )
    );

    /**
     * Resolves the set of routes for the react router.
     * This function recursively adds any child routes
     * defined.
     *
     * @return {RouteInterface[]} Set of resolved routes.
     */
    const resolveRoutes = (): RouteInterface[] => {
        const resolvedRoutes = [];

        const recurse = (routesArr): void => {
            routesArr.forEach((route, key) => {
                if (route.path) {
                    resolvedRoutes.push(renderRoute(route, key))
                }

                if (route.children && route.children instanceof Array && route.children.length > 0) {
                    recurse(route.children);
                }
            })
        };

        recurse([ ...filteredRoutes ]);

        return resolvedRoutes;
    };

    const handleAlertSystemInitialize = (system) => {
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
            onLayoutOnUpdate={ handleLayoutOnUpdate }
            header={ (
                <Header
                    activeView="ADMIN"
                    fluid={ !isMobileViewport ? fluid : false }
                    onSidePanelToggleClick={ handleSidePanelToggleClick }
                />
            ) }
            sidePanel={ (
                <SidePanel
                    categorized
                    caretIcon={ SidePanelMiscIcons.caretRight }
                    desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
                    fluid={ !isMobileViewport ? fluid : false }
                    footerHeight={ footerHeight }
                    headerHeight={ headerHeight }
                    hoverType="background"
                    mobileSidePanelVisibility={ mobileSidePanelVisibility }
                    onSidePanelItemClick={ handleSidePanelItemClick }
                    onSidePanelPusherClick={ handleSidePanelPusherClick }
                    routes={ RouteUtils.sanitizeForUI(cloneDeep(filteredRoutes)) }
                    selected={ selectedRoute }
                    translationHook={ t }
                    allowedScopes={ allowedScopes }
                />
            ) }
            footer={ (
                <Footer
                    showLanguageSwitcher
                    fluid={ !isMobileViewport ? fluid : false }
                />
            ) }
        >
            <Suspense fallback={ <ContentLoader dimmer/> }>
                <Switch>
                    { resolveRoutes() }
                </Switch>
            </Suspense>
        </DashboardLayoutSkeleton>
    );
};

/**
 * Default props for the Admin View.
 */
AdminView.defaultProps = {
    fluid: true
};
