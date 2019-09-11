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
import { Button, Container, Divider, Form, Grid, Header, Icon, Modal } from "semantic-ui-react";
import { updatePassword } from "../actions";
import { EditSection } from "./edit-section";
import { NotificationComponent } from "./notification";
import { SettingsSection } from "./settings-section";

/**
 * Component State types
 */
interface ComponentStateInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    notification: NotifcationStateInterface;
    touched: InputTouchedStateInterface;
    errors: InputErrorStateInterface;
    hasErrors: boolean;
    isChange: boolean;
    types: InputTypesStateInterface;
    showConfirmationModal: boolean;
}

/**
 * Interface to map the notification state
 */
interface NotifcationStateInterface {
    visible: boolean;
    message: string;
    description: string;
    otherProps: object;
}

/**
 * Interface to map the input touched state
 */
interface InputTouchedStateInterface {
    currentPassword: boolean;
    newPassword: boolean;
    confirmPassword: boolean;
}

/**
 * Interface to map the input filed errors
 */
interface InputErrorStateInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Interface to map the input field types
 */
interface InputTypesStateInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * This is the Change Password component of the User Portal
 */
class ChangePasswordComponentInner extends React.Component<WithTranslation, ComponentStateInterface> {
    public state = {
        confirmPassword: "",
        currentPassword: "",
        errors: {currentPassword: "", newPassword: "", confirmPassword: ""},
        hasErrors: true,
        isChange: false,
        newPassword: "",
        notification: {
            description: "",
            message: "",
            otherProps: {},
            visible: false
        },
        showConfirmationModal: false,
        touched: {currentPassword: false, newPassword: false, confirmPassword: false},
        types: {
            confirmPassword: "password",
            currentPassword: "password",
            newPassword: "password"
        },
    };

    /**
     * ComponentDidUpdate lifecycle hook is triggered after an
     * update occurs. The form errors are evaluated here and the
     * `hasError` state is set based on the newly updated errors.
     * @param {Readonly<P>} prevProps previous props
     * @param {Readonly<S>} prevState previous state
     */
    public componentDidUpdate(prevProps: WithTranslation, prevState: ComponentStateInterface) {
        const {errors} = this.state;
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
        const {touched} = this.state;
        const {name} = e.target;
        this.setState({touched: {...touched, [name]: true}}, () => {
            this.validate();
        });
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
        {name, value}: { name: string; value: string }
    ) => {
        // `as Pick<State, keyof State>` was used to silent the linter warning
        this.setState(
            {[name]: value} as Pick<ComponentStateInterface, "currentPassword" | "newPassword" | "confirmPassword">,
            () => this.validate()
        );
    }

    /**
     * Handles the form submit.
     */
    public handleSubmit = () => {
        const {hasErrors, touched} = this.state;

        // The touched state of the inputs are set to true when submitting the form.
        this.setState({
            touched: {
                ...touched,
                confirmPassword: true,
                currentPassword: true,
                newPassword: true,
            }
        });

        // Validate the form
        this.validate();

        // If the form has errors, return from the function.
        if (hasErrors) {
            return;
        }

        // Show the confirmation modal
        this.setState({showConfirmationModal: true});
    }

