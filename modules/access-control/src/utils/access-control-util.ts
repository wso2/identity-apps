/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
     * @param routeArray - Un authenticated routes array
     * @param allowedScopes - user scopes
     * @param featureConfig - feature scope configuration
     * @param checkForUIResourceScopes - Specifies if the UI resource scope should be considered
     * @returns filtered route array based on the user scopes
     */
    public static getAuthenticatedRoutes<T = any>(
        routeArray: RouteInterface[],
        allowedScopes: string,
        featureConfig: T, // TODO : Properly map FeatureConfigInterface type
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
     * @param manageRoutes - routes related to manage section
     * @param developRoutes - routes related to develop section
     * @param allowedScopes - allowed scopes
     * @param featureConfig - feature config
     * @param checkForUIResourceScopes - Specifies if the UI resource scope should be considered
     * @returns
     */
    public static getDisabledTab<T = any>(
        manageRoutes: RouteInterface[],
        developRoutes: RouteInterface[],
        allowedScopes: string,
        featureConfig: T, // TODO : Properly map FeatureConfigInterface type
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
