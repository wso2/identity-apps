/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as React from "react";
import { meta } from "./hint.stories.meta";
import { Hint } from "../typography";

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
 * @returns DefaultHint React Component
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
 * @returns HintWithIcon React Component
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
 * @returns HintAsPopup React Component
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
