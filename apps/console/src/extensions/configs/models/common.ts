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

import { HeaderExtension, HeaderLinkCategoryInterface } from "@wso2is/react-components";
import { HeaderSubPanelItemInterface } from "../../../features/core/components";
import { FeatureConfigInterface } from "../../../features/core/models";

export interface CommonConfig {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: boolean;
    };
    blockLoopBackCalls: boolean;
    checkForUIResourceScopes: boolean;
    enableOrganizationAssociations: boolean;
    header: {
        /**
         * Get the extensions for the header.
         * @return {HeaderExtension[]}
         */
        getHeaderExtensions: () => HeaderExtension[];
        /**
         * Get the extensions for the Header sub panel.
         * These will come along with the `Manage` & `Develop` links.
         * @return {{aligned: "left" | "right"; component: React.ReactElement; order: number}[]}
         */
        getHeaderSubPanelExtensions: () => HeaderSubPanelItemInterface[];
        /**
         * Get the user dropdown link extensions.
         * @return {HeaderLinkCategoryInterface[]}
         */
        getUserDropdownLinkExtensions: () => HeaderLinkCategoryInterface[];
        /**
         * Should the app switcher be shown as nine dots dropdown.
         */
        renderAppSwitcherAsDropdown: boolean;
        /**
         * Header menu item config.
         */
        headerQuickstartMenuItem: string;
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
    userEditSection: {
        isGuestUser: boolean;
        showEmail: boolean;
    };
    hotjarTracking : {
        /*
         * Tag hotjar attributes. 
        */
        tagAttributes : () => void;
    }
}

/**
 * Types of views that are extended.
 * @remarks Any views other than `DEVELOP` and `MANAGE` can go here.
 * @readonly
 * @enum {string}
 */
export enum AppViewExtensionTypes { }

/**
 * Interface for the extended feature configs.
 */
export type ExtendedFeatureConfigInterface = FeatureConfigInterface;
