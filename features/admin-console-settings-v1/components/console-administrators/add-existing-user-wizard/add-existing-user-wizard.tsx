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
import { AlertLevels, IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { AutocompleteFieldAdapter, FinalForm, FinalFormField, FormRenderProps } from "@wso2is/form";
import { Heading, Hint, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal, ModalProps } from "semantic-ui-react";
import { UserBasicInterface } from "../../../../admin-core-v1/models/users";
import { UserManagementConstants } from "../../../../users/constants";
import { ConsoleAdministratorOnboardingConstants } from "../../../constants/console-administrator-onboarding-constants";
import useBulkAssignAdministratorRoles from "../../../hooks/use-bulk-assign-user-roles";
import useConsoleRoles from "../../../hooks/use-console-roles";
import useProspectiveAdministrators from "../../../hooks/use-prospective-administrators";
import "./add-existing-user-wizard.scss";

/**
 * Props interface of {@link AddExistingUserWizard}
 */
export interface AddExistingUserWizardPropsInterface extends IdentifiableComponentInterface, ModalProps {
    onSuccess?: () => void;
}

interface AddExistingUserWizardFormValuesInterface {
    username: {
        key: string;
        label: ReactNode;
        user: UserBasicInterface;
    };
    roles: {
        key: string;
        label: ReactNode;
        role: RolesInterface;
    }[];
}

interface AddExistingUserWizardFormErrorsInterface {
    username: string;
    roles: string;
}

/**
 * Component to handle add existing user wizard.
 *
 * @param props - Props injected to the component.
 * @returns Add existing user wizard component.
 */
const AddExistingUserWizard: FunctionComponent<AddExistingUserWizardPropsInterface> = (
    props: AddExistingUserWizardPropsInterface
): ReactElement => {
    const {
        onClose,
        onSuccess,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const { t } = useTranslation();


    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const { consoleRoles } = useConsoleRoles(null, null);

    const { assignAdministratorRoles } = useBulkAssignAdministratorRoles();

    const { prospectiveAdministrators } = useProspectiveAdministrators(
        null,
        null,
        null,
        null,
        null,
        UserManagementConstants.GROUPS_ATTRIBUTE,
        true
    );

    const usernameAutocompleteOptions: AddExistingUserWizardFormValuesInterface["username"][] = useMemo(() => {
        if (isEmpty(prospectiveAdministrators?.Resources)) {
            return [];
        }

        return prospectiveAdministrators?.Resources?.map((user: UserBasicInterface) => {
            return {
                key: user.id,
                label: user.userName,
                user
            };
        });
    }, [ prospectiveAdministrators ]);

    const rolesAutocompleteOptions: AddExistingUserWizardFormValuesInterface["roles"] = useMemo(() => {
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

    const handleAddExitingUser = (values: AddExistingUserWizardFormValuesInterface): void => {
        assignAdministratorRoles(
            values?.username?.user,
            values?.roles?.map((role: any) => role.role),
            (error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    setAlert({
                        description: t("users:notifications.addUser.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.addUser.error.message")
                    });
                } else {
                    setAlert({
                        description: t("users:notifications.addUser.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.addUser.genericError.message")
                    });
                }
            },
            () => {
                onSuccess();
                onClose(null, null);
            }
        );
    };

    const validateAddExistingUserForm = (
        values: AddExistingUserWizardFormValuesInterface
    ): AddExistingUserWizardFormErrorsInterface => {
        const errors: AddExistingUserWizardFormErrorsInterface = {
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
            className="wizard add-existing-user-wizard"
            onClose={ onClose }
            { ...rest }
        >
            <Modal.Header className="wizard-header">
                <Typography variant="inherit">Add Administrator</Typography>
                <Heading as="h6">
                    <Typography variant="inherit">
                        Promote an existing user in your organization as an administrator
                    </Typography>
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                <FinalForm
                    initialValues={ {} }
                    keepDirtyOnReinitialize={ true }
                    onSubmit={ handleAddExitingUser }
                    validate={ validateAddExistingUserForm }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        return (
                            <form
                                id={ ConsoleAdministratorOnboardingConstants.ADD_EXISTING_USER_FORM_ID }
                                onSubmit={ handleSubmit }
                                className="add-existing-user-wizard-form"
                            >
                                <FinalFormField
                                    fullWidth
                                    required
                                    ariaLabel="Username field"
                                    data-componentid={ `${componentId}-form-username-field` }
                                    name="username"
                                    label={ "Username" }
                                    helperText={
                                        (<Hint>
                                            <Typography variant="inherit">
                                                Enter a username or use the search to filter a user from the available
                                                list.
                                            </Typography>
                                        </Hint>)
                                    }
                                    placeholder="Select a user"
                                    component={ AutocompleteFieldAdapter }
                                    options={ usernameAutocompleteOptions }
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
                                    renderTags={ (value: readonly any[], getTagProps:
                                        AutocompleteRenderGetTagProps) => {
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
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                tabIndex={ 6 }
                                data-componentid={ `${componentId}-cancel-button` }
                                floated="left"
                                onClick={ (e: React.MouseEvent<HTMLElement, MouseEvent>) => onClose(e, null) }
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
                                    document
                                        .getElementById(
                                            ConsoleAdministratorOnboardingConstants.ADD_EXISTING_USER_FORM_ID
                                        )
                                        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
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

AddExistingUserWizard.defaultProps = {
    closeOnDimmerClick: false,
    closeOnEscape: true,
    currentStep: 0,
    "data-componentid": "add-exiting-user-wizard",
    dimmer: "blurring",
    size: "small"
};

export default AddExistingUserWizard;
