/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
