/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
