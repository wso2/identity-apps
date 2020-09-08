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

import { Field, Forms, Validation, useTrigger } from "@wso2is/forms";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container, Divider, Form, Modal } from "semantic-ui-react";
import { updatePassword } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { AlertInterface, AlertLevels } from "../../models";
import { endUserSession } from "../../utils";
import { EditSection, SettingsSection } from "../shared";
/**
 * Constant to store the change password from identifier.
 * @type {string}
 */
const CHANGE_PASSWORD_FORM_IDENTIFIER = "changePasswordForm";

/**
 * Prop types for the change password component.
 */
interface ChangePasswordProps {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Change password component.
 *
 * @param {ChangePasswordProps} props - Props injected to the change password component.
 * @return {JSX.Element}
 */
export const ChangePassword: FunctionComponent<ChangePasswordProps> = (props: ChangePasswordProps): JSX.Element => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errors, setErrors] = useState({
        confirmPassword: "",
        currentPassword: "",
        newPassword: ""
    });
    const [editingForm, setEditingForm] = useState({
        [CHANGE_PASSWORD_FORM_IDENTIFIER]: false
    });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const [reset, resetForm] = useTrigger();

    const { t } = useTranslation();

    /**
     * Handles the `onSubmit` event of forms.
     *
     * @param {string} formName - Name of the form
     */
    const handleSubmit = (): void => {
        setShowConfirmationModal(true);
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

    /**
     * Calls the API and updates the user password.
     */
    const changePassword = () => {
        const { onAlertFired } = props;

        updatePassword(currentPassword, newPassword)
            .then((response) => {
                if (response.status && response.status === 200) {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);

                    onAlertFired({
                        description: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations.submitSuccess." +
                            "description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations." +
                            "submitSuccess.message"
                        )
                    });

                    // Terminate the user session.
                    endUserSession();
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
                            "userPortal:components.changePassword.forms.passwordResetForm.inputs.currentPassword." +
                            "validations.invalid"
                        )
                    });

                    onAlertFired({
                        description: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations." +
                            "invalidCurrentPassword.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations." +
                            "invalidCurrentPassword.message"
                        )
                    });
                } else if (error.response && error.response.data && error.response.data.detail) {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);

                    onAlertFired({
                        description: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations." +
                            "submitError.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations." +
                            "submitError.message"
                        )
                    });
                } else {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);

                    // Generic error message
                    onAlertFired({
                        description: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.changePassword.forms.passwordResetForm.validations." +
                            "genericError.message"
                        )
                    });
                }
            });

        // Close the modal
        setShowConfirmationModal(false);
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

    const confirmationModal = (
        <Modal size="mini" open={ showConfirmationModal } onClose={ handleConfirmationModalClose } dimmer="blurring">
            <Modal.Content>
                <Container>
                    <h3>{ t("userPortal:components.changePassword.modals.confirmationModal.heading") }</h3>
                </Container>
                <Divider hidden={ true } />
                <p>{ t("userPortal:components.changePassword.modals.confirmationModal.message") }</p>
            </Modal.Content>
            <Modal.Actions>
                <Button className="link-button" onClick={ handleConfirmationModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary={ true } onClick={ changePassword }>
                    { t("common:continue") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    const showChangePasswordView = editingForm[CHANGE_PASSWORD_FORM_IDENTIFIER] ? (
        <EditSection>
            <Forms
                onSubmit={ (value) => {
                    setCurrentPassword(value.get("currentPassword").toString());
                    setNewPassword(value.get("newPassword").toString());
                    handleSubmit();
                } }
                resetState={ reset }
            >
                <Field
                    autoFocus={ true }
                    hidePassword={ t("common:hidePassword") }
                    label={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm.inputs" + ".currentPassword.label"
                    ) }
                    name="currentPassword"
                    placeholder={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm.inputs." +
                        "currentPassword.placeholder"
                    ) }
                    required={ true }
                    requiredErrorMessage={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm." +
                        "inputs.currentPassword.validations.empty"
                    ) }
                    showPassword={ t("common:showPassword") }
                    type="password"
                    width={ 9 }
                />
                <Field
                    hidePassword={ t("common:hidePassword") }
                    label={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm.inputs" + ".newPassword.label"
                    ) }
                    name="newPassword"
                    placeholder={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm.inputs." +
                        "newPassword.placeholder"
                    ) }
                    required={ true }
                    requiredErrorMessage={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm." +
                        "inputs.newPassword.validations.empty"
                    ) }
                    showPassword={ t("common:showPassword") }
                    type="password"
                    width={ 9 }
                />
                <Field
                    hidePassword={ t("common:hidePassword") }
                    label={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm.inputs" + ".confirmPassword.label"
                    ) }
                    name="confirmPassword"
                    placeholder={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm.inputs." +
                        "confirmPassword.placeholder"
                    ) }
                    required={ true }
                    requiredErrorMessage={ t(
                        "userPortal:components.changePassword.forms.passwordResetForm." +
                        "inputs.confirmPassword.validations.empty"
                    ) }
                    showPassword={ t("common:showPassword") }
                    type="password"
                    validation={ (value: string, validation: Validation, formValues) => {
                        if (formValues.get("newPassword") !== value) {
                            validation.isValid = false;
                            validation.errorMessages.push(
                                t(
                                    "userPortal:components.changePassword.forms.passwordResetForm.inputs" +
                                    ".confirmPassword.validations.mismatch"
                                )
                            );
                        }
                    } }
                    width={ 9 }
                />
                <Field
                    hidden={ true }
                    type="divider"
                />
                <Form.Group>
                    <Field
                        size="small"
                        type="submit"
                        value={ t("common:submit").toString() }
                    />
                    <Field
                        className="link-button"
                        onClick={ () => {
                            hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);
                        } }
                        size="small"
                        type="button"
                        value={ t("common:cancel").toString() }
                    />
                </Form.Group>

            </Forms>
        </EditSection>
    ) : null;

    return (
        <SettingsSection
            description={ t("userPortal:sections.changePassword.description") }
            header={ t("userPortal:sections.changePassword.heading") }
            icon={ SettingsSectionIcons.changePassword }
            iconMini={ SettingsSectionIcons.changePasswordMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => showFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER) }
            primaryAction={ t("userPortal:sections.changePassword.actionTitles.change") }
            primaryActionIcon="key"
            showActionBar={ !editingForm[CHANGE_PASSWORD_FORM_IDENTIFIER] }
        >
            { showChangePasswordView }
            { confirmationModal }
        </SettingsSection>
    );
};
