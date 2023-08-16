/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
