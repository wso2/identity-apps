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

import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid, Icon, List, Popup, Responsive } from "semantic-ui-react";
import { getProfileInfo, updateProfileInfo } from "../../api";
import { AuthContext } from "../../contexts";
import { resolveUserAvatar } from "../../helpers";
import { createEmptyProfile, Notification } from "../../models";
import { EditSection, FormWrapper, SettingsSection } from "../shared";

/**
 * Prop types for the basic details component.
 */
interface ProfileProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Basic details component.
 *
 * @param {ProfileProps} props - Props injected to the basic details component.
 * @return {JSX.Element}
 */
export const Profile: FunctionComponent<ProfileProps> = (props: ProfileProps): JSX.Element => {
    const [profileInfo, setProfileInfo] = useState(createEmptyProfile());
    const [editingProfileInfo, setEditingProfileInfo] = useState(createEmptyProfile());
    const [editingForm, setEditingForm] = useState({
        emailChangeForm: false,
        mobileChangeForm: false,
        nameChangeForm: false,
        organizationChangeForm: false
    });
    const { onNotificationFired } = props;
    const { state } = useContext(AuthContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (profileInfo && !profileInfo.username) {
            fetchProfileInfo();
        }
    });

    /**
     * Fetches profile information.
     */
    const fetchProfileInfo = (): void => {
        getProfileInfo().then((response) => {
            if (response.responseStatus === 200) {
                setBasicDetails(response);
            } else {
                onNotificationFired({
                    description: t("views:components.profile.notifications.getProfileInfo.error.description"),
                    message: t("views:components.profile.notifications.getProfileInfo.error.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                });
            }
        });
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param formName - Name of the form
     */
    const handleSubmit = (values: Map<string, string | string[]>, formName: string): void => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        switch (formName) {
            case "nameChangeForm": {
                data.Operations[0].value = {
                    name: {
                        familyName: values.get("lastName"),
                        givenName: values.get("displayName")
                    }
                };
                break;
            }
            case "emailChangeForm": {
                data.Operations[0].value = {
                    emails: [values.get("email")]
                };
                break;
            }
            case "organizationChangeForm": {
                data.Operations[0].value = {
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
                        organization: values.get("organisation")
                    }
                };
                break;
            }
            case "mobileChangeForm": {
                data.Operations[0].value = {
                    phoneNumbers: [
                        {
                            type: "mobile",
                            value: values.get("mobile")
                        }
                    ]
                };
                break;
            }
        }

        updateProfileInfo(data).then((response) => {
            if (response.status === 200) {
                onNotificationFired({
                    description: t("views:components.profile.notifications.updateProfileInfo.success.description"),
                    message: t("views:components.profile.notifications.updateProfileInfo.success.message"),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                });

                // Re-fetch the profile information
                fetchProfileInfo();
            }
        });

        // Hide corresponding edit view
        hideFormEditView(formName);
    };

    /**
     * The following method handles the onClick event of the edit button.
     *
     * @param formName - Name of the form
     */
    const showFormEditView = (formName: string): void => {
        setEditingForm({
            ...editingForm,
            [formName]: true
        });
    };

    /**
     * The following method handles the onClick event of the cancel button.
     *
     * @param formName - Name of the form
     */
    const hideFormEditView = (formName: string): void => {
        setEditingForm({
            ...editingForm,
            [formName]: false
        });
    };

    /**
     * Set the fetched basic profile details to the state.
     *
     * @param profile - Response from the API request.
     */
    const setBasicDetails = (profile) => {
        let mobileNumber = "";

        profile.phoneNumbers.map((mobile) => {
            mobileNumber = mobile.value;
        });

        setEditingProfileInfo({
            ...editingProfileInfo,
            displayName: profile.displayName,
            email: profile.emails[0],
            emails: profile.emails,
            lastName: profile.lastName,
            mobile: mobileNumber,
            organisation: profile.organisation,
            phoneNumbers: profile.phoneNumbers,
            userimage: state.userimage,
            username: profile.username
        });
        setProfileInfo({
            ...profileInfo,
            displayName: profile.displayName,
            email: profile.emails[0],
            emails: profile.emails,
            lastName: profile.lastName,
            mobile: mobileNumber,
            organisation: profile.organisation,
            phoneNumbers: profile.phoneNumbers,
            userimage: state.userimage,
            username: profile.username
        });
    };

    const handleNameChange = editingForm.nameChangeForm ? (
        <EditSection>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 4 }>{ t("views:components.profile.fields.name.label") }</Grid.Column>
                    <Grid.Column width={ 12 }>
                        <FormWrapper
                            formFields={ [
                                {
                                    label: t(
                                        "views:components.profile.forms.nameChangeForm." +
                                        "inputs.firstName.label"
                                    ),
                                    name: "displayName",
                                    placeholder: t(
                                        "views:components.profile.forms.nameChangeForm.inputs" +
                                        ".firstName.placeholder"
                                    ),
                                    required: true,
                                    requiredErrorMessage: t(
                                        "views:components.profile.forms." +
                                        "nameChangeForm.inputs.firstName.validations.empty"
                                    ),
                                    type: "text",
                                    value: editingProfileInfo.displayName
                                },
                                {
                                    name: "lastName",
                                    placeholder: t(
                                        "views:components.profile.forms.nameChangeForm.inputs" +
                                        ".lastName.placeholder"
                                    ),
                                    required: true,
                                    requiredErrorMessage: t(
                                        "views:components.profile.forms." +
                                        "nameChangeForm.inputs.lastName.validations.empty"
                                    ),
                                    type: "text",
                                    value: editingProfileInfo.lastName
                                },
                                {
                                    hidden: true,
                                    type: "divider"
                                },
                                {
                                    size: "small",
                                    type: "submit",
                                    value: t("common:save").toString()
                                },
                                {
                                    className: "link-button",
                                    onClick: () => {
                                        hideFormEditView("nameChangeForm");
                                    },
                                    size: "small",
                                    type: "button",
                                    value: t("common:cancel").toString()
                                }
                            ] }
                            groups={ [
                                {
                                    endIndex: 5,
                                    startIndex: 3,
                                    wrapper: Form.Group,
                                    wrapperProps: {
                                        inline: true
                                    }
                                }
                            ] }
                            onSubmit={ (values) => {
                                handleSubmit(values, "nameChangeForm");
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    ) : (
            <Grid padded={ true }>
                <Grid.Row columns={ 3 }>
                    <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                        <List.Content>{ t("views:components.profile.fields.name.label") }</List.Content>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <List.Content>
                            <List.Description>
                                { profileInfo.displayName || profileInfo.lastName
                                    ? profileInfo.displayName + " " + profileInfo.lastName
                                    : t("views:components.profile.fields.name.default") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column
                        mobile={ 2 }
                        tablet={ 2 }
                        computer={ 2 }
                        className={ window.innerWidth > Responsive.onlyTablet.minWidth ? "last-column" : "" }
                    >
                        <List.Content floated="right">
                            <Popup
                                trigger={
                                    (
                                        <Icon
                                            link={ true }
                                            className="list-icon"
                                            size="small"
                                            color="grey"
                                            onClick={ () => showFormEditView("nameChangeForm") }
                                            name={ profileInfo.displayName || profileInfo.lastName ?
                                                "pencil alternate" : "add" }
                                        />
                                    )
                                }
                                position="top center"
                                content={
                                    profileInfo.displayName || profileInfo.lastName ?
                                        t("common:edit") : t("common:add")
                                }
                                inverted={ true }
                            />
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );

    const handleEmailChange = editingForm.emailChangeForm ? (
        <EditSection>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 4 }>{ t("views:components.profile.fields.email.label") }</Grid.Column>
                    <Grid.Column width={ 12 }>
                        <FormWrapper
                            formFields={ [
                                {
                                    label: t("views:components.profile.fields.email.label"),

                                    name: "email",
                                    placeholder: t(
                                        "views:components.profile.forms.emailChangeForm.inputs" +
                                        ".email.placeholder"
                                    ),
                                    required: true,
                                    requiredErrorMessage: t(
                                        "views:components.profile.forms." +
                                        "emailChangeForm.inputs.email.validations.empty"
                                    ),
                                    type: "text",
                                    value: editingProfileInfo.email
                                },
                                {
                                    hidden: true,
                                    type: "divider"
                                },
                                {
                                    size: "small",
                                    type: "submit",
                                    value: t("common:save").toString()
                                },
                                {
                                    className: "link-button",
                                    onClick: () => {
                                        hideFormEditView("emailChangeForm");
                                    },
                                    size: "small",
                                    type: "button",
                                    value: t("common:cancel").toString()
                                }
                            ] }
                            groups={ [
                                {
                                    endIndex: 4,
                                    startIndex: 2,
                                    wrapper: Form.Group,
                                    wrapperProps: {
                                        inline: true
                                    }
                                }
                            ] }
                            onSubmit={ (values) => {
                                handleSubmit(values, "emailChangeForm");
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    ) : (
            <Grid padded={ true }>
                <Grid.Row columns={ 3 }>
                    <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                        <List.Content>{ t("views:components.profile.fields.email.label") }</List.Content>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <List.Content>
                            <List.Description>
                                { profileInfo.email ? profileInfo.email : t("views:components.profile" +
                                    ".fields.email.default") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column
                        mobile={ 2 }
                        tablet={ 2 }
                        computer={ 2 }
                        className={ window.innerWidth > Responsive.onlyTablet.minWidth ? "last-column" : "" }
                    >
                        <List.Content floated="right">
                            <Popup
                                trigger={
                                    (
                                        <Icon
                                            link={ true }
                                            className="list-icon"
                                            size="small"
                                            color="grey"
                                            id="emailEdit"
                                            onClick={ () => showFormEditView("emailChangeForm") }
                                            name={ profileInfo.email ? "pencil alternate" : "add" }
                                        />
                                    )
                                }
                                position="top center"
                                content={ profileInfo.email ? t("common:edit") : t("common:add") }
                                inverted={ true }
                            />
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );

    const handleOrganisationChange = editingForm.organizationChangeForm ? (
        <EditSection>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 4 }>
                        { t("views:components.profile.fields.organization.label") }
                    </Grid.Column>
                    <Grid.Column width={ 12 }>
                        <FormWrapper
                            formFields={ [
                                {
                                    label: t("views:components.profile.fields.organization.label"),
                                    name: "organisation",
                                    placeholder: t(
                                        "views:components.profile.forms.organizationChangeForm" +
                                        ".inputs.organization.placeholder"
                                    ),
                                    required: true,
                                    requiredErrorMessage: t(
                                        "views:components.profile.forms." +
                                        "organizationChangeForm.inputs.organization.validations.empty"
                                    ),
                                    type: "text",
                                    value: editingProfileInfo.organisation
                                },
                                {
                                    hidden: true,
                                    type: "divider"
                                },
                                {
                                    size: "small",
                                    type: "submit",
                                    value: t("common:save").toString()
                                },
                                {
                                    className: "link-button",
                                    onClick: () => {
                                        hideFormEditView("organizationChangeForm");
                                    },
                                    size: "small",
                                    type: "button",
                                    value: t("common:cancel").toString()
                                }
                            ] }
                            groups={ [
                                {
                                    endIndex: 4,
                                    startIndex: 2,
                                    wrapper: Form.Group,
                                    wrapperProps: {
                                        inline: true
                                    }
                                }
                            ] }
                            onSubmit={ (values) => {
                                handleSubmit(values, "organizationChangeForm");
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    ) : (
            <Grid padded={ true }>
                <Grid.Row columns={ 3 }>
                    <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                        <List.Content>{ t("views:components.profile.fields.organization.label") }</List.Content>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <List.Content>
                            <List.Description>
                                { profileInfo.organisation
                                    ? profileInfo.organisation
                                    : t("views:components.profile.fields.organization.default") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column
                        tablet={ 2 }
                        mobile={ 2 }
                        computer={ 2 }
                        className={ window.innerWidth > Responsive.onlyTablet.minWidth ? "last-column" : "" }
                    >
                        <List.Content floated="right">
                            <Popup
                                trigger={
                                    (
                                        <Icon
                                            link={ true }
                                            className="list-icon"
                                            size="small"
                                            color="grey"
                                            id="organizationEdit"
                                            onClick={ () => showFormEditView("organizationChangeForm") }
                                            name={ profileInfo.organisation ? "pencil alternate" : "add" }
                                        />
                                    )
                                }
                                position="top center"
                                content={ profileInfo.organisation ? t("common:edit") : t("common:add") }
                                inverted={ true }
                            />
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );

    const handleMobileChange = editingForm.mobileChangeForm ? (
        <EditSection>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 4 }>{ t("views:components.profile.fields.mobile.label") }</Grid.Column>
                    <Grid.Column width={ 12 }>
                        <FormWrapper
                            formFields={ [
                                {
                                    label: t("views:components.profile.fields.mobile.label"),
                                    name: "mobile",
                                    placeholder: t(
                                        "views:components.profile.forms.mobileChangeForm" + ".inputs.mobile.placeholder"
                                    ),
                                    required: true,
                                    requiredErrorMessage: t(
                                        "views:components.profile.forms." +
                                        "mobileChangeForm.inputs.mobile.validations.empty"
                                    ),
                                    type: "text",
                                    value: editingProfileInfo.mobile
                                },
                                {
                                    hidden: true,
                                    type: "divider"
                                },
                                {
                                    size: "small",
                                    type: "submit",
                                    value: t("common:save").toString()
                                },
                                {
                                    className: "link-button",
                                    onClick: () => {
                                        hideFormEditView("mobileChangeForm");
                                    },
                                    size: "small",
                                    type: "button",
                                    value: t("common:cancel").toString()
                                }
                            ] }
                            groups={ [
                                {
                                    endIndex: 4,
                                    startIndex: 2,
                                    wrapper: Form.Group,
                                    wrapperProps: {
                                        inline: true
                                    }
                                }
                            ] }
                            onSubmit={ (values) => {
                                handleSubmit(values, "mobileChangeForm");
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    ) : (
            <Grid padded={ true }>
                <Grid.Row columns={ 3 }>
                    <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                        <List.Content>{ t("views:components.profile.fields.mobile.label") }</List.Content>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <List.Content>
                            <List.Description>
                                { profileInfo.mobile
                                    ? profileInfo.mobile
                                    : t("views:components.profile.fields.mobile.default") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column
                        mobile={ 2 }
                        tablet={ 2 }
                        computer={ 2 }
                        className={ window.innerWidth > Responsive.onlyTablet.minWidth ? "last-column" : "" }
                    >
                        <List.Content floated="right">
                            <Popup
                                trigger={
                                    (
                                        <Icon
                                            link={ true }
                                            className="list-icon"
                                            size="small"
                                            color="grey"
                                            onClick={ () => showFormEditView("mobileChangeForm") }
                                            name={ profileInfo.mobile ? "pencil alternate" : "add" }
                                        />
                                    )
                                }
                                position="top center"
                                content={ profileInfo.mobile ? t("common:edit") : t("common:add") }
                                inverted={ true }
                            />
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );

    return (
        <SettingsSection
            description={ t("views:sections.profile.description") }
            header={ t("views:sections.profile.heading") }
            icon={ resolveUserAvatar(state, "tiny") }
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                <List.Item className="inner-list-item">
                    <Grid padded={ true }>
                        <Grid.Row columns={ 3 }>
                            <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                                <List.Content>
                                    { t("views:components.profile.fields.username.label") }
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column mobile={ 10 } tablet={ 10 } computer={ 12 }>
                                <List.Content>
                                    <List.Description>{ profileInfo.username }</List.Description>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
                <List.Item className="inner-list-item">{ handleNameChange }</List.Item>
                <List.Item className="inner-list-item">{ handleEmailChange }</List.Item>
                <List.Item className="inner-list-item">{ handleOrganisationChange }</List.Item>
                <List.Item className="inner-list-item">{ handleMobileChange }</List.Item>
            </List>
        </SettingsSection>
    );
};
