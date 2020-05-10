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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import {
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    PaginationProps,
    Pagination as SemanticPagination
} from "semantic-ui-react";

/**
 * Prop types for the pagination component.
 */
export interface PaginationPropsInterface extends PaginationProps, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Current list count.
     */
    currentListSize?: number;
    /**
     * Float direction.
     */
    float?: "left" | "right";
    /**
     * Label for items per page dropdown.
     */
    itemsPerPageDropdownLabel?: string;
    /**
     * Label for items per page lower limit.
     */
    itemsPerPageDropdownLowerLimit?: number;
    /**
     * Label for items per page dropdown multiple.
     */
    itemsPerPageDropdownMultiple?: number;
    /**
     * Label for items per page dropdown upper limit.
     */
    itemsPerPageDropdownUpperLimit?: number;
    /**
     * Callback for items per page change.
     * @param {React.SyntheticEvent<HTMLElement>} event - Click event.
     * @param {DropdownProps} data - Data.
     */
    onItemsPerPageDropdownChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    /**
     * Items per page dropdown visibility.
     */
    showItemsPerPageDropdown?: boolean;
    /**
     * Show/ Hide list summary.
     */
    showListSummary?: boolean;
    /**
     * Total size of the list.
     */
    totalListSize?: number;
    onPageChange: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => void;
    resetPagination?: boolean;
}

/**
 * Pagination component.
 *
 * @param {PaginationPropsInterface} props - Props injected in to the component.
 *
 * @return {React.ReactElement}
 */
export const Pagination: FunctionComponent<PaginationPropsInterface> = (
    props: PaginationPropsInterface
): ReactElement => {

    const [ activePage, setActivePage ] = useState<number>(1);

    const init = useRef(true);
    
    const {
        className,
        currentListSize,
        itemsPerPageDropdownLabel,
        itemsPerPageDropdownLowerLimit,
        itemsPerPageDropdownMultiple,
        itemsPerPageDropdownUpperLimit,
        onItemsPerPageDropdownChange,
        onPageChange,
        resetPagination,
        showItemsPerPageDropdown,
        showListSummary,
        totalListSize,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "pagination-bar",
        className
    );

    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            setActivePage(1);
        }
    }, [ resetPagination ]);
    
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

    /**
     * This is called when page change occurs.
     * 
     * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} event Mouse event.
     * @param {PaginationProps} data Semantic pagination props.
     */
    const pageChangeHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => {
        setActivePage(parseInt(data.activePage.toString()));
        onPageChange(event, data);
    };

    return (
        <div className={ classes } data-testid={ testId }>
            {
                showItemsPerPageDropdown && (
                    <label>
                        { itemsPerPageDropdownLabel }
                        <Dropdown
                            data-testid={ `${ testId }-items-per-page-dropdown` }
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
                data-testid={ `${ testId }-steps` }
                { ...rest }
                activePage={ activePage }
                onPageChange={ pageChangeHandler }
            />
        </div>
    );
};

/**
 * Prop types for the Pagination component.
 */
Pagination.defaultProps =  {
	activePage: 1,
    "data-testid": "pagination",
    defaultActivePage: 1,
    float: "right",
    itemsPerPageDropdownLabel: "Items per page",
    itemsPerPageDropdownLowerLimit: 10,
    itemsPerPageDropdownMultiple: 10,
    itemsPerPageDropdownUpperLimit: 50,
    showItemsPerPageDropdown: true
};