    /**
     * Calls the API and updates the user password.
     */
    public changePassword = () => {
        const {currentPassword, newPassword, notification} = this.state;
        const {t} = this.props;

        updatePassword(currentPassword, newPassword)
            .then((response) => {
                if (response.status && response.status === 200) {
                    this.setState({
                        confirmPassword: "",
                        currentPassword: "",
                        hasErrors: true,
                        newPassword: "",
                        notification: {
                            ...notification,
                            description: t(
                                "views:changePassword.forms.passwordResetForm.validations.submitSuccess.description"
                            ),
                            message: t(
                                "views:changePassword.forms.passwordResetForm.validations.submitSuccess.message"
                            ),
                            otherProps: {
                                positive: true
                            },
                            visible: true
                        }
                    });
                }
            })
            .catch((error) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:changePassword.forms.passwordResetForm.validations.invalidCurrentPassword." +
                                "description"
                            ),
                            message: t(
                                "views:changePassword.forms.passwordResetForm.validations.invalidCurrentPassword." +
                                "message"
                            ),
                            otherProps: {
                                negative: true
                            },
                            visible: true
                        }
                    });
                } else if (error.response && error.response.data && error.response.data.detail) {
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:changePassword.forms.passwordResetForm.validations.submitError.description",
                                {description: error.response.data.detail}
                            ),
                            message: t("views:changePassword.forms.passwordResetForm.validations.submitError.message"),
                            otherProps: {
                                negative: true
                            },
                            visible: true
                        }
                    });
                } else {
                    // Generic error message
                    this.setState({
                        notification: {
                            ...notification,
                            description: t(
                                "views:changePassword.forms.passwordResetForm.validations.genericError.description"
                            ),
                            message: t("views:changePassword.forms.passwordResetForm.validations.genericError.message"),
                            otherProps: {
                                negative: true
                            },
                            visible: true
                        }
                    });
                }
            });

        // Close the modal
        this.setState({showConfirmationModal: false});
    }

    /**
     * Validates the form input fields and sets the corresponding error
     * message for the input field.
     */
    public validate = () => {
        const {currentPassword, newPassword, confirmPassword, errors, touched} = this.state;
        const {t} = this.props;

        const formErrors = {currentPassword: "", newPassword: "", confirmPassword: ""};

        if (currentPassword === null || currentPassword === "") {
            formErrors.currentPassword = t(
                "views:changePassword.forms.passwordResetForm.inputs.currentPassword.validations.empty"
            );
        }
        if (newPassword === null || newPassword === "") {
            formErrors.newPassword = t(
                "views:changePassword.forms.passwordResetForm.inputs.newPassword.validations.empty"
            );
        }
        if (confirmPassword === null || confirmPassword === "") {
            formErrors.confirmPassword = t(
                "views:changePassword.forms.passwordResetForm.inputs.confirmPassword.validations.empty"
            );
        }
        if (newPassword !== "" && confirmPassword !== "" && newPassword !== confirmPassword) {
            this.setState({
                touched: {
                    ...touched,
                    confirmPassword: true
                }
            });
            formErrors.confirmPassword = t(
                "views:changePassword.forms.passwordResetForm.inputs.confirmPassword.validations.mismatch"
            );
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
        const {notification} = this.state;
        this.setState({
            notification: {
                ...notification,
                visible: false
            }
        });
    }

    /**
     * Handles the password field eye icon click. Toggles the
     * input field type between `password` and `text`.
     * @param name name attribute registered in the input field
     */
    public toggleInputType = (name: string) => {
        const {types} = this.state;

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

    public handleConfirmationModalClose = (): void => {
        this.setState({showConfirmationModal: false});
    }

    public handleShowChangeView = (): void => {
        this.setState({isChange: true});
    }

    public handleCancelChangeView = (): void => {
        this.setState({isChange: false});
    }

    public render() {
        const {
            currentPassword,
            newPassword,
            confirmPassword,
            isChange,
            notification,
            errors,
            touched,
            types,
            showConfirmationModal
        } = this.state;
        const {t} = this.props;
        const {visible, message, description, otherProps} = notification;

        const confirmationModal = (
            <Modal
                size="mini"
                open={showConfirmationModal}
                onClose={this.handleConfirmationModalClose}
                dimmer="blurring"
            >
                <Modal.Content>
                    <Container textAlign="center">
                        <h3>{t("views:changePassword.modals.confirmationModal.heading")}</h3>
                    </Container>
                    <br/>
                    <p>{t("views:changePassword.modals.confirmationModal.message")}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        className="link-button" onClick={this.handleConfirmationModalClose}>
                        {t("common:cancel")}
                    </Button>
                    <Button primary onClick={this.changePassword}>
                        {t("common:continue")}
                    </Button>
                </Modal.Actions>
            </Modal>
        );

        const showChangePasswordView = (
            isChange
                ?

                (
                    <EditSection>
                        <Form onSubmit={this.handleSubmit}>
                            <Grid>
                                <Grid.Row columns={1}>
                                    <Grid.Column mobile={16} tablet={16} computer={9}>
                                        <Form.Input
                                            name="currentPassword"
                                            label={
                                                t("views:changePassword.forms.passwordResetForm.inputs" +
                                                    ".currentPassword.label")
                                            }
                                            placeholder={
                                                t("views:changePassword.forms.passwordResetForm.inputs." +
                                                    "currentPassword.placeholder")
                                            }
                                            type={types.currentPassword}
                                            icon={
                                                types.currentPassword === "password" ? (
                                                    <Icon
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
                                            error={
                                                touched.currentPassword && errors.currentPassword
                                                    ? errors.currentPassword
                                                    : false
                                            }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={16} computer={9}>
                                        <Form.Input
                                            name="newPassword"
                                            label={
                                                t("views:changePassword.forms.passwordResetForm.inputs." +
                                                    "newPassword.label")
                                            }
                                            placeholder={
                                                t("views:changePassword.forms.passwordResetForm.inputs." +
                                                    "newPassword.placeholder")
                                            }
                                            type={types.newPassword}
                                            icon={
                                                types.newPassword === "password" ? (
                                                    <Icon
                                                        name="eye"
                                                        link
                                                        onClick={() => this.toggleInputType("newPassword")}
                                                    />
                                                ) : (
                                                    <Icon
                                                        name="eye slash"
                                                        link
                                                        onClick={() => this.toggleInputType("newPassword")}
                                                    />
                                                )
                                            }
                                            value={newPassword}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputBlur}
                                            error={touched.newPassword && errors.newPassword ?
                                                errors.newPassword : false}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={16} computer={9}>
                                        <Form.Input
                                            name="confirmPassword"
                                            label={
                                                t("views:changePassword.forms.passwordResetForm.inputs." +
                                                    "confirmPassword.label")
                                            }
                                            placeholder={
                                                t("views:changePassword.forms.passwordResetForm.inputs." +
                                                    "confirmPassword.placeholder")
                                            }
                                            type={types.confirmPassword}
                                            icon={
                                                types.confirmPassword === "password" ? (
                                                    <Icon
                                                        name="eye"
                                                        link
                                                        onClick={() => this.toggleInputType("confirmPassword")}
                                                    />
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
                                            error={
                                                touched.confirmPassword && errors.confirmPassword
                                                    ? errors.confirmPassword
                                                    : false
                                            }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <br/>
                            <Button primary type="submit" size="small">
                                {t("common:submit")}
                            </Button>
                            <Button className="link-button" onClick={this.handleCancelChangeView} size="small">
                                {t("common:cancel")}
                            </Button>
                        </Form>
                    </EditSection>
                )
                : null
        );

        return (
            <>
                <SettingsSection
                    header={t("views:changePassword.title")}
                    description={t("views:changePassword.subTitle")}
                    actionTitle="Change"
                    onActionClick={this.handleShowChangeView}
                    isEdit={isChange}
                >
                    {visible ? (
                        <NotificationComponent
                            message={message}
                            description={description}
                            onDismiss={this.handleNotificationDismiss}
                            {...otherProps}
                        />
                    ) : null}
                        {showChangePasswordView}
                        {confirmationModal}
                </SettingsSection>
            </>
        );
    }
}

export const ChangePasswordComponent = withTranslation()(ChangePasswordComponentInner);
