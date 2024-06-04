/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import {
    AppConstants,
    AppState,
    AppUtils,
    FeatureConfigInterface,
    RouteUtils,
    getEmptyPlaceholderIllustrations,
    getFullScreenViewRoutes
} from "@wso2is/admin.core.v1";
import { RouteInterface } from "@wso2is/core/models";
import { RouteUtils as CommonRouteUtils, CommonUtils } from "@wso2is/core/utils";
import {
    ContentLoader,
    EmptyPlaceholder,
    ErrorBoundary,
    FullScreenLayout as FullScreenLayoutSkeleton,
    LinkButton
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    Suspense,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

/**
 * Full Screen View Prop types.
 */
interface FullScreenViewPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Parent component for Ful Screen features inherited from App layout skeleton.
 *
 * @param props - Props injected to the component.
 * @returns Full screen view layout component.
 */
export const FullScreenView: FunctionComponent<FullScreenViewPropsInterface> = (): ReactElement => {

    const location = useLocation();

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isAuthenticated: boolean = useSelector((state: AppState) => state.auth.isAuthenticated);

    const [ filteredRoutes, setFilteredRoutes ] = useState<RouteInterface[]>(getFullScreenViewRoutes());

    useEffect(() => {

        // Allowed scopes is never empty. Wait until it's defined to filter the routes.
        if (isEmpty(allowedScopes)) {
            return;
        }

        const [ routes, _sanitizedRoutes ] = CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
            getFullScreenViewRoutes(),
            featureConfig,
            allowedScopes);

        // Try to handle any un-expected routing issues. Returns a void if no issues are found.
        RouteUtils.gracefullyHandleRouting(routes, AppConstants.getFullScreenViewBasePath(), location.pathname);

        // Filter the routes and get only the enabled routes defined in the app config.
        setFilteredRoutes(routes);
    }, [ featureConfig, getFullScreenViewRoutes, allowedScopes ]);

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
            ? <Route path="*" element={ <Navigate key={ key } to={ route.redirectTo }/> } />
            : route.protected
                ? (
                    <Route
                        element={ isAuthenticated && route.component ? route.component : null }
                        path={ route.path }
                        key={ key }
                    />
                )
                : (
                    <Route
                        path={ route.path }
                        element={ 
                            route.component
                                ? <route.component />
                                : null
                        }
                        key={ key }
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
    const resolveRoutes = (): RouteInterface[] | ReactNode[]=> {
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

    return (
        <FullScreenLayoutSkeleton>
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
                    <Routes>
                        { resolveRoutes() as ReactNode[] }
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </FullScreenLayoutSkeleton>
    );
};

/**
 * Default props for the Full Screen View.
 */
FullScreenView.defaultProps = {
    fluid: true
};
