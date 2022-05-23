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

import { action } from "@storybook/addon-actions";
import React, { ReactElement } from "react";
import { meta } from "./pagination.stories.meta";
import { Pagination } from "../../../src";

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
 * @return {React.ReactElement}
 */
export const DefaultPagination = (): ReactElement => (
    <Pagination
        onPageChange={ ({ activePage }: { activePage: number }) => action("Active Page - " + activePage) }
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
 * @return {React.ReactElement}
 */
export const PaginationWithItemsPerPage = (): ReactElement => (
    <Pagination
        showItemsPerPageDropdown
        onPageChange={ ({ activePage }: { activePage: number }) => action("Active Page - " + activePage) }
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
 * @return {React.ReactElement}
 */
export const Minimal = (): ReactElement => (
    <Pagination
        minimal
        totalPages={ 5 }
        onPageChange={ ({ activePage }: { activePage: number }) => action("Active Page - " + activePage) }
    />
);

Minimal.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};
