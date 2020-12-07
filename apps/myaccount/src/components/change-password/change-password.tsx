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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import React, { FunctionComponent, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Divider, Form, Modal } from "semantic-ui-react";
import { updatePassword } from "../../api";
import { getSettingsSectionIcons } from "../../configs";
import { CommonConstants } from "../../constants";
import { AlertInterface, AlertLevels } from "../../models";
import { AppState } from "../../store";
import { setActiveForm } from "../../store/actions";
import { endUserSession } from "../../utils";
import { EditSection, SettingsSection } from "../shared";

/**
 * Import password strength meter dynamically.
 */
const PasswordMeter = React.lazy(() => import("react-password-strength-bar"));

/**
 * Constant to store the change password from identifier.
 * @type {string}
 */
const CHANGE_PASSWORD_FORM_IDENTIFIER = "changePasswordForm";

/**
 * Prop types for the change password component.
 * Also see {@link ChangePassword.defaultProps}
 */
interface ChangePasswordProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Change password component.
 *
 * @param {ChangePasswordProps} props - Props injected to the change password component.
 * @return {JSX.Element}
 */
export const ChangePassword: FunctionComponent<ChangePasswordProps> = (props: ChangePasswordProps): JSX.Element => {

    const { ["data-testid"]: testId, onAlertFired } = props;

    const [ currentPassword, setCurrentPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ errors, setErrors ] = useState({
        confirmPassword: "",
        currentPassword: "",
        newPassword: ""
    });
    const [ password, setPassword ] = useState<string>("");
    const [ showConfirmationModal, setShowConfirmationModal ] = useState(false);
    const [ passwordScore, setPasswordScore ] = useState<number>(-1);

    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    const [ reset, resetForm ] = useTrigger();

    const { t } = useTranslation();
    const dispatch = useDispatch();

    /**
     * Handles the `onSubmit` event of forms.
     *
     * @param {string} formName - Name of the form
     */
    const handleSubmit = (): void => {
        setShowConfirmationModal(true);
    };

    /**
     * Calls the API and updates the user password.
     */
    const changePassword = () => {

        updatePassword(currentPassword, newPassword)
            .then((response) => {
                if (response.status && response.status === 200) {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    dispatch(setActiveForm(null));

                    onAlertFired({
                        description: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations.submitSuccess." +
                            "description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
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
                            "myAccount:components.changePassword.forms.passwordResetForm.inputs.currentPassword." +
                            "validations.invalid"
                        )
                    });

                    onAlertFired({
                        description: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "invalidCurrentPassword.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "invalidCurrentPassword.message"
                        )
                    });
                } else if (error.response && error.response.data && error.response.data.detail) {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    dispatch(setActiveForm(null));

                    onAlertFired({
                        description: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "submitError.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "submitError.message"
                        )
                    });
                } else {
                    // reset the form.
                    resetForm();
                    // hide the change password form
                    dispatch(setActiveForm(null));

                    // Generic error message
                    onAlertFired({
                        description: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
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

    const confirmationModal = (
        <Modal
            size="mini"
            open={ showConfirmationModal }
            onClose={ handleConfirmationModalClose }
            dimmer="blurring"
            data-testid={ `${testId}-confirmation-modal` }
        >
            <Modal.Content data-testid={ `${testId}-confirmation-modal-content` }>
                <Container>
                    <h3>{ t("myAccount:components.changePassword.modals.confirmationModal.heading") }</h3>
                </Container>
                <Divider hidden={ true } />
                <p>{ t("myAccount:components.changePassword.modals.confirmationModal.message") }</p>
            </Modal.Content>
            <Modal.Actions data-testid={ `${testId}-confirmation-modal-actions` }>
                <Button
                    className="link-button" onClick={ handleConfirmationModalClose }
                    data-testid={ `${testId}-confirmation-modal-actions-cancel-button` }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    primary={ true } onClick={ changePassword }
                    data-testid={ `${testId}-confirmation-modal-actions-continue-button` }
                >
                    { t("common:continue") }
                </Button>
            </Modal.Actions>
        </Modal>
    );

    const showChangePasswordView = activeForm === CommonConstants.SECURITY + CHANGE_PASSWORD_FORM_IDENTIFIER
        ? (
            <EditSection data-testid={ `${testId}-edit-section` } >
                <Forms
                    onSubmit={ (value) => {
                        setCurrentPassword(value.get("currentPassword").toString());
                        setNewPassword(value.get("newPassword").toString());
                        handleSubmit();
                    } }
                    resetState={ reset }
                    data-testid={ `${testId}-edit-section-form` }
                >
                    <Field
                        data-testid={ `${testId}-current-password-field` }
                        autoFocus={ true }
                        hidePassword={ t("common:hidePassword") }
                        label={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm.inputs"
                            + ".currentPassword.label"
                        ) }
                        name="currentPassword"
                        placeholder={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm.inputs." +
                            "currentPassword.placeholder"
                        ) }
                        required={ true }
                        requiredErrorMessage={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm." +
                            "inputs.currentPassword.validations.empty"
                        ) }
                        showPassword={ t("common:showPassword") }
                        type="password"
                        width={ 9 }
                    />
                    <Field
                        data-testid={ `${testId}-new-password-field` }
                        hidePassword={ t("common:hidePassword") }
                        label={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm.inputs" + ".newPassword.label"
                        ) }
                        name="newPassword"
                        placeholder={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm.inputs." +
                            "newPassword.placeholder"
                        ) }
                        required={ true }
                        requiredErrorMessage={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm." +
                            "inputs.newPassword.validations.empty"
                        ) }
                        showPassword={ t("common:showPassword") }
                        type="password"
                        width={ 9 }
                        listen={ (values: Map<string, FormValue>) => {
                            setPassword(values.get("newPassword").toString());
                        } }
                    />
                    <Form.Field width={ 9 } data-testid={ `${testId}-new-password-strength-meter-field` }>
                        <Suspense fallback={ null }>
                            <PasswordMeter
                                password={ password }
                                onChangeScore={ (score: number) => {
                                    setPasswordScore(score);
                                } }
                                scoreWords={ [
                                    t("common:tooShort"),
                                    t("common:weak"),
                                    t("common:okay"),
                                    t("common:good"),
                                    t("common:strong")
                                ] }
                                shortScoreWord={ t("common:tooShort") }
                            />
                        </Suspense>
                    </Form.Field>
                    <Field
                        data-testid={ `${testId}-new-password-confirm-field` }
                        hidePassword={ t("common:hidePassword") }
                        label={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm.inputs"
                            + ".confirmPassword.label"
                        ) }
                        name="confirmPassword"
                        placeholder={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm.inputs." +
                            "confirmPassword.placeholder"
                        ) }
                        required={ true }
                        requiredErrorMessage={ t(
                            "myAccount:components.changePassword.forms.passwordResetForm." +
                            "inputs.confirmPassword.validations.empty"
                        ) }
                        showPassword={ t("common:showPassword") }
                        type="password"
                        validation={ (value: string, validation: Validation, formValues) => {
                            if (formValues.get("newPassword") !== value) {
                                validation.isValid = false;
                                validation.errorMessages.push(
                                    t(
                                        "myAccount:components.changePassword.forms.passwordResetForm.inputs" +
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
                    <Form.Group data-testid={ `${testId}-form-actions-group` }>
                        <Field
                            size="small"
                            type="submit"
                            value={ t("common:submit").toString() }
                        />
                        <Field
                            className="link-button"
                            onClick={ () => {
                                dispatch(setActiveForm(null));
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
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.changePassword.description") }
            header={ t("myAccount:sections.changePassword.heading") }
            icon={ getSettingsSectionIcons().changePassword }
            iconMini={ getSettingsSectionIcons().changePasswordMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={
                () => dispatch(setActiveForm(CommonConstants.SECURITY + CHANGE_PASSWORD_FORM_IDENTIFIER))
            }
            primaryAction={ t("myAccount:sections.changePassword.actionTitles.change") }
            primaryActionIcon="key"
            showActionBar={ activeForm !== CommonConstants.SECURITY + CHANGE_PASSWORD_FORM_IDENTIFIER }
        >
            { showChangePasswordView }
            { confirmationModal }
        </SettingsSection>
    );
};

/**
 * Default props for the #ChangePassword component.
 * See type definitions in {@link ChangePasswordProps}
 */
ChangePassword.defaultProps = {
    "data-testid": "change-password"
};
