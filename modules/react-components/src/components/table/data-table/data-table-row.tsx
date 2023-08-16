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
import { Table, TableRowProps } from "semantic-ui-react";

/**
 * Proptypes for the Data Table Row component.
 */
export interface DataTableRowPropsInterface extends TableRowProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Data Table Row component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the Data Table Row component
 */
export const DataTableRow: FunctionComponent<PropsWithChildren<DataTableRowPropsInterface>> = (
    props: PropsWithChildren<DataTableRowPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        selectable,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames("data-table-row", className, !selectable && "no-selectable");

    return (
        <Table.Row
            className={ classes }
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
        </Table.Row>
    );
};

/**
 * Default props for the component.
 */
DataTableRow.defaultProps = {
    "data-componentid": "data-table-row",
    "data-testid": "data-table-row"
};
