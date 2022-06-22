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

import { boolean, radios, select, text } from "@storybook/addon-knobs";
import React, { ReactElement } from "react";
import { meta } from "./app-avatar.stories.meta";
import { AppAvatar } from "../../../src";

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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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

/**
 * Story to enable user to dynamically interact with the avatar component.
 *
 * @return {React.ReactElement}
 */
export const AppAvatarPlayground = (): ReactElement => (
    <AppAvatar
        name={ text("Application name", "My Account") }
        size={
            /* eslint-disable sort-keys */
            select(
                "Size",
                {
                    Mini: "mini",
                    Little: "little",
                    Tiny: "tiny",
                    Small: "small",
                    Medium: "medium",
                    Large: "large",
                    Big: "big",
                    Huge: "huge",
                    Massive: "massive"
                },
                "tiny"
            )
            /* eslint-enable sort-keys */
        }
        image={ text("Image URL", null) }
        isLoading={ boolean("Loading", false) }
        spaced={ radios("Spaced", { Left: "left",  Right: "right" }, "right") }
    />
);

AppAvatarPlayground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 5 ].description
        }
    }
};
