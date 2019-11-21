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

import { FormWrapper } from "@wso2is/form";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List, Popup } from "semantic-ui-react";
import { addAccountAssociation, getAssociations, getProfileInfo, switchAccount } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { AuthStateInterface, createEmptyNotification, LinkedAccountInterface, Notification } from "../../models";
import { AppState } from "../../store";
import { setProfileInfo } from "../../store/actions";
import { EditSection, SettingsSection, UserAvatar } from "../shared";

/**
 * Prop types for the liked accounts component.
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
export const LinkedAccounts: FunctionComponent<LinkedAccountsProps> = (props: LinkedAccountsProps): JSX.Element => {
    const [ associations, setAssociations ] = useState([]);
    const [ editingForm, setEditingForm ] = useState({
        addAccountForm: false
    });
    const { onNotificationFired } = props;
    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchAssociations();
    }, []);

    /**
     * Fetches associations from the API.
     */
    const fetchAssociations = (): void => {
        let notification: Notification = createEmptyNotification();

        if (!profileDetails.profileInfo || (profileDetails.profileInfo && !profileDetails.profileInfo.displayName)) {
            getProfileInfo().then((infoResponse) => {
                getAssociations()
                    .then((associationsResponse) => {
                        setAssociations(associationsResponse);
                        dispatch(
                            setProfileInfo({
                                ...infoResponse,
                                associations: associationsResponse
                            })
                        );
                    })
                    .catch((error) => {
                        notification = {
                            description: t(
                                "views:components.linkedAccounts.notifications.getAssociations.error.description",
                                { description: error }
                            ),
                            message: t("views:components.linkedAccounts.notifications.getAssociations.error.message"),
                            otherProps: {
                                negative: true
                            },
                            visible: true
                        };
                    });
            });
            onNotificationFired(notification);
            return;
        }

        getAssociations()
            .then((response) => {
                setAssociations(response);
                dispatch(
                    setProfileInfo({
                        ...profileDetails.profileInfo,
                        associations: response
                    })
                );
            })
            .catch((error) => {
                notification = {
                    description: t("views:components.linkedAccounts.notifications.getAssociations.error.description", {
                        description: error
                    }),
                    message: t("views:components.linkedAccounts.notifications.getAssociations.error.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
            });

        onNotificationFired(notification);
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param formName - Name of the form
     */
    const handleSubmit = (values: Map<string, string | string[]>, formName: string): void => {
        let notification: Notification = createEmptyNotification();
        const username = values.get("username");
        const password = values.get("password");
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
            .then(() => {
                notification = {
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
                };

                // Hide form
                setEditingForm({
                    ...editingForm,
                    [ formName ]: false
                });
                fetchAssociations();
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:associatedAccounts.notification.addAssociation.error.description",
                        { description: error }
                    ),
                    message: t(
                        "views:associatedAccounts.notification.addAssociation.error.message",
                        { description: error }
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
            });

        onNotificationFired(notification);
    };

    /**
     * The following method handles the onClick event of the edit button.
     *
     * @param formName - Name of the form
     */
    const showFormEditView = (formName: string): void => {
        setEditingForm({
            ...editingForm,
            [ formName ]: true
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
            [ formName ]: false
        });
    };

    /**
     * Handles the account switch click event.
     *
     * @param {LinkedAccountInterface} account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface) => {
        let notification: Notification = createEmptyNotification();

        switchAccount(account)
            .then(() => {
                // reload the page on successful account switch.
                window.location.reload();
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.switchAccount.genericError.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.switchAccount.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.linkedAccounts.notifications.switchAccount.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.switchAccount.error.message"
                        ),
                    };
                }
                // TODO: Fire the notification.
            });
    };

    return (
        <SettingsSection
            description={ t("views:sections.linkedAccounts.description") }
            header={ t("views:sections.linkedAccounts.heading") }
            icon={ SettingsSectionIcons.associatedAccounts }
            iconMini={ SettingsSectionIcons.associatedAccountsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => showFormEditView("addAccountForm") }
            primaryAction={ t("views:sections.linkedAccounts.actionTitles.add") }
            primaryActionIcon="add"
            showActionBar={ !editingForm.addAccountForm }
        >
            { editingForm.addAccountForm ? (
                <EditSection>
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 4 }>
                                { t("views:components.linkedAccounts.accountTypes.local.label") }
                            </Grid.Column>
                            <Grid.Column width={ 12 }>
                                <FormWrapper
                                    formFields={ [
                                        {
                                            label: t(
                                                "views:components.linkedAccounts.forms.addAccountForm" +
                                                ".inputs.username.label"
                                            ),
                                            name: "username",
                                            placeholder: t(
                                                "views:components.linkedAccounts.forms." +
                                                "addAccountForm.inputs.username.placeholder"
                                            ),
                                            required: true,
                                            requiredErrorMessage: t(
                                                "views:components.linkedAccounts.forms" +
                                                ".addAccountForm.inputs.username.validations.empty"
                                            ),
                                            type: "text" as const
                                        },
                                        {
                                            hidePassword: t("common:hidePassword"),
                                            label: t(
                                                "views:components.linkedAccounts.forms.addAccountForm." +
                                                "inputs.password.label"
                                            ),
                                            name: "password",
                                            placeholder: t(
                                                "views:components.linkedAccounts.forms" +
                                                ".addAccountForm.inputs.password.placeholder"
                                            ),
                                            required: true,
                                            requiredErrorMessage: t(
                                                "views:components.linkedAccounts.forms" +
                                                ".addAccountForm.inputs.password.validations.empty"
                                            ),
                                            showPassword: t("common:showPassword"),
                                            type: "password" as const
                                        },
                                        {
                                            hidden: true,
                                            type: "divider" as const
                                        },
                                        {
                                            size: "small" as const,
                                            type: "submit" as const,
                                            value: t("common:save").toString()
                                        },
                                        {
                                            className: "link-button",
                                            onClick: () => {
                                                hideFormEditView("addAccountForm");
                                            },
                                            size: "small" as const,
                                            type: "button" as const,
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
                                        handleSubmit(values, "addAccountForm");
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EditSection>
            ) : (
                <List divided verticalAlign="middle" className="main-content-inner">
                    { associations.map((association, index) => (
                        <List.Item className="inner-list-item" key={ index }>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 11 } className="first-column">
                                        <UserAvatar
                                            floated="left"
                                            spaced="right"
                                            size="mini"
                                            name={ association.username }
                                        />
                                        <List.Header>{ association.username }</List.Header>
                                        <List.Description>
                                            <p style={ { fontSize: "11px" } }>{ association.tenantDomain }</p>
                                        </List.Description>
                                    </Grid.Column>
                                    <Grid.Column width={ 5 } className="last-column">
                                        <List.Content floated="right">
                                            <Popup
                                                trigger={ (
                                                    <Icon
                                                        link
                                                        className="list-icon"
                                                        size="small"
                                                        color="grey"
                                                        name="exchange"
                                                        onClick={ () => handleLinkedAccountSwitch(association) }
                                                    />
                                                ) }
                                                position="top center"
                                                content={ t("common:switch") }
                                                inverted
                                            />
                                        </List.Content>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Item>
                    )) }
                </List>
            ) }
        </SettingsSection>
    );
};
