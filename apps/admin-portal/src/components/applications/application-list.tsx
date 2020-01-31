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

import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Divider, Dropdown, Grid, Input, List } from "semantic-ui-react";
import { getApplicationList } from "../../api";
import { history } from "../../helpers/history";
import { ApplicationList } from "../../models";
import { ApplicationListItem } from "./application-list-item";

/**
 * Renders the application lists. This has the listing, sorting searching features related application listing.
 */
export const ApplicationListParent = () => {

    const [appList, setAppList] = useState<ApplicationList>();

    const getAppLists = (limit: string, offset: string) => {
        getApplicationList(limit, offset)
            .then((response) => {
                setAppList(response);
            })
            .catch((error) => {
                // TODO add notifications
            });
    };

    useEffect(() => {
        getAppLists("10", "0");
    }, []);

    const navigate = () => {
        history.push("/application/new/template");
    };
    const sort = [
        {
            key: "Name",
            text: "Name",
            value: "Name",
        },
        {
            key: "Usage",
            text: "Usage",
            value: "Usage",
        },
    ];

    return (
        <>
            { appList ? (
                    <Grid>
                        <Grid.Row divided>
                            <Grid.Column width={ 3 }>
                            <span>Sort By <Divider vertical hidden/>
                            <Dropdown
                                inline
                                options={ sort }
                                defaultValue={ sort[0].value }
                            />
                            </span>
                            </Grid.Column>
                            <Grid.Column width={ 3 }>
                                <span> Total Applications { appList.totalResults } </span>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={ 7 }/>
                            <Grid.Column width={ 6 }>
                                <Input icon="search" placeholder="Search Application ..."/>
                            </Grid.Column>
                            <Grid.Column width={ 3 } className="last-column">
                                <Button onClick={ navigate }> +APPLICATION </Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Divider hidden/>
                                <List divided verticalAlign="middle" className="application-list">
                                    {
                                        appList.applications.map((apps) => (
                                            <ApplicationListItem
                                                key={ apps.id }
                                                name={ apps.name }
                                                id={ apps.id }
                                                accessUrl={ apps.accessUrl }
                                                imageUrl={ apps.imageUrl }
                                                description={ apps.description }
                                                self={ apps.self }
                                            />
                                        ))
                                    }
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
                :
                (
                    <Grid>
                        <Grid.Row divided>
                            <Grid.Column width={ 10 }>
                                <p>No application found</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
        </>
    );
};
