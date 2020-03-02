/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

import React, { ReactElement, useState } from "react";
import { SidePanel } from "../../../src";
import { meta, ROUTES, ROUTES_WITH_CHILDREN } from "./side-panel.stories.meta";
import { action } from "@storybook/addon-actions";
import { SidePanelIconSet, CaretRightIcon } from "@wso2is/theme";
import { ChildRouteInterface, RouteInterface } from "@wso2is/core/models";

export default {
    parameters: {
        component: SidePanel,
        componentSubtitle: meta.description,
    },
    title: "Components API/Components/Side Panel"
};

/**
 * Story to display a default side panel.
 *
 * @return {React.ReactElement}
 */
export const Default = (): ReactElement => {

    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(ROUTES[0]);

    return (
        <div style={ { width: "200px", margin: "1em 0" } }>
            <SidePanel
                caretIcon={ CaretRightIcon }
                onSidePanelItemClick={ action("clicked on item") }
                icons={ SidePanelIconSet }
                routes={ ROUTES }
                selected={ selectedRoute }
                footerHeight={ 0 }
                headerHeight={ 0 }
                mobileSidePanelVisibility={ false }
                onSidePanelPusherClick={ null }
            />
        </div>
    );
};

Default.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description,
        },
    }
};

/**
 * Story to display a side panel with children.
 *
 * @return {React.ReactElement}
 */
export const WithChildren = (): ReactElement => {

    const [ selectedRoute, setSelectedRoute ] = useState<RouteInterface | ChildRouteInterface>(ROUTES[0]);

    const handleSidePanelItemClick = (route: RouteInterface | ChildRouteInterface): void => {
        if (!route.children) {
            setSelectedRoute(route);
        }
    };

    return (
        <div style={ { width: "200px", margin: "1em 0" } }>
            <SidePanel
                caretIcon={ CaretRightIcon }
                onSidePanelItemClick={ handleSidePanelItemClick }
                icons={ SidePanelIconSet }
                routes={ ROUTES_WITH_CHILDREN }
                selected={ selectedRoute }
                footerHeight={ 0 }
                headerHeight={ 0 }
                mobileSidePanelVisibility={ false }
                onSidePanelPusherClick={ null }
            />
        </div>
    );
};

WithChildren.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description,
        },
    }
};
