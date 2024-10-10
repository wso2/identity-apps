/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms, Validation, useTrigger } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import { AxiosError, AxiosResponse } from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Message, Modal, Segment } from "semantic-ui-react";
import { resendSMSOTPCode, updateProfileInfo, validateSMSOTPCode } from "../../api";
import { AlertInterface, AlertLevels } from "../../models";
import { getProfileInformation } from "../../store/actions";

/**
 * Prop types for the SMS OTP component.
 */
interface MobileUpdateWizardProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    closeWizard: () => void;
    wizardOpen: boolean;
    currentMobileNumber: string;
    isMobileRequired: boolean;
    isMultipleEmailAndMobileNumberEnabled?: boolean;
}

/**
 * Interface for the operation object.
 */
interface Operation {
    op: string;
    value: {
        [key: string]: string | boolean
        | Array<{ [key: string]: string | boolean }>
        | { [key: string]: string | boolean };
    };
}

/**
 * Mobile number update section.
 *
 * @param props - Props injected to the component.
 * @returns Mobile number update wizard component.
 */
export const MobileUpdateWizard: React.FunctionComponent<MobileUpdateWizardProps> = (
    props: MobileUpdateWizardProps
): React.ReactElement => {

    const {
        onAlertFired,
        closeWizard,
        wizardOpen,
        currentMobileNumber,
        isMobileRequired,
        isMultipleEmailAndMobileNumberEnabled,
        ["data-testid"]: testId
    } = props;

    const [ step, setStep ] = useState<number>(0);
    const [ verificationError, setVerificationError ] = useState<boolean>(false);
    const [ resendSuccess, setResendSuccess ] = useState<boolean>(false);
    const { t } = useTranslation();
    const [ updateMobile, setUpdateMobile ] = useTrigger();
    const [ submit, setSubmit ] = useTrigger();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const dispatch: Dispatch<any> = useDispatch();

    useEffect(() => {

        if (isMultipleEmailAndMobileNumberEnabled && step === 0) {
            const timer: NodeJS.Timeout  = setTimeout(() => {
                setStep(1);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    /**
     * This checks whether the newly updated mobile number is set as the 'pendingMobileNumber' claim
     * in the update response. If it exists that implies mobile number verification is enabled and
     * a verification is pending.
     *
     * @returns True/False.
     */
    const isMobileVerificationPending = (updatedMobileNumber: string, userData:  Record<string, string>): boolean => {
        const PENDING_MOBILE_CLAIM: string = "pendingMobileNumber";

        return userData && userData[ProfileConstants.SCIM2_ENT_USER_SCHEMA] &&
            userData[ProfileConstants.SCIM2_ENT_USER_SCHEMA][PENDING_MOBILE_CLAIM] &&
            userData[ProfileConstants.SCIM2_ENT_USER_SCHEMA][PENDING_MOBILE_CLAIM] === updatedMobileNumber;

    };

    /**
     * Updates mobile number of the user.
     *
     * @param mobileNumber - New mobile number value to be updated.
     */
    const handleUpdate = (mobileNumber: string) => {

        setIsSubmitting(true);
        const data: {
            Operations: Array<Operation>;
            schemas: string[];
        } = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        data.Operations[0].value = {
            phoneNumbers: [
                {
                    type: "mobile",
                    value: mobileNumber
                }
            ],
            [ProfileConstants.SCIM2_ENT_USER_SCHEMA]: { "verifyMobile": true }
        };
        updateProfileInfo(data).then((response: AxiosResponse) => {
            if (response.status === 200) {
                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
                if (response?.data && isMobileVerificationPending(mobileNumber, response.data)) {
                    setStep(1);
                } else {
                    closeWizard();
                }
            }
        }).catch((error: any)=> {
            onAlertFired({
                description: error?.detail ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    /**
     * Makes an API call to verify the code entered by the user.
     *
     * @param code - The code entered by the user.
     */
    const verifyCode = (code: string) => {

        setIsSubmitting(true);
        validateSMSOTPCode(code).then((isValidCode: boolean) => {
            if (isValidCode) {
                dispatch(getProfileInformation());
                setStep(2);
            } else {
                setResendSuccess(false);
                setVerificationError(true);
            }
        }).catch(() => {
            setResendSuccess(false);
            setVerificationError(true);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    /**
     * Requests to resend the verification SMS OTP code.
     */
    const resendOTOCode = () => {

        setIsSubmitting(true);
        let recoveryScenario: string = "MOBILE_VERIFICATION_ON_UPDATE";

        if (isMultipleEmailAndMobileNumberEnabled) {
            recoveryScenario = "MOBILE_VERIFICATION_ON_VERIFIED_LIST_UPDATE";
        }
        resendSMSOTPCode(recoveryScenario)
            .then(() => {
                setVerificationError(false);
                setResendSuccess(true);
            })
            .catch((errorMessage: AxiosError) => {
                onAlertFired({
                    description: t("myAccount:components.mobileUpdateWizard.notifications." +
                            "resendError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.mobileUpdateWizard.notifications.resendError.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Generates header text based on the input step.
     *
     * @param stepToDisplay - The step number.
     * @returns Header text to display.
     */
    const stepHeader = (stepToDisplay: number): string => {

        if (isMultipleEmailAndMobileNumberEnabled) {
            switch (stepToDisplay) {
                case 0:
                    return null;
                case 1:
                    return t("myAccount:components.mobileUpdateWizard.verifySmsOtp.heading");
                case 2:
                    return null;
            }
        } else {
            switch (stepToDisplay) {
                case 0:
                    return t("myAccount:components.mobileUpdateWizard.verifySmsOtp.heading");
                case 1:
                    return t("myAccount:components.mobileUpdateWizard.verifySmsOtp.heading");
                case 2:
                    return null;
            }
        }
    };

    /**
     * Generates content based on the input step.
     *
     * @param stepToDisplay - The step number.
     * @returns Content to display.
     */
    const stepContent = (stepToDisplay: number): JSX.Element => {

        if (isMultipleEmailAndMobileNumberEnabled) {
            switch (stepToDisplay) {
                case 0:
                    return renderAnimatedMessage();
                case 1:
                    return renderVerifyCode();
                case 2:
                    return renderSuccess();
            }
        } else {
            switch (stepToDisplay) {
                case 0:
                    return renderSubmitMobile();
                case 1:
                    return renderVerifyCode();
                case 2:
                    return renderSuccess();
            }
        }
    };

    const renderAnimatedMessage = (): JSX.Element => {
        return (
            <motion.div
                className="vertical-align-center animated-message"
                initial={ { opacity: 0, y: 50 } }
                animate={ { opacity: 1, y: 0 } }
                exit={ { opacity: 0, y: 50 } }
                transition={ { duration: 1.5 } }
            >
                <h3>{ t("myAccount:components.mobileUpdateWizard.verificationSent.heading") }</h3>
            </motion.div>
        );
    };

    /**
     * This renders the mobile update form content.
     */
    const renderSubmitMobile = (): JSX.Element => {
        const fieldName: string = t("myAccount:components.profile.forms.mobileChangeForm.inputs.mobile.label");

        return (
            <>
                <Forms
                    onSubmit={ (values: Map<string, string>) => {
                        handleUpdate(values.get("mobileNumber"));
                    } }
                    submitState={ updateMobile }
                    className="inside-content"
                >
                    <div className="modal-input">
                        <Field
                            autoFocus={ true }
                            name="mobileNumber"
                            label={ t("myAccount:components.mobileUpdateWizard.submitMobile.heading") }
                            required={ isMobileRequired }
                            requiredErrorMessage={ t(
                                "myAccount:components.profile.forms.generic.inputs.validations.empty",
                                { fieldName }) }
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.mobileNumber(value)) {
                                    validation.errorMessages.push(t(
                                        "myAccount:components.profile.forms." +
                                    "generic.inputs.validations.invalidFormat",
                                        {
                                            fieldName
                                        }
                                    ));
                                    validation.isValid = false;
                                }
                            } }
                            value={ currentMobileNumber }
                        />
                    </div>
                    <div className="button-group">
                        <div className = "totp-verify-step-btn">
                            <Button
                                primary
                                type="submit"
                                className="totp-verify-action-button"
                                onClick={ setUpdateMobile }
                                data-testid={ `${testId}-modal-actions-primary-button` }
                                disabled={ isSubmitting }
                            >
                                { t("common:continue") }
                            </Button>
                        </div>
                        <div className = "totp-verify-step-btn">
                            <Button
                                onClick={ () => closeWizard() }
                                className="link-button totp-verify-action-button"
                                data-testid={ `${ testId }-modal-actions-cancel-button` }>
                                { t("common:cancel") }
                            </Button>
                        </div>
                    </div>
                </Forms>
            </>
        );
    };

    /**
     * This renders the code verification content.
     */
    const renderVerifyCode = (): JSX.Element => {
        return (
            <div className="inside-content">
                {
                    verificationError
                        ? (
                            <>
                                <Message error>
                                    { t("myAccount:components.mobileUpdateWizard.verifySmsOtp.error") }
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
                                    { t("myAccount:components.mobileUpdateWizard.notifications." +
                                        "resendSuccess.message") }
                                </Message>
                            </>
                        )
                        : null
                }
                <Forms
                    onSubmit={ (values: Map<string, string>) => {
                        verifyCode(values.get("code"));
                    } }
                    submitState={ submit }
                    className="inside-content"
                >

                    <div className="modal-input">
                        <Field
                            name="code"
                            label={ t("myAccount:components.mobileUpdateWizard.verifySmsOtp.label") }
                            type="text"
                            required={ true }
                            requiredErrorMessage={ t("myAccount:components.mobileUpdateWizard.verifySmsOtp." +
                                "requiredError") }
                            autoFocus={ true }
                        />
                    </div>
                    <div>
                        <Segment textAlign="center" className="" basic>
                            <p
                                className={ `link resend-button ${isSubmitting ? "disabled" : ""}` }
                                onClick={ () => {
                                    if (isSubmitting) return;
                                    resendOTOCode();
                                }
                                }
                                data-testid={ `${ testId }-resend-button` }>
                                { t("myAccount:components." +
                                "mobileUpdateWizard.verifySmsOtp.generate") }</p>
                        </Segment>
                    </div>
                    <div className="button-group">
                        <div className = "totp-verify-step-btn">
                            <Button
                                primary
                                type="submit"
                                className="totp-verify-action-button"
                                onClick={ setSubmit }
                                disabled={ isSubmitting }
                                data-testid={ `${ testId }-modal-actions-primary-button` }
                            >
                                { t("common:verify") }
                            </Button>
                        </div>
                        <div className = "totp-verify-step-btn">
                            <Button
                                onClick={ () => closeWizard() }
                                className="link-button totp-verify-action-button"
                                data-testid={ `${ testId }-modal-actions-cancel-button` }>
                                { t("common:cancel") }
                            </Button>
                        </div>
                    </div>
                </Forms>
            </div>
        );
    };

    /**
     * This renders the success message at the end of the OTP flow.
     */
    const renderSuccess = (): JSX.Element => {

        return (
            <Segment basic textAlign="center" className="inside-content">
                <div className="modal-input">
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
                    <p>{ t("myAccount:components.mobileUpdateWizard.done") }</p>
                </div>
                <div className = "button-group totp-verify-step-btn">
                    <Button
                        primary
                        className="totp-verify-action-button"
                        onClick={ closeWizard }
                        data-testid={ `${ testId }-modal-actions-success-button` }
                    >
                        { t("common:done") }
                    </Button>
                </div>
            </Segment>
        );
    };

    /**
     * This renders the mobile number update wizard.
     */
    const mobileUpdateWizard = (): JSX.Element => {

        return (
            <Modal
                data-testid={ `${testId}-modal` }
                dimmer="blurring"
                size="mini"
                open={ wizardOpen }
                onClose={ closeWizard }
                className="totp"
            >
                {
                    ((isMultipleEmailAndMobileNumberEnabled && step === 1)
                        || (!isMultipleEmailAndMobileNumberEnabled && step !== 2))
                        ? (
                            < Modal.Header className="wizard-header text-center">
                                { stepHeader(step) }
                            </Modal.Header>
                        )
                        : null
                }
                <Modal.Content data-testid={ `${testId}-modal-content` } className="mobile-verification-content">
                    { stepContent(step) }
                </Modal.Content>
            </Modal>
        );
    };

    return <div data-testid={ testId }>{ mobileUpdateWizard() }</div>;
};

/**
 * Default properties of {@link MobileUpdateWizard}
 * See type definitions in {@link MobileUpdateWizardProps}
 */
MobileUpdateWizard.defaultProps = {
    "data-testid": "mobile-update-wizard"
};
