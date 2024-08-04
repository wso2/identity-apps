/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { UIConstants } from "@wso2is/core/constants";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import {
    Button,
    Divider,
    Dropdown, DropdownItemProps,
    DropdownProps,
    Grid,
    Icon,
    PaginationProps,
    Placeholder
} from "semantic-ui-react";
import { DataTable, Pagination, PaginationPropsInterface } from "../components";

/**
 * List layout component Prop types.
 */
export interface ListLayoutPropsInterface extends PaginationProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Advance search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Position of the advanced search component.
     */
    advancedSearchPosition?: "left" | "right";
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Disables Left action panel component.
     */
    disableLeftActionPanel?: boolean;
    /**
     * Disables Right action panel component.
     */
    disableRightActionPanel?: boolean;
    /**
     * Check if the list is loading
     */
    isLoading?: boolean;
    /**
     * Left action panel component.
     */
    leftActionPanel?: ReactNode;
    /**
     * Limit for the list.
     */
    listItemLimit?: number;
    /**
     * Flag to enable pagination minimal mode.
     */
    minimalPagination?: boolean;
    /**
     * Callback to be fired on page number change.
     * @param event - Mouse event.
     * @param data - Pagination data.
     */
    onPageChange: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) => void;
    /**
     * Callback to be fired when the sort strategy is changed.
     * @param event - Synthetic event.
     * @param data - Metadata.
     */
    onSortStrategyChange?: (event: SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    /**
     * Callback to be fired when the sort order is changed.
     * @param isAscending - Is the order ascending.
     */
    onSortOrderChange?: (isAscending: boolean) => void;
    /**
     * Extra props to override the default pagination props.
     */
    paginationOptions?: Omit<PaginationPropsInterface, "totalPages">;
    /**
     * Flag to reset the pagination.
     */
    resetPagination?: boolean;
    /**
     * Right action panel component.
     */
    rightActionPanel?: ReactNode;
    /**
     * Flag to toggle pagination visibility.
     */
    showPagination?: boolean;
    /**
     * Flag to toggle pagination page limit dropdown visibility.
     */
    showPaginationPageLimit?: boolean;
    /**
     * Flag to toggle top action panel visibility.
     */
    showTopActionPanel?: boolean;
    /**
     * Sort options.
     */
    sortOptions?: DropdownItemProps[];
    /**
     * Sort strategies.
     */
    sortStrategy?: DropdownItemProps;
    /**
     * Total size of the list.
     */
    totalListSize?: number;
    /**
     * Callback for items per page change.
     * @param event - Click event.
     * @param data - Data.
     */
    onItemsPerPageDropdownChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    /**
     * Active page.
     */
    activePage?: number;
    /**
     * Top action panel extension.
     */
    topActionPanelExtension?: ReactNode;
}

