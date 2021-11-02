/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { FeatureAccessConfigInterface, RouteInterface } from "@wso2is/core/models";
import { AuthenticateUtils } from "@wso2is/core/utils";
import { AccessControlConstants } from "../access-control-constants";

/**
 * A class to contain util functions related to access control
 */
export class AccessControlUtils {

    public static readonly MANAGE_GETTING_STARTED_ID: string = "manageGettingStarted";
    public static readonly DEVELOP_GETTING_STARTED_ID: string = "developerGettingStarted";

    /**
     * Util method to filter base routes based on user scopes retrieved via the token call.
     *
     * @param routeArray Un authenticated routes array
     * @param allowedScopes user scopes
     * @param featureConfig feature scope configuration
     * @param checkForUIResourceScopes Specifies if the UI resource scope should be considered
     *
     * @returns filtered route array based on the user scopes
     */
    public static getAuthenticatedRoutes(
        routeArray: RouteInterface[],
        allowedScopes: string,
        featureConfig: any, // TODO : Properly map FeatureConfigInterface type
        checkForUIResourceScopes?: boolean
    ): RouteInterface[] {

        const authenticatedRoutes: RouteInterface[] = new Array<RouteInterface>();

        routeArray.map((route: RouteInterface) => {
            const feature: FeatureAccessConfigInterface = featureConfig[route.id];

            if (feature && feature.enabled) {
                let shouldShowRoute: boolean = false;

                if (
                    AuthenticateUtils.hasScopes(feature?.scopes.read, allowedScopes) &&
                    (!checkForUIResourceScopes ||
                        !feature?.scopes?.feature ||
                        (feature?.scopes?.feature &&
                            AuthenticateUtils.hasScopes(feature?.scopes.feature, allowedScopes)) ||
                        AuthenticateUtils.hasScopes([ AccessControlConstants.FULL_UI_SCOPE ], allowedScopes))
                ) {
                    shouldShowRoute = true;
                }

                if (route.showOnSidePanel && shouldShowRoute) {
                    authenticatedRoutes.push(route);

                    return;
                }
            }

        });

        return authenticatedRoutes;
    }

    /**
     * Util method to retrieve if a single tab is disabled via iterating routes based on scopes.
     *
     * @param manageRoutes routes related to manage section
     * @param developRoutes routes related to develop section
     * @param allowedScopes allowed scopes
     * @param featureConfig feature config
     * @param checkForUIResourceScopes Specifies if the UI resource scope should be considered
     *
     * @returns
     */
    public static getDisabledTab(
        manageRoutes: RouteInterface[],
        developRoutes: RouteInterface[],
        allowedScopes: string,
        featureConfig: any, // TODO : Properly map FeatureConfigInterface type
        checkForUIResourceScopes?: boolean
    ): string {

        let isManageTabDisabled = false;
        let isDevelopTabDisabled = false;

        const authenticatedManageRoutes = this.getAuthenticatedRoutes(
            manageRoutes,
            allowedScopes,
            featureConfig,
            checkForUIResourceScopes
        );
        const authenticatedDevelopRoutes = this.getAuthenticatedRoutes(
            developRoutes,
            allowedScopes,
            featureConfig,
            checkForUIResourceScopes
        );

        if (authenticatedManageRoutes.length < 1) {
            isManageTabDisabled = true;
        }

        if (authenticatedDevelopRoutes.length < 1) {
            isDevelopTabDisabled = true;
        }

        if (isDevelopTabDisabled && isManageTabDisabled) {
            return "BOTH";
        } else if (isDevelopTabDisabled) {
            return "DEVELOP";
        } else if (isManageTabDisabled) {
            return "MANAGE";
        }

    }
}
