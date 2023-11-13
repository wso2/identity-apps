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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import {
    Hint,
    Message
} from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AppState } from "../../../../core";
import { UserInviteInterface } from "../models/invite";

/**
 * Proptypes for the invite parent org user component.
 */
interface InviteParentOrgUserProps extends IdentifiableComponentInterface {
    triggerSubmit: boolean;
    onSubmit?: (values: any) => void;
    setFinishButtonDisabled: (values: boolean) => void;
}

/**
 * Invite parent org user component.
 *
 * @returns invite parent org user modal component.
 */
export const InviteParentOrgUser: React.FunctionComponent<InviteParentOrgUserProps> = (
    props: InviteParentOrgUserProps): ReactElement => {

    const {
        triggerSubmit,
        onSubmit,
        [ "data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const currentOrganization: string =  useSelector((state: AppState) => state?.config?.deployment?.tenant);

    /**
     * Extracts form values from a Map and triggers a submit action if specified.
     * @param values - A Map containing form values where keys are strings and values are of type FormValue.
     */
    const getFormValues = (values: Map<string, FormValue>): void => {

        const inviteUser: UserInviteInterface = {
            username: values.get("username").toString()
        };

        if (triggerSubmit) {
            onSubmit(inviteUser);
        }
    };

    return (
        <Forms
            data-componentid={ `${ componentId }-external-form` }
            onSubmit={ (values: Map<string, FormValue>) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            {
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                            <Message
                                type="info"
                                className="add-user-info"
                                content={ 
                                    (<Trans
                                        i18nKey= "console:manage.features.parentOrgInvitations.addUserWizard.hint"
                                        tOptions={ { currentOrganization: currentOrganization } }
                                    >
                                        Invited users are managed by the parent organization.                        
                                    </Trans>)
                                }
                            />
                            <Field
                                data-componentid={ `${ componentId }-external-form-username-input` }
                                label={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs.username.label"
                                ) }
                                name="username"
                                placeholder={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs." +
                                    "username.placeholder"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "console:manage.features.user.forms.addUserForm.inputs.email.validations.empty"
                                ) }
                                type="text"
                                tabIndex={ 5 }
                                maxLength={ 50 }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                            <Hint>
                                <Trans 
                                    i18nKey="console:manage.features.parentOrgInvitations.addUserWizard.usernameHint"
                                    tOptions={ { currentOrganization: currentOrganization } }
                                >
                                    Username should belong to a user 
                                    from the <strong>{ currentOrganization } </strong> organization.
                                </Trans>
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                    <Divider hidden/>
                </Grid>
            }
        </Forms>
    );
};

/**
 * Default props for the component.
 */
InviteParentOrgUser.defaultProps = {
    "data-componentid": "invite-parent-org-user"
};
