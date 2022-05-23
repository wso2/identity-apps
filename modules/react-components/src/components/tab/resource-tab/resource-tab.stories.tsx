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
 * @return {React.ReactElement}
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
