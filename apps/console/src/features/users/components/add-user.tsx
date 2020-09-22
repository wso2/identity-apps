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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import { generate } from "generate-password";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Grid,
    Message
} from "semantic-ui-react";
import {
    PRIMARY_USERSTORE_PROPERTY_VALUES,
    USERSTORE_REGEX_PROPERTIES,
    getUserstoreRegEx,
    validateInputAgainstRegEx
} from "../../userstores";
import { getUsersList } from "../api";
import { BasicUserDetailsInterface } from "../models";

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
    const [ passwordOption, setPasswordOption ] = useState(initialValues && initialValues.passwordOption);
    const [ isUsernameValid, setIsUsernameValid ] = useState<boolean>(true);
    const [ isUsernamePatternValid, setIsUsernamePatternValid ] = useState<boolean>(true);
    const [ isPasswordPatternValid, setIsPasswordPatternValid ] = useState<boolean>(true);
    const [ updatedUsername, setUpdatedUsername ] = useState<string>(initialValues?.userName);
    const [ userStore, setUserStore ] = useState<string>(initialValues?.domain);
    const [ randomPassword, setRandomPassword ] = useState<string>("");
    const [ isPasswordGenerated, setIsPasswordGenerated ] = useState<boolean>(false);
    const [
        usernameRegEx,
        setUsernameRegEx
    ] = useState<string>(PRIMARY_USERSTORE_PROPERTY_VALUES.UsernameJavaScriptRegEx);
    const [ isUsernameRegExLoading, setUsernameRegExLoading ] = useState<boolean>(false);
    const [ isPasswordRegExLoading, setPasswordRegExLoading ] = useState<boolean>(false);

    const { t } = useTranslation();

    /**
     * The following useEffect is triggered when a random password is generated.
     */
    useEffect(() => {
        if (randomPassword && randomPassword !== "") {
            setIsPasswordGenerated(true);
        }
    }, [ randomPassword ]);

    /**
     * The following useEffect is triggered when the username gets updated.
     */
    useEffect(() => {
        setIsUsernameValid(false);
        validateUsername(updatedUsername);
    }, [ updatedUsername ]);

    /**
     * The following useEffect is triggered when the username gets updated.
     */
    useEffect(() => {
        setIsUsernameValid(false);
        validateUsername(updatedUsername);
    }, [ userStore ]);

    /**
     * Fetch the list of available user stores.
     */
    useEffect(() => {
        getUserStores();
    }, []);

    /**
     * Set the password setup option to 'createPw'.
     */
    useEffect(() => {
        if (!passwordOption) {
            setPasswordOption("createPw");
        }
    }, []);

    const passwordOptions = [
        {
            label: t("adminPortal:components.user.forms.addUserForm.buttons.radioButton.options.createPassword"),
            value: "createPw"
        },
        {
            label: t("adminPortal:components.user.forms.addUserForm.buttons.radioButton.options.askPassword"),
            value: "askPw"
        }
    ];

    /**
     * The following function validates whether the username entered by the user already exists in the
     * user store selected by the user.
     *
     * @param username
     */
    const validateUsername = (username: string): void => {
        getUsersList(null, null, "userName eq " + username, null, userStore)
            .then((response) => {
                setIsUsernameValid(response?.totalResults === 0);
            });
        setIsUsernamePatternValid(validateInputAgainstRegEx(username, usernameRegEx));
    };

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
            })
    };

    /**
     * The following function set the username regEx to the state.
     *
     * @param userstore
     */
    const setUserStoreRegEx = async (userstore: string): Promise<void> => {
        if (userstore !== "primary") {
            // Set the username regEx of the secondary user store.
            await getUserstoreRegEx(userstore, USERSTORE_REGEX_PROPERTIES.UsernameRegEx)
                .then((response) => {
                    setUsernameRegExLoading(true);
                    setUsernameRegEx(response);
                })
        } else {
            // Set the username regEx of the primary user store.
            setUsernameRegEx(PRIMARY_USERSTORE_PROPERTY_VALUES.UsernameJavaScriptRegEx);
        }
    };

    /**
     * The following function checks if the password pattern is valid against the user store regEx.
     *
     * @param password
     */
    const setPasswordRegEx = async (password: string): Promise<void> => {
        let passwordRegex = "";
        if (userStore !== "primary") {
            // Set the username regEx of the secondary user store.
            await getUserstoreRegEx(userStore, USERSTORE_REGEX_PROPERTIES.PasswordRegEx)
                .then((response) => {
                    setPasswordRegExLoading(true);
                    passwordRegex = response;
                })
        } else {
            // Set the username regEx of the primary user store.
            passwordRegex = PRIMARY_USERSTORE_PROPERTY_VALUES.PasswordJavaScriptRegEx;
        }
        setIsPasswordPatternValid(validateInputAgainstRegEx(password, passwordRegex));
    };

    /**
     * The following function handles the change of the password.
     *
     * @param values
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();
        setPasswordRegEx(password)
            .finally(() => {
                setPasswordRegExLoading(false);
            });
    };

    /**
     * The following function handles the change of the username.
     *
     * @param values
     */
    const handleUserNameChange = (values: Map<string, FormValue>): void => {
        setUpdatedUsername(values?.get("userName")?.toString());
    };

    /**
     * The following function generate a random password.
     */
    const generateRandomPassword = (): void => {
        setRandomPassword(generate({ length: 10, numbers: true }));
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = (): void => {
        const storeOptions = [
                {
                    key: -1,
                    text: t("adminPortal:components.users.userstores.userstoreOptions.primary"),
                    value: "primary"
                }
            ];
        let storeOption =
            {
                key: null,
                text: "",
                value: ""
            };
        getUserStoreList()
            .then((response) => {
                if (storeOptions === []) {
                    storeOptions.push(storeOption);
                }
                response.data.map((store, index) => {
                    storeOption = {
                        key: index,
                        text: store.name,
                        value: store.name
                    };
                    storeOptions.push(storeOption);
                }
                );
                setUserStoresList(storeOptions);
            });

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
            passwordOption: values.get("passwordOption").toString(),
            userName: values.get("userName").toString()
        };
    };

    const handlePasswordOptions = () => {
        if (passwordOption && passwordOption === "createPw") {
            return (
                <>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                data-testid="user-mgt-add-user-form-newPassword-input"
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "adminPortal:components.user.forms.addUserForm.inputs.newPassword.label"
                                ) }
                                name="newPassword"
                                placeholder={ t(
                                    "adminPortal:components.user.forms.addUserForm.inputs." +
                                    "newPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "adminPortal:components.user.forms.addUserForm." +
                                    "inputs.newPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value={ isPasswordGenerated ? randomPassword : initialValues?.newPassword }
                                listen={ handlePasswordChange }
                                loading={ isPasswordRegExLoading }
                                validation={ (value: string, validation: Validation) => {
                                    if (!isPasswordPatternValid) {
                                        validation.isValid = false;
                                        validation.errorMessages.push( t("adminPortal:components.user.forms." +
                                            "addUserForm.inputs.newPassword.validations.regExViolation") );
                                    }
                                } }
                            />
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                className="generate-password-button"
                                onClick={ generateRandomPassword }
                                type="button"
                                value="Generate Password"
                                icon="random"
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                data-testid="user-mgt-add-user-form-confirmPassword-input"
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "adminPortal:components.user.forms.addUserForm.inputs.confirmPassword.label"
                                ) }
                                name="confirmPassword"
                                placeholder={ t(
                                    "adminPortal:components.user.forms.addUserForm.inputs." +
                                    "confirmPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "adminPortal:components.user.forms.addUserForm." +
                                    "inputs.confirmPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                value={ isPasswordGenerated ? randomPassword : initialValues?.confirmPassword }
                                validation={ (value: string, validation: Validation, formValues) => {
                                    if (formValues.get("newPassword") !== value) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("adminPortal:components.user.forms.addUserForm.inputs" +
                                                ".confirmPassword.validations.mismatch"));
                                    }
                                } }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </>
            );
        } else if (passwordOption && passwordOption === "askPw") {
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
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-domain-dropdown"
                            type="dropdown"
                            label={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs.domain.label"
                            ) }
                            name="domain"
                            children={ userStoreOptions }
                            requiredErrorMessage={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs.domain.validations.empty"
                            ) }
                            required={ true }
                            value={ initialValues?.domain ? initialValues?.domain : userStoreOptions[0]?.value }
                            listen={ handleUserStoreChange }
                        />
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-username-input"
                            label={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs.username.label"
                            ) }
                            name="userName"
                            placeholder={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs." +
                                "username.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "adminPortal:components.user.forms.addUserForm." +
                                "inputs.username.validations.empty"
                            ) }
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (isUsernameValid === false) {
                                    validation.isValid = false;
                                    validation.errorMessages.push( t("adminPortal:components.user.forms." +
                                        "addUserForm.inputs.username.validations.invalid") );
                                }
                                if (!isUsernamePatternValid) {
                                    validation.isValid = false;
                                    validation.errorMessages.push( t("adminPortal:components.user.forms." +
                                        "addUserForm.inputs.username.validations.regExViolation") );
                                }
                            } }
                            value={ initialValues && initialValues.userName }
                            listen={ handleUserNameChange }
                            loading={ isUsernameRegExLoading }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-firstName-input"
                            label={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs.firstName.label"
                            ) }
                            name="firstName"
                            placeholder={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs." +
                                "firstName.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "adminPortal:components.user.forms.addUserForm." +
                                "inputs.firstName.validations.empty"
                            ) }
                            type="text"
                            value={ initialValues && initialValues.firstName }
                        />
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-lastName-input"
                            label={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs.lastName.label"
                            ) }
                            name="lastName"
                            placeholder={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs." +
                                "lastName.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "adminPortal:components.user.forms.addUserForm." +
                                "inputs.lastName.validations.empty"
                            ) }
                            type="text"
                            value={ initialValues && initialValues.lastName }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            data-testid="user-mgt-add-user-form-email-input"
                            label={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs.email.label"
                            ) }
                            name="email"
                            placeholder={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs." +
                                "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "adminPortal:components.user.forms.addUserForm.inputs.email.validations.empty"
                            ) }
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.email(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t(
                                            "adminPortal:components.user.forms.addUserForm.inputs.email." +
                                            "validations.invalid"
                                        ).toString()
                                    );
                                }
                            }
                            }
                            type="email"
                            value={ initialValues && initialValues.email }
                        />
                    </Grid.Column>
                </Grid.Row>
                { emailVerificationEnabled &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Field
                                data-testid="user-mgt-add-user-form-passwordOption-radio-button"
                                type="radio"
                                label={ t("adminPortal:components.user.forms.addUserForm.buttons.radioButton.label") }
                                name="passwordOption"
                                default="createPw"
                                listen={ (values) => { setPasswordOption(values.get("passwordOption").toString()); } }
                                children={ passwordOptions }
                                value={ initialValues && initialValues.passwordOption }
                            />
                        </Grid.Column>
                    </Grid.Row>
                }
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