/**
 * List layout.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
export const ListLayout: FunctionComponent<PropsWithChildren<ListLayoutPropsInterface>> = (
    props: PropsWithChildren<ListLayoutPropsInterface>
): ReactElement => {

    const {
        advancedSearch,
        advancedSearchPosition,
        children,
        className,
        defaultListItemLimit,
        disableLeftActionPanel,
        disableRightActionPanel,
        isLoading,
        leftActionPanel,
        minimalPagination,
        onItemsPerPageDropdownChange,
        onPageChange,
        onSortStrategyChange,
        onSortOrderChange,
        paginationOptions,
        resetPagination,
        rightActionPanel,
        showPagination,
        showPaginationPageLimit,
        showTopActionPanel,
        sortOptions,
        sortStrategy,
        totalListSize,
        totalPages,
        activePage,
        topActionPanelExtension,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const [ isAscending, setIsAscending ] = useState(true);

    const classes = classNames(
        "layout",
        "list-layout",
        className
    );

    return (
        <div
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            {
                showTopActionPanel && (
                    isLoading ? (
                        <Placeholder
                            fluid
                            style={ { background: "white", height: 40 } }
                        />
                    ) : (
                        <>
                            <div
                                className="top-action-panel"
                                data-componentid={ `${ componentId }-top-action-panel` }
                                data-testid={ `${ testId }-top-action-panel` }
                            >
                                { topActionPanelExtension && (
                                    <div className="top-action-panel-extension">
                                        { topActionPanelExtension }
                                    </div>
                                ) }
                                <Grid>
                                    <Grid.Row>
                                        {
                                            !disableLeftActionPanel
                                                ? (
                                                    <div className={ "left-aligned actions" }>
                                                        { advancedSearchPosition === "left" && advancedSearch }
                                                        { leftActionPanel }
                                                    </div>
                                                ) : null
                                        }
                                        {
                                            !disableRightActionPanel
                                                ? (
                                                    <div className="actions right-aligned">
                                                        { advancedSearchPosition === "right" && advancedSearch }
                                                        { rightActionPanel }
                                                        {
                                                            sortOptions &&
                                                            sortStrategy &&
                                                            onSortStrategyChange &&
                                                            onSortOrderChange && (
                                                                <div className="sort-list">
                                                                    <Dropdown
                                                                        onChange={ onSortStrategyChange }
                                                                        options={ sortOptions }
                                                                        placeholder={ "Sort by" }
                                                                        selection
                                                                        value={
                                                                            sortOptions?.length === 1
                                                                                ? sortOptions[0].value
                                                                                : sortStrategy.value
                                                                        }
                                                                        disabled={ sortOptions?.length === 1 }
                                                                        data-componentid={ `${componentId}-sort` }
                                                                        data-testid={ `${testId}-sort` }
                                                                    />
                                                                    <Button
                                                                        data-tooltip={ isAscending
                                                                            ? "Sort in the descending order"
                                                                            : "Sort in the ascending order"
                                                                        }
                                                                        data-position="top right"
                                                                        data-inverted=""
                                                                        icon
                                                                        onClick={ () => {
                                                                            setIsAscending(!isAscending);
                                                                            onSortOrderChange(!isAscending);
                                                                        } }
                                                                        className="left-aligned-action"
                                                                    >
                                                                        <Icon
                                                                            name={
                                                                                isAscending
                                                                                    ? "sort amount down"
                                                                                    : "sort amount up"
                                                                            }
                                                                        />
                                                                    </Button>
                                                                </div>
                                                            ) }
                                                    </div>
                                                ) : null }
                                    </Grid.Row>
                                </Grid>
                            </div>
                            <Divider hidden/>
                        </>
                    )) }
            <div className="list-container">
                {
                    isLoading ? (
                        <DataTable
                            isLoading={ true }
                            loadingStateOptions={ {
                                count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_LOADING_ITEM_LIMIT,
                                imageType: "square"
                            } }
                            columns={ [] }
                            data={ [] }
                            onRowClick={ null }
                        />
                    ) : children
                }
                {
                    (showPagination)
                        ? (
                            <Pagination
                                minimal={ minimalPagination }
                                showItemsPerPageDropdown={ showPaginationPageLimit }
                                data-componentid={ `${ componentId }-pagination` }
                                data-testid={ `${ testId }-pagination` }
                                resetPagination={ resetPagination }
                                totalListSize={ totalListSize }
                                totalPages={ totalPages }
                                onPageChange={ onPageChange }
                                onItemsPerPageDropdownChange={ onItemsPerPageDropdownChange }
                                hidden={ totalListSize === 0 || totalListSize === undefined }
                                { ...paginationOptions }
                                activePage={ activePage }
                            />
                        )
                        : null
                }
            </div>
        </div>
    );
};

/**
 * Default props for the list layout.
 */
ListLayout.defaultProps = {
    advancedSearchPosition: "left",
    "data-componentid": "list-layout",
    "data-testid": "list-layout",
    disableLeftActionPanel: false,
    disableRightActionPanel: false,
    minimalPagination: true,
    showPagination: false,
    showPaginationPageLimit: true,
    showTopActionPanel: true
};
