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

import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container, Divider, Modal } from "semantic-ui-react";
import { updatePassword } from "../../api";
import { SettingsSectionIcons } from "../../configs";
import { Notification, Validation } from "../../models";
import { EditSection, FormWrapper, SettingsSection } from "../shared";

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

    const { t } = useTranslation();

    /**
     * Handles the `onSubmit` event of forms.
     *
     * @param {string} formName - Name of the form
     */
    const handleSubmit = (formName: string): void => {
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
                            "views:components.changePassword.forms.passwordResetForm.validations.submitSuccess." +
                                "description"
                        ),
                        message: t(
                            "views:components.changePassword.forms.passwordResetForm.validations.submitSuccess.message"
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
                            "views:components.changePassword.forms.passwordResetForm.inputs.currentPassword." +
                                "validations.invalid"
                        )
                    });

                    onNotificationFired({
                        description: t(
                            "views:components.changePassword.forms.passwordResetForm.validations." +
                                "invalidCurrentPassword.description"
                        ),
                        message: t(
                            "views:components.changePassword.forms.passwordResetForm.validations." +
                                "invalidCurrentPassword.message"
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
                            "views:components.changePassword.forms.passwordResetForm.validations." +
                                "submitError.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.changePassword.forms.passwordResetForm.validations.submitError.message"
                        ),
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
                            "views:components.changePassword.forms.passwordResetForm.validations." +
                                "genericError.description"
                        ),
                        message: t(
                            "views:components.changePassword.forms.passwordResetForm.validations.genericError.message"
                        ),
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
     * Resets the form by re-initializing state.
     */
    let resetForm: () => void = () => undefined;

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
        <Modal size="mini" open={ showConfirmationModal } onClose={ handleConfirmationModalClose } dimmer="blurring">
            <Modal.Content>
                <Container>
                    <h3>{ t("views:components.changePassword.modals.confirmationModal.heading") }</h3>
                </Container>
                <Divider hidden={ true } />
                <p>{ t("views:components.changePassword.modals.confirmationModal.message") }</p>
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
            <FormWrapper
                formFields={ [
                    {
                        label: t(
                            "views:components.changePassword.forms.passwordResetForm.inputs" + ".currentPassword.label"
                        ),
                        name: "currentPassword",
                        placeholder: t(
                            "views:components.changePassword.forms.passwordResetForm.inputs." +
                                "currentPassword.placeholder"
                        ),
                        required: true,
                        requiredErrorMessage: t(
                            "views:components.changePassword.forms.passwordResetForm." +
                                "inputs.currentPassword.validations.empty"
                        ),
                        type: "password",
                        width: 9
                    },
                    {
                        label: t(
                            "views:components.changePassword.forms.passwordResetForm.inputs" + ".newPassword.label"
                        ),
                        name: "newPassword",
                        placeholder: t(
                            "views:components.changePassword.forms.passwordResetForm.inputs." +
                                "newPassword.placeholder"
                        ),
                        required: true,
                        requiredErrorMessage: t(
                            "views:components.changePassword.forms.passwordResetForm." +
                                "inputs.newPassword.validations.empty"
                        ),
                        type: "password",
                        width: 9
                    },
                    {
                        label: t(
                            "views:components.changePassword.forms.passwordResetForm.inputs" + ".confirmPassword.label"
                        ),
                        name: "confirmPassword",
                        placeholder: t(
                            "views:components.changePassword.forms.passwordResetForm.inputs." +
                                "confirmPassword.placeholder"
                        ),
                        required: true,
                        requiredErrorMessage: t(
                            "views:components.changePassword.forms.passwordResetForm." +
                                "inputs.confirmPassword.validations.empty"
                        ),
                        type: "password",
                        validation: (value: string, validation: Validation, formValues) => {
                            if (formValues.get("newPassword") !== value) {
                                validation.isValid = false;
                                validation.errorMessages.push(
                                    t(
                                        "views:components.changePassword.forms.passwordResetForm.inputs" +
                                            ".confirmPassword.validations.mismatch"
                                    )
                                );
                            }
                        },
                        width: 9
                    },
                    {
                        hidden: true,
                        type: "divider"
                    },
                    {
                        size: "small",
                        type: "submit",
                        value: t("common:submit").toString()
                    },
                    {
                        className: "link-button",
                        onClick: () => {
                            hideFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER);
                        },
                        size: "small",
                        type: "button",
                        value: t("common:cancel").toString()
                    }
                ] }
                groups={ [
                    {
                        endIndex: 7,
                        startIndex: 4,
                        style: "inline"
                    }
                ] }
                onSubmit={ (value) => {
                    setCurrentPassword(value.get("currentPassword").toString());
                    setNewPassword(value.get("newPassword").toString());
                    handleSubmit(CHANGE_PASSWORD_FORM_IDENTIFIER);
                } }
                triggerReset={ (reset) => {
                    resetForm = reset;
                } }
            />
        </EditSection>
    ) : null;

    return (
        <SettingsSection
            description={ t("views:sections.changePassword.description") }
            header={ t("views:sections.changePassword.heading") }
            icon={ SettingsSectionIcons.changePassword }
            iconMini={ SettingsSectionIcons.changePasswordMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => showFormEditView(CHANGE_PASSWORD_FORM_IDENTIFIER) }
            primaryAction={ t("views:sections.changePassword.actionTitles.change") }
            primaryActionIcon="key"
            showActionBar={ !editingForm[CHANGE_PASSWORD_FORM_IDENTIFIER] }
        >
            { showChangePasswordView }
            { confirmationModal }
        </SettingsSection>
    );
};
