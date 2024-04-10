/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import useUIConfig from "../../../../admin.core.v1/hooks/use-ui-configs";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Button, Hint, Link, PasswordValidation, Popup } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Dropdown, DropdownItemProps, DropdownProps, Form, Grid, Menu, Message, Radio } from "semantic-ui-react";
import { AppConstants } from "../../../../admin.core.v1/constants";
import { history } from "../../../../admin.core.v1/helpers/history";
import { EventPublisher } from "../../../../admin.core.v1/utils/event-publisher";
import { SharedUserStoreUtils } from "../../../../admin.core.v1/utils/user-store-utils";
import { userConfig } from "../../../../admin.extensions.v1/configs/user";
import { userstoresConfig } from "../../../../admin.extensions.v1/configs/userstores";
import {
    ServerConfigurationsConstants
} from "../../../../admin.server-configurations.v1/constants/server-configurations-constants";
import { useUserStore } from "../../../../admin.userstores.v1/api/user-stores";
import { USERSTORE_REGEX_PROPERTIES } from "../../../../admin.userstores.v1/constants";
import { UserStoreProperty } from "../../../../admin.userstores.v1/models/user-stores";
import { ValidationDataInterface, ValidationFormInterface } from "../../../../admin.validation.v1/models";
import { getUsersList } from "../../../api/users";
import {
    AskPasswordOptionTypes,
    HiddenFieldNames,
    PasswordOptionTypes,
    UserManagementConstants
} from "../../../constants";
import {
    BasicUserDetailsInterface,
    UserListInterface
} from "../../../models/user";
import {
    generatePassword,
    getConfiguration,
    getUsernameConfiguration
} from "../../../utils";


/**
 * Proptypes for the add user component.
 */
export interface AddUserProps {
    initialValues: any;
    triggerSubmit: boolean;
    emailVerificationEnabled: boolean;
    onSubmit: (values: BasicUserDetailsInterface) => void;
    hiddenFields?: (HiddenFieldNames)[];
    requestedPasswordOption?: PasswordOptionTypes;
    isUserstoreRequired?: boolean;
    isFirstNameRequired?: boolean;
    isLastNameRequired?: boolean;
    isEmailRequired?: boolean;
    validationConfig?: ValidationDataInterface[];
    setUserSummaryEnabled: (toggle: boolean) => void;
    setAskPasswordFromUser?: (toggle: boolean) => void;
    setOfflineUser?: (toggle: boolean) => void;
    selectedUserStore?: string;
    setSelectedUserStore?: (selectedUserStore: string) => void;
    isBasicDetailsLoading?: boolean;
    setBasicDetailsLoading?: (toggle: boolean) => void;
    readWriteUserStoresList: DropdownItemProps[];
    isUserStoreError: boolean;
}

/**
 * Add user basic component.
 *
 * @returns ReactElement
 */
