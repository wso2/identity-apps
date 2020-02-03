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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Divider, Grid, Icon, List, Popup, Table } from "semantic-ui-react";
import { UserAvatar } from "../../../../user-portal/src/components/shared";

/**
 * Prop types for the liked accounts component.
 */
interface UsersListProps {
    usersList: any;
}

/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (props: UsersListProps): JSX.Element => {
    const { usersList } = props;
    const { t } = useTranslation();

    return (
        <Table basic="very" className="sub-section-table" selectable stackable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Created On</Table.HeaderCell>
                    <Table.HeaderCell>Last Modified</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    usersList.map((user, index) => (
                        <Table.Row key={ index }>
                            <Table.Cell>
                                <UserAvatar
                                    floated="left"
                                    spaced="right"
                                    size="mini"
                                    image=""
                                    name={ user.userName }
                                />
                                <p  style={ { padding: "10px 45px" } }>{ user.userName }</p>
                            </Table.Cell>
                            <Table.Cell>{ user.meta.created }</Table.Cell>
                            <Table.Cell>{ user.meta.lastModified }</Table.Cell>
                            <Table.Cell>
                                <Grid>
                                    <Grid.Column>
                                        <Icon name="pencil alternate" size="small" color="grey" />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Icon name="trash alternate" size="small" color="grey" />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Icon name="ellipsis vertical" size="small" color="grey" />
                                    </Grid.Column>
                                </Grid>
                            </Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Body>
        </Table>
    );
};
