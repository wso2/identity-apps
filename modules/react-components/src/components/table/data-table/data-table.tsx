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
import React, { Fragment, ReactElement, ReactNode, SyntheticEvent } from "react";
import {
    Dropdown,
    DropdownItemProps,
    Header,
    Icon,
    Placeholder,
    Popup,
    SemanticICONS,
    SemanticWIDTHS,
    Table,
    TableCellProps,
    TableProps,
    TableRowProps
} from "semantic-ui-react";
import { DataTableBody } from "./data-table-body";
import { DataTableCell, DataTableCellPropsInterface } from "./data-table-cell";
import { DataTableFooter } from "./data-table-footer";
import { DataTableHeader } from "./data-table-header";
import { DataTableHeaderCell } from "./data-table-header-cell";
import { DataTableRow } from "./data-table-row";
import { Avatar } from "../../avatar";

/**
 * Interface for the Data Table sub components.
 */
export interface DataTableSubComponentsInterface {
    Body: typeof DataTableBody;
    Cell: typeof DataTableCell;
    Footer: typeof DataTableFooter;
    Header: typeof DataTableHeader;
    HeaderCell: typeof DataTableHeaderCell;
    Row: typeof DataTableRow;
}

/**
 * Interface for the data table component.
 */
export interface DataTablePropsInterface<T = {}> extends Omit<TableProps, "columns">, TestableComponentInterface {
    /**
     * Set of actions.
     */
    actions?: TableActionsInterface<T>[];
    /**
     * UI Props for the cell.
     */
    cellUIProps?: TableCellProps;
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
    data: TableDataInterface<T>[];
    /**
     * Table extensions.
     */
    extensions?: TableExtensionInterface[];
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
     * UI Props for the Row.
     */
    rowUIProps?: TableRowProps;
    /**
     * Search component to be rendered.
     */
    search?: ReactNode;
    /**
     * Show/Hide header cells.
     */
    showHeader?: boolean;
    /**
     * Show/Hide the table's operations panel header that has the search, column selector etc.
     */
    showOperationsHeader?: boolean;
    /**
     * Should the table appear on a transparent background.
     */
    transparent?: boolean;
}

/**
 * Table Data Strict Interface.
 */
export interface StrictDataPropsInterface<T = {}> {
    /**
     * key prop for React.
     */
    key?: string | number;
    /**
     * The row value of the entry. Used for callbacks like onClick etc.
     */
    value?: T;
    /**
     * Props for the UI component.
     */
    rendererProps?: DataRendererPropsInterface;
}

/**
 * Interface for the Data renderer props.
 */
export interface DataRendererPropsInterface {
    /**
     * UI Props for the cell.
     */
    cellUIProps: TableCellProps;
    /**
     * UI Props for the Row.
     */
    rowUIProps: TableRowProps;
}

/**
 * Table Data Dynamic Interface.
 */
export interface TableDataInterface<T = {}> extends StrictDataPropsInterface<T>, DataTableCellPropsInterface {
    [ key: string ]: any;
}

/**
 * Table Column Strict Interface.
 */
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

/**
 * Table Column Dynamic Interface.
 */
export interface TableColumnInterface extends StrictColumnPropsInterface {
    [ key: string ]: any;
}

/**
 * Table Actions Interface.
 */
