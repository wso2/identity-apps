/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import Navbar, { NavbarItems } from "@oxygen-ui/react/Navbar";
import Snackbar from "@oxygen-ui/react/Snackbar";
import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import {
    AlertInterface,
    AnnouncementBannerInterface,
    ChildRouteInterface,
    NavRouteInterface,
    ProfileInfoInterface,
    RouteInterface
} from "@wso2is/core/models";
import { CategorizedRouteInterface } from "@wso2is/core/src/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import { RouteUtils as CommonRouteUtils, CommonUtils } from "@wso2is/core/utils";
import {
    Alert,
    ContentLoader,
    EmptyPlaceholder,
    ErrorBoundary,
    GenericIcon,
    LinkButton,
    useMediaContext
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import sortBy from "lodash-es/sortBy";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Action } from "reduce-reducers";
import { ThunkDispatch } from "redux-thunk";
import { applicationConfig } from "../admin.extensions.v1/configs/application";
import { FeatureGateConstants } from "../admin.extensions.v1/components/feature-gate/constants/feature-gate";
import { getProfileInformation } from "../admin.authentication.v1/store";
import {
    AppConstants,
    AppState,
    AppUtils,
    AppViewTypes,
    ConfigReducerStateInterface,
    Header,
    ProtectedRoute,
    RouteUtils,
    StrictAppViewTypes,
    UIConstants,
    getAppViewRoutes,
    getEmptyPlaceholderIllustrations,
    history
} from "../admin.core.v1";
import { setActiveView } from "../admin.core.v1/store/actions";
import { CommonUtils as ConsoleCommonUtils } from "../admin.core.v1/utils";

/**
 * Parent component for Admin features inherited from Dashboard layout skeleton.
 *
 * @param props - Props injected to the component.
 *
 * @returns Admin View Wrapper.
 */
