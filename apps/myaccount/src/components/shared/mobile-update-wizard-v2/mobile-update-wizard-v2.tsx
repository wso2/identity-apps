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

import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface, PatchOperationRequest } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Modal } from "semantic-ui-react";
import {
    MobileInputStepActions,
    MobileInputStepContent,
    MobileInputStepHeader
} from "./mobile-input-step";
import {
    OtpVerificationStepActions,
    OtpVerificationStepContent,
    OtpVerificationStepHeader
} from "./otp-verification-step";
import {
    VerificationSuccessStepActions,
    VerificationSuccessStepContent
} from "./verification-success-step";
import { updateProfileInfo } from "../../../api/profile";
import { resendSMSOTPCode, validateSMSOTPCode } from "../../../api/verify-mobile-smsotp";
import { ProfilePatchOperationValue } from "../../../models/profile";
import { setActiveForm } from "../../../store/actions/global";

interface MobileUpdateWizardV2PropsInterface extends IdentifiableComponentInterface {
    initialValue: string;
    isOpen: boolean;
    onClose: (isRevalidate?: boolean) => void;
    onCancel: (isRevalidate?: boolean) => void;
    initialStep?: number;
    isMultiValued?: boolean;
}

const MobileUpdateWizardV2: FunctionComponent<MobileUpdateWizardV2PropsInterface> = (
    {
        initialValue,
        isOpen,
        onClose,
        onCancel,
        initialStep = 0,
        isMultiValued = false,
        ["data-componentid"]: testId = "component-id"
    }: MobileUpdateWizardV2PropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();

    const [ activeStep, setActiveStep ] = useState<number>(initialStep);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isOTPVerificationError, setIsOTPVerificationError ] = useState<boolean>(false);
    const [ isOTPResendSuccess, setIsOTPResendSuccess ] = useState<boolean>(false);

    const [ triggerUpdateMobile, setTriggerUpdateMobile ] = useTrigger();
    const [ triggerVerifyOTP, setTriggerVerifyOTP ] = useTrigger();

    const handleMobileNumberUpdate = (updatedValue: string): void => {
        setIsSubmitting(true);
        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        data.Operations.push({
            op: "add",
            value: {
                [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: [
                    { type: "mobile", value: updatedValue }
                ]
            }
        });

        data.Operations.push({
            op: "replace",
            value: {
                [ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA] : {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFY_MOBILE")] : true
                }
            }
        });

        updateProfileInfo(data as unknown as Record<string, unknown>)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    if (response?.data
                        ?.[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]
                        ?.pendingMobileNumber === updatedValue) {
                        // Navigate to the OTP verification step.
                        setActiveStep((activeStep: number) => activeStep + 1);
                    } else {
                        onClose(true);
                    }
                }
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description:
                        error?.response?.detail ??
                        t("myAccount:components.profile.notifications.updateProfileInfo.genericError.description"),
                    level: AlertLevels.ERROR,
                    message:
                        error?.message ??
                        t("myAccount:components.profile.notifications.updateProfileInfo.genericError.message")
                }));
                dispatch(setActiveForm(null));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Makes an API call to verify the code entered by the user.
     *
     * @param code - The code entered by the user.
     */
    const handleVerifyOTP = (code: string) => {
        setIsSubmitting(true);

        validateSMSOTPCode(code)
            .then((isValidCode: boolean) => {
                if (isValidCode) {
                    // Navigate to the success message step.
                    setActiveStep((activeStep: number) => activeStep + 1);
                } else {
                    setIsOTPVerificationError(true);
                    setIsOTPResendSuccess(false);
                }
            })
            .catch(() => {
                setIsOTPResendSuccess(false);
                setIsOTPVerificationError(true);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Requests to resend the verification SMS OTP code.
     */
    const handleResendOTP = () => {
        setIsSubmitting(true);

        const recoveryScenario: string = isMultiValued
            ? "MOBILE_VERIFICATION_ON_VERIFIED_LIST_UPDATE"
            : "MOBILE_VERIFICATION_ON_UPDATE";

        resendSMSOTPCode(recoveryScenario)
            .then(() => {
                setIsOTPResendSuccess(true);
                setIsOTPVerificationError(false);
            })
            .catch((errorMessage: AxiosError) => {
                dispatch(addAlert({
                    description: t("myAccount:components.mobileUpdateWizard.notifications." +
                            "resendError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.mobileUpdateWizard.notifications.resendError.error.message")
                }));
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    const modalSteps: { header?: ReactElement; content: ReactElement; actions: ReactElement }[] = [
        {
            actions: (
                <MobileInputStepActions
                    onSubmit={ () => setTriggerUpdateMobile() }
                    onCancel={ onCancel }
                    isLoading={ isSubmitting }
                />
            ),
            content: (
                <MobileInputStepContent
                    initialValue={ initialValue }
                    isRequired={ true }
                    fieldLabel="mobile"
                    onUpdate={ handleMobileNumberUpdate }
                    triggerUpdate={ triggerUpdateMobile }
                />
            ),
            header: <MobileInputStepHeader />
        },
        {
            actions: (
                <OtpVerificationStepActions
                    onSubmit={ () => setTriggerVerifyOTP() }
                    onCancel={ onCancel }
                    isLoading={ isSubmitting }
                />
            ),
            content: (
                <OtpVerificationStepContent
                    triggerSubmit={ triggerVerifyOTP }
                    onVerifyOTP={ handleVerifyOTP }
                    onResendOTP={ handleResendOTP }
                    isLoading={ isSubmitting }
                    isVerificationError={ isOTPVerificationError }
                    isResendSuccess={ isOTPResendSuccess }
                />
            ),
            header: <OtpVerificationStepHeader />
        },
        {
            actions: <VerificationSuccessStepActions onDone={ () => onClose(true) } />,
            content: <VerificationSuccessStepContent />
        }
    ];

    return (
        <Modal
            data-testid={ `${testId}-modal` }
            dimmer="blurring"
            size="mini"
            open={ isOpen }
            className="totp"
        >
            {
                modalSteps[activeStep].header && (
                    <Modal.Header className="wizard-header">
                        { modalSteps[activeStep].header }
                    </Modal.Header>
                )
            }
            <Modal.Content data-testid={ `${testId}-modal-content` }>
                { modalSteps[activeStep].content }
            </Modal.Content>
            <Modal.Actions data-testid={ `${testId}-modal-actions` }>
                { modalSteps[activeStep].actions }
            </Modal.Actions>
        </Modal>
    );
};

export default MobileUpdateWizardV2;
