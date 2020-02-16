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

import { Field, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
    Form,
    Grid,
    Message,
    Modal,
} from "semantic-ui-react";
import { addUser, addUserRole, getGroupsList, getUserStoreList } from "../../api";
import { AlertLevels, createEmptyUserBasicWizard, UserBasicWizard } from "../../models";
import { addAlert } from "../../store/actions";
import { useTrigger } from "@wso2is/forms";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserProps {
    isRoleModalOpen: boolean;
    handleRoleModalOpen: any;
    handleRoleModalClose: any;
    userData: UserBasicWizard;
    setUserData: any;
    next: () => void;
}

/**
 * Add user page.
 *
 * @return {JSX.Element}
 */
export const AddUser: React.FunctionComponent<AddUserProps> = (props: AddUserProps): JSX.Element => {

    const [ groupsList, setGroupsList ] = useState([]);
    const [ userStoreOptions, setUserStoresList ] = useState([]);
    const [ username, setUsername ] = useState("");
    const [ roleIds, setRoleIds ] = useState([]);
    const [ userId, setUserId ] = useState("");
    const [ passwordOption, setPasswordOption ] = useState("");
    const [resetStateUserForm, resetUserForm] = useTrigger();
    const [resetStateUserRoleForm, resetUserRoleForm] = useTrigger();

    let newUser = createEmptyUserBasicWizard();

    const {
        isRoleModalOpen,
        handleRoleModalOpen,
        handleRoleModalClose,
        setUserData,
        userData,
        next
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const passwordOptions = [
        { label: "Invite user to set password", value: "askPw" },
        { label: "Set user password", value: "createPw" },
    ];

    /**
     * Fetch the list of available groups.
     */
    useEffect(() => {
        getGroups();
    }, []);

    /**
     * Fetch the list of available user stores.
     */
    useEffect(() => {
        getUserStores();
    }, []);

    // TODO: enable this function with roles feature.
    // useEffect(() => {
    //     assignUserRole();
    // }, [roleIds]);

    const getGroups = () => {
        getGroupsList()
            .then((response) => {
                setRoleListItem(response.data.Resources);
            });
    };

    /**
     * The following function handles the functionality of
     * the user roles modal.
     */
    const handleRoleModal = () => {
        handleRoleModalOpen();
    };

    /**
     * This function handles assigning the roles to the user.
     */
    const assignUserRole = () => {
        const data = {
            Operations: [
                {
                    op: "add",
                    value: {
                        members: [
                            {
                                display: username,
                                value: userId
                            }
                        ]
                    }
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        };

        for (const roleId of roleIds) {
            addUserRole(data, roleId)
                .then(() => {
                    handleRoleModalClose();
                });
        }
    };

    /**
     * The following function fetch the user store list and set it to the state.
     */
    const getUserStores = () => {
        const storeOptions = [{ text: "Primary", key: -1, value: "primary" }];
        let storeOption = { text: "", key: null, value: "" };
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
    };

    /**
     * The following function set the role list to the state.
     *
     * @param resources
     */
    const setRoleListItem = (resources) => {
        const roles = [];
        let role = {
            label: "",
            value: ""
        };
        resources.map((group) => {
            role = {
                label: group.displayName,
                value: group.id
            };
            roles.push(role);
            setGroupsList(roles);
        });
    };

    const handleSubmit = (values) => {
        newUser = {
            domain: values.get("domain").toString(),
            email: values.get("email").toString(),
            firstName: values.get("firstName").toString(),
            lastName: values.get("lastName").toString(),
            newPassword: values.get("newPassword") && values.get("newPassword") !== undefined  ?
                values.get("newPassword").toString() : "",
            passwordOption: values.get("passwordOption").toString(),
            userName: values.get("userName").toString(),
        };
        addUserBasic(newUser);
    };

    /**
     * This function handles adding the user.
     */
    const addUserBasic = (user: UserBasicWizard) => {
        let userName = "";
        user.domain !== "primary" ? userName = user.domain + "/" + user.userName : userName = user.userName;
        let userDetails = {};
        const password = user.newPassword;

        user.passwordOption && user.passwordOption !== "askPw" ?
            (
                userDetails = {
                    emails:
                        [{
                            primary: true,
                            value: user.email
                        }],
                    name:
                        {
                            familyName: user.lastName,
                            givenName: user.firstName
                        },
                    password,
                    userName
                }
            ) :
            (
                userDetails = {
                    "emails":
                        [{
                            primary: true,
                            value: user.email
                        }],
                    "name":
                        {
                            familyName: user.lastName,
                            givenName: user.firstName
                        },
                    "password": "password",
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User":
                        {
                            askPassword: "true"
                        },
                    userName
                }
            );

        addUser(userDetails)
            .then((response) => {
                // setUserId(response.data.id);
                dispatch(addAlert({
                    description: t(
                        "views:components.users.notifications.addUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "views:components.users.notifications.addUser.success.message"
                    )
                }));
                close();
            })
            .catch((error) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    dispatch(addAlert({
                        description: t(
                            "views:components.users.notifications.addUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.users.notifications.addUser.error.message"
                        )
                    }));
                } else if (error.response && error.response.data && error.response.data.detail) {
                    // reset the form.
                    resetUserForm();

                    dispatch(addAlert({
                        description: t(
                            "views:components.users.notifications.addUser.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.users.notifications.addUser.error.message"
                        )
                    }));
                } else {
                    // reset the form.
                    resetUserForm();

                    // Generic error message
                    dispatch(addAlert({
                        description: t(
                            "views:components.users.notifications.addUser.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.users.notifications.addUser.genericError.message"
                        )
                    }));
                }
            });
    };

    const handlePasswordOptions = () => {
        if (passwordOption && passwordOption === "createPw") {
            return (
                <>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "views:components.user.forms.addUserForm.inputs.newPassword.label"
                                ) }
                                name="newPassword"
                                placeholder={ t(
                                    "views:components.user.forms.addUserForm.inputs." +
                                    "newPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "views:components.user.forms.addUserForm." +
                                    "inputs.newPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                            />
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "views:components.user.forms.addUserForm.inputs.confirmPassword.label"
                                ) }
                                name="confirmPassword"
                                placeholder={ t(
                                    "views:components.user.forms.addUserForm.inputs." +
                                    "confirmPassword.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "views:components.user.forms.addUserForm." +
                                    "inputs.confirmPassword.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                                validation={ (value: string, validation: Validation, formValues) => {
                                    if (formValues.get("newPassword") !== value) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("views:components.user.forms.addUserForm.inputs" +
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
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Message
                                icon="mail"
                                content="We will send an email with the link to set the password to the email address provided."
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
            onSubmit={ (values) => {
                handleSubmit(values);
            } }
            resetState={ resetStateUserForm }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="dropdown"
                            label={ t(
                                "views:components.user.forms.addUserForm.inputs.domain.label"
                            ) }
                            name="domain"
                            children={ userStoreOptions }
                            placeholder={ t(
                                "views:components.user.forms.addUserForm.inputs.domain.placeholder"
                            ) }
                            requiredErrorMessage={ t(
                                "views:components.user.forms.addUserForm.inputs.domain.validations.empty"
                            ) }
                            required={ true }
                            value={ userData && userData.domain }
                        />
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            label={ t(
                                "views:components.user.forms.addUserForm.inputs.username.label"
                            ) }
                            name="userName"
                            placeholder={ t(
                                "views:components.user.forms.addUserForm.inputs." +
                                "username.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "views:components.user.forms.addUserForm." +
                                "inputs.username.validations.empty"
                            ) }
                            type="text"
                            value={ userData && userData.userName }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            label={ t(
                                "views:components.user.forms.addUserForm.inputs.firstName.label"
                            ) }
                            name="firstName"
                            placeholder={ t(
                                "views:components.user.forms.addUserForm.inputs." +
                                "firstName.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "views:components.user.forms.addUserForm." +
                                "inputs.firstName.validations.empty"
                            ) }
                            type="text"
                            value={ userData && userData.firstName }
                        />
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            label={ t(
                                "views:components.user.forms.addUserForm.inputs.lastName.label"
                            ) }
                            name="lastName"
                            placeholder={ t(
                                "views:components.user.forms.addUserForm.inputs." +
                                "lastName.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "views:components.user.forms.addUserForm." +
                                "inputs.lastName.validations.empty"
                            ) }
                            type="text"
                            value={ userData && userData.lastName }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            label="Email address"
                            name="email"
                            placeholder={ t(
                                "views:components.user.forms.addUserForm.inputs." +
                                "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "views:components.user.forms.addUserForm.inputs.email.validations.empty"
                            ) }
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.email(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t(
                                            "views:components.user.forms.addUserForm.inputs.email." +
                                            "validations.invalid"
                                        ).toString()
                                    );
                                }
                            }
                            }
                            type="email"
                            value={ userData && userData.email }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            type="radio"
                            label="Select the method to set the user password"
                            name="passwordOption"
                            default="Ask password"
                            listen={ (values) => { setPasswordOption(values.get("passwordOption").toString()); } }
                            children={ passwordOptions }
                            value={ userData && userData.passwordOption }
                        />
                    </Grid.Column>
                </Grid.Row>
                { handlePasswordOptions() }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Form.Group>
                            <Field
                                size="small"
                                type="submit"
                                value={ t("common:save").toString() }
                            />
                        </Form.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );

    /**
     * The modal to add user roles.
     */
    const addUserRoles = () => (
        <Modal open={ isRoleModalOpen } size="small">
            <Modal.Header>
                Assign roles
            </Modal.Header>
            <Modal.Content>
                <Forms
                    onSubmit={ (value) => {
                        setRoleIds(value.get("role") as string[]);
                    } }
                    resetState={ resetStateUserRoleForm }
                >
                    <Field
                        type="checkbox"
                        label="Select role"
                        name="role"
                        children={ groupsList }
                        required={ true }
                        requiredErrorMessage="Please select a role to assign"
                    />
                    <Field
                        hidden={ true }
                        type="divider"
                    />
                    <Form.Group>
                        <Field
                            size="small"
                            type="submit"
                            value={ t("common:save").toString() }
                        />
                        <Field
                            className="link-button"
                            onClick={ handleBasicModalClose }
                            size="small"
                            type="button"
                            value={ t("common:cancel").toString() }
                        />
                    </Form.Group>
                </Forms>
            </Modal.Content>
        </Modal>
    );

    return (
        <>
            { addUserBasicForm() }
            { addUserRoles() }
        </>
    );
};
