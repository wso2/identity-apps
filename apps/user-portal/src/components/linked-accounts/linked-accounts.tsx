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

import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List } from "semantic-ui-react";
import { addAccountAssociation, getAssociations, getProfileInfo } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { AuthContext } from "../../contexts";
import { Notification } from "../../models";
import { setProfileInfo } from "../../store/actions";
import { EditSection, SettingsSection, UserImage, FormWrapper } from "../shared";

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
                                    "views:components.linkedAccounts.notifications.getAssociations.error.description",
                                    { description: error }
                                ),
                                message: t(
                                    "views:components.linkedAccounts.notifications.getAssociations.error.message"
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
                        "views:components.linkedAccounts.notifications.getAssociations.error.description",
                        { description: error }
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.getAssociations.error.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                });
            });
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param formName - Name of the form
     */
    const handleSubmit = (values: Map<string, string|string[]>, formName: string): void => {
        let username = values.get("username");
        let password = values.get("password");
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
                            "views:components.linkedAccounts.notifications.addAssociation.error.description"
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.addAssociation.error.message"
                        ),
                        otherProps: {
                            negative: true
                        },
                        visible: true
                    });
                } else {
                    onNotificationFired({
                        description: t(
                            "views:components.linkedAccounts.notifications.addAssociation.success.description"
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.addAssociation.success.message"
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
            {
                editingForm.addAccountForm
                    ? (
                        <EditSection>
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 4 }>
                                        { t("views:components.linkedAccounts.accountTypes.local.label") }
                                    </Grid.Column>
                                    <Grid.Column width={12}>
                                        <FormWrapper
                                            formFields={[
                                                {
                                                    type: "text",
                                                    placeholder: t("views:components.linkedAccounts.forms." +
                                                        "addAccountForm.inputs.username.placeholder"),
                                                    name: "username",
                                                    required: true,
                                                    requiredErrorMessage: t("views:components.linkedAccounts.forms" +
                                                        ".addAccountForm.inputs.username.validations.empty"),
                                                    validation: () => {
                                                        
                                                    },
                                                    label: t("views:components.linkedAccounts.forms.addAccountForm" +
                                                        ".inputs.username.label")
                                                },
                                                {
                                                    type: "password",
                                                    placeholder: t("views:components.linkedAccounts.forms" +
                                                        ".addAccountForm.inputs.password.placeholder"),
                                                    name: "password",
                                                    required: true,
                                                    requiredErrorMessage: t("views:components.linkedAccounts.forms" +
                                                        ".addAccountForm.inputs.password.validations.empty"),
                                                    label: t("views:components.linkedAccounts.forms.addAccountForm." +
                                                        "inputs.password.label"),
                                                    validation: () => {
                                                        
                                                    }
                                                },
                                                {
                                                    type: "divider",
                                                    hidden:true
                                                },
                                                {
                                                    type: "submit",
                                                    value: t("common:save").toString(),
                                                    size:"small"
                                                },
                                                {
                                                    type: "button",
                                                    size: "small",
                                                    className: "link-button",
                                                    onClick: () => {
                                                        hideFormEditView("addAccountForm")
                                                    },
                                                    value: t("common:cancel").toString()
                                                }
                                            ]}
                                            groups={[
                                                {
                                                    startIndex: 3,
                                                    endIndex: 5,
                                                    style:'inline'
                                                }
                                            ]}
                                            onSubmit={(values) => {
                                                handleSubmit(values,"addAccountForm")
                                            }}
                                        />
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
