/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { FeatureConfigInterface } from "../../../features/core/models";

export interface CommonConfig {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: boolean;
    };
    blockLoopBackCalls: boolean;
    checkCustomLayoutExistanceBeforeEnabling: boolean;
    checkForUIResourceScopes: boolean;
    enableDefaultBrandingPreviewSection: boolean;
    enableDefaultPreLoader: boolean;
    enableOrganizationAssociations: boolean;
    header: {
        /**
         * Header menu item config.
         */
        headerQuickstartMenuItem: string;
        /**
         * Should the app switcher be shown as nine dots dropdown.
         */
        renderAppSwitcherAsDropdown: boolean;
    };
    footer: {
        customClassName: string;
    };
    leftNavigation: {
        /**
         * Should the side panel be categorized for different views.
         */
        isLeftNavigationCategorized: {
            develop: boolean;
            manage: boolean;
        };
    };
    primaryUserstoreOnly: boolean;
    useExtendedRoutes: boolean;
    userEditSection: {
        isGuestUser: boolean;
        showEmail: boolean;
    };
}

/**
 * Types of views that are extended.
 * @remarks Any views other thant `DEVELOP` and `MANAGE` can go here.
 * @readonly
 */
export enum AppViewExtensionTypes {
    QUICKSTART = "QUICKSTART"
}

/**
 * Interface for the extended feature configs.
 */
export interface ExtendedFeatureConfigInterface extends FeatureConfigInterface {
    /**
     * API resource feature.
     */
    apiResources?: FeatureAccessConfigInterface;
    /**
     * Application roles feature.
     */
    applicationRoles?: FeatureAccessConfigInterface;
    /**
     * Branding feature.
     */
    branding?: FeatureAccessConfigInterface;
    /**
     * Try it application feature
     */
    tryIt?: FeatureAccessConfigInterface;
}
