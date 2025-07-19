/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    SMSOTPAuthenticatorForm
} from "@wso2is/admin.identity-providers.v1/components/forms/authenticators/sms-otp-authenticator-form";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface
} from "@wso2is/admin.identity-providers.v1/models/identity-provider";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";

interface SmsOTPAuthenticatorInterface extends IdentifiableComponentInterface {
    /**
     * SMS OTP Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * SMS OTP Authenticator configured initial values.
     */
    initialValues: CommonAuthenticatorFormInitialValuesInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
    /**
     * Flag to trigger form submit externally.
     */
    triggerSubmit: boolean;
    /**
     * Flag to enable/disable form submit button.
     */
    enableSubmitButton: boolean;
    /**
     * Flag to show/hide custom properties.
     * @remarks Not implemented ATM. Do this when needed.
     */
    showCustomProperties: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

export const SmsOTPAuthenticator: FunctionComponent<SmsOTPAuthenticatorInterface> = (
    props: SmsOTPAuthenticatorInterface
): ReactElement => {

    const {
        enableSubmitButton,
        initialValues,
        isSubmitting,
        metadata,
        onSubmit,
        showCustomProperties,
        triggerSubmit,
        ...rest
    } = props;

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const { organizationType } = useGetCurrentOrganizationType();

    const isReadOnly: boolean =
        !hasRequiredScopes(
            featureConfig?.identityProviders,
            featureConfig?.identityProviders?.scopes?.update,
            allowedScopes,
            organizationType
        );

    return (
        <>
            <SMSOTPAuthenticatorForm
                initialValues={ initialValues }
                metadata={ metadata }
                onSubmit={ onSubmit }
                readOnly = { isReadOnly }
                triggerSubmit={ triggerSubmit }
                enableSubmitButton={ enableSubmitButton }
                showCustomProperties={ showCustomProperties }
                isSubmitting={ isSubmitting }
                { ...rest }
            />
        </>
    );
};
