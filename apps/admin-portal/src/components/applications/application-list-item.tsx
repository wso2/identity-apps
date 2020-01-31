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

import React, { FunctionComponent, useState } from "react";
import { Grid, Icon, List } from "semantic-ui-react";
import { history } from "../../helpers/history";
import { ApplicationBasic } from "../../models";
import { AppDetails } from "./dropdown-details";

/**
 * Create an application list item.
 * @param props Gets the basic details about the application.
 * @constructor maps the props to Application Basic interface properties
 */
export const ApplicationListItem: FunctionComponent<ApplicationBasic> = (props): JSX.Element => {

    const {
        id,
        name,
        description,
        imageUrl,
        accessUrl,
        self,
    } = props;

    const [viewDetails, setView] = useState({
        visible: false
    });

    const addDetailsHandler = () => {
        const currentvisible = viewDetails.visible;
        setView(
            { visible: !currentvisible }
        );
    };

    const navigate = (): void => {
        history.push(`applications/${ id }`);
    };

    const capitalizeFirstLetter = (appName) => {
        return appName[0].toUpperCase() + appName.slice(1);
    };

    return (
        <>
            <List.Item key={ name } className="application-list-item">
                <Grid>
                    <Grid.Row className={ "app-list-row" }>
                        <Grid.Column width={ 14 } className={ "app-content" } onClick={ addDetailsHandler }>
                            <Icon size="large" name={ "home" }/>
                            <List.Content
                                style={ { display: "inline-block", paddingLeft: "3%" } }
                            >
                                { capitalizeFirstLetter(name) }
                                <p style={ { fontSize: "10px" } }>type</p>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 1 } className={ "app-toggle" }>
                            <List.Content className="action-bar" floated="right">
                                <Icon
                                    link
                                    className=""
                                    size="large"
                                    onClick={ () => navigate() }
                                    color="grey"
                                    name="setting"
                                />
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 1 } className={ "app-actions" }>
                            { viewDetails.visible ?
                                <List.Content className="action-bar" floated="right">
                                    <Icon
                                        link
                                        className=""
                                        size="large"
                                        onClick={ addDetailsHandler }
                                        color="grey"
                                        name="arrow alternate circle up outline"
                                    />
                                </List.Content> : <List.Content className="action-bar" floated="right">
                                    <Icon
                                        link
                                        className=""
                                        size="large"
                                        onClick={ addDetailsHandler }
                                        color="grey"
                                        name="arrow alternate circle down outline"
                                    />
                                </List.Content>
                            }
                        </Grid.Column>
                    </Grid.Row>
                    { viewDetails.visible ?
                        (
                            <Grid.Row className={ "app-details" }>
                                <Grid.Column width={ 15 }><AppDetails appName={ name } appDescription={ description }/>
                                </Grid.Column>
                                <Grid.Column width={ 1 } className={ "app-actions" }>
                                    <List.Content className="delete-icon" floated="right">
                                        <Icon
                                            link
                                            className=""
                                            size="large"
                                            onClick={ " " }
                                            color="grey"
                                            name="trash alternate outline"
                                        />
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        ) : null }
                </Grid>
            </List.Item>
        </>
    );
};
