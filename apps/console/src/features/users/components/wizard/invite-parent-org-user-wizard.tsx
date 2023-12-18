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
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { UserManagementConstants } from "../../constants";
import { InviteParentOrgUser } from "../guests/pages/invite-parent-org-user";

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

    /**
     * Triggers a form submit event for the form in the InviteParentOrgUser component.
     */
    const submitParentUserInviteForm = () => {
        document
            .getElementById(UserManagementConstants.INVITE_PARENT_ORG_USER_FORM_ID)
            .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
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
                <InviteParentOrgUser
                    closeWizard={ closeWizard }
                    setIsSubmitting={ setIsSubmitting }
                    onUserInviteSuccess={ onUserInviteSuccess }
                    setAlert={ setAlert }
                    data-componentid={ `${ componentId }-form` }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
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
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-componentid={ `${ componentId }-finish-button` }
                                floated="right"
                                onClick={ submitParentUserInviteForm }
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                            >
                                { t("extensions:manage.features.user.addUser.invite") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

