/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { ChildRouteInterface, RouteInterface } from "@wso2is/core/models";
import React, { ReactElement, useState } from "react";
import { ROUTES, ROUTES_WITH_CHILDREN, meta } from "./side-panel.stories.meta";
import { SidePanel } from "../side-panel";

export default {
    parameters: {
        component: SidePanel,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Side Panel"
};

/**
 * Story to display a default side panel.
 *
 * @returns a React component
 */
export const DefaultSidePanel = (): ReactElement => {

    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(ROUTES[0]);

    const handleSidePanelItemClick = (route: RouteInterface | ChildRouteInterface): void => {
        if (!route.children) {
            setSelectedRoute(route);
        }
    };

    return (
        <div style={ { margin: "1em 0", width: "200px" } }>
            <SidePanel
                onSidePanelItemClick={ handleSidePanelItemClick }
                hoverType="background"
                routes={ ROUTES }
                selected={ selectedRoute }
                footerHeight={ 0 }
                headerHeight={ 0 }
                mobileSidePanelVisibility={ false }
                onSidePanelPusherClick={ null }
                allowedScopes={ null }
            />
        </div>
    );
};

DefaultSidePanel.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display a side panel with children.
 *
 * @returns a React component
 */
export const WithChildren = (): ReactElement => {

    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(ROUTES_WITH_CHILDREN[0]);

    const handleSidePanelItemClick = (route: RouteInterface | ChildRouteInterface): void => {
        if (!route.children) {
            setSelectedRoute(route);
        }
    };

    return (
        <div style={ { margin: "1em 0", width: "200px" } }>
            <SidePanel
                onSidePanelItemClick={ handleSidePanelItemClick }
                hoverType="background"
                routes={ ROUTES_WITH_CHILDREN }
                selected={ selectedRoute }
                footerHeight={ 0 }
                headerHeight={ 0 }
                mobileSidePanelVisibility={ false }
                onSidePanelPusherClick={ null }
                allowedScopes={ null }
            />
        </div>
    );
};

WithChildren.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display a categorized side panel.
 *
 * @returns a React component
 */
export const Categorized = (): ReactElement => {

    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(ROUTES_WITH_CHILDREN[0]);

    const handleSidePanelItemClick = (route: RouteInterface | ChildRouteInterface): void => {
        if (!route.children) {
            setSelectedRoute(route);
        }
    };

    return (
        <div style={ { margin: "1em 0", width: "200px" } }>
            <SidePanel
                categorized={ true }
                hoverType="background"
                onSidePanelItemClick={ handleSidePanelItemClick }
                routes={ ROUTES_WITH_CHILDREN }
                selected={ selectedRoute }
                footerHeight={ 0 }
                headerHeight={ 0 }
                mobileSidePanelVisibility={ false }
                onSidePanelPusherClick={ null }
                allowedScopes={ null }
            />
        </div>
    );
};

Categorized.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};