export const AppView: FunctionComponent<RouteComponentProps> = (
    props: RouteComponentProps
): ReactElement => {
    const { location } = props;

    const dispatch: ThunkDispatch<AppState, void, Action> = useDispatch();
    const { t } = useTranslation();

    const isMarketingConsentBannerEnabled: boolean = useSelector((state: AppState) => {
        return state?.config?.ui?.isMarketingConsentBannerEnabled;
    });

    const [ announcement, setAnnouncement ] = useState<
        AnnouncementBannerInterface
    >();

    const [ showAnnouncement, setShowAnnouncement ] = useState<boolean>(true);

    const config: ConfigReducerStateInterface = useSelector(
        (state: AppState) => state.config
    );
    const profileInfo: ProfileInfoInterface = useSelector(
        (state: AppState) => state.profile.profileInfo
    );
    const alert: AlertInterface = useSelector(
        (state: AppState) => state.global.alert
    );
    const alertSystem: System = useSelector(
        (state: AppState) => state.global.alertSystem
    );
    const activeView: AppViewTypes = useSelector(
        (state: AppState) => state.global.activeView
    );
    const developFilteredRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.developeRoutes.filteredRoutes
    );
    const developSanitizedRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.developeRoutes.sanitizedRoutes
    );

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const [ selectedRoute, setSelectedRoute ] = useState<
        RouteInterface | ChildRouteInterface
    >(getAppViewRoutes()[ 0 ]);

    const { isMobileViewport } = useMediaContext();

    const [ mobileSidePanelVisibility, setMobileSidePanelVisibility ] = useState<
        boolean
    >(false);

    const organizationLoading: boolean = useSelector(
        (state: AppState) => state?.organization?.getOrganizationLoading
    );

    const initLoad: MutableRefObject<boolean> = useRef(true);


    const sanitizedRoutes: RouteInterface[] = useMemo(() => {
        return [
            ...sortBy(developSanitizedRoutes, "order") ];
    }, [ developSanitizedRoutes ]);

    const filteredRoutes: RouteInterface[] = useMemo(() => {
        const developRoutes: RouteInterface[] = developFilteredRoutes.filter(
            (route: RouteInterface) => route.path != "*");

        return [ ...developRoutes ];
    }, [ developFilteredRoutes ]);

    /**
     * Collapse Navbar for Mobile screens.
     */
    useEffect(() => {
        isMobileViewport ? setMobileSidePanelVisibility(false) : setMobileSidePanelVisibility(true);
    }, [ isMobileViewport ]);

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
        if (!location?.pathname) {
            return;
        }

        if (initLoad.current) {
            // Try to handle any un-expected routing issues. Returns a void if no issues are found.
            RouteUtils.gracefullyHandleRouting(
                filteredRoutes,
                AppConstants.getAdminViewBasePath(),
                location.pathname
            );
            initLoad.current = false;
        }

        setSelectedRoute(
            CommonRouteUtils.getInitialActiveRoute(
                location.pathname,
                filteredRoutes
            )
        );
    }, [ location.pathname, filteredRoutes ]);

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            return;
        }

        dispatch(getProfileInformation());
    }, [ dispatch, profileInfo ]);
    /*
     * Callback for side panel hamburger click.
     */
    const handleSidePanelToggleClick = (): void => {
        setMobileSidePanelVisibility(!mobileSidePanelVisibility);
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
    const renderRoute = (route: RouteInterface, key: number): ReactNode =>
        route.redirectTo ? (
            <Redirect key={ key } to={ route.redirectTo } />
        ) : route.protected ? (
            <ProtectedRoute
                component={ route.component ? route.component : null }
                path={ route.path }
                key={ key }
                exact={ route.exact }
            />
        ) : (
            <Route
                path={ route.path }
                render={ (renderProps: RouteComponentProps): ReactNode =>
                    route.component ? (
                        <route.component { ...renderProps } />
                    ) : null
                }
                key={ key }
                exact={ route.exact }
            />
        );

    /**
     * Resolves the set of routes for the react router.
     * This function recursively adds any child routes
     * defined.
     *
     * @returns Set of resolved routes.
     */
    const resolveRoutes = (): RouteInterface[] | ReactNode[] => {
        const resolvedRoutes: ReactNode[] = [];

        filteredRoutes.forEach((route: RouteInterface, key: number) => {
            resolvedRoutes.push(renderRoute(route, key));
        });

        return resolvedRoutes;
    };

    const handleAlertSystemInitialize = (system: System) => {
        dispatch(initializeAlertSystem(system));
    };

    /**
     * Listens to `config` changes and set the announcement.
     */
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
            CommonUtils.getValidAnnouncement(
                config.ui.announcements,
                ConsoleCommonUtils.getSeenAnnouncements()
            )
        );
    }, [ config ]);

    /**
     * Handles announcement dismiss callback.
     */
    const handleAnnouncementDismiss = () => {
        ConsoleCommonUtils.setSeenAnnouncements(announcement.id);

        const validAnnouncement: AnnouncementBannerInterface = CommonUtils.getValidAnnouncement(
            config.ui.announcements,
            ConsoleCommonUtils.getSeenAnnouncements()
        );

        if (!validAnnouncement) {
            setAnnouncement(null);

            return;
        }

        setShowAnnouncement(false);
        setAnnouncement(validAnnouncement);
    };

    const generateNavbarItems = (): NavbarItems[] => {
        const categorizedRoutes: CategorizedRouteInterface = {};

        let index: number = 0;
        const UNCATEGORIZED: string = "uncategorized";

        for (const route of RouteUtils.groupNavbarRoutes(sanitizedRoutes, saasFeatureStatus)) {
            if (route.navCategory) {
                if (categorizedRoutes[ route.navCategory.id ]) {
                    categorizedRoutes[ route.navCategory.id ].push(route);

                    continue;
                }

                categorizedRoutes[ route.navCategory.id ] = [ route ];
            } else {
                categorizedRoutes[ `${ UNCATEGORIZED }-${ index} ` ] = [ route ];
            }

            index++;
        }

        return Object.entries(categorizedRoutes).map(
            ([ _navCategory, routes ]: [ navCategory: string, routes: NavRouteInterface[] ]) => {

                return {
                    items: routes.map((route: NavRouteInterface) => ({
                        "data-componentid": `side-panel-items-${ kebabCase(route.id) }`,
                        "data-testid":  `side-panel-items-${ kebabCase(route.id) }`,
                        icon: <GenericIcon
                            transparent
                            className="route-icon"
                            { ...route.icon }
                        />,
                        items: route.items?.map((subRoute: NavRouteInterface) => ({
                            "data-componentid": `side-panel-items-${ kebabCase(subRoute.id) }`,
                            "data-testid":  `side-panel-items-${ kebabCase(subRoute.id) }`,
                            icon: <GenericIcon
                                transparent
                                className="route-sub-icon"
                                { ...subRoute.icon }
                            />,
                            label: t(subRoute.name),
                            onClick: () => history.push(subRoute.path),
                            selected: subRoute.selected ?? selectedRoute?.path === subRoute.path,
                            tag: t(subRoute.featureStatusLabel)
                        })),
                        label: t(route.name),
                        onClick: () => history.push(route.path),
                        selected: route.selected ?? isRouteActive(route.path),
                        tag: t(route.featureStatusLabel)
                    }))
                };
            }
        );
    };

    /**
     *
     * @param routePath - current route path
     * @returns if the navigation item is active.
     */
    const isRouteActive = (routePath: string): boolean => {
        return history.location.pathname === routePath;
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
                header={
                    (<Header
                        handleSidePanelToggleClick={ handleSidePanelToggleClick }
                    />)
                }
                navigation={
                    (<Navbar
                        items={
                            !organizationLoading ? generateNavbarItems() : []
                        }
                        fill={ "solid" }
                        open={ mobileSidePanelVisibility }
                        collapsible={ false }
                    />)
                }
            >
                <ErrorBoundary
                    onChunkLoadError={ AppUtils.onChunkLoadError }
                    fallback={
                        (<EmptyPlaceholder
                            action={
                                (<LinkButton
                                    onClick={ () => CommonUtils.refreshPage() }
                                >
                                    { t(
                                        "console:common.placeholders.brokenPage.action"
                                    ) }
                                </LinkButton>)
                            }
                            image={
                                getEmptyPlaceholderIllustrations().brokenPage
                            }
                            imageSize="tiny"
                            subtitle={ [
                                t(
                                    "console:common.placeholders.brokenPage.subtitles.0"
                                ),
                                t(
                                    "console:common.placeholders.brokenPage.subtitles.1"
                                )
                            ] }
                            title={ t(
                                "console:common.placeholders.brokenPage.title"
                            ) }
                        />)
                    }
                >
                    <Suspense fallback={ <ContentLoader dimmer={ false } /> }>
                        {
                            isMarketingConsentBannerEnabled
                                && applicationConfig.marketingConsent.getBannerComponent()
                        }
                        <Switch>{ resolveRoutes() as ReactNode[] }</Switch>
                    </Suspense>
                </ErrorBoundary>
            </AppShell>
        </>
    );
};
