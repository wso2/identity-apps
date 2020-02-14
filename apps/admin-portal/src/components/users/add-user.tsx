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

import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { Field, Forms, useTrigger, Validation } from "@wso2is/forms";
import { EditSection } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Form,
    Grid,
    Icon,
    Modal,
} from "semantic-ui-react";
import { addUser, addUserRole, getGroupsList, getUserStoreList } from "../../api";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserProps {
    isBasicModalOpen: boolean;
    handleModalClose: any;
    isRoleModalOpen: boolean;
    handleRoleModalOpen: any;
    handleRoleModalClose: any;
    getUserList: () => void;
    onAlertFired: (alert: AlertInterface) => void;
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
    const [ password, setPassword ] = useState("");
    const [ domain, setDomain ] = useState("");
    const [ roleIds, setRoleIds ] = useState([]);
    const [ userId, setUserId ] = useState("");
    const [ passwordOption, setPasswordOption ] = useState("");
    const [email, setEmail] = useState("");

    const [resetStateUserForm, resetUserForm] = useTrigger();
    const [resetStateUserRoleForm, resetUserRoleForm] = useTrigger();

    const {
        getUserList,
        isBasicModalOpen,
        handleModalClose,
        isRoleModalOpen,
        handleRoleModalOpen,
        handleRoleModalClose,
        onAlertFired
    } = props;
    const { t } = useTranslation();
    const passwordOptions = [
        { label: "Ask password", value: "askPw" },
        { label: "Create password", value: "createPw" },
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

    /**
     * The api request to add the user will be sent
     * depending on the state change of the username.
     */
    useEffect(() => {
        if (username !== "") {
            addUserBasic();
        }
    }, [username]);

    const getGroups = () => {
        getGroupsList()
            .then((response) => {
                setRoleListItem(response.data.Resources);
            });
    };

    const handlePasswordOptions = () => {
        if (passwordOption && passwordOption === "createPw") {
            return (
                <EditSection>
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
                        width={ 9 }
                    />
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
                        width={ 9 }
                    />
                    <Field
                        hidden={ true }
                        type="divider"
                    />
                </EditSection>
            );
        } else if (passwordOption && passwordOption === "askPw") {
            return (
                <EditSection>
                    <Field
                        label="Email address"
                        name="email"
                        placeholder={ t(
                            "views:components.user.forms.addUserForm.inputs." +
                            "newPassword.placeholder"
                        ) }
                        required={ true }
                        requiredErrorMessage={ t(
                            "views:components.user.forms.addUserForm." +
                            "inputs.newPassword.validations.empty"
                        ) }
                        type="text"
                        width={ 9 }
                    />
                    <p style={ { fontSize: "12px" } }>
                        <Icon color="grey" floated="left" name="info circle" />
                        An email requesting a password will be set to this address
                    </p>
                    <Field
                        hidden={ true }
                        type="divider"
                    />
                </EditSection>
            );
        } else {
            return "";
        }
    };

    const handleBasicModalClose = () => {
        setPasswordOption("");
        handleModalClose();
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

    /**
     * This function handles adding the user.
     */
    const addUserBasic = () => {
        let userName = "";
        domain !== "primary" ? userName = domain + "/" + username : userName = username;
        let data = {};

        passwordOption && passwordOption !== "askPw" ?
            (
                data = {
                    password,
                    userName
                }
            ) :
            (
                data = {
                    "emails":
                        [{
                            primary: true,
                            value: email
                        }],
                    "password": "password",
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User":
                        {
                            askPassword: "true"
                        },
                    userName
                }
            );

        addUser(data)
            .then((response) => {
                setUserId(response.data.id);
                onAlertFired({
                    description: t(
                        "views:components.users.notifications.addUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "views:components.users.notifications.addUser.success.message"
                    )
                });
                handleBasicModalClose();
                getUserList();
            })
            .catch((error) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    onAlertFired({
                        description: t(
                            "views:components.users.notifications.addUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.users.notifications.addUser.error.message"
                        )
                    });
                } else if (error.response && error.response.data && error.response.data.detail) {
                    // reset the form.
                    resetUserForm();
                    // hide the add user form
                    handleModalClose();

                    onAlertFired({
                        description: t(
                            "views:components.users.notifications.addUser.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.users.notifications.addUser.error.message"
                        )
                    });
                } else {
                    // reset the form.
                    resetUserForm();
                    // hide the add user form
                    handleModalClose();

                    // Generic error message
                    onAlertFired({
                        description: t(
                            "views:components.users.notifications.addUser.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "views:components.users.notifications.addUser.genericError.message"
                        )
                    });
                }
            });
    };

    /**
     * The modal to add new user.
     */
    const addUserBasicForm = () => (
        <Modal open={ isBasicModalOpen } size="small">
            <Modal.Header>
                <Grid>
                    <Grid.Column>
                        <Icon name="user plus"/>
                    </Grid.Column>
                    <Grid.Column width={ 4 }>
                        Add new user
                    </Grid.Column>
                </Grid>
            </Modal.Header>
            <Modal.Content>
                <Forms
                    onSubmit={ (value) => {
                        if (passwordOption === "createPw") {
                            setPassword(value.get("newPassword").toString());
                        }
                        if (passwordOption === "askPw") {
                            setEmail(value.get("email").toString());
                        }
                        setUsername(value.get("username").toString());
                        setDomain(value.get("domain").toString());
                        setRoleIds(value.get("role") as string[]);
                    } }
                    resetState={ resetStateUserForm }
                >
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
                        width={ 9 }
                    />
                    <Field
                        label={ t(
                            "views:components.user.forms.addUserForm.inputs.username.label"
                        ) }
                        name="username"
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
                        width={ 9 }
                    />
                    <Field
                        hidden={ true }
                        type="divider"
                    />
                    <Field
                        hidden={ false }
                        type="divider"
                    />
                    <Field
                        type="radio"
                        label="Password options"
                        name="pwOption"
                        default="Ask password"
                        listen={ (values) => { setPasswordOption(values.get("pwOption").toString()); } }
                        children={ passwordOptions }
                    />
                    <Field
                        hidden={ true }
                        type="divider"
                    />
                    { handlePasswordOptions() }
                    <Form.Group>
                        <Field
                            size="small"
                            type="submit"
                            value={ t("common:submit").toString() }
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
