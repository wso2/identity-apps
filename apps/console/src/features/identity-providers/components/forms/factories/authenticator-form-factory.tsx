/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { identityProviderConfig } from "../../../../../extensions/configs/identity-provider";
import { IdentityProviderManagementConstants } from "../../../constants";
import {
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaInterface,
    FederatedAuthenticatorWithMetaInterface
} from "../../../models";
import {
    CommonAuthenticatorForm,
    EmailOTPAuthenticatorForm,
    FacebookAuthenticatorForm,
    GithubAuthenticatorForm,
    GoogleAuthenticatorForm
} from "../authenticators";
import { SamlAuthenticatorSettingsForm } from "../authenticators/saml-authenticator-form";

/**
 * Proptypes for the authenticator form factory component.
 */
interface AuthenticatorFormFactoryInterface extends TestableComponentInterface {
    metadata?: FederatedAuthenticatorMetaInterface;
    initialValues: FederatedAuthenticatorListItemInterface;
    onSubmit: (values: FederatedAuthenticatorListItemInterface) => void;
    type: string;
    triggerSubmit?: boolean;
    enableSubmitButton?: boolean;
    /**
     * Show/Hide Custom Properties.
     */
    showCustomProperties?: boolean;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    authenticator?: FederatedAuthenticatorWithMetaInterface;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
    /**
     * Created template Id.
     */
    templateId?: string;
}

/**
 * Authenticator form factory.
 *
 * @param {AuthenticatorFormFactoryInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorFormFactory: FunctionComponent<AuthenticatorFormFactoryInterface> = (
    props: AuthenticatorFormFactoryInterface
): ReactElement => {

    const {
        authenticator,
        metadata,
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

    switch (type) {
        case IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID:
            return (
                <GoogleAuthenticatorForm
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
        case IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID:
            return (
                <FacebookAuthenticatorForm
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
        case IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID:
            return (
                <GithubAuthenticatorForm
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
        case IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID:
            return (
                <EmailOTPAuthenticatorForm
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
        case IdentityProviderManagementConstants.SAML_AUTHENTICATOR_ID:
            return (
                <SamlAuthenticatorSettingsForm
                    onSubmit={ onSubmit }
                    authenticator={ authenticator }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        default:
            return (
                <CommonAuthenticatorForm
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
