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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { AddUser } from "./add-user";
import { sendInvite } from "../api";
import { UserInviteInterface } from "../models";

interface AddUserWizardPropsInterface extends TestableComponentInterface {
    closeWizard: () => void;
    updateInviteListWizard: () => void;
    setUserListRequestLoading: (value: boolean) => void;
}

/**
 * User creation wizard.
 *
 * @return {JSX.Element}
 */
export const AddAdminDeveloperWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        updateInviteListWizard,
        setUserListRequestLoading,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ finishSubmit, setFinishSubmit ] = useTrigger();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);


    /**
     * This function handles adding the user.
     */
    const submitInviteForm = (invite: UserInviteInterface) => {
        setUserListRequestLoading(true);
        if (invite != null) {
            setIsSubmitting(true);

            sendInvite(invite)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.invite.notifications.sendInvite.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.invite.notifications.sendInvite.success.message"
                        )
                    }));
                    updateInviteListWizard();
                    closeWizard();

                })
                .catch((error) => {
                    // Axios throws a generic `Network Error` for 401 status.
                    // As a temporary solution, a check to see if a response
                    // is available has be used.
                    if (!error.response || error.response.status === 401) {
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.error.message"
                            )
                        }));
                    } else if (error.response && error.response.data && error.response.data.detail) {
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.error.description",
                                { description: error.response.data.detail }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.error.message"
                            )
                        }));
                    } else {
                        closeWizard();
                        // Generic error message
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.genericError.message"
                            )
                        }));
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };


    return (
        <Modal
            data-testid={ testId }
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>
                { t("console:manage.features.invite.form.sendmail.title") }
                <Heading as="h6"
                         subHeading>{ t("console:manage.features.invite.form.sendmail.subTitle") }</Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                <AddUser
                    triggerSubmit={ finishSubmit }
                    onSubmit={ (values) => submitInviteForm(values) }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${testId}-cancel-button` }
                                floated="left"
                                onClick={ () => closeWizard() }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid={ `${testId}-finish-button` }
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                onClick={ () => {
                                    setFinishSubmit();
                                } }
                            >
                                Invite
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
