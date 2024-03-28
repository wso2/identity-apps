/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, ProfileInfoInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, RadioChild, Validation, useTrigger } from "@wso2is/forms";
import { LinkButton, Message, PasswordValidation, PrimaryButton } from "@wso2is/react-components";
import React,
{
    FunctionComponent,
    ReactElement,
    ReactNode,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Icon, Modal, SemanticCOLORS } from "semantic-ui-react";
import { AppConstants, AppState, FeatureConfigInterface, SharedUserStoreUtils, history } from "../../core";
import { PatchRoleDataInterface } from "../../roles/models/roles";
import {
    ConnectorPropertyInterface,
    ServerConfigurationsConstants
} from "../../server-configurations";
import {
    PRIMARY_USERSTORE,
    USERSTORE_REGEX_PROPERTIES
} from "../../userstores/constants/user-store-constants";
import { useValidationConfigData } from "../../validation/api";
import { ValidationFormInterface } from "../../validation/models";
import { updateUserInfo } from "../api";
import { getConfiguration } from "../utils";

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
     * Password reset connector properties
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Handles force password reset trigger.
     */
    handleForcePasswordResetTrigger?: () => void;
}

/**
 * Change user password component.
 *
 * @param props - Props injected to the change user password component.
 * @returns ChangePasswordComponent
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
        connectorProperties,
        handleForcePasswordResetTrigger,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ passwordConfig, setPasswordConfig ] = useState<ValidationFormInterface>(undefined);
    const [ userStorePasswordRegex, setUserStorePasswordRegex ] = useState<string>("");
    const [ isPasswordRegExLoading, setPasswordRegExLoading ] = useState<boolean>(false);
    const [ isPasswordPatternValid, setIsPasswordPatternValid ] = useState<boolean>(true);
    const [ isConfirmPasswordMatch, setIsConfirmPasswordMatch ] = useState<boolean>(undefined);
    const [ password, setPassword ] = useState<string>("");
    const [ passwordResetOption, setPasswordResetOption ] = useState("setPassword");
    const [ triggerSubmit, setTriggerSubmit ] = useTrigger();
    const [
        governanceConnectorProperties,
        setGovernanceConnectorProperties
    ] = useState<ConnectorPropertyInterface[]>(undefined);
    const [ forcePasswordReset, setForcePasswordReset ] = useState<string>("false");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const customUserSchemaURI: string = useSelector(
        (state: AppState) => state?.config?.ui?.customUserSchemaURI);

    const {
        data: validationConfig
    } = useValidationConfigData();

    /**
     * Retrieve the password validation configuration from the validation data.
     */
    useEffect(() => {
        if (validationConfig) {
            setPasswordConfig(getConfiguration(validationConfig));
        }
    }, [ validationConfig ]);

    /**
     * This gets regex for the current user's userstore.
     */
    useEffect(() => {
        setPasswordRegExLoading(true);
        const userNameComponents: string[] = user?.userName?.split("/");
        const userStore: string = userNameComponents?.length > 1 ? userNameComponents[0] : PRIMARY_USERSTORE;

        SharedUserStoreUtils.getUserStoreRegEx(userStore, USERSTORE_REGEX_PROPERTIES.PasswordRegEx)
            .then((response: string) => {
                setUserStorePasswordRegex(response);
            })
            .finally(() => {
                setPasswordRegExLoading(false);
            });
    }, [ user ]);

    useEffect(() => {
        if (!connectorProperties) {
            return;
        }

        if (governanceConnectorProperties === undefined) {
            setGovernanceConnectorProperties(connectorProperties);
        }
    }, [ connectorProperties ]);

    useEffect(() => {

        if (governanceConnectorProperties &&
            Array.isArray(governanceConnectorProperties) &&
            governanceConnectorProperties?.length > 0) {

            for (const property of governanceConnectorProperties) {
                if (property.name === ServerConfigurationsConstants.RECOVERY_LINK_PASSWORD_RESET) {

                    if(property.value === "true") {
                        setForcePasswordReset(property.value);
                    }
                }
            }
        }
    }, [ governanceConnectorProperties ]);

    const handleModalClose = () => {
        setPassword("");
        setPasswordResetOption("setPassword");
        setIsConfirmPasswordMatch(undefined);
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
        if (forcePasswordReset === "false") {
            onAlertFired({
                description: t(
                    "user:profile.notifications.noPasswordResetOptions.error.description"
                ),
                level: AlertLevels.WARNING,
                message: t(
                    "user:profile.notifications.noPasswordResetOptions.error.message"
                )
            });

            return;
        }

        const data: PatchRoleDataInterface = {
            "Operations": [
                {
                    "op": "add",
                    "value": {
                        [ customUserSchemaURI ]: {
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
            handleForcePasswordResetTrigger && handleForcePasswordResetTrigger();
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

    const handleLoginAndRegistrationPageRedirect = () => {
        history.push(AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
            .replace(":categoryId",
                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
            .replace(":connectorId",
                ServerConfigurationsConstants.ADMIN_FORCED_PASSWORD_RESET));
    };

    const resolveConfigurationList = (governanceConnectorProperties: ConnectorPropertyInterface[]): ReactNode => {
        return governanceConnectorProperties?.map((property: ConnectorPropertyInterface, index: number) => {
            if (property?.name === ServerConfigurationsConstants.RECOVERY_LINK_PASSWORD_RESET) {
                if (property?.value === "true") {
                    return (
                        <Grid.Row key={ index }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Message
                                    key={ index }
                                    hideDefaultIcon
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
                    );
                }

                return (
                    <Grid.Row key={ index }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Message
                                hideDefaultIcon
                                error
                                key={ index }
                                content={
                                    (
                                        <>
                                            <Icon color="red" name="times circle" />
                                            <Trans
                                                i18nKey={ "extensions:manage.users.editUserProfile.resetPassword." +
                                                    "changePasswordModal.passwordResetConfigDisabled" }>
                                                Password reset via recovery email is not enabled.
                                                Please make sure to enable it from
                                                {
                                                    hasRequiredScopes(featureConfig?.loginAndRegistration,
                                                        featureConfig?.loginAndRegistration?.scopes?.feature,
                                                        allowedScopes)
                                                        ? (
                                                            <a
                                                                onClick={ handleLoginAndRegistrationPageRedirect }
                                                                className="ml-1 external-link link pointing primary"
                                                            >
                                                                Login and Registration
                                                            </a>
                                                        ) : "Login and Registration"
                                                } configurations
                                            </Trans>
                                        </>
                                    )
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        });
    };

    /**
     * Callback function to validate password.
     *
     * @param isValid - validation status.
     */
    const onPasswordValidate = (isValid: boolean): void => {
        setIsPasswordPatternValid(isValid);
    };

    /**
     * The following function handles the change of the password.
     *
     * @param values - values of form field
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values?.get("newPassword")?.toString();

        setPassword(password);
    };

    /**
     * Verify whether the provided password is valid.
     *
     * @param password - The password to validate.
     */
    const isNewPasswordValid = (password: string) => {
        if (passwordConfig) {
            return isPasswordPatternValid;
        }

        return SharedUserStoreUtils.validateInputAgainstRegEx(password, userStorePasswordRegex);
    };

    /**
     * Validate password and display an error message when the password is invalid.
     *
     * @param value - The value of the password field.
     * @param validation - The validation object.
     */
    const validateNewPassword = (value: string, validation: Validation) => {
        if (!isNewPasswordValid(value)) {
            validation.isValid = false;
            validation?.errorMessages?.push(passwordConfig ?
                t(
                    "extensions:manage.features.user.addUser.validation.error.passwordValidation"
                ) : t(
                    "extensions:manage.features.user.addUser.validation.password"
                ));
        }
    };

    /**
     * The following method returns the password reset form fields.
     */
    const passwordFormFields = () => {
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
                            listen={ handlePasswordChange }
                            loading={ isPasswordRegExLoading }
                            validation={ validateNewPassword }
                        />
                        { passwordConfig && (
                            <PasswordValidation
                                password={ password }
                                minLength={ Number(passwordConfig?.minLength) }
                                maxLength={ Number(passwordConfig?.maxLength) }
                                minNumbers={ Number(passwordConfig?.minNumbers) }
                                minUpperCase={ Number(passwordConfig?.minUpperCaseCharacters) }
                                minLowerCase={ Number(passwordConfig?.minLowerCaseCharacters) }
                                minSpecialChr={ Number(passwordConfig?.minSpecialCharacters) }
                                minUniqueChr={ Number(passwordConfig?.minUniqueCharacters) }
                                maxConsecutiveChr={ Number(passwordConfig?.maxConsecutiveCharacters) }
                                onPasswordValidate={ onPasswordValidate }
                                translations={ {
                                    case: (Number(passwordConfig?.minUpperCaseCharacters) > 0 &&
                                        Number(passwordConfig?.minLowerCaseCharacters) > 0) ?
                                        t("extensions:manage.features.user.addUser.validation.passwordCase", {
                                            minLowerCase: passwordConfig?.minLowerCaseCharacters,
                                            minUpperCase: passwordConfig?.minUpperCaseCharacters
                                        }) : (
                                            Number(passwordConfig?.minUpperCaseCharacters) > 0 ?
                                                t("extensions:manage.features.user.addUser.validation.upperCase", {
                                                    minUpperCase: passwordConfig?.minUpperCaseCharacters
                                                }) : t("extensions:manage.features.user.addUser.validation" +
                                                    ".lowerCase", {
                                                    minLowerCase: passwordConfig?.minLowerCaseCharacters
                                                })
                                        ),
                                    consecutiveChr:
                                        t("extensions:manage.features.user.addUser.validation." +
                                            "consecutiveCharacters", {
                                            repeatedChr: passwordConfig?.maxConsecutiveCharacters
                                        }),
                                    length: t("extensions:manage.features.user.addUser.validation.passwordLength", {
                                        max: passwordConfig?.maxLength, min: passwordConfig?.minLength
                                    }),
                                    numbers:
                                        t("extensions:manage.features.user.addUser.validation.passwordNumeric", {
                                            min: passwordConfig?.minNumbers
                                        }),
                                    specialChr:
                                        t("extensions:manage.features.user.addUser.validation.specialCharacter", {
                                            specialChr: passwordConfig?.minSpecialCharacters
                                        }),
                                    uniqueChr:
                                        t("extensions:manage.features.user.addUser.validation.uniqueCharacters", {
                                            uniqueChr: passwordConfig?.minUniqueCharacters
                                        })
                                } }
                            />
                        ) }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <Field
                            data-testid="user-mgt-edit-user-form-confirmPassword-input"
                            className="addon-field-wrapper"
                            hidePassword={ t("common:hidePassword") }
                            label={ t(
                                "user:forms.addUserForm.inputs.confirmPassword.label"
                            ) }
                            name="confirmPassword"
                            placeholder={ t(
                                "user:forms.addUserForm.inputs." +
                                "confirmPassword.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "user:forms.addUserForm." +
                                "inputs.confirmPassword.validations.empty"
                            ) }
                            showPassword={ t("common:showPassword") }
                            type="password"
                            value=""
                            listen={ (values: Map<string, FormValue>): void => {
                                if (values?.get("newPassword") === values?.get("confirmPassword")
                                    && values?.get("confirmPassword") !== "") {
                                    setIsConfirmPasswordMatch(true);

                                    return;
                                }

                                if (isConfirmPasswordMatch !== undefined) {
                                    setIsConfirmPasswordMatch(undefined);
                                }
                            } }
                            validation={
                                (value: string, validation: Validation, formValues: Map<string, FormValue>) => {
                                    if (formValues?.get("newPassword") !== value) {
                                        validation.isValid = false;
                                        setIsConfirmPasswordMatch(false);
                                        validation?.errorMessages?.push(
                                            t("user:forms.addUserForm.inputs" +
                                            ".confirmPassword.validations.mismatch"));
                                    }
                                }
                            }
                        />
                        <div className="password-policy-description">
                            <Icon
                                className={
                                    isConfirmPasswordMatch === undefined
                                        ? "circle thin"
                                        : isConfirmPasswordMatch
                                            ? "check circle"
                                            : "remove circle"
                                }
                                color={
                                    isConfirmPasswordMatch === undefined
                                        ? "grey" as SemanticCOLORS
                                        : isConfirmPasswordMatch
                                            ? "green" as SemanticCOLORS
                                            : "red" as SemanticCOLORS
                                }
                                inverted
                            />
                            <p>{ t("extensions:manage.features.user.addUser.validation.confirmPassword") }</p>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </>
        );
    };

    /**
     * The following method handles the change of password reset option
     * and renders the relevant component accordingly.
     */
    const handlePasswordResetOptionChange = () => {
        if (passwordResetOption && passwordResetOption === "setPassword") {
            return passwordFormFields();
        } else {
            return resolveConfigurationList(governanceConnectorProperties);
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
            .catch((error: any) => {
                if (error.response && error.response.data && error.response.data.description) {
                    onAlertFired({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("user:profile.notifications.changeUserPassword.error." +
                        "message")
                    });

                    return;
                }

                onAlertFired({
                    description: t("user:profile.notifications.changeUserPassword" +
                        ".genericError.description"),
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
        if (governanceConnectorProperties?.length > 1) {
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
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Message
                                type="warning"
                                content={ t("user:modals.changePasswordModal.message") }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        } else {
            return (
                <>
                    { passwordFormFields() }
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Message
                                type="warning"
                                content={ t("user:modals.changePasswordModal.message") }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        }
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
