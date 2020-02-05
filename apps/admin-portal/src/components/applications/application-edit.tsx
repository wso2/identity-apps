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
import { Button, Divider, Form, Grid, Icon, Tab } from "semantic-ui-react";
import { getApplicationDetails } from "../../api/application";
import { history } from "../../helpers";
import { ApplicationInterface } from "../../models";
import { GeneralDetailsApplication } from "./general-details-application";
import { ApplicationSettings } from "./settings-application";

/**
 * Application edit component.
 *
 * @return {JSX.Element}
 */
export const EditApplication: FunctionComponent<{}> = (props): JSX.Element => {

    const [application, setApplication] = useState<ApplicationInterface>();

    const setBasic = (basic: ApplicationInterface) => {
        setApplication(basic);
    };

    const getAppID = (): string => {
        const path = history.location.pathname.split("/");
        const appName = path[path.length - 1];
        return appName;
    };

    const ApplicationDetails = (id: string) => {
        getApplicationDetails(id)
            .then((response) => {
                setBasic(response);
            })
            .catch((error) => {
               // TODO add to notifications
            });
    };

    useEffect(() => {
        ApplicationDetails(getAppID());
    }, []);

    const navigate = (): void => {
        history.push("/applications");
    };

    const panes = () => ([
        {
            menuItem: "General",
            render: () => (
                <Tab.Pane attached={ false }>
                    <GeneralDetailsApplication
                        appId={ application.id }
                        name={ application.name }
                        description={ application.description }
                        imageUrl={ application.imageUrl }
                        accessUrl={ application.accessUrl }
                    />
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Settings",
            render: () => (
                <Tab.Pane attached={ false }>{
                    (
                        <ApplicationSettings
                            appId={ application.id }
                            advancedConfigurations={ application.advancedConfigurations }
                        />
                    )
                }
                </Tab.Pane>
            ),
        },
        {
            menuItem: "SignOnMethods",
            render: () => <Tab.Pane attached={ false }>SignOnMethod</Tab.Pane>,
        },
    ]);
    return (
        <>
            { application &&
            (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 2 }>
                            <Icon size="large" name={ "home" }/>
                        </Grid.Column>
                        <Grid.Column width={ 7 }>
                            <h1 style={ { fontVariant: "small-caps" } }>{ application.name }</h1>
                            <p>{ application.description }</p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Tab menu={ { secondary: true, pointing: true } } panes={ panes() }/>
                            <Divider hidden/>
                            <Button primary type="submit" size="small">
                                Update
                            </Button>
                            <Button type="submit" size="small" onClick={ navigate }>
                                Cancel
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
            }
        </>
    );
}
