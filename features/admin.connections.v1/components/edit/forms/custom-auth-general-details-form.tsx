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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { getLocalAuthenticator } from "../../../api/authenticators";
import { getFederatedAuthenticatorDetails } from "../../../api/connections";
import { CommonAuthenticatorConstants } from "../../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";
import {
    ConnectionInterface,
    ConnectionListResponseInterface,
    CustomAuthConnectionInterface,
    CustomAuthGeneralDetailsFormValuesInterface,
    CustomAuthenticationCreateWizardGeneralFormValuesInterface,
    ExternalEndpoint,
    FederatedAuthenticatorListItemInterface
} from "../../../models/connection";

/**
 * Proptypes for the custom authenticator general details form component.
 */
interface CustomAuthGeneralDetailsFormPopsInterface extends IdentifiableComponentInterface {
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
export const CustomAuthGeneralDetailsForm: FunctionComponent<CustomAuthGeneralDetailsFormPopsInterface> = ({
    templateType,
    onSubmit,
    editingIDP,
    isReadOnly,
    isSubmitting,
    "data-componentid": _componentId = "idp-edit-custom-auth-general-settings-form"
}: CustomAuthGeneralDetailsFormPopsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();

    const [ isCustomLocalAuth, setIsCustomLocalAuth ] = useState<boolean>(undefined);
    const [ authenticatorEndpoint, setAuthenticatorEndpoint ] = useState<ExternalEndpoint>(null);

    const { t } = useTranslation();

    const { CONNECTION_TEMPLATE_IDS: ConnectionTemplateIds } = CommonAuthenticatorConstants;

    useEffect(() => {
        if (!templateType) {
            return;
        }

        if (templateType == ConnectionTemplateIds.INTERNAL_CUSTOM_AUTHENTICATION ||
            templateType == ConnectionTemplateIds.TWO_FACTOR_CUSTOM_AUTHENTICATION) {

            setIsCustomLocalAuth(true);
        }
    }, [ templateType ]);

    useEffect(() => {
        if (isCustomLocalAuth === undefined) {
            return;
        }

        let localAuthenticatorId: string;

        if (isCustomLocalAuth) {

            localAuthenticatorId = (editingIDP as CustomAuthConnectionInterface)?.id;
            getLocalAuthenticator(localAuthenticatorId)
                .then((data: CustomAuthConnectionInterface) => {
                    setAuthenticatorEndpoint(data?.endpoint);
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(
                            addAlert({
                                description: t("authenticationProvider:notifications.getIDP.error.description", {
                                    description: error.response.data.description
                                }),
                                level: AlertLevels.ERROR,
                                message: t("authenticationProvider:" + "notifications.getIDP.error.message")
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t("authenticationProvider:" + "notifications.getIDP.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:" + "notifications.getIDP.genericError.message")
                        })
                    );
                });
        } else {
            localAuthenticatorId = editingIDP?.federatedAuthenticators?.authenticators[0].authenticatorId;
            getFederatedAuthenticatorDetails(editingIDP.id, localAuthenticatorId)
                .then((data: FederatedAuthenticatorListItemInterface) => {
                    setAuthenticatorEndpoint(data?.endpoint);
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(
                            addAlert({
                                description: t("authenticationProvider:notifications.getIDP.error.description", {
                                    description: error.response.data.description
                                }),
                                level: AlertLevels.ERROR,
                                message: t("authenticationProvider:" + "notifications.getIDP.error.message")
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: t("authenticationProvider:" + "notifications.getIDP.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:" + "notifications.getIDP.genericError.message")
                        })
                    );
                });
        }
    }, [ isCustomLocalAuth ]);

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
                endpoint: authenticatorEndpoint,
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

    const resolveDisplayName = (): string => {
        if (isCustomLocalAuth) {
            return (editingIDP as CustomAuthConnectionInterface)?.displayName;
        } else {
            return (editingIDP as ConnectionInterface)?.name;
        }
    };

    /**
         * This method validates the general settings fields.
         *
         * @param values - values to be validated.
         * @returns - errors object.
         */
    const validateGeneralSettingsField = (
        values: CustomAuthenticationCreateWizardGeneralFormValuesInterface
    ): Partial<CustomAuthenticationCreateWizardGeneralFormValuesInterface> => {
        const errors: Partial<CustomAuthenticationCreateWizardGeneralFormValuesInterface> = {};

        if (!CommonAuthenticatorConstants.IDENTIFIER_REGEX.test(values?.identifier)) {
            errors.identifier = t(
                "customAuthentication:fields.createWizard.generalSettingsStep." + "identifier.validations.invalid"
            );
        }

        if (!CommonAuthenticatorConstants.DISPLAY_NAME_REGEX.test(values?.displayName)) {
            errors.displayName = t(
                "customAuthentication:fields.createWizard.generalSettingsStep." + "displayName.validations.invalid"
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
                    data-componentid={ _componentId }
                    validate={ validateGeneralSettingsField }
                    initialValues={ {
                        description: editingIDP?.description,
                        displayName: resolveDisplayName(),
                        identifier: resolveIdentifier(),
                        image: editingIDP?.image,
                        isEnabled: editingIDP?.isEnabled
                    } }
                >
                    <Field.Input
                        ariaLabel="identifier"
                        inputType="text"
                        name="identifier"
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
                        ariaLabel="displayName"
                        inputType="text"
                        name="displayName"
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
