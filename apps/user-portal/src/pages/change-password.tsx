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
import { Button, Container, Form } from "semantic-ui-react";
import { updatePassword } from "../actions/profile";
import { InnerPageLayout } from "../layouts";

interface State {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string
}
interface Props {}

export class ChangePasswordPage extends React.Component<Props, State> {
    public state = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    };

    public handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        { name, value }: { name: string; value: string }
    ) => {
        // `as Pick<State, keyof State>` was used to silent the linter warning
        this.setState({ [name]: value } as Pick<State, "currentPassword" | "newPassword" | "confirmPassword">);
    }

    public handleSubmit = () => {
        const { currentPassword, newPassword } = this.state;
        updatePassword(currentPassword, newPassword)
            .then((response) => {
                console.log("res", response);
            })
            .catch((error) => {
                console.log("err", error);
                console.log("err", error.response);
            });
    }

    public render() {
        const { handleSubmit, handleInputChange } = this;
        return (
            <InnerPageLayout pageTitle="Change Password" pageDescription="Change and modify the existing password">
                <Container>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            name="currentPassword"
                            label="Current password"
                            placeholder="Current password"
                            type="password"
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            name="newPassword"
                            label="New password"
                            placeholder="New password"
                            type="password"
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Input
                            name="confirmPassword"
                            label="Confirm new password"
                            placeholder="Confirm new password"
                            type="password"
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <Button primary type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </InnerPageLayout>
        );
    }
}
