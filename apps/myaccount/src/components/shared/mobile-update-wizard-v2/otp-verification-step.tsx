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
import { Field, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Message } from "semantic-ui-react";

interface OtpVerificationStepPropsInterface extends IdentifiableComponentInterface {}

interface OtpVerificationStepHeaderPropsInterface extends OtpVerificationStepPropsInterface {}

const OtpVerificationStepHeader: FunctionComponent<OtpVerificationStepHeaderPropsInterface> = (
    {
        ["data-componentid"]: componentId = "otp-verification-step-header"
    }: OtpVerificationStepHeaderPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <div data-componentid={ componentId }>
            { t("myAccount:components.mobileUpdateWizard.verifySmsOtp.heading") }
        </div>
    );
};

interface OtpVerificationStepContentPropsInterface extends OtpVerificationStepPropsInterface {
    triggerSubmit: boolean;
    onVerifyOTP: (code: string) => void;
    onResendOTP: () => void;
    isLoading: boolean;
    isVerificationError: boolean;
    isResendSuccess: boolean;
}

const OtpVerificationStepContent: FunctionComponent<OtpVerificationStepContentPropsInterface> = (
    {
        onVerifyOTP,
        onResendOTP,
        triggerSubmit,
        isLoading,
        isVerificationError,
        isResendSuccess,
        ["data-componentid"]: componentId = "otp-verification-step-content"
    }: OtpVerificationStepContentPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <div>
            {
                isVerificationError && (
                    <>
                        <Message error>
                            { t("myAccount:components.mobileUpdateWizard.verifySmsOtp.error") }
                        </Message>
                    </>
                )
            }
            {
                isResendSuccess && (
                    <>
                        <Message success>
                            { t("myAccount:components.mobileUpdateWizard.notifications.resendSuccess.message") }
                        </Message>
                    </>
                )
            }

            <Forms
                onSubmit={ (values: Map<string, string>) => {
                    onVerifyOTP(values.get("code"));
                } }
                submitState={ triggerSubmit }
            >

                <div className="modal-input">
                    <Field
                        name="code"
                        label={ t("myAccount:components.mobileUpdateWizard.verifySmsOtp.label") }
                        type="text"
                        required={ true }
                        requiredErrorMessage={ t("myAccount:components.mobileUpdateWizard.verifySmsOtp.requiredError") }
                        autoFocus={ true }
                    />
                </div>
                <div className="resend">
                    { t("myAccount:components.mobileUpdateWizard.verifySmsOtp.didNotReceive") }
                    <p
                        className={ `link resend-button ${isLoading ? "disabled" : ""}` }
                        onClick={ () => {
                            if (isLoading) return;
                            onResendOTP();
                        } }
                        data-testid={ `${ componentId }-resend-button` }>
                        { t("myAccount:components.mobileUpdateWizard.verifySmsOtp.resend") }
                    </p>
                </div>
            </Forms>
        </div>
    );
};

interface OtpVerificationStepActionsPropsInterface extends OtpVerificationStepPropsInterface {
    onSubmit: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

const OtpVerificationStepActions: FunctionComponent<OtpVerificationStepActionsPropsInterface> = (
    {
        onSubmit,
        onCancel,
        isLoading,
        ["data-componentid"]: testId = "otp-verification-step-actions"
    }: OtpVerificationStepActionsPropsInterface
): ReactElement => {
    const { t } = useTranslation();

    return (
        <>
            <Button
                onClick={ onCancel }
                className="link-button"
                disabled={ isLoading }
                data-testid={ `${ testId }-modal-actions-cancel-button` }
            >
                { t("common:cancel") }
            </Button>
            <Button
                primary
                type="submit"
                onClick={ onSubmit }
                data-testid={ `${testId}-modal-actions-primary-button` }
                loading={ isLoading }
            >
                { t("common:verify") }
            </Button>
        </>
    );
};

export {
    OtpVerificationStepContent,
    OtpVerificationStepActions,
    OtpVerificationStepHeader
};
