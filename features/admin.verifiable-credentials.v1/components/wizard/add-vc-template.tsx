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
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { Button } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Modal } from "semantic-ui-react";
import { addVCTemplate } from "../../api/verifiable-credentials";
import { VCTemplate, VCTemplateCreationModel } from "../../models/verifiable-credentials";

/**
 * Prop types for the Add VC Template Wizard component.
 */
interface AddVCTemplateWizardProps extends IdentifiableComponentInterface {
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
 * Form values for the VC template creation.
 */
interface VCTemplateFormValues {
    identifier: string;
    displayName: string;
}

/**
 * Add Verifiable Credential Template Wizard component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export default function AddVCTemplateWizard({
    closeWizard,
    onSuccess,
    [ "data-componentid" ]: componentId = "add-vc-template-wizard"
}: AddVCTemplateWizardProps) {
    const { t } = useTranslation();
    const dispatch: any = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Validates the identifier to ensure it doesn't contain spaces.
     *
     * @param value - Identifier value.
     * @returns Error message if invalid, undefined if valid.
     */
    const validateIdentifier = (value: string): string | undefined => {
        if (value && value.match(/\s/) !== null) {
            return t("verifiableCredentials:wizard.form.identifier.validation");
        }

        return undefined;
    };

    /**
     * Handles the form submission.
     *
     * @param values - Form values.
     */
    const handleFormSubmit = (values: VCTemplateFormValues): void => {
        if (!values?.identifier) {
            return;
        }

        const validationError: string | undefined = validateIdentifier(values.identifier);

        if (validationError) {
            return;
        }

        setIsSubmitting(true);

        const templateData: VCTemplateCreationModel = {
            claims: [],
            displayName: values.displayName || values.identifier,
            expiresIn: 31536000,
            format: "jwt_vc_json",
            identifier: values.identifier
        };

        addVCTemplate(templateData)
            .then((_response: VCTemplate) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("verifiableCredentials:notifications.createTemplate.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:notifications.createTemplate.success.message")
                }));

                onSuccess?.();
                closeWizard();
            })
            .catch((error: AxiosError) => {
                if (error?.response?.status === 409) {
                    dispatch(addAlert<AlertInterface>({
                        description: t("verifiableCredentials:notifications.createTemplate.duplicateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("verifiableCredentials:notifications.createTemplate.duplicateError.message")
                    }));
                } else {
                    dispatch(addAlert<AlertInterface>({
                        description: t("verifiableCredentials:notifications.createTemplate.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("verifiableCredentials:notifications.createTemplate.error.message")
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Modal
            data-testid={ componentId }
            data-componentid={ componentId }
            open={ true }
            className="wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>{ t("verifiableCredentials:wizard.title") }</Modal.Header>
            <Modal.Content>
                <FinalForm
                    onSubmit={ handleFormSubmit }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        return (
                            <form id="addVCTemplateForm" onSubmit={ handleSubmit }>
                                <FinalFormField
                                    name="identifier"
                                    label={ t("verifiableCredentials:wizard.form.identifier.label") }
                                    placeholder={ t("verifiableCredentials:wizard.form.identifier.placeholder") }
                                    required={ true }
                                    autoComplete="new-password"
                                    component={ TextFieldAdapter }
                                    helperText={ t("verifiableCredentials:wizard.form.identifier.hint") }
                                />
                                <FinalFormField
                                    label={ t("verifiableCredentials:wizard.form.displayName.label") }
                                    name="displayName"
                                    placeholder={ t("verifiableCredentials:wizard.form.displayName.placeholder") }
                                    className="mt-3"
                                    autoComplete="new-password"
                                    component={ TextFieldAdapter }
                                    helperText={ t("verifiableCredentials:wizard.form.displayName.hint") }
                                />
                            </form>
                        );
                    } }
                />
            </Modal.Content>

            <Modal.Actions>
                <Button
                    className="link-button"
                    basic
                    primary
                    onClick={ closeWizard }
                    data-testid={ `${componentId}-cancel-button` }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    primary={ true }
                    type="submit"
                    disabled={ isSubmitting }
                    loading={ isSubmitting }
                    onClick={ () => {
                        document
                            .getElementById("addVCTemplateForm")
                            .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                    } }
                    data-testid={ `${componentId}-create-button` }
                >
                    { t("verifiableCredentials:wizard.form.submitButton") }
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