export interface TableActionsInterface<T = {}> {
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
    hidden?: (item: TableDataInterface<T>) => boolean;
    /**
     * Icon for the action.
     */
    icon?: (item?: TableDataInterface<T>) => SemanticICONS;
    /**
     * Action onclick callback.
     */
    onClick?: (e: SyntheticEvent, item: TableDataInterface<T>) => void;
    /**
     * Action popup text.
     */
    popupText?: (item?: TableDataInterface<T>) => string;
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
export interface TableLoadingStateOptionsInterface {
    /**
     * Number of loading rows.
     */
    count: number;
    /**
     * Loading state image type.
     */
    imageType?: "circular" | "square";
}

export interface TableExtensionInterface {
    /**
     * Position to place the extension.
     */
    position: "top" | "bottom";
    /**
     * Component to be rendered.
     */
    component: ReactNode;
    /**
     * Does the external component provide renderer.
     */
    isExternalRendererProvided?: boolean;
}

/**
 * Data Driven Table Component.
 *
 * @param {DataTablePropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */

export const DataTable = <T extends object = {}>(
    props: DataTablePropsInterface<T>
): ReactElement => {

    const {
        actions,
        cellUIProps,
        className,
        columns,
        data,
        extensions,
        isLoading,
        loadingStateOptions,
        onRowClick,
        placeholders: externalPlaceholders,
        rowUIProps,
        search,
        selectable,
        showHeader,
        showOperationsHeader,
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

    const isColumnsValid = (columns: TableColumnInterface[]): boolean => {
        return (columns && Array.isArray(columns) && columns.length > 0);
    };

    const isDataValid = (data: TableDataInterface[]): boolean => {
        return data && Array.isArray(data) && data.length > 0;
    };

    const isActionsValid = (actions: TableActionsInterface[]): boolean => {
        return actions && Array.isArray(actions) && actions.length > 0;
    };

    const isExtensionsValid = (extensions: TableExtensionInterface[], checkIfRenderable: boolean = false): boolean => {
        return (extensions && Array.isArray(extensions) && extensions.length > 0)
            && (checkIfRenderable
                ? extensions.some((extension: TableExtensionInterface)=> extension.component)
                : true);
    };
    
    const isTableRenderable = (data: TableDataInterface[]): boolean => {
        return !isDataValid(data) || !isExternalPlaceholdersAvailable();
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
        
        const resolvedIcon: SemanticICONS = actionIcon(item);
        
        const resolvedPopupText: string = actionPopupText(item);

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
                                    name={ resolvedIcon }
                                    onClick={ (e: SyntheticEvent) => {
                                        e.stopPropagation();
                                        actionOnClick(e, item);
                                    } }
                                />
                            ) }
                            position="top center"
                            content={ resolvedPopupText }
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
                            name={ resolvedIcon }
                            onClick={ (e: SyntheticEvent) => {
                                e.stopPropagation();
                                actionOnClick(e, item);
                            } }
                        />
                    ) }
                    position="top center"
                    content={ resolvedPopupText }
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
                    content={ resolvedPopupText }
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
            <DataTable.HeaderCell key={ columnKey ?? index } textAlign={ columnTextAlign } { ...rest }>
                { columnTitle }
            </DataTable.HeaderCell>
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
                <DataTable.Row key={ i }>
                    <DataTable.Cell>
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
                    </DataTable.Cell>
                </DataTable.Row>
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
                isTableRenderable(data)
                    ? (
                        <>
                            {
                                isExtensionsValid(extensions, true) && (
                                    extensions.map((extension: TableExtensionInterface, index: number) => {
                                        const {
                                            component,
                                            isExternalRendererProvided,
                                            position
                                        } = extension;

                                        return (
                                            position === "top"
                                                ? isExternalRendererProvided
                                                ? (
                                                    <Fragment key={ index }>
                                                        { component }
                                                    </Fragment>
                                                )
                                                : (
                                                    <DataTable.Header fullWidth>
                                                        <DataTable.Row>
                                                            <DataTable.HeaderCell
                                                                colSpan={ isColumnsValid(columns) && columns.length }
                                                            >
                                                                { component }
                                                            </DataTable.HeaderCell>
                                                        </DataTable.Row>
                                                    </DataTable.Header>
                                                )
                                                : null
                                        );
                                    })
                                )
                            }
                            
                            {
                                showOperationsHeader && search && (
                                    <DataTable.Header fullWidth>
                                        <DataTable.Row>
                                            <DataTable.HeaderCell
                                                colSpan={ isColumnsValid(columns) && columns.length }
                                            >
                                                <div className="data-table-search">
                                                    { search }
                                                </div>
                                            </DataTable.HeaderCell>
                                        </DataTable.Row>
                                    </DataTable.Header>
                                )
                            }

                            {
                                isColumnsValid(columns) && showHeader && (
                                    <DataTable.Header>
                                        <DataTable.Row>
                                            {
                                                columns.map((column: TableColumnInterface, index) =>
                                                    renderHeaderCell(column, index))
                                            }
                                        </DataTable.Row>
                                    </DataTable.Header>
                                )
                            }

                            <DataTable.Body>
                                {
                                    isColumnsValid(columns)
                                        ? data.map((item: TableDataInterface, index) => {

                                            if (!item) {
                                                return;
                                            }

                                            const {
                                                key: itemKey,
                                                rendererProps,
                                                textAlign: itemTextAlign,
                                                width: itemWidth
                                            } = item;

                                            const {
                                                cellUIProps: cellUIPropOverrides,
                                                rowUIProps: rowUIPropOverrides
                                            } = rendererProps || {};

                                            return (
                                                <DataTable.Row
                                                    key={ itemKey ?? index }
                                                    onClick={
                                                        (e: SyntheticEvent) => selectable && onRowClick(e, item)
                                                    }
                                                    { ...rowUIProps }
                                                    { ...rowUIPropOverrides }
                                                >
                                                    {
                                                        columns.map((column: TableColumnInterface, index) => {

                                                            const {
                                                                textAlign: columnTextAlign,
                                                                width: columnWidth
                                                            } = column;

                                                            return (
                                                                <DataTable.Cell
                                                                    key={ index }
                                                                    textAlign={ itemTextAlign || columnTextAlign }
                                                                    width={ itemWidth ?? columnWidth }
                                                                    { ...cellUIProps }
                                                                    { ...cellUIPropOverrides }
                                                                >
                                                                    { renderCell(item, column) }
                                                                </DataTable.Cell>
                                                            )
                                                        })
                                                    }
                                                </DataTable.Row>
                                            )
                                        })
                                        : null
                                }
                            </DataTable.Body>

                            {
                                isExtensionsValid(extensions, true) && (
                                    extensions.map((extension: TableExtensionInterface, index: number) => {
                                        const {
                                            component,
                                            isExternalRendererProvided,
                                            position
                                        } = extension;

                                        return (
                                            position === "bottom"
                                                ? isExternalRendererProvided
                                                ? (
                                                    <Fragment key={ index }>
                                                        { component }
                                                    </Fragment>
                                                )
                                                : (
                                                    <DataTable.Footer fullWidth>
                                                        <DataTable.Row>
                                                            <DataTable.HeaderCell
                                                                colSpan={ isColumnsValid(columns) && columns.length }
                                                            >
                                                                { component }
                                                            </DataTable.HeaderCell>
                                                        </DataTable.Row>
                                                    </DataTable.Footer>
                                                )
                                                : null
                                        );
                                    })
                                )
                            }
                        </>
                    )
                    : showPlaceholders()
            }
        </Table>
    );
};

DataTable.defaultProps = {
    "data-testid": "data-table",
    selectable: true,
    showHeader: true,
    stackable: true
};

DataTable.Body = DataTableBody;
DataTable.Cell = DataTableCell;
DataTable.Footer = DataTableFooter;
DataTable.Header = DataTableHeader;
DataTable.HeaderCell = DataTableHeaderCell;
DataTable.Row = DataTableRow;
