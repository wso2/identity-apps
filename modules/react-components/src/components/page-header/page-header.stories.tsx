/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
 * @returns a PageHeader component.
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
 * @returns the PageHeader React component.
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
