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
import { Table, TableHeaderCellProps } from "semantic-ui-react";

/**
 * Proptypes for the Data Table Header Cell component.
 */
export interface DataTableHeaderCellPropsInterface extends TableHeaderCellProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Data Table Header Cell component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the Data Table Header Cell component
 */
export const DataTableHeaderCell: FunctionComponent<PropsWithChildren<DataTableHeaderCellPropsInterface>> = (
    props: PropsWithChildren<DataTableHeaderCellPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames("data-table-header-cell", className);

    return (
        <Table.HeaderCell
            className={ classes }
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
        </Table.HeaderCell>
    );
};

/**
 * Default props for the component.
 */
DataTableHeaderCell.defaultProps = {
    "data-componentid": "data-table-header-cell",
    "data-testid": "data-table-header-cell"
};
