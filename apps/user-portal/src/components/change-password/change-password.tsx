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

import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container, Divider, Form, Grid, Icon, Modal, Popup } from "semantic-ui-react";
import { updatePassword } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { Notification } from "../../models";
import { EditSection, SettingsSection } from "../shared";

/**
 * Constant to store the change password from identifier.
 * @type {string}
 */
const CHANGE_PASSWORD_FORM_IDENTIFIER: string = "changePasswordForm";

/**
 * Proptypes for the change password component.
 */
interface ChangePasswordProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Change password component.
 *
 * @param {ChangePasswordProps} props - Props injected to the change password component.
 * @return {JSX.Element}
 */
export const ChangePassword: FunctionComponent<ChangePasswordProps> = (
    props: ChangePasswordProps
): JSX.Element => {
    const [ currentPassword, setCurrentPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ errors, setErrors ] = useState({
        confirmPassword: "",
        currentPassword: "",
        newPassword: ""
    });
    const [ editingForm, setEditingForm ] = useState({
        [CHANGE_PASSWORD_FORM_IDENTIFIER]: false
    });
    const [ hasErrors, setHasErrors ] = useState(true);
    const [ showConfirmationModal, setShowConfirmationModal ] = useState(false);
    const [ touched, setTouched ] = useState({
        confirmPassword: false,
        currentPassword: false,
        newPassword: false
    });
    const [ inputTypes, setInputTypes ] = useState({
        confirmPassword: "password",
        currentPassword: "password",
        newPassword: "password"
    });

    const { t } = useTranslation();

    /**
     * Validate the form when the input value in the state changes.
     */
    useEffect(() => {
        validateForm();
    }, [ currentPassword, newPassword, confirmPassword ]);

    /**
     * Handles the input onBlur event. The touched state is set
     * based on the clicked input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched({
            ...touched,
            [name]: true
        });
    };

    /**
     * Handles the input onChange event. The value of the changed input
     * field is set to the corresponding state.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e input change event
     */
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === "currentPassword") {
            setCurrentPassword(e.target.value);
        } else if (e.target.id === "newPassword") {
            setNewPassword(e.target.value);
        } else if (e.target.id === "confirmPassword") {
            setConfirmPassword(e.target.value);
        }
    };

    /**
     * Handles the `onSubmit` event of forms.
     *
     * @param {string} formName - Name of the form
     */
    const handleSubmit = (formName: string): void => {
        // The touched state of the inputs are set to true when submitting the form.
        setTouched({
            confirmPassword: true,
            currentPassword: true,
            newPassword: true,
        });

        // Validate the form
        validateForm();

        // If the form has errors, return from the function.
        if (hasErrors) {
            return;
        }

        // Show the confirmation modal
        setShowConfirmationModal(true);
    };

    /**
     * Calls the API and updates the user password.
     */
    const changePassword = () => {
        const { onNotificationFired } = props;

        updatePassword(currentPassword, newPassword)
            .then((response) => {
                if (response.status && response.status === 200) {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);

                    onNotificationFired({
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
                    });
                }
            })
            .catch((error) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    // set an error in the current password field.
                    setErrors({
                        ...errors,
                        currentPassword: t(
                            "views:changePassword.forms.passwordResetForm.inputs.currentPassword.validations.invalid"
                        )
                    });

                    onNotificationFired({
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
                    });
                } else if (error.response && error.response.data && error.response.data.detail) {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);

                    onNotificationFired({
                        description: t(
                            "views:changePassword.forms.passwordResetForm.validations.submitError.description",
                            { description: error.response.data.detail }
                        ),
                        message: t("views:changePassword.forms.passwordResetForm.validations.submitError.message"),
                        otherProps: {
                            negative: true
                        },
                        visible: true
                    });
                } else {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);

                    // Generic error message
                    onNotificationFired({
                        description: t(
                            "views:changePassword.forms.passwordResetForm.validations.genericError.description"
                        ),
                        message: t("views:changePassword.forms.passwordResetForm.validations.genericError.message"),
                        otherProps: {
                            negative: true
                        },
                        visible: true
                    });
                }
            });

        // Close the modal
        setShowConfirmationModal(false);
    };

    /**
     * Validates the form input fields and sets the corresponding error
     * message for the input field.
     */
    const validateForm = () => {
        const formErrors = { currentPassword: "", newPassword: "", confirmPassword: "" };

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
            setTouched({
                ...touched,
                confirmPassword: true
            });
            formErrors.confirmPassword = t(
                "views:changePassword.forms.passwordResetForm.inputs.confirmPassword.validations.mismatch"
            );
        }

        setErrors(formErrors);
        setHasErrors(
            !(formErrors.currentPassword === "" && formErrors.newPassword === "" && formErrors.confirmPassword === "")
        );
    };

    /**
     * Resets the form by re-initializing state.
     */
    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({
            confirmPassword: "",
            currentPassword: "",
            newPassword: ""
        });
        setHasErrors(true);
        setTouched({
            confirmPassword: false,
            currentPassword: false,
            newPassword: false
        });
        setInputTypes({
            confirmPassword: "password",
            currentPassword: "password",
            newPassword: "password"
        });
    };

    /**
     * Handles the password field eye icon click. Toggles the
     * input field type between `password` and `text`.
     *
     * @param name name attribute registered in the input field
     */
    const toggleInputType = (name: string) => {
        let type = "password";

        if (inputTypes[name] === "password") {
            type = "text";
        }

        setInputTypes({
            ...inputTypes,
            [name]: type
        });
    };

    /**
     * Handle the confirmation modal close event.
     */
    const handleConfirmationModalClose = (): void => {
        setShowConfirmationModal(false);
    };

    /**
     * Handles the onClick event of the edit button.
     *
     * @param formName - Name of the form
     */
    const showFormEditView = (formName: string): void => {
        setEditingForm({
            ...editingForm,
            [formName]: true
        });
    };

    /**
     * Handles the onClick event of the cancel button.
     *
     * @param formName - Name of the form
     */
    const hideFormEditView = (formName: string): void => {
        setEditingForm({
            ...editingForm,
            [formName]: false
        });
    };

    const confirmationModal = (
        <Modal
            size="mini"
            open={ showConfirmationModal }
            onClose={ handleConfirmationModalClose }
            dimmer="blurring"
        >
            <Modal.Content>
                <Container>
                    <h3>{ t("views:changePassword.modals.confirmationModal.heading") }</h3>
                </Container>
                <Divider hidden />
                <p>{ t("views:changePassword.modals.confirmationModal.message") }</p>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    className="link-button" onClick={ handleConfirmationModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary onClick={ changePassword }>
                    { t("common:continue") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    const showChangePasswordView = (
        editingForm[CHANGE_PASSWORD_FORM_IDENTIFIER]
            ? (
                <EditSection>
                    <Form onSubmit={ () => handleSubmit(CHANGE_PASSWORD_FORM_IDENTIFIER) }>
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 }>
                                    <Form.Input
                                        id="currentPassword"
                                        label={
                                            t("views:changePassword.forms.passwordResetForm.inputs" +
                                                ".currentPassword.label")
                                        }
                                        placeholder={
                                            t("views:changePassword.forms.passwordResetForm.inputs." +
                                                "currentPassword.placeholder")
                                        }
                                        type={ inputTypes.currentPassword }
                                        icon={
                                            <Popup
                                                trigger={
                                                    <Icon
                                                        name={
                                                            inputTypes.currentPassword === "password"
                                                                ? "eye slash" :
                                                                "eye"
                                                        }
                                                        disabled={ !currentPassword }
                                                        link
                                                        onClick={ () => toggleInputType("currentPassword") }
                                                    />
                                                }
                                                position="top center"
                                                content={
                                                    inputTypes.currentPassword === "password"
                                                        ? t("common:showPassword")
                                                        : t("common:hidePassword")
                                                }
                                                inverted
                                            />
                                        }
                                        value={ currentPassword }
                                        onChange={ handleFieldChange }
                                        onBlur={ handleInputBlur }
                                        error={
                                            touched.currentPassword && errors.currentPassword
                                                ? errors.currentPassword
                                                : false
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 }>
                                    <Form.Input
                                        id="newPassword"
                                        label={
                                            t("views:changePassword.forms.passwordResetForm.inputs." +
                                                "newPassword.label")
                                        }
                                        placeholder={
                                            t("views:changePassword.forms.passwordResetForm.inputs." +
                                                "newPassword.placeholder")
                                        }
                                        type={ inputTypes.newPassword }
                                        icon={
                                            <Popup
                                                trigger={
                                                    <Icon
                                                        name={
                                                            inputTypes.newPassword === "password"
                                                                ? "eye slash" :
                                                                "eye"
                                                        }
                                                        disabled={ !newPassword }
                                                        link
                                                        onClick={ () => toggleInputType("newPassword") }
                                                    />
                                                }
                                                position="top center"
                                                content={
                                                    inputTypes.newPassword === "password"
                                                        ? t("common:showPassword")
                                                        : t("common:hidePassword")
                                                }
                                                inverted
                                            />
                                        }
                                        value={ newPassword }
                                        onChange={ handleFieldChange }
                                        onBlur={ handleInputBlur }
                                        error={ touched.newPassword && errors.newPassword ?
                                            errors.newPassword : false }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 }>
                                    <Form.Input
                                        id="confirmPassword"
                                        label={
                                            t("views:changePassword.forms.passwordResetForm.inputs." +
                                                "confirmPassword.label")
                                        }
                                        placeholder={
                                            t("views:changePassword.forms.passwordResetForm.inputs." +
                                                "confirmPassword.placeholder")
                                        }
                                        type={ inputTypes.confirmPassword }
                                        icon={
                                            <Popup
                                                trigger={
                                                    <Icon
                                                        name={
                                                            inputTypes.confirmPassword === "password"
                                                                ? "eye slash" :
                                                                "eye"
                                                        }
                                                        disabled={ !confirmPassword }
                                                        link
                                                        onClick={ () => toggleInputType("confirmPassword") }
                                                    />
                                                }
                                                position="top center"
                                                content={
                                                    inputTypes.confirmPassword === "password"
                                                        ? t("common:showPassword")
                                                        : t("common:hidePassword")
                                                }
                                                inverted
                                            />
                                        }
                                        value={ confirmPassword }
                                        onChange={ handleFieldChange }
                                        onBlur={ handleInputBlur }
                                        error={
                                            touched.confirmPassword && errors.confirmPassword
                                                ? errors.confirmPassword
                                                : false
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Divider hidden />
                        <Button primary type="submit" size="small">
                            { t("common:submit") }
                        </Button>
                        <Button
                            className="link-button"
                            onClick={ () => hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER) }
                            size="small"
                        >
                            { t("common:cancel") }
                        </Button>
                    </Form>
                </EditSection>
            )
            : null
    );

    return (
        <SettingsSection
            description={ t("views:changePassword.subTitle") }
            header={ t("views:changePassword.title") }
            icon={ SettingsSectionIcons.changePassword }
            iconMini={ SettingsSectionIcons.changePasswordMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => showFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER) }
            primaryAction={ t("views:changePassword.actionTitles.change") }
            showActionBar={ !editingForm[CHANGE_PASSWORD_FORM_IDENTIFIER] }
        >
            { showChangePasswordView }
            { confirmationModal }
        </SettingsSection>
    );
};
