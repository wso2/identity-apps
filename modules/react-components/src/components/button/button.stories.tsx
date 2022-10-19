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

import React, { ReactElement } from "react";
import { meta } from "./button.stories.meta";
import { DangerButton } from "./danger-button";
import { Button } from "./default-button";
import { IconButton } from "./icon-button";
import { LinkButton } from "./link-button";
import { PrimaryButton } from "./primary-button";
import { SecondaryButton } from "./secondary-button";

export default {
    parameters: {
        component: Button,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Button"
};

/**
 * Story to display the default button.
 *
 * @return {React.ReactElement}
 */
export const DefaultButtonVariation = (): ReactElement => (
    <Button>Default Button</Button>
);

DefaultButtonVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display the primary button.
 *
 * @return {React.ReactElement}
 */
export const PrimaryButtonVariation = (): ReactElement => (
    <PrimaryButton>Primary Button</PrimaryButton>
);

PrimaryButtonVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display the secondary button.
 *
 * @return {React.ReactElement}
 */
export const SecondaryButtonVariation = (): ReactElement => (
    <SecondaryButton>Secondary Button</SecondaryButton>
);

SecondaryButtonVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display the link button.
 *
 * @return {React.ReactElement}
 */
export const LinkButtonVariation = (): ReactElement => (
    <LinkButton>Link Button</LinkButton>
);

LinkButtonVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display the danger button.
 *
 * @return {React.ReactElement}
 */
export const DangerButtonVariation = (): ReactElement => (
    <DangerButton>Danger Button</DangerButton>
);

DangerButtonVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};

/**
 * Story to display the icon button.
 *
 * @return {React.ReactElement}
 */
export const IconButtonVariation = (): ReactElement => {

    /* eslint-disable max-len */
    const UserIcon = (
        <svg
            version="1.1"
            id="user-icon"
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width={ 14 }
            height={ 14 }
            viewBox="0 0 13.965 14"
        >
            <path
                className="path fill primary"
                fill="#fff"
                d="M.6,14H0A7.027,7.027,0,0,1,5.412,7.679a4,4,0,1,1,3.14,0A7.029,7.029,0,0,1,13.964,14h-.6A6.4,6.4,0,0,0,.6,14h0ZM3.582,4A3.4,3.4,0,1,0,6.982.6,3.4,3.4,0,0,0,3.582,4Z"
            />
        </svg>
    );
    /* eslint-enable max-len */

    return (
        <IconButton customIcon={ UserIcon }>Icon Button</IconButton>
    );
};

IconButtonVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 5 ].description
        }
    }
};
