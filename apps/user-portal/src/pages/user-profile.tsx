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

import * as React from "react";
import {Container, Form, Grid, Header} from "semantic-ui-react";
import {InnerPageLayout} from "../layouts";
import {User} from "../components";
import {getProfileInfo} from "../actions/profile";
import {createEmptyProfile} from "../models/profile";

export class UserProfilePage extends React.Component <any, any> {

    constructor(props) {
        super(props);
        this.state = createEmptyProfile();
    }

    private setProfileDetails(response) {
        this.setState({
            displayName: response.displayName,
            username: response.username,
            emails: response.emails,
            lastName: response.lastName,
            phoneNumbers: response.phoneNumbers,
            organisation: response.organisation,
            roles: response.roles,
            proUrl: response.proUrl,
        });
    }

    public componentWillMount() {
        getProfileInfo()
            .then((response) => {
                    this.setProfileDetails(response)
                }
            );
    }

    public render() {
        return (
            <InnerPageLayout pageTitle="Profile">
                <Container>
                    <Form>
                        <div>
                            <p>Manage information about you, your sub profiles and your account in general</p>
                        </div>
                        <br/><br/>
                        <Grid divided='vertically'>
                            <Grid.Row columns={2}>
                                <Grid.Column width={3}>
                                    <User/><br/>
                                    <Header as='h3'>Personal Information</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    Name<br/>
                                    {this.state.displayName + " " + this.state.lastName}<br/><br/>
                                    Email<br/>
                                    {this.state.emails[0]}<br/><br/>
                                    Username<br/>
                                    {this.state.username}<br/><br/>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={2}>
                                <Grid.Column width={3}>
                                    Telephone Number<br/>
                                    +940112345678<br/><br/>
                                    <Header as='h3'>Aliases</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    Organisation<br/>
                                    {this.state.organisation}<br/><br/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={1}>
                                    <User/>
                                </Grid.Column>
                                <Grid.Column>
                                    A.J Doe<br/>
                                    {this.state.emails[0]}<br/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Container>
            </InnerPageLayout>
        );
    }
}
