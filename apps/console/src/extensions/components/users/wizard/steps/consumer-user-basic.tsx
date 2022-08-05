/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Grid,
    Message
} from "semantic-ui-react";
import { SharedUserStoreConstants } from "../../../../../features/core";
import { EventPublisher, SharedUserStoreUtils } from "../../../../../features/core/utils";
import { getUsersList } from "../../../../../features/users";
import { USERSTORE_REGEX_PROPERTIES } from "../../../../../features/userstores";
import { CONSUMER_USERSTORE } from "../../../users/constants";

/**
 * import pass strength bat dynamically.
 */
const PasswordMeter = React.lazy(() => import("react-password-strength-bar"));

/**
 * Proptypes for the add consumer user basic component.
 */
export interface AddConsumerUserBasicProps {
    initialValues: any;
    triggerSubmit: boolean;
    emailVerificationEnabled: boolean;
    onSubmit: (values: any) => void;
    hiddenFields?: ("userName" | "firstName" | "lastName" | "password")[];
    requestedPasswordOption?: "ask-password" | "create-password";
    isFirstNameRequired?: boolean;
    isLastNameRequired?: boolean;
}

/**
 * Add consumer user basic component.
 *
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * @return {ReactElement}
 */
export const AddConsumerUserBasic: React.FunctionComponent<AddConsumerUserBasicProps> = (
    props: AddConsumerUserBasicProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        emailVerificationEnabled,
        onSubmit,
        hiddenFields,
        requestedPasswordOption,
        isFirstNameRequired,
        isLastNameRequired
    } = props;

    const [ passwordOption, setPasswordOption ] = useState(initialValues?.passwordOption);
    const [ password, setPassword ] = useState<string>("");
    const [ , setPasswordScore ] = useState<number>(-1);
    const formBottomRef = useRef<HTMLDivElement>();
    const emailRef = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    const [ , setRegExLoading ] = useState<boolean>(false);

    // Username input validation error messages.
    const USER_ALREADY_EXIST_ERROR_MESSAGE: string = t("console:manage.features.users.consumerUsers.fields." +
        "username.validations.invalid");
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("console:manage.features.users.consumerUsers.fields." +
        "username.validations.regExViolation");
    const USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE: string = t("console:manage.features.users.consumerUsers.fields." +
        "username.validations.invalidCharacters");

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    //TODO: Re-enable this after reviewing the usage of the generate password feature.
    // /**
    //  * The following useEffect is triggered when a random password is generated.
    //  */
    // useEffect(() => {
    //     if (randomPassword && randomPassword !== "") {
    //         setIsPasswordGenerated(true);
    //     }
    // }, [ randomPassword ]);

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

    const passwordOptions = [
        {
            "data-testid": "user-mgt-add-user-form-ask-password-option-radio-button",
            label: t("console:manage.features.user.forms.addUserForm.buttons.radioButton.options.askPassword"),
            value: "ask-password"
        },
        {
            "data-testid": "user-mgt-add-user-form-create-password-option-radio-button",
            label: t("console:manage.features.user.forms.addUserForm.buttons.radioButton.options.createPassword"),
            value: "create-password"
        }
    ];

    /**
     * The following function handles the change of the password.
     *
     * @param values
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

    /**
     * The following function validates user name against the user store regEx.
     */
    const validateUserNamePattern = async (): Promise<string> => {
        let userStoreRegEx = "";

        await SharedUserStoreUtils.getUserStoreRegEx(CONSUMER_USERSTORE,
            SharedUserStoreConstants.USERSTORE_REGEX_PROPERTIES.UsernameRegEx)
            .then((response) => {
                setRegExLoading(true);
                userStoreRegEx = response;
            });

        setRegExLoading(false);

        return new Promise((resolve, reject) => {
            if (userStoreRegEx !== "") {
                resolve(userStoreRegEx);
            } else {
                reject("");
            }
        });
    };

    const getFormValues = (values: Map<string, FormValue>) => {
        eventPublisher.publish("manage-users-customer-password-option", {
            type: values.get("passwordOption")?.toString()
        });

        return {
            domain: CONSUMER_USERSTORE,
            email: values.get("email")?.toString(),
            firstName: values.get("firstName")?.toString(),
            lastName: values.get("lastName")?.toString(),
            newPassword: values.get("newPassword") && values.get("newPassword") !== undefined
                ? values.get("newPassword").toString()
                : "",
            passwordOption: values.get("passwordOption")?.toString()
        };
    };

    /**
     * Scrolls to the first field that throws an error.
     *
     * @param {string} field The name of the field.
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
     * @param {string} password The password to validate.
     */
    const isNewPasswordValid = async (password: string) => {
        const passwordRegex = await SharedUserStoreUtils.getUserStoreRegEx(
            CONSUMER_USERSTORE,
            USERSTORE_REGEX_PROPERTIES.PasswordRegEx);
        
        return SharedUserStoreUtils.validateInputAgainstRegEx(password, passwordRegex);
    };

    /**
     * Validate password and display an error message when the password is invalid.
     *
     * @param {string} value The value of the password field.
     * @param {Validation} validation The validation object.
     */
    const validateNewPassword = async (value: string, validation: Validation) => {
        if(!await isNewPasswordValid(value)){
            validation.isValid = false;
            validation.errorMessages.push(t(
                "extensions:manage.features.user.addUser.validation.password"
            ));
        }
        scrollToInValidField("formBottom");
    };

    const handlePasswordOptions = () => {
        if (passwordOption && passwordOption === "create-password") {
            return (
                <>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Field
                                data-testid="user-mgt-add-user-form-newPassword-input"
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
                                value={ initialValues?.newPassword }
                                validation={ validateNewPassword }
                                tabIndex={ 5 }
                                enableReinitialize={ true }
                                listen = { handlePasswordChange }
                                maxWidth={ 60 }
                            />
                            <Suspense fallback={ null } >
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
                    <div ref={ formBottomRef } />
                </>
            );
        } else if (passwordOption && passwordOption === "ask-password") {
            return (
                <>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Message
                                icon="mail"
                                content={ t(
                                    "extensions:manage.features.user.addUser.inviteUserTooltip"
                                ) }
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
     * The modal to add new user.
     */
    const addUserBasicForm = () => (
        <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ async (values) => {
                if (passwordOption === "create-password") {
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
                    !hiddenFields.includes("userName") && (
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <div  ref ={ emailRef } />
                                <Field
                                    data-testid="user-mgt-add-user-form-email-input"
                                    label={ "Email (Username)" }
                                    name="email"
                                    placeholder={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs." +
                                        "email.placeholder"
                                    ) }
                                    required={ true }
                                    requiredErrorMessage={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs.email.validations.empty"
                                    ) }
                                    validation={ async (value: string, validation: Validation) => {
                                        // Check username validity against userstore regex.
                                        await validateUserNamePattern().then(regex => {
                                            if (value && (
                                                !SharedUserStoreUtils.validateInputAgainstRegEx(value, regex)) ||
                                                !FormValidation.email(value)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                                scrollToInValidField("email");
                                            }
                                        });

                                        try {
                                            // Check for the existence of users in the userstore by the username.
                                            // Some characters disallowed by username
                                            // -regex cause failure in below request.
                                            // Therefore, existence of duplicates is 
                                            // -checked only post regex validation success.
                                            if (value && validation.isValid==true) {
                                                const usersList
                                                    = await getUsersList(null, null,
                                                        "userName eq " + value, null,
                                                        CONSUMER_USERSTORE);

                                                if (usersList?.totalResults > 0) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                                }
                                            }
                                        } catch (error) {
                                            // Some non ascii characters are not accepted by DBs with certain charsets.
                                            // Hence, the API sends a `500` status code.
                                            // see below issue for more context.
                                            // https://github.com/wso2/product-is/issues/10190#issuecomment-719760318
                                            if (error?.response?.status === 500) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                            }
                                        }
                                    }
                                    }
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
                                        "console:manage.features.user.forms.addUserForm.inputs.firstName.label"
                                    ) }
                                    name="firstName"
                                    placeholder={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs." +
                                        "firstName.placeholder"
                                    ) }
                                    required={ isFirstNameRequired }
                                    requiredErrorMessage={ t(
                                        "console:manage.features.user.forms.addUserForm." +
                                        "inputs.firstName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.firstName }
                                    tabIndex={ 2 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push( "First Name cannot contain" + 
                                            " the forward slash (/) character." );
                                        }
                                    } }
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
                                        "console:manage.features.user.forms.addUserForm.inputs.lastName.label"
                                    ) }
                                    name="lastName"
                                    placeholder={ t(
                                        "console:manage.features.user.forms.addUserForm.inputs." +
                                        "lastName.placeholder"
                                    ) }
                                    required={ isLastNameRequired }
                                    requiredErrorMessage={ t(
                                        "console:manage.features.user.forms.addUserForm." +
                                        "inputs.lastName.validations.empty"
                                    ) }
                                    type="text"
                                    value={ initialValues && initialValues.lastName }
                                    tabIndex={ 3 }
                                    maxLength={ 30 }
                                    validation={ async (value: string, validation: Validation) => {
                                        if (value.includes("/")) {
                                            validation.isValid = false;
                                            validation.errorMessages.push( "Last Name cannot contain" + 
                                            " the forward slash (/) character." );
                                        }
                                    } }
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
                                label={ t("console:manage.features.user.forms.addUserForm.buttons.radioButton.label") }
                                name="passwordOption"
                                default="ask-password"
                                listen={ (values) => { setPasswordOption(values.get("passwordOption").toString()); } }
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

AddConsumerUserBasic.defaultProps = {
    hiddenFields: [],
    requestedPasswordOption: "ask-password"
};
