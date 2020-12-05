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
 * under the License
 */

import { AlertInterface, AlertLevels, ProfileInfoInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Message, Modal } from "semantic-ui-react";
import { SharedUserStoreUtils } from "../../core/utils";
import { PRIMARY_USERSTORE_PROPERTY_VALUES, USERSTORE_REGEX_PROPERTIES } from "../../userstores/constants";
import { updateUserInfo } from "../api";

/**
 * import pass strength bat dynamically.
 */
const PasswordMeter = React.lazy(() => import("react-password-strength-bar"));

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
}

/**
 * Change user password component.
 *
 * @param {ChangePasswordPropsInterface} props - Props injected to the change user password component.
 * @return {ReactElement}
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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isPasswordRegExLoading, setPasswordRegExLoading ] = useState<boolean>(false);
    const [ isPasswordPatternValid, setIsPasswordPatternValid ] = useState<boolean>(true);
    const [ password, setPassword ] = useState<string>("");
    const [ triggerSubmit, setTriggerSubmit ] = useState<boolean>(false);

    const handelChangeUserPassword = (values: Map<string, string | string[]>): void => {

        const data = {
            "Operations": [
                {
                    "op": "replace",
                    "value": {
                        "password": values.get("newPassword").toString()
                    }
                }
            ],
            "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        updateUserInfo(user.id, data).then(() => {
            onAlertFired({
                description: t(
                    "console:manage.features.user.profile.notifications.changeUserPassword.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.user.profile.notifications.changeUserPassword.success.message"
                )
            });
            handleCloseChangePasswordModal();
            handleUserUpdate(user.id);
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.description) {
                onAlertFired({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.user.profile.notifications.changeUserPassword.error." +
                        "message")
                });

                return;
            }

            onAlertFired({
                description: t("console:manage.features.user.profile.notifications.changeUserPassword.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.user.profile.notifications.changeUserPassword.genericError." +
                    "message")
            });
        });
    };

    /**
     * The following function checks if the password pattern is valid against the user store regEx.
     *
     * @param password
     */
    const setPasswordRegEx = async (password: string): Promise<void> => {
        let passwordRegex = "";
        const userStore = user?.userName?.split("/")?.length > 1 ? user?.userName?.split("/")[0] : "primary";

        if (userStore !== "primary") {
            // Set the username regEx of the secondary user store.
            await SharedUserStoreUtils.getUserStoreRegEx(userStore, USERSTORE_REGEX_PROPERTIES.PasswordRegEx)
                .then((response) => {
                    setPasswordRegExLoading(true);
                    passwordRegex = response;
                });
        } else {
            // Set the username regEx of the primary user store.
            passwordRegex = PRIMARY_USERSTORE_PROPERTY_VALUES.PasswordJavaScriptRegEx;
        }
        setIsPasswordPatternValid(SharedUserStoreUtils.validateInputAgainstRegEx(password, passwordRegex));
    };

    /**
     * The following function handles the change of the password.
     *
     * @param values
     */
    const handlePasswordChange = (values: Map<string, FormValue>): void => {
        const password: string = values.get("newPassword").toString();
        setPassword(password);

        setPasswordRegEx(password)
            .finally(() => {
                setPasswordRegExLoading(false);
            });
    };

    return (
        <Modal
            data-testid={ testId }
            open={ openChangePasswordModal }
            size="tiny"
        >
            <Modal.Header>
                { t("console:manage.features.user.modals.changePasswordModal.header") }
            </Modal.Header>
            <Modal.Content>
                <Forms
                    data-testid={ `${ testId }-form` }
                    onSubmit={ (values) => handelChangeUserPassword(values) }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Field
                                    data-testid="user-mgt-edit-user-form-newPassword-input"
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
                                    value=""
                                    listen={ handlePasswordChange }
                                    loading={ isPasswordRegExLoading }
                                    validation={ (value: string, validation: Validation) => {
                                        if (!isPasswordPatternValid) {
                                            validation.isValid = false;
                                            validation.errorMessages.push( t("console:manage.features.user.forms." +
                                                "addUserFor1m.inputs.newPassword.validations.regExViolation") );
                                        }
                                    } }
                                />
                                <Suspense fallback={ null } >
                                    <PasswordMeter password={ password } />
                                </Suspense>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Field
                                    data-testid="user-mgt-edit-user-form-confirmPassword-input"
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
                                    value=""
                                    validation={ (value: string, validation: Validation, formValues) => {
                                        if (formValues.get("newPassword") !== value) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("console:manage.features.user.forms.addUserForm.inputs" +
                                                    ".confirmPassword.validations.mismatch"));
                                        }
                                    } }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Message color='teal'>
                                    <Hint>
                                        { t("console:manage.features.user.modals.changePasswordModal.message") }
                                    </Hint>
                                </Message>
                            </Grid.Column>
                        </Grid.Row>
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
                                onClick={ () => setTriggerSubmit(true) }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                            <LinkButton
                                data-testid={ `${ testId }-cancel-button` }
                                floated="left"
                                onClick={ handleCloseChangePasswordModal }
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
