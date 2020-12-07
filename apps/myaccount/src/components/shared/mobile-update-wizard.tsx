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

import { ProfileConstants } from "@wso2is/core/constants";
import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms, Validation, useTrigger } from "@wso2is/forms";
import { GenericIcon } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Message, Modal, Segment } from "semantic-ui-react";
import { resendSMSOTPCode, updateProfileInfo, validateSMSOTPCode } from "../../api";
import { getEnterCodeIcon } from "../../configs";
import { AlertInterface, AlertLevels } from "../../models";
import { getProfileInformation } from "../../store/actions";

/**
 * Prop types for the SMS OTP component.
 */
interface MobileUpdateWizardProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    closeWizard: () => void;
    wizardOpen;
    currentMobileNumber;
    isMobileRequired;
}

/**
 * Mobile number update section.
 *
 * @param {MobileUpdateWizardProps} props - Props injected to the component.
 * @return {React.ReactElement}
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
        ["data-testid"]: testId
    } = props;

    const [ step, setStep ] = useState<number>(0);
    const [ verificationError, setVerificationError ] = useState<boolean>(false);
    const [ resendSuccess, setResendSuccess ] = useState<boolean>(false);
    const { t } = useTranslation();
    const [ updateMobile, setUpdateMobile ] = useTrigger();
    const [ submit, setSubmit ] = useTrigger();
    const dispatch = useDispatch();

    /**
     * This checks whether the newly updated mobile number is set as the 'pendingMobileNumber' claim
     * in the update response. If it exists that implies mobile number verification is enabled and
     * a verification is pending.
     *
     * @returns {boolean} True/False.
     */
    const isMobileVerificationPending = (updatedMobileNumber, userData): boolean => {
        const PENDING_MOBILE_CLAIM = "pendingMobileNumber";
        return userData && userData[ProfileConstants.SCIM2_ENT_USER_SCHEMA] &&
            userData[ProfileConstants.SCIM2_ENT_USER_SCHEMA][PENDING_MOBILE_CLAIM] &&
            userData[ProfileConstants.SCIM2_ENT_USER_SCHEMA][PENDING_MOBILE_CLAIM] === updatedMobileNumber;

    };

    /**
     * Updates mobile number of the user.
     *
     * @param {string} mobileNumber - New mobile number value to be updated.
     */
    const handleUpdate = (mobileNumber) => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
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
        updateProfileInfo(data).then((response) => {
            if (response.status === 200) {
                // Re-fetch the profile information
                dispatch(getProfileInformation(true));
                if (response?.data && isMobileVerificationPending(mobileNumber, response.data)) {
                    setStep(1);
                } else {
                    closeWizard();
                }
            }
        }).catch(error => {
            onAlertFired({
                description: error?.detail ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: error?.message ?? t(
                    "myAccount:components.profile.notifications.updateProfileInfo.genericError.message"
                )
            });
        });
    };

    /**
     * Makes an API call to verify the code entered by the user.
     *
     * @param {string} code - The code entered by the user.
     */
    const verifyCode = (code: string) => {
        validateSMSOTPCode(code).then((isValidCode) => {
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
        });
    };

    /**
     * Requests to resend the verification SMS OTP code.
     */
    const resendOTOCode = () => {
        resendSMSOTPCode()
            .then(() => {
                setVerificationError(false);
                setResendSuccess(true);
            })
            .catch((errorMessage) => {
            onAlertFired({
                description: t("myAccount:components.mobileUpdateWizard.notifications." +
                    "resendError.error.description", {
                    error: errorMessage
                }),
                level: AlertLevels.ERROR,
                message: t("myAccount:components.mobileUpdateWizard.notifications.resendError.error.message")
            });
        });
    };

    /**
     * Generates header text based on the input step.
     *
     * @param {number} stepToDisplay - The step number.
     * @returns {string} Header text to display.
     */
    const stepHeader = (stepToDisplay: number): string => {
        switch (stepToDisplay) {
            case 0:
                return t("myAccount:components.mobileUpdateWizard.submitMobile.heading");
            case 1:
                return t("myAccount:components.mobileUpdateWizard.verifySmsOtp.heading");
            case 2:
                return null;
        }
    };

    /**
     * Generates illustration based on the input step.
     *
     * @param {number} stepToDisplay - The step number.
     * @returns {string} Illustration to display.
     */
    const stepIllustration = (stepToDisplay: number): JSX.Element => {
        switch (stepToDisplay) {
            case 0:
                return (
                    <GenericIcon
                        transparent
                        size="small"
                        icon={ getEnterCodeIcon() }
                    />
                );
            case 1:
                return (
                    <GenericIcon
                        transparent
                        size="small"
                        icon={ getEnterCodeIcon() }
                    />
                );
        }
    };

    /**
     * Generates content based on the input step.
     *
     * @param {number} stepToDisplay - The step number.
     * @returns {string} Content to display.
     */
    const stepContent = (stepToDisplay: number): JSX.Element => {
        switch (stepToDisplay) {
            case 0:
                return renderSubmitMobile();
            case 1:
                return renderVerifyCode();
            case 2:
                return renderSuccess();
        }
    };

    /**
     * Generates the right button-click event based on the input step number.
     *
     * @param {number} stepToStep - The step number.
     */
    const handleModalButtonClick = (stepToStep: number) => {
        switch (stepToStep) {
            case 0:
                setUpdateMobile();
                break;
            case 1:
                setSubmit();
                break;
            case 2:
                closeWizard();
                break;
        }
    };

    /**
     * Generates button text based on the input step.
     *
     * @param {number} stepToDisplay - The step number.
     * @returns {string} Button text to display.
     */
    const stepButtonText = (stepToDisplay: number): string => {
        switch (stepToDisplay) {
            case 0:
                return t("common:continue");
            case 1:
                return t("common:verify");
            case 2:
                return t("common:done");
        }
    };

    /**
     * This renders the mobile update form content.
     */
    const renderSubmitMobile = (): JSX.Element => {
        const fieldName = t("myAccount:components.profile.forms.mobileChangeForm.inputs.mobile.label");
        return (
            <>
                <Forms
                    onSubmit={ (values: Map<string, string>) => {
                        handleUpdate(values.get("mobileNumber"));
                    } }
                    submitState={ updateMobile }
                >
                    <Field
                        autoFocus={ true }
                        label={ fieldName }
                        name="mobileNumber"
                        placeholder={ t("myAccount:components.profile.forms.generic.inputs." +
                            "placeholder", { fieldName }) }
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
                </Forms>
            </>
        );
    };

    /**
     * This renders the code verification content.
     */
    const renderVerifyCode = (): JSX.Element => {
        return (
            <>
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
                >
                    <Field
                        name="code"
                        label={ t("myAccount:components.mobileUpdateWizard.verifySmsOtp.label") }
                        placeholder={ t("myAccount:components.mobileUpdateWizard.verifySmsOtp.placeholder") }
                        type="text"
                        required={ true }
                        requiredErrorMessage={ t("myAccount:components.mobileUpdateWizard.verifySmsOtp." +
                            "requiredError") }
                    />
                    <Segment textAlign="center" basic>
                        <p className="link" onClick={ resendOTOCode }>{ t("myAccount:components." +
                            "mobileUpdateWizard.verifySmsOtp.generate") }</p>
                    </Segment>
                </Forms>
            </>
        );
    };

    /**
     * This renders the success message at the end of the OTP flow.
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
                <p>{ t("myAccount:components.mobileUpdateWizard.done") }</p>
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
                    step !== 2
                        ? (
                            < Modal.Header className="totp-header">
                                <div className="illustration">{stepIllustration(step)}</div>
                            </Modal.Header>
                        )
                        : null
                }
                <Modal.Content data-testid={ `${testId}-modal-content` }>
                    <h3>{stepHeader(step)}</h3>
                    <Divider hidden />
                    { stepContent(step) }
                </Modal.Content>
                <Modal.Actions data-testid={ `${testId}-modal-actions` }>
                    {
                        step !== 2
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

    return <div data-testid={ testId }>{ mobileUpdateWizard() }</div>;
};

/**
 * Default properties of {@link MobileUpdateWizard}
 * See type definitions in {@link MobileUpdateWizardProps}
 */
MobileUpdateWizard.defaultProps = {
    "data-testid": "mobile-update-wizard"
};
