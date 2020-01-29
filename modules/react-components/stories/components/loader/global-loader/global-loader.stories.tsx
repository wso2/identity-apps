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

import { boolean, number } from "@storybook/addon-knobs";
import React, { useEffect, useState } from "react";
import { GlobalLoader } from "../../../../src";
import { meta } from "./global-loader.stories.meta";

export default {
    parameters: {
        component: GlobalLoader,
        componentSubtitle: meta.description,
    },
    title: "Components API/Components/Global Loader"
};

/**
 * Story to display the global loader component.
 * @return {any}
 */
export const Global = () => {

    const [ visibility, setVisibility ] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setVisibility(!visibility);
        }, 100);
    }, []);

    return (
        <GlobalLoader height={ 3 } visibility={ visibility }/>
    );
};

Global.story = {
    parameters: {
        docs: {
            storyDescription: meta.description,
        },
    }
};

/**
 * Story to enable user to dynamically interact with the avatar component.
 * @return {any}
 */
export const Playground = () => (
    <GlobalLoader
        height={ number("Height", 3, { range: true, min: 1, max: 50, step: 1 }) }
        visibility={ boolean("Visibility", false) }
    />
);

Playground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description,
        },
    }
};
