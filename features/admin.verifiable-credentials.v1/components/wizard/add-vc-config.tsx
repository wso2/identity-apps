/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    Heading,
    LinkButton,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
import { addVCCredentialConfiguration } from "../../api/verifiable-credentials";
import { VCCredentialConfiguration, VCCredentialConfigurationCreationModel } from "../../models/verifiable-credentials";

/**
 * Prop types for the Add VC Config Wizard component.
 */
interface AddVCConfigWizardProps extends IdentifiableComponentInterface {
    /**
     * Callback to close the wizard.
     */
    closeWizard: () => void;
    /**
     * Callback to refresh the list after successful creation.
     */
    onSuccess?: () => void;
}

/**
 * Form values for the VC configuration creation.
 */
interface VCConfigFormValues {
    identifier: string;
    displayName: string;
    scope: string;
}

const FORM_ID: string = "vc-config-create-form";

/**
 * Add Verifiable Credential Configuration Wizard component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const AddVCConfigWizard: FunctionComponent<AddVCConfigWizardProps> = ({
    closeWizard,
    onSuccess,
    "data-componentid": componentId = "add-vc-config-wizard"
}: AddVCConfigWizardProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Handles the form submission.
     *
     * @param values - Form values.
     */
    const handleFormSubmit = (values: VCConfigFormValues): void => {
        setIsSubmitting(true);

        const configData: VCCredentialConfigurationCreationModel = {
            claims: [],
            displayName: values.displayName,
            expiresIn: 31536000,
            format: "jwt_vc_json",
            identifier: values.identifier,
            scope: values.scope,
            type: values.identifier
        };

        addVCCredentialConfiguration(configData)
            .then((_response: VCCredentialConfiguration) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.createConfig.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:notifications.createConfig.success.message")
                }));

                onSuccess?.();
                closeWizard();
            })
            .catch((error: AxiosError) => {
                if (error?.response?.status === 409) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("verifiableCredentials:notifications.createConfig.duplicateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("verifiableCredentials:notifications.createConfig.duplicateError.message")
                    }));
                } else {
                    dispatch(addAlert<AlertInterface>({
                        description: t("verifiableCredentials:notifications.createConfig.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("verifiableCredentials:notifications.createConfig.error.message")
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            dimmer="blurring"
            size="small"
            open={ true }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ componentId }
        >
            <Modal.Header className="wizard-header">
                { t("verifiableCredentials:wizard.title") }
                <Heading as="h6">
                    { t("verifiableCredentials:wizard.subtitle") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ true }
                    onSubmit={ handleFormSubmit }
                    data-componentid={ `${componentId}-form` }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field.Input
                                    ariaLabel="identifier"
                                    inputType="identifier"
                                    name="identifier"
                                    label={ t("verifiableCredentials:wizard.form.identifier.label") }
                                    placeholder={ t("verifiableCredentials:wizard.form.identifier.placeholder") }
                                    hint={ t("verifiableCredentials:wizard.form.identifier.hint") }
                                    required={ true }
                                    maxLength={ 100 }
                                    minLength={ 1 }
                                    data-componentid={ `${componentId}-identifier-input` }
                                    width={ 16 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field.Input
                                    ariaLabel="displayName"
                                    inputType="name"
                                    name="displayName"
                                    label={ t("verifiableCredentials:wizard.form.displayName.label") }
                                    placeholder={ t("verifiableCredentials:wizard.form.displayName.placeholder") }
                                    hint={ t("verifiableCredentials:wizard.form.displayName.hint") }
                                    required={ true }
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    data-componentid={ `${componentId}-display-name-input` }
                                    width={ 16 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field.Input
                                    ariaLabel="scope"
                                    inputType="default"
                                    name="scope"
                                    label={ t("verifiableCredentials:wizard.form.scope.label") }
                                    placeholder={ t("verifiableCredentials:wizard.form.scope.placeholder") }
                                    hint={ t("verifiableCredentials:wizard.form.scope.hint") }
                                    required={ true }
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    data-componentid={ `${componentId}-scope-input` }
                                    width={ 16 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                tabIndex={ 5 }
                                floated="left"
                                onClick={ closeWizard }
                                data-componentid={ `${componentId}-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                tabIndex={ 6 }
                                floated="right"
                                type="submit"
                                form={ FORM_ID }
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                data-componentid={ `${componentId}-create-button` }
                            >
                                { t("verifiableCredentials:wizard.form.submitButton") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

export default AddVCConfigWizard;
