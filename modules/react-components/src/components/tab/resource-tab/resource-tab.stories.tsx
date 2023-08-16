/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { meta } from "./resource-tab.stories.meta";
import { ResourceTab } from "../../tab";

export default {
    parameters: {
        component: ResourceTab,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Resource Tab"
};

/**
 * Story to display the default tabs.
 *
 * @returns the resource tab component
 */
export const DefaultResourceTab = (): ReactElement => {
    const panes = [
        {
            menuItem: "Tab 1",
            render: () => <ResourceTab.Pane>Tab one content</ResourceTab.Pane>
        },
        {
            menuItem: "Tab 2",
            render: () => <ResourceTab.Pane>Tab two content</ResourceTab.Pane>
        },
        {
            menuItem: "Tab 3",
            render: () => <ResourceTab.Pane>Tab three content</ResourceTab.Pane>
        }
    ];

    return (
        <ResourceTab panes={ panes } />
    );
};

DefaultResourceTab.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
