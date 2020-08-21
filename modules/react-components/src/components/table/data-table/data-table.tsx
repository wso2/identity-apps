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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import get from "lodash/get";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent } from "react";
import {
    Dropdown,
    DropdownItemProps,
    Header,
    Icon,
    Placeholder,
    Popup,
    SemanticICONS,
    SemanticWIDTHS,
    Table, TableCellProps,
    TableProps
} from "semantic-ui-react";
import { Avatar } from "../../avatar";

/**
 * Interface for the data table component.
 */
export interface DataTablePropsInterface extends Omit<TableProps, "columns">, TestableComponentInterface {
    /**
     * Set of actions.
     */
    actions?: TableActionsInterface[];
    /**
     * Table data source.
     */
    columns: TableColumnInterface[];
    /**
     * Column count to divide its content evenly.
     */
    columnCount?: SemanticWIDTHS;
    /**
     * Table data source.
     */
    data: TableDataInterface[];
    /**
     * Table id.
     */
    id?: string;
    /**
     * Is the data loading.
     */
    isLoading?: boolean;
    /**
     * Optional meta for the loading state.
     */
    loadingStateOptions?: TableLoadingStateOptionsInterface;
    /**
     * Callback row selection.
     */
    onRowClick: (e: SyntheticEvent, item: TableDataInterface) => void;
    /**
     * Placeholders for the table.
     */
    placeholders?: ReactNode;
    /**
     * Should the table appear on a transparent background.
     */
    transparent?: boolean;
}

export interface StrictDataPropsInterface {
    /**
     * key prop for React.
     */
    key?: string | number;
}

export interface TableDataInterface extends StrictDataPropsInterface, TableCellProps {
    [ key: string ]: any;
}

export interface StrictColumnPropsInterface {
    /**
     * key prop for React.
     */
    key?: string | number;
    /**
     * Column title.
     */
    title?: ReactNode;
    /**
     * Index to find relevant data.
     */
    dataIndex: string | "action";
}

export interface TableColumnInterface extends StrictColumnPropsInterface {
    [ key: string ]: any;
}

export interface TableActionsInterface {
    /**
     * Component render node.
     */
    component?: ReactNode;
    /**
     * Is the action disabled.
     */
    disabled?: boolean;
    /**
     * Should action be hidden.
     */
    hidden?: (item: TableDataInterface) => boolean;
    /**
     * Icon for the action.
     */
    icon?: SemanticICONS;
    /**
     * Action onclick callback.
     */
    onClick?: (e: SyntheticEvent, item: TableDataInterface) => void;
    /**
     * Action popup text.
     */
    popupText?: string;
    /**
     * Sub actions for dropdown type.
     */
    subActions?: DropdownItemProps[];
    /**
     * Type of action.
     */
    renderer?: "semantic-icon" | "dropdown";
}


/**
 * Interface for loading state options.
 */
interface TableLoadingStateOptionsInterface {
    /**
     * Number of loading rows.
     */
    count: number;
    /**
     * Loading state image type.
     */
    imageType?: "circular" | "square";
}

