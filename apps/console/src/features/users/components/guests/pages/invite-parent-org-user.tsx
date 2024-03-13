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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { AutocompleteFieldAdapter, FinalForm, FinalFormField } from "@wso2is/form";
import { Hint, Message } from "@wso2is/react-components";
import classNames from "classnames";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { FormRenderProps } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import { GroupsInterface, useGroupList } from "../../../../groups";
import { PRIMARY_USERSTORE } from "../../../../userstores/constants";
import { UserManagementConstants } from "../../../constants";
import { GroupsAutoCompleteOption, InviteParentOrgUserFormValuesInterface } from "../models/invite";

import "./invite-parent-org-user.scss";

interface InviteParentOrgUserFormErrorsInterface {
    username: string;
    groups: string;
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
    const userStore: string = PRIMARY_USERSTORE;

    const { t } = useTranslation();

    const {
        data: groupList
    } = useGroupList(userStore, "members", null, true);

    const groupsAutocompleteOptions: GroupsAutoCompleteOption[] = useMemo(() => {

        if (isEmpty(groupList?.Resources)) {
            return [];
        }

        return groupList?.Resources
            ?.map((group: GroupsInterface) => {
                return {
                    group,
                    key: group.id,
                    label: group.displayName
                };
            });
    }, [ groupList ]);

    /**
     * Validates the invite parent org user form values.
     * @param values - Form values.
     * @returns An error object containing validation error messages.
     */
    const validateInviteParentOrgUserForm = (
        values: InviteParentOrgUserFormValuesInterface
    ): InviteParentOrgUserFormErrorsInterface => {

        const errors: InviteParentOrgUserFormErrorsInterface = {
            groups: undefined,
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
                            ariaLabel="Usernames field"
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
                            filterOptions={ (_options: any, params: any) => {
                                const { inputValue } = params;

                                if (inputValue !== "") {
                                    return [ `${inputValue}` ];
                                } else {
                                    return [];
                                }
                            } }
                            renderOption={ (props: any, option: string) => {
                                return (
                                    <li
                                        { ...props }
                                        className={ classNames("press-enter-prompt", props.className) }
                                    >
                                        { option }
                                        <p>
                                            <Trans
                                                i18nKey={ "common:pressEnterPrompt" }
                                            >
                                                Press <kbd>Enter</kbd> to select
                                            </Trans>
                                        </p>
                                    </li>
                                );
                            } }
                            multipleValues
                            freeSolo
                        />
                        <FinalFormField
                            fullWidth
                            multipleValues
                            ariaLabel="Groups field"
                            data-componentid={ `${componentId}-form-groups-field` }
                            name="groups"
                            label={ t("console:manage.features.parentOrgInvitations.addUserWizard.groups.label") }
                            helperText={
                                (<Hint>
                                    <Typography variant="inherit">
                                        { t("console:manage.features.parentOrgInvitations.addUserWizard.groups" +
                                            ".hint") }
                                    </Typography>
                                </Hint>)
                            }
                            placeholder={
                                t("console:manage.features.parentOrgInvitations.addUserWizard.groups.placeholder")
                            }
                            component={ AutocompleteFieldAdapter }
                            options={ groupsAutocompleteOptions }
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
