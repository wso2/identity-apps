/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getUserStoreList } from "@wso2is/core/api";
import { UserstoreConstants } from "@wso2is/core/constants";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Grid,
    Message
} from "semantic-ui-react";
import { store } from "../../core";
import { SharedUserStoreUtils } from "../../core/utils";
import { RootOnlyComponent } from "../../organizations/components";
import { OrganizationUtils } from "../../organizations/utils";
import {
    CONSUMER_USERSTORE,
    PRIMARY_USERSTORE_PROPERTY_VALUES,
    USERSTORE_REGEX_PROPERTIES,
    UserStoreListItem
} from "../../userstores";
import { getUsersList } from "../api";
import { BasicUserDetailsInterface } from "../models";
import { generatePassword } from "../utils";

/**
 * import pass strength bat dynamically.
 */
const PasswordMeter = React.lazy(() => import("react-password-strength-bar"));

/**
 * Proptypes for the add user component.
 */
interface AddUserProps {
    initialValues: any;
    triggerSubmit: boolean;
    emailVerificationEnabled: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Add user page.
 *
 * @return {ReactElement}
 */
export const AddUser: React.FunctionComponent<AddUserProps> = (props: AddUserProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        emailVerificationEnabled,
        onSubmit
    } = props;

    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ passwordOption, setPasswordOption ] = useState(initialValues?.passwordOption ?? "create-password");
    const [ userStore, setUserStore ] = useState<string>(initialValues?.domain);
    const [ randomPassword, setRandomPassword ] = useState<string>("");
    const [ isPasswordGenerated, setIsPasswordGenerated ] = useState<boolean>(false);
    const [
        usernameRegEx,
        setUsernameRegEx
    ] = useState<string>(PRIMARY_USERSTORE_PROPERTY_VALUES.UsernameJavaScriptRegEx);
    const [ isUsernameRegExLoading, setUsernameRegExLoading ] = useState<boolean>(false);
    const [ password, setPassword ] = useState<string>("");
    const confirmPasswordRef = useRef<HTMLDivElement>();

    const { t } = useTranslation();

    // Username input validation error messages.
    const USER_ALREADY_EXIST_ERROR_MESSAGE: string = t("console:manage.features.user.forms.addUserForm.inputs." +
        "username.validations.invalid");
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("console:manage.features.user.forms.addUserForm.inputs." +
        "username.validations.regExViolation");
    const USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE: string = t("console:manage.features.user.forms.addUserForm." +
        "inputs.username.validations.invalidCharacters");

    /**
     * The following useEffect is triggered when a random password is generated.
     */
    useEffect(() => {
        if (randomPassword && randomPassword !== "") {
            setIsPasswordGenerated(true);
        }
    }, [ randomPassword ]);

    /**
     * Fetch the list of available user stores.
     */
    useEffect(() => {
        getUserStores();
    }, []);

    /**
     * Set the password setup option to 'create-password'.
     */
    useEffect(() => {
        if (!passwordOption) {
            setPasswordOption("create-password");
        }
    }, []);

    const passwordOptions = [
        {
            "data-testid": "user-mgt-add-user-form-create-password-option-radio-button",
            label: t("console:manage.features.user.forms.addUserForm.buttons.radioButton.options.createPassword"),
            value: "create-password"
        },
        {
            "data-testid": "user-mgt-add-user-form-ask-password-option-radio-button",
            label: t("console:manage.features.user.forms.addUserForm.buttons.radioButton.options.askPassword"),
            value: "ask-password"
        }
    ];

    /**
     * The following function handles the change of the userstore.
     *
     * @param values
     */
    const handleUserStoreChange = (values: Map<string, FormValue>): void => {
        const domain: string = values.get("domain").toString();

        setUserStore(domain);
        setUserStoreRegEx(domain)
            .finally(() => {
                setUsernameRegExLoading(false);
            });
    };

    /**
     * The following function set the username regEx to the state.
     *
     * @param userstore
     */
    const setUserStoreRegEx = async (userstore: string): Promise<void> => {
        if (userstore !== "primary") {
            // Set the username regEx of the secondary user store.
            await SharedUserStoreUtils.getUserStoreRegEx(userstore, USERSTORE_REGEX_PROPERTIES.UsernameRegEx)
                .then((response) => {
                    setUsernameRegExLoading(true);
                    setUsernameRegEx(response);
                });
        } else {
            // Set the username regEx of the primary user store.
            setUsernameRegEx(PRIMARY_USERSTORE_PROPERTY_VALUES.UsernameJavaScriptRegEx);
        }
    };

    /**
     * The following function handles the change of the password.
     *
     * @param values
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();

        setPassword(password);
    };

    /**
     * The following function generate a random password.
     */
    const generateRandomPassword = (): void => {
        const generatedPassword: string = generatePassword(11, true, true, true, true, 1, 1, 1, 1);

        setPassword(generatedPassword);
        setRandomPassword(generatedPassword);
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = (): void => {
        const storeOptions = [
            {
                key: -1,
                text: t("console:manage.features.users.userstores.userstoreOptions.primary"),
                value: "primary"
            }
        ];
        let storeOption =
            {
                key: null,
                text: "",
                value: ""
            };

        setUserStore(storeOptions[ 0 ].value);

        if (OrganizationUtils.isCurrentOrganizationRoot()) {
            getUserStoreList(store.getState().config.endpoints.userStores)
                .then((response) => {
                    if (storeOptions === []) {
                        storeOptions.push(storeOption);
                    }
                    response.data.map((store: UserStoreListItem, index) => {
                        if (store.name !== CONSUMER_USERSTORE) {
                            if (store.enabled) {
                                storeOption = {
                                    key: index,
                                    text: store.name,
                                    value: store.name
                                };
                                storeOptions.push(storeOption);
                            }
                        }
                    });
                    setUserStoresList(storeOptions);
                });
        }

        setUserStoresList(storeOptions);
    };

    const getFormValues = (values: Map<string, FormValue>): BasicUserDetailsInterface => {
        return {
            confirmPassword: values.get("confirmPassword") && values.get("confirmPassword") !== undefined  ?
                values.get("confirmPassword").toString() : "",
            domain: values.get("domain").toString(),
            email: values.get("email").toString(),
            firstName: values.get("firstName").toString(),
            lastName: values.get("lastName").toString(),
            newPassword: values.get("newPassword") && values.get("newPassword") !== undefined  ?
                values.get("newPassword").toString() : "",
            passwordOption: values.get("passwordOption")?.toString(),
            userName: values.get("userName").toString()
        };
    };

    /**
     * Forcefully triggers the confirm password input field validation.
     */
    const triggerConfirmPasswordInputValidation = (): void => {

        const confirmInput = confirmPasswordRef?.
            current?.
            children[ 0 ]?.
            children[ 1 ]?.
            children[ 0 ] as HTMLInputElement;

        if (confirmInput && confirmInput.focus && confirmInput.blur) {
            confirmInput.focus();
            confirmInput.blur();
        }
    };

    const handlePasswordOptions = () => {
        if (passwordOption && passwordOption === "create-password") {
            return (
                <>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
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
                                value={ isPasswordGenerated ? randomPassword : initialValues?.newPassword }
                                validation={ async (value: string, validation: Validation) => {

                                    triggerConfirmPasswordInputValidation();

                                    let passwordRegex = "";

                                    if (userStore !== UserstoreConstants.PRIMARY_USER_STORE.toLocaleLowerCase()) {
                                        // Set the username regEx of the secondary user store.
                                        passwordRegex
                                            = await SharedUserStoreUtils.getUserStoreRegEx(
                                                userStore, USERSTORE_REGEX_PROPERTIES.PasswordRegEx);
                                    } else {
                                        // Set the username regEx of the primary user store.
                                        passwordRegex = PRIMARY_USERSTORE_PROPERTY_VALUES.PasswordJavaScriptRegEx;
                                    }

                                    if(!SharedUserStoreUtils.validateInputAgainstRegEx(value, passwordRegex)){
                                        validation.isValid = false;
                                        validation.errorMessages.push( t("console:manage.features.user.forms." +
                                            "addUserForm.inputs.newPassword.validations.regExViolation") );
                                    }
                                } }
                                tabIndex={ 6 }
                                enableReinitialize={ true }
                                listen = { handlePasswordChange }
                            />
                            <Suspense fallback={ null } >
                                <PasswordMeter
                                    password={ password }
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
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <PrimaryButton
                                className="generate-password-button"
                                onClick={ generateRandomPassword }
                                type="button"
                                icon="random"
                            >
                                { t("common:generatePassword") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                ref={ confirmPasswordRef }
                                data-testid="user-mgt-add-user-form-confirmPassword-input"
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
                                value={ isPasswordGenerated ? randomPassword : initialValues?.confirmPassword }
                                validation={ (value: string, validation: Validation, formValues) => {
                                    if (formValues.get("newPassword") !== value) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:manage.features.user.forms.addUserForm.inputs" +
                                                ".confirmPassword.validations.mismatch"));

                                        return;
                                    }

                                    validation.isValid = true;
                                    validation.errorMessages.push(null);
                                    triggerConfirmPasswordInputValidation();
                                } }
                                tabIndex={ 7 }
                                enableReinitialize={ true }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        } else if (passwordOption && passwordOption === "ask-password") {
            return (
                <>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Message
                                icon="mail"
                                content="An email with a confirmation link will be sent to the provided email address
                                for the user to set his/her own password."
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
            onSubmit={ (values) => {

                triggerConfirmPasswordInputValidation();

                if (values.get("newPassword") !== values.get("confirmPassword")) {
                    return;
                }

                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <RootOnlyComponent>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                data-testid="user-mgt-add-user-form-domain-dropdown"
                                type="dropdown"
                                label={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs.domain.label"
                                ) }
                                name="domain"
                                children={ userStoreOptions }
                                requiredErrorMessage={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs.domain.validations.empty"
                                ) }
                                required={ true }
                                value={ initialValues?.domain ? initialValues?.domain : userStoreOptions[0]?.value }
                                listen={ handleUserStoreChange }
                                tabIndex={ 1 }
                            />
                        </Grid.Column>
                    </RootOnlyComponent>

                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-username-input"
                            label={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.username.label"
                            ) }
                            name="userName"
                            placeholder={ t(
                                "console:manage.features.user.forms.addUserForm.inputs." +
                                "username.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm." +
                                "inputs.username.validations.empty"
                            ) }
                            type="text"
                            validation={ async (value: string, validation: Validation) => {
                                try {
                                    if (value) {
                                        const usersList
                                            = await getUsersList(null, null, "userName eq " + value, null, userStore);

                                        if (usersList?.totalResults > 0) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(USER_ALREADY_EXIST_ERROR_MESSAGE);
                                        }
                                    }
                                } catch (error) {
                                    // Some non ascii characters are not accepted by DBs with certain charsets.
                                    // Hence, the API sends a `500` status code.
                                    // see https://github.com/wso2/product-is/issues/10190#issuecomment-719760318
                                    if (error?.response?.status === 500) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(USERNAME_HAS_INVALID_CHARS_ERROR_MESSAGE);
                                    }
                                }

                                if (value && !SharedUserStoreUtils.validateInputAgainstRegEx(value, usernameRegEx)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                }
                            } }
                            value={ initialValues && initialValues.userName }
                            loading={ isUsernameRegExLoading }
                            tabIndex={ 2 }
                            maxLength={ 30 }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
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
                            required={ true }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm." +
                                "inputs.firstName.validations.empty"
                            ) }
                            type="text"
                            value={ initialValues && initialValues.firstName }
                            tabIndex={ 3 }
                            maxLength={ 30 }
                        />
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
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
                            required={ true }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm." +
                                "inputs.lastName.validations.empty"
                            ) }
                            type="text"
                            value={ initialValues && initialValues.lastName }
                            tabIndex={ 4 }
                            maxLength={ 30 }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-email-input"
                            label={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.email.label"
                            ) }
                            name="email"
                            placeholder={ t(
                                "console:manage.features.user.forms.addUserForm.inputs." +
                                "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.email.validations.empty"
                            ) }
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.email(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t(
                                            "console:manage.features.user.forms.addUserForm.inputs.email." +
                                            "validations.invalid"
                                        ).toString()
                                    );
                                }
                            }
                            }
                            type="email"
                            value={ initialValues && initialValues.email }
                            tabIndex={ 5 }
                            maxLength={ 50 }
                        />
                    </Grid.Column>
                </Grid.Row>
                { emailVerificationEnabled && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Field
                                type="radio"
                                label={ t("console:manage.features.user.forms.addUserForm.buttons.radioButton.label") }
                                name="passwordOption"
                                default="create-password"
                                listen={ (values) => { setPasswordOption(values.get("passwordOption").toString()); } }
                                children={ passwordOptions }
                                value={ initialValues?.passwordOption ?? "create-password" }
                                tabIndex={ 6 }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
                { handlePasswordOptions() }
            </Grid>
        </Forms>
    );

    return (
        <>
            { addUserBasicForm() }
        </>
    );
};
