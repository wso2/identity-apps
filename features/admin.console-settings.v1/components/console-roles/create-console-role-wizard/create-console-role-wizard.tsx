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

import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import { createRole, createRoleUsingV3Api } from "@wso2is/admin.roles.v2/api/roles";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { CreateRoleInterface, CreateRolePermissionInterface } from "@wso2is/admin.roles.v2/models/roles";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps, FormSpy } from "@wso2is/form";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, MouseEvent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal, ModalProps } from "semantic-ui-react";
import CreateConsoleRoleWizardBasicInfoForm from "./create-console-role-wizard-basic-info-form";
import CreateConsoleRoleWizardPermissionsForm from "./create-console-role-wizard-permissions-form";
import { ConsoleRolesOnboardingConstants } from "../../../constants/console-roles-onboarding-constants";
import useConsoleSettings from "../../../hooks/use-console-settings";

export interface CreateConsoleRoleWizardPropsInterface extends IdentifiableComponentInterface, ModalProps {
    onClose: (e: MouseEvent<HTMLElement>, data: ModalProps) => void;
}

export type CreateConsoleRoleWizardFormValuesInterface = Partial<CreateRoleInterface>;

/**
 * API resource wizard.
 */
const CreateConsoleRoleWizard: FunctionComponent<CreateConsoleRoleWizardPropsInterface> = (
    props: CreateConsoleRoleWizardPropsInterface
): ReactElement => {
    const {
        onClose,
        ["data-componentid"]: componentId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const { consoleId, consoleDisplayName } = useConsoleSettings();

    const [ permissions, setPermissions ] = useState<CreateRolePermissionInterface[]>([]);

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const createRoleFunction: typeof createRole = userRolesV3FeatureEnabled ? createRoleUsingV3Api : createRole;

    /**
     * Handles the API resource creation.
     */
    const handleConsoleRoleCreation = (values: CreateConsoleRoleWizardFormValuesInterface): void => {
        // Prevent submission if the form is incomplete.
        if (isEmpty(permissions) || !values?.displayName) {
            return;
        }

        createRoleFunction({
            audience: {
                display: consoleDisplayName,
                type: RoleAudienceTypes.APPLICATION,
                value: consoleId
            },
            displayName: values.displayName,
            permissions
        })
            .then((response: AxiosResponse) => {
                onClose(null, null);

                dispatch(
                    addAlert<AlertInterface>({
                        description: `Successfully created the new role: ${response.data.displayName}`,
                        level: AlertLevels.SUCCESS,
                        message: "Role created successfully"
                    })
                );
            })
            .catch(() => {
                setAlert({
                    description: "An error ocurred while creating the role.",
                    level: AlertLevels.ERROR,
                    message: "Failed to create the role"
                });
            });
    };

    return (
        <Modal
            data-testid={ componentId }
            open={ true }
            className="wizard api-resource-create-wizard"
            onClose={ onClose }
            { ...rest }
        >
            <Modal.Header className="wizard-header">
                <Typography variant="inherit">Add Role</Typography>
                <Heading as="h6">
                    <Typography variant="inherit">Add a new role to allow administrators to use the Console</Typography>
                </Heading>
            </Modal.Header>
            <FinalForm
                initialValues={ {} }
                keepDirtyOnReinitialize={ true }
                onSubmit={ handleConsoleRoleCreation }
                render={ ({ handleSubmit }: FormRenderProps) => {
                    return (
                        <>
                            <Modal.Content className="content-container" scrolling>
                                { alert && alertComponent }
                                <form
                                    id={ ConsoleRolesOnboardingConstants.ADD_NEW_ROLE_FORM_ID }
                                    onSubmit={ handleSubmit }
                                >
                                    <CreateConsoleRoleWizardBasicInfoForm />
                                    <CreateConsoleRoleWizardPermissionsForm onPermissionsChange={ setPermissions } />
                                </form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Grid>
                                    <Grid.Row column={ 1 }>
                                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                            <LinkButton
                                                tabIndex={ 6 }
                                                data-componentid={ `${componentId}-cancel-button` }
                                                floated="left"
                                                onClick={ (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) =>
                                                    onClose(e, null) }
                                            >
                                                <Typography variant="inherit">
                                                    { t(
                                                        "extensions:develop.apiResource.wizard.addApiResource" +
                                                        ".cancelButton"
                                                    ) }
                                                </Typography>
                                            </LinkButton>
                                        </Grid.Column>
                                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                            <FormSpy subscription={ { values: true } }>
                                                { ({
                                                    values
                                                }: {
                                                    values: CreateConsoleRoleWizardFormValuesInterface;
                                                }) => (
                                                    <PrimaryButton
                                                        tabIndex={ 8 }
                                                        data-componentid={ `${componentId}-submit-button` }
                                                        floated="right"
                                                        disabled={ !values.displayName || isEmpty(permissions) }
                                                        onClick={ () => {
                                                            document
                                                                .getElementById(
                                                                    ConsoleRolesOnboardingConstants.ADD_NEW_ROLE_FORM_ID
                                                                )
                                                                .dispatchEvent(
                                                                    new Event("submit", {
                                                                        bubbles: true,
                                                                        cancelable: true
                                                                    })
                                                                );
                                                        } }
                                                    >
                                                        <Typography variant="inherit">Add</Typography>
                                                    </PrimaryButton>
                                                ) }
                                            </FormSpy>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Modal.Actions>
                        </>
                    );
                } }
            />
        </Modal>
    );
};

CreateConsoleRoleWizard.defaultProps = {
    closeOnDimmerClick: false,
    closeOnEscape: true,
    "data-componentid": "create-console-role-wizard",
    dimmer: "blurring",
    size: "small"
};

export default CreateConsoleRoleWizard;
