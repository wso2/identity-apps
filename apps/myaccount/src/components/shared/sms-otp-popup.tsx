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

import { Field, Forms, useTrigger } from "@wso2is/forms";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Message, Modal, Segment } from "semantic-ui-react";
import { resendSMSOTPCode, validateSMSOTPCode } from "../../api";
import { EnterCode } from "../../configs";
import { AlertInterface, AlertLevels } from "../../models";
import { getProfileInformation } from "../../store/actions";
import { useDispatch } from "react-redux";

/**
 * Prop types for the SMS OTP component.
 */
interface SMSOTPPopupProps {
    onAlertFired: (alert: AlertInterface) => void;
    closeWizard: () => void;
    wizardOpen;
}

/**
 * SMS OTP section.
 *
 * @return {JSX.Element}
 */
export const SMSOTPPopup: React.FunctionComponent<SMSOTPPopupProps> = (props: SMSOTPPopupProps): JSX.Element => {
    const { onAlertFired, closeWizard, wizardOpen } = props;
    const [step, setStep] = useState<number>(0);
    const [verificationError, setVerificationError] = useState<boolean>(false);
    const [resendSuccess, setResendSuccess] = useState<boolean>(false);
    const { t } = useTranslation();
    const [submit, setSubmit] = useTrigger();
    const dispatch = useDispatch();

    /**
     * Makes an API call to verify the code entered by the user
     * @param code The code entered by the user
     */
    const verifyCode = (code: string) => {
        validateSMSOTPCode(code).then((isValidCode) => {
            if (isValidCode) {
                dispatch(getProfileInformation());
                setStep(1);
            } else {
                setResendSuccess(false);
                setVerificationError(true);
            }
        }).catch(() => {
            setResendSuccess(false);
            setVerificationError(true);
        });
    };

    /**
     * Resend the verification SMS OTP code
     */
    const resendOTOCode = () => {
        resendSMSOTPCode()
            .then(() => {
                setVerificationError(false);
                setResendSuccess(true);
            })
            .catch((errorMessage) => {
            onAlertFired({
                description: t("userPortal:components.verifyMobilePopup.notifications." +
                    "resendError.error.description", {
                    error: errorMessage
                }),
                level: AlertLevels.ERROR,
                message: t("userPortal:components.verifyMobilePopup.notifications.resendError.error.message")
            });
        });
    };

    /**
     * Generates content based on the input step
     * @param stepToDisplay The step number
     */
    const stepContent = (stepToDisplay: number): JSX.Element => {
        switch (stepToDisplay) {
            case 0:
                return renderVerifyCode();
            case 1:
                return renderSuccess();
        }
    };

    /**
     * Generates the right button-click event based on the input step number
     * @param stepToStep The step number
     */
    const handleModalButtonClick = (stepToStep: number) => {
        switch (stepToStep) {
            case 0:
                setSubmit();
                break;
            case 1:
                closeWizard();
                break;
        }
    };

    /**
     * Generates button text based on the input step
     * @param stepToDisplay The step number
     */
    const stepButtonText = (stepToDisplay: number): string => {
        switch (stepToDisplay) {
            case 0:
                return t("common:verify");
            case 1:
                return t("common:done");
        }
    };

    /**
     * This renders the code verification content
     */
    const renderVerifyCode = (): JSX.Element => {
        return (
            <>
                <Forms
                    onSubmit={ (values: Map<string, string>) => {
                        verifyCode(values.get("code"));
                    } }
                    submitState={ submit }
                >
                    <Field
                        name="code"
                        label={ t("userPortal:components.verifyMobilePopup.verifySmsOtp.label") }
                        placeholder={ t("userPortal:components.verifyMobilePopup.verifySmsOtp.placeholder") }
                        type="text"
                        required={ true }
                        requiredErrorMessage={ t("userPortal:components.verifyMobilePopup.verifySmsOtp." +
                            "requiredError") }
                    />
                    <Segment textAlign="center" basic>
                        <p className="link" onClick={ resendOTOCode }>{ t("userPortal:components." +
                            "verifyMobilePopup.verifySmsOtp.generate") }</p>
                    </Segment>
                </Forms>
                {
                    verificationError
                        ? (
                            <>
                                <Message error>
                                    { t("userPortal:components.verifyMobilePopup.verifySmsOtp.error") }
                                </Message>
                            </>
                        )
                        : null
                }
                {
                    resendSuccess
                        ? (
                            <>
                                <Message success>
                                    { t("userPortal:components.verifyMobilePopup.notifications.resendSuccess.message") }
                                </Message>
                            </>
                        )
                        : null
                }
            </>
        );
    };

    /**
     * This renders the success message at the end of the OTP flow
     */
    const renderSuccess = (): JSX.Element => {
        return (
            <Segment basic textAlign="center">
                <div className="svg-box">
                    <svg className="circular positive-stroke">
                        <circle
                            className="path"
                            cx="75"
                            cy="75"
                            r="50"
                            fill="none"
                            strokeWidth="5"
                            strokeMiterlimit="10"
                        />
                    </svg>
                    <svg className="positive-icon positive-stroke">
                        <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
                            <path
                                className="positive-icon__check"
                                fill="none"
                                d="M616.306,283.025L634.087,300.805L673.361,261.53"
                            />
                        </g>
                    </svg>
                </div>
                <p>{ t("userPortal:components.verifyMobilePopup.done") }</p>
            </Segment>
        );
    };

    /**
     * This renders the OTP wizard
     */
    const otpWizard = (): JSX.Element => {
        return (
            <Modal
                dimmer="blurring"
                size="mini"
                open={ wizardOpen }
                onClose={ closeWizard }
                className="totp"
            >
                {
                    step !== 1
                        ? (
                            < Modal.Header className="totp-header">
                                <div className="illustration"><EnterCode /></div>
                            </Modal.Header>
                        )
                        : null
                }
                <Modal.Content>
                    {
                        step !== 1
                            ? (
                                <h3>{ t("userPortal:components.verifyMobilePopup.verifySmsOtp.heading") }</h3>
                            )
                            : null
                    }
                    <Divider hidden />
                    { stepContent(step) }
                </Modal.Content>
                <Modal.Actions>
                    {
                        step !== 1
                            ? (
                                < Button onClick={ () => closeWizard() } className="link-button">
                                    { t("common:cancel") }
                                </Button>
                            )
                            : null
                    }
                    <Button onClick={ () => { handleModalButtonClick(step); } } primary>
                        { stepButtonText(step) }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    return <div>{ otpWizard() }</div>;
};
