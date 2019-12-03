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

import { Field, Forms } from "@wso2is/forms";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid, Icon, List } from "semantic-ui-react";
import { addSecurityQs, getSecurityQs, updateSecurityQs } from "../../../api";
import { AccountRecoveryIcons } from "../../../configs";
import {
    AnswersInterface,
    ChallengesQuestionsInterface,
    createEmptyChallenge,
    Notification,
    QuestionSetsInterface,
    QuestionsInterface,
} from "../../../models";
import { EditSection, ThemeIcon } from "../../shared";

/**
 * Prop types for SecurityQuestionsComponent
 */
interface SecurityQuestionsProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * The SecurityQuestionsComponent component in the AccountRecoveryComponent
 *
 * @param {SecurityQuestionsProps} props
 * @return {JSX.Element}
 */
export const SecurityQuestionsComponent: React.FunctionComponent<SecurityQuestionsProps> = (
    props: SecurityQuestionsProps
) => {
    const [challengeQuestions, setChallengeQuestions] = useState<ChallengesQuestionsInterface[]>();
    const [challenges, setChallenges] = useState(createEmptyChallenge());
    const [isEdit, setIsEdit] = useState<number | string>(-1);
    const [isInit, setIsInit] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(-1);
    const { onNotificationFired } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (!isInit) {
            getSecurityQs().then((response) => {
                setSecurityDetails(response);
            });
        }
    }, []);

    useEffect(() => {
        initModel();
    }, [challenges]);

    /**
     * The following method initializes an array in the state with all the
     * question set ids of the questions fetched from the api.
     */
    const initModel = () => {
        const challengesCopy: ChallengesQuestionsInterface[] = [];

        challenges.questions.forEach((question: QuestionSetsInterface) => {
            const answer =
                challenges.answers && challenges.answers.length > 0 ? findAnswer(question.questionSetId) : null;

            const questionInSet = answer ? findQuestion(question.questionSetId, question.questions) : null;

            challengesCopy.push({
                answer: answer ? answer.answer : "",
                challengeQuestion: {
                    locale: answer ? questionInSet.locale : "",
                    question: answer ? questionInSet.question : "",
                    questionId: answer ? questionInSet.questionId : ""
                },
                questionSetId: question.questionSetId
            });
        });
        setChallengeQuestions(challengesCopy);
    };

    /**
     * The following method handles the onClick event of the change button
     */
    const handleEdit = (question: string | number, index: number) => {
        setIsEdit(question);
        setQuestionIndex(index);
    };

    /**
     * This function is called when a notification on error should be fired
     * @param error
     */
    const fireNotificationOnError = (error: any) => {
        onNotificationFired({
            description: error && error.data && error.data.details
                ? t(
                    "views:components.accountRecovery.questionRecovery.notifications." +
                    "updateQuestions.error.description",
                    {
                        description: error.data.details
                    }
                )
                : t(
                    "views:components.accountRecovery.questionRecovery.notifications" +
                    ".updateQuestions.genericError.description"
                ),
            message: error && error.data && error.data.details
                ? t(
                    "views:components.accountRecovery.questionRecovery.notifications" +
                    ".updateQuestions.error.message"
                )
                : t(
                    "views:components.accountRecovery.questionRecovery.notifications" +
                    ".updateQuestions.genericError.message"
                ),
            otherProps: {
                negative: true
            },
            visible: true
        });
    };

    /**
     * The following method handles the onClick event of the save button
     * A notification will be displayed upon the submit of the request depending
     * on the status of the response
     */
    const handleSave = (values: Map<string, string | string[]>) => {
        const data: ChallengesQuestionsInterface[] = [...challengeQuestions];

        values.forEach((value, key) => {
            if (key.includes("question")) {
                const questionSetId = key.split(" ")[1];
                const challenge = challenges.questions.find((challengeParam) => {
                    return challengeParam.questionSetId === questionSetId;
                });

                const chosenQuestion = challenge.questions.find((question) => {
                    return question.questionId === value;
                });

                data.forEach((question) => {
                    if (question.questionSetId === questionSetId) {
                        question.challengeQuestion = { ...chosenQuestion };
                    }
                });
            }
            if (key.includes("answer")) {
                const questionSetId = key.split(" ")[1];
                data.forEach((question) => {
                    if (question.questionSetId === questionSetId) {
                        question.answer = value.toString();
                    }
                });
            }
        });

        if (challenges.answers && challenges.answers.length > 0 && isEdit !== -1) {
            updateSecurityQs(data).then((response) => {
                getSecurityQs().then((res) => {
                    setSecurityDetails(res);
                });
                setIsEdit(-1);

                onNotificationFired({
                    description: t(
                        "views:components.accountRecovery.questionRecovery.notifications" +
                        ".updateQuestions.success.description"
                    ),
                    message: t("views:components.accountRecovery.questionRecovery.notifications" +
                        ".updateQuestions.success.message"),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                });

            })
                .catch((error) => {
                    fireNotificationOnError(error);
                });
        } else {
            addSecurityQs(data).then((status) => {
                getSecurityQs().then((response) => {
                    setSecurityDetails(response);
                });

                setIsEdit(-1);

                onNotificationFired({
                    description: t(
                        "views:components.accountRecovery.questionRecovery.notifications" +
                        ".addQuestions.success.description"
                    ),
                    message: t("views:components.accountRecovery.questionRecovery.notifications" +
                        ".addQuestions.success.message"),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                });

            })
                .catch((error) => {
                    fireNotificationOnError(error);
                });
        }
    };

    /**
     * Set the fetched security questions and answers to the state
     * @param response
     */
    const setSecurityDetails = (response) => {
        setIsInit(true);
        setChallenges({
            answers: [...response[1]],
            isEdit: false,
            isInit: false,
            options: [],
            questions: [...response[0]]
        });
    };

    /**
     * This function returns the question object for a saved answer
     * @param {string} questionSetId
     * @param {QuestionsInterface[]} questions
     *
     * @returns {QuestionsInterface} question
     */
    const findQuestion = (questionSetId: string, questions: QuestionsInterface[]): QuestionsInterface => {
        const answer: AnswersInterface = challenges.answers.find((answerParam) => {
            return answerParam.questionSetId === questionSetId;
        });

        return questions.find((questionParam) => {
            return questionParam.question === answer.question;
        });
    };

    /**
     * This function returns the saved answer for a questionSet
     * @param {string} questionSetId
     * @returns {AnswersInterface} answer
     */
    const findAnswer = (questionSetId: string): AnswersInterface => {
        return challenges.answers.find((answerParam: AnswersInterface) => {
            return answerParam.questionSetId === questionSetId;
        });
    };

    /**
     * This function returns the question and answer chosen by the user for a questionSetId
     * from challengeQuestions
     * @param {string} questionSetId
     *
     * @return {ChallengesQuestionsInterface} question
     */
    const findChosenQuestionFromChallengeQuestions = (questionSetId: string) => {
        return challengeQuestions.find((questionParam: ChallengesQuestionsInterface) => {
            return questionParam.questionSetId === questionSetId;
        });
    };

    /**
     * This returns an array of form fields to be passed as a prop to Form Wrapper
     */
    const generateFormFields = () => {
        let formFields: ReactElement[] = [];

        challenges.questions.forEach((questionSet: QuestionSetsInterface, index: number) => {
            if (isEdit === 0 || isEdit === questionSet.questionSetId) {
                formFields.push(
                    <Grid.Row columns={ 2 } key={ index }>
                        <Grid.Column width={ 4 }>
                            <div>
                                { t("common:challengeQuestionNumber", { number: index + 1 }) }
                            </div>
                        </Grid.Column>
                        <Grid.Column width={ 12 }>
                            <Field
                                children={ questionSet.questions.map((ques, i) => {
                                    return {
                                        key: i,
                                        text: ques.question,
                                        value: ques.questionId
                                    };
                                }) }
                                label={ t(
                                    "views:components.accountRecovery.questionRecovery.forms.securityQuestionsForm" +
                                    ".inputs.question.label"
                                ) }
                                name={ "question " + questionSet.questionSetId }
                                placeholder={ t(
                                    "views:components.accountRecovery.questionRecovery.forms.securityQuestionsForm" +
                                    ".inputs.question.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "views:components.accountRecovery.questionRecovery.forms" +
                                    ".securityQuestionsForm" +
                                    ".inputs.question.validations.empty"
                                ) }
                                type="dropdown"
                                value={ findChosenQuestionFromChallengeQuestions(questionSet.questionSetId).
                                    challengeQuestion.questionId }
                            />
                            <Field
                                label={ t(
                                    "views:components.accountRecovery.questionRecovery.forms.securityQuestionsForm." +
                                    "inputs.answer.label"
                                ) }
                                name={ "answer " + questionSet.questionSetId }
                                placeholder={ t(
                                    "views:components.accountRecovery.questionRecovery.forms." +
                                    "securityQuestionsForm.inputs.answer.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "views:components.accountRecovery.questionRecovery.forms." +
                                    "securityQuestionsForm.inputs.answer.validations.empty"
                                ) }
                                type="text"
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        });
        formFields = formFields.concat([
            (
                <Grid.Row key={ formFields.length } columns={ 2 }>
                    <Grid.Column width={ 4 } />
                    <Grid.Column width={ 12 }>
                        <Form.Group inline={ true }>
                            <Field
                                size="small"
                                type="submit"
                                value={ t("common:save").toString() }
                            />
                            <Field
                                className="link-button"
                                onClick={ () => handleEdit(-1, -1) }
                                size="small"
                                type="button"
                                value={ t("common:cancel").toString() }
                            />
                        </Form.Group>
                    </Grid.Column>
                </Grid.Row>
            )
        ]);
        return formFields;
    };

    const listItems = () => {
        if (challenges.questions && challenges.questions.length > 0 && isEdit === -1) {
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 11 } className="first-column">
                            <List.Content floated="left">
                                <ThemeIcon
                                    icon={ AccountRecoveryIcons.securityQuestions }
                                    size="mini"
                                    twoTone={ true }
                                    transparent={ true }
                                    square={ true }
                                    rounded={ true }
                                    relaxed={ true }
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>
                                    { t("views:components.accountRecovery.questionRecovery.heading") }
                                </List.Header>
                                <List.Description>
                                    { t("views:components.accountRecovery.questionRecovery.descriptions.add") }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 5 } className="last-column">
                            <List.Content floated="right">
                                { challenges && challenges.answers.length > 0 ? null : (
                                    <Icon
                                        link={ true }
                                        onClick={ () => {
                                            handleEdit(0, 0);
                                        } }
                                        className="list-icon"
                                        size="small"
                                        color="grey"
                                        name="plus"
                                    />
                                ) }
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={ { paddingTop: 0 } }>
                        <List
                            divided={ true }
                            verticalAlign="middle"
                            style={ { paddingTop: 0, width: "100%" } }
                            className="main-content-inner settings-section-inner-list"
                        >
                            { challenges.answers.map((answer, index) => {
                                return (
                                    <List.Item key={ index } className="inner-list-item">
                                        <Grid padded={ true }>
                                            <Grid.Row columns={ 2 } className="first-column">
                                                <Grid.Column width={ 11 } className="first-column">
                                                    <List.Header className="with-left-padding">
                                                        <Icon
                                                            floated="right"
                                                            className="list-icon"
                                                            size="small"
                                                            color="grey"
                                                            name="dot circle outline"
                                                        />
                                                        { answer.question }
                                                    </List.Header>
                                                </Grid.Column>
                                                <Grid.Column width={ 5 } className="last-column">
                                                    <List.Content floated="right">
                                                        <Icon
                                                            link={ true }
                                                            onClick={ () => {
                                                                handleEdit(answer.questionSetId, index);
                                                            } }
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
                            }) }
                        </List>
                    </Grid.Row>
                </Grid>
            );
        } else if (isEdit !== -1) {
            if (challenges.questions && challenges.questions.length > 0) {
                const formFields = generateFormFields();
                return (
                    <EditSection>
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    <Forms
                                        onSubmit={ (values) => {
                                            handleSave(values);
                                        } }
                                    >
                                        <Grid>{ formFields }</Grid>
                                    </Forms>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </EditSection>
                );
            }
        }
    };

    return <>{ listItems() }</>;
};

/**
 * This component wraps the save and submit buttons of the form in a Grid
 * @param props
 */
const WrapButtons: React.FunctionComponent = (props): JSX.Element => {
    return (
        <Grid>
            <Grid.Row column={ 2 }>
                <Grid.Column width={ 4 } />
                <Grid.Column width={ 12 }>
                    <Form.Group inline={ true }>{ props.children }</Form.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
