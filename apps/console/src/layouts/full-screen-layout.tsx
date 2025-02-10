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

import { ProtectedRoute } from "@wso2is/admin.core.v1/components/protected-route";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AppUtils } from "@wso2is/admin.core.v1/utils/app-utils";
import { RouteUtils } from "@wso2is/admin.core.v1/utils/route-utils";
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
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { getFullScreenViewRoutes } from "../configs/routes";

/**
 * Full Screen View Prop types.
 */
interface FullScreenLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Parent component for Ful Screen features inherited from App layout skeleton.
 *
 * @param props - Props injected to the component.
 * @returns Full screen layout component.
 */
const FullScreenLayout: FunctionComponent<FullScreenLayoutPropsInterface> = (
    props: FullScreenLayoutPropsInterface & RouteComponentProps
): ReactElement => {

    const {
        location
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const appHomePath: string = useSelector(
        (state: AppState) => state.config.deployment.appHomePath
    );

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
    const resolveRoutes = (): ReactNode[] => {
        const resolvedRoutes: ReactNode[] = [];

        const recurse = (routesArr: RouteInterface[]): void => {
            routesArr.forEach((route: RouteInterface, key: number) => {
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
                handleError={ (_error: Error, _errorInfo: React.ErrorInfo) => {
                    sessionStorage.setItem("auth_callback_url_console", appHomePath);
                } }
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
        </FullScreenLayoutSkeleton>
    );
};

/**
 * Default props for the Full Screen View.
 */
FullScreenLayout.defaultProps = {
    fluid: true
};

export default FullScreenLayout;
