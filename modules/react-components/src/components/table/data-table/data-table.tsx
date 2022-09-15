/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import get from "lodash-es/get";
import isEqual from "lodash-es/isEqual";
import React, { Fragment, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import {
    Dropdown,
    DropdownItemProps,
    Grid,
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
import { DataTableColumnSelector } from "./data-table-column-selector";
import { DataTableFooter } from "./data-table-footer";
import { DataTableHeader } from "./data-table-header";
import { DataTableHeaderCell } from "./data-table-header-cell";
import { DataTableRow } from "./data-table-row";
import { Avatar } from "../../avatar";
import { GenericIconProps } from "../../icon";
import { Media } from "../../media";

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
export interface DataTablePropsInterface<T = Record<string, any>> extends Omit<TableProps, "columns" | "sortable">,
    IdentifiableComponentInterface, TestableComponentInterface {

    /**
     * Set of actions.
     */
    actions?: TableActionsInterface<T>[];
    /**
     * UI Props for the cell.
     */
    cellUIProps?: TableCellProps;
    /**
     * Heading for the column selector dropdown.
     */
    columnSelectorHeader?: string;
    /**
     * Width of the column selector.
     */
    columnSelectorWidth?: number;
    /**
     * Custom icon for the column selector trigger.
     */
    columnSelectorTriggerIcon?: GenericIconProps[ "icon" ];
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
     * Externally provided Search component.
     */
    externalSearch?: ReactNode;
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
     * Callback to inform the new set of visible columns.
     * @param columns - New columns.
     */
    onColumnSelectionChange?: (columns: TableColumnInterface[]) => void;
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
     * Show/Hide column selector.
     */
    showColumnSelector?: boolean;
    /**
     * Show/Hide header cells.
     */
    showHeader?: boolean;
    /**
     * Show/Hide the table's operations panel header that has the search, column selector etc.
     */
    showOperationsHeader?: boolean;
    /**
     * Show/Hide table search.
     */
    showSearch?: boolean;
    /**
     * Should the toggle disallowed columns be shown as disabled.
     */
    showToggleDisallowedColumns?: boolean;
    /**
     * Should the table appear on a transparent background.
     */
    transparent?: boolean;
    /**
     * Specifies if a row should be selectable.
     */
    isRowSelectable?: (item: TableDataInterface<T>) => boolean;
}

/**
 * Table Data Strict Interface.
 */
export interface StrictDataPropsInterface {
    /**
     * key prop for React.
     */
    key?: string | number;
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
 * Table Data Interface.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableDataInterface<T = Record<string, any>> extends StrictDataPropsInterface,
    DynamicTableDataInterface, DataTableCellPropsInterface { }

/**
 * Table Data Dynamic Interface.
 */
export interface DynamicTableDataInterface {
    [ key: string ]: any;
}

/**
 * Table Column Strict Interface.
 */
export interface StrictColumnPropsInterface {
    /**
     * Allow/Deny toggling the visibility of the column using the column selector.
     */
    allowToggleVisibility?: boolean;
    /**
     * key prop for React.
     */
    key?: string | number;
    /**
     * Unique ID for the column.
     */
    id: string;
    /**
     * Get the new sort order.
     * @param sortOrder - New sort order.
     */
    getSortOrder?: (sortOrder: DataTableSortOrder, column: TableColumnInterface) => void;
    /**
     * Should the column be hidden.
     */
    hidden?: boolean;
    /**
     * Is the column sortable.
     */
    sortable?: boolean;
    /**
     * Sort order.
     */
    sortOrder?: DataTableSortOrder;
    /**
     * Column title.
     */
    title: ReactNode;
    /**
     * Index to find relevant data.
     */
    dataIndex: string | "action";
    /**
     * Give column render control to outside.
     */
    render?: (item: TableDataInterface) => ReactNode;
}

/**
 * Data table sort order types.
 */
export type DataTableSortOrder = "" | "ascending" | "descending";

/**
 * Table Column Interface.
 */
export interface TableColumnInterface extends StrictColumnPropsInterface, DynamicTableColumnInterface { }

/**
 * Table Column Dynamic Interface.
 */
export interface DynamicTableColumnInterface {
    [ key: string ]: any;
}

/**
 * Table Actions Interface.
 */
export interface TableActionsInterface<T = Record<string, any>>
    extends TestableComponentInterface, Partial<IdentifiableComponentInterface> {
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
    /**
     * Specifies if the action should be a link or not.
     */
    link?: (item: TableDataInterface<T>) => boolean;
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
 * @param props - Props injected to the component.
 * @returns Data Driven Table Component.
 */

export const DataTable = <T extends Record<string, any> = Record<string, any>>(
    props: DataTablePropsInterface<T>
): ReactElement => {

    const {
        actions,
        cellUIProps,
        className,
        columnSelectorHeader,
        columnSelectorWidth,
        columnSelectorTriggerIcon,
        columns: initialColumns,
        data,
        extensions,
        externalSearch,
        isLoading,
        loadingStateOptions,
        onColumnSelectionChange,
        onRowClick,
        placeholders: externalPlaceholders,
        rowUIProps,
        selectable,
        showColumnSelector,
        showHeader,
        showOperationsHeader,
        showSearch,
        showToggleDisallowedColumns,
        testId,
        isRowSelectable,
        transparent,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames(
        "data-table",
        {
            transparent
        },
        className
    );

    const [ columns, setColumns ] = useState<TableColumnInterface[]>(initialColumns);
    const [ dynamicTableProps, setDynamicTableProps ] = useState<TableProps>(undefined);

    useEffect(() => {
        if (!initialColumns) {
            return;
        }

        // Changing the data on sort order change results in the triggering of this
        // hook which resets the column state. This will be problematic if the columns
        // are dynamically changed from outside.
        const moderatedColumns: TableColumnInterface[] = [ ...initialColumns ];
        const internalColumns: TableColumnInterface[] = [ ...columns ];

        for (const moderatedColumn of moderatedColumns) {
            for (const internalColumn of internalColumns) {
                if (moderatedColumn.id === internalColumn.id) {
                    moderatedColumn.sortOrder = internalColumn.sortOrder;

                    break;
                }
            }
        }

        setColumns(moderatedColumns);
        evaluateColumnProps(moderatedColumns);
    }, [ initialColumns ]);

    /**
     * Evaluate column props.
     *
     * @param columns - Columns.
     */
    const evaluateColumnProps = (columns: TableColumnInterface[]) => {
        if (!isColumnsValid(columns)) {
            return;
        }

        // Check if any of the columns have sortable prop. If yes, set `sortable` prop in the parent
        // `Table` component to true.
        const isSortable: boolean = columns.some((column: TableColumnInterface) => column.sortable);

        if (isSortable) {
            setDynamicTableProps({
                ...dynamicTableProps,
                celled: true,
                sortable: true
            });
        }
    };

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
                ? extensions.some((extension: TableExtensionInterface) => extension.component)
                : true);
    };

    const isTableRenderable = (data: TableDataInterface[]): boolean => {
        return isDataValid(data);
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
            link: actionLink,
            subActions,
            ...rest
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
                                    link={ actionLink && actionLink(item) }
                                    className="list-icon"
                                    disabled={ actionDisabled }
                                    size="small"
                                    color="grey"
                                    name={ resolvedIcon }
                                    onClick={ (e: SyntheticEvent) => {
                                        e.stopPropagation();
                                        actionOnClick(e, item);
                                    } }
                                    { ...rest }
                                />
                            ) }
                            position="top center"
                            content={ resolvedPopupText }
                            inverted
                        />
                    ) }
                    options={ subActions }
                />
            );
        }

        if (actionRenderer === "semantic-icon") {
            return (
                <Popup
                    key={ index }
                    disabled={ actionDisabled }
                    trigger={ (
                        <Icon
                            link={ actionLink && actionLink(item) }
                            className="list-icon data-table-list-icon"
                            disabled={ actionDisabled }
                            size="small"
                            color="grey"
                            name={ resolvedIcon }
                            onClick={ (e: SyntheticEvent) => {
                                e.stopPropagation();
                                actionOnClick(e, item);
                            } }
                            { ...rest }
                        />
                    ) }
                    position="top center"
                    content={ resolvedPopupText }
                    inverted
                />
            );
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
            );
        }

        return null;
    };

    const renderCell = (item: TableDataInterface, column: TableColumnInterface): ReactElement[] => {
        if (column.dataIndex === "action" && isActionsValid(actions)) {
            return actions.map((action, index) => {
                if (!action) {
                    return;
                }

                return renderActions(item, action, index);
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
            hidden: columnHidden,
            getSortOrder: getColumnSortOrder,
            onClick: columnOnClick,
            sortOrder: columnSortOrder,
            sortable: columnSortable,
            ...rest
        } = column;

        if (columnHidden) {
            return;
        }

        const handleHeaderCellClick = (e: SyntheticEvent) => {
            columnOnClick && columnOnClick(e);

            if (!columnSortable) {
                return;
            }

            const modifiedColumns: TableColumnInterface[] = [ ...columns ];

            modifiedColumns.forEach((evalColumn: TableColumnInterface) => {
                if (!isEqual(evalColumn, column)) {
                    return;
                }

                const newOrder: DataTableSortOrder = evalColumn.sortOrder === "ascending"
                    ? "descending"
                    : "ascending";

                getColumnSortOrder && getColumnSortOrder(newOrder, column);

                evalColumn.sortOrder = newOrder;
            });

            setColumns(modifiedColumns);
        };

        const resolveSortOrder = (order: DataTableSortOrder) => {
            if (order === "ascending") {
                return "ascending";
            }

            if (order === "descending") {
                return "descending";
            }

            return null;
        };

        return (
            <DataTable.HeaderCell
                key={ columnKey ?? index }
                textAlign={ columnTextAlign }
                onClick={ handleHeaderCellClick }
                sorted={ resolveSortOrder(columnSortOrder) }
                { ...rest }
            >
                { columnTitle }
            </DataTable.HeaderCell>
        );
    };

    const showPlaceholders = (): ReactNode => {
        if (isLoading) {
            return showLoadingPlaceholders();
        }

        return (
            <DataTable.Row className="no-hover">
                <DataTable.Cell>
                    { externalPlaceholders }
                </DataTable.Cell>
            </DataTable.Row>
        );
    };

    /**
     * Shows the loading state placeholder rows.
     *
     * @returns Loading Placeholders.
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
                                                <Placeholder.Image />
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
                                        <Placeholder.Line />
                                        <Placeholder.Line />
                                    </Placeholder.Header>
                                </Placeholder>
                            </Header.Content>
                        </Header>
                    </DataTable.Cell>
                </DataTable.Row>
            );
        }

        return placeholders;
    };

    const handleColumnSelectorChange = (columns: TableColumnInterface[]): void => {
        setColumns(columns);
        onColumnSelectionChange(columns);
    };

    return (
        <Table
            className={ classes }
            selectable={ !isLoading && selectable }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...dynamicTableProps }
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
                                                                    colSpan={ isColumnsValid(columns)
                                                                        && columns.length }
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
                                showOperationsHeader && (showSearch || showColumnSelector) && (
                                    <DataTable.Header fullWidth>
                                        <DataTable.Row>
                                            <DataTable.HeaderCell
                                                colSpan={ isColumnsValid(columns) && columns.length }
                                            >
                                                <Grid>
                                                    <Grid.Row>
                                                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 }>
                                                            {
                                                                showSearch && (
                                                                    <div className="data-table-search">
                                                                        { externalSearch }
                                                                    </div>
                                                                )
                                                            }
                                                        </Grid.Column>
                                                        <Grid.Column
                                                            as={ Media }
                                                            greaterThanOrEqual="mobile"
                                                            mobile={ 16 }
                                                            tablet={ 8 }
                                                            computer={ 8 }
                                                            textAlign="right"
                                                        >
                                                            {
                                                                showColumnSelector && isColumnsValid(columns) && (
                                                                    <DataTableColumnSelector
                                                                        columns={ columns }
                                                                        columnSelectorHeader={ columnSelectorHeader }
                                                                        columnSelectorWidth={ columnSelectorWidth }
                                                                        floated="right"
                                                                        onColumnSelectionChange={
                                                                            handleColumnSelectorChange
                                                                        }
                                                                        showToggleDisallowedColumns={
                                                                            showToggleDisallowedColumns
                                                                        }
                                                                        triggerIcon={ columnSelectorTriggerIcon }
                                                                    />
                                                                )
                                                            }
                                                        </Grid.Column>
                                                        <Grid.Column
                                                            as={ Media }
                                                            lessThan="mobile"
                                                            mobile={ 16 }
                                                            tablet={ 8 }
                                                            computer={ 8 }
                                                            textAlign="left"
                                                        >
                                                            {
                                                                showColumnSelector && isColumnsValid(columns) && (
                                                                    <DataTableColumnSelector
                                                                        columns={ columns }
                                                                        columnSelectorHeader={ columnSelectorHeader }
                                                                        columnSelectorWidth={ columnSelectorWidth }
                                                                        floated="left"
                                                                        onColumnSelectionChange={
                                                                            handleColumnSelectorChange
                                                                        }
                                                                        showToggleDisallowedColumns={
                                                                            showToggleDisallowedColumns
                                                                        }
                                                                        triggerIcon={ columnSelectorTriggerIcon }
                                                                    />
                                                                )
                                                            }
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
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
                                                        (e: SyntheticEvent) => selectable
                                                            && isRowSelectable(item)
                                                            && onRowClick(e, item)
                                                    }
                                                    selectable={ isRowSelectable(item) }
                                                    { ...rowUIProps }
                                                    { ...rowUIPropOverrides }
                                                >
                                                    {
                                                        columns.map((column: TableColumnInterface, index) => {

                                                            const {
                                                                textAlign: columnTextAlign,
                                                                width: columnWidth,
                                                                hidden: columnHidden,
                                                                render: columnRenderer
                                                            } = column;

                                                            if (columnHidden) {
                                                                return;
                                                            }

                                                            return (
                                                                <DataTable.Cell
                                                                    key={ index }
                                                                    action={ column.dataIndex === "action" }
                                                                    textAlign={ itemTextAlign || columnTextAlign }
                                                                    width={ itemWidth ?? columnWidth }
                                                                    { ...cellUIProps }
                                                                    { ...cellUIPropOverrides }
                                                                >
                                                                    {
                                                                        columnRenderer
                                                                            ? columnRenderer(item)
                                                                            : renderCell(item, column)
                                                                    }
                                                                </DataTable.Cell>
                                                            );
                                                        })
                                                    }
                                                </DataTable.Row>
                                            );
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
                                                                    colSpan={ isColumnsValid(columns)
                                                                        && columns.length }
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
                    : <DataTable.Body>{ showPlaceholders() }</DataTable.Body>
            }
        </Table>
    );
};

DataTable.defaultProps = {
    "data-componentid": "data-table",
    "data-testid": "data-table",
    isRowSelectable: () => true,
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
