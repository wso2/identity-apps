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

import { identityProviderConfig } from "@wso2is/admin.extensions.v1/configs/identity-provider";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { AuthenticatorManagementConstants } from "../../../../constants/autheticator-constants";
import { ConnectionManagementConstants } from "../../../../constants/connection-constants";
import {
    AuthenticatorSettingsFormModes
} from "../../../../models/authenticators";
import {
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaInterface,
    FederatedAuthenticatorWithMetaInterface
} from "../../../../models/connection";
import { AuthenticatorSettingsForm } from "../authenticator-settings-form";
import {
    AppleAuthenticatorForm,
    CommonAuthenticatorForm,
    EmailOTPAuthenticatorForm,
    FacebookAuthenticatorForm,
    GithubAuthenticatorForm,
    GoogleAuthenticatorForm,
    MicrosoftAuthenticatorForm,
    SMSOTPAuthenticatorForm
} from "../authenticators";
import { SamlAuthenticatorSettingsForm } from "../authenticators/saml-authenticator-form";
import { SIWEAuthenticatorForm } from "../authenticators/swe-authenticator-form";

/**
 * Proptypes for the authenticator form factory component.
 */
interface AuthenticatorFormFactoryInterface extends TestableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * Metadata of the authenticator.
     */
    metadata?: FederatedAuthenticatorMetaInterface;
    /**
     * Initial values of the authenticator.
     */
    initialValues: FederatedAuthenticatorListItemInterface;
    /**
     * Callback to trigger when the form is submitted.
     */
    onSubmit: (values: FederatedAuthenticatorListItemInterface) => void;
    /**
     * Authenticator type.
     */
    type: string;
    /**
     * Trigger submit.
     */
    triggerSubmit?: boolean;
    /**
     * Enable submit button.
     */
    enableSubmitButton?: boolean;
    /**
     * Show/Hide Custom Properties.
     */
    showCustomProperties?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Authenticator with meta.
     */
    authenticator?: FederatedAuthenticatorWithMetaInterface;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
    /**
     * Created template Id.
     */
    templateId?: string;
    /**
     * Connection setting section meta data.
     */
    connectionSettingsMetaData: any;
}

/**
 * Authenticator form factory.
 *
 * @param props - Props injected to the component.
 * @returns React Element
 */
