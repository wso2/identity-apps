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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FormEvent, FunctionComponent, ReactElement } from "react";
import { Checkbox, Form, Popup } from "semantic-ui-react";
import { TableColumnInterface } from "./data-table";
import { ReactComponent as ColumnIcon } from "../../../assets/images/column-icon.svg";
import { GenericIcon, GenericIconProps } from "../../icon";
import { Heading } from "../../typography";

export interface DataTableColumnSelectorInterface extends IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Heading for the column selector dropdown.
     */
    columnSelectorHeader?: string;
    /**
     * Width of the column selector.
     */
    columnSelectorWidth?: number;
    /**
     * Table columns.
     */
    columns: TableColumnInterface[];
    /**
     * Trigger icon float.
     */
    floated?: GenericIconProps["floated"];
    /**
     * Callback to inform the new set of visible columns.
     * @param {TableColumnInterface[]} columns - New columns.
     */
    onColumnSelectionChange: (columns: TableColumnInterface[]) => void;
    /**
     * Should the toggle disallowed columns be shown as disabled.
     */
    showToggleDisallowedColumns?: boolean;
    /**
     * Column selector trigger icon.
     */
    triggerIcon?: GenericIconProps["icon"];
}

/**
 * Data table column selector.
 *
 * @param {DataTableColumnSelectorInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const DataTableColumnSelector: FunctionComponent<DataTableColumnSelectorInterface> = (
    props: DataTableColumnSelectorInterface
): ReactElement => {

    const {
        columnSelectorHeader,
        columnSelectorWidth,
        columns,
        floated,
        onColumnSelectionChange,
        showToggleDisallowedColumns,
        triggerIcon,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Checks if the column selector should be rendered or not.
     *
     * @param {TableColumnInterface[]} columns - Table columns.
     * @return {boolean}
     */
    const isColumnSelectorValid = (columns: TableColumnInterface[]): boolean => {
        return columns.some((column: TableColumnInterface) => column.allowToggleVisibility)
            || showToggleDisallowedColumns;
    };

    /**
     * Handles column selector checkbox onchange event.
     *
     * @param {FormEvent<HTMLInputElement>} e - Event.
     * @param {string} uniqueId - Unique ID of the column.
     */
    const handleColumnVisibilityChange = (e: FormEvent<HTMLInputElement>, { uniqueId }: { uniqueId: string }): void => {
        const clone: TableColumnInterface[] = cloneDeep(columns);
        
        clone.forEach((column: TableColumnInterface) => {
            if (column.id !== uniqueId) {
                return;
            }
            
            column.hidden = !column.hidden;
        });

        onColumnSelectionChange(clone);
    };

    return (
        isColumnSelectorValid(columns)
            ? (
                <div
                    className="data-table-column-selector"
                    data-componentid={ componentId }
                    data-testid={ testId }
                >
                    <Popup
                        flowing
                        basic
                        pinned
                        className="data-table-column-selector-popup"
                        style={ {
                            width: `${ columnSelectorWidth }px`
                        } }
                        content={ (
                            <>
                                <div className="data-table-column-selector-popup-heading-container">
                                    <Heading as="h6">
                                        { columnSelectorHeader }
                                    </Heading>
                                </div>
                                <div className="data-table-column-selector-popup-content">
                                    <Form>
                                        {
                                            columns.map((
                                                column: TableColumnInterface,
                                                index: number
                                            ) => {
                                                if (!showToggleDisallowedColumns && !column.allowToggleVisibility) {
                                                    return;
                                                }

                                                return (
                                                    <Form.Field
                                                        key={ index }
                                                        disabled={
                                                            showToggleDisallowedColumns
                                                            && !column.allowToggleVisibility
                                                        }
                                                    >
                                                        <Checkbox
                                                            // using id here gives weird behaviour with SUI.
                                                            uniqueId={ column.id }
                                                            checked={ !column.hidden }
                                                            disabled={
                                                                showToggleDisallowedColumns
                                                                && !column.allowToggleVisibility
                                                            }
                                                            label={ column.title }
                                                            onChange={ handleColumnVisibilityChange }
                                                        />
                                                    </Form.Field>
                                                );
                                            }
                                            )
                                        }
                                    </Form>
                                </div>
                            </>
                        ) }
                        position="bottom right"
                        on="click"
                        trigger={ (
                            <GenericIcon
                                fill
                                link
                                hoverable
                                transparent
                                floated={ floated }
                                icon={ triggerIcon }
                                size="micro"
                            />
                        ) }
                    />
                </div>
            )
            : null
    );
};

/**
 * Default props for the component.
 */
DataTableColumnSelector.defaultProps = {
    columnSelectorHeader: "Show/Hide Columns",
    columnSelectorWidth: 240,
    "data-componentid": "data-table-column-selector",
    "data-testid": "data-table-column-selector",
    floated: "right",
    showToggleDisallowedColumns: false,
    triggerIcon: ColumnIcon
};
