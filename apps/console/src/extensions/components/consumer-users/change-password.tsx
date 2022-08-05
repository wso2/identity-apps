/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { ProfileConstants } from "@wso2is/core/constants";
import { AlertInterface, AlertLevels, ProfileInfoInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import { Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List, Message, Modal } from "semantic-ui-react";
import { SharedUserStoreUtils } from "../../../features/core";
import { ConnectorPropertyInterface, ServerConfigurationsConstants } from "../../../features/server-configurations";
import { updateUserInfo } from "../../../features/users";
import { PRIMARY_USERSTORE_PROPERTY_VALUES, USERSTORE_REGEX_PROPERTIES } from "../../../features/userstores";

/**
 * import pass strength bat dynamically.
 */
const PasswordMeter = React.lazy(() => import("react-password-strength-bar"));

/**
 * Prop types for the change user password component.
 */
interface ChangePasswordPropsInterface extends TestableComponentInterface {
    /**
     * Handle closing the change password modal.
     */
    handleCloseChangePasswordModal: () => void;
    /**
     * Show or hide the change password modal.
     */
    openChangePasswordModal: boolean;
    /**
     * On alert fired callback.
     */
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * Handles force password reset trigger.
     */
    handleForcePasswordResetTrigger: () => void;
}

/**
 * Change user password component.
 *
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * @param {ChangePasswordPropsInterface} props - Props injected to the change user password component.
 * @return {ReactElement}
 */
export const ChangePasswordComponent: FunctionComponent<ChangePasswordPropsInterface> = (
    props: ChangePasswordPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate,
        openChangePasswordModal,
        handleCloseChangePasswordModal,
        handleForcePasswordResetTrigger,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isPasswordRegExLoading, setPasswordRegExLoading ] = useState<boolean>(false);
    const [ isPasswordPatternValid, setIsPasswordPatternValid ] = useState<boolean>(true);
    const [ password, setPassword ] = useState<string>("");
    const [ passwordResetOption, setPasswordResetOption ] = useState("setPassword");
    const [ triggerSubmit, setTriggerSubmit ] = useTrigger();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const handleModalClose = () => {
        setPassword("");
        setPasswordResetOption("setPassword");
    };

    const passwordResetOptions = [
        {
            label: t("console:manage.features.user.modals.changePasswordModal.passwordOptions.setPassword"),
            value: "setPassword"
        },
        {
            label: t("console:manage.features.user.modals.changePasswordModal.passwordOptions.forceReset"),
            value: "forceReset"
        }
    ];

    /**
     * Handle admin initiated password reset.
     */
    const handleForcePasswordReset = () => {
        const data = {
            "Operations": [
                {
                    "op": "add",
                    "value": {
                        [ProfileConstants.SCIM2_WSO2_USER_SCHEMA]: {
                            "forcePasswordReset": true
                        }
                    }
                }
            ],
            "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        setIsSubmitting(true);

        updateUserInfo(user.id, data).then(() => {
            onAlertFired({
                description: t(
                    "console:manage.features.user.profile.notifications.forcePasswordReset.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.user.profile.notifications.forcePasswordReset.success.message"
                )
            });
            handleForcePasswordResetTrigger();
            handleModalClose();
            handleCloseChangePasswordModal();
            handleUserUpdate(user.id);
        })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    onAlertFired({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.user.profile.notifications.forcePasswordReset.error." +
                            "message")
                    });

                    return;
                }

                onAlertFired({
                    description: t("console:manage.features.user.profile.notifications.forcePasswordReset." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.user.profile.notifications.forcePasswordReset.genericError." +
                        "message")
                });
                handleModalClose();
                handleCloseChangePasswordModal();
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * The following method handles the change of password reset option
     * and renders the relevant component accordingly.
     */
    const handlePasswordResetOptionChange = () => {
        if (passwordResetOption && passwordResetOption === "setPassword") {
            return (
                <>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                data-testid="user-mgt-edit-user-form-newPassword-input"
                                className="addon-field-wrapper"
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs.newPassword.label"
                                ) }
                                name="newPassword"
                                placeholder={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs." +
                                    "newPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "console:manage.features.user.forms.addUserForm." +
                                    "inputs.newPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value=""
                                listen={ handlePasswordChange }
                                loading={ isPasswordRegExLoading }
                                validation={ (value: string, validation: Validation) => {
                                    if (!isPasswordPatternValid) {
                                        validation.isValid = false;
                                        validation.errorMessages.push( "Your password must contain at lease 8 " +
                                            "characters, one uppercase and lowercase letter, one digit and symbol" );
                                    }
                                } }
                            />
                            <Suspense fallback={ null } >
                                <PasswordMeter password={ password } />
                            </Suspense>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                data-testid="user-mgt-edit-user-form-confirmPassword-input"
                                className="addon-field-wrapper"
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs.confirmPassword.label"
                                ) }
                                name="confirmPassword"
                                placeholder={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs." +
                                    "confirmPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "console:manage.features.user.forms.addUserForm." +
                                    "inputs.confirmPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value=""
                                validation={ (value: string, validation: Validation, formValues) => {
                                    if (formValues.get("newPassword") !== value) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:manage.features.user.forms.addUserForm.inputs" +
                                                ".confirmPassword.validations.mismatch"));
                                    }
                                } }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        } else {
            return (
                <>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Message
                                icon="mail"
                                content="An email with a link to reset the password will be sent to the provided
                                email address for the user to set their own password."
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        }
    };

    const handleChangeUserPassword = (values: Map<string, string | string[]>): void => {

        const data = {
            "Operations": [
                {
                    "op": "replace",
                    "value": {
                        "password": values.get("newPassword").toString()
                    }
                }
            ],
            "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        setIsSubmitting(true);

        updateUserInfo(user.id, data).then(() => {
            onAlertFired({
                description: t(
                    "console:manage.features.user.profile.notifications.changeUserPassword.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.user.profile.notifications.changeUserPassword.success.message"
                )
            });
            handleCloseChangePasswordModal();
            handleModalClose();
            handleUserUpdate(user.id);
        })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    onAlertFired({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.user.profile.notifications.changeUserPassword.error." +
                            "message")
                    });

                    return;
                }

                onAlertFired({
                    description: t("console:manage.features.user.profile.notifications.changeUserPassword." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.user.profile.notifications.changeUserPassword.genericError." +
                        "message")
                });
                handleCloseChangePasswordModal();
                handleModalClose();
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * The following function checks if the password pattern is valid against the user store regEx.
     *
     * @param password
     */
    const setPasswordRegEx = async (password: string): Promise<void> => {
        let passwordRegex = "";
        const userStore = user?.userName?.split("/")?.length > 1 ? user?.userName?.split("/")[0] : "primary";

        if (userStore !== "primary") {
            // Set the username regEx of the secondary user store.
            await SharedUserStoreUtils.getUserStoreRegEx(userStore, USERSTORE_REGEX_PROPERTIES.PasswordRegEx)
                .then((response) => {
                    setPasswordRegExLoading(true);
                    passwordRegex = response;
                });
        }
        setIsPasswordPatternValid(SharedUserStoreUtils.validateInputAgainstRegEx(password, passwordRegex));
    };

    /**
     * The following function handles the change of the password.
     *
     * @param values
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();
        setPassword(password);

        setPasswordRegEx(password)
            .finally(() => {
                setPasswordRegExLoading(false);
            });
    };

    /**
     * Resolve the modal content according to the number of password reset options
     * configured in the server.
     */
    const resolveModalContent = () => {
        return (
            <>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <Field
                            data-testid="user-mgt-add-user-form-passwordOption-radio-button"
                            type="radio"
                            label={ t("console:manage.features.user.forms.addUserForm.buttons." +
                                "radioButton.label") }
                            name="passwordOption"
                            default="setPassword"
                            listen={ (values) => {
                                setPasswordResetOption(values.get("passwordOption").toString());
                            } }
                            children={ passwordResetOptions }
                            value={ "setPassword" }
                            tabIndex={ 4 }
                            maxWidth={ 60 }
                            width={ 60 }
                        />
                    </Grid.Column>
                </Grid.Row>
                { handlePasswordResetOptionChange() }
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <Message color="teal">
                            <Hint>
                                { t("console:manage.features.user.modals.changePasswordModal.message") }
                            </Hint>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
            </>
        );
    };

    return (
        <Modal
            data-testid={ testId }
            open={ openChangePasswordModal }
            size="tiny"
        >
            <Modal.Header>
                { t("console:manage.features.user.modals.changePasswordModal.header") }
            </Modal.Header>
            <Modal.Content>
                <Forms
                    data-testid={ `${ testId }-form` }
                    onSubmit={ (values) => {
                        if (passwordResetOption === "setPassword") {
                            handleChangeUserPassword(values);
                        } else {
                            handleForcePasswordReset();
                        }
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        { resolveModalContent() }
                    </Grid>
                </Forms>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <PrimaryButton
                                data-testid={ `${ testId }-save-button` }
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                onClick={ () => setTriggerSubmit() }
                            >
                                { t("console:manage.features.user.modals.changePasswordModal.button") }
                            </PrimaryButton>
                            <LinkButton
                                data-testid={ `${ testId }-cancel-button` }
                                floated="left"
                                onClick={ () => {
                                    handleCloseChangePasswordModal();
                                    handleModalClose();
                                } }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Change password component default props.
 */
ChangePasswordComponent.defaultProps = {
    "data-testid": "user-mgt-change-password"
};
