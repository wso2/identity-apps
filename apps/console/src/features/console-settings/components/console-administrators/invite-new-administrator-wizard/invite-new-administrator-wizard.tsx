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

import Alert from "@oxygen-ui/react/Alert";
import { AutocompleteRenderGetTagProps } from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AutocompleteFieldAdapter, FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { Heading, Hint, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal, ModalProps } from "semantic-ui-react";
import { UsersConstants } from "../../../../../extensions/components/users/constants/users";
import { AppState } from "../../../../core/store";
import { sendParentOrgUserInvite } from "../../../../users/components/guests/api/invite";
import {
    ParentOrgUserInvitationResult,
    ParentOrgUserInviteInterface,
    ParentOrgUserInviteResultStatus
} from "../../../../users/components/guests/models/invite";
import { ConsoleAdministratorOnboardingConstants } from "../../../constants/console-administrator-onboarding-constants";
import useConsoleRoles from "../../../hooks/use-console-roles";
import "./invite-new-administrator-wizard.scss";

/**
 * Props interface of {@link InviteNewAdministratorWizard}
 */
export type InviteNewAdministratorWizardPropsInterface = IdentifiableComponentInterface & ModalProps;

interface InviteNewAdministratorWizardFormValuesRoleInterface {
    key: string;
    label: ReactNode;
    role: RolesInterface;
}

interface InviteNewAdministratorWizardFormValuesInterface {
    username: string;
    roles: InviteNewAdministratorWizardFormValuesRoleInterface[];
}

interface InviteNewAdministratorWizardFormErrorsInterface {
    username: string;
    roles: string;
}

/**
 * Component to handle invite new user wizard.
 *
 * @param props - Props injected to the component.
 * @returns Invite new user wizard component.
 */
