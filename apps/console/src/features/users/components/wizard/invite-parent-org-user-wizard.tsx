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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { UsersConstants } from "../../../../extensions/components/users/constants";
import { UserManagementConstants } from "../../constants";
import { sendParentOrgUserInvite } from "../guests/api/invite";
import {
    InviteParentOrgUserFormValuesInterface,
    ParentOrgUserInvitationResult,
    ParentOrgUserInviteInterface,
    RolesAutoCompleteOption
} from "../guests/models/invite";
import { InviteParentOrgUser } from "../guests/pages/invite-parent-org-user";
import { ParentInviteResponseList } from "../parent-user-invite-response-list";

/**
 * Interface for the Invite Parent Org User Wizard.
 */
interface InviteParentOrgUserWizardProps extends IdentifiableComponentInterface {
    closeWizard: () => void;
    [ "data-componentid" ]: string;
    /**
     * The Callback to trigger on user invite success.
     */
    onUserInviteSuccess?: () => void;
}

export const InviteParentOrgUserWizard: FunctionComponent<InviteParentOrgUserWizardProps> = (
    props: InviteParentOrgUserWizardProps
): ReactElement => {

    const {
        closeWizard,
        onUserInviteSuccess,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const [ parentOrgUserInvitationResults, setParentOrgUserInvitationResults ] =
        useState<ParentOrgUserInvitationResult[]>([]);

    /**
     * Triggers a form submit event for the form in the InviteParentOrgUser component.
     */
    const submitParentUserInviteForm = () => {
        document
            .getElementById(UserManagementConstants.INVITE_PARENT_ORG_USER_FORM_ID)
            .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    };

    /**
     * Handles the error scenario when sending an invitation to a user in a parent organization to join the current
     * organization.
     * @param error - Error response.
     */
    const handleParentOrgUserInviteError = (error: AxiosError) => {
        /**
         * Axios throws a generic `Network Error` for status code 401.
         * As a temporary solution, a check to see if a response
         * is available has been used.
         */
        if (!error?.response || error?.response?.status === 401) {
            setAlert({
                description: t("console:manage.features.invite.notifications.sendInvite.error.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.invite.notifications.sendInvite.error.message")
            });
        } else if (error?.response?.status === 403 &&
            error?.response?.data?.code === UsersConstants.ERROR_COLLABORATOR_USER_LIMIT_REACHED) {
            setAlert({
                description: t("extensions:manage.invite.notifications.sendInvite.limitReachError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:manage.invite.notifications.sendInvite.limitReachError.message")
            });
        } else if (error?.response?.data?.description) {
            setAlert({
                description: t(
                    "console:manage.features.invite.notifications.sendInvite.error.description",
                    { description: error?.response?.data?.description }
                ),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.invite.notifications.sendInvite.error.message")
            });
        } else {
            // Generic error message
            setAlert({
                description: t(
                    "console:manage.features.invite.notifications.sendInvite.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.invite.notifications.sendInvite.genericError.message")
            });
        }
    };

    /**
     * Sends an invitation to a user in a parent organization to join the current organization.
     * @param values - Form values.
     */
    const inviteParentOrgUser = (values: InviteParentOrgUserFormValuesInterface) => {
        const invite: ParentOrgUserInviteInterface = {
            roles: values?.roles?.map((role: RolesAutoCompleteOption) => role.role.id),
            usernames:  values?.username
        };

        setAlert(null);
        setIsSubmitting(true);
        sendParentOrgUserInvite(invite)
            .then((response: AxiosResponse) => {
                const responseData: ParentOrgUserInvitationResult[] = response?.data;

                setParentOrgUserInvitationResults(responseData);
                onUserInviteSuccess();
            })
            .catch((error: AxiosError) => {
                handleParentOrgUserInviteError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            data-componentid={ componentId }
            open
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("console:manage.features.parentOrgInvitations.addUserWizard.heading") }
                <Heading as="h6">
                    { t("console:manage.features.parentOrgInvitations.addUserWizard.description") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { parentOrgUserInvitationResults?.length > 0
                    ? (
                        <ParentInviteResponseList
                            response={ parentOrgUserInvitationResults }
                            isLoading={ isSubmitting }
                        />
                    ) : (
                        <InviteParentOrgUser
                            onSubmit={ inviteParentOrgUser }
                            data-componentid={ `${ componentId }-form` }
                        />
                    ) }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 2 }>
                        <Grid.Column mobile={ 8 }>
                            <LinkButton
                                data-componentid={ `${ componentId }-cancel-button` }
                                floated="left"
                                onClick={ () => {
                                    closeWizard();
                                } }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        {
                            !parentOrgUserInvitationResults || parentOrgUserInvitationResults?.length < 1 && (
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <PrimaryButton
                                        data-componentid={ `${componentId}-finish-button` }
                                        floated="right"
                                        onClick={ submitParentUserInviteForm }
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                    >
                                        { t("extensions:manage.features.user.addUser.invite") }
                                    </PrimaryButton>
                                </Grid.Column>
                            ) }
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
