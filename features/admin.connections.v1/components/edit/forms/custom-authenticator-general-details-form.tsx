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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommonAuthenticatorConstants } from "../../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";
import {
    ConnectionInterface,
    ConnectionListResponseInterface,
    CustomAuthConnectionInterface,
    CustomAuthGeneralDetailsFormValuesInterface,
    CustomAuthenticatorCreateWizardGeneralFormValuesInterface
} from "../../../models/connection";
import {
    resolveCustomAuthenticatorDisplayName
} from "../../../utils/connection-utils";

/**
 * Proptypes for the custom authenticator general details form component.
 */
interface CustomAuthenticatorGeneralDetailsFormPopsInterface extends IdentifiableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP?: ConnectionInterface | CustomAuthConnectionInterface;
    /**
     * Mark authenticator as primary.
     */
    isPrimary?: boolean;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate?: (id: string) => void;
    /**
     * Externally trigger form submission.
     */
    triggerSubmit?: boolean;
    /**
     * Optimize for the creation wizard.
     */
    enableWizardMode?: boolean;
    /**
     * List of available Idps.
     */
    idpList?: ConnectionListResponseInterface;
    /**
     * Why? to hide or show the IdP logo edit input field.
     * Introduced this for SAML and OIDC enterprise protocols.
     * By default the icon/logo for this is readonly from
     * extensions.
     */
    hideIdPLogoEditField?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Type of the template.
     */
    templateType?: string;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

const FORM_ID: string = "idp-custom-auth-general-details-form";