export const DataTable: FunctionComponent<DataTablePropsInterface> = (props: DataTablePropsInterface): ReactElement => {

    const {
        actions,
        className,
        data,
        columns,
        isLoading,
        loadingStateOptions,
        onRowClick,
        placeholders: externalPlaceholders,
        selectable,
        testId,
        transparent,
        ...rest
    } = props;

    const classes = classNames(
        "data-table",
        {
            transparent
        },
        className
    );

    const isColumnsValid = (columns: TableColumnInterface[], checkIfRenderable: boolean = false): boolean => {
        return (columns && Array.isArray(columns) && columns.length > 0)
            && (checkIfRenderable
                ? columns.some((column: TableColumnInterface) => column.title) && !isExternalPlaceholdersAvailable()
                : true);
    };

    const isDataValid = (data: TableDataInterface[]): boolean => {
        return data && Array.isArray(data) && data.length > 0;
    };

    const isActionsValid = (actions: TableActionsInterface[]): boolean => {
        return actions && Array.isArray(actions) && actions.length > 0;
    };

    const renderActions = (item: TableDataInterface, action: TableActionsInterface, index: number): ReactElement => {

        const {
            component: actionComponent,
            disabled: actionDisabled,
            hidden: actionHidden,
            icon: actionIcon,
            onClick: actionOnClick,
            popupText: actionPopupText,
            renderer: actionRenderer,
            subActions
        } = action;

        if (actionHidden && actionHidden(item)) {
            return null;
        }

        if (actionRenderer === "dropdown") {
            return (
                <Dropdown
                    key={ index }
                    direction="left"
                    icon={ null }
                    trigger={ (
                        <Popup
                            disabled={ actionDisabled }
                            trigger={ (
                                <Icon
                                    link
                                    className="list-icon"
                                    disabled={ actionDisabled }
                                    size="small"
                                    color="grey"
                                    name={ actionIcon }
                                    onClick={ (e: SyntheticEvent) => actionOnClick(e, item) }
                                />
                            ) }
                            position="top center"
                            content={ actionPopupText }
                            inverted
                        />
                    ) }
                    options={ subActions }
                />
            )
        }

        if (actionRenderer === "semantic-icon") {
            return (
                <Popup
                    key={ index }
                    disabled={ actionDisabled }
                    trigger={ (
                        <Icon
                            link
                            className="list-icon"
                            disabled={ actionDisabled }
                            size="small"
                            color="grey"
                            name={ actionIcon }
                            onClick={ (e: SyntheticEvent) => actionOnClick(e, item) }
                        />
                    ) }
                    position="top center"
                    content={ actionPopupText }
                    inverted
                />
            )
        }

        if (actionComponent) {
            return (
                <Popup
                    key={ index }
                    disabled={ actionDisabled }
                    trigger={ actionComponent }
                    position="top center"
                    content={ actionPopupText }
                    inverted
                />
            )
        }

        return null;
    };

    const renderCell = (item: TableDataInterface, column: TableColumnInterface): ReactElement[] => {
        if (column.dataIndex === "action" && isActionsValid(actions)) {
            return actions.map((action, index) => {
                if (!action) {
                    return;
                }

                return renderActions(item, action, index)
            });
        }

        return get(item, column.dataIndex);
    };

    const renderHeaderCell = (column: TableColumnInterface, index: number): ReactElement => {

        if (!column) {
            return null;
        }

        const {
            key: columnKey,
            textAlign: columnTextAlign,
            title: columnTitle,
            ...rest
        } = column;

        return (
            <Table.HeaderCell key={ columnKey ?? index } textAlign={ columnTextAlign } { ...rest }>
                { columnTitle }
            </Table.HeaderCell>
        );
    };

    const isExternalPlaceholdersAvailable = (): boolean => {
        if (!externalPlaceholders) {
            return false;
        }
        return true;
    };

    const showPlaceholders = (): ReactNode => {
        if (isLoading) {
            return showLoadingPlaceholders();
        }

        return externalPlaceholders;
    };

    /**
     * Shows the loading state placeholder rows.
     *
     * @return {React.ReactElement[]}
     */
    const showLoadingPlaceholders = (): ReactElement[] => {

        const placeholders: ReactElement[] = [];

        for (let i = 0; i < loadingStateOptions.count; i++) {
            placeholders.push(
                <Table.Row key={ i }>
                    <Table.Cell>
                        <Header as="h6" image>
                            {
                                loadingStateOptions.imageType && (
                                    <Avatar
                                        image={ (
                                            <Placeholder style={ { height: 35, width: 35 } }>
                                                <Placeholder.Image/>
                                            </Placeholder>
                                        ) }
                                        isLoading={ true }
                                        avatarType={ loadingStateOptions.imageType === "circular" ? "user" : "app" }
                                        size="mini"
                                        floated="left"
                                    />
                                )
                            }
                            <Header.Content>
                                <Placeholder style={ { width: "300px" } }>
                                    <Placeholder.Header>
                                        <Placeholder.Line/>
                                        <Placeholder.Line/>
                                    </Placeholder.Header>
                                </Placeholder>
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                </Table.Row>
            )
        }

        return placeholders;
    };

    return (
        <Table
            className={ classes }
            selectable={ !isLoading && selectable }
            data-testid={ testId }
            { ...rest }
        >
            {
                isColumnsValid(columns, true) && (
                    <Table.Header>
                        <Table.Row>
                            {
                                columns.map((column: TableColumnInterface, index) => renderHeaderCell(column, index))
                            }
                        </Table.Row>
                    </Table.Header>
                )
            }

            <Table.Body>
                {
                    isColumnsValid(columns)
                        ? isDataValid(data)
                        ? data.map((item: TableDataInterface, index) => {

                            if (!item) {
                                return;
                            }

                            const {
                                key: itemKey,
                                textAlign: itemTextAlign,
                                width: itemWidth
                            } = item;

                            return (
                                <Table.Row
                                    key={ itemKey ?? index }
                                    onClick={ (e: SyntheticEvent) => selectable && onRowClick(e, item) }
                                >
                                    {
                                        columns.map((column: TableColumnInterface, index) => {

                                            const {
                                                textAlign: columnTextAlign,
                                                width: columnWidth
                                            } = column;

                                            return (
                                                <Table.Cell
                                                    key={ index }
                                                    textAlign={ itemTextAlign || columnTextAlign }
                                                    width={ itemWidth ?? columnWidth }
                                                >
                                                    { renderCell(item, column) }
                                                </Table.Cell>
                                            )
                                        })
                                    }
                                </Table.Row>
                            )
                        })
                        : showPlaceholders()
                        : null
                }
            </Table.Body>
        </Table>
    );
};

DataTable.defaultProps = {
    "data-testid": "data-table",
    selectable: true,
    stackable: true
};
