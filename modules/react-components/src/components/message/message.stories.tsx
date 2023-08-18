/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
import { Message } from "./message";
import { meta } from "./message.stories.meta";
import { STORYBOOK_HIERARCHY } from "../../storybook-helpers/hierarchy";

export default {
    component: Message,
    title: STORYBOOK_HIERARCHY.MESSAGE
};

/**
 * Story to display all the Message variations.
 *
 * @returns Story.
 */
export const AllMessageVariations = (): ReactElement => {

    return (
        <>
            <Message
                type="info"
                content="This is an info message"
                header="Optional info message header"
                visible={ true }
            />
            <Message
                type="info"
                content="This is an info message without header"
                visible={ true }
            />
            <Message
                type="warning"
                content="This is a warning message"
                header="Optional warning message header"
                visible={ true }
            />
            <Message
                type="warning"
                content="This is a warning message without header"
                visible={ true }
            />
            <Message
                type="error"
                content="This is an error message"
                header="Optional error message header"
                visible={ true }
            />
            <Message
                type="error"
                content="This is an error message without header"
                visible={ true }
            />
            <Message
                type="success"
                content="This is a success message"
                header="Optional success message header"
                visible={ true }
            />
            <Message
                type="success"
                content="This is a success message without header"
                visible={ true }
            />
        </>
    );
};

AllMessageVariations.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display an info message.
 *
 * @returns Story.
 */
export const InfoMessage = (): ReactElement => {

    return (
        <Message
            type="info"
            content="This is an info message"
            header="Info message header"
            visible={ true }
        />
    );
};

InfoMessage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};

/**
 * Story to display a warning alert.
 *
 * @returns Story.
 */
export const WarningMessage = (): ReactElement => {

    return (
        <Message
            type="warning"
            content="This is a warning message"
            header="Warning message header"
            visible={ true }
        />
    );
};

WarningMessage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display an error alert.
 *
 * @returns Story.
 */
export const ErrorMessage = (): ReactElement => {

    return (
        <Message
            type="error"
            content="This is an error message"
            header="Error message header"
            visible={ true }
        />
    );
};

ErrorMessage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display a success alert.
 *
 * @returns Story.
 */
export const SuccessMessage = (): ReactElement => {

    return (
        <Message
            type="success"
            content="This is a success message"
            header="Success message header"
            visible={ true }
        />
    );
};

SuccessMessage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};
