/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { MouseEvent, useMemo, useState } from "react";
import { DropdownProps, PaginationProps } from "semantic-ui-react";

export interface UsePaginationInterface<T> {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    paginatedItems: T[];
    handlePaginationChange: (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps) => void;
    handleItemsPerPageDropdownChange: (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps) => void;
    resetToFirstPage: () => void;
}

const usePagination = <T>(items: T[], defaultItemsPerPage?: number): UsePaginationInterface<T> => {
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = useState<number>(
        defaultItemsPerPage || UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT
    );

    const totalPages: number = useMemo(() => {
        return Math.ceil(items.length / itemsPerPage);
    }, [ items.length, itemsPerPage ]);

    const paginatedItems: T[] = useMemo(() => {
        const startIndex: number = (currentPage - 1) * itemsPerPage;
        const endIndex: number = startIndex + itemsPerPage;

        return items.slice(startIndex, endIndex);
    }, [ items, currentPage, itemsPerPage ]);

    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setCurrentPage(data.activePage as number);
    };

    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setItemsPerPage(data.value as number);
        setCurrentPage(1);
    };

    const resetToFirstPage = (): void => {
        setCurrentPage(1);
    };

    return {
        currentPage,
        handleItemsPerPageDropdownChange,
        handlePaginationChange,
        itemsPerPage,
        paginatedItems,
        resetToFirstPage,
        totalPages
    };
};

export default usePagination;
