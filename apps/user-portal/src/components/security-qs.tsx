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
    List
} from "semantic-ui-react";
import { addSecurityQs, getSecurityQs, updateSecurityQs } from "../actions/profile";
import { SettingsSectionIcons } from "../configs";
import { createEmptyChallenge } from "../models/challenges";
import { NotificationActionPayload } from "../models/notifications";
import { EditSection } from "./edit-section";
import { SettingsSection } from "./settings-section";

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
        const { t, onNotificationFired } = this.props;
        const {challenges} = this.state;
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
                            isEdit: !this.state.isEdit,
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

    public render() {
        const { t } = this.props;
        const {challenges} = this.state;
        const listItems = () => {
            if (challenges.answers && (challenges.answers.length > 0) && (!this.state.isEdit)) {
                return (
                    <List divided verticalAlign="middle" className="main-content-inner">
                        {
                            challenges.answers.map((answer) => {
                                return (
                                    <List.Item className="inner-list-item">
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 16 } className="first-column">
                                                    <List.Content>{ answer.question }</List.Content>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Item>
                                );
                            })
                        }
                    </List>
                );
            } else if (this.state.isEdit) {
                if (challenges.questions && (challenges.questions.length > 0)) {
                    return (
                        <EditSection>
                            <Form onSubmit={ this.handleSave }>
                                <Grid>
                                    {
                                        challenges.questions.map((questionSet, index) => (
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 4 }>
                                                    { t("common:challengeQuestionNumber", {number: index + 1 }) }
                                                </Grid.Column>
                                                <Grid.Column width={ 12 }>
                                                    <Form.Field>
                                                        <label>
                                                            { t("views:securityQuestions.forms.securityQuestionsForm." +
                                                                "inputs.question.label") }
                                                        </label>
                                                        <Dropdown
                                                            name={ questionSet.questionSetId }
                                                            selection
                                                            placeholder={
                                                                t("views:securityQuestions.forms." +
                                                                    "securityQuestionsForm.inputs.question.placeholder")
                                                            }
                                                            onChange={ this.handleDropdownChange }
                                                            options={
                                                                questionSet.questions.map((ques, i) => {
                                                                    return {
                                                                        key: i,
                                                                        text: ques.question,
                                                                        value: ques
                                                                    };
                                                                })
                                                            }
                                                        />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>
                                                            { t("views:securityQuestions.forms.securityQuestionsForm" +
                                                                ".inputs.answer.label") }
                                                        </label>
                                                        <Form.Input
                                                            required
                                                            id={ questionSet.questionSetId }
                                                            placeholder={
                                                                t("views:securityQuestions.forms." +
                                                                    "securityQuestionsForm.inputs.answer.placeholder")
                                                            }
                                                            onChange={ this.handleInputChange }/>
                                                    </Form.Field>
                                                </Grid.Column>
                                            </Grid.Row>
                                        ))
                                    }
                                    <Divider hidden/>
                                    <Grid.Row columns={ 2 }>
                                        { /* TODO: Find a better way to offset grid */ }
                                        <Grid.Column width={ 4 }>{" "}</Grid.Column>
                                        <Grid.Column width={ 12 }>
                                            <Button type="submit" primary>
                                                { t("common:save") }
                                            </Button>
                                            <Button
                                                className="link-button"
                                                onClick={ this.handleEdit }
                                            >
                                                { t("common:cancel") }
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </EditSection>
                    );
                }
            }
        };
        return (
            <>
                <SettingsSection
                    contentPadding={ false }
                    header={ t("views:securityQuestions.title") }
                    description={ t("views:securityQuestions.subTitle") }
                    icon={ SettingsSectionIcons.securityQuestions }
                    iconSize="auto"
                    iconStyle="colored"
                    iconFloated="right"
                    showAction={ !this.state.isEdit }
                    actionTitle={
                        (challenges.answers && (challenges.answers.length > 0))
                            ? t("views:securityQuestions.actionTitles.change")
                            : t("views:securityQuestions.actionTitles.configure")
                    }
                    onActionClick={ this.handleEdit }
                >
                    {listItems()}
                </SettingsSection>
            </>);
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

export const SecurityQuestionsComponent = withTranslation()(SecurityQuestionsComponentInner);
