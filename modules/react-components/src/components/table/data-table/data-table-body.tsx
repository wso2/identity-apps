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
import { Table, TableBodyProps } from "semantic-ui-react";

/**
 * Proptypes for the Data Table Body component.
 */
export interface DataTableBodyPropsInterface extends TableBodyProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Data Table Body component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Data Table Body component
 */
export const DataTableBody: FunctionComponent<PropsWithChildren<DataTableBodyPropsInterface>> = (
    props: PropsWithChildren<DataTableBodyPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        [ "data-componentid" ]: componentId,
        ...rest
    } = props;

    const classes = classNames("data-table-body", className);

    return (
        <Table.Body
            className={ classes }
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
        </Table.Body>
    );
};

/**
 * Default props for the component.
 */
DataTableBody.defaultProps = {
    "data-componentid": "data-table-body",
    "data-testid": "data-table-body"
};
