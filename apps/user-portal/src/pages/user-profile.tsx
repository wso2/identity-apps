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
import {withTranslation, WithTranslation} from "react-i18next";
import {Button, Container, Divider, Form, Grid, Header, Icon, Segment, Transition} from "semantic-ui-react";
import {getProfileInfo, updateProfileInfo} from "../actions";
import {NotificationComponent, UserImagePlaceHolder} from "../components";
import {InnerPageLayout} from "../layouts";
import {createEmptyProfile} from "../models/profile";

/**
 * Component Props types
 */
interface IComponentProps extends WithTranslation {
}

/**
 * User Profile Page of the User Portal
 */
class UserProfilePageComponent extends React.Component<IComponentProps, any> {
    /**
     * constructor
     * @param props
     */
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

    /**
     * The following method handles the change of state of the input fields.
     * The id of the event target will be used to set the state.
     * @param event
     */
    public handleFieldChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
        event.preventDefault();
    }

    /**
     * The following method handles the onClick event of the edit button
     * @param event
     */
    public handleEdit = (event) => {
        this.setState({
            [event.target.id]: true
        });
    }

    /**
     * The following method handles the onClick event of the cancel button
     * @param event
     */
    public handleCancel = (event) => {
        this.setState({
            [event.target.id]: false
        });
    }

    /**
     * The following method handles the onClick event of the save button
     * The update request will be sent depending on the id of the event target
     * @param event
     */
    public handleSave = (event) => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ]
        };

        const phoneNumbers = {
            type: "mobile",
            value: this.state.mobile
        }
        this.state.phoneNumbers.push(phoneNumbers);

        const emails = [];
        emails.push(this.state.email);
        switch (event.target.id) {
            case "name" : {
                data.Operations[0].value = {
                    name: {
                        familyName: this.state.lastName,
                        givenName: this.state.displayName
                    }
                };
                break;
            }
            case "email" : {
                data.Operations[0].value = {emails};
                break;
            }
            case "pInfo" : {
                data.Operations[0].value = {
                    "phoneNumbers": [
                        {
                            type: "mobile",
                            value: this.state.mobile
                        }
                    ],
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
                        organization: this.state.organisation
                    }
                };
                break;
            }
        }
        updateProfileInfo(data)
            .then((response) => {
                if (response.status === 200) {
                    getProfileInfo()
                        .then((res) => {
                            this.setProfileDetails(res);
                        });
                    this.setState({
                        updateStatus: true
                    });
                }
            });

        if (event.target.id === "name") {
            this.setState({
                nameEdit: false
            });
        } else if (event.target.id === "email") {
            this.setState({
                emailEdit: false
            });
        } else {
            this.setState({
                pInfoEdit: false
            });
        }
    }

    /**
     * The following method handles the onClick event of the dismiss button
     */
    public handleDismiss = () => {
        this.setState({
            updateStatus: false
        });
    }

    public render() {
        const {t} = this.props;
        const handleNameChange = () => {
            if (this.state.nameEdit) {
                return (<>
                        <Segment padded>
                            <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>{t("views:userProfile.inputFields.firstName")}</label>
                                            <input required id="displayName"
                                                   value={this.state.displayName}
                                                   onChange={this.handleFieldChange}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>{t("views:userProfile.inputFields.lastName")}</label>
                                            <input required id="lastName"
                                                   value={this.state.lastName}
                                                   onChange={this.handleFieldChange}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Divider hidden/>
                            <Button id="name" primary onClick={this.handleSave}>
                                {t("common:save")}
                            </Button>
                            <Button id="nameEdit" secondary onClick={this.handleCancel}>
                                {t("common:cancel")}
                            </Button>
                        </Segment>
                    </>
                );
            } else {
                return (<>
                        <Form.Field>
                            <label>{t("views:userProfile.inputFields.name")}</label>
                            <label>{this.state.displayName + " " + this.state.lastName}
                            <Icon size="small" color="grey" id="nameEdit" onClick={this.handleEdit}
                                  style={{marginLeft: "10px"}}
                                  name="pencil alternate"/>
                            </label>
                        </Form.Field>
                    </>
                );
            }
        };

        const handleEmailChange = (value) => {
            if (this.state.emailEdit) {
                return (<>
                        <Segment padded>
                            <Form.Field>
                                <label>{t("views:userProfile.inputFields.email")}</label>
                                <input required id="email" value={value} onChange={this.handleFieldChange}/>
                            </Form.Field>
                            <Button id="email" primary onClick={this.handleSave}>
                                {t("common:save")}
                            </Button>
                            <Button id="emailEdit" secondary onClick={this.handleCancel}>
                                {t("common:cancel")}
                            </Button>
                        </Segment>
                    </>
                );
            } else {
                return (<>
                        <Form.Field>
                            <label>{t("views:userProfile.inputFields.email")}</label>
                        <label>{value}
                            <Icon size="small" color="grey" id="emailEdit"
                                  onClick={this.handleEdit} style={{marginLeft: "10px"}}
                                  name="pencil alternate"/>
                        </label>
                        </Form.Field>
                    </>
                );
            }
        };

        const handlePInfoChange = () => {
            if (this.state.pInfoEdit) {
                return (<>
                        <Container>
                            <Segment padded fluid>
                                <Grid>
                                    <Grid.Row columns={2}>
                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label>{t("views:userProfile.inputFields.organisation")}</label>
                                                <input required value={this.state.organisation} id="organisation"
                                                       onChange={this.handleFieldChange}/>
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={4}>
                                            <Form.Field>
                                                <label>{t("views:userProfile.inputFields.mobile")}</label>
                                                <input required value={this.state.mobile} id="mobile"
                                                       onChange={this.handleFieldChange}/>
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <Divider hidden/>
                                <Button id="pInfo" primary onClick={this.handleSave}>
                                    {t("common:save")}
                                </Button>
                                <Button id="pInfoEdit" secondary onClick={this.handleCancel}>
                                    {t("common:cancel")}
                                </Button>
                            </Segment>
                        </Container>
                    </>
                );
            } else {
                return (
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column width={3}>
                                <Form.Field>
                                    <label>{t("views:userProfile.inputFields.organisation")}</label>
                                    <label>{this.state.organisation}</label>
                                </Form.Field>
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <label>{t("views:userProfile.inputFields.mobile")}</label>
                                    <label>{this.state.mobile}</label>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                );
            }
        };

        return (
            <InnerPageLayout
                pageTitle={t("views:userProfile.title")}
                pageDescription={t("views:userProfile.subTitle")}>
                <Container>
                    <Transition visible={this.state.updateStatus} duration={500}>
                        <NotificationComponent onDismiss={this.handleDismiss} size="small"
                                               description="The required user details were updated successfully."
                                               success message="User Profile was successfully updated"
                        />
                    </Transition>
                    <Divider hidden/>
                    <Form>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column width={3}>
                                    <UserImagePlaceHolder size="small"/><br/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Grid.Row>
                                        {handleNameChange()}
                                    </Grid.Row>
                                    <Divider hidden/>
                                    <Grid.Row>
                                        {handleEmailChange(this.state.email)}
                                    </Grid.Row>
                                    <Divider hidden/>
                                    <Grid.Row>
                                        <Form.Field>
                                            <label>{t("views:userProfile.inputFields.username")}</label>
                                            <label>{this.state.username}</label>
                                        </Form.Field>
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Divider hidden/>
                        <Header dividing={true} as="h3">{t("views:userProfile.personalInfoTitle")}
                            <Button basic id="pInfoEdit" onClick={this.handleEdit}
                                    name="pencil alternate" size="small"
                                    style={{marginLeft: "10px", padding: "6px"}}>Update</Button>
                        </Header>
                        <Divider hidden/>
                        {handlePInfoChange()}
                    </Form>
                </Container>
            </InnerPageLayout>
        );
    }

    /**
     * Set the fetched profile details to the state
     * @param response
     */
    private setProfileDetails(response) {
        let mNumber = "";
        response.phoneNumbers.map((mobile) => {
            mNumber = mobile.value;
        });
        this.setState({
            displayName: response.displayName,
            email: response.emails[0],
            emails: response.emails,
            lastName: response.lastName,
            mobile: mNumber,
            organisation: response.organisation,
            phoneNumbers: response.phoneNumbers,
            proUrl: response.proUrl,
            roles: response.roles,
            username: response.username
        });
    }
}

export const UserProfilePage = withTranslation()(UserProfilePageComponent);
