/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { RouteInterface } from "@wso2is/core/models";
import { RouteUtils as CommonRouteUtils, CommonUtils } from "@wso2is/core/utils";
import {
    ContentLoader,
    EmptyPlaceholder,
    ErrorBoundary,
    LinkButton
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    Suspense,
    useCallback,
    useEffect,
    useRef
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import {
    AppConstants,
    AppState,
    AppUtils,
    AppViewTypes,
    ProtectedRoute,
    RouteUtils,
    StrictAppViewTypes,
    getEmptyPlaceholderIllustrations
} from "../features/core";
import { setActiveView, setSelectedRoute } from "../features/core/store/actions";

/**
 * Developer View Prop types.
 */
type DeveloperViewPropsInterface = RouteComponentProps;

/**
 * Parent component for Developer features inherited from Dashboard layout skeleton.
 *
 * @param props - Props injected to the component.
 * @returns Developer View Wrapper
 */
export const DeveloperView: FunctionComponent<DeveloperViewPropsInterface> = (
    props: DeveloperViewPropsInterface
): ReactElement => {

    const {
        location
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const activeView: AppViewTypes = useSelector((state: AppState) => state.global.activeView);
    const filteredRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.developeRoutes.filteredRoutes
    );

    const initLoad: MutableRefObject<boolean> = useRef(true);

    /**
     * Make sure `DEVELOP` tab is highlighted when this layout is used.
     */
    useEffect(() => {
        if (activeView === StrictAppViewTypes.DEVELOP) {
            return;
        }

        dispatch(setActiveView(StrictAppViewTypes.DEVELOP));
    }, [ dispatch, activeView ]);

    /**
     * Handle routing and the selected route on location change.
     */
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

        dispatch(setSelectedRoute(CommonRouteUtils.getInitialActiveRoute(location.pathname, filteredRoutes)));
    }, [ location.pathname, filteredRoutes ]);

    /**
     * Conditionally renders a route. If a route has defined a Redirect to
     * URL, it will be directed to the specified one. If the route is stated
     * as protected, It'll be rendered using the `ProtectedRoute`.
     *
     * @param route - Route to be rendered.
     * @param key - Index of the route.
     * @returns Resolved route to be rendered.
     */
    const renderRoute = (route: RouteInterface, key: number): ReactNode => (
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
                        render={ (renderProps: RouteComponentProps): ReactNode =>
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
    const resolveRoutes: () => RouteInterface[] | ReactNode[] = useCallback((): RouteInterface[] | ReactNode[] => {
        const resolvedRoutes: ReactNode[] = [];

        filteredRoutes.forEach((route: RouteInterface, key: number) => {
            resolvedRoutes.push(renderRoute(route, key));
        });

        return resolvedRoutes;
    }, [ filteredRoutes ]);

    return (
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
    );
};

/**
 * Default props for the Developer View.
 */
DeveloperView.defaultProps = {};
