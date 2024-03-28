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

import { ProfileSchemaInterface } from "@wso2is/core/src/models";
import { Field, FormValue, Forms, RadioChild, Validation } from "@wso2is/forms";
import { Hint, PasswordValidation } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    Grid,
    Message
} from "semantic-ui-react";
import { userstoresConfig } from "../../../../../extensions/configs/userstores";
import { AppState } from "../../../../core";
import { SharedUserStoreUtils } from "../../../../core/utils";
import { getUsersList } from "../../../../users/api/users";
import { UserListInterface } from "../../../../users/models/user";
import { getConfiguration, getUsernameConfiguration } from "../../../../users/utils";
import { USERSTORE_REGEX_PROPERTIES } from "../../../../userstores/constants/user-store-constants";
import { useValidationConfigData } from "../../../../admin-validation-v1/api";
import { ValidationFormInterface } from "../../../../admin-validation-v1/models";
import { UserManagementConstants } from "../../../constants";

/**
 * Proptypes for the add consumer user component.
 */
export interface AddConsumerUserProps {
    initialValues: any;
    triggerSubmit: boolean;
    emailVerificationEnabled: boolean;
    onSubmit: (values: any) => void;
    hiddenFields?: ("userName" | "firstName" | "lastName" | "password")[];
    requestedPasswordOption?: "ask-password" | "create-password";
}

/**
 * Add consumer user page.
 *
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * returns AddConsumerUser component.
 */
