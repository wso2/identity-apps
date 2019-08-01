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
import { Link } from "react-router-dom";
import { Button, Container, Divider, Form, Grid, Header } from "semantic-ui-react";
import { getProfileInfo } from "../actions/profile";
import { UserImagePlaceHolder } from "../components";
import { InnerPageLayout } from "../layouts";
import { createEmptyProfile } from "../models/profile";

export class UserProfilePage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = createEmptyProfile();
    }

    public componentWillMount() {
        getProfileInfo()
        .then((response) => {
                this.setProfileDetails(response);
            });
    }

    public render() {
        return (
            <InnerPageLayout
                pageTitle="Profile"
                pageDescription="Manage information about you, your sub profiles and your account in general.">
                <Container>
                    <Form>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column width={3}>
                                    <UserImagePlaceHolder size="small"/><br/>
                                </Grid.Column>
                                <Grid.Column>
                                    Name<br/>
                                    {this.state.displayName}
                                    <Divider hidden />
                                    Email<br/>
                                    {this.state.emails[0]}
                                    <Divider hidden />
                                    Username<br/>
                                    {this.state.username}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Header dividing={true} as="h3">Personal Information</Header>
                        <Divider hidden />
                        <Grid>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    Organisation<br/>
                                    {this.state.organisation}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Container>
            </InnerPageLayout>
        );
    }

    private setProfileDetails(response) {
        this.setState({
            displayName: response.displayName,
            emails: response.emails,
            lastName: response.lastName,
            organisation: response.organisation,
            phoneNumbers: response.phoneNumbers,
            proUrl: response.proUrl,
            roles: response.roles,
            username: response.username
        });
    }
}