const InviteNewAdministratorWizard: FunctionComponent<InviteNewAdministratorWizardPropsInterface> = (
    props: InviteNewAdministratorWizardPropsInterface
): ReactElement => {

    const {
        onClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const { consoleRoles } = useConsoleRoles(null, null);

    const currentOrganization: string =  useSelector((state: AppState) => state?.config?.deployment?.tenant);

    const rolesAutocompleteOptions: InviteNewAdministratorWizardFormValuesInterface["roles"] = useMemo(() => {
        if (isEmpty(consoleRoles?.Resources)) {
            return [];
        }

        return consoleRoles?.Resources?.map((role: RolesInterface) => {
            return {
                key: role.id,
                label: role.displayName,
                role
            };
        });
    }, [ consoleRoles ]);

    /**
     * Handles the API resource creation.
     */
    const handleInviteNewAdministratorFormSubmit = (values: InviteNewAdministratorWizardFormValuesInterface): void => {
        const invite: ParentOrgUserInviteInterface = {
            roles: values.roles.map((role: InviteNewAdministratorWizardFormValuesRoleInterface) => role.role.id),
            usernames: [ values.username ]
        };

        sendParentOrgUserInvite(invite)
            .then((response: AxiosResponse) => {
                // TODO: Handle errors for each user if needed when revamping invite parent org user UI to facilitate
                //  multiple user invites.
                const responseData: ParentOrgUserInvitationResult = response.data[0];

                if (responseData.result.status !== ParentOrgUserInviteResultStatus.SUCCESS) {
                    setAlert({
                        description: t(
                            "console:manage.features.invite.notifications.sendInvite.error.description",
                            { description: responseData.result.errorDescription }
                        ),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.invite.notifications.sendInvite.error.message")
                    });

                    return;
                }

                dispatch(addAlert({
                    description: t(
                        "console:manage.features.invite.notifications.sendInvite.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.invite.notifications.sendInvite.success.message"
                    )
                }));

                onClose(null, null);
            })
            .catch((error: AxiosError) => {
                /**
                 * Axios throws a generic `Network Error` for 401 status.
                 * As a temporary solution, a check to see if a response
                 * is available has be used.
                 */
                if (!error.response || error.response.status === 401) {
                    setAlert({
                        description: t(
                            "console:manage.features.invite.notifications.sendInvite.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.invite.notifications.sendInvite.error.message"
                        )
                    });
                } else if (error.response.status === 403 &&
                        error?.response?.data?.code === UsersConstants.ERROR_COLLABORATOR_USER_LIMIT_REACHED) {
                    setAlert({
                        description: t(
                            "extensions:manage.invite.notifications.sendInvite.limitReachError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.invite.notifications.sendInvite.limitReachError.message"
                        )
                    });
                } else if (error?.response?.data?.description) {
                    setAlert({
                        description: t(
                            "console:manage.features.invite.notifications.sendInvite.error.description",
                            { description: error.response.data.description }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.invite.notifications.sendInvite.error.message"
                        )
                    });
                } else {
                    setAlert({
                        description: t(
                            "console:manage.features.invite.notifications.sendInvite.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.invite.notifications.sendInvite.genericError.message"
                        )
                    });
                }
            });
    };

    const validateInviteNewAdministratorForm = (
        values: InviteNewAdministratorWizardFormValuesInterface
    ): InviteNewAdministratorWizardFormErrorsInterface => {
        const errors: InviteNewAdministratorWizardFormErrorsInterface = {
            roles: undefined,
            username: undefined
        };

        if (!values.username) {
            errors.username = "Username is a required field";
        }

        if (!values.roles || isEmpty(values.roles)) {
            errors.roles = "Roles is a required field";
        }

        return errors;
    };

    return (
        <Modal
            data-componentid={ componentId }
            open={ true }
            className="wizard invite-new-administrator-wizard"
            onClose={ onClose }
            { ...rest }
        >
            <Modal.Header className="wizard-header">
                <Typography variant="inherit">Invite Administrator</Typography>
                <Heading as="h6">
                    <Typography variant="inherit">
                        Invite an existing user from your root organization as an administrator
                    </Typography>
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                <Alert severity="info" className="root-invite-only-disclaimer-alert">
                    <Typography variant="inherit">
                        You can only Invite an existing user from your root organization (<Typography
                            component="span"
                            fontWeight="bold">{ currentOrganization }</Typography>).
                    </Typography>
                </Alert>
                <FinalForm
                    initialValues={ {} }
                    keepDirtyOnReinitialize={ true }
                    onSubmit={ handleInviteNewAdministratorFormSubmit }
                    validate={ validateInviteNewAdministratorForm }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        return (
                            <form
                                id={ ConsoleAdministratorOnboardingConstants.INVITE_PARENT_USER_FORM_ID }
                                onSubmit={ handleSubmit }
                                className="invite-parent-user-wizard-form"
                            >
                                <FinalFormField
                                    fullWidth
                                    required
                                    ariaLabel="Username field"
                                    data-componentid={ `${componentId}-form-username-field` }
                                    name="username"
                                    type="text"
                                    label={ "Username" }
                                    helperText={
                                        (<Hint>
                                            <Typography variant="inherit">
                                                Enter a username to add as an administrator. The user must be an
                                                existing user in your immediate parent organization and the{ " " }
                                                <Typography component="span" variant="inherit" fontWeight="bold">
                                                    exact username
                                                </Typography>{ " " }
                                                must be provided.
                                            </Typography>
                                        </Hint>)
                                    }
                                    placeholder="Enter a username"
                                    component={ TextFieldAdapter }
                                />
                                <FinalFormField
                                    fullWidth
                                    required
                                    freeSolo
                                    multipleValues
                                    ariaLabel="Roles field"
                                    data-componentid={ `${componentId}-form-roles-field` }
                                    name="roles"
                                    label={ "Roles" }
                                    helperText={
                                        (<Hint>
                                            <Typography variant="inherit">
                                                Assign one or more console roles that can be used to maintain the
                                                console application.
                                            </Typography>
                                        </Hint>)
                                    }
                                    placeholder="Select roles"
                                    component={ AutocompleteFieldAdapter }
                                    options={ rolesAutocompleteOptions }
                                    renderTags={ (
                                        value: InviteNewAdministratorWizardFormValuesRoleInterface[],
                                        getTagProps: AutocompleteRenderGetTagProps
                                    ) => {
                                        return value.map(
                                            (
                                                option: InviteNewAdministratorWizardFormValuesRoleInterface,
                                                index: number
                                            ) => (
                                                <Chip
                                                    key={ index }
                                                    size="medium"
                                                    label={ option.label }
                                                    { ...getTagProps({ index }) }
                                                />
                                            )
                                        );
                                    } }
                                />
                            </form>
                        );
                    } }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                tabIndex={ 6 }
                                data-componentid={ `${componentId}-cancel-button` }
                                floated="left"
                                onClick={ (e: React.MouseEvent<HTMLElement>) => onClose(e, null) }
                            >
                                <Typography variant="inherit">
                                    { t("extensions:develop.apiResource.wizard.addApiResource.cancelButton") }
                                </Typography>
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                tabIndex={ 8 }
                                data-componentid={ `${componentId}-submit-button` }
                                floated="right"
                                onClick={ () => {
                                    document.getElementById(
                                        ConsoleAdministratorOnboardingConstants.INVITE_PARENT_USER_FORM_ID
                                    ).dispatchEvent(new Event("submit", { bubbles:true, cancelable: true }));
                                } }
                            >
                                <Typography variant="inherit">Add</Typography>
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

InviteNewAdministratorWizard.defaultProps = {
    closeOnDimmerClick: false,
    closeOnEscape: true,
    currentStep: 0,
    "data-componentid": "invite-new-administrator-wizard",
    dimmer: "blurring",
    size: "small"
};

export default InviteNewAdministratorWizard;
