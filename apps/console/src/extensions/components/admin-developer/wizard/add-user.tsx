/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getRolesList } from "@wso2is/core/api";
import { RolesInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { UserInviteInterface } from "../models";


/**
 * Proptypes for the add user component.
 */
interface AddUserProps {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * Add user page.
 *
 * @return {ReactElement}
 */
export const AddUser: React.FunctionComponent<AddUserProps> = (props: AddUserProps): ReactElement => {

    const {
        triggerSubmit,
        onSubmit
    } = props;

    const [ userRoleOptions, setUserRoleList ] = useState([]);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const { t } = useTranslation();


    useEffect(() => {
        const roleOptions = [];
        let roleOption =
            {
                key: null,
                text: "",
                value: ""
            };
        if (userRoleOptions.length === 0) {
            setUserListRequestLoading(true);
            getRolesList(null)
                .then((response) => {
                    response.data.Resources.map((role: RolesInterface, index) => {
                        if (role.displayName !== "system" && role.displayName !== "everyone") {
                            roleOption = {
                                key: index,
                                text: role.displayName,
                                value: role.displayName
                            };
                            roleOptions.push(roleOption);
                        }
                    });
                    setUserRoleList(roleOptions);
                })
                .finally(() => {
                    setUserListRequestLoading(false);
                });
        }
        setUserRoleList(roleOptions);

    }, []);

    const getFormValues = (values: Map<string, FormValue>): void => {
        const inviteUser: UserInviteInterface = {
            roles: [ values.get("role").toString() ],
            email: values.get("email").toString()
        };

        if (triggerSubmit) {
            onSubmit(inviteUser);
        }
    };
    /**
     * The modal to add new user.
     */
    const inviteUserForm = () => (
        <Forms
            data-testid="user-mgt-add-user-form"
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
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
                            tabIndex={ 5 }
                            maxLength={ 50 }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            data-testid="user-mgt-add-user-form-domain-dropdown"
                            type="dropdown"
                            label={ "Role" }
                            name="role"
                            children={ userRoleOptions }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.domain.validations.empty"
                            ) }
                            required={ true }
                            value={ userRoleOptions[0]?.value }
                            // listen={ handleUserStoreChange }
                            tabIndex={ 1 }
                        />
                        <Hint>
                            { "Select a role to assign to the user. The access level depends on role permissions." }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Divider hidden/>
            </Grid>
        </Forms>
    );

    return (
        <>
            { !isUserListRequestLoading && inviteUserForm() }
        </>
    );
};
