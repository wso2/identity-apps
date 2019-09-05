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
 * under the License
 */

import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Divider, Form, Grid, Icon, List, Transition } from "semantic-ui-react";
import { getProfileInfo, updateProfileInfo } from "../actions";
import { createEmptyProfile } from "../models/profile";
import { EditSection } from "./edit-section";
import { NotificationComponent } from "./notification";
import { SettingsSection } from "./settings-section";
import { UserImagePlaceHolder } from "./ui";

/**
 * Basic information section of the User Profile
 */
class BasicDetailsComponent extends React.Component<WithTranslation, any> {
    constructor(props) {
        super(props);
        this.state = {
            basicInfo: createEmptyProfile(),
            emailEdit: false,
            nameEdit: false,
            notification: {
                description: "",
                message: "",
                other: {
                    error: false,
                    success: false
                }
            },
            personalInfoEdit: false,
            updateStatus: false
        };
        this.handleSave = this.handleSave.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    public componentDidMount() {
        getProfileInfo()
            .then((response) => {
                this.setBasicDetails(response);
            });
    }

    /**
     * The following method handles the change of state of the input fields.
     * The id of the event target will be used to set the state.
     * @param event
     */
    public handleFieldChange = (event) => {
        const {basicInfo} = this.state;
        this.setState({
            basicInfo : {
                ...basicInfo,
                [event.target.id]: event.target.value
            }
        });
        event.preventDefault();
    }

    /**
     * The following method handles the onClick event of the dismiss button
     */
    public handleDismiss = () => {
        this.setState({
            updateStatus: false
        });
    }

    /**
     * The following method handles the onClick event of the save button
     * The update request will be sent depending on the id of the event target
     * @param event
     */
    public handleSave = (event) => {
        const {t} = this.props;
        const {basicInfo, notification} = this.state;
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

        const emails = [];
        emails.push(basicInfo.email);
        switch (event.target.id) {
            case "name" : {
                data.Operations[0].value = {
                    name: {
                        familyName: basicInfo.lastName,
                        givenName: basicInfo.displayName
                    }
                };
                break;
            }
            case "email" : {
                data.Operations[0].value = {emails};
                break;
            }
        }
        updateProfileInfo(data)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:userProfile.notification.updateProfileInfo.success.description"
                            ),
                            message: t(
                                "views:userProfile.notification.updateProfileInfo.success.message"
                            ),
                            other: {
                                success: true
                            }
                        },
                        updateStatus: true
                    });
                    getProfileInfo()
                        .then((res) => {
                            this.setBasicDetails(res);
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
        }
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

    public render() {
        const {t} = this.props;
        const {basicInfo, notification} = this.state;
        const {description, message, other} = notification;
        const handleNameChange = () => {
            if (this.state.nameEdit) {
                return (<>
                        <EditSection>
                            <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>{t("views:userProfile.inputFields.firstName")}</label>
                                            <input required id="displayName"
                                                   value={basicInfo.displayName}
                                                   onChange={this.handleFieldChange}/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <label>{t("views:userProfile.inputFields.lastName")}</label>
                                            <input required id="lastName"
                                                   value={basicInfo.lastName}
                                                   onChange={this.handleFieldChange}/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Divider hidden/>
                            <Button id="name" primary onClick={this.handleSave}>
                                {t("common:save")}
                            </Button>
                            <Button id="nameEdit" default onClick={this.handleCancel}>
                                {t("common:cancel")}
                            </Button>
                        </EditSection>
                    </>
                );
            } else {
                return (<>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <List.Content>
                                        <List.Description>
                                            {t("views:userProfile.inputFields.name")}
                                        </List.Description>
                                    </List.Content>
                                </Grid.Column>
                                <Grid.Column>
                                    <List.Content>{basicInfo.displayName + " " + basicInfo.lastName}</List.Content>
                                </Grid.Column>
                                <Grid.Column>
                                    <List.Content floated="right">
                                        <Icon link size="small" color="grey" id="nameEdit"
                                              onClick={this.handleEdit} style={{marginLeft: "10px"}}
                                              name="pencil alternate"/>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>
                );
            }
        };

        const handleEmailChange = () => {
            if (this.state.emailEdit) {
                return (<>
                        <EditSection>
                            <Form.Field>
                                <label>{t("views:userProfile.inputFields.email")}</label>
                                <input required id="email" value={basicInfo.email} onChange={this.handleFieldChange}/>
                            </Form.Field>
                            <Button id="email" primary onClick={this.handleSave}>
                                {t("common:save")}
                            </Button>
                            <Button id="emailEdit" default onClick={this.handleCancel}>
                                {t("common:cancel")}
                            </Button>
                        </EditSection>
                    </>
                );
            } else {
                return (<>
                        <Grid>
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <List.Content>
                                        <List.Description>
                                            {t("views:userProfile.inputFields.email")}
                                        </List.Description>
                                    </List.Content>
                                </Grid.Column>
                                <Grid.Column>
                                    <List.Content>{basicInfo.email}</List.Content>
                                </Grid.Column>
                                <Grid.Column>
                                    <List.Content floated="right">
                                        <Icon link size="small" color="grey" id="emailEdit"
                                              onClick={this.handleEdit} style={{marginLeft: "10px"}}
                                              name="pencil alternate"/>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>
                );
            }
        };
        return(<SettingsSection header="Basic Details" description="Manage and Update Your Basic Information"
                              isEdit={this.state.emailEdit}  actionTitle="" onClick={handleEmailChange}>
                <Transition visible={this.state.updateStatus} duration={500}>
                    <NotificationComponent {...other} onDismiss={this.handleDismiss} size="small"
                                           description={description} message={message}
                    />
                </Transition>
                <Divider hidden/>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column width={3}>
                        <UserImagePlaceHolder size="small"/><br/>
                    </Grid.Column>
                    <Grid.Column>
                        <List relaxed="very" divided verticalAlign="middle">
                            <List.Item>
                                {handleNameChange()}
                            </List.Item>
                            <List.Item>
                                {handleEmailChange()}
                            </List.Item>
                            <List.Item>
                                <Grid>
                                    <Grid.Row columns={3}>
                                        <Grid.Column>
                                            <List.Content>
                                                <List.Description>
                                                    {t("views:userProfile.inputFields.username")}
                                                </List.Description>
                                                </List.Content>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <List.Content>{basicInfo.username}</List.Content>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Item>
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            </SettingsSection>
        );
    }

    /**
     * Set the fetched basic profile details to the state
     * @param response
     */
    private setBasicDetails(response) {
        const {t} = this.props;
        const {basicInfo, notification} = this.state;
        if (response.responseStatus === 200) {
            this.setState({
                basicInfo: {
                    ...basicInfo,
                    displayName: response.displayName,
                    email: response.emails[0],
                    emails: response.emails,
                    lastName: response.lastName,
                    username: response.username
                }
            });
        } else {
            this.setState({
                notification: {
                    ...notification,
                    description: t(
                        "views:userProfile.notification.getProfileInfo.error.description"
                    ),
                    message: t(
                        "views:userProfile.notification.getProfileInfo.error.message"
                    ),
                    other: {
                        error: true
                    }
                },
                updateStatus: true
            });
        }
    }
}

export const BasicDetails = withTranslation()(BasicDetailsComponent);
