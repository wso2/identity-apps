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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface
} from "apps/console/src/features/identity-providers/models/identity-provider";
import { Divider } from "modules/react-components/node_modules/semantic-ui-react";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
    SmsOtpAuthenticatorActivationSection
} from "./sms-otp-authenticator-activation-section";
import { FeatureConfigInterface } from "../../../../features/core/models";
import { AppState } from "../../../../features/core/store";
import {
    SMSOTPAuthenticatorForm
} from "../../../../features/identity-providers/components/forms/authenticators/sms-otp-authenticator-form";

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

    const isChoreoEnabledAsSMSProvider: boolean = useMemo(() => {
        const disabledFeatures: string[] = featureConfig?.smsProviders?.disabledFeatures;

        return !disabledFeatures?.includes("choreoAsSMSProvider");
    }, [ featureConfig ]);

    const [ isReadOnly, setIsReadOnly ] = useState<boolean>(isChoreoEnabledAsSMSProvider || !hasRequiredScopes(
        featureConfig?.identityProviders, featureConfig?.identityProviders?.scopes?.update, allowedScopes));

    return (
        <>
            {
                isChoreoEnabledAsSMSProvider && (
                    <>
                        <SmsOtpAuthenticatorActivationSection
                            onActivate={
                                (isActivated: boolean) => setIsReadOnly(isChoreoEnabledAsSMSProvider && !isActivated)
                            }
                        />
                        <Divider hidden />
                    </>
                )
            }
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
