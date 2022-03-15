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
import { Table, TableBodyProps } from "semantic-ui-react";

/**
 * Proptypes for the Data Table Body component.
 */
export interface DataTableBodyPropsInterface extends TableBodyProps, IdentifiableComponentInterface,
    TestableComponentInterface { }

/**
 * Data Table Body component.
 *
 * @param {DataTableBodyPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
