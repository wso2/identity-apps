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
import { Button, Container, Form, Icon } from "semantic-ui-react";
import { updatePassword } from "../actions/profile";
import { NotificationComponent } from "../components";
import { InnerPageLayout } from "../layouts";

/** Component State types */
interface State {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    notification: NotifcationStateInterface;
    touched: InputTouchedStateInterface;
    errors: InputErrorStateInterface;
    hasErrors: boolean;
    types: InputTypesStateInterface;
}

/** Component Props types */
interface Props {}

/** Interface to map the notification state */
interface NotifcationStateInterface {
    visible: boolean;
    message: string;
    description: string;
    otherProps: object;
}

/** Interface to map the input touched state */
interface InputTouchedStateInterface {
    currentPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
}

/** Interface to map the input filed errors */
interface InputErrorStateInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/** Interface to map the input field types */
interface InputTypesStateInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * This is the Change Password page of the User Portal
 */
export class ChangePasswordPage extends React.Component<Props, State> {
    state = {
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
        hasErrors: true,
        types: {
            currentPassword: "password",
            newPassword: "password",
            confirmPassword: "password"
        }
    };

    /**
     * ComponentDidUpdate lifecycle hook is triggered after an
     * update occurs. The form errors are evaluated here and the
     * `hasError` state is set based on the newly updated errors.
     * @param {Readonly<P>} prevProps previous props
     * @param {Readonly<S>} prevState previous state
     */
    public componentDidUpdate(prevProps, prevState) {
        const { errors } = this.state;
        if (prevState && prevState.errors !== errors) {
            this.setState({
                hasErrors: !!(errors.currentPassword || errors.newPassword || errors.confirmPassword)
            });
        }
    }

    /**
     * Handles the input onBlur event. The touched state is set
     * based on the clicked input field.
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
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

    /**
     * Handles the input onChange event. The value of the changed input
     * field is set to the corresponding state.
     * @param {React.ChangeEvent<HTMLInputElement>} e input change event
     * @param {string} name name attribute of the input element
     * @param {string} value value attribute of the input element
     */
    public handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        { name, value }: { name: string; value: string }
    ) => {
        // `as Pick<State, keyof State>` was used to silent the linter warning
        this.setState({ [name]: value } as Pick<State, "currentPassword" | "newPassword" | "confirmPassword">, () => {
            this.validate();
        });
    }

    /**
     * Handles the form submit.
     */
    public handleSubmit = () => {
        const { currentPassword, newPassword, confirmPassword, notification, hasErrors, touched } = this.state;

        // The touched state of the inputs are set to true when submitting the form.
        this.setState({
            touched: {
                ...touched,
                currentPassword: true,
                newPassword: true,
                confirmPassword: true
            }
        });

        // Validate the form
        this.validate();

        // If the form has errors, return from the function.
        if (hasErrors) {
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
                        confirmPassword: "",
                        hasErrors: true
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

    /**
     * Validates the form input fields and sets the corresponding error
     * message for the input field.
     */
    public validate = () => {
        const { currentPassword, newPassword, confirmPassword, errors, touched } = this.state;

        const formErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };

        if (currentPassword === null || currentPassword === "") {
            formErrors.currentPassword = "Current password is required";
        }
        if (newPassword === null || newPassword === "") {
            formErrors.newPassword = "New password is required";
        }
        if (confirmPassword === null || confirmPassword === "") {
            formErrors.confirmPassword = "Confirm password is required";
        }
        if (newPassword !== "" && confirmPassword !== "" && newPassword !== confirmPassword) {
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

    /**
     * Handles the notification bar close button click.
     */
    public handleNotificationDismiss = () => {
        const { notification } = this.state;
        this.setState(({
            notification: {
                ...notification,
                visible: false
            }
        } as unknown) as Pick<State, "notification">);
    }

    /**
     * Handles the password field eye icon click. Toggles the
     * input field type between `password` and `text`.
     * @param name name attribute registered in the input field
     */
    public toggleInputType = (name) => {
        const { types } = this.state;

        let type = "password";

        if (types[name] === "password") {
            type = "text";
        }

        this.setState({
            types: {
                ...types,
                [name]: type
            }
        });
    }

    public render() {
        const { currentPassword, newPassword, confirmPassword, notification, errors, touched, types } = this.state;
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
                            type={types.currentPassword}
                            icon={
                                types.currentPassword === "password" ? (
                                    <Icon
                                        id="currentPassword"
                                        name="eye"
                                        link
                                        onClick={() => this.toggleInputType("currentPassword")}
                                    />
                                ) : (
                                    <Icon
                                        name="eye slash"
                                        link
                                        onClick={() => this.toggleInputType("currentPassword")}
                                    />
                                )
                            }
                            value={currentPassword}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputBlur}
                            error={touched.currentPassword && errors.currentPassword ? errors.currentPassword : false}
                        />
                        <Form.Input
                            name="newPassword"
                            label="New password"
                            placeholder="New password"
                            type={types.newPassword}
                            icon={
                                types.newPassword === "password" ? (
                                    <Icon name="eye" link onClick={() => this.toggleInputType("newPassword")} />
                                ) : (
                                    <Icon name="eye slash" link onClick={() => this.toggleInputType("newPassword")} />
                                )
                            }
                            value={newPassword}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputBlur}
                            error={touched.newPassword && errors.newPassword ? errors.newPassword : false}
                        />
                        <Form.Input
                            name="confirmPassword"
                            label="Confirm new password"
                            placeholder="Confirm new password"
                            type={types.confirmPassword}
                            icon={
                                types.confirmPassword === "password" ? (
                                    <Icon name="eye" link onClick={() => this.toggleInputType("confirmPassword")} />
                                ) : (
                                    <Icon
                                        name="eye slash"
                                        link
                                        onClick={() => this.toggleInputType("confirmPassword")}
                                    />
                                )
                            }
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
