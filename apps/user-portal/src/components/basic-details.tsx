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
import { Button, Divider, Form, Grid, Icon, List, Popup } from "semantic-ui-react";
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
            editingProfileInfo: createEmptyProfile(),
            emailEdit: false,
            mobileEdit: false,
            nameEdit: false,
            notification: {
                description: "",
                message: "",
                otherProps: {},
                visible: false
            },
            organizationEdit: false,
            profileInfo: createEmptyProfile(),
            updateStatus: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleFormEditCancel = this.handleFormEditCancel.bind(this);
        this.handleFormEditClick = this.handleFormEditClick.bind(this);
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
        const { editingProfileInfo } = this.state;
        this.setState({
            editingProfileInfo: {
                ...editingProfileInfo,
                [event.target.id]: event.target.value
            }
        });
        event.preventDefault();
    }

    /**
     * Handles the notification bar close button click.
     */
    public handleNotificationDismiss = () => {
        const { notification } = this.state;
        this.setState({
            notification: {
                ...notification,
                visible: false
            }
        });
    }

    /**
     * The following method handles the onClick event of the save button
     * The update request will be sent depending on the id of the event target
     * @param formName
     */
    public handleSubmit = (formName) => {
        const { t } = this.props;
        const { editingProfileInfo, notification } = this.state;
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

        switch (formName) {
            case "nameChangeForm" : {
                data.Operations[0].value = {
                    name: {
                        familyName: editingProfileInfo.lastName,
                        givenName: editingProfileInfo.displayName
                    }
                };
                break;
            }
            case "emailChangeForm" : {
                data.Operations[0].value = {
                    emails: [editingProfileInfo.email]
                };
                break;
            }
            case "organizationChangeForm" : {
                data.Operations[0].value = {
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
                        organization: editingProfileInfo.organisation
                    }
                };
                break;
            }
            case "mobileChangeForm" : {
                data.Operations[0].value = {
                    phoneNumbers: [
                        {
                            type: "mobile",
                            value: editingProfileInfo.mobile
                        }
                    ],
                };
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
                            otherProps: {
                                positive: true
                            },
                            visible: true
                        }
                    });
                    getProfileInfo()
                        .then((res) => {
                            this.setBasicDetails(res);
                        });
                }
            });

        if (formName === "nameChangeForm") {
            this.setState({
                nameEdit: false
            });
        }
        if (formName === "emailChangeForm") {
            this.setState({
                emailEdit: false
            });
        }
        if (formName === "organizationChangeForm") {
            this.setState({
                organizationEdit: false
            });
        }
        if (formName === "mobileChangeForm") {
            this.setState({
                mobileEdit: false
            });
        }
    }

    /**
     * The following method handles the onClick event of the edit button
     * @param event
     */
    public handleFormEditClick = (event) => {
        this.setState({
            [event.target.id]: true
        });
    }

    /**
     * The following method handles the onClick event of the cancel button
     * @param event
     */
    public handleFormEditCancel = (event) => {
        this.setState({
            [event.target.id]: false
        });
    }

    /**
     * Set the fetched basic profile details to the state
     * @param response
     */
    public setBasicDetails(response) {
        const { t } = this.props;
        const { editingProfileInfo, profileInfo, notification } = this.state;
        if (response.responseStatus === 200) {
            let mobileNumber = "";
            response.phoneNumbers.map((mobile) => {
                mobileNumber = mobile.value;
            });
            this.setState({
                editingProfileInfo: {
                    ...editingProfileInfo,
                    displayName: response.displayName,
                    email: response.emails[0],
                    emails: response.emails,
                    lastName: response.lastName,
                    mobile: mobileNumber,
                    organisation: response.organisation,
                    phoneNumbers: response.phoneNumbers,
                    username: response.username,
                },
                profileInfo: {
                    ...profileInfo,
                    displayName: response.displayName,
                    email: response.emails[0],
                    emails: response.emails,
                    lastName: response.lastName,
                    mobile: mobileNumber,
                    organisation: response.organisation,
                    phoneNumbers: response.phoneNumbers,
                    username: response.username,
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
                    otherProps: {
                        negative: true
                    },
                    visible: true
                }
            });
        }
    }

    public render() {
        const { t } = this.props;
        const {
            editingProfileInfo, profileInfo, notification, nameEdit, emailEdit, organizationEdit, mobileEdit
        } = this.state;
        const { visible, description, message, otherProps } = notification;

        const handleNameChange = (
            nameEdit
                ? (
                    <EditSection>
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 4 }>
                                    { t("views:userProfile.fields.name.label") }
                                </Grid.Column>
                                <Grid.Column width={ 12 }>
                                    <Form onSubmit={ () => this.handleSubmit("nameChangeForm") }>
                                        <Form.Field>
                                            <label>
                                                { t("views:userProfile.forms.nameChangeForm.inputs.firstName.label") }
                                            </label>
                                            <input
                                                required
                                                id="displayName"
                                                placeholder={ t("views:userProfile.forms.nameChangeForm.inputs" +
                                                    ".firstName.placeholder") }
                                                value={ editingProfileInfo.displayName }
                                                onChange={ this.handleFieldChange }/>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>
                                                { t("views:userProfile.forms.nameChangeForm.inputs.lastName.label") }
                                            </label>
                                            <input
                                                required
                                                id="lastName"
                                                placeholder={ t("views:userProfile.forms.nameChangeForm.inputs" +
                                                    ".lastName.placeholder") }
                                                value={ editingProfileInfo.lastName }
                                                onChange={ this.handleFieldChange }/>
                                        </Form.Field>
                                        <Divider hidden/>
                                        <Button id="name" type="submit" primary>
                                            { t("common:save") }
                                        </Button>
                                        <Button
                                            id="nameEdit"
                                            className="link-button"
                                            onClick={ this.handleFormEditCancel }
                                        >
                                            { t("common:cancel") }
                                        </Button>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </EditSection>
                )
                :
                (
                    <Grid padded>
                        <Grid.Row columns={ 3 }>
                            <Grid.Column width={ 4 } className="first-column">
                                <List.Content>
                                    { t("views:userProfile.fields.name.label") }
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 10 }>
                                <List.Content>
                                    <List.Description>
                                        { profileInfo.displayName + " " + profileInfo.lastName }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 2 } className="last-column">
                                <List.Content floated="right">
                                    <Popup
                                        trigger={
                                            <Icon
                                                link
                                                size="small"
                                                color="grey"
                                                id="nameEdit"
                                                onClick={ this.handleFormEditClick }
                                                name="pencil alternate"
                                            />
                                        }
                                        position="top center"
                                        content="Edit"
                                        inverted
                                    />
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ));

        const handleEmailChange = (
            emailEdit
                ? (
                    <EditSection>
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 4 }>
                                    { t("views:userProfile.fields.email.label") }
                                </Grid.Column>
                                <Grid.Column width={ 12 }>
                                    <Form onSubmit={ () => this.handleSubmit("emailChangeForm") }>
                                        <Form.Field>
                                            <label>{ t("views:userProfile.fields.email.label") }</label>
                                            <input
                                                required
                                                id="email"
                                                placeholder={ t("views:userProfile.forms.emailChangeForm.inputs" +
                                                    ".email.placeholder") }
                                                value={ editingProfileInfo.email }
                                                onChange={ this.handleFieldChange }
                                            />
                                        </Form.Field>
                                        <Divider hidden/>
                                        <Button id="email" type="submit" primary>
                                            { t("common:save") }
                                        </Button>
                                        <Button
                                            id="emailEdit"
                                            className="link-button"
                                            onClick={ this.handleFormEditCancel }
                                        >
                                            { t("common:cancel") }
                                        </Button>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </EditSection>
                )
                :
                (
                    <Grid padded>
                        <Grid.Row columns={ 3 }>
                            <Grid.Column width={ 4 } className="first-column">
                                <List.Content>
                                    { t("views:userProfile.fields.email.label") }
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 10 }>
                                <List.Content>
                                    <List.Description>
                                        {
                                            profileInfo.email
                                                ? profileInfo.email
                                                : t("views:userProfile.fields.email.default")
                                        }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 2 } className="last-column">
                                <List.Content floated="right">
                                    <Popup
                                        trigger={
                                            <Icon
                                                link
                                                size="small"
                                                color="grey"
                                                id="emailEdit"
                                                onClick={ this.handleFormEditClick }
                                                name={ profileInfo.email ? "pencil alternate" : "add" }
                                            />
                                        }
                                        position="top center"
                                        content={ profileInfo.email ?  t("common:edit") : t("common:add") }
                                        inverted
                                    />
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ));

        const handleOrganisationChange = (
            organizationEdit
                ? (
                    <EditSection>
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 4 }>
                                    { t("views:userProfile.fields.organization.label") }
                                </Grid.Column>
                                <Grid.Column width={ 12 }>
                                    <Form onSubmit={ () => this.handleSubmit("organizationChangeForm") }>
                                        <Form.Field>
                                            <label>{ t("views:userProfile.fields.organization.label") }</label>
                                            <input
                                                required
                                                id="organisation"
                                                placeholder={ t("views:userProfile.forms.organizationChangeForm" +
                                                    ".inputs.organization.placeholder") }
                                                value={ editingProfileInfo.organisation }
                                                onChange={ this.handleFieldChange }
                                            />
                                        </Form.Field>
                                        <Divider hidden/>
                                        <Button id="organisation" type="submit" primary>
                                            { t("common:save") }
                                        </Button>
                                        <Button
                                            id="organizationEdit"
                                            className="link-button"
                                            onClick={ this.handleFormEditCancel }
                                        >
                                            { t("common:cancel") }
                                        </Button>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </EditSection>
                )
                :
                (
                    <Grid padded>
                        <Grid.Row columns={ 3 }>
                            <Grid.Column width={ 4 } className="first-column">
                                <List.Content>
                                    { t("views:userProfile.fields.organization.label") }
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 10 }>
                                <List.Content>
                                    <List.Description>
                                        {
                                            profileInfo.organisation
                                                ? profileInfo.organisation
                                                : t("views:userProfile.fields.organization.default")
                                        }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 2 } className="last-column">
                                <List.Content floated="right">
                                    <Popup
                                        trigger={
                                            <Icon
                                                link
                                                size="small"
                                                color="grey"
                                                id="organizationEdit"
                                                onClick={ this.handleFormEditClick }
                                                name={ profileInfo.organisation ? "pencil alternate" : "add" }
                                            />
                                        }
                                        position="top center"
                                        content={ profileInfo.organisation ?  t("common:edit") : t("common:add") }
                                        inverted
                                    />
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
        );

        const handleMobileChange = (
            mobileEdit
                ? (
                    <EditSection>
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 4 }>
                                    { t("views:userProfile.fields.mobile.label") }
                                </Grid.Column>
                                <Grid.Column width={ 12 }>
                                    <Form onSubmit={ () => this.handleSubmit("mobileChangeForm") }>
                                        <Form.Field>
                                            <label>{ t("views:userProfile.fields.mobile.label") }</label>
                                            <input
                                                required
                                                id="mobile"
                                                placeholder={ t("views:userProfile.forms.mobileChangeForm" +
                                                    ".inputs.mobile.placeholder") }
                                                value={ editingProfileInfo.mobile }
                                                onChange={ this.handleFieldChange }
                                            />
                                        </Form.Field>
                                        <Divider hidden/>
                                        <Button id="mobile" type="submit" primary>
                                            { t("common:save") }
                                        </Button>
                                        <Button
                                            id="mobileEdit"
                                            className="link-button"
                                            onClick={ this.handleFormEditCancel }
                                        >
                                            { t("common:cancel") }
                                        </Button>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </EditSection>
                )
                :
                (
                    <Grid padded>
                        <Grid.Row columns={ 3 }>
                            <Grid.Column width={ 4 } className="first-column">
                                <List.Content>
                                    { t("views:userProfile.fields.mobile.label") }
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 10 }>
                                <List.Content>
                                    <List.Description>
                                        {
                                            profileInfo.mobile
                                                ? profileInfo.mobile
                                                : t("views:userProfile.fields.mobile.default")
                                        }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 2 } className="last-column">
                                <List.Content floated="right">
                                    <Popup
                                        trigger={
                                            <Icon
                                                link
                                                size="small"
                                                color="grey"
                                                id="mobileEdit"
                                                onClick={ this.handleFormEditClick }
                                                name={ profileInfo.mobile ? "pencil alternate" : "add" }
                                            />
                                        }
                                        position="top center"
                                        content={ profileInfo.mobile ?  t("common:edit") : t("common:add") }
                                        inverted
                                    />
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
        );

        return (
            <SettingsSection
                contentPadding={ false }
                header="Basic Details"
                description="Manage and Update Your Basic Information"
                isEdit={ this.state.emailEdit }
                icon={ <UserImagePlaceHolder size="tiny"/> }
                iconSize="auto"
                iconStyle="colored"
                iconFloated="right"
            >
                {
                    visible
                        ? (<NotificationComponent
                            message={ message }
                            description={ description }
                            onDismiss={ this.handleNotificationDismiss }
                            { ...otherProps }/>)
                        : null
                }
                <List divided verticalAlign="middle" className="main-content-inner">
                    <List.Item className="inner-list-item">
                        <Grid padded>
                            <Grid.Row columns={ 3 }>
                                <Grid.Column width={ 4 } className="first-column">
                                    <List.Content>
                                        { t("views:userProfile.fields.username.label") }
                                    </List.Content>
                                </Grid.Column>
                                <Grid.Column width={ 10 }>
                                    <List.Content>
                                        <List.Description>{ profileInfo.username }</List.Description>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Item>
                    <List.Item className="inner-list-item">
                        { handleNameChange }
                    </List.Item>
                    <List.Item className="inner-list-item">
                        { handleEmailChange }
                    </List.Item>
                    <List.Item className="inner-list-item">
                        { handleOrganisationChange }
                    </List.Item>
                    <List.Item className="inner-list-item">
                        { handleMobileChange }
                    </List.Item>
                </List>
            </SettingsSection>
        );
    }
}

export const BasicDetails = withTranslation()(BasicDetailsComponent);
