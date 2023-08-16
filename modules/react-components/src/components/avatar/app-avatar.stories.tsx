/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { AppAvatar } from "./app-avatar";
import { meta } from "./app-avatar.stories.meta";

export default {
    parameters: {
        component: AppAvatar,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/App Avatar"
};

/**
 * Story to display all the app avatar variations.
 *
 * @returns the story for displaying all the app avatar variations.
 */
export const AllAppAvatarVariations = (): ReactElement => {
    return (
        <>
            <AppAvatar
                name="My Account"
                size="tiny"
                spaced="right"
            />
            <AppAvatar
                name="Google Drive"
                image={ "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/a3/62/4f/a3624fbc-6f28-da42-fc2e-a01a" +
                "4c93943d/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-6.png/246x0w.jpg"
                }
                size="tiny"
                spaced="right"
            />
        </>
    );
};

AllAppAvatarVariations.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display the app avatar with initials.
 *
 * @returns the story for displaying the app avatar with initials.
 */
export const AppAvatarWithInitials = (): ReactElement => (
    <AppAvatar
        name="My Account"
        size="tiny"
        spaced="right"
    />
);

AppAvatarWithInitials.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display the app avatar from image.
 *
 * @returns the story for displaying the app avatar from image.
 */
export const AppAvatarFromImage = (): ReactElement => (
    <AppAvatar
        name="Google Drive"
        image={ "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/a3/62/4f/a3624fbc-6f28-da42-fc2e-a01a" +
        "4c93943d/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-6.png/246x0w.jpg"
        }
        size="tiny"
        spaced="right"
    />
);

AppAvatarFromImage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display the app avatar loading status.
 *
 * @returns the story for displaying the app avatar loading status.
 */
export const AppAvatarPlaceholder = (): ReactElement => (
    <AppAvatar
        isLoading={ true }
        name="My Account"
        size="tiny"
        spaced="right"
    />
);

AppAvatarPlaceholder.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display the app avatar sizes.
 *
 * @returns the story for displaying the app avatar sizes.
 */
export const AppAvatarSizes = (): ReactElement => (
    <>
        <AppAvatar
            spaced="right"
            size="mini"
            name="mini"
        />
        <AppAvatar
            spaced="right"
            size="little"
            name="little"
        />
        <AppAvatar
            spaced="right"
            size="tiny"
            name="tiny"
        />
        <AppAvatar
            spaced="right"
            size="small"
            name="small"
        />
    </>
);

AppAvatarSizes.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};
