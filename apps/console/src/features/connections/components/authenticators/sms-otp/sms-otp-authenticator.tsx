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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface
} from "../../../models/authenticators";
import {
    SMSOTPAuthenticatorForm
} from "../../forms/authenticators/sms-otp-authenticator-form";

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

    const isReadOnly: boolean = true;

    return (
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
    );
};