export const AddUserUpdated: React.FunctionComponent<AddUserProps> = (
    props: AddUserProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        emailVerificationEnabled,
        onSubmit,
        hiddenFields,
        isUserstoreRequired,
        isFirstNameRequired,
        isLastNameRequired,
        isEmailRequired,
        setUserSummaryEnabled,
        setAskPasswordFromUser,
        selectedUserStore,
        setSelectedUserStore,
        setOfflineUser,
        isBasicDetailsLoading,
        setBasicDetailsLoading,
        validationConfig,
        readWriteUserStoresList,
        isUserStoreError
    } = props;

    const [ passwordOption, setPasswordOption ] = useState<PasswordOptionTypes>(userConfig.defaultPasswordOption);
    const [ askPasswordOption, setAskPasswordOption ] = useState<string>(userConfig.defautlAskPasswordOption);
    const [ password, setPassword ] = useState<string>(initialValues?.newPassword ?? "");
    const [ passwordConfig, setPasswordConfig ] = useState<ValidationFormInterface>(undefined);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>(undefined);
    const [ isValidPassword, setIsValidPassword ] = useState<boolean>(true);
    const [ randomPassword, setRandomPassword ] = useState<string>(undefined);
    const [ userStore, setUserStore ] = useState<string>(userstoresConfig.primaryUserstoreId);
    const [ isValidEmail, setIsValidEmail ] = useState<boolean>(false);
    const [ isEmailFilled, setIsEmailFilled ] = useState<boolean>(false);

    const formBottomRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();
    const emailRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    const { UIConfig } = useUIConfig();

    // Username input validation error messages.
    const USER_ALREADY_EXIST_ERROR_MESSAGE: string = t("users:consumerUsers.fields." +
        "username.validations.invalid");
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("users:consumerUsers.fields." +
        "username.validations.regExViolation");
    const USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE: string = t("users:consumerUsers.fields." +
        "username.validations.invalidCharacters");
    const USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE: string =
    t("extensions:manage.features.user.addUser.validation." +
        "usernameSymbols");
    const USERNAME_HAS_INVALID_SPECIAL_SYMBOLS_ERROR_MESSAGE: string = t("extensions:manage.features.user.addUser." +
    "validation.usernameSpecialCharSymbols");
    const USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE: string =
        t("extensions:manage.features.user.addUser.validation.usernameLength", {
            maxLength: usernameConfig?.maxLength,
            minLength: usernameConfig?.minLength
        });

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    // Hook to get the userstore details of the selected userstore.
    const {
        data: originalUserStore
    } = useUserStore(
        userStore
    );

    const userStoreRegex: string = useMemo(() => {
        if (originalUserStore) {
            return originalUserStore?.properties?.find(
                (property: UserStoreProperty) => property.name === USERSTORE_REGEX_PROPERTIES.UsernameRegEx)?.value;
        }
    }, [ originalUserStore ]);

    const passwordRegex: string = useMemo(() => {
        if (originalUserStore) {
            return originalUserStore?.properties?.find(
                (property: UserStoreProperty) => property.name === USERSTORE_REGEX_PROPERTIES.PasswordRegEx)?.value;
        }
    }, [ originalUserStore ]);

    /**
     *
     * It toggles user summary, password creation prompt, offline status according to password options.
     */
    useEffect(() => {
        if (passwordOption === PasswordOptionTypes.CREATE_PASSWORD) {
            setUserSummaryEnabled(true);
            setAskPasswordFromUser(true);
            setOfflineUser(false);
        } else {
            if (askPasswordOption === "offline") {
                setUserSummaryEnabled(true);
                setAskPasswordFromUser(false);
                setOfflineUser(true);

                return;
            }
            setUserSummaryEnabled(false);
            setAskPasswordFromUser(false);
            setOfflineUser(false);
        }
    }, [ passwordOption, askPasswordOption ]);

    /**
     * This sets the username and password validation rules.
     */
    useEffect(() => {
        if (validationConfig) {
            setPasswordConfig(getConfiguration(validationConfig));
            setUsernameConfig(getUsernameConfiguration(validationConfig));
        }
    }, [ validationConfig ]);

    useEffect(() => {
        if (!isAlphanumericUsernameEnabled()) {
            setIsValidEmail(true);
        } else {
            setIsValidEmail(false);
        }
    }, [ usernameConfig ]);

    /**
     * Check whether the alphanumeric usernames are enabled.
     *
     * @returns isAlphanumericUsernameEnabled - validation status.
     */
    const isAlphanumericUsernameEnabled = (): boolean => usernameConfig?.enableValidator === "true";

    /**
     * Callback function to validate password.
     *
     * @param valid - validation status.
     * @param validationStatus - detailed validation status.
     */
    const onPasswordValidate = (valid: boolean): void => {
        setIsValidPassword(valid);
    };

    const askPasswordOptionData: any = {
        "data-testid": "user-mgt-add-user-form-ask-password-option-radio-button",
        label: t("user:forms.addUserForm.buttons.radioButton.options.askPassword"),
        value: PasswordOptionTypes.ASK_PASSWORD
    };

    const createPasswordOptionData: any = {
        "data-testid": "user-mgt-add-user-form-create-password-option-radio-button",
        label: t("user:forms.addUserForm.buttons.radioButton.options.createPassword"),
        value: PasswordOptionTypes.CREATE_PASSWORD
    };

    /**
     * The following function handles the change of the password.
     *
     * @param values - Map of form values.
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();

        setPassword(password);
    };

    /**
     * The following function handles email empty validation.
     *
     * @param values - Map of form values.
     */
    const handleEmailEmpty = (values: Map<string, FormValue>): void => {
        if (values.get("email")?.toString() === "") {
            setIsEmailFilled(false);
        } else {
            setIsEmailFilled(true);
        }
    };

    const getFormValues = (values: Map<string, FormValue>): BasicUserDetailsInterface => {
        eventPublisher.publish("manage-users-customer-password-option", {
            type: passwordOption
        });

        return {
            domain: selectedUserStore,
            email: values.get("email")?.toString(),
            firstName: values.get("firstName")?.toString(),
            lastName: values.get("lastName")?.toString(),
            newPassword: values.get("newPassword") && values.get("newPassword") !== undefined
                ? values.get("newPassword").toString()
                : "",
            passwordOption: passwordOption,
            userName: UIConfig?.enableEmailDomain
                ? values.get("email")?.toString()
                : values.get("username")?.toString()
        };
    };

    /**
     * Scrolls to the first field that throws an error.
     *
     * @param field - field The name of the field.
     */
    const scrollToInValidField = (field: string): void => {
        const options: ScrollIntoViewOptions = {
            behavior: "smooth",
            block: "center"
        };

        switch (field) {
            case "email":
                emailRef.current.scrollIntoView(options);

                break;
            case "formBottom":
                formBottomRef.current.scrollIntoView(options);

                break;
        }
    };

    /**
     * Verify whether the provided password is valid.
     *
     * @param password - The password to validate.
     */
    const isNewPasswordValid = async (password: string) => {
        if (passwordConfig) {
            return isValidPassword;
        }

        return SharedUserStoreUtils.validateInputAgainstRegEx(password, passwordRegex);
    };

    /**
     * Validate password and display an error message when the password is invalid.
     *
     * @param value - The value of the password field.
     * @param validation - The validation object.
     */
    const validateNewPassword = async (value: string, validation: Validation) => {
        if (!await isNewPasswordValid(value)) {
            validation.isValid = false;
            validation.errorMessages.push(passwordConfig ?
                t(
                    "extensions:manage.features.user.addUser.validation.error.passwordValidation"
                ) : t(
                    "extensions:manage.features.user.addUser.validation.password"
                ));
        }
        scrollToInValidField("formBottom");
    };

    const resolveAskPasswordOptionPopupContent = (): ReactElement => {
        if (!emailVerificationEnabled) {
            return (
                <Trans
                    i18nKey="user:modals.addUserWizard.askPassword.emailVerificationDisabled"
                >
                    To invite users to set the password, enable email invitations for user password setup from <Link
                        onClick={ () => history.push(AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                            .replace(":connectorId", ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID)) }
                        external={ false }
                    >Login & Registration settings</Link>.
                </Trans>
            );
        }

        if (!isEmailFilled || !isValidEmail) {
            return t(
                "user:modals.addUserWizard.askPassword.emailInvalid"
            );
        }

        return null;
    };

    const renderAskPasswordOption = (): ReactElement => {
        return (
            <div className="mt-4 mb-4 ml-4">
                <Menu
                    compact={ true }
                    size="small"
                    className="mb-4"
                >
                    {
                        !emailVerificationEnabled? (
                            <Popup
                                basic
                                inverted
                                position="top center"
                                content={ resolveAskPasswordOptionPopupContent() }
                                hoverable
                                trigger={
                                    (
                                        <Menu.Item
                                            name={ t("user:modals.addUserWizard" +
                                                ".askPassword.inviteViaEmail") }
                                            disabled
                                        />
                                    )
                                }
                            />
                        ) : (
                            <Menu.Item
                                name={ t("user:modals.addUserWizard" +
                                    ".askPassword.inviteViaEmail") }
                                active={ askPasswordOption === AskPasswordOptionTypes.EMAIL }
                                onClick={ () => setAskPasswordOption(AskPasswordOptionTypes.EMAIL) }
                            />
                        )
                    }
                    <Menu.Item
                        name={ t("user:modals.addUserWizard" +
                            ".askPassword.inviteOffline") }
                        active={ askPasswordOption === AskPasswordOptionTypes.OFFLINE }
                        onClick={ () => setAskPasswordOption(AskPasswordOptionTypes.OFFLINE) }
                    />
                </Menu>
                {
                    resolveAskPasswordOption()
                }
            </div>
        );
    };

    const resolveAskPasswordOption = (): ReactElement => {
        if (askPasswordOption === AskPasswordOptionTypes.EMAIL) {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Message
                            icon="mail"
                            content={ t(
                                "extensions:manage.features.user.addUser.inviteUserTooltip"
                            ) }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        if (askPasswordOption === AskPasswordOptionTypes.OFFLINE) {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Message
                            icon="copy"
                            content={ t(
                                "extensions:manage.features.user.addUser.inviteUserOfflineTooltip"
                            ) }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        return null;
    };

    const renderCreatePasswordOption = (): ReactElement => {
        return (
            <>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <div className={ "generate-password" }>
                            <Field
                                data-testid="user-mgt-add-user-form-newPassword-input"
                                className="addon-field-wrapper full-width"
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
                                value={ randomPassword ? randomPassword : initialValues?.newPassword }
                                validation={ validateNewPassword }
                                tabIndex={ 5 }
                                enableReinitialize={ true }
                                listen={ handlePasswordChange }
                                maxWidth={ 60 }
                            />
                            { passwordConfig && (
                                <Button
                                    basic
                                    primary
                                    size="tiny"
                                    data-testid="user-mgt-password-generate-button"
                                    type="button"
                                    className="info add-user-step-button"
                                    onClick={ () => {
                                        const randomPass: string = generatePassword(Number(passwordConfig.minLength),
                                            Number(passwordConfig.minLowerCaseCharacters) > 0,
                                            Number(passwordConfig.minUpperCaseCharacters) > 0,
                                            Number(passwordConfig.minNumbers) > 0,
                                            Number(passwordConfig.minSpecialCharacters) > 0,
                                            Number(passwordConfig.minLowerCaseCharacters),
                                            Number(passwordConfig.minUpperCaseCharacters),
                                            Number(passwordConfig.minNumbers),
                                            Number(passwordConfig.minSpecialCharacters),
                                            Number(passwordConfig.minUniqueCharacters));

                                        setRandomPassword(randomPass);
                                        setPassword(randomPass);
                                    } }
                                >
                                    Generate
                                </Button>
                            ) }
                        </div>
                        { passwordConfig && (
                            <PasswordValidation
                                password={ password }
                                minLength={ Number(passwordConfig.minLength) }
                                maxLength={ Number(passwordConfig.maxLength) }
                                minNumbers={ Number(passwordConfig.minNumbers) }
                                minUpperCase={ Number(passwordConfig.minUpperCaseCharacters) }
                                minLowerCase={ Number(passwordConfig.minLowerCaseCharacters) }
                                minSpecialChr={ Number(passwordConfig.minSpecialCharacters) }
                                minUniqueChr={ Number(passwordConfig.minUniqueCharacters) }
                                maxConsecutiveChr={ Number(passwordConfig.maxConsecutiveCharacters) }
                                onPasswordValidate={ onPasswordValidate }
                                translations={ {
                                    case: (Number(passwordConfig?.minUpperCaseCharacters) > 0 &&
                                        Number(passwordConfig?.minLowerCaseCharacters) > 0) ?
                                        t("extensions:manage.features.user.addUser.validation.passwordCase", {
                                            minLowerCase: passwordConfig.minLowerCaseCharacters,
                                            minUpperCase: passwordConfig.minUpperCaseCharacters
                                        }) : (
                                            Number(passwordConfig?.minUpperCaseCharacters) > 0 ?
                                                t("extensions:manage.features.user.addUser.validation.upperCase", {
                                                    minUpperCase: passwordConfig.minUpperCaseCharacters
                                                }) : t("extensions:manage.features.user.addUser.validation" +
                                                    ".lowerCase", {
                                                    minLowerCase: passwordConfig.minLowerCaseCharacters
                                                })
                                        ),
                                    consecutiveChr:
                                        t("extensions:manage.features.user.addUser.validation.consecutiveCharacters", {
                                            repeatedChr: passwordConfig.maxConsecutiveCharacters
                                        }),
                                    length: t("extensions:manage.features.user.addUser.validation.passwordLength", {
                                        max: passwordConfig.maxLength, min: passwordConfig.minLength
                                    }),
                                    numbers:
                                        t("extensions:manage.features.user.addUser.validation.passwordNumeric", {
                                            min: passwordConfig.minNumbers
                                        }),
                                    specialChr:
                                        t("extensions:manage.features.user.addUser.validation.specialCharacter", {
                                            specialChr: passwordConfig.minSpecialCharacters
                                        }),
                                    uniqueChr:
                                        t("extensions:manage.features.user.addUser.validation.uniqueCharacters", {
                                            uniqueChr: passwordConfig.minUniqueCharacters
                                        })
                                } }
                            />
                        ) }
                    </Grid.Column>
                </Grid.Row>
                <div ref={ formBottomRef } />
            </>
        );
    };

    const resolveUsernamePasswordFields = (): ReactElement => {
        // Email as username enabled.
        if (UIConfig?.enableEmailDomain) {
            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <div ref={ emailRef } />
                        <Field
                            loading={ isBasicDetailsLoading }
                            data-testid="user-mgt-add-user-form-email-input"
                            label={ t("extensions:manage.features.user.addUser.inputLabel" +
                                ".emailUsername") }
                            name="email"
                            placeholder={ t(
                                "user:forms.addUserForm.inputs." +
                            "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "user:forms.addUserForm.inputs.email." +
                                    "validations.empty"
                            ) }
                            validation={ async (value: string, validation: Validation) => {
                                setBasicDetailsLoading(true);

                                // Check username validity against userstore regex.
                                if (value && (
                                    !SharedUserStoreUtils.validateInputAgainstRegEx(
                                        value, userStoreRegex))
                                        || !FormValidation.email(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                    scrollToInValidField("email");
                                    setBasicDetailsLoading(false);
                                }

                                try {
                                    // Check for the existence of users in the userstore by the username.
                                    // Some characters disallowed by username
                                    // -regex cause failure in below request.
                                    // Therefore, existence of duplicates is
                                    // -checked only post regex validation success.
                                    if (value && validation.isValid === true) {
                                        const usersList: UserListInterface
                                        = await getUsersList(null, null,
                                            "userName eq " + value, null,
                                            selectedUserStore);

                                        if (usersList?.totalResults > 0) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                            scrollToInValidField("email");
                                        }

                                        setBasicDetailsLoading(false);
                                    }
                                } catch (error) {
                                    // Some non ascii characters are not accepted by DBs
                                    // with certain charsets.
                                    // Hence, the API sends a `500` status code.
                                    // see below issue for more context.
                                    // https://github.com/wso2/product-is/issues/
                                    // 10190#issuecomment-719760318
                                    if (error?.response?.status === 500) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                        scrollToInValidField("email");
                                    }

                                    setBasicDetailsLoading(false);
                                }
                            } }
                            type="email"
                            value={ initialValues && initialValues.email }
                            tabIndex={ 1 }
                            maxLength={ 60 }
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        if (!hiddenFields.includes(HiddenFieldNames.USERNAME)
            && !isAlphanumericUsernameEnabled()) {
            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <div ref={ emailRef } />
                        <Field
                            loading={ isBasicDetailsLoading }
                            data-testid="user-mgt-add-user-form-email-input"
                            label={ t("extensions:manage.features.user.addUser.inputLabel" +
                                ".emailUsername") }
                            name="email"
                            placeholder={ t(
                                "user:forms.addUserForm.inputs." +
                            "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "user:forms.addUserForm.inputs.email." +
                                    "validations.empty"
                            ) }
                            validation={ async (value: string, validation: Validation) => {
                                setBasicDetailsLoading(true);

                                // Check username validity against userstore regex.
                                if (value && (
                                    !SharedUserStoreUtils.validateInputAgainstRegEx(
                                        value, userStoreRegex))
                                        || !FormValidation.email(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                    scrollToInValidField("email");
                                    setBasicDetailsLoading(false);
                                }

                                try {
                                    // Check for the existence of users in the userstore by the username.
                                    // Some characters disallowed by username
                                    // -regex cause failure in below request.
                                    // Therefore, existence of duplicates is
                                    // -checked only post regex validation success.
                                    if (value && validation.isValid === true) {
                                        const usersList: UserListInterface
                                        = await getUsersList(null, null,
                                            "userName eq " + value, null,
                                            selectedUserStore);

                                        if (usersList?.totalResults > 0) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                            scrollToInValidField("email");
                                        }

                                        setBasicDetailsLoading(false);
                                    }
                                } catch (error) {
                                    // Some non ascii characters are not accepted by DBs
                                    // with certain charsets.
                                    // Hence, the API sends a `500` status code.
                                    // see below issue for more context.
                                    // https://github.com/wso2/product-is/issues/
                                    // 10190#issuecomment-719760318
                                    if (error?.response?.status === 500) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                        scrollToInValidField("email");
                                    }

                                    setBasicDetailsLoading(false);
                                }
                            } }
                            type="email"
                            value={ initialValues && initialValues.email }
                            tabIndex={ 1 }
                            maxLength={ 60 }
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }

        return (
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <div ref={ emailRef } />
                    <Field
                        loading={ isBasicDetailsLoading }
                        data-testid="user-mgt-add-user-form-username-input"
                        label={ t("extensions:manage.features.user.addUser.inputLabel" +
                            ".alphanumericUsername") }
                        name="username"
                        placeholder={ t("extensions:manage.features.user.addUser.inputLabel" +
                            ".alphanumericUsernamePlaceholder") }
                        required={ true }
                        requiredErrorMessage={ t(
                            "user:forms.addUserForm.inputs.email." +
                            "validations.empty"
                        ) }
                        validation={ async (value: string, validation: Validation) => {
                            let regExpInvalidUsername: RegExp = new RegExp(
                                UserManagementConstants.USERNAME_VALIDATION_REGEX);

                            // Check if special characters enabled for username.
                            if (!usernameConfig?.isAlphanumericOnly) {
                                regExpInvalidUsername = new RegExp(
                                    UserManagementConstants.USERNAME_VALIDATION_REGEX_WITH_SPECIAL_CHARS);
                            }

                            // Check username length validations.
                            if (value.length < Number(usernameConfig.minLength)
                                || value.length > Number(usernameConfig.maxLength)) {
                                validation.isValid = false;
                                validation.errorMessages.push(
                                    USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE);
                            // Check username validity against userstore regex.
                            } else if (!regExpInvalidUsername.test(value)) {
                                validation.isValid = false;
                                if (usernameConfig?.isAlphanumericOnly) {
                                    validation.errorMessages.push(
                                        USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE);
                                } else {
                                    validation.errorMessages.push(
                                        USERNAME_HAS_INVALID_SPECIAL_SYMBOLS_ERROR_MESSAGE);
                                }
                            }

                            try {
                                setBasicDetailsLoading(true);
                                // Check for the existence of users in the userstore by the username.
                                // Some characters disallowed by username
                                // -regex cause failure in below request.
                                // Therefore, existence of duplicates is
                                // -checked only post regex validation success.
                                if (value && validation.isValid === true) {
                                    const usersList: UserListInterface
                                    = await getUsersList(null, null,
                                        "userName eq " + value, null,
                                        selectedUserStore);

                                    if (usersList?.totalResults > 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                        scrollToInValidField("email");
                                    }
                                }

                                setBasicDetailsLoading(false);
                            } catch (error) {
                                // Some non ascii characters are not accepted by DBs
                                // with certain charsets.
                                // Hence, the API sends a `500` status code.
                                // see below issue for more context.
                                // https://github.com/wso2/product-is/issues/
                                // 10190#issuecomment-719760318
                                if (error?.response?.status === 500) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                    scrollToInValidField("email");
                                }

                                setBasicDetailsLoading(false);
                            }
                        } }
                        type="text"
                        value={ initialValues && initialValues.userName }
                        tabIndex={ 1 }
                        maxLength={ 60 }
                    />
                    <Hint>
                        { usernameConfig?.isAlphanumericOnly ? t("extensions:manage.features." +
                                "user.addUser.validation.usernameHint", {
                            maxLength: usernameConfig?.maxLength,
                            minLength: usernameConfig?.minLength
                        }) : t("extensions:manage.features.user.addUser.validation" +
                        ".usernameSpecialCharHint", {
                            maxLength: usernameConfig?.maxLength,
                            minLength: usernameConfig?.minLength
                        }) }
                    </Hint>
                    <Field
                        data-testid="user-mgt-add-user-form-alphanumeric-email-input"
                        label={ "Email" }
                        name="email"
                        placeholder={ t(
                            "user:forms.addUserForm.inputs." +
                            "email.placeholder"
                        ) }
                        required={ isEmailRequired }
                        requiredErrorMessage={ t(
                            "user:forms.addUserForm.inputs.email." +
                            "validations.empty"
                        ) }
                        validation={ async (value: string, validation: Validation) => {
                            setBasicDetailsLoading(true);

                            // Check username validity against userstore regex.
                            if (value && (
                                !SharedUserStoreUtils.validateInputAgainstRegEx(
                                    value, userStoreRegex))
                                    || !FormValidation.email(value)) {
                                validation.isValid = false;
                                validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                scrollToInValidField("email");
                                setIsValidEmail(false);
                            } else {
                                setIsValidEmail(true);
                            }
                            setBasicDetailsLoading(false);
                        } }
                        type="email"
                        value={ initialValues && initialValues.email }
                        tabIndex={ 1 }
                        maxLength={ 60 }
                        listen={ handleEmailEmpty }
                    />
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ async (values: Map<string, FormValue>) => {
                if (passwordOption === PasswordOptionTypes.CREATE_PASSWORD) {
                    // Check whether the new password is valid
                    if (await isNewPasswordValid(values.get("newPassword")
                        ? values.get("newPassword").toString()
                        : "")) {
                        onSubmit(getFormValues(values));
                    }
                }
                else {
                    onSubmit(getFormValues(values));
                }
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {
                    !hiddenFields.includes(HiddenFieldNames.USERSTORE) &&
                        !isUserStoreError && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <div ref={ emailRef }/>
                                <Form.Field required={ isUserstoreRequired }>
                                    <label>
                                        { t("user:forms.addUserForm.inputs."+
                                        "domain.placeholder") }
                                    </label>
                                    <Dropdown
                                        fluid
                                        selection
                                        labeled
                                        options={ readWriteUserStoresList }
                                        data-testid="user-mgt-add-user-form-userstore-dropdown"
                                        name="userstore"
                                        disabled={ false }
                                        value={ userStore }
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>, data: DropdownProps) => {
                                                setUserStore(data.value.toString());
                                                setSelectedUserStore(readWriteUserStoresList?.find(
                                                    (userStore: DropdownItemProps) =>
                                                        userStore.value === data.value)?.text?.toString());
                                            }
                                        }
                                        tabIndex={ 1 }
                                        maxLength={ 60 }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    resolveUsernamePasswordFields()
                }
                {
                    !hiddenFields.includes(HiddenFieldNames.FIRSTNAME) && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    data-testid="user-mgt-add-user-form-firstName-input"
                                    label={ t(
                                        "user:forms.addUserForm.inputs.firstName.label"
                                    ) }
                                    name="firstName"
                                    placeholder={ t(
                                        "user:forms.addUserForm.inputs." +
                                        "firstName.placeholder"
                                    ) }
                                    required={ isFirstNameRequired }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm." +
                                        "inputs.firstName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.firstName }
                                    tabIndex={ 2 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("First Name cannot contain" +
                                                " the forward slash (/) character.");
                                        }
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    !hiddenFields.includes(HiddenFieldNames.LASTNAME) && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    data-testid="user-mgt-add-user-form-lastName-input"
                                    label={ t(
                                        "user:forms.addUserForm.inputs.lastName.label"
                                    ) }
                                    name="lastName"
                                    placeholder={ t(
                                        "user:forms.addUserForm.inputs." +
                                        "lastName.placeholder"
                                    ) }
                                    required={ isLastNameRequired }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm." +
                                        "inputs.lastName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.lastName }
                                    tabIndex={ 3 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("Last Name cannot contain" +
                                                " the forward slash (/) character.");
                                        }
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    !hiddenFields.includes(HiddenFieldNames.PASSWORD)
                        ? (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <Form.Field
                                    >
                                        <label className="mb-3">
                                            { t("user:forms.addUserForm" +
                                                ".buttons.radioButton.label") }
                                        </label>
                                        <Radio
                                            label={ askPasswordOptionData.label }
                                            data-testId={ askPasswordOptionData["data-testid"] }
                                            name="handlePasswordGroup"
                                            value={ askPasswordOptionData.value }
                                            checked={ passwordOption === askPasswordOptionData.value }
                                            onChange={
                                                (e: React.ChangeEvent<HTMLInputElement>, item: any) =>
                                                    setPasswordOption(item?.value)
                                            }
                                        />
                                    </Form.Field>
                                    {
                                        passwordOption === askPasswordOptionData.value
                                            ? renderAskPasswordOption()
                                            : null
                                    }
                                    <Form.Field>
                                        <Radio
                                            label={ createPasswordOptionData.label }
                                            data-testId={ createPasswordOptionData["data-testid"] }
                                            name="handlePasswordGroup"
                                            value={ createPasswordOptionData.value }
                                            checked={ passwordOption === createPasswordOptionData.value }
                                            onChange={
                                                (e: React.ChangeEvent<HTMLInputElement>, item: any) =>
                                                    setPasswordOption(item?.value)
                                            }
                                        />
                                    </Form.Field>
                                    {
                                        passwordOption === createPasswordOptionData.value
                                            ? renderCreatePasswordOption()
                                            : null
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        ) : null
                }
            </Grid>
        </Forms>
    );
};

AddUserUpdated.defaultProps = {
    hiddenFields: [],
    requestedPasswordOption: PasswordOptionTypes.ASK_PASSWORD
};
