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

const FORM_ID: string = "vc-template-create-form";

/**
 * Add Verifiable Credential Template Wizard component.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const AddVCTemplateWizard: FunctionComponent<AddVCTemplateWizardProps> = ({
    closeWizard,
    onSuccess,
    "data-componentid": componentId = "add-vc-template-wizard"
}: AddVCTemplateWizardProps): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

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
                                    inputType="default"
                                    name="identifier"
                                    label={ t("verifiableCredentials:wizard.form.identifier.label") }
                                    placeholder={ t("verifiableCredentials:wizard.form.identifier.placeholder") }
                                    hint={ t("verifiableCredentials:wizard.form.identifier.hint") }
                                    required={ true }
                                    maxLength={ 100 }
                                    minLength={ 1 }
                                    validation={ validateIdentifier }
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
                                    required={ false }
                                    maxLength={ 255 }
                                    minLength={ 1 }
                                    data-componentid={ `${componentId}-display-name-input` }
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

export default AddVCTemplateWizard;
