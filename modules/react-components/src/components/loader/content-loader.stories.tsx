/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement, useEffect, useState } from "react";
import { ContentLoader } from "./content-loader";
import { meta } from "./top-loading-bar.stories.meta";

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
 * @returns the story for displaying the default behaviour of the content loader.
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
 * @returns the story for enabling user to dynamically interact with the content loader component.
 */
export const ContentLoaderPlayground = (): ReactElement => (
    <ContentLoader
        text="Loading"
        active={ true }
        dimmer={ true }
    />
);

ContentLoaderPlayground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};
