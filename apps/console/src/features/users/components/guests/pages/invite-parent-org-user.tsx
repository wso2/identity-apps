/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AutocompleteRenderGetTagProps } from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { AutocompleteFieldAdapter, FinalForm, FinalFormField } from "@wso2is/form";
import { Hint, Message } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { FormRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useRolesList } from "../../../../roles/api";
import { UserManagementConstants } from "../../../constants";
import {
    InviteParentOrgUserFormValuesInterface,
    RolesAutoCompleteOption
} from "../models/invite";

interface InviteParentOrgUserFormErrorsInterface {
    username: string;
    roles: string;
}

/**
 * Props interface of {@link InviteParentOrgUser}
 */
interface InviteParentOrgUserPropsInterface extends IdentifiableComponentInterface {
    onSubmit?: (values:  InviteParentOrgUserFormValuesInterface) => void;
    [ "data-componentid" ]?: string;
}

/**
 * The invite parent organization user component.
 *
 * @returns Invite parent organization user component.
 */
export const InviteParentOrgUser: FunctionComponent<InviteParentOrgUserPropsInterface> = (
    props: InviteParentOrgUserPropsInterface
): ReactElement => {

    const {
        onSubmit,
        [ "data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { data: allowedRoles } = useRolesList(
        undefined,
        undefined,
        undefined,
        "users,groups,permissions,associatedApplications"
    );

    const rolesAutocompleteOptions: RolesAutoCompleteOption[] = useMemo(() => {

        if (isEmpty(allowedRoles?.Resources)) {
            return [];
        }

        return allowedRoles?.Resources
            ?.filter((role: RolesInterface) => role.audience.display !== "Console")
            ?.map((role: RolesInterface) => {
                return {
                    key: role.id,
                    label: role.displayName,
                    role
                };
            });
    }, [ allowedRoles ]);

    /**
     * Validates the invite parent org user form values.
     * @param values - Form values.
     * @returns An error object containing validation error messages.
     */
    const validateInviteParentOrgUserForm = (
        values: InviteParentOrgUserFormValuesInterface
    ): InviteParentOrgUserFormErrorsInterface => {

        const errors: InviteParentOrgUserFormErrorsInterface = {
            roles: undefined,
            username: undefined
        };

        if (!values.username) {
            errors.username = t("console:manage.features.parentOrgInvitations.addUserWizard.username.validations" +
                ".required");
        }

        return errors;
    };

    return (
        <FinalForm
            initialValues={ null }
            keepDirtyOnReinitialize={ true }
            data-componentid={ `${ componentId }-external-form` }
            onSubmit={ onSubmit }
            validate={ validateInviteParentOrgUserForm }
            render={ ({ handleSubmit }: FormRenderProps) => {
                return (
                    <form
                        id={ UserManagementConstants.INVITE_PARENT_ORG_USER_FORM_ID }
                        onSubmit={ handleSubmit }
                        className="invite-parent-org-user-form">
                        <Message
                            type="info"
                            className="add-user-info"
                            content={ t("console:manage.features.parentOrgInvitations.addUserWizard.hint") }
                        />
                        <FinalFormField
                            fullWidth
                            ariaLabel="Username field"
                            data-componentid={ `${componentId}-external-form-username-input` }
                            label={ t("console:manage.features.parentOrgInvitations.addUserWizard.username.label") }
                            name="username"
                            placeholder={ t(
                                "console:manage.features.parentOrgInvitations.addUserWizard.username.placeholder"
                            ) }
                            required={ true }
                            helperText={ (
                                <Hint>
                                    <Typography variant="inherit">
                                        { t("console:manage.features.parentOrgInvitations.addUserWizard.username" +
                                            ".hint") }
                                    </Typography>
                                </Hint>
                            ) }
                            component={ AutocompleteFieldAdapter }
                            options={ [] }
                            renderTags={ (
                                values: readonly string[],
                                getTagProps: AutocompleteRenderGetTagProps
                            ) =>
                                values.map((option: string, index: number) => (
                                    <Chip
                                        key={ index }
                                        size="small"
                                        sx={ { marginLeft: 1 } }
                                        className="oxygen-chip-beta"
                                        label={ option }
                                        { ...getTagProps({ index }) }
                                    />
                                ))
                            }
                            multipleValues
                            freeSolo
                        />
                        <FinalFormField
                            fullWidth
                            multipleValues
                            ariaLabel="Roles field"
                            data-componentid={ `${componentId}-form-roles-field` }
                            name="roles"
                            label={ t("console:manage.features.parentOrgInvitations.addUserWizard.roles.label") }
                            helperText={
                                (<Hint>
                                    <Typography variant="inherit">
                                        { t("console:manage.features.parentOrgInvitations.addUserWizard.roles" +
                                            ".hint") }
                                    </Typography>
                                </Hint>)
                            }
                            placeholder={
                                t("console:manage.features.parentOrgInvitations.addUserWizard.roles.placeholder")
                            }
                            component={ AutocompleteFieldAdapter }
                            options={ rolesAutocompleteOptions }
                            renderTags={ (value: readonly any[], getTagProps: AutocompleteRenderGetTagProps) => {
                                return value.map((option: any, index: number) => (
                                    <Chip
                                        key={ index }
                                        size="medium"
                                        label={ option.label }
                                        { ...getTagProps({ index }) }
                                    />
                                ));
                            } }
                        />
                    </form>
                );
            } }
        />
    );
};

/**
 * Default props for the invite parent org user wizard component.
 */
InviteParentOrgUser.defaultProps = {
    "data-componentid": "invite-parent-org-user"
};
