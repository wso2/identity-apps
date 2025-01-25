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

import { AppState, ConfigReducerStateInterface } from "@wso2is/admin.core.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";
import {
    ConnectionInterface,
    ConnectionListResponseInterface,
    CustomAuthGeneralDetailsFormValuesInterface,
    StrictConnectionInterface
} from "../../../models/connection";

/**
 * Proptypes for the custom authenticator general details form component.
 */
interface CustomAuthGeneralDetailsFormPopsInterface extends IdentifiableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP?: ConnectionInterface;
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
export const CustomAuthGeneralDetailsForm: FunctionComponent<CustomAuthGeneralDetailsFormPopsInterface> = ({
    onSubmit,
    editingIDP,
    idpList,
    hideIdPLogoEditField,
    isReadOnly,
    templateType,
    isSubmitting,
    "data-componentid": _componentId = "idp-edit-custom-auth-general-settings-form"
}: CustomAuthGeneralDetailsFormPopsInterface): ReactElement => {

    const { t } = useTranslation();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: CustomAuthGeneralDetailsFormValuesInterface): void => {
        onSubmit({
            description: values.description?.toString(),
            image: values.image?.toString(),
            isPrimary: !!values.isPrimary,
            name: values.name?.toString()
        });
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

    return (
        <React.Fragment>
            <EmphasizedSegment padded="very">
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ false }
                    onSubmit={ (values: CustomAuthGeneralDetailsFormValuesInterface): void => {
                        updateConfigurations(values);
                    } }
                    data-componentid={ _componentId }
                    validate={ (values: CustomAuthGeneralDetailsFormValuesInterface) => {
                        const errors: Partial<Record<keyof CustomAuthGeneralDetailsFormValuesInterface, string>> = {
                            image: undefined
                        };

                        if (!FormValidation.isValidResourceName(values.name)) {
                            errors.name = t(
                                "customAuthentication:fields.createWizard.generalSettingsStep." +
                                                "displayName.validations.invalid"
                            );
                        }

                        return errors;
                    } }
                >
                    <Field.Input
                        ariaLabel="identifier"
                        inputType="identifier"
                        name="identifier"
                        value={ decodeString(editingIDP?.federatedAuthenticators?.defaultAuthenticatorId) }
                        label={ t("customAuthentication:fields.createWizard.generalSettingsStep.identifier.label") }
                        placeholder={ t("customAuthentication:fields.createWizard.generalSettingsStep." +
                            "identifier.placeholder") }
                        maxLength={ 100 }
                        minLength={ 3 }
                        data-componentid={ `${_componentId}-form-wizard-identifier` }
                        width={ 15 }
                        hint={ t(
                            "customAuthentication:fields.createWizard.generalSettingsStep.helpPanel." +
                                "identifier.description"
                        ) }
                        readOnly={ true }
                    />
                    <Field.Input
                        ariaLabel="name"
                        inputType="resource_name"
                        name="name"
                        value={ editingIDP.name }
                        label={ t("customAuthentication:fields.createWizard.generalSettingsStep.displayName.label") }
                        placeholder={ t(
                            "customAuthentication:fields.createWizard.generalSettingsStep.displayName.placeholder"
                        ) }
                        required={ true }
                        maxLength={ 100 }
                        minLength={ 3 }
                        data-componentid={ `${_componentId}-form-wizard-display-name` }
                        width={ 15 }
                    />
                    <Field.Input
                        name="image"
                        ariaLabel="image"
                        inputType="url"
                        label={ "Icon URL" }
                        required={ false }
                        placeholder={ t("authenticationProvider:" +
                                "forms.generalDetails.image." +
                                "placeholder") }
                        value={ editingIDP.image }
                        data-componentid={ `${ _componentId }-idp-image` }
                        maxLength={
                                ConnectionUIConstants
                                    .GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MAX_LENGTH as number
                        }
                        minLength={
                                ConnectionUIConstants
                                    .GENERAL_FORM_CONSTRAINTS.IMAGE_URL_MIN_LENGTH as number
                        }
                        hint="Logo to display in login pages."
                        readOnly={ isReadOnly }
                    />
                    <Field.Textarea
                        name="description"
                        ariaLabel="description"
                        label={ t("authenticationProvider:forms." +
                            "generalDetails.description.label") }
                        required={ false }
                        placeholder={ t("authenticationProvider:forms." +
                            "generalDetails.description.placeholder") }
                        value={ editingIDP.description }
                        data-componentid={ `${ _componentId }-idp-description` }
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
                        />
                    ) }
                </Form>
            </EmphasizedSegment>
        </React.Fragment>
    );
};
