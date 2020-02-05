/*
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
 */

import { withKnobs } from "@storybook/addon-knobs";
import { UserIcon } from "@wso2is/theme";
import React from "react";
import { Button, DangerButton, IconButton, LinkButton, PrimaryButton, SecondaryButton } from "../../../src";
import { meta } from "./button.stories.meta";

export default {
    decorators: [ withKnobs ],
    parameters: {
        component: Button,
        componentSubtitle: meta.description,
    },
    title: "Components API/Components/Button"
};

/**
 * Story to display the default button.
 * @return {any}
 */
export const Default = () => (
    <Button>Default Button</Button>
);

Default.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description,
        },
    }
};

/**
 * Story to display the primary button.
 * @return {any}
 */
export const Primary = () => (
    <PrimaryButton>Primary Button</PrimaryButton>
);

Primary.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description,
        },
    }
};

/**
 * Story to display the secondary button.
 * @return {any}
 */
export const Secondary = () => (
    <SecondaryButton>Secondary Button</SecondaryButton>
);

Secondary.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description,
        },
    }
};

/**
 * Story to display the link button.
 * @return {any}
 */
export const Link = () => (
    <LinkButton>Link Button</LinkButton>
);

Link.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description,
        },
    }
};

/**
 * Story to display the danger button.
 * @return {any}
 */
export const Danger = () => (
    <DangerButton>Danger Button</DangerButton>
);

Danger.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description,
        },
    }
};

/**
 * Story to display the icon button.
 * @return {any}
 */
export const Icon = () => (
    <IconButton customIcon={ UserIcon }>Icon Button</IconButton>
);

Icon.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 5 ].description,
        },
    }
};