/**
 * Form to edit general details of the custom authenticator.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const CustomAuthenticatorGeneralDetailsForm:FunctionComponent<
CustomAuthenticatorGeneralDetailsFormPopsInterface> = ({
    templateType,
    onSubmit,
    editingIDP,
    isReadOnly,
    isSubmitting,
    "data-componentid": componentId = "idp-edit-custom-authenticator-general-settings"
}: CustomAuthenticatorGeneralDetailsFormPopsInterface): ReactElement => {

    const { t } = useTranslation();

    const [ isCustomLocalAuth, setIsCustomLocalAuth ] = useState<boolean>(undefined);

    const { CONNECTION_TEMPLATE_IDS: ConnectionTemplateIds } = CommonAuthenticatorConstants;

    useEffect(() => {
        if (!templateType) {
            return;
        }

        if (templateType == ConnectionTemplateIds.INTERNAL_CUSTOM_AUTHENTICATOR ||
            templateType == ConnectionTemplateIds.TWO_FACTOR_CUSTOM_AUTHENTICATOR) {

            setIsCustomLocalAuth(true);
        }
    }, [ templateType ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: CustomAuthGeneralDetailsFormValuesInterface): void => {

        if (isCustomLocalAuth) {
            onSubmit({
                description: values.description?.toString(),
                displayName: values.displayName?.toString(),
                endpoint: (editingIDP as CustomAuthConnectionInterface)?.endpoint,
                image: values.image?.toString(),
                isEnabled: values?.isEnabled
            });
        } else {
            onSubmit({
                description: values.description?.toString(),
                image: values.image?.toString(),
                isPrimary: !!values.isPrimary,
                name: values.displayName?.toString()
            });
        }
    };

    /**
     * Decode the encoded string.
     *
     * @param encodedStr - Encoded string.
     * @returns Decoded string.
     */
    const decodeString = (encodedStr: string): string => {
        try {
            return atob(encodedStr);
        } catch (error) {
            return "";
        }
    };

    const resolveIdentifier = (): string => {
        if (isCustomLocalAuth) {
            return (editingIDP as CustomAuthConnectionInterface)?.name;
        } else {
            return decodeString(editingIDP?.federatedAuthenticators?.authenticators[0].authenticatorId);
        }
    };

    /**
     * This method validates the general settings fields.
     *
     * @param values - values to be validated.
     * @returns - errors object.
     */
    const validateGeneralSettingsField = (
        values: CustomAuthenticatorCreateWizardGeneralFormValuesInterface
    ): Partial<CustomAuthenticatorCreateWizardGeneralFormValuesInterface> => {
        const errors: Partial<CustomAuthenticatorCreateWizardGeneralFormValuesInterface> = {};

        if (!CommonAuthenticatorConstants.IDENTIFIER_REGEX.test(values?.identifier)) {
            errors.identifier = t(
                "customAuthenticator:fields.createWizard.generalSettingsStep.identifier.validations.invalid"
            );
        }

        if (!CommonAuthenticatorConstants.DISPLAY_NAME_REGEX.test(values?.displayName)) {
            errors.displayName = t(
                "customAuthenticator:fields.createWizard.generalSettingsStep.displayName.validations.invalid"
            );
        }

        return errors;
    };

    return (
        <React.Fragment>
            <EmphasizedSegment padded="very">
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ false }
                    onSubmit={ (values: CustomAuthGeneralDetailsFormValuesInterface): void => {
                        updateConfigurations(values);
                    } }
                    data-componentid={ componentId }
                    validate={ validateGeneralSettingsField }
                    initialValues={ {
                        description: editingIDP?.description,
                        displayName: resolveCustomAuthenticatorDisplayName(editingIDP, isCustomLocalAuth),
                        identifier: resolveIdentifier(),
                        image: editingIDP?.image,
                        isEnabled: editingIDP?.isEnabled
                    } }
                >
                    <Field.Input
                        ariaLabel="identifier"
                        inputType="text"
                        name="identifier"
                        label={ t("customAuthenticator:fields.createWizard.generalSettingsStep.identifier.label") }
                        placeholder={ t(
                            "customAuthenticator:fields.createWizard.generalSettingsStep.identifier.placeholder"
                        ) }
                        maxLength={ 100 }
                        minLength={ 3 }
                        data-componentid={ `${componentId}-identifier` }
                        hint={ t(
                            "customAuthenticator:fields.createWizard.generalSettingsStep.helpPanel." +
                                "identifier.description"
                        ) }
                        readOnly={ true }
                    />
                    <Field.Input
                        ariaLabel="displayName"
                        inputType="text"
                        name="displayName"
                        label={ t("customAuthenticator:fields.createWizard.generalSettingsStep.displayName.label") }
                        placeholder={ t(
                            "customAuthenticator:fields.createWizard.generalSettingsStep.displayName.placeholder"
                        ) }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 3 }
                        data-componentid={ `${componentId}-display-name` }
                        readOnly={ isReadOnly }
                    />
                    <Field.Input
                        name="image"
                        ariaLabel="image"
                        inputType="url"
                        label={ "Icon URL" }
                        required={ false }
                        placeholder={ t("authenticationProvider:forms.generalDetails.image.placeholder") }
                        value={ editingIDP.image }
                        data-componentid={ `${componentId}-image` }
                        maxLength={ ConnectionUIConstants.GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MAX_LENGTH as number }
                        minLength={ ConnectionUIConstants.GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MIN_LENGTH as number }
                        hint={ t("customAuthenticator:fields.editPage.generalTab.iconUrl.hint") }
                        readOnly={ isReadOnly }
                    />
                    <Field.Textarea
                        name="description"
                        ariaLabel="description"
                        label={ t("authenticationProvider:forms.generalDetails.description.label") }
                        required={ false }
                        placeholder={ t("authenticationProvider:forms.generalDetails.description.placeholder") }
                        value={ editingIDP.description }
                        data-componentid={ `${componentId}-description` }
                        maxLength={ ConnectionUIConstants.IDP_NAME_LENGTH.max }
                        minLength={ ConnectionUIConstants.IDP_NAME_LENGTH.min }
                        hint="A text description of the authenticator."
                        readOnly={ isReadOnly }
                    />
                    { !isReadOnly && (
                        <Field.Button
                            form={ FORM_ID }
                            ariaLabel="Update General Details"
                            size="small"
                            buttonType="primary_btn"
                            label={ t("common:update") }
                            name="submit"
                            disabled={ isSubmitting }
                            loading={ isSubmitting }
                            data-componentid={ `${componentId}-update-button` }
                        />
                    ) }
                </Form>
            </EmphasizedSegment>
        </React.Fragment>
    );
};
