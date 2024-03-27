/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, ProfileInfoInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, RadioChild, Validation, useTrigger } from "@wso2is/forms";
import {
    Hint, LinkButton, PasswordValidation, PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Message, Modal } from "semantic-ui-react";
import { SharedUserStoreUtils } from "../../../../../features/core";
import { PatchRoleDataInterface } from "../../../../../features/roles/models/roles";
import {
    ConnectorPropertyInterface,
    ServerConfigurationsConstants
} from "../../../../../features/server-configurations";
import { updateUserInfo } from "../../../../../features/users/api/users";
import { USERSTORE_REGEX_PROPERTIES } from "../../../../../features/userstores/constants/user-store-constants";
import { ValidationFormInterface } from "../../../../../features/validation/models";
import { CONSUMER_USERSTORE } from "../../../users/constants";

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
    /**
     * Password reset connector properties.
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Password configurations.
     */
    passwordConfig?: ValidationFormInterface;
    /**
     * Email attribute availability.
     */
    isEmailAvailable?: boolean;
    /**
     * Username configurations.
     */
    usernameConfig?: ValidationFormInterface;
}

/**
 * Change user password component.
 *
 * @param props - Props injected to the change user password component.
 *
 * @returns Change user password component.
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
        connectorProperties,
        passwordConfig,
        isEmailAvailable,
        usernameConfig,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ password, setPassword ] = useState<string>("");
    const [ passwordResetOption, setPasswordResetOption ] = useState("setPassword");
    const [ validityPeriod, setValidityPeriod ] = useState<string>("");
    const [ triggerSubmit, setTriggerSubmit ] = useTrigger();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isValidPassword, setIsValidPassword ] = useState<boolean>(true);

    useEffect(() => {
        if (validityPeriod !== "") {
            return;
        }
        if (connectorProperties && Array.isArray(connectorProperties) && connectorProperties?.length > 0) {
            for (const property of connectorProperties) {
                if (property.name === ServerConfigurationsConstants.RECOVERY_LINK_EXPIRY_TIME) {
                    setValidityPeriod(property.value);

                    break;
                }
            }
        }
    }, [ connectorProperties ]);

    /**
     * Callback function to validate password.
     *
     * @param valid - validation status.
     */
    const onPasswordValidate = (valid: boolean): void => {
        setIsValidPassword(valid);
    };

    const handleModalClose = () => {
        setPassword("");
        setPasswordResetOption("setPassword");
    };

    const passwordResetOptions: RadioChild[] = [
        {
            label: t("user:modals.changePasswordModal.passwordOptions.setPassword"),
            value: "setPassword"
        },
        {
            label: t("user:modals.changePasswordModal.passwordOptions.forceReset"),
            value: "forceReset"
        }
    ];

    /**
     * Handle admin initiated password reset.
     */
    const handleForcePasswordReset = () => {
        const data: PatchRoleDataInterface = {
            "Operations": [
                {
                    "op": "add",
                    "value": {
                        [ ProfileConstants.SCIM2_WSO2_USER_SCHEMA ]: {
                            "forcePasswordReset": true
                        }
                    }
                }
            ],
            "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateUserInfo(user.id, data).then(() => {
            onAlertFired({
                description: t(
                    "user:profile.notifications.forcePasswordReset.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "user:profile.notifications.forcePasswordReset.success.message"
                )
            });
            handleForcePasswordResetTrigger();
            handleModalClose();
            handleCloseChangePasswordModal();
            handleUserUpdate(user.id);
        })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    onAlertFired({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("user:profile.notifications.forcePasswordReset.error." +
                            "message")
                    });

                    return;
                }

                onAlertFired({
                    description: t("user:profile.notifications.forcePasswordReset." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("user:profile.notifications.forcePasswordReset.genericError." +
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
     * The following function handles the change of the password.
     *
     * @param values - Form values.
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();

        setPassword(password);
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
                                    "user:forms.addUserForm.inputs.newPassword.label"
                                ) }
                                name="newPassword"
                                placeholder={ t(
                                    "user:forms.addUserForm.inputs." +
                                    "newPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "user:forms.addUserForm." +
                                    "inputs.newPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value=""
                                validation={ async (
                                    value: string,
                                    validation: Validation
                                ) => {
                                    const passwordRegex: string = await SharedUserStoreUtils.getUserStoreRegEx(
                                        CONSUMER_USERSTORE,
                                        USERSTORE_REGEX_PROPERTIES.PasswordRegEx
                                    );

                                    if (passwordConfig) {
                                        if (!isValidPassword) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t(
                                                    "extensions:manage.features.user.addUser.validation." +
                                                    "error.passwordValidation"
                                                )
                                            );
                                        }
                                    } else if (
                                        !SharedUserStoreUtils.validateInputAgainstRegEx(
                                            value,
                                            passwordRegex
                                        )
                                    ) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            "Your password must contain a minimum of 8 " +
                                            "characters including at least one uppercase letter, one lowercase " +
                                            "letter, and one number."
                                        );
                                    }
                                } }
                                listen={ handlePasswordChange }
                            />
                            { passwordConfig && (
                                <PasswordValidation
                                    password={ password }
                                    minLength={ Number(passwordConfig.minLength) }
                                    maxLength={ Number(passwordConfig.maxLength) }
                                    minNumbers={ Number(
                                        passwordConfig.minNumbers
                                    ) }
                                    minUpperCase={ Number(
                                        passwordConfig.minUpperCaseCharacters
                                    ) }
                                    minLowerCase={ Number(
                                        passwordConfig.minLowerCaseCharacters
                                    ) }
                                    minSpecialChr={ Number(
                                        passwordConfig.minSpecialCharacters
                                    ) }
                                    minUniqueChr={ Number(
                                        passwordConfig.minUniqueCharacters
                                    ) }
                                    maxConsecutiveChr={ Number(
                                        passwordConfig.maxConsecutiveCharacters
                                    ) }
                                    onPasswordValidate={ onPasswordValidate }
                                    translations={ {
                                        case:
                                            Number(
                                                passwordConfig?.minUpperCaseCharacters
                                            ) > 0 &&
                                                Number(
                                                    passwordConfig?.minLowerCaseCharacters
                                                ) > 0
                                                ? t(
                                                    "extensions:manage.features.user.addUser.validation.passwordCase",
                                                    {
                                                        minLowerCase:
                                                            passwordConfig.minLowerCaseCharacters,
                                                        minUpperCase:
                                                            passwordConfig.minUpperCaseCharacters
                                                    }
                                                )
                                                : Number(
                                                    passwordConfig?.minUpperCaseCharacters
                                                ) > 0
                                                    ? t(
                                                        "extensions:manage.features.user.addUser.validation.upperCase",
                                                        {
                                                            minUpperCase:
                                                                passwordConfig.minUpperCaseCharacters
                                                        }
                                                    )
                                                    : t(
                                                        "extensions:manage.features.user.addUser.validation" +
                                                        ".lowerCase",
                                                        {
                                                            minLowerCase:
                                                                passwordConfig.minLowerCaseCharacters
                                                        }
                                                    ),
                                        consecutiveChr: t(
                                            "extensions:manage.features.user.addUser.validation.consecutiveCharacters",
                                            {
                                                repeatedChr:
                                                    passwordConfig.maxConsecutiveCharacters
                                            }
                                        ),
                                        length: t(
                                            "extensions:manage.features.user.addUser.validation.passwordLength",
                                            {
                                                max: passwordConfig.maxLength,
                                                min: passwordConfig.minLength
                                            }
                                        ),
                                        numbers: t(
                                            "extensions:manage.features.user.addUser.validation.passwordNumeric",
                                            {
                                                min: passwordConfig.minNumbers
                                            }
                                        ),
                                        specialChr: t(
                                            "extensions:manage.features.user.addUser.validation.specialCharacter",
                                            {
                                                specialChr:
                                                    passwordConfig.minSpecialCharacters
                                            }
                                        ),
                                        uniqueChr: t(
                                            "extensions:manage.features.user.addUser.validation.uniqueCharacters",
                                            {
                                                uniqueChr:
                                                    passwordConfig.minUniqueCharacters
                                            }
                                        )
                                    } }
                                />
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Message visible warning>
                                <Hint warning>
                                    { t(
                                        "user:modals.changePasswordModal.hint.setPassword"
                                    ) }
                                </Hint>
                            </Message>
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        } else {
            if (
                !isEmailAvailable
                && usernameConfig?.enableValidator === "true"
            ) {
                return (
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Message visible warning>
                                <Hint warning>
                                    {
                                        t("extensions:manage.users." +
                                        "editUserProfile.resetPassword." +
                                        "changePasswordModal.emailUnavailableWarning")
                                    }
                                </Hint>
                            </Message>
                        </Grid.Column>
                    </Grid.Row>
                );
            } else {
                return (
                    <>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Message
                                    icon="mail"
                                    content=
                                        {
                                            t("extensions:manage.users." +
                                            "editUserProfile.resetPassword." +
                                            "changePasswordModal.emailResetWarning")
                                        }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Message visible warning>
                                    <Hint warning>
                                        { t("user:modals.changePasswordModal.hint.forceReset",
                                            { codeValidityPeriod: validityPeriod }) }
                                    </Hint>
                                </Message>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                );
            }
        }
    };

    const handleChangeUserPassword = (values: Map<string, string | string[]>): void => {

        const data: PatchRoleDataInterface = {
            "Operations": [
                {
                    "op": "replace",
                    "value": {
                        "password": values.get("newPassword").toString()
                    }
                }
            ],
            "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateUserInfo(user.id, data).then(() => {
            onAlertFired({
                description: t(
                    "user:profile.notifications.changeUserPassword.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "user:profile.notifications.changeUserPassword.success.message"
                )
            });
            handleCloseChangePasswordModal();
            handleModalClose();
            handleUserUpdate(user.id);
        })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: error.response.data.detail,
                        level: AlertLevels.ERROR,
                        message: t("user:profile.notifications.changeUserPassword.error." +
                            "message")
                    });

                    return;
                }

                onAlertFired({
                    description: t("user:profile.notifications.changeUserPassword." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("user:profile.notifications.changeUserPassword.genericError." +
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
                            label={ t("user:forms.addUserForm.buttons." +
                                "radioButton.label") }
                            name="passwordOption"
                            default="setPassword"
                            listen={ (values: Map<string, FormValue>) => {
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
                { t("user:modals.changePasswordModal.header") }
            </Modal.Header>
            <Modal.Content>
                <Forms
                    data-testid={ `${ testId }-form` }
                    onSubmit={ (values: Map<string, FormValue>) => {
                        if (passwordResetOption === "setPassword") {
                            handleChangeUserPassword(values);
                        } else if (isEmailAvailable) {
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
                                { t("user:modals.changePasswordModal.button") }
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
