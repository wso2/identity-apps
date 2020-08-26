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

export interface QuestionsInterface {
    question: string;
    questionId: string;
    locale: string;
}

export interface QuestionSetsInterface {
    questionSetId: string;
    questions: QuestionsInterface[];
}

export interface AnswersInterface {
    answer: string;
    question: string;
    questionSetId: string;
}

export interface ChallengesQuestionsInterface {
    answer: string;
    challengeQuestion: QuestionsInterface;
    questionSetId: string;
}

export interface ChallengesInterface {
    questions: QuestionSetsInterface[];
    answers: AnswersInterface[];
    isEdit: boolean;
    isInit: boolean;
    options: string[];
}

export const createEmptyChallenge = (): ChallengesInterface => ({
    answers: [],
    isEdit: false,
    isInit: false,
    options: [],
    questions: []
});
