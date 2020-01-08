/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Container, Divider, Table } from "semantic-ui-react";
import { UserImagePlaceHolder } from "../../../../user-portal/src/components";
import { getUsersList } from "../../api";

/**
 * Proptypes for the SMS OTP component.
 */
interface UsersListProps {
}

/**
 * Users info page.
 *
 * @return {JSX.Element}
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (props: UsersListProps): JSX.Element => {
    const { t } = useTranslation();
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        getList();
    }, []);

    const getList = () => {
        getUsersList()
            .then((response) => {
                if (response.status === 200) {
                setUsersList(response.data.Resources);
                }
            });
    };

    return (
            <Table color="orange" className="sub-section-table">
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
                                    <UserImagePlaceHolder size="mini" floated="left"/>
                                    <p style={ { padding: "10px 45px" } }>{ user.userName }</p>
                                </Table.Cell>
                                <Table.Cell>{ user.meta.created }</Table.Cell>
                                <Table.Cell>{ user.meta.lastModified }</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
    );
};
