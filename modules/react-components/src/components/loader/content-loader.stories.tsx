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

import { boolean, text } from "@storybook/addon-knobs";
import React, { ReactElement, useEffect, useState } from "react";
import { meta } from "./top-loading-bar.stories.meta";
import { ContentLoader } from "../../../src";

export default {
    parameters: {
        component: ContentLoader,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Content Loader"
};

/**
 * Story to display the content loader default behaviour.
 *
 * @return {React.ReactElement}
 */
export const DefaultContentLoader = (): ReactElement => {

    const [ visibility, setVisibility ] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setVisibility(!visibility);
        }, 100);
    }, []);

    return (
        <ContentLoader active={ visibility }/>
    );
};

DefaultContentLoader.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to enable user to dynamically interact with the content loader component.
 *
 * @return {React.ReactElement}
 */
export const ContentLoaderPlayground = (): ReactElement => (
    <ContentLoader
        text={ text("Text", "Loading") }
        active={ boolean("Active", true) }
        dimmer={ boolean("Dimmer", true) }
    />
);

ContentLoaderPlayground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};
