/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Form, Grid, Input, InputOnChangeData } from "semantic-ui-react";
import * as UIConstants from "../../constants/ui-constants";
import { AppState } from "../../store";
import { EditSection } from "../shared";

/**
 * Model for user linked  account
 */
interface UserAccountInterface {
    username: string;
    password: string;
}

/**
 * Proptypes for the linked accounts edit component.
 * Also see {@link LinkedAccountsEdit.defaultProps}
 */
interface LinkedAccountsEditProps extends TestableComponentInterface {
    onFormEditViewHide: (formName: string) => void;
    onFormSubmit: (values: UserAccountInterface, formName: string) => void;
}

/**
 * Linked accounts edit component.
 *
 * @param {LinkedAccountsEditProps} props - Props injected to the linked accounts edit component.
 * @return {JSX.Element}
 */
export const LinkedAccountsEdit: FunctionComponent<LinkedAccountsEditProps> = (
    props: LinkedAccountsEditProps
): JSX.Element => {

    const {
        onFormEditViewHide,
        onFormSubmit,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();

    const tenantDomain: string = useSelector((state: AppState) => state.authenticationInformation.tenantDomain);
    const [ userName, setUserName ] = useState<string>(undefined);

    /**
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - Username change event.
     * @param {InputOnChangeData} data - Input field data.
     */
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setUserName(data.value);
    };

    /**
     * Get the values of the form on submit.
     * @param {Map<string, FormValue>} values - Form values
     */
    const getFormValues = (values: Map<string, FormValue>) => {
        const formValues = {
            password: values.get("password").toString(),
            username: userName
        };

        onFormSubmit(formValues, UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER);
    };

    return (
        <EditSection data-testid={ `${testId}-editing-section` }>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 4 }>
                        { t("myAccount:components.linkedAccounts.accountTypes.local.label") }
                    </Grid.Column>
                    <Grid.Column width={ 10 }>
                        <Forms
                            onSubmit={ (values) => getFormValues(values) }
                            data-testid={ `${testId}-editing-section-form` }
                        >
                            <Form.Field required data-testid={ `${testId}-editing-section-form-field-username` }>
                                <label>
                                    { t(
                                    "myAccount:components.linkedAccounts.forms.addAccountForm" +
                                    ".inputs.username.label"
                                    ) }
                                </label>
                                <Input
                                    autoFocus={ true }
                                    label={ "@" + tenantDomain }
                                    labelPosition="right"
                                    name="username"
                                    placeholder={ t(
                                        "myAccount:components.linkedAccounts.forms." +
                                        "addAccountForm.inputs.username.placeholder"
                                    ) }
                                    required={ true }
                                    requiredErrorMessage={ t(
                                        "myAccount:components.linkedAccounts.forms" +
                                        ".addAccountForm.inputs.username.validations.empty"
                                    ) }
                                    type="text"
                                    onChange={ handleUsernameChange }
                                />
                            </Form.Field>
                            <Field
                                data-testid={ `${testId}-editing-section-form-field-password` }
                                className="addon-field-wrapper"
                                autoComplete="new-password"
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "myAccount:components.linkedAccounts.forms.addAccountForm." +
                                    "inputs.password.label"
                                ) }
                                name="password"
                                placeholder={ t(
                                    "myAccount:components.linkedAccounts.forms" +
                                    ".addAccountForm.inputs.password.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "myAccount:components.linkedAccounts.forms" +
                                    ".addAccountForm.inputs.password.validations.empty"
                                ) }
                                showPassword={ t("common:showPassword") }
                                type="password"
                            />
                            <Field
                                hidden={ true }
                                type="divider"
                            />
                            <Form.Group inline={ true }>
                                <Field
                                    size="small"
                                    type="submit"
                                    value={ t("common:save").toString() }
                                />
                                <Field
                                    className="link-button"
                                    onClick={ () => {
                                        onFormEditViewHide(UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER);
                                    } }
                                    size="small"
                                    type="button"
                                    value={ t("common:cancel").toString() }
                                />
                            </Form.Group>
                        </Forms>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    );
};

/**
 * Default properties of {@link LinkedAccountsEdit}
 * See type definitions in {@link LinkedAccountsEditProps}
 */
LinkedAccountsEdit.defaultProps = {
    "data-testid": "linked-account-edit"
};
