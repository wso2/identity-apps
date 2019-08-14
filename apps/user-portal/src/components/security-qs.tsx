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
    Container, Dimmer,
    Divider,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    List, Loader,
    Message,
    Segment, Transition
} from "semantic-ui-react";
import { addSecurityQs, getSecurityQs, updateSecurityQs } from "../actions/profile";
import { createEmptyChallenge } from "../models/challenges";
import { NotificationComponent } from "./notification";

/**
 * The security questions section of the user
 */
class SecurityQsComponentInner extends React.Component<WithTranslation, any> {
    /**
     * constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            challengeQuestions: {
                questionSetId: "string",
                challengeQuestion: {
                    locale: "",
                    question: "",
                    questionId: ""
                }
            },
            challenges: createEmptyChallenge(),
            isConfigured: false,
            isEdit: false,
            isInit: false,
            isLoaderActive: false,
            notification: {
                description: "",
                message: "",
                other: {
                    error: false,
                    success: false
                }
            },
            updateStatus: false
        };
    }

    public componentWillMount() {
        if (!this.state.isInit) {
            getSecurityQs()
                .then((response) => {
                    this.setSecurityDetails(response);
                    this.initModel();
                });
        }
    }

    /**
     * The following method initialises an array in the state with all the
     * question set ids of the questions fetched from the api.
     */
    public initModel = () => {
        const {challenges, challengeQuestions} = this.state;
        const challengesCopy = [{...challengeQuestions}];
        challenges.questions.map((question) => {
                challengesCopy.push(
                    {
                    questionSetId: question.questionSetId,
                    challengeQuestion: {
                        locale: "",
                        question: "",
                        questionId: ""
                    },
                    answer: ""
                });
        });

        challengesCopy.splice(0, 1);
        this.setState({
            challengeQuestions: challengesCopy
        });
    }

    /**
     * The following method handles the change of state of the input fields
     * The name of the event target will be used to retrieve the set of questions
     * with a specific question set id
     * @param event
     * @param data
     */
    public handleInputChange = (event, data) => {
        let result;
        const{challengeQuestions} = this.state;
        result = challengeQuestions.find((setObj) => (setObj.questionSetId === data.name));
        result.answer = data.value;
    }

    /**
     * The following method handles the onClick event of the change button
     */
    public handleEdit = () => {
        this.setState({ isEdit: !this.state.isEdit });
    }

