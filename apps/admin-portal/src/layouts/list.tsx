/* eslint-disable @typescript-eslint/no-unused-vars */
/*
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

import { Pagination } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useState } from "react";
import { Divider, DropdownItemProps, DropdownProps, Grid, PaginationProps, Dropdown, Popup, Icon } from "semantic-ui-react";

/**
 * List layout component Prop types.
 */
interface ListLayoutPropsInterface extends PaginationProps {
    advancedSearch?: React.ReactNode;
    leftActionPanel?: React.ReactNode;
    listItemLimit?: number;
    onSortStrategyChange?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
    onSortOrderChange?: (isAscending: boolean) => void;
    rightActionPanel?: React.ReactNode;
    showPagination?: boolean;
    showTopActionPanel?: boolean;
    sortOptions?: DropdownItemProps[];
    sortStrategy?: DropdownItemProps;
    totalListSize?: number;
}

/**
 * List layout.
 *
 * @param {React.PropsWithChildren<ListLayoutPropsInterface>} props - Props injected to the component.
 * @return {ReactElement}
 */
export const ListLayout: FunctionComponent<PropsWithChildren<ListLayoutPropsInterface>> = (
    props: PropsWithChildren<ListLayoutPropsInterface>
): ReactElement => {

    const {
        advancedSearch,
        children,
        leftActionPanel,
        listItemLimit,
        onSortStrategyChange,
        onSortOrderChange,
        rightActionPanel,
        showPagination,
        showTopActionPanel,
        sortOptions,
        sortStrategy,
        totalListSize,
        totalPages,
        ...rest
    } = props;

    const [isAscending, setIsAscending] = useState(true);

    const classes = classNames(
        "layout",
        "list-layout"
    );

    return (
        <div className={ classes }>
            {
                showTopActionPanel && (
                    <>
                        <div className="top-action-panel">
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={ 4 }>
                                        <div className="left-aligned-actions">
                                            {
                                                sortOptions && sortStrategy && onSortStrategyChange && (
                                                    <>
                                                        <Dropdown
                                                            onChange={ onSortStrategyChange }
                                                            options={ sortOptions }
                                                            placeholder={ "Sort by" }
                                                            selection
                                                            value={ sortStrategy.value }
                                                        />
                                                        {
                                                            onSortOrderChange
                                                            && (
                                                                <Popup
                                                                    trigger={
                                                                        <Icon
                                                                            className="left-aligned-action"
                                                                            name={
                                                                                isAscending
                                                                                    ? "sort amount down"
                                                                                    : "sort amount up"
                                                                            }
                                                                            size="large"
                                                                            onClick={ () => {
                                                                                setIsAscending(!isAscending);
                                                                                onSortOrderChange(!isAscending);
                                                                            } }
                                                                            link
                                                                        />
                                                                    }
                                                                    content={
                                                                        isAscending
                                                                            ? "Sort in the descending order"
                                                                            : "Sort in the ascending order"
                                                                    }
                                                                    inverted
                                                                />
                                                            )
                                                        }
                                                    </>
                                                )
                                            }
                                            {leftActionPanel}
                                        </div>
                                        <div className="left-aligned-actions">
                                            {leftActionPanel}
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column width={ 8 }>
                                        <div className="actions right-aligned">
                                            {advancedSearch}
                                            {rightActionPanel}
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                        <Divider hidden />
                    </>
                )
            }
            <div className="list-container">
                {children}
                {
                    (showPagination && totalListSize)
                        ? (
                            <Pagination
                                totalListSize={ totalListSize }
                                totalPages={ totalPages }
                                { ...rest }
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
    showTopActionPanel: true,
    showPagination: false
};
