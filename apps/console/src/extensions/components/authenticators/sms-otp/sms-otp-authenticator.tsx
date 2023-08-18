/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    CommonAuthenticatorFormInitialValuesInterface,
    CommonAuthenticatorFormMetaInterface
} from "apps/console/src/features/identity-providers/models/identity-provider";
import { IdentifiableComponentInterface } from "modules/core/src/models";
import { Divider } from "modules/react-components/node_modules/semantic-ui-react";
import React, { FunctionComponent, ReactElement, useState } from "react";
import {
    SmsOtpAuthenticatorActivationSection
} from "./sms-otp-authenticator-activation-section";
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

    const [ isReadOnly, setIsReadOnly ] = useState<boolean>(true);

    return (
        <>
            <SmsOtpAuthenticatorActivationSection
                onActivate={ (isActivated: boolean) => setIsReadOnly(!isActivated) }
            />
            <Divider hidden />
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
