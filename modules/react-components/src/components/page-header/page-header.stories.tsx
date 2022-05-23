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
import { meta } from "./page-header.stories.meta";
import { AppAvatar } from "../avatar";
import { PageHeader } from "../page-header";

export default {
    parameters: {
        component: PageHeader,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Page Header"
};

/**
 * Story to display a default section.
 *
 * @return {React.ReactElement}
 */
export const DefaultPageHeader = (): ReactElement => (
    <PageHeader
        title="Header"
        description="A clear description for the page header"
        image={ (
            <AppAvatar
                name="My Account"
                size="tiny"
                spaced="right"
            />
        ) }
        backButton={ {
            onClick: null,
            text: "Go back to list"
        } }
        titleTextAlign="left"
    />
);

DefaultPageHeader.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display a page header loading state.
 *
 * @return {React.ReactElement}
 */
export const PageHeaderPlaceholder = (): ReactElement => (
    <PageHeader
        title="Header"
        description="A clear description for the page header"
        image={ (
            <AppAvatar
                name="My Account"
                size="tiny"
                spaced="right"
            />
        ) }
        isLoading={ true }
        backButton={ {
            onClick: null,
            text: "Go back to list"
        } }
        titleTextAlign="left"
    />
);

PageHeaderPlaceholder.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};
