/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React from "react";
import { AppAvatar } from "../../../src";
import { meta } from "./app-avatar.stories.meta";

export default {
    parameters: {
        component: AppAvatar,
        componentSubtitle: meta.description,
    },
    title: "Components API/Components/App Avatar"
};

/**
 * Story to display all the app avatar variations.
 * @return {any}
 */
export const All = () => {
    return (
        <>
            <AppAvatar
                name="User Portal"
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

All.story = {
    parameters: {
        docs: {
            storyDescription: meta.description,
        },
    }
};

/**
 * Story to display the app avatar with initials.
 * @return {any}
 */
export const Initials = () => (
    <>
        <AppAvatar
            name="User Portal"
            size="tiny"
            spaced="right"
        />
    </>
);

Initials.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description,
        },
    }
};

/**
 * Story to display the app avatar from image.
 * @return {any}
 */
export const Image = () => (
    <>
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

Image.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description,
        },
    }
};
/**
 * Story to display the app avatar loading status.
 * @return {any}
 */
export const Placeholder = () => (
    <>
        <AppAvatar
            isLoading={ true }
            name="User Portal"
            size="tiny"
            spaced="right"
        />
    </>
);

Placeholder.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description,
        },
    }
};

/**
 * Story to display the app avatar sizes.
 * @return {any}
 */
export const Sizes = () => (
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

Sizes.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description,
        },
    }
};

/**
 * Story to enable user to dynamically interact with the avatar component.
 * @return {any}
 */
export const Playground = () => (
    <>
        <AppAvatar
            name={ text("Application name", "User Portal") }
            // tslint:disable:object-literal-sort-keys
            size={ select(
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
            ) }
            image={ text("Image URL", null) }
            isLoading={ boolean("Loading", false) }
            // tslint:enable:object-literal-sort-keys
            spaced={ radios("Spaced", { Right: "right", Left: "left" }, "right") }
        />
    </>
);

Playground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description,
        },
    }
};
