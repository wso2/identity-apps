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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
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
export interface PaginationPropsInterface extends PaginationProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Current list count.
     */
    currentListSize?: number;
    /**
     * Disables the next button used in minimal pagination.
     */
    disableNextButton?: boolean;
    /**
     * Disables the previous button used in minimal pagination.
     */
    disablePreviousButton?: boolean;
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
     * Minimal Mode toggle.
     */
    minimal?: boolean;
    /**
     * Overrides the default Next button text.
     */
    nextButtonText?: string;
    /**
     * Callback for items per page change.
     * @param {React.SyntheticEvent<HTMLElement>} event - Click event.
     * @param {DropdownProps} data - Data.
     */
    onItemsPerPageDropdownChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    /**
     * Overrides the default Previous button text.
     */
    previousButtonText?: string;
    /**
     * Items per page dropdown visibility.
     */
    showItemsPerPageDropdown?: boolean;
    /**
     * Show/ Hide list summary.
     */
    showListSummary?: boolean;
    /**
     * Whether to show page numbers on minimal mode.
     */
    showPagesOnMinimalMode?: boolean;
    /**
     * Total size of the list.
     */
    totalListSize?: number;
    /**
     * Called when the page change event occurs.
     * 
     * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} event MouseEvent.
     * @param {PaginationProps} data Pagination props data.
     */
    onPageChange?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => void;
    /**
     * Toggles pagination reset.
     */
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
        disableNextButton,
        disablePreviousButton,
        itemsPerPageDropdownLabel,
        itemsPerPageDropdownLowerLimit,
        itemsPerPageDropdownMultiple,
        itemsPerPageDropdownUpperLimit,
        minimal,
        nextButtonText,
        onItemsPerPageDropdownChange,
        onPageChange,
        previousButtonText,
        resetPagination,
        showItemsPerPageDropdown,
        showPagesOnMinimalMode,
        totalPages,
        [ "data-componentid" ]: componentId,
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
     * Reset the pagination page if the page limit changes.
     */
    const resetAll = (): void => {
        setActivePage(1);
        onPageChange(null, { activePage: 1, totalPages: totalPages });
    };

    /**
     * This is called when page change occurs.
     * 
     * @param {React.MouseEvent<HTMLAnchorElement, MouseEvent>} event Mouse event.
     * @param {PaginationProps} data Semantic pagination props.
     */
    const pageChangeHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps): void => {
        setActivePage(parseInt(data.activePage.toString()));
        onPageChange(event, data);
    };

    /**
     * Renders the content based on the mode.
     * @return {React.ReactElement}
     */
    const renderChildren = (): ReactElement => {

        const ItemsPerPageDropdown: ReactElement = (
            showItemsPerPageDropdown && (
                <label className="page-limit-label">
                    { itemsPerPageDropdownLabel }
                    <Dropdown
                        data-componentid={ `${ componentId }-items-per-page-dropdown` }
                        data-testid={ `${ testId }-items-per-page-dropdown` }
                        className="labeled horizontal right page-limit-dropdown"
                        compact
                        defaultValue={ itemsPerPageDropdownLowerLimit }
                        options={ generatePageCountDropdownOptions() }
                        onChange={ (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
                            resetAll();
                            onItemsPerPageDropdownChange(event, data);
                        } }
                        selection
                    />
                </label>
            )
        );

        if (minimal) {
            return (
                <>
                    { ItemsPerPageDropdown }
                    <SemanticPagination
                        { ...rest }
                        totalPages={ totalPages }
                        className="list-pagination"
                        data-componentid={ `${ componentId }-steps` }
                        data-testid={ `${ testId }-steps` }
                        activePage={ activePage }
                        onPageChange={ pageChangeHandler }
                        ellipsisItem={ null }
                        firstItem={ null }
                        lastItem={ null }
                        pageItem={ showPagesOnMinimalMode ? undefined : null }
                        prevItem={ {
                            "aria-label": "Previous Page",
                            content: previousButtonText,
                            disabled: disablePreviousButton !== undefined
                                ? disablePreviousButton
                                : (activePage === 1)
                        } }
                        nextItem={ {
                            "aria-label": "Next Page",
                            content: nextButtonText,
                            disabled: disableNextButton !== undefined
                                ? disableNextButton
                                : (activePage === totalPages)
                        } }
                    />
                </>
            );
        }

        return (
            <>
                { ItemsPerPageDropdown }
                <SemanticPagination
                    { ...rest }
                    totalPages={ totalPages }
                    className="list-pagination"
                    data-componentid={ `${ componentId }-steps` }
                    data-testid={ `${ testId }-steps` }
                    activePage={ activePage }
                    onPageChange={ pageChangeHandler }
                />
            </>
        );
    };

    return (
        <div
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            { renderChildren() }
        </div>
    );
};

/**
 * Prop types for the Pagination component.
 */
Pagination.defaultProps =  {
    "data-componentid": "pagination",
    "data-testid": "pagination",
    float: "right",
    itemsPerPageDropdownLabel: "Items per page",
    itemsPerPageDropdownLowerLimit: 10,
    itemsPerPageDropdownMultiple: 10,
    itemsPerPageDropdownUpperLimit: 50,
    minimal: false,
    nextButtonText: "Next",
    previousButtonText: "Previous",
    showItemsPerPageDropdown: false,
    showPagesOnMinimalMode: false
};
