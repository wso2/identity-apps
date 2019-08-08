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
import { Button, Container, Form, Transition } from "semantic-ui-react";
import { updatePassword } from "../actions/profile";
import { NotificationComponent } from "../components";
import { InnerPageLayout } from "../layouts";

interface State {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    notification: NotifcationStateInterface;
    touched: InputTouchedStateInterface;
    errors: InputErrorStateInterface;
    hasErrors: boolean;
}

interface Props {}

interface NotifcationStateInterface {
    visible: boolean;
    message: string;
    description: string;
    otherProps: object;
}

interface InputTouchedStateInterface {
    currentPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
}

interface InputErrorStateInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export class ChangePasswordPage extends React.Component<Props, State> {
    public state = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        notification: {
            visible: false,
            message: "",
            description: "",
            otherProps: {}
        },
        touched: { currentPassword: false, newPassword: false, confirmPassword: false },
        errors: { currentPassword: "", newPassword: "", confirmPassword: "" },
        hasErrors: true
    };

    public componentDidUpdate(prevProps, prevState) {
        const { errors } = this.state;
        if (prevState && prevState.errors !== errors) {
            this.setState({
                hasErrors: errors.currentPassword || errors.newPassword || errors.confirmPassword ? true : false
            });
        }
    }

    public handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { touched } = this.state;
        const { name } = e.target;
        this.setState(
            {
                touched: { ...touched, [name]: true }
            } as Pick<State, "touched">,
            () => {
                this.validate();
            }
        );
    }

    public handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        { name, value }: { name: string; value: string }
    ) => {
        // `as Pick<State, keyof State>` was used to silent the linter warning
        this.setState({ [name]: value } as Pick<State, "currentPassword" | "newPassword" | "confirmPassword">, () => {
            this.validate();
        });
    }

    public handleSubmit = () => {
        const { currentPassword, newPassword, confirmPassword, notification, hasErrors, touched } = this.state;

        this.setState({
            touched: {
                ...touched,
                currentPassword: true,
                newPassword: true,
                confirmPassword: true
            }
        });
        this.validate();

        // If the form has errors, return from the function.
        if (hasErrors) {
            return;
        }

        // Check if the new password matches the confirmation field.
        // If there's a mismatch, clears the text fields and return.
        if (newPassword !== confirmPassword) {
            this.setState(({
                notification: {
                    ...notification,
                    visible: true,
                    message: "Password reset error",
                    description: "The password confirmation doesn't match the new password",
                    otherProps: {
                        negative: true
                    }
                },
                newPassword: "",
                confirmPassword: ""
            } as unknown) as Pick<State, "notification">);

            return;
        }

        updatePassword(currentPassword, newPassword)
            .then((response) => {
                if (response.status && response.status === 200) {
                    this.setState(({
                        notification: {
                            ...notification,
                            visible: true,
                            message: "Password reset successful",
                            description: "The password has been changed successfully",
                            otherProps: {
                                positive: true
                            }
                        },
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                    } as unknown) as Pick<State, "notification">);
                }
            })
            .catch((error) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    this.setState(({
                        notification: {
                            ...notification,
                            visible: true,
                            message: "Password reset error",
                            description: "The current password you entered appears to be invalid. Please try again",
                            otherProps: {
                                negative: true
                            }
                        }
                    } as unknown) as Pick<State, "notification">);
                } else if (error.response && error.response.data && error.response.data.detail) {
                    this.setState(({
                        notification: {
                            ...notification,
                            visible: true,
                            message: "Password reset error",
                            description: error.response.data.detail,
                            otherProps: {
                                negative: true
                            }
                        }
                    } as unknown) as Pick<State, "notification">);
                } else {
                    // Generic error message
                    this.setState(({
                        notification: {
                            ...notification,
                            visible: true,
                            message: "Password reset error",
                            description: "Something went wrong. Please try again.",
                            otherProps: {
                                negative: true
                            }
                        }
                    } as unknown) as Pick<State, "notification">);
                }
            });
    }

    public validate = () => {
        const { currentPassword, newPassword, confirmPassword, errors, touched } = this.state;

        const formErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };

        if (currentPassword === null || currentPassword === "") {
            formErrors.currentPassword = "Current pasword is required";
        }
        if (newPassword === null || newPassword === "") {
            formErrors.newPassword = "New pasword is required";
        }
        if (confirmPassword === null || confirmPassword === "") {
            formErrors.confirmPassword = "Confirm pasword is required";
        }
        if ((newPassword !== "" && confirmPassword !== "") && (newPassword !== confirmPassword)) {
            this.setState({
                touched: {
                    ...touched,
                    confirmPassword: true
                }
            });
            formErrors.confirmPassword = "The password confirmation doesn't match";
        }

        this.setState({
            errors: {
                ...errors,
                ...formErrors
            }
        });
    }

    public handleNotificationDismiss = () => {
        const { notification } = this.state;
        this.setState(({
            notification: {
                ...notification,
                visible: false
            }
        } as unknown) as Pick<State, "notification">);
    }

    public render() {
        const { currentPassword, newPassword, confirmPassword, notification, errors, touched } = this.state;
        const { visible, message, description, otherProps } = notification;
        return (
            <InnerPageLayout pageTitle="Change Password" pageDescription="Change and modify the existing password">
                <Container>
                    {visible ? (
                        <NotificationComponent
                            message={message}
                            description={description}
                            onDismiss={this.handleNotificationDismiss}
                            {...otherProps}
                        />
                    ) : null}

                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            name="currentPassword"
                            label="Current password"
                            placeholder="Current password"
                            type="password"
                            value={currentPassword}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputBlur}
                            error={touched.currentPassword && errors.currentPassword ? errors.currentPassword : false}
                        />
                        <Form.Input
                            name="newPassword"
                            label="New password"
                            placeholder="New password"
                            type="password"
                            value={newPassword}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputBlur}
                            error={touched.newPassword && errors.newPassword ? errors.newPassword : false}
                        />
                        <Form.Input
                            name="confirmPassword"
                            label="Confirm new password"
                            placeholder="Confirm new password"
                            type="password"
                            value={confirmPassword}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputBlur}
                            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : false}
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
