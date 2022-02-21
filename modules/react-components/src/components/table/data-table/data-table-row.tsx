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
 * @param {DataTableRowPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
