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

import React from "react";
import { Hint } from "../../../src";
import { meta } from "./hint.stories.meta";

export default {
    parameters: {
        component: Hint,
        componentSubtitle: meta.description,
    },
    title: "Components API/Components/Hint"
};

/**
 * Story to display the default hint.
 * @return {any}
 */
export const Default = () => (
    <Hint>This is a default hint</Hint>
);

Default.story = {
    parameters: {
        docs: {
            storyDescription: meta.description,
        },
    }
};

/**
 * Story to display a hint with an icon.
 * @return {any}
 */
export const WithIcon = () => (
    <Hint icon="info circle">This is an example of a hint with an icon.</Hint>
);

WithIcon.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description,
        },
    }
};
