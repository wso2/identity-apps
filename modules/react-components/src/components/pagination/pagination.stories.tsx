/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { action } from "@storybook/addon-actions";
import React, { ReactElement, SyntheticEvent } from "react";
import { PaginationProps } from "semantic-ui-react";
import { meta } from "./pagination.stories.meta";
import { Pagination } from "../pagination";

export default {
    parameters: {
        component: Pagination,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Pagination"
};

/**
 * Story to display default pagination.
 *
 * @returns the Pagination component
 */
export const DefaultPagination = (): ReactElement => (
    <Pagination
        onPageChange={ (event: SyntheticEvent, data: PaginationProps) => {
            action("Active Page - " + data.activePage);
        } }
        totalPages={ 5 }
    />
);

DefaultPagination.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display pagination with items per page dropdown.
 *
 * @returns the Pagination component
 */
export const PaginationWithItemsPerPage = (): ReactElement => (
    <Pagination
        showItemsPerPageDropdown
        onPageChange={ (event: SyntheticEvent, data: PaginationProps) => {
            action("Active Page - " + data.activePage);
        } }
        totalPages={ 5 }
    />
);

PaginationWithItemsPerPage.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display a minimal pagination.
 *
 * @returns Pagination component.
 */
export const Minimal = (): ReactElement => (
    <Pagination
        minimal
        totalPages={ 5 }
        onPageChange={ (event: SyntheticEvent, data: PaginationProps) => {
            action("Active Page - " + data.activePage);
        } }
    />
);

Minimal.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};
