/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AccessControlUtils } from "@wso2is/access-control";
import { LegacyModeInterface, RouteInterface } from "@wso2is/core/models";
import { RouteUtils as CommonRouteUtils } from "@wso2is/core/utils";
import isEmpty from "lodash-es/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import useAuthorization from "../../admin.authorization.v1/hooks/use-authorization";
import { useGlobalVariablesContext } from "../../admin.core.v1/hooks/use-global-variables";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import { getAppViewRoutes } from "../configs/routes";
import { AppConstants } from "../constants/app-constants";
import { history } from "../helpers/history";
import { FeatureConfigInterface } from "../models/config";
import { AppState, setDeveloperVisibility, setFilteredDevelopRoutes, setSanitizedDevelopRoutes } from "../store";
import { AppUtils } from "../utils/app-utils";

/**
 * Props interface of {@link useOrganizations}
 */
export type useRoutesInterface = {
    filterRoutes: (
        onRoutesFilterComplete: () => void,
        isFirstLevelOrg?: boolean
    ) => void;
};

/**
 * Hook that provides access to the Organizations context.
 *
 * @returns An object containing the current Organizations context.
 */
const useRoutes = (): useRoutesInterface => {
    const dispatch: Dispatch = useDispatch();
    const { isOrganizationManagementEnabled } = useGlobalVariablesContext();
    const { legacyAuthzRuntime }  = useAuthorization();
    const { isSuperOrganization } = useGetCurrentOrganizationType();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const legacyModeConfigs: LegacyModeInterface = useSelector((state: AppState) => state.config.ui.legacyMode);
    const loggedUserName: string = useSelector((state: AppState) => state.profile.profileInfo.userName);
    const superAdmin: string = useSelector((state: AppState) => state.organization.superAdmin);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state?.auth?.isPrivilegedUser);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isGroupAndRoleSeparationEnabled);

    /**
     * Filter the routes based on the user roles and permissions.
     *
     * @param onRoutesFilterComplete - Callback to be called after the routes are filtered.
     * @param isFirstLevelOrg - Is the current organization the first level organization.
     *
     * @returns A promise containing void.
     */
    const filterRoutes = async (onRoutesFilterComplete: () => void, isFirstLevelOrg: boolean): Promise<void> => {
        if (
            isEmpty(allowedScopes) ||
            !featureConfig.applications ||
            !featureConfig.users
        ) {
            return;
        }

        const resolveHiddenRoutes = (): string[] => {
            const commonHiddenRoutes: string[] = [
                ...AppUtils.getHiddenRoutes(),
                ...AppConstants.ORGANIZATION_ONLY_ROUTES
            ];

            function getAdditionalRoutes() {
                if (!isOrganizationManagementEnabled) {
                    return [ ...AppUtils.getHiddenRoutes(), ...AppConstants.ORGANIZATION_ROUTES ];
                }

                const isCurrentOrgRootAndSuperTenant: boolean = isSuperOrganization();

                if (legacyAuthzRuntime) {
                    if (isCurrentOrgRootAndSuperTenant || isFirstLevelOrg) {
                        if (isPrivilegedUser) {
                            if (loggedUserName === superAdmin) {
                                return [ ...commonHiddenRoutes, ...AppConstants.ORGANIZATION_ROUTES ];
                            } else {
                                return [
                                    ...commonHiddenRoutes,
                                    ...AppConstants.ORGANIZATION_ROUTES,
                                    ...AppConstants.SUPER_ADMIN_ONLY_ROUTES
                                ];
                            }
                        } else {
                            if (loggedUserName === superAdmin) {
                                return commonHiddenRoutes;
                            } else {
                                return [ ...commonHiddenRoutes, ...AppConstants.SUPER_ADMIN_ONLY_ROUTES ];
                            }
                        }
                    } else {
                        if (window["AppUtils"].getConfig().organizationName) {
                            return [
                                ...AppUtils.getHiddenRoutes()
                            ];
                        } else {
                            return [ ...AppUtils.getHiddenRoutes(), ...AppConstants.ORGANIZATION_ROUTES ];
                        }
                    }
                }

                if (window["AppUtils"].getConfig().organizationName) {
                    return [
                        ...AppUtils.getHiddenRoutes()
                    ];
                } else {
                    if (isCurrentOrgRootAndSuperTenant && loggedUserName === superAdmin) {
                        return commonHiddenRoutes;
                    } else if (!isCurrentOrgRootAndSuperTenant || loggedUserName !== superAdmin) {
                        return [ ...commonHiddenRoutes, ...AppConstants.SUPER_ADMIN_ONLY_ROUTES ];
                    }else {
                        return [ ...commonHiddenRoutes ];
                    }
                }
            }

            const additionalRoutes: string[] = getAdditionalRoutes();

            if (!isGroupAndRoleSeparationEnabled) {
                additionalRoutes.push(AppConstants.CONSOLE_SETTINGS_ROUTE);
            }

            return [ ...additionalRoutes ];
        };

        let allowedRoutes: string[] = window["AppUtils"].getConfig().organizationName
            ? AppConstants.ORGANIZATION_ENABLED_ROUTES
            : undefined;

        if (legacyAuthzRuntime) {
            allowedRoutes = !isSuperOrganization()
                && !isFirstLevelOrg
                && AppConstants.ORGANIZATION_ENABLED_ROUTES;
        }

        // Console feature scope check is disabled when the consoleFeatureScopeCheck flag is explicitly set to false.
        const checkConsoleScopes: boolean = !(legacyModeConfigs?.consoleFeatureScopeCheck === false);

        const [
            appRoutes,
            sanitizedAppRoutes
        ] = CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
            getAppViewRoutes(),
            featureConfig,
            allowedScopes,
            checkConsoleScopes,
            resolveHiddenRoutes(),
            allowedRoutes
        );

        // TODO : Remove this logic once getting started pages are removed.
        if (
            appRoutes.length === 2 &&
            appRoutes.filter(
                (route: RouteInterface) =>
                    route.id ===
                    AccessControlUtils.DEVELOP_GETTING_STARTED_ID ||
                    route.id === "404"
            ).length === 2
        ) {
            appRoutes[ 0 ] = appRoutes[ 0 ].filter((route: RouteInterface) => route.id === "404");
        }

        dispatch(setFilteredDevelopRoutes(appRoutes));
        dispatch(setSanitizedDevelopRoutes(sanitizedAppRoutes));

        onRoutesFilterComplete();

        if (sanitizedAppRoutes.length < 1) {
            dispatch(setDeveloperVisibility(false));
        }

        if (sanitizedAppRoutes.length < 1) {
            history.push({
                pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                search:
                    "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
            });
        }
    };

    return {
        filterRoutes
    };
};

export default useRoutes;
