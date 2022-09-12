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
    TopLoadingBar,
    useMediaContext,
    useUIElementSizes
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { commonConfig } from "../extensions";
import { getProfileInformation } from "../features/authentication/store";
import {
    AppConstants,
    AppState,
    AppUtils,
    AppViewTypes,
    ConfigReducerStateInterface,
    Footer,
    Header,
    ProtectedRoute,
    RouteUtils,
    StrictAppViewTypes,
    UIConstants,
    getDeveloperViewRoutes,
    getEmptyPlaceholderIllustrations,
    getSidePanelMiscIcons,
    history
} from "../features/core";
import { setActiveView } from "../features/core/store/actions";

/**
 * Developer View Prop types.
 */
interface DeveloperViewPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Parent component for Developer features inherited from Dashboard layout skeleton.
 *
 * @param props - Props injected to the component.
 *
 * @returns Developer View Wrapper
 */
export const DeveloperView: FunctionComponent<DeveloperViewPropsInterface> = (
    props: DeveloperViewPropsInterface & RouteComponentProps
): ReactElement => {

    const {
        fluid,
        location
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();
    const { headerHeight, footerHeight } = useUIElementSizes({
        footerHeight: UIConstants.DEFAULT_FOOTER_HEIGHT,
        headerHeight: UIConstants.DEFAULT_HEADER_HEIGHT,
        topLoadingBarHeight: UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT
    });

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const isAJAXTopLoaderVisible: boolean = useSelector((state: AppState) => state.global.isAJAXTopLoaderVisible);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const activeView: AppViewTypes = useSelector((state: AppState) => state.global.activeView);
    const filteredRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.developeRoutes.filteredRoutes
    );
    const sanitizedRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.developeRoutes.sanitizedRoutes
    );

    const [
        selectedRoute,
        setSelectedRoute
    ] = useState<RouteInterface | ChildRouteInterface>(getDeveloperViewRoutes()[0]);
    const [ mobileSidePanelVisibility, setMobileSidePanelVisibility ] = useState<boolean>(false);

    const organizationLoading: boolean
            = useSelector((state: AppState) => state?.organization?.getOrganizationLoading);

    const initLoad = useRef(true);

    /**
     * Make sure `DEVELOP` tab is highlighted when this layout is used.
     */
    useEffect(() => {

        if (activeView === StrictAppViewTypes.DEVELOP) {
            return;
        }

        dispatch(setActiveView(StrictAppViewTypes.DEVELOP));
    }, [ dispatch, activeView ]);

    useEffect(() => {
        if (!location?.pathname) {
            return;
        }

        if (initLoad.current) {
            // Try to handle any un-expected routing issues. Returns a void if no issues are found.
            RouteUtils.gracefullyHandleRouting(
                filteredRoutes,
                AppConstants.getDeveloperViewBasePath(),
                location.pathname
            );
            initLoad.current = false;
        }

        setSelectedRoute(CommonRouteUtils.getInitialActiveRoute(location.pathname, filteredRoutes));
    }, [ location.pathname, filteredRoutes ]);

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            return;
        }

        dispatch(getProfileInformation());
    }, [
        dispatch,
        profileInfo
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
     * @param route - Clicked on route.
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
     * Conditionally renders a route. If a route has defined a Redirect to
     * URL, it will be directed to the specified one. If the route is stated
     * as protected, It'll be rendered using the `ProtectedRoute`.
     *
     * @param route - Route to be rendered.
     * @param key - Index of the route.
     * @returns Resolved route to be rendered.
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
     * @returns Set of resolved routes.
     */
    const resolveRoutes = useCallback((): RouteInterface[] | ReactNode[] => {
        const resolvedRoutes = [];

        filteredRoutes.forEach((route, key) => {
            resolvedRoutes.push(renderRoute(route, key));
        });

        return resolvedRoutes;
    }, [ filteredRoutes ]);


    /**
     * Handles alert system initialize.
     *
     * @param system - Alert system object.
     */
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
            header={ (
                <Header
                    activeView={ StrictAppViewTypes.DEVELOP }
                    fluid={ fluid }
                    onSidePanelToggleClick={ handleSidePanelToggleClick }
                />
            ) }
            sidePanel={  (
                <SidePanel
                    ordered
                    categorized={
                        config?.ui?.isLeftNavigationCategorized !== undefined
                            ? config.ui.isLeftNavigationCategorized
                                && commonConfig?.leftNavigation?.isLeftNavigationCategorized?.develop
                            : true
                    }
                    caretIcon={ getSidePanelMiscIcons().caretRight }
                    desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
                    fluid={ fluid }
                    footerHeight={ footerHeight }
                    headerHeight={ headerHeight }
                    hoverType="background"
                    mobileSidePanelVisibility={ mobileSidePanelVisibility }
                    onSidePanelItemClick={ handleSidePanelItemClick }
                    onSidePanelPusherClick={ handleSidePanelPusherClick }
                    routes={ !organizationLoading
                        && sanitizedRoutes }
                    selected={ selectedRoute }
                    translationHook={ t }
                    allowedScopes={ allowedScopes }
                />
            ) }
            footer={ (
                <Footer
                    fluid={ fluid }
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
                        { resolveRoutes() as ReactNode[] }
                    </Switch>
                </Suspense>
            </ErrorBoundary>
        </DashboardLayoutSkeleton>
    );
};

/**
 * Default props for the Developer View.
 */
DeveloperView.defaultProps = {
    fluid: true
};
