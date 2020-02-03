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
import { getRolestList } from "../../api";
import { useTranslation } from "react-i18next";
import { Container, Divider, Table } from "semantic-ui-react";
import { UserImagePlaceHolder } from "../../components";

export const RolesList: React.FunctionComponent<any> = (): JSX.Element => {
    const { t } = useTranslation();
    const [rolesList, setRolesList] = useState([]);

    useEffect(() => {
        getList();
    }, []);

    const getList = () => {
        getRolestList()
            .then((response) => {
                if (response.status === 200) {
                    setRolesList(response.data.Resources);
                }
            });
    };
    return (
        <Table color="orange" className="sub-section-table">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Created On</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    rolesList.map((role, index) => (
                        <Table.Row key={ index }>
                            <Table.Cell>
                                <UserImagePlaceHolder size="mini" floated="left"/>
                                <p style={ { padding: "10px 45px" } }>{ role.userName }</p>
                            </Table.Cell>
                            <Table.Cell>{ role.meta.created }</Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Body>
        </Table>
    )
}