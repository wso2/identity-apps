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

import React, { ChangeEvent, FunctionComponent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Form, Grid, Icon, List } from "semantic-ui-react";
import { addAccountAssociation, getAssociations, getProfileInfo } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { AuthContext } from "../../contexts";
import { Notification } from "../../models";
import { setProfileInfo } from "../../store/actions";
import { EditSection, SettingsSection, UserImage } from "../shared";

/**
 * Proptypes for the liked accounts component.
 */
interface LinkedAccountsProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Linked accounts component.
 *
 * @param {LinkedAccountsProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const LinkedAccounts: FunctionComponent<LinkedAccountsProps> = (
    props: LinkedAccountsProps
): JSX.Element => {
    const [ associations, setAssociations ] = useState([]);
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ editingForm, setEditingForm ] = useState({
        addAccountForm: false
    });
    const { onNotificationFired } = props;
    const { state, dispatch } = useContext(AuthContext);
    const { t } = useTranslation();

    useEffect(() => {
        fetchAssociations();
    }, []);

    /**
     * Fetches associations from the API.
     */
    const fetchAssociations = (): void => {
        if (!state.profileInfo || (state.profileInfo && !state.profileInfo.displayName)) {
            getProfileInfo()
                .then((infoResponse) => {
                    getAssociations()
                        .then((associationsResponse) => {
                            setAssociations(associationsResponse);
                            dispatch(setProfileInfo({
                                ...infoResponse,
                                associations: associationsResponse
                            }));
                        })
                        .catch((error) => {
                            onNotificationFired({
                                description: t(
                                    "views:associatedAccounts.notification.getAssociation.error.description",
                                    { description: error }
                                ),
                                message: t(
                                    "views:associatedAccounts.notification.getAssociation.error.message"
                                ),
                                otherProps: {
                                    negative: true
                                },
                                visible: true
                            });
                        });
                });
            return;
        }
        getAssociations()
            .then((response) => {
                setAssociations(response);
                dispatch(setProfileInfo({
                    ...state.profileInfo,
                    associations: response
                }));
            })
            .catch((error) => {
                onNotificationFired({
                    description: t(
                        "views:associatedAccounts.notification.getAssociation.error.description",
                        { description: error }
                    ),
                    message: t(
                        "views:associatedAccounts.notification.getAssociation.error.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                });
            });
    };

    /**
     * The following method handles the change of state of the input fields.
     * The id of the event target will be used to set the state.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - Input change event
     */
    const handleFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.id === "username") {
            setUsername(e.target.value);
        } else if (e.target.id === "password") {
            setPassword(e.target.value);
        }
        event.preventDefault();
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param formName - Name of the form
     */
    const handleSubmit = (formName: string): void => {
        const data = {
            password,
            properties: [
                {
                    key: "string",
                    value: "string"
                }
            ],
            userId: username
        };

        addAccountAssociation(data)
            .then((response) => {
                if (response.status !== 201) {
                    onNotificationFired({
                        description: t(
                            "views:associatedAccounts.notification.addAssociation.error.description"
                        ),
                        message: t(
                            "views:associatedAccounts.notification.addAssociation.error.message"
                        ),
                        otherProps: {
                            negative: true
                        },
                        visible: true
                    });
                } else {
                    onNotificationFired({
                        description: t(
                            "views:associatedAccounts.notification.addAssociation.success.description"
                        ),
                        message: t(
                            "views:associatedAccounts.notification.addAssociation.success.message"
                        ),
                        otherProps: {
                            positive: true
                        },
                        visible: true
                    });

                    // Hide form
                    setEditingForm({
                        ...editingForm,
                        [formName]: false
                    });

                    // Re-fetch account associations.
                }
                fetchAssociations();
            });
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

    return (
        <SettingsSection
            description={ t("views:associatedAccounts.subTitle") }
            header={ t("views:associatedAccounts.title") }
            icon={ SettingsSectionIcons.associatedAccounts }
            iconMini={ SettingsSectionIcons.associatedAccountsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => showFormEditView("addAccountForm") }
            primaryAction={ t("views:associatedAccounts.actionTitle") }
            primaryActionIcon="add"
            showActionBar={ !editingForm.addAccountForm }
        >
            {
                editingForm.addAccountForm
                    ? (
                        <EditSection>
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 4 }>
                                        { t("views:associatedAccounts.accountTypes.local.label") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <Form onSubmit={ () => handleSubmit("addAccountForm") }>
                                            <Form.Field>
                                                <label>{ t("views:associatedAccounts.forms.addAccountForm.inputs" +
                                                    ".username.label") }</label>
                                                <input
                                                    required
                                                    placeholder={ t("views:associatedAccounts.forms.addAccountForm" +
                                                        ".inputs.username.placeholder") }
                                                    id="username"
                                                    onChange={ handleFieldChange }
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>{ t("views:associatedAccounts.forms.addAccountForm.inputs" +
                                                    ".password.label") }</label>
                                                <input
                                                    required
                                                    placeholder={ t("views:associatedAccounts.forms.addAccountForm" +
                                                        ".inputs.password.placeholder") }
                                                    type="password"
                                                    id="password"
                                                    onChange={ handleFieldChange }
                                                />
                                            </Form.Field>
                                            <Divider hidden/>
                                            <Button type="submit" primary size="small">
                                                { t("common:save") }
                                            </Button>
                                            <Button
                                                size="small"
                                                className="link-button"
                                                onClick={ () => hideFormEditView("addAccountForm") }
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
                        <List divided verticalAlign="middle" className="main-content-inner">
                            {
                                associations.map((association, index) => (
                                    <List.Item className="inner-list-item" key={ index }>
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 11 } className="first-column">
                                                    <UserImage
                                                        bordered
                                                        avatar
                                                        floated="left"
                                                        spaced="right"
                                                        size="mini"
                                                        name={ association.username }
                                                    />
                                                    <List.Header>{ association.userId }</List.Header>
                                                    <List.Description>
                                                        <p style={ { fontSize: "11px" } }>
                                                            { association.username }
                                                        </p>
                                                    </List.Description>
                                                </Grid.Column>
                                                <Grid.Column width={ 5 } className="last-column">
                                                    <List.Content floated="right">
                                                        <Icon
                                                            link
                                                            disabled
                                                            className="list-icon"
                                                            size="large"
                                                            color="red"
                                                            name="trash alternate outline"
                                                        />
                                                        <Button
                                                            basic
                                                            size="tiny"
                                                        >
                                                            { t("common:switch") }
                                                        </Button>
                                                    </List.Content>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Item>
                                ))
                            }
                        </List>
                    )
            }
        </SettingsSection>
    );
};
