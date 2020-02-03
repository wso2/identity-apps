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
 */

import classNames from "classnames";
import React, { FunctionComponent } from "react";
import {
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Pagination as SemanticPagination,
    PaginationProps
} from "semantic-ui-react";

/**
 * Prop types for the pagination component.
 */
export interface PaginationPropsInterface extends PaginationProps {
    className?: string;
    currentListSize?: number;
    float?: "left" | "right";
    itemsPerPageDropdownLabel?: string;
    itemsPerPageDropdownLowerLimit?: number;
    itemsPerPageDropdownMultiple?: number;
    itemsPerPageDropdownUpperLimit?: number;
    onItemsPerPageDropdownChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    showItemsPerPageDropdown?: boolean;
    showListSummary?: boolean;
    totalListSize?: number;
}

/**
 * Pagination component.
 *
 * @param {PaginationPropsInterface} props - Props injected in to the component.
 * @return {JSX.Element}
 */
export const Pagination: FunctionComponent<PaginationPropsInterface> = (
    props: PaginationPropsInterface
): JSX.Element => {

    const {
        className,
        currentListSize,
        itemsPerPageDropdownLabel,
        itemsPerPageDropdownLowerLimit,
        itemsPerPageDropdownMultiple,
        itemsPerPageDropdownUpperLimit,
        onItemsPerPageDropdownChange,
        showItemsPerPageDropdown,
        showListSummary,
        totalListSize,
        ...rest
    } = props;

    const classes = classNames(
        "pagination-bar",
        className
    );

    const generatePageCountDropdownOptions = (): DropdownItemProps[] => {
        const options = [];

        for (let i = itemsPerPageDropdownLowerLimit; i <= itemsPerPageDropdownUpperLimit;
             i += itemsPerPageDropdownMultiple) {
            options.push({
                key: i,
                text: i,
                value: i
            });
        }

        return options;
    };

    return (
        <div className={ classes }>
            {
                showItemsPerPageDropdown && (
                    <label>
                        { itemsPerPageDropdownLabel }
                        <Dropdown
                            className="labeled horizontal right"
                            compact
                            defaultValue={ itemsPerPageDropdownLowerLimit }
                            options={ generatePageCountDropdownOptions() }
                            onChange={ onItemsPerPageDropdownChange }
                            selection
                        />
                    </label>
                )
            }
            <SemanticPagination
                className="list-pagination"
                { ...rest }
            />
        </div>
    );
};

/**
 * Prop types for the Pagination component.
 */
Pagination.defaultProps =  {
    defaultActivePage: 1,
    float: "right",
    itemsPerPageDropdownLabel: "Items per page",
    itemsPerPageDropdownLowerLimit: 10,
    itemsPerPageDropdownMultiple: 5,
    itemsPerPageDropdownUpperLimit: 50,
    showItemsPerPageDropdown: true
};
