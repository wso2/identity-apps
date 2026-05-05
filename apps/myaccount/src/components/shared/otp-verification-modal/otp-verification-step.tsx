/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Stack from "@mui/material/Stack/Stack";
import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, FormValue, TextFieldAdapter } from "@wso2is/forms";
import React, { FunctionComponent, MouseEvent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Message, Modal } from "semantic-ui-react";
import { resendOTPCode, validateOTPCode } from "../../../api/otp-verification";
import { OTPVerificationRecoveryScenario } from "../../../constants/profile-constants";
import { OTPVerificationChannel } from "../../../models/profile-ui";

interface OtpVerificationStepPropsInterface extends IdentifiableComponentInterface {
    verificationChannel: OTPVerificationChannel;
    isLoading: boolean;
    onCancel: () => void;
    isMultiValued: boolean;
    onVerificationSuccess: () => void;
}

const OTPVerificationStep: FunctionComponent<OtpVerificationStepPropsInterface> = (
    {
        verificationChannel,
        onVerificationSuccess,
        onCancel,
        isMultiValued = false,
        ["data-componentid"]: componentId = "otp-verification-step"
    }: OtpVerificationStepPropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isVerificationError, setIsVerificationError ] = useState(false);
    const [ isResendSuccess, setIsResendSuccess ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    let formSubmit: (e: MouseEvent<HTMLButtonElement>) => void;

    const handleOTPVerification = async (code: string) => {
        setIsLoading(true);

        try {
            const isValid: boolean = await validateOTPCode(code);

            if (isValid) {
                setIsVerificationError(false);
                onVerificationSuccess();
            }
        } catch (error) {
            setIsVerificationError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPResend = async () => {
        setIsLoading(true);

        let recoveryScenario: OTPVerificationRecoveryScenario;

        if (verificationChannel === OTPVerificationChannel.SMS) {
            recoveryScenario = isMultiValued
                ? OTPVerificationRecoveryScenario.MOBILE_VERIFICATION_ON_VERIFIED_LIST_UPDATE
                : OTPVerificationRecoveryScenario.MOBILE_VERIFICATION_ON_UPDATE;
        } else if (verificationChannel === OTPVerificationChannel.EMAIL) {
            recoveryScenario = isMultiValued
                ? OTPVerificationRecoveryScenario.EMAIL_OTP_VERIFICATION_ON_VERIFIED_LIST_UPDATE
                : OTPVerificationRecoveryScenario.EMAIL_OTP_VERIFICATION_ON_UPDATE;
        }

        try {
            const isResent: boolean = await resendOTPCode(recoveryScenario);

            if (isResent) {
                setIsResendSuccess(true);
            }
        } catch (error) {
            setIsResendSuccess(false);

            dispatch(addAlert({
                description: t("myAccount:components.verificationOnUpdate.modal.notifications.resendError.description"),
                level: AlertLevels.ERROR,
                message: t("myAccount:components.verificationOnUpdate.modal.notifications.resendError.message")
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal.Header className="wizard-header" data-testid={ `${componentId}-header` }>
                { t(`myAccount:components.verificationOnUpdate.modal.${
                    verificationChannel.toLowerCase()}.step2.heading`) }
            </Modal.Header>
            <Modal.Content data-testid={ `${componentId}-content` }>
                {
                    isVerificationError && (
                        <>
                            <Message error>
                                { t("myAccount:components.verificationOnUpdate.modal." +
                                    "common.step2.verificationFailure") }
                            </Message>
                        </>
                    )
                }
                {
                    isResendSuccess && (
                        <>
                            <Message success>
                                { t("myAccount:components.verificationOnUpdate.modal.common.step2.resendSuccess") }
                            </Message>
                        </>
                    )
                }

                <FinalForm
                    onSubmit={ (values: Record<string, string>) => {
                        handleOTPVerification(values?.code);
                    } }
                    data-componentid={ `${componentId}-edit-section-form` }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        formSubmit = handleSubmit;

                        return (
                            <form onSubmit={ handleSubmit }>
                                <label>{ t(`myAccount:components.verificationOnUpdate.modal.${
                                    verificationChannel.toLowerCase()}.step2.content.label`) }</label>
                                <FinalFormField
                                    name="code"
                                    type="password"
                                    component={ TextFieldAdapter }
                                    validate={ (value: FormValue) => {
                                        if (!value) {
                                            return t("myAccount:components.verificationOnUpdate." +
                                                "modal.common.step2.validation.otpRequired");
                                        }
                                    } }
                                    data-componentid={ `${componentId}-input-field` }
                                    autoComplete="new-password"
                                    disabled={ isLoading }
                                    required
                                    autoFocus
                                />
                            </form>
                        );
                    } }
                />
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Typography variant="body1">
                        { t("myAccount:components.verificationOnUpdate.modal.common.step2.hint") }
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        onClick={ handleOTPResend }
                        disabled={ isLoading }
                        data-componentid={ `${componentId}-resend-button` }
                    >
                        { t("myAccount:components.verificationOnUpdate.modal.common.step2.resend") }
                    </Button>
                </Stack>
            </Modal.Content>
            <Modal.Actions data-componentid={ `${componentId}-actions` }>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button
                        onClick={ onCancel }
                        disabled={ isLoading }
                        data-componentid={ `${ componentId }-actions-cancel-button` }
                    >
                        { t("common:cancel") }
                    </Button>
                    <Button
                        variant="contained"
                        onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                            formSubmit(e);
                        } }
                        data-componentid={ `${componentId}-actions-primary-button` }
                        loading={ isLoading }
                    >
                        { t("common:verify") }
                    </Button>
                </Stack>
            </Modal.Actions>
        </>
    );
};

export default OTPVerificationStep;
