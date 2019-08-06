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
import { Button, Container, Divider, Form, Grid, Header, Icon, Message, Segment } from "semantic-ui-react";
import { getProfileInfo, updateProfileInfo } from "../actions/profile";
import { UserImagePlaceHolder } from "../components";
import { InnerPageLayout } from "../layouts";
import { createEmptyProfile } from "../models/profile";

export class UserProfilePage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = createEmptyProfile();
        this.handleSave = this.handleSave.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    public componentWillMount() {
        getProfileInfo()
            .then((response) => {
                this.setProfileDetails(response);
            });
    }

    public handleFieldChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
        event.preventDefault();
    }

    public handleEdit = (event) => {
        this.setState({
            [event.target.id]: true
        });
    }

    public handleCancel = (event) => {
        this.setState({
            [event.target.id]: false
        });
    }

    public handleSave = (event) => {
        const data = {
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ],
            // tslint:disable-next-line:object-literal-sort-keys
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
        };

        const emails = [];
        emails.push(this.state.email);
        switch (event.target.id) {
            case "displayName" : {
                data.Operations[0].value = {name: {givenName: this.state.displayName}};
                break;
            }
            case "lastName" : {
                data.Operations[0].value = {name: {familyName: this.state.lastName}};
                break;
            }
            case "email" : {
                data.Operations[0].value = {emails};
                break;
            }
        }

        updateProfileInfo(data)
            .then((response) => {
                if (response === 200) {
                    this.setState({
                        updateStatus: true
                    });
                }
            });

        if (event.target.id === "displayName") {
            this.setState({
                firstNameEdit: false
            });
        } else if (event.target.id === "lastName") {
            this.setState({
                lastNameEdit: false
            });
        } else {
            this.setState({
                emailEdit: false
            });
        }
    }

    public render() {
        const handleFNameChange = (value) => {
            if (this.state.firstNameEdit) {
                return (<>
                        <Segment padded={true}>
                            First Name
                            <Form.Input id="displayName" value={value}
                                        onChange={this.handleFieldChange}/>
                            <div className="ui two buttons">
                                <Button id="displayName" positive onClick={this.handleSave}>
                                    Save
                                </Button>
                                <Button id="firstNameEdit" onClick={this.handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </Segment>
                    </>
                );
            } else {
                return (<>
                        First Name
                        <Button id="firstNameEdit" onClick={this.handleEdit} style={{marginLeft: "10px"}}
                                circular size="mini" basic icon compact>
                            <Icon id="firstNameEdit" onClick={this.handleEdit} name="edit"/>
                        </Button>
                        <Form.Field label={this.state.displayName}/></>
                );
            }
        };

        const handleLNameChange = (value) => {
            if (this.state.lastNameEdit) {
                return (<>
                        <Segment padded={true}>
                            Last Name
                            <Form.Input id="lastName" value={value} onChange={this.handleFieldChange}/>
                            <div className="ui two buttons">
                                <Button id="lastName" positive onClick={this.handleSave}>
                                    Save
                                </Button>
                                <Button id="lastNameEdit" onClick={this.handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </Segment>
                    </>
                );
            } else {
                return (<>
                        Last Name
                        <Button id="lastNameEdit" onClick={this.handleEdit} style={{marginLeft: "10px"}}
                                circular size="mini" basic icon compact>
                            <Icon id="lastNameEdit" onClick={this.handleEdit} name="edit"/>
                        </Button>
                        <Form.Field label={value}/></>
                );
            }
        };

        const handleEmailChange = (value) => {
            if (this.state.emailEdit) {
                return (<>
                        <Segment padded={true}>
                            Email
                            <Form.Input id="email" value={value} onChange={this.handleFieldChange}/>
                            <div className="ui two buttons">
                                <Button id="email" positive onClick={this.handleSave}>
                                    Save
                                </Button>
                                <Button id="emailEdit" onClick={this.handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </Segment>
                    </>
                );
            } else {
                return (<>
                        Email
                        <Button id="emailEdit" onClick={this.handleEdit} style={{marginLeft: "10px"}}
                                circular size="mini" basic icon compact>
                            <Icon id="emailEdit" onClick={this.handleEdit} name="edit"/>
                        </Button>
                        <Form.Field label={value}/></>
                );
            }
        };

        return (
            <InnerPageLayout
                pageTitle="Profile"
                pageDescription="Manage information about you, your sub profiles and your account in general.">
                <Container>
                    <Form>
                        {this.state.updateStatus
                            ? <Message
                                success
                                header="User Profile was successfully updated"
                                content="You may now log-in with the username you have chosen"
                            /> :
                            null
                        }
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column width={3}>
                                    <UserImagePlaceHolder size="small"/><br/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Grid.Row>
                                        {handleFNameChange(this.state.displayName)}
                                    </Grid.Row>
                                    <Divider hidden/>
                                    <Grid.Row>
                                        {handleLNameChange(this.state.lastName)}
                                    </Grid.Row>
                                    <Divider hidden/>
                                    <Grid.Row>
                                        {handleEmailChange(this.state.email)}
                                    </Grid.Row>
                                    <Divider hidden/>
                                    <Grid.Row>
                                        Username<br/>
                                        {this.state.username}
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Header dividing={true} as="h3">Personal Information</Header>
                        <Divider hidden/>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column width={3}>
                                    Organisation<br/>
                                    {this.state.organisation}
                                </Grid.Column>
                                <Grid.Column>
                                    Mobile Number<br/>
                                    {this.state.phoneNumbers.map((mobile) => {
                                        return (<div>{mobile.value}</div>);
                                    })}
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
            email: response.emails[0],
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
