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

import React, { FunctionComponent, ReactElement } from "react";
import { Checkbox, Table, TableProps } from "semantic-ui-react";
import { EmptyPlaceholder } from "../placeholder";

interface TransferListItem {
    itemName: string;
    itemId: string;
}

/**
 * Proptypes transfer list component.
 */
export interface TransferListProps extends TableProps {
    listValues?: TransferListItem[] | string[];
    listHeaders?: any;
    listType: "selected" | "unselected";
    isListEmpty: boolean;
}

/**
 * Transfer list component.
 *
 * @param {TransferListProps} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const TransferList: FunctionComponent<TransferListProps> = (
    props: TransferListProps
): ReactElement => {

    const {
        children,
        className,
        rest,
        listValues,
        listHeaders,
        isListEmpty
    } = props;

    return (


        <>
            {
                !isListEmpty ? (
                <Table singleLine>
                    {
                        listHeaders instanceof Array && (
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell><Checkbox/></Table.HeaderCell>
                                    {
                                        listHeaders?.map((header, index) => {
                                            return (
                                                <Table.HeaderCell
                                                    key={ index }><strong>{ header }</strong></Table.HeaderCell>
                                            )
                                        })
                                    }
                                </Table.Row>
                            </Table.Header>
                        )
                    }
                    {children}
                </Table>
                ) : (
                    <div className={ "empty-placeholder-center" }>
                        <EmptyPlaceholder
                            subtitle={ [ "You have not assigned any roles to the user." ] }
                        />
                    </div>
                )
            }
        </>
    );
};
