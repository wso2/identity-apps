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

import { CheckboxChild, Field, Forms, FormValue, Validation } from "@wso2is/forms";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    Button,
    Checkbox,
    Container,
    Divider,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    Modal,
    ModalContent
} from "semantic-ui-react";
import { addUser, addUserRole, getGroupsList, getUserStoreList } from "../../api";
import { AlertInterface, AlertLevels } from "../../models";
import { EditSection } from "../edit-section";
import { ModalComponent } from "../shared";

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
    const [ isUserWarnModalOpen, setUserWarnModalOpen] = useState(false);
    const [ roleIds, setRoleIds ] = useState([]);
    const [ userId, setUserId ] = useState("");
    const [ passwordOption, setPasswordOption ] = useState("askPw");

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

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        getUserStores();
    }, []);

    useEffect(() => {
        assignUserRole();
    }, [roleIds]);

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
        handleAddUserWarnModalClose();
    };

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

    const handleAddUserWarnModalClose = (): void => {
        setUserWarnModalOpen(false);
    };

    /**
     * Device registration error modal.
     *
     * @return {JSX.Element}
     */
    const addUserWarnModal = (): JSX.Element => {
        return (
            <ModalComponent
                primaryAction={ t("common:save") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleAddUserWarnModalClose }
                onPrimaryActionClick={ addUserBasic }
                open={ isUserWarnModalOpen }
                onClose={ handleAddUserWarnModalClose }
                type="warning"
                header={ t("views:components.user.modals.addUserWarnModal.heading") }
                content={ t("views:components.user.modals.addUserWarnModal.message") }
            >
                <Modal.Content>
                    <Button
                        className="warning-modal-link-button"
                        onClick={ handleRoleModal }
                    >
                        { t("views:components.users.buttons.assignUserRoleBtn") }
                    </Button>
                </Modal.Content>
            </ModalComponent>
        );
    };

    /**
     * This function handles adding the user
     */
    const addUserBasic = () => {
        let userName = "";
        domain !== "primary" ? userName = domain + "/" + username : userName = username;
        let data = {};

        if (passwordOption && passwordOption !== "askPw") {
            data = {
                password,
                userName
            };
        }

        data = {
            "emails":
                [{
                    primary: true,
                    value: "nipunib@wso2.com"

                }],
            password,
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User":
                {
                    askPassword: "true"
                },
            userName
        };

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
                handleAddUserWarnModalClose();
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
                    resetForm();
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
                    resetForm();
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
     * Resets the form by re-initializing state.
     */
    let resetForm: () => void = () => undefined;

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
                        setUsername(value.get("username").toString());
                        setPassword(value.get("newPassword").toString());
                        setDomain(value.get("domain").toString());
                        setRoleIds(value.get("role") as string[]);
                        setUserWarnModalOpen(true);
                        handleModalClose();
                    } }
                    triggerReset={ (reset) => {
                        resetForm = reset;
                    } }
                >
                    <Field
                        type="dropdown"
                        label="Domain name"
                        name="domain"
                        children={ userStoreOptions }
                        placeholder="Select domain"
                        requiredErrorMessage="Domain should not be empty"
                        required={ true }
                        width={ 9 }
                    />
                    <Field
                        label={ t(
                            "views:components.user.forms.addUserForm.inputs" + ".username.label"
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
                        label="Select option"
                        name="option"
                        default="Ask password"
                        children={ passwordOptions }
                    />
                    <Field
                        hidden={ true }
                        type="divider"
                    />
                    {
                        passwordOption && passwordOption === "createPw" ?
                            (
                                <EditSection>
                                <Field
                                    hidePassword={ t("common:hidePassword") }
                                    label={ t(
                                        "views:components.user.forms.addUserForm.inputs" + ".newPassword.label"
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
                                    "views:components.user.forms.addUserForm.inputs" + ".confirmPassword.label"
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
                            ) :
                            (
                                <EditSection>
                                <Field
                                    hidePassword={ t("common:hidePassword") }
                                    label="Email address"
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
                            )
                    }
                    <Form.Group>
                        <Field
                            size="small"
                            type="submit"
                            value={ t("common:submit").toString() }
                        />
                        <Field
                            className="link-button"
                            size="small"
                            type="button"
                            value="Assign roles"
                            floated="right"
                            onClick={ handleRoleModalOpen }
                        />
                        <Field
                            className="link-button"
                            onClick={ handleModalClose }
                            size="small"
                            type="button"
                            value={ t("common:cancel").toString() }
                        />
                    </Form.Group>
                </Forms>
            </Modal.Content>
        </Modal>
    );

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
                    triggerReset={ (reset) => {
                        resetForm = reset;
                    } }
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
                            onClick={ handleRoleModalClose }
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
            { addUserWarnModal() }
        </>
    );
};
