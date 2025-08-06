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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useGlobalVariables from "@wso2is/admin.core.v1/hooks/use-global-variables";
import { FeatureConfigInterface, RouteConfigInterface } from "@wso2is/admin.core.v1/models/config";
import {
    AppState
} from "@wso2is/admin.core.v1/store";
import {
    setDeveloperVisibility
} from "@wso2is/admin.core.v1/store/actions/acess-control";
import {
    setFilteredDevelopRoutes,
    setSanitizedDevelopRoutes
} from "@wso2is/admin.core.v1/store/actions/routes";
import { AppUtils } from "@wso2is/admin.core.v1/utils/app-utils";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { RouteInterface } from "@wso2is/core/models";
import { RouteUtils as CommonRouteUtils } from "@wso2is/core/utils";
import isEmpty from "lodash-es/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { getAppViewRoutes } from "../configs/routes";

/**
 * Props interface of {@link useOrganizations}
 */
export type useRoutesInterface = {
    filterRoutes: (
        onRoutesFilterComplete: () => void,
        isUserTenantless: boolean,
        isFirstLevelOrg?: boolean
    ) => void;
};

interface UseRoutesParams {
    isAgentManagementEnabledForOrg: boolean
}

/**
 * Hook that provides access to the Organizations context.
 *
 * @returns An object containing the current Organizations context.
 */
const useRoutes = (params: UseRoutesParams): useRoutesInterface => {
    const dispatch: Dispatch = useDispatch();
    const { isOrganizationManagementEnabled } = useGlobalVariables();
    const { isSuperOrganization } = useGetCurrentOrganizationType();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const loggedUserName: string = useSelector((state: AppState) => state.profile.profileInfo.userName);
    const superAdmin: string = useSelector((state: AppState) => state.organization.superAdmin);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isGroupAndRoleSeparationEnabled);
    const routesConfig: RouteConfigInterface = useSelector((state: AppState) => state.config.ui.routes);

    /**
     * Filter the routes based on the user roles and permissions.
     *
     * @param onRoutesFilterComplete - Callback to be called after the routes are filtered.
     * @param isUserTenantless - Indicates whether the user have any associated tenant.
     * @param isFirstLevelOrg - Is the current organization the first level organization.
     *
     * @returns A promise containing void.
     */
    const filterRoutes = async (onRoutesFilterComplete: () => void, isUserTenantless: boolean): Promise<void> => {
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

            if(!params.isAgentManagementEnabledForOrg) {
                additionalRoutes.push(AppConstants.AGENTS_ROUTE);
            }

            return [ ...additionalRoutes ];
        };

        const allowedRoutes: string[] = window["AppUtils"].getConfig().organizationName
            ? routesConfig?.organizationEnabledRoutes
            : undefined;

        const [
            appRoutes,
            sanitizedAppRoutes
        ] = CommonRouteUtils.filterEnabledRoutes<FeatureConfigInterface>(
            getAppViewRoutes(),
            featureConfig,
            allowedScopes,
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

        if (sanitizedAppRoutes.length < 1 && !isUserTenantless) {
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
