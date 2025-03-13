/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { Typography } from "@mui/material";
import { AppState } from "@wso2is/admin.core.v1/store";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "@wso2is/admin.roles.v2/constants/role-constants";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import { RolesMemberInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { Button, EmphasizedSegment } from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Icon, Input, Label, Table } from "semantic-ui-react";

export default function AgentGroups() {
    const { t } = useTranslation();

    const assignedGroups: any = [
        {
            "display": "HumanResources",
            "value": "9fd55b9d-f1a1-41f5-be20-a54088693c1e",
            "$ref": "https://localhost:9443/scim2/Groups/9fd55b9d-f1a1-41f5-be20-a54088693c1e"
        }
    ]

    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const resolveTableContent = () => {
        return (<>

            <Table.Body>
                {
                    assignedGroups?.map((group: RolesMemberInterface, index: number) => {
                        const userGroup: string[] = group?.display?.split("/");

                        if (userGroup[0] !== APPLICATION_DOMAIN &&
                            userGroup[0] !== INTERNAL_DOMAIN) {
                            return (
                                <Table.Row key={ index }>
                                    <Table.Cell>
                                        {
                                            userGroup?.length === 1
                                                ? (<Label color="olive">
                                                    {
                                                        StringUtils.isEqualCaseInsensitive(
                                                            primaryUserStoreDomainName, PRIMARY_USERSTORE)
                                                            ? t("console:manage.features.users.userstores" +
                                                                ".userstoreOptions.primary")
                                                            : primaryUserStoreDomainName
                                                    }
                                                </Label>)
                                                : (<Label color="olive">
                                                    { userGroup[0] }
                                                </Label>)
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        {
                                            userGroup?.length === 1
                                                ? group?.display
                                                : userGroup[1]
                                        }
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }
                    })
                }
            </Table.Body>

        </>);
    };

    return (<EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
        <Typography variant="h4">
            Groups
        </Typography>
        <Typography variant="body1" className="mb-5" style={ { color: "#9c9c9c" } }>
            Add or remove the groups agent is assigned with and note that this will affect performing certain tasks.
        </Typography>

        <EmphasizedSegment
            data-testid="user-mgt-groups-list"
            className="user-role-edit-header-segment"
            style={ { border: "none", paddingLeft: 0 } }
        >
            <Grid.Row>
                <Grid.Column>
                    <Input
                        data-testid="user-mgt-groups-list-search-input"
                        icon={ <Icon name="search"/> }
                        onChange={ null }
                        placeholder={ t("user:updateUser.groups." +
                                                    "editGroups.searchPlaceholder") }
                        floated="left"
                        size="small"
                    />

                    <Button
                        data-testid="user-mgt-groups-list-update-button"
                        size="medium"
                        icon="pencil"
                        floated="right"
                        onClick={ null }
                    />

                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Table singleLine compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <strong>
                                    { t("user:updateUser.groups." +
                                                                "editGroups.groupList.headers.0") }
                                </strong>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <strong>
                                    { t("user:updateUser.groups." +
                                                                "editGroups.groupList.headers.1") }
                                </strong>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    { resolveTableContent() }
                </Table>
            </Grid.Row>
        </EmphasizedSegment>






    </EmphasizedSegment>);
}