export const AuthenticatorFormFactory: FunctionComponent<AuthenticatorFormFactoryInterface> = (
    props: AuthenticatorFormFactoryInterface
): ReactElement => {

    const {
        authenticator,
        connectionSettingsMetaData,
        metadata,
        mode,
        initialValues,
        onSubmit,
        type,
        triggerSubmit,
        enableSubmitButton,
        showCustomProperties,
        isReadOnly,
        isSubmitting,
        templateId,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Override the form if it's defined in the extensions under `getOverriddenAuthenticatorForm` func.
     */
    const OverriddenForm: ReactElement | null = identityProviderConfig
        .editIdentityProvider
        .getOverriddenAuthenticatorForm(type, templateId, {
            "data-componentid": testId,
            enableSubmitButton,
            initialValues,
            isSubmitting,
            metadata,
            onSubmit,
            readOnly: isReadOnly,
            showCustomProperties,
            triggerSubmit
        });

    if (OverriddenForm) {
        return OverriddenForm;
    }

    // Render the form dynamically for federated authenticators in custom connector.
    if (templateId === ConnectionManagementConstants.EXPERT_MODE_TEMPLATE_ID) {
        return (
            <CommonAuthenticatorForm
                mode={ mode }
                initialValues={ initialValues }
                metadata={ metadata }
                onSubmit={ onSubmit }
                triggerSubmit={ triggerSubmit }
                enableSubmitButton={ enableSubmitButton }
                data-testid={ testId }
                showCustomProperties={ showCustomProperties }
                readOnly={ isReadOnly }
                isSubmitting={ isSubmitting }
            />
        );
    }

    switch (type) {
        case ConnectionManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID:
            return (
                <GoogleAuthenticatorForm
                    mode={ mode }
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-testid={ testId }
                    showCustomProperties={ showCustomProperties }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ConnectionManagementConstants.FACEBOOK_AUTHENTICATOR_ID:
            return (
                <FacebookAuthenticatorForm
                    mode={ mode }
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-testid={ testId }
                    showCustomProperties={ showCustomProperties }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ConnectionManagementConstants.GITHUB_AUTHENTICATOR_ID:
            return (
                <GithubAuthenticatorForm
                    mode={ mode }
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-testid={ testId }
                    showCustomProperties={ showCustomProperties }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case AuthenticatorManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID:
            return (
                <EmailOTPAuthenticatorForm
                    mode={ mode }
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-testid={ testId }
                    showCustomProperties={ showCustomProperties }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case AuthenticatorManagementConstants.SMS_OTP_AUTHENTICATOR_ID:
            return (
                <SMSOTPAuthenticatorForm
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-testid={ testId }
                    showCustomProperties={ showCustomProperties }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID:
            return (
                <SamlAuthenticatorSettingsForm
                    mode={ mode }
                    onSubmit={ onSubmit }
                    authenticator={ authenticator }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ConnectionManagementConstants.MICROSOFT_AUTHENTICATOR_ID:
            if (templateId === ConnectionManagementConstants.IDP_TEMPLATE_IDS.MICROSOFT){
                return(
                    <MicrosoftAuthenticatorForm
                        mode={ mode }
                        initialValues={ initialValues }
                        metadata={ metadata }
                        onSubmit={ onSubmit }
                        triggerSubmit={ triggerSubmit }
                        enableSubmitButton={ enableSubmitButton }
                        data-testid={ testId }
                        showCustomProperties={ showCustomProperties }
                        readOnly={ isReadOnly }
                        isSubmitting={ isSubmitting }
                    />
                );
            } else {
                return (
                    <CommonAuthenticatorForm
                        mode={ mode }
                        initialValues={ initialValues }
                        metadata={ metadata }
                        onSubmit={ onSubmit }
                        triggerSubmit={ triggerSubmit }
                        enableSubmitButton={ enableSubmitButton }
                        data-testid={ testId }
                        showCustomProperties={ showCustomProperties }
                        readOnly={ isReadOnly }
                        isSubmitting={ isSubmitting }
                    />
                );
            }

        case ConnectionManagementConstants.SIWE_AUTHENTICATOR_ID:
            if (templateId === ConnectionManagementConstants.IDP_TEMPLATE_IDS.SWE) {
                return (
                    <SIWEAuthenticatorForm
                        data-componentid={ testId }
                        enableSubmitButton={ enableSubmitButton }
                        initialValues={ initialValues }
                        isSubmitting={ isSubmitting }
                        metadata={ metadata }
                        onSubmit={ onSubmit }
                        readOnly={ isReadOnly }
                        showCustomProperties={ showCustomProperties }
                        triggerSubmit={ triggerSubmit }
                    />
                );
            }

            break;

        case ConnectionManagementConstants.HYPR_AUTHENTICATOR_ID:
            if (templateId === ConnectionManagementConstants.IDP_TEMPLATE_IDS.HYPR) {
                return (
                    <CommonAuthenticatorForm
                        mode={ mode }
                        onSubmit={ onSubmit }
                        initialValues={ initialValues }
                        enableSubmitButton={ enableSubmitButton }
                        triggerSubmit={ triggerSubmit }
                        metadata={ metadata }
                        data-testid={ testId }
                        showCustomProperties={ showCustomProperties }
                        readOnly={ isReadOnly }
                    />
                );
            }

            break;

        case ConnectionManagementConstants.APPLE_AUTHENTICATOR_ID:
            return (
                <AppleAuthenticatorForm
                    mode={ mode }
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-componentid={ testId }
                    showCustomProperties={ showCustomProperties }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );

        default:
            return (
                <AuthenticatorSettingsForm
                    connectorSettings={ connectionSettingsMetaData }
                    mode={ mode }
                    initialValues={ initialValues }
                    metadata={ metadata }
                    onSubmit={ onSubmit }
                    triggerSubmit={ triggerSubmit }
                    enableSubmitButton={ enableSubmitButton }
                    data-testid={ testId }
                    showCustomProperties={ showCustomProperties }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
    }
};

AuthenticatorFormFactory.defaultProps = {
    enableSubmitButton: true
};

/**
 * Default proptypes for the IDP authenticator for factory component.
 */
AuthenticatorFormFactory.defaultProps = {
    "data-testid": "idp-edit-authenticator-settings-form-factory"
};
