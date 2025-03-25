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

        const loginAndRegPathsToCheck: string[] = [
            `${AppConstants.getAdminViewBasePath()}/governance-connectors/`,
            `${AppConstants.getAdminViewBasePath()}/connector/`,
            AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"),
            AppConstants.getPaths().get("USERNAME_VALIDATION_EDIT"),
            AppConstants.getPaths().get("ALTERNATIVE_LOGIN_IDENTIFIER_EDIT"),
            AppConstants.getPaths().get("MULTI_ATTRIBUTE_LOGIN"),
            AppConstants.getPaths().get("VALIDATION_CONFIG_EDIT"),
            AppConstants.getPaths().get("IMPERSONATION"),
            AppConstants.getPaths().get("ORGANIZATION_DISCOVERY_DOMAINS"),
            AppConstants.getPaths().get("OUTBOUND_PROVISIONING_SETTINGS"),
            AppConstants.getPaths().get("PRIVATE_KEY_JWT_CONFIG_EDIT")
        ];

        const isConnectionsMenuItemSelected = (): boolean => {
            return history.location.pathname.includes("/connections")
                || history.location.pathname.includes("/identity-verification-providers");
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
                order: 0,
                selected: history.location.pathname.includes("applications")
            },
            {
                category: build,
                id: "identityProviders",
                order: 1,
                selected: isConnectionsMenuItemSelected()
            },
            {
                category: build,
                id: "apiResources",
                order: 2,
                selected: history.location.pathname.includes("/api-resources")
            },
            {
                category: organizations,
                id: "organizations",
                selected: history.location.pathname.includes("/organizations")
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
                id: "loginAndRegistration",
                selected: loginAndRegPathsToCheck.some((path: string) => history.location.pathname.startsWith(path))
            },
            {
                category: preferences,
                id: "notificationChannels",
                selected: history.location.pathname === AppConstants.getPaths().get("EMAIL_PROVIDER") ||
                    history.location.pathname === AppConstants.getPaths().get("SMS_PROVIDER") ||
                    history.location.pathname === AppConstants.getPaths().get("PUSH_PROVIDER") ||
                    history.location.pathname === AppConstants.getPaths().get("NOTIFICATION_CHANNELS") ||
                    // remove this when enabling push notification provider support
                    history.location.pathname === AppConstants.getPaths().get("EMAIL_AND_SMS")
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
                order: 1,
                selected: history.location.pathname.includes("/settings")
            },
            {
                category: settings,
                id: "server",
                order: 2,
                selected: history.location.pathname.includes("server")
            },
            {
                category: extensions,
                id: "actions",
                order: 0,
                selected: history.location.pathname.includes("/actions")
            },
            {
                category: extensions,
                id: "eventPublishing",
                order: 1
            }
        ];

        const itemsWithCategory: NavRouteInterface[] = routes?.filter((route: RouteInterface) => {
            const saasFeatureIsEnabled: boolean = route.featureGateIds?.
                includes(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER) && saasFeatureStatus !== FeatureStatus.ENABLED;

            return !saasFeatureIsEnabled;
        }).map((route: RouteInterface) => {
            const categoryMappedRoute: Omit<RouteInterface, "showOnSidePanel">
                = CategoryMappedRoutes.find((item: RouteInterface) => item.id === route.id);

            return {
                ...route,
                navCategory: categoryMappedRoute?.category,
                order: categoryMappedRoute?.order,
                parent: categoryMappedRoute?.parent,
                selected: categoryMappedRoute?.selected
            };
        });

        const groupedByParent: Record<string, NavRouteInterface[]> = groupBy(
            itemsWithCategory.filter(
                (item: NavRouteInterface) => item.parent), (item: NavRouteInterface) => item.parent?.id);

        const updatedGroupedItems: NavRouteInterface[] = Object.values(groupedByParent).map(
            (group: NavRouteInterface[]) => ({
                icon: { icon: group[0]?.parent?.icon },
                id: group[0]?.parent?.id,
                items: sortBy(group, (item: NavRouteInterface) => item.order),
                name: group[0]?.parent?.name,
                navCategory: group[0]?.navCategory,
                order: group[0]?.parent?.order,
                showOnSidePanel: group[0]?.parent?.showOnSidePanel || true
            }));

        const ungroupedItems: NavRouteInterface[] = itemsWithCategory.filter((item: NavRouteInterface) => !item.parent);

        return sortBy(
            sortBy([ ...updatedGroupedItems, ...ungroupedItems ], (item: NavRouteInterface) => item.order),
            (item: NavRouteInterface) => item.navCategory?.order
        );
    }
}
