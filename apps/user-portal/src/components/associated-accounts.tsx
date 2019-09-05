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
import { withTranslation, WithTranslation } from "react-i18next";
import {
    Button,
    Container,
    Divider,
    Form,
    Grid,
    Header,
    Icon, List,
    Segment,
    Transition
} from "semantic-ui-react";
import { addAccountAssociation, getAssociations } from "../actions/associated-accounts";
import { EditSection } from "./edit-section";
import { NotificationComponent } from "./notification";
import { SettingsSection } from "./settings-section";
import { UserImagePlaceHolder } from "./ui";

class AssociatedAccountsPageComponent extends React.Component<WithTranslation, any> {
    constructor(props) {
        super(props);
        this.state = {
            associations: [],
            notification: {
                description: "",
                message: "",
                other: {
                    error: false,
                    success: false
                }
            },
            password: "",
            showAddView: false,
            updateStatus: false,
            userId: ""
        };
    }

    public componentWillMount() {
        getAssociations()
            .then((response) => {
                if (!(response.status === 200)) {
                    Promise.reject(Error);
                }
                this.setState({
                    associations: response.data
                });
            });
    }

    public handleShowView = () => {
        this.setState({
            showAddView: true
        });
    }

    /**
     * The following method handles the onClick event of the cancel button
     * @param event
     */
    public handleCancel = (event) => {
        this.setState({
            showAddView: false
        });
    }

    /**
     * The following method handles the onClick event of the dismiss button
     */
    public handleDismiss = () => {
        this.setState({
            updateStatus: false
        });
    }

    public handleSave = () => {
        const {userId, notification, password} = this.state;
        const {t} = this.props;

        const data = {
            userId: userId,
            password: password,
            properties: [
                {
                    key: "string",
                    value: "string"
                }
            ]
        };
        addAccountAssociation(data)
            .then((response) => {
                if (response.status !== 201) {
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:userProfile.associatedAccounts.notification.addAssociation.error.description"
                            ),
                            message: t(
                                "views:userProfile.associatedAccounts.notification.addAssociation.error.message"
                            ),
                            other: {
                                error: true
                            }
                        },
                        updateStatus: true
                    });
                } else {
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:userProfile.associatedAccounts.notification.addAssociation.success.description"
                            ),
                            message: t(
                                "views:userProfile.associatedAccounts.notification.addAssociation.success.message"
                            ),
                            other: {
                                success: true
                            }
                        },
                        showAddView: false,
                        updateStatus: true
                    });
                    getAssociations()
                        .then((resp) => {
                            if (!(resp.status === 200)) {
                                Promise.reject(Error);
                            }
                            this.setState({
                                associations: resp.data
                            });
                        });
                }
            });
    }

    /**
     * The following method handles the change of state of the input fields.
     * The name of the event target will be used to set the state.
     * @param event
     */
    public handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
        event.preventDefault();
    }

    public render() {
        const {t} = this.props;
        const {associations, notification, showAddView} = this.state;
        const {description, message, other} = notification;
        const addAccountForm = () => {
            if (showAddView) {
                return (<EditSection>
                    <Container align="left">
                        <Grid>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Header>Associate Local User Account</Header>
                                    <Divider hidden/>
                                    <Form.Field>
                                        <label>{t("views:userProfile.associatedAccounts.inputFields.username")}</label>
                                        <input required name="userId" onChange={this.handleInputChange}/>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>{t("views:userProfile.associatedAccounts.inputFields.password")}</label>
                                        <input required type="password" name="password"
                                               onChange={this.handleInputChange}/>
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Divider hidden/>
                        <Button primary onClick={this.handleSave}>
                            {t("common:save")}
                        </Button>
                        <Button id="personalInfoEdit" default onClick={this.handleCancel}>
                            {t("common:cancel")}
                        </Button>
                    </Container>
                </EditSection>);
            } else {
                if (associations) {
                    return (<>
                        <List relaxed="very" divided>
                            {associations.map((association) => {
                                return (<>
                                    <List.Item>
                                        <Grid columns={2}>
                                            <Grid.Column>
                                                <UserImagePlaceHolder size="mini" floated="left"/>
                                                <List.Header>{association.userId}</List.Header>
                                                <List.Description>{association.username}</List.Description>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <List.Content>
                                                    <Button floated="right" disabled primary size="mini">
                                                        {t("views:userProfile.associatedAccounts.buttons.removeBtn")}
                                                    </Button>
                                                    <Button floated="right" disabled size="mini">
                                                        {t("views:userProfile.associatedAccounts.buttons.switchBtn")}
                                                    </Button>
                                                </List.Content>
                                            </Grid.Column>
                                        </Grid>
                                    </List.Item>
                                </>);
                            })
                            }
                        </List>
                    </>);
                } else {
                    return (
                        <>
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name="search"/>
                                    {t("views:securityQuestions.noConfiguration")}
                                </Header>
                            </Segment>
                        </>
                    );
                }
            }
        };
        return (
            <SettingsSection header="Associated Accounts" description="Manage and Update Your Associated Accounts"
                             isEdit={showAddView} actionTitle="Add" onClick={this.handleShowView}>
                <Transition visible={this.state.updateStatus} duration={500}>
                    <NotificationComponent {...other} onDismiss={this.handleDismiss} size="small"
                                           description={description} message={message}
                    />
                </Transition>
                <Divider hidden/>
                {addAccountForm()}
            </SettingsSection>
        );
    }
}

export const AssociatedAccountsPage = withTranslation()(AssociatedAccountsPageComponent);
