/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
    DatabaseDocumentIcon,
    PaletteIcon,
    SquareUserIcon
} from "@oxygen-ui/react-icons";
import { FeatureStatus } from "@wso2is/access-control";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { NavCategory, NavRouteInterface, RouteInterface } from "@wso2is/core/models";
import groupBy from "lodash-es/groupBy";
import sortBy from "lodash-es/sortBy";
import { AppConstants } from "../constants/app-constants";
import { history } from "../helpers/history";

/**
 * Utility class for application routes related operations.
 */
export class RouteUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /*
     * Gracefully handles application routing to avoid less privileged users from
     * receiving unauthorized pages.
     *
     * @param {RouteInterface[]} routes - Set of app routes.
     * @param {string} view - Current view ex: Admin or Develop.
     * @param {string} pathname - Current path from location.
     * @param {boolean} navigateToUnAuthorized - Should navigate to un-authorized page.
     */
    public static gracefullyHandleRouting(routes: RouteInterface[],
        view: string,
        pathname: string,
        navigateToUnAuthorized: boolean = true): void {

        if (RouteUtils.isOnlyPageNotFoundPresent(routes)) {
            if (RouteUtils.isHomePath(view)) {
                if (view === AppConstants.getDeveloperViewBasePath()) {
                    history.push(AppConstants.getAdminViewHomePath());

                    return;
                }

                if (view === AppConstants.getAdminViewBasePath()) {
                    history.push(AppConstants.getDeveloperViewHomePath());

                    return;
                }
            }

            if (navigateToUnAuthorized) {
                history.push({
                    pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                    search: "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
                });

                return;
            }
        }

        if (RouteUtils.isRouteAvailable(view, pathname, routes)) {
            return;
        }

        history.push(sortBy(routes, "order")[0].path);
    }

    /**
     * Checks whether a given pathname is available in the route's
     * children router paths.
     *
     * @param view - Top level route path
     * @param pathname - Cached route path
     * @param routes - Available routes.
     */
    private static isRouteAvailable(view: string, pathname: string, routes: RouteInterface[]): boolean {
        /**
         * If one of the passed arguments are not truthy, then the function
         * cannot do the operation and check the available routes. In this
         * case we return false saying there's no matching routes.
         */
        if (!view || !pathname || !routes?.length) return false;

        /**
         * In this function what we do is escape all the special characters
         * of the URI and replace the path_parameters to match a dynamic string.
         *
         * Regex explanation
         * --
         * `[\w~\-\\.!*'(),]+` is a set expression that allows the following
         * characters  [a-z A-Z 0-9 _ ~ - \\ . ! * () , <space> ] one or more times.
         * The expression assumes the path_parameter has at-lease one character and
         * contains only the characters specified above.
         *
         * Refer RFC-3986
         * {@link https://tools.ietf.org/html/rfc3986#section-2.3}
         *
         * @param path - A valid URL
         * @returns expression like `some/path/[\w~\-\\.!*'(),]+/another`
         */
        const pathToARegex = (path: string): string => {
            if (!path || !path.trim().length) return "";

            if (path === "*") {
                return "";
            }

            return path.split("/").map((fragment: string) => {
                if (fragment && fragment.startsWith(":")) {
                    return /[\w~\-\\.!*'(), ]+/.source;
                }

                return fragment ?? "";
            }).join("/");
        };

        /**
         * To keep track of the qualified paths that matches exactly the
         *  `pathname`
         */
        const qualifiedPaths: string[] = [];

        /**
         * Validate each of the child paths against the `pathname`.
         * Breaks the search loop after the first successful match. If
         * you do want to keep searching multiple paths that matches a
         * certain criteria then you should remove the `break`
         * statement and write your aggregation logic after the loop.
         */
        for (const route of routes) {
            if (route) {
                const expression: RegExp = RegExp(`^${ pathToARegex(route.path)}`);
                const match: RegExpExecArray = expression.exec(pathname);

                if (match && match.length > 0) {
                    qualifiedPaths.push(...match);

                    break;
                }
            }
        }

        /**
         * If there's one or more qualified paths, then we can safely assume
         * the requested URL is present in the application.
         */
        return qualifiedPaths.length > 0;

    }

    /**
     * Checks if the passed in path is the home path defined in deployment.config.json.
     *
     * @param path - Path to check.
     * @returns Is home path or not.
     */
    public static isHomePath(path: string): boolean {

        if (path === AppConstants.getAppHomePath()) {
            return true;
        }

        return path?.split("/")[0] === AppConstants.getAppHomePath()?.split("/")[0];
    }

    /**
     * Checks if only the `404` is available.
     *
     * @param routes - Set of routes.
     * @returns Is only `404` available.
     */
    public static isOnlyPageNotFoundPresent(routes: RouteInterface[]): boolean {
        if (routes && Array.isArray(routes) && routes.length === 1) {
            if (routes[ 0 ].redirectTo === AppConstants.getPaths().get("PAGE_NOT_FOUND")) {
                return true;
            }
        }

        return false;
    }

    public static groupNavbarRoutes(routes: RouteInterface[], saasFeatureStatus?: FeatureStatus): NavRouteInterface[] {

        const userManagement: Omit<RouteInterface, "showOnSidePanel"> = {
            icon: SquareUserIcon,
            id: "userManagement",
            name: "User Management",
            order: 1
        };

        const userAttributesAndStores: Omit<RouteInterface, "showOnSidePanel"> = {
            icon: DatabaseDocumentIcon,
            id: "userAttributesAndStores",
            name: "User Attributes & Stores",
            order: 2
        };

        const branding: Omit<RouteInterface, "showOnSidePanel"> = {
            icon: PaletteIcon,
            id: "customization",
            name: "Branding"
        };

        const overview: NavCategory = {
            id: "overview",
            order: 0
        };

        const build: NavCategory = {
            id: "build",
            order: 1
        };

        const manage: NavCategory = {
            id: "manage",
            order: 2
        };

        const organizations: NavCategory = {
            id: "organizations",
            order: 3
        };

        const preferences: NavCategory = {
            id: "preferences",
            order: 4
        };

        const extensions: NavCategory = {
            id: "extensions",
            order: 5
        };

        const monitoring: NavCategory = {
            id: "monitoring",
            order: 6
        };

        const settings: NavCategory = {
            id: "settings",
            order: 7
        };

        const CategoryMappedRoutes: Omit<RouteInterface, "showOnSidePanel">[] = [
            {
                category: overview,
                id: "gettingStarted",
                order: 0
            },
            {
                category: overview,
                id: "insights",
                order: 1
            },
            {
                category: build,
                id: "applications",
                order: 0
            },
            {
                category: build,
                id: "identityProviders",
                order: 1
            },
            {
                category: build,
                id: "apiResources",
                order: 2
            },
            {
                category: organizations,
                id: "organizations"
            },
            {
                category: manage,
                id: "users",
                order: 0,
                parent: userManagement
            },
            {
                category: manage,
                id: "groups",
                order: 1,
                parent: userManagement
            },
            {
                category: manage,
                id: "applicationRoles",
                order: 2,
                parent: userManagement
            },
            {
                category: manage,
                id: "userRoles",
                order: 2,
                parent: userManagement
            },
            {
                category: manage,
                id: "userV1Roles",
                order: 2,
                parent: userManagement
            },
            {
                category: manage,
                id: "roles",
                order: 2,
                parent: userManagement
            },
            {
                category: manage,
                id: "userStores",
                order: 1,
                parent: userAttributesAndStores
            },
            {
                category: manage,
                id: "attributeDialects",
                order: 2,
                parent: userAttributesAndStores
            },
            {
                category: manage,
                id: "oidcScopes",
                order: 4,
                parent: userAttributesAndStores
            },
            {
                category: manage,
                id: "approvals",
                order: 3,
                parent: userManagement,
                selected: history.location.pathname.includes("approvals")
            },
            {
                category: build,
                id: "branding",
                parent: branding
            },
            {
                category: build,
                id: "emailTemplates",
                parent: branding
            },
            {
                category: build,
                id: "smsTemplates",
                parent: branding
            },
            {
                category: preferences,
                id: "loginAndRegistration"
            },
            {
                category: preferences,
                id: "notificationChannels"
            },
            {
                category: monitoring,
                id: "logs"
            },
            {
                category: monitoring,
                id: "analytics"
            },
            {
                category: settings,
                id: "administrators",
                order: 0
            },
            {
                category: settings,
                id: "consoleSettings",
                order: 1
            },
            {
                category: extensions,
                id: "actions",
                order: 0
            },
            {
                category: extensions,
                id: "eventPublishing",
                order: 1
            }
        ];

        // Filter out the routes that are restricted by the SAAS feature.
        const enabledRoutes: RouteInterface[] = routes.filter((route: RouteInterface) => {
            const saasFeatureRestricted: boolean = route.featureGateIds
                ?.includes(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER) &&
                    saasFeatureStatus !== FeatureStatus.ENABLED;

            return !saasFeatureRestricted;
        });

        // Inject additional navigation properties into the routes based on the category mappings.
        const routesWithCategoryData: NavRouteInterface[] = enabledRoutes
            ?.map((route: RouteInterface) => {
                const categoryMapping: Omit<RouteInterface, "showOnSidePanel"> = CategoryMappedRoutes
                    .find((mapping: Omit<RouteInterface, "showOnSidePanel">) => mapping.id === route.id);

                // If a mapping is found, inject the additional navigation properties.
                if (categoryMapping) {
                    return {
                        ...route,
                        navCategory: categoryMapping.category,
                        order: categoryMapping.order,
                        parent: categoryMapping.parent,
                        selected: categoryMapping.selected
                    };
                }

                // If no mapping is found, return the route as-is.
                return route;
            });

        // Group the routes by parent.
        const groupedByParent: Record<string, NavRouteInterface[]> = groupBy(
            routesWithCategoryData,
            (route: NavRouteInterface) => route.parent?.id
        );

        const routesToBeSorted: NavRouteInterface[] = [];

        Object.entries(groupedByParent).forEach(
            ([ _parent, routes ]: [ parent: string, routes: NavRouteInterface[] ]) => {
                // If a parent has more than one child route, then add the parent route to the list.
                // And keep the child routes as items of the parent route.
                if (_parent !== "undefined" && routes.length > 1) {
                    routesToBeSorted.push({
                        icon: { icon: routes[0]?.parent?.icon },
                        id: routes[0]?.parent?.id,
                        items: sortBy(routes, (item: NavRouteInterface) => item.order),
                        name: routes[0]?.parent?.name,
                        navCategory: routes[0]?.navCategory,
                        order: routes[0]?.parent?.order,
                        showOnSidePanel: routes[0]?.parent?.showOnSidePanel || true
                    });
                // If the route has no parent or the route is the only child,
                // then add the route to the list as it is.
                } else {
                    routes.forEach((route: NavRouteInterface) => {
                        routesToBeSorted.push(route);
                    });
                }
            });

        // First sort by the order of the route,
        // then by the order of the category.
        return sortBy(
            sortBy(routesToBeSorted, (item: NavRouteInterface) => item.order),
            (item: NavRouteInterface) => item.navCategory?.order
        );
    }
}
