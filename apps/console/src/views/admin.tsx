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

import { AccessControlUtils } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertInterface, ChildRouteInterface, ProfileInfoInterface, RouteInterface } from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import { RouteUtils as CommonRouteUtils, CommonUtils } from "@wso2is/core/utils";
import {
    Alert,
    ContentLoader,
    DashboardLayout as DashboardLayoutSkeleton,
    EmptyPlaceholder,
    ErrorBoundary,
    LinkButton,
    SidePanel,
    TopLoadingBar
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ErrorInfo,
    FunctionComponent,
    ReactElement,
    ReactNode,
    Suspense,
    SyntheticEvent,
    lazy,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Responsive } from "semantic-ui-react";
import { commonConfig, serverConfigurationConfig } from "../extensions";
import { getProfileInformation } from "../features/authentication/store";
import {
    AppConstants,
    AppState,
    AppUtils,
    AppViewTypes,
    ConfigReducerStateInterface,
    EventPublisher,
    FeatureConfigInterface,
    Footer,
    Header,
    OrganizationReducerStateInterface,
    ProtectedRoute,
    RouteUtils,
    StrictAppViewTypes,
    UIConstants,
    getAdminViewRoutes,
    getDeveloperViewRoutes,
    getEmptyPlaceholderIllustrations,
    getSidePanelIcons,
    getSidePanelMiscIcons,
    history,
    useUIElementSizes
} from "../features/core";
import { setActiveView, setDeveloperVisibility, setManageVisibility } from "../features/core/store/actions";
import { OrganizationUtils } from "../features/organizations/utils";
import {
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorUtils,
    ServerConfigurationsConstants
} from "../features/server-configurations";

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
    const { headerHeight, footerHeight } = useUIElementSizes();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const organization: OrganizationReducerStateInterface = useSelector((state: AppState) => state.organization);
    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const isAJAXTopLoaderVisible: boolean = useSelector((state: AppState) => state.global.isAJAXTopLoaderVisible);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const governanceConnectorCategories: GovernanceConnectorCategoryInterface[] = useSelector(
        (state: AppState) => state.governanceConnector.categories);
    const activeView: AppViewTypes = useSelector((state: AppState) => state.global.activeView);

    const [ governanceConnectorsEvaluated, setGovernanceConnectorsEvaluated ] = useState<boolean>(false);
    const [ governanceConnectorRoutesAdded, setGovernanceConnectorRoutesAdded ] = useState<boolean>(false);
    const [ developRoutes, setDevelopRoutes ] = useState<RouteInterface[]>(getDeveloperViewRoutes());
    const [ filteredRoutes, setFilteredRoutes ] = useState<RouteInterface[]>(getAdminViewRoutes());
    const [
        selectedRoute,
        setSelectedRoute
    ] = useState<RouteInterface | ChildRouteInterface>(getAdminViewRoutes()[ 0 ]);
    const [ mobileSidePanelVisibility, setMobileSidePanelVisibility ] = useState<boolean>(false);
    const [ isMobileViewport, setIsMobileViewport ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const getOrganizationEnabledRoutes = useCallback((): RouteInterface[] => {
        if (!OrganizationUtils.isRootOrganization(organization.organization)) {
            return RouteUtils.filterOrganizationEnabledRoutes(getAdminViewRoutes());
        }

        return getAdminViewRoutes();
    }, [ organization.organization ]);

    useEffect(() => {
        const routes = getOrganizationEnabledRoutes();

        setDevelopRoutes(routes);
        setFilteredRoutes(routes);
    }, [ getOrganizationEnabledRoutes ]);

    /**
     * Make sure `MANAGE` tab is highlighted when this layout is used.
     */
    useEffect(() => {

        if (activeView === StrictAppViewTypes.MANAGE) {
            return;
        }

        dispatch(setActiveView(StrictAppViewTypes.MANAGE));
    }, [ dispatch, activeView ]);

    useEffect(() => {
        // Allowed scopes is never empty. Wait until it's defined to filter the routes.
        if (isEmpty(allowedScopes)) {
            return;
        }

        setFilteredRoutes((prevFilteredRoutes: RouteInterface[]) => {
            const routes: RouteInterface[] = CommonRouteUtils.sanitizeForUI(cloneDeep(prevFilteredRoutes));
            const controlledRoutes = AccessControlUtils.getAuthenticatedRoutes(
                routes, allowedScopes, featureConfig, commonConfig.checkForUIResourceScopes);

            return controlledRoutes;
        });
    }, [ allowedScopes, featureConfig ]);

    useEffect(() => {
        const sanitizedDevelopRoutes: RouteInterface[] = CommonRouteUtils.sanitizeForUI(cloneDeep(developRoutes));

        const tab: string = AccessControlUtils.getDisabledTab(
            filteredRoutes, sanitizedDevelopRoutes, allowedScopes, featureConfig,
            commonConfig.checkForUIResourceScopes);

        if (tab === "MANAGE") {
            dispatch(setManageVisibility(false));
        } else if (tab === "DEVELOP") {
            dispatch(setDeveloperVisibility(false));
        }
    }, [ filteredRoutes, dispatch, allowedScopes, featureConfig, developRoutes ]);


    /**
     * Listen to location changes and set the active route accordingly.
     */
    useEffect(() => {

        if (isEmpty(filteredRoutes) || !location?.pathname) {
            return;
        }

        setSelectedRoute(CommonRouteUtils.getInitialActiveRoute(location.pathname, filteredRoutes));
    }, [ location?.pathname, filteredRoutes ]);

    useEffect(() => {
        setSelectedRoute(CommonRouteUtils.getInitialActiveRoute(location.pathname, filteredRoutes));

        if (governanceConnectorsEvaluated === true) {
            RouteUtils.gracefullyHandleRouting(filteredRoutes,
                AppConstants.getAdminViewBasePath(),
                location.pathname);

            return;
        }
    }, [ filteredRoutes, governanceConnectorsEvaluated, location.pathname ]);

    useEffect(() => {

        // Allowed scopes is never empty. Wait until it's defined to filter the routes.
        if (isEmpty(allowedScopes)) {
            return;
        }

        // Filter the routes and get only the enabled routes defined in the app config.
        setFilteredRoutes(
            CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
                getOrganizationEnabledRoutes(),
                featureConfig,
                allowedScopes,
                commonConfig.checkForUIResourceScopes)
        );

        if (!isEmpty(profileInfo)) {
            return;
        }

        dispatch(getProfileInformation());
    }, [ allowedScopes, featureConfig, dispatch, profileInfo, getOrganizationEnabledRoutes ]);

    useEffect(() => {
        // Allowed scopes is never empty. Wait until it's defined to filter the routes.
        if (isEmpty(allowedScopes)) {
            return;
        }

        if (
            !featureConfig?.governanceConnectors?.enabled ||
            !hasRequiredScopes(
                featureConfig?.governanceConnectors,
                featureConfig?.governanceConnectors?.scopes?.read,
                allowedScopes
            )
        ) {
            setGovernanceConnectorsEvaluated(true);

            return;
        }

        if (!(governanceConnectorCategories !== undefined && governanceConnectorCategories.length > 0)) {
            if (
                !(
                    serverConfigurationConfig.showConnectorsOnTheSidePanel &&
                    hasRequiredScopes(
                        featureConfig.governanceConnectors,
                        featureConfig.governanceConnectors.scopes.read,
                        allowedScopes
                    )
                )
            ) {
                setGovernanceConnectorsEvaluated(true);

                return;
            }

            GovernanceConnectorUtils.getGovernanceConnectors();

            return;
        }

        if (!governanceConnectorRoutesAdded) {
            const filteredRoutesClone: RouteInterface[] = CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
                getOrganizationEnabledRoutes(),
                featureConfig,
                allowedScopes,
                commonConfig.checkForUIResourceScopes
            );

            setFilteredRoutes((prevFilteredRoutes: RouteInterface[]) => {
                serverConfigurationConfig.showConnectorsOnTheSidePanel &&
                governanceConnectorCategories.map((category: GovernanceConnectorCategoryInterface, index: number) => {
                    let subCategoryExists = false;

                    category.connectors?.map((connector) => {
                        if (connector.subCategory !== "DEFAULT") {
                            subCategoryExists = true;

                            return;
                        }
                    });
                    if (subCategoryExists) {
                        // TODO: Implement sub category handling logic here.
                    }

                    filteredRoutesClone.unshift({
                        category: "console:manage.features.sidePanel.categories.configurations",
                        component: lazy(() => import("../features/server-configurations/pages/governance-connectors")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().connectors[category.id] ?? getSidePanelIcons().connectors.default
                        },
                        id: category.id,
                        name: category.name,
                        order:
                            category.id === ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID
                                ? prevFilteredRoutes.length + governanceConnectorCategories.length
                                : prevFilteredRoutes.length + index,
                        path: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTORS")
                            .replace(":id", category.id),
                        protected: true,
                        showOnSidePanel: true
                    });
                });

                if (!OrganizationUtils.isRootOrganization(organization.organization)) {
                    return RouteUtils.filterOrganizationEnabledRoutes(filteredRoutesClone);
                }

                return filteredRoutesClone;
            });
            setGovernanceConnectorRoutesAdded(true);
            setGovernanceConnectorsEvaluated(true);
        }
    }, [
        allowedScopes,
        governanceConnectorCategories,
        featureConfig,
        governanceConnectorRoutesAdded,
        getOrganizationEnabledRoutes,
        organization.organization
    ]);

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
                    resolvedRoutes.push(renderRoute(route, key));
                }

                if (route.children && route.children instanceof Array && route.children.length > 0) {
                    recurse(route.children);
                }
            });
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
                    activeView={ StrictAppViewTypes.MANAGE }
                    fluid={ !isMobileViewport ? fluid : false }
                    onSidePanelToggleClick={ handleSidePanelToggleClick }
                />
            ) }
            sidePanel={ (
                <SidePanel
                    categorized={
                        config?.ui?.isLeftNavigationCategorized !== undefined
                            ? config.ui.isLeftNavigationCategorized
                                && commonConfig?.leftNavigation?.isLeftNavigationCategorized?.manage
                            : true
                    }
                    caretIcon={ getSidePanelMiscIcons().caretRight }
                    desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
                    fluid={ !isMobileViewport ? fluid : false }
                    footerHeight={ footerHeight }
                    headerHeight={ headerHeight }
                    hoverType="background"
                    mobileSidePanelVisibility={ mobileSidePanelVisibility }
                    onSidePanelItemClick={ handleSidePanelItemClick }
                    onSidePanelPusherClick={ handleSidePanelPusherClick }
                    routes={ CommonRouteUtils.sanitizeForUI(cloneDeep(filteredRoutes),
                        AppUtils.getHiddenRoutes()) }
                    selected={ selectedRoute }
                    translationHook={ t }
                    allowedScopes={ allowedScopes }
                />
            ) }
            footer={ (
                <Footer
                    fluid={ !isMobileViewport ? fluid : false }
                />
            ) }
        >
            <ErrorBoundary
                onChunkLoadError={ AppUtils.onChunkLoadError }
                fallback={ (
                    <EmptyPlaceholder
                        action={ (
                            <LinkButton onClick={ () => CommonUtils.refreshPage() }>
                                { t("console:common.placeholders.brokenPage.action") }
                            </LinkButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().brokenPage }
                        imageSize="tiny"
                        subtitle={ [
                            t("console:common.placeholders.brokenPage.subtitles.0"),
                            t("console:common.placeholders.brokenPage.subtitles.1")
                        ] }
                        title={ t("console:common.placeholders.brokenPage.title") }
                    />
                ) }
            >
                <Suspense fallback={ <ContentLoader dimmer={ false } /> }>
                    <Switch>
                        { resolveRoutes() }
                    </Switch>
                </Suspense>
            </ErrorBoundary>
        </DashboardLayoutSkeleton>
    );
};

/**
 * Default props for the Admin View.
 */
AdminView.defaultProps = {
    fluid: true
};
