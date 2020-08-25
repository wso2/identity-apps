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

import { Field, Forms } from "@wso2is/forms";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid } from "semantic-ui-react";
import * as UIConstants from "../../constants/ui-constants";
import { EditSection } from "../shared";

/**
 * Proptypes for the linked accounts edit component.
 */
interface LinkedAccountsEditProps {
    onFormEditViewHide: (formName: string) => void;
    onFormSubmit: (values: Map<string, string | string[]>, formName: string) => void;
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
    const { onFormEditViewHide, onFormSubmit } = props;
    const { t } = useTranslation();

    return (
        <EditSection>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 4 }>
                        { t("userPortal:components.linkedAccounts.accountTypes.local.label") }
                    </Grid.Column>
                    <Grid.Column width={ 12 }>
                        <Forms
                            onSubmit={ (values) => {
                                onFormSubmit(values, UIConstants.ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER);
                            } }
                        >
                            <Field
                                autoFocus={ true }
                                label={ t(
                                    "userPortal:components.linkedAccounts.forms.addAccountForm" +
                                    ".inputs.username.label"
                                ) }
                                name="username"
                                placeholder={ t(
                                    "userPortal:components.linkedAccounts.forms." +
                                    "addAccountForm.inputs.username.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "userPortal:components.linkedAccounts.forms" +
                                    ".addAccountForm.inputs.username.validations.empty"
                                ) }
                                type="text"
                            />
                            <Field
                                hidePassword={ t("common:hidePassword") }
                                label={ t(
                                    "userPortal:components.linkedAccounts.forms.addAccountForm." +
                                    "inputs.password.label"
                                ) }
                                name="password"
                                placeholder={ t(
                                    "userPortal:components.linkedAccounts.forms" +
                                    ".addAccountForm.inputs.password.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "userPortal:components.linkedAccounts.forms" +
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
