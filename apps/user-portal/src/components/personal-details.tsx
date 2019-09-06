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
import { Button, Container, Divider, Form, Grid, Header, Icon, Segment, Transition } from "semantic-ui-react";
import { getProfileInfo, updateProfileInfo } from "../actions";
import { createEmptyProfile } from "../models/profile";
import { EditSection } from "./edit-section";
import { NotificationComponent } from "./notification";
import { SettingsSection } from "./settings-section";

class PersonalDetailsComponent extends React.Component<WithTranslation, any> {
    constructor(props) {
        super(props);
        this.state = {
            inputError: "",
            notification: {
                description: "",
                message: "",
                other: {
                    error: false,
                    success: false
                }
            },
            personalInfo: createEmptyProfile(),
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
                this.setPersonalDetails(response);
            });
    }

    /**
     * Validates the form input fields and sets the corresponding error
     * message for the input field.
     */
    public validateInput = (value) => {
        const {t} = this.props;
        if (value === null || value === "") {
            this.setState({
                inputError: t("views:userProfile.inputFields.emptyField")
            });
        }
    }

    /**
     * The following method handles the change of state of the input fields.
     * The id of the event target will be used to set the state.
     * @param event
     */
    public handleFieldChange = (event) => {
        const {personalInfo} = this.state;
        this.setState({
            personalInfo: {
                ...personalInfo,
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
     * The following method handles the onClick event of the cancel button
     * @param event
     */
    public handleCancel = (event) => {
        this.setState({
            personalInfoEdit: false
        });
    }

    /**
     * The following method handles the onClick event of the edit button
     * @param event
     */
    public handleEdit = (event) => {
        this.setState({
            personalInfoEdit: true
        });
    }

    /**
     * The following method handles the onClick event of the save button
     * The update request will be sent depending on the id of the event target
     * @param event
     */
    public handleSave = (event) => {
        const {t} = this.props;
        const {personalInfo, notification} = this.state;
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
            value: personalInfo.mobile
        };
        personalInfo.phoneNumbers.push(phoneNumbers);
        data.Operations[0].value = {
            "phoneNumbers": [
                {
                    type: "mobile",
                    value: personalInfo.mobile
                }
            ],
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
                organization: personalInfo.organisation
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
                            this.setPersonalDetails(res);
                        });
                }
            });

        this.setState({
            personalInfoEdit: false
        });
    }

    public render() {
        const {t} = this.props;
        const {personalInfo, notification, personalInfoEdit} = this.state;
        const {description, message, other} = notification;
        const handlePersonalInfoChange = () => {
            if (this.state.personalInfoEdit) {
                return (<>
                        <Container>
                            <EditSection>
                                <Grid>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Form.Field>
                                                <label>{t("views:userProfile.inputFields.organisation")}</label>
                                                <input required value={personalInfo.organisation} id="organisation"
                                                       onChange={this.handleFieldChange}/>
                                            </Form.Field>
                                            <br/>
                                            <Form.Field>
                                                <label>{t("views:userProfile.inputFields.mobile")}</label>
                                                <input required value={personalInfo.mobile} id="mobile"
                                                       onChange={this.handleFieldChange}/>
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <Divider hidden/>
                                <Button id="pInfo" primary onClick={this.handleSave}>
                                    {t("common:save")}
                                </Button>
                                <Button className="link-button" id="personalInfoEdit" onClick={this.handleCancel}>
                                    {t("common:cancel")}
                                </Button>
                            </EditSection>
                        </Container>
                    </>
                );
            } else {
                if (personalInfo.organisation && personalInfo.mobile) {
                    return (
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column width={3}>
                                    <Form.Field>
                                        <label>{t("views:userProfile.inputFields.organisation")}</label>
                                        <label>{personalInfo.organisation}</label>
                                    </Form.Field>
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field>
                                        <label>{t("views:userProfile.inputFields.mobile")}</label>
                                        <label>{personalInfo.mobile}</label>
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    );
                } else if (!(personalInfo.organisation) && personalInfo.mobile) {
                    return (
                        <Form.Field>
                            <label>{t("views:userProfile.inputFields.mobile")}</label>
                            <label>{personalInfo.mobile}</label>
                        </Form.Field>
                    );
                } else if (!(personalInfo.mobile) && personalInfo.organisation) {
                    return (
                        <Form.Field>
                            <label>{t("views:userProfile.inputFields.organisation")}</label>
                            <label>{personalInfo.organisation}</label>
                        </Form.Field>
                    );
                } else if (!(personalInfo.organisation) && !(personalInfo.mobile)) {
                    return (
                        <>
                            <Segment placeholder size="small">
                                <Header icon>
                                    <Icon name="search"/>
                                    {t("views:userProfile.personalDetails.noDetails")}
                                </Header>
                            </Segment>
                        </>
                    );
                }
            }
        };
        return (<SettingsSection header="Personal Details" description="Manage and Update Your Personal Information"
                                 isEdit={personalInfoEdit} actionTitle="Update" onClick={this.handleEdit}>
                <Transition visible={this.state.updateStatus} duration={500}>
                    <NotificationComponent {...other} onDismiss={this.handleDismiss} size="small"
                                           description={description} message={message}
                    />
                </Transition>
                <Divider hidden/>
                {handlePersonalInfoChange()}
            </SettingsSection>
        );
    }

    private setPersonalDetails(response) {
        const {t} = this.props;
        const {personalInfo, notification} = this.state;
        if (response.responseStatus === 200) {
            let mobileNumber = "";
            response.phoneNumbers.map((mobile) => {
                mobileNumber = mobile.value;
            });
            this.setState({
                personalInfo: {
                    ...personalInfo,
                    mobile: mobileNumber,
                    organisation: response.organisation,
                    phoneNumbers: response.phoneNumbers
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

export const PersonalDetails = withTranslation()(PersonalDetailsComponent);
