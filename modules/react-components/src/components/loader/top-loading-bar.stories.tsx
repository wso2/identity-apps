/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement, useEffect, useState } from "react";
import { TopLoadingBar } from "./top-loading-bar";
import { meta } from "./top-loading-bar.stories.meta";

export default {
    parameters: {
        component: TopLoadingBar,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Top Loading Bar"
};

/**
 * Story to display the global loader component.
 *
 * @returns the story for displaying the global loader component.
 */
export const DefaultTopLoadingBar = (): ReactElement=> {

    const [ visibility, setVisibility ] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setVisibility(!visibility);
        }, 100);
    }, []);

    return (
        <TopLoadingBar height={ 3 } visibility={ visibility }/>
    );
};

DefaultTopLoadingBar.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to enable user to dynamically interact with the avatar component.
 *
 * @returns the story for enabling user to dynamically interact with the avatar component.
 */
export const TopLoadingBarPlayground = (): ReactElement => (
    <TopLoadingBar
        height={ 3 }
        visibility={ false }
    />
);

TopLoadingBarPlayground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};
