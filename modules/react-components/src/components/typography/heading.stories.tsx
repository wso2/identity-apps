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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
