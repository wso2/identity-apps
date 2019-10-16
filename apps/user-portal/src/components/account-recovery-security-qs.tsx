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
    Divider,
    Dropdown,
    Form,
    Grid,
    List,
    Icon
} from "semantic-ui-react";
import { addSecurityQs, getSecurityQs, updateSecurityQs } from "../actions/profile";
import { AccountRecoveryIcons } from "../configs";
import { createEmptyChallenge } from "../models/challenges";
import { NotificationActionPayload } from "../models/notifications";
import { EditSection } from "./edit-section";
import { ThemeIcon } from ".";

interface ComponentProps extends WithTranslation {
    onNotificationFired: (notification: NotificationActionPayload) => void;
}

// TODO: Refactor with Hooks.
/**
 * The security questions section of the user
 */
class SecurityQuestionsComponentInner extends React.Component<ComponentProps, any> {
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
            isEdit: -1,
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
        const { challenges, challengeQuestions } = this.state;
        const challengesCopy = [{ ...challengeQuestions }];

        challenges.questions.map((question) => {
            let answer = challenges.answers && challenges.answers.length > 0
                ? this.findAnswer(question.questionSetId)
                : null;

            let questionInSet = answer
                ? this.findQuestion(question.questionSetId, question.questions)
                : null;

            challengesCopy.push(
                {
                    questionSetId: question.questionSetId,
                    challengeQuestion: {
                        locale: answer ? questionInSet.locale : "",
                        question: answer ? questionInSet.question : "",
                        questionId: answer ? questionInSet.questionId : ""
                    },
                    answer: answer ? answer.answer : ""
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
     * @param questionSetId
     */
    public handleInputChange = (event, questionSetId) => {
        const { challengeQuestions } = this.state;

        challengeQuestions.forEach((question) => {
            question.questionSetId === questionSetId
                ? question.answer = event.target.value
                : null;
        })
        this.setState({
            challengeQuestions: challengeQuestions
        });
    }

    /**
     * The following method handles the onClick event of the change button
     */
    public handleEdit = (question) => {
        this.setState({ isEdit: question });
    }

    /**
     * The following function handles the change event 
     */
    public handleDropdownChange = (data, questionSetId) => {
        const { challengeQuestions, challenges } = this.state;

        let challenge = challenges.questions.find((challenge) => {
            return challenge.questionSetId === questionSetId;
        });

        let chosenQuestion = challenge.questions.find((question) => {
            return question.questionId === data.value;
        })
        challengeQuestions.forEach((question) => {
            question.questionSetId === questionSetId
                ? question.challengeQuestion = { ...chosenQuestion }
                : null;
        })
        this.setState({
            challengeQuestions: challengeQuestions
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

    /**
     * The following method handles the onClick event of the save button
     * A notification will be displayed upon the submit of the request depending
     * on the status of the response
     */
    public handleSave = () => {
        const { t, onNotificationFired } = this.props;
        const { challenges } = this.state;
        const data = this.state.challengeQuestions;

        if (challenges.answers && (challenges.answers.length > 0) && (this.state.isEdit != -1)) {
            updateSecurityQs(data)
                .then((response) => {
                    if (response.status === 200) {
                        getSecurityQs()
                            .then((res) => {
                                this.setSecurityDetails(res);
                                this.initModel();
                            });
                        this.setState({
                            isEdit: -1,
                            updateStatus: true
                        });
                        onNotificationFired({
                            description: t(
                                "views:securityQuestions.notification.updateQuestions.success.description"
                            ),
                            message: t(
                                "views:securityQuestions.notification.updateQuestions.success.message"
                            ),
                            otherProps: {
                                positive: true
                            },
                            visible: true
                        });
                    } else {
                        this.setState({
                            updateStatus: true
                        });
                        onNotificationFired({
                            description: t(
                                "views:securityQuestions.notification.updateQuestions.error.description"
                            ),
                            message: t(
                                "views:securityQuestions.notification.updateQuestions.error.message"
                            ),
                            otherProps: {
                                negative: true
                            },
                            visible: true
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
                            isEdit: -1,
                            updateStatus: true
                        });
                        onNotificationFired({
                            description: t(
                                "views:securityQuestions.notification.addQuestions.success.description"
                            ),
                            message: t(
                                "views:securityQuestions.notification.addQuestions.success.message"
                            ),
                            otherProps: {
                                positive: true
                            },
                            visible: true
                        });
                    } else {
                        this.setState({
                            updateStatus: true
                        });
                        onNotificationFired({
                            description: t(
                                "views:securityQuestions.notification.addQuestions.error.description"
                            ),
                            message: t(
                                "views:securityQuestions.notification.addQuestions.error.message"
                            ),
                            otherProps: {
                                negative: true
                            },
                            visible: true
                        });
                    }
                });
        }
    }

    /**
     * This function returns the question object for a saved answer
     * @param {String} questionSetId
     * @param questions
     * 
     * @returns question
     */
    public findQuestion(questionSetId: String, questions: any[]) {
        const { challenges } = this.state;

        let answer = challenges.answers.find((answer) => {
            return answer.questionSetId === questionSetId;
        });

        let question = questions.find((question) => {
            return question.question === answer.question;
        });

        return question;
    }

    /**
     * This function returns the saved answer for a questionSet
     * @param {String} questionSetId
     * @returns answer
     */
    public findAnswer(questionSetId: String) {
        const { challenges } = this.state;

        let answer = challenges.answers.find((answer) => {
            return answer.questionSetId === questionSetId;
        });

        return answer;
    }

    /**
     * This function returns the question and answer chosen by the user for a questionSetId
     * from challengeQuestions
     * @param {String} questionSetId
     */
    public findChosenQuestionFromChallengeQuestions(questionSetId: String) {
        const { challengeQuestions } = this.state;

        let question = challengeQuestions.find((question) => {
            return question.questionSetId === questionSetId;
        });

        return question;
    }

    public render() {
        const { t } = this.props;
        const { challenges } = this.state;

        const renderEdit = () => {
            return (
                <EditSection>
                    <Form onSubmit={this.handleSave}>
                        <Grid>
                            {
                                challenges.questions.map((questionSet, index) => {
                                    return this.state.isEdit===0 || (this.state.isEdit===questionSet.questionSetId)
                                        ? (
                                            <Grid.Row key={index} columns={2}>
                                                <Grid.Column width={4}>
                                                    {t("common:challengeQuestionNumber", { number: index + 1 })}
                                                </Grid.Column>
                                                <Grid.Column width={12}>
                                                    <Form.Field>
                                                        <label>
                                                            {t("views:securityQuestions.forms.securityQuestionsForm." +
                                                                "inputs.question.label")}
                                                        </label>
                                                        <Dropdown
                                                            name={questionSet.questionSetId}
                                                            selection
                                                            placeholder={
                                                                t("views:securityQuestions.forms." +
                                                                    "securityQuestionsForm.inputs.question.placeholder")
                                                            }
                                                            onChange={(e, data) => { this.handleDropdownChange(data, questionSet.questionSetId) }}
                                                            options={
                                                                questionSet.questions.map((ques, i) => {
                                                                    return {
                                                                        key: i,
                                                                        text: ques.question,
                                                                        value: ques.questionId
                                                                    };
                                                                })
                                                            }
                                                            value={this.findChosenQuestionFromChallengeQuestions(
                                                                questionSet.questionSetId
                                                            ).challengeQuestion.questionId}
                                                        />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>
                                                            {t("views:securityQuestions.forms.securityQuestionsForm" +
                                                                ".inputs.answer.label")}
                                                        </label>
                                                        <Form.Input
                                                            required
                                                            id={questionSet.questionSetId}
                                                            placeholder={
                                                                t("views:securityQuestions.forms." +
                                                                    "securityQuestionsForm.inputs.answer.placeholder")
                                                            }

                                                            onChange={(e) => { this.handleInputChange(e, questionSet.questionSetId) }} />
                                                    </Form.Field>
                                                </Grid.Column>
                                            </Grid.Row>
                                        )
                                        :null;
                                })
                            }
                            <Divider hidden />
                            <Grid.Row columns={2}>
                                { /* TODO: Find a better way to offset grid */}
                                <Grid.Column width={4}>{" "}</Grid.Column>
                                <Grid.Column width={12}>
                                    <Button type="submit" primary>
                                        {t("common:save")}
                                    </Button>
                                    <Button
                                        className="link-button"
                                        onClick={()=>{this.handleEdit(-1)}}
                                    >
                                        {t("common:cancel")}
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </EditSection>
            );
        }
        const listItems = () => {
            if (challenges.questions && (challenges.questions.length > 0) && this.state.isEdit==-1) {
                return (
                    <Grid padded>
                        <Grid.Row columns={2}>
                            <Grid.Column width={11} className="first-column">
                                <List.Content floated="left">
                                    <ThemeIcon
                                        icon={AccountRecoveryIcons.securityQuestions}
                                        size="mini"
                                        twoTone
                                        transparent
                                        square
                                        rounded
                                        relaxed
                                    />
                                </List.Content>
                                <List.Content>
                                    <List.Header>{t("views:securityQuestions.title")}</List.Header>
                                    <List.Description>
                                        {t("views:securityQuestions.description")}
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={5} className="last-column">
                                <List.Content floated="right">
                                    {challenges && challenges.answers.length > 0
                                        ? null
                                        : <Icon
                                            link
                                            onClick={() => { this.handleEdit(0) }}
                                            className="list-icon"
                                            size="small"
                                            color="grey"
                                            name="plus"
                                        />
                                    }
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{ paddingTop: 0 }}>
                            <List divided verticalAlign="middle" style={{ paddingTop: 0, width: "100%" }} className="main-content-inner">
                                {
                                    challenges.answers.map((answer, index) => {
                                        return (
                                            <List.Item key={index} className="inner-list-item">
                                                <Grid padded>
                                                    <Grid.Row columns={3}>
                                                        <Grid.Column width={1}>
                                                        </Grid.Column>
                                                        <Grid.Column width={9} className="first-column">
                                                            <List.Content>{answer.question}</List.Content>
                                                        </Grid.Column>
                                                        <Grid.Column width={6} className="last-column">
                                                            <List.Content floated="right">
                                                                <Icon
                                                                    link
                                                                    onClick={() => { this.handleEdit(answer.questionSetId) }}
                                                                    className="list-icon"
                                                                    size="small"
                                                                    color="grey"
                                                                    name="pencil alternate"
                                                                />
                                                            </List.Content>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </List.Item>
                                        );
                                    })
                                }
                            </List>
                        </Grid.Row>
                    </Grid>
                );
            } else if (this.state.isEdit != -1) {
                if (challenges.questions && (challenges.questions.length > 0)) {
                    return (
                        renderEdit()
                    );
                }
            }
        };

        return (<>{listItems()}</>);

    }

    /**
     * Set the fetched security questions and answers to the state
     * @param response
     */
    private setSecurityDetails(response) {
        const { challenges } = this.state;
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

export const SecurityQuestionsComponent = withTranslation()(SecurityQuestionsComponentInner);
