/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { ReactElement } from "react";
import { meta } from "./heading.stories.meta";
import { Heading } from "../typography";

export default {
    parameters: {
        component: Heading,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Heading"
};

/**
 * Story to display the default heading.
 *
 * @returns the default heading
 */
export const DefaultHeading = (): ReactElement => (
    <Heading>Heading Default</Heading>
);

DefaultHeading.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display page headings.
 *
 * @returns a list of page headings
 */
export const PageHeadings = (): ReactElement => (
    <>
        <Heading as="h1">Heading H1</Heading>
        <Heading as="h2">Heading H2</Heading>
        <Heading as="h3">Heading H3</Heading>
        <Heading as="h4">Heading H4</Heading>
        <Heading as="h5">Heading H5</Heading>
        <Heading as="h6">Heading H6</Heading>
    </>
);

PageHeadings.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display different heading sizes.
 *
 * @returns a list of headings to be used in Storybook stories
 */
export const HeadingSizes = (): ReactElement => (
    <>
        <Heading size="huge">Heading Huge</Heading>
        <Heading size="large">Heading Large</Heading>
        <Heading size="medium">Heading Medium</Heading>
        <Heading size="small">Heading Small</Heading>
        <Heading size="tiny">Heading Tiny</Heading>
    </>
);

HeadingSizes.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display heading with ellipsis.
 *
 * @returns HeadingWithElipsis React Component
 */
export const HeadingWithEllipsis = (): ReactElement => (
    <div style={ { width: "300px" } }>
        <Heading ellipsis>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
        </Heading>
    </div>
);

HeadingWithEllipsis.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};
