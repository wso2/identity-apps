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

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Grid,
    List,
    Icon
} from "semantic-ui-react";
import { addSecurityQs, getSecurityQs, updateSecurityQs } from "../../../api";
import { AccountRecoveryIcons } from "../../../configs";
import {
    createEmptyChallenge,
    QuestionsInterface,
    QuestionSetsInterface,
    AnswersInterface,
    ChallengesQuestionsInterface,
    Notification
} from "../../../models";
import { ThemeIcon, EditSection, FormWrapper } from "../../shared";

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
            getSecurityQs()
                .then((response) => {
                    setSecurityDetails(response);
                });
        }
    }, []);

    useEffect(() => {
        initModel();
    }, [challenges]);

    /**
     * The following method initialises an array in the state with all the
     * question set ids of the questions fetched from the api.
     */
    const initModel = () => {
        const challengesCopy: ChallengesQuestionsInterface[] = [];

        challenges.questions.map((question: QuestionSetsInterface) => {
            let answer = challenges.answers && challenges.answers.length > 0
                ? findAnswer(question.questionSetId)
                : null;

            let questionInSet = answer
                ? findQuestion(question.questionSetId, question.questions)
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
        setChallengeQuestions(challengesCopy);
    }

    /**
     * The following method handles the onClick event of the change button
     */
    const handleEdit = (question: string | number, index:number) => {
        setIsEdit(question);
        setQuestionIndex(index);
    }

    /**
     * The following method handles the onClick event of the save button
     * A notification will be displayed upon the submit of the request depending
     * on the status of the response
     */
    const handleSave = (values: Map<string, string | string[]>) => {
        const data: ChallengesQuestionsInterface[] = [...challengeQuestions];

        values.forEach((value, key) => {
            if (key.includes("question")) {
                let questionSetId = key.split(" ")[1];
                let challenge = challenges.questions.find((challenge) => {
                    return challenge.questionSetId === questionSetId;
                });

                let chosenQuestion = challenge.questions.find((question) => {
                    return question.questionId === value;
                });

                data.forEach((question) => {
                    question.questionSetId === questionSetId
                        ? question.challengeQuestion = { ...chosenQuestion }
                        : null;
                });
            }
            if (key.includes("answer")) {
                let questionSetId = key.split(" ")[1];
                data.forEach((question) => {
                    question.questionSetId === questionSetId
                        ? question.answer = value.toString()
                        : null;
                });
            }

        })

        if (challenges.answers && (challenges.answers.length > 0) && (isEdit != -1)) {
            updateSecurityQs(data)
                .then((response) => {
                    if (response.status === 200) {
                        getSecurityQs()
                            .then((res) => {
                                setSecurityDetails(res);
                            });
                        setIsEdit(-1);

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
                                setSecurityDetails(response);
                            });

                        setIsEdit(-1);

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
    * Set the fetched security questions and answers to the state
    * @param response
    */
    const setSecurityDetails = (response) => {
        setIsInit(true);
        setChallenges({
            answers: [...response[1]],
            questions: [...response[0]],
            options: [],
            isInit: false,
            isEdit: false
        });
    }

    /**
     * This function returns the question object for a saved answer
     * @param {string} questionSetId
     * @param {QuestionsInterface[]} questions
     * 
     * @returns {QuestionsInterface} question
     */
    const findQuestion = (
        questionSetId: string,
        questions: QuestionsInterface[]
    ): QuestionsInterface => {
        let answer: AnswersInterface = challenges.answers.find((answer) => {
            return answer.questionSetId === questionSetId;
        });

        let question: QuestionsInterface = questions.find((question) => {
            return question.question === answer.question;
        });

        return question;
    }

    /**
     * This function returns the saved answer for a questionSet
     * @param {string} questionSetId
     * @returns {AnswersInterface} answer
     */
    const findAnswer = (questionSetId: string): AnswersInterface => {
        let answer: AnswersInterface = challenges.answers.find((answer: AnswersInterface) => {
            return answer.questionSetId === questionSetId;
        });

        return answer;
    }

    /**
     * This function returns the question and answer chosen by the user for a questionSetId
     * from challengeQuestions
     * @param {string} questionSetId
     * 
     * @return {ChallengesQuestionsInterface} question
     */
    const findChosenQuestionFromChallengeQuestions = (questionSetId: string) => {

        let question: ChallengesQuestionsInterface = challengeQuestions.find(
            (question: ChallengesQuestionsInterface) => {
                return question.questionSetId === questionSetId;
            });

        return question;
    }

    /**
     * This returns an array of form fields to be passed as a prop to Form Wrapper
     */
    const generateFormFields = () => {
        let formFields = [];
        challenges.questions.forEach((
            questionSet: QuestionSetsInterface,
            index: number
        ) => {
            if (isEdit === 0 || (isEdit === questionSet.questionSetId)) {
                formFields.push(
                    {
                        label: t("views:securityQuestions.forms.securityQuestionsForm." +
                            "inputs.question.label"),
                        type: "dropdown",
                        name: "question " + questionSet.questionSetId,
                        value: findChosenQuestionFromChallengeQuestions(
                            questionSet.questionSetId
                        ).challengeQuestion.questionId,
                        children: questionSet.questions.map((ques, i) => {
                            return {
                                key: i,
                                text: ques.question,
                                value: ques.questionId
                            };
                        }),
                        required: true,
                        requiredErrorMessage: "",
                        placeholder:
                            t("views:securityQuestions.forms." +
                                "securityQuestionsForm.inputs.question.placeholder")
                    },
                    {
                        type: "text",
                        name: "answer " + questionSet.questionSetId,
                        placeholder: t("views:securityQuestions.forms." +
                            "securityQuestionsForm.inputs.answer.placeholder"),
                        required: true,
                        requiredErrorMessage: "",
                        validation: () => { },
                        label: t("views:securityQuestions.forms.securityQuestionsForm" +
                            ".inputs.answer.label"),
                    },
                )
            }
        });
        formFields=formFields.concat([
            {
                type: "divider",
                hidden: true
            },
            {
                type: "submit",
                value: t("common:save").toString(),
                size: "small",
            },
            {
                type: "button",
                size: "small",
                className: "link-button",
                value: t("common:cancel").toString(),
                onClick: () => handleEdit(-1,-1)
            }
        ]);
        return formFields;
    }

    const listItems = () => {
        if (challenges.questions && (challenges.questions.length > 0) && isEdit == -1) {
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
                                        onClick={() => { handleEdit(0,0) }}
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
                        <List
                            divided
                            verticalAlign="middle"
                            style={{ paddingTop: 0, width: "100%" }}
                            className="main-content-inner"
                        >
                            {
                                challenges.answers.map((answer, index) => {
                                    return (
                                        <List.Item key={index} className="inner-list-item">
                                            <Grid padded>
                                                <Grid.Row columns={3}>
                                                    <Grid.Column width={2}>
                                                    </Grid.Column>
                                                    <Grid.Column width={9} className="first-column">
                                                        <List.Content>{answer.question}</List.Content>
                                                    </Grid.Column>
                                                    <Grid.Column width={5} className="last-column">
                                                        <List.Content floated="right">
                                                            <Icon
                                                                link
                                                                onClick={() => {
                                                                    handleEdit(answer.questionSetId, index)
                                                                }}
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
        } else if (isEdit != -1) {
            if (challenges.questions && (challenges.questions.length > 0)) {
                let formFields = generateFormFields();
                let endIndex = formFields.length;
                let startIndex = endIndex - 2;
                return (
                    <EditSection>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column width={4}>
                                    {t("common:challengeQuestionNumber", { number: questionIndex+ 1 })}
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <FormWrapper
                                        formFields={generateFormFields()}
                                        groups={
                                            [
                                                {
                                                    startIndex: startIndex,
                                                    endIndex: endIndex,
                                                    style: "inline"
                                                }
                                            ]
                                        }
                                        onSubmit={(values) => {
                                            handleSave(values);
                                        }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </EditSection>
                );
            }
        }
    };

    return (<>{listItems()}</>);
}