    public handleDropdownChange = (event, data) => {
        let result;
        const {challengeQuestions} = this.state;
        result = challengeQuestions.find((setObj) => (setObj.questionSetId === data.name));
        result.challengeQuestion = data.value;
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
     * A notification will be displayed upon the submit of the request depending
     * on the status of the response
     */
    public handleSave = () => {
        const { t } = this.props;
        const {challenges, notification} = this.state;
        const data = this.state.challengeQuestions;

        if (challenges.answers && (challenges.answers.length > 0) && (this.state.isEdit)) {
            updateSecurityQs(data)
                .then((response) => {
                    if (response.status === 200) {
                        getSecurityQs()
                            .then((res) => {
                                this.setSecurityDetails(res);
                                this.initModel();
                            });
                        this.setState({
                            isEdit: !this.state.isEdit,
                            notification: {
                                ...notification,
                                description: t(
                                    "views:securityQuestions.notification.updateQuestions.success.description"
                                ),
                                message: t(
                                    "views:securityQuestions.notification.updateQuestions.success.message"
                                ),
                                other: {
                                    success: true
                                }
                            },
                            updateStatus: true
                        });
                    } else {
                        this.setState({
                            notification: {
                                ...notification,
                                description: t(
                                    "views:securityQuestions.notification.updateQuestions.error.description"
                                ),
                                message: t(
                                    "views:securityQuestions.notification.updateQuestions.error.message"
                                ),
                                other: {
                                    error: true
                                }
                            },
                            updateStatus: true
                        });
                    }
                });
        } else {
            addSecurityQs(data)
                .then((status) => {
                    if (status === 201) {
                        getSecurityQs()
                            .then((response) => {
                                this.setSecurityDetails(response);
                                this.initModel();
                            });
                        this.setState({
                            isEdit: !this.state.isEdit,
                            notification: {
                                ...notification,
                                description: t(
                                    "views:securityQuestions.notification.addQuestions.success.description"
                                ),
                                message: t(
                                    "views:securityQuestions.notification.addQuestions.success.message"
                                ),
                                other: {
                                    success: true
                                }
                            },
                            updateStatus: true
                        });
                    } else {
                        this.setState({
                            notification: {
                                ...notification,
                                description: t(
                                    "views:securityQuestions.notification.addQuestions.error.description"
                                ),
                                message: t(
                                    "views:securityQuestions.notification.addQuestions.error.message"
                                ),
                                other: {
                                    error: true
                                }
                            },
                            updateStatus: true
                        });
                    }
                });
        }
    }

    public render() {
        const { t } = this.props;
        const {challenges, notification} = this.state;
        const {description, message, other} = notification;
        const displayButton = () => {
            if (this.state.isEdit) {
                return (<div>
                    <Divider/>
                    <Button id="lastNameEdit" secondary floated="right" onClick={this.handleEdit}>
                        {t("common:cancel")}
                    </Button>
                    <Button id="lastName" primary onClick={this.handleSave} floated="right">
                        {t("common:save")}
                    </Button>
                </div>);
            } else if (challenges.answers && (challenges.answers.length > 0) && (!this.state.isEdit)) {
                return (<div>
                    <Button primary onClick={this.handleEdit} floated="left">
                        {t("common:change")}
                    </Button>
                </div>);
            } else {
                return null;
            }
        };
        const listItems = () => {
            if (challenges.answers && (challenges.answers.length > 0) && (!this.state.isEdit)) {
                return challenges.answers.map((answer) => {
                    return (
                    <>
                        <Divider hidden />
                        <Dimmer active={false} inverted>
                            <Loader>Loading</Loader>
                        </Dimmer>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                <List divided>
                                    <List.Item>
                                        <List.Content>
                                            <List.Header>{answer.question}</List.Header>
                                        </List.Content>
                                    </List.Item>
                                </List>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>);
                });
            } else if (this.state.isEdit) {
                if (challenges.questions && (challenges.questions.length > 0)) {
                    return challenges.questions.map((questionSet) => {
                        return (
                        <>
                        <Segment secondary padded>
                            <Divider hidden />
                            <Grid>
                                <Grid.Row>
                                <Grid.Column width={3}>
                                        <label>Challenge Question</label>
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <Dropdown
                                            name={questionSet.questionSetId}
                                            selection
                                            fluid
                                            placeholder="Select a Question"
                                            onChange={this.handleDropdownChange}
                                            options={
                                                questionSet.questions.map((ques, index) => {
                                                    return {
                                                        key: index,
                                                        text: ques.question,
                                                        value: ques
                                                    };
                                                })} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={3}>
                                        <label>Your Answer</label>
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <Form.Input
                                            required
                                            name={questionSet.questionSetId}
                                            fluid
                                            onChange={this.handleInputChange}/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Divider hidden />
                        </Segment>
                        </>);
                    });
                }
            } else {
                return (
                    <>
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                {t("views:securityQuestions.noConfiguration")}
                            </Header>
                            <Button primary onClick={this.handleEdit}>{t("common:configure")}</Button>
                        </Segment>
                    </>
                );
            }
        };
        return (
            <Container>
                <Header>{t("views:securityQuestions.title")}</Header>
                <Header.Subheader>{t("views:securityQuestions.subTitle")}</Header.Subheader>
                <Divider hidden/>
                <Transition visible={this.state.updateStatus} duration={500}>
                    <NotificationComponent {...other} onDismiss={this.handleDismiss} size="small"
                                           description={description} message={message}
                    />
                </Transition>
                <Grid>
                    <Grid.Column width={10}>
                        {listItems()}
                        <Divider hidden/>
                        {displayButton()}
                    </Grid.Column>
                </Grid>
            </Container>);
    }

    /**
     * Set the fetched security questions and answers to the state
     * @param response
     */
    private setSecurityDetails(response) {
        const {challenges} = this.state;
        this.setState({
            challenges: {
                ...challenges,
                answers: response[1],
                questions: response[0]
            },
            isInit: true
        });
    }
}

export const SecurityQsComponent = withTranslation()(SecurityQsComponentInner);
