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
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Table, TableCellProps } from "semantic-ui-react";

/**
 * Proptypes for the Data Table Cell component.
 */
export interface DataTableCellPropsInterface extends TableCellProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Data Table Cell component.
 *
 * @param props - Props injected to the component.
 *
 * @returns DataTableCell component
 */
export const DataTableCell: FunctionComponent<PropsWithChildren<DataTableCellPropsInterface>> = (
    props: PropsWithChildren<DataTableCellPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        action,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames(
        "data-table-cell",
        className,
        action && "actions-cell",
        action && `items-${ React.Children.count(children) }`
    );

    return (
        <Table.Cell
            className={ classes }
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
        </Table.Cell>
    );
};

/**
 * Default props for the component.
 */
DataTableCell.defaultProps = {
    "data-componentid": "data-table-cell",
    "data-testid": "data-table-cell"
};
