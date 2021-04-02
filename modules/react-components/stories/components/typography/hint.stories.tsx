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

import * as React from "react";
import { meta } from "./hint.stories.meta";
import { Hint } from "../../../src";

export default {
    parameters: {
        component: Hint,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Hint"
};

/**
 * Story to display the default hint.
 *
 * @return {React.ReactElement}
 */
export const DefaultHint = (): React.ReactElement => (
    <Hint>This is a default hint</Hint>
);

DefaultHint.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display a hint with an icon.
 *
 * @return {React.ReactElement}
 */
export const HintWithIcon = (): React.ReactElement => (
    <Hint icon="info circle">This is an example of a hint with an icon.</Hint>
);

HintWithIcon.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display a hint as a popup.
 *
 * @return {React.ReactElement}
 */
export const HintAsPopup = (): React.ReactElement => (
    <>
        Hover over the info icon
        <Hint icon="info circle" popup>
            This is an example of a hint inside a popup. Click <a>here</a> to read the docs.
        </Hint>
    </>
);

HintWithIcon.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};
