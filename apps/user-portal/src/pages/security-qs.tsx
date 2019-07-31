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
import { Container, Dropdown, Form, Grid, Header, Segment } from "semantic-ui-react";
import { getSecurityQs } from "../actions/profile";
import { InnerPageLayout } from "../layouts";
import { createEmptyChallenge } from "../models/challenges";

export class SecurityQsPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = createEmptyChallenge();
    }

    public componentWillMount() {
        if (!this.state.isInit) {
            getSecurityQs()
                .then((response) => {
                    this.setSecurityDetails(response);
                }
            );
        }
    }

    public handleEdit = () => {
        this.setState({isEdit: true});
    }

    public render() {

        const options = [];

        this.state.questions.map((question) => {
        question.questions.map((ques) => {
            options.push({
                    key: ques.question,
                    text: ques.question,
                    value: ques.question
                });
            });
        });

        const listItems = () => {
            if (this.state.answers && (this.state.answers.length > 0) && (!this.state.isEdit)) {
                return this.state.answers.map((answer) => {
                    return <div>
                        <br />
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <label>Challenge Question</label>
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <label>{answer.question}</label>
                                </Grid.Column>
                                <Grid.Column>
                                    <a onClick={this.handleEdit}><i className="edit"/>Edit</a>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid><br /><br /></div>;
                });
            } else if (this.state.answers && (this.state.answers.length > 0) && (this.state.isEdit)) {
                if (this.state.questions && (this.state.questions.length > 0)) {
                return this.state.questions.map((question) => {
                    return <div>
                        <br />
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <label>Challenge Question</label>
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Dropdown selection fluid placeholder="Select a Question" options={options}/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <label>Your Answer</label>
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <input />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid><br /><br /></div>;

                });
            }
        } else if ((this.state.answers && this.state.answers.length === 0)) {
            if (this.state.questions && (this.state.questions.length > 0)) {
            return this.state.questions.map((question) => {
                return <div>
                    <br />
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <label>Challenge Question</label>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Dropdown selection fluid placeholder="Select a Question" options={options}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <label>Your Answer</label>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <input />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid><br /><br /></div>;
            });
        }
            } else {
                return null;
            }
        };

        return (
            <InnerPageLayout
            pageTitle="Security Questions"
            pageDescription="Manage Your Account Recovery Challenge Questions"
            >
                <Container>
                    <Segment>
                    {listItems()}
                    </Segment>
                </Container>
            </InnerPageLayout>
        );
    }

    private setSecurityDetails(response) {
        this.setState({
            answers: response[1],
            isInit: true,
            questions: response[0]
        });
    }
}