export const AddConsumerUser: React.FunctionComponent<AddConsumerUserProps> = (
    props: AddConsumerUserProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        emailVerificationEnabled,
        onSubmit,
        hiddenFields,
        requestedPasswordOption
    } = props;

    const [ passwordOption, setPasswordOption ] = useState(initialValues?.passwordOption);
    const [ password, setPassword ] = useState<string>("");
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>(undefined);
    const [ isEmailRequired, setEmailRequired ] = useState<boolean>(true);
    const [ passwordConfig, setPasswordConfig ] = useState<ValidationFormInterface>(undefined);
    const [ isValidPassword, setIsValidPassword ] = useState<boolean>(true);
    const [ userstore ] = useState<string>(userstoresConfig.primaryUserstoreName);

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);

    const { t } = useTranslation();

    // Username input validation error messages.
    const USER_ALREADY_EXIST_ERROR_MESSAGE: string = t("user:forms.addUserForm.inputs." +
        "username.validations.invalid");
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("user:forms.addUserForm.inputs." +
        "username.validations.regExViolation");
    const USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE: string = t("user:forms.addUserForm." +
        "inputs.username.validations.invalidCharacters");
    const USERNAME_JAVA_REGEX: string = "UsernameJavaRegEx";
    const USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE: string = t("extensions:manage.features.user.addUser.validation." +
        "usernameSymbols");
    const USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE: string =
        t("extensions:manage.features.user.addUser.validation.usernameLength", {
            maxLength: usernameConfig?.maxLength,
            minLength: usernameConfig?.minLength
        });

    const { data: validationData } = useValidationConfigData();

    useEffect(() => {
        const emailSchema: ProfileSchemaInterface = profileSchemas
            .find((schema: ProfileSchemaInterface) => (schema.name === "emails"));

        if (emailSchema) {
            setEmailRequired(emailSchema.required);
        }
    }, []);

    useEffect(() => {
        if (validationData) {
            setUsernameConfig(getUsernameConfiguration(validationData));
            setPasswordConfig(getConfiguration(validationData));
        }
    }, [ validationData ]);

    /**
     * Callback function to validate password.
     *
     * @param isValid - validation status.
     * @param validationStatus - detailed validation status.
     */
    const onPasswordValidate = (isValid: boolean): void => {

        setIsValidPassword(isValid);
    };

    /**
     * Set the password setup option to 'ask-password'.
     */
    useEffect(() => {
        if (!passwordOption) {
            if (!requestedPasswordOption) {
                setPasswordOption("ask-password");

                return;
            }

            setPasswordOption(requestedPasswordOption);
        }
    }, [ requestedPasswordOption ]);

    const passwordOptions: RadioChild[] = [
        {
            "data-testid": "user-mgt-add-user-form-ask-password-option-radio-button",
            label: t("user:forms.addUserForm.buttons.radioButton.options.askPassword"),
            value: "ask-password"
        },
        {
            "data-testid": "user-mgt-add-user-form-create-password-option-radio-button",
            label: t("user:forms.addUserForm.buttons.radioButton.options.createPassword"),
            value: "create-password"
        }
    ];

    /**
     * Verify whether the provided password is valid.
     *
     * @param password - The password to validate.
     */
    const isNewPasswordValid = async (password: string) => {

        if (passwordConfig) {
            return isValidPassword;
        }

        const passwordRegex: string = await SharedUserStoreUtils.getUserStoreRegEx(
            userstore,
            USERSTORE_REGEX_PROPERTIES.PasswordRegEx);

        return SharedUserStoreUtils.validateInputAgainstRegEx(password, passwordRegex);
    };

    /**
     * Submit the form values.
     * @param values - Form values.
     */
    const handleSubmit = async (values: Map<string, FormValue>) => {
        if (passwordOption === "create-password") {
            // Check whether the new password is valid.
            if (await isNewPasswordValid(values.get("newPassword")
                ? values.get("newPassword").toString()
                : "")) {
                onSubmit(getFormValues(values));
            }
        }
        else {
            onSubmit(getFormValues(values));
        }
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

    //TODO: Re-enable this after reviewing the usage of the generate password feature.
    // /**
    //  * The following function generate a random password.
    //  */
    // const generateRandomPassword = (): void => {
    //     const genPasswrod = generate({ length: 11, numbers: true, symbols: true, uppercase: true });
    //     setPassword(genPasswrod);
    //     setRandomPassword(genPasswrod);
    // };

    const getFormValues = (values: Map<string, FormValue>) => {
        return {
            domain: userstoresConfig.primaryUserstoreName,
            email: values.get("email")?.toString(),
            firstName: values.get("firstName")?.toString(),
            lastName: values.get("lastName")?.toString(),
            newPassword: values.get("newPassword") && values.get("newPassword") !== undefined
                ? values.get("newPassword").toString()
                : "",
            passwordOption: values.get("passwordOption")?.toString(),
            userName: values.get("username")?.toString()
        };
    };

    const handlePasswordOptions = () => {
        if (passwordOption && passwordOption === "create-password") {
            return (
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            data-testid="user-mgt-add-user-form-newPassword-input"
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
                            value={ initialValues?.newPassword }
                            validation={ validateNewPassword }
                            tabIndex={ 5 }
                            enableReinitialize={ true }
                            listen={ handlePasswordChange }
                            maxWidth={ 60 }
                        />
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
                                    consecutiveChr: t("extensions:manage.features.user.addUser.validation" +
                                        ".consecutiveCharacters", {
                                        repeatedChr : passwordConfig.maxConsecutiveCharacters
                                    }),
                                    length: t("extensions:manage.features.user.addUser.validation.passwordLength", {
                                        max: passwordConfig.maxLength, min: passwordConfig.minLength
                                    }),
                                    numbers: t("extensions:manage.features.user.addUser.validation.passwordNumeric", {
                                        min : passwordConfig.minNumbers
                                    }),
                                    specialChr: t("extensions:manage.features.user.addUser.validation" +
                                        ".specialCharacter", {
                                        specialChr : passwordConfig.minSpecialCharacters
                                    }),
                                    uniqueChr: t("extensions:manage.features.user.addUser.validation" +
                                        ".uniqueCharacters", {
                                        uniqueChr : passwordConfig.minUniqueCharacters
                                    })
                                } }
                            />
                        ) }
                    </Grid.Column>
                    { /*<Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>*/ }
                    { /*    <Field*/ }
                    { /*        className="generate-password-button"*/ }
                    { /*        onClick={ generateRandomPassword }*/ }
                    { /*        type="button"*/ }
                    { /*        value={ t("common:generatePassword") }*/ }
                    { /*        icon="random"*/ }
                    { /*    />*/ }
                    { /*</Grid.Column>*/ }
                </Grid.Row>
            );
        } else if (passwordOption && passwordOption === "ask-password") {
            return (
                <>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Message
                                icon="mail"
                                content="An email with a confirmation link will be sent to the provided email address
                                for the user to set their own password."
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        } else {
            return "";
        }
    };

    /**
     * The following function validates user name against the user store regEx.
     */
    const validateUserNamePattern = async (): Promise<string> => {
        try {
            let regex: string = await SharedUserStoreUtils.getUserStoreRegEx(
                userstoresConfig.primaryUserstoreName, USERNAME_JAVA_REGEX);

            if (!regex.startsWith("^")) {
                regex = "^" + regex;
            }
            if (!regex.endsWith("$")) {
                regex = regex + "$";
            }

            return regex;
        } catch (error) {
            return Promise.reject("");
        }
    };

    /**
     * The modal to add new user.
     */
    const addUserBasicForm = () => (
        <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ handleSubmit }
            submitState={ triggerSubmit }
        >
            <Grid>
                {
                    !hiddenFields.includes("userName")
                    && (usernameConfig?.enableValidator === "false")
                        ? (
                            <Grid.Row>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <Field
                                        data-testid="user-mgt-add-user-form-email-input"
                                        label={ "Email (username)" }
                                        name="email"
                                        placeholder={ t(
                                            "user:forms.addUserForm.inputs." +
                                            "email.placeholder"
                                        ) }
                                        required={ true }
                                        requiredErrorMessage={ t(
                                            "user:forms.addUserForm.inputs." +
                                            "email.validations.empty"
                                        ) }
                                        validation={ async (value: string, validation: Validation) => {

                                            if (!value) {
                                                return;
                                            }

                                            const userRegex: string = await validateUserNamePattern();

                                            if (!SharedUserStoreUtils.validateInputAgainstRegEx(value, userRegex) ||
                                            !FormValidation.email(value)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);

                                                return;
                                            }


                                            try {
                                                if (value) {
                                                    const usersList: UserListInterface = await getUsersList(null,
                                                        null,
                                                        "userName eq " + value,
                                                        null,
                                                        userstoresConfig.primaryUserstoreName);

                                                    if (usersList?.totalResults > 0) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                                    }
                                                }
                                            } catch (error) {
                                            // Some non ascii characters are not accepted by DBs with certain charsets.
                                            // Hence, the API sends a `500` status code.
                                            // see https://github.com/wso2/product-is/issues/
                                            // 10190#issuecomment-719760318
                                                if (error?.response?.status === 500) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(
                                                        USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                                }
                                            }
                                        }
                                        }
                                        displayErrorOn="blur"
                                        type="email"
                                        value={ initialValues && initialValues.email }
                                        tabIndex={ 1 }
                                        maxLength={ 60 }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        ) : (
                            <Grid.Row>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <Field
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
                                        // Regular expression to validate having alphanumeric characters.
                                            const regExpInvalidUsername: RegExp
                                            = new RegExp(UserManagementConstants.USERNAME_VALIDATION_REGEX);

                                            // Check username length validations.
                                            if (value.length < Number(usernameConfig.minLength)
                                            || value.length > Number(usernameConfig.maxLength)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(
                                                    USERNAME_HAS_INVALID_LENGTH_ERROR_MESSAGE);
                                                // Check username validity against userstore regex.
                                            } else if (!regExpInvalidUsername.test(value)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(
                                                    USERNAME_HAS_INVALID_SYMBOLS_ERROR_MESSAGE);
                                            }
                                        } }
                                        type="text"
                                        value={ initialValues && initialValues.username }
                                        tabIndex={ 1 }
                                        maxLength={ 60 }
                                    />
                                    <Hint>
                                        { t("extensions:manage.features.user.addUser.validation.usernameHint", {
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

                                            const userRegex: string = await validateUserNamePattern();

                                            // Check username validity against userstore regex.
                                            if (value && (
                                                !SharedUserStoreUtils.validateInputAgainstRegEx(
                                                    value, userRegex))
                                                || !FormValidation.email(value)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                            }
                                        } }
                                        type="email"
                                        value={ initialValues && initialValues.email }
                                        tabIndex={ 1 }
                                        maxLength={ 60 }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                }
                {
                    !hiddenFields.includes("firstName") && (
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
                                    required={ false }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm." +
                                        "inputs.firstName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.firstName }
                                    tabIndex={ 2 }
                                    maxLength={ 30 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    !hiddenFields.includes("lastName") && (
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
                                    required={ false }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm." +
                                        "inputs.lastName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.lastName }
                                    tabIndex={ 3 }
                                    maxLength={ 30 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                { emailVerificationEnabled && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Field
                                type="radio"
                                label={ t("user:forms.addUserForm.buttons.radioButton.label") }
                                name="passwordOption"
                                default="ask-password"
                                listen={ (values: Map<string, FormValue>) =>
                                { setPasswordOption(values.get("passwordOption").toString()); } }
                                children={ passwordOptions }
                                value={ initialValues?.passwordOption ? initialValues?.passwordOption : "ask-password" }
                                tabIndex={ 4 }
                                maxWidth={ 60 }
                                width={ 60 }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
                { !hiddenFields.includes("password") && handlePasswordOptions() }
            </Grid>
        </Forms>
    );

    return (
        <>
            { addUserBasicForm() }
        </>
    );
};

AddConsumerUser.defaultProps = {
    hiddenFields: [],
    requestedPasswordOption: "ask-password"
};
