/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import QRCode from "qrcode.react";
import React, { FormEvent, PropsWithChildren, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    Button,
    Checkbox,
    CheckboxProps,
    Container,
    Form,
    Grid,
    Icon,
    List,
    Message,
    Modal,
    Popup,
    Segment
} from "semantic-ui-react";
import {
    checkIfTOTPEnabled,
    deleteBackupCode,
    deleteTOTP,
    initTOTPCode,
    refreshTOTPCode,
    updateEnabledAuthenticators,
    validateTOTPCode
} from "../../../api";
import { getMFAIcons } from "../../../configs";
import { commonConfig } from "../../../extensions";
import {
    AlertInterface,
    AlertLevels,
    EnabledAuthenticatorUpdateAction
} from "../../../models";
import { AppState } from "../../../store";

/**
 * Property types for the TOTP component.
 * Also see {@link TOTPAuthenticator.defaultProps}
 */
interface TOTPProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    isBackupCodeForced: boolean;
    isSuperTenantLogin: boolean;
    enabledAuthenticators: Array<string>;
    onEnabledAuthenticatorsUpdated: (updatedAuthenticators: Array<string>) => void;
    triggerBackupCodesFlow: () => void;
    /**
     * This callback function handles the visibility of the
     * session termination modal.
     */
     handleSessionTerminationModalVisibility: (visibility: boolean) => void;
}

/**
 * TOTP Authenticator.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const TOTPAuthenticator: React.FunctionComponent<TOTPProps> = (
    props: PropsWithChildren<TOTPProps>
): React.ReactElement => {
    const {
        isSuperTenantLogin,
        isBackupCodeForced,
        enabledAuthenticators,
        onEnabledAuthenticatorsUpdated,
        onAlertFired,
        triggerBackupCodesFlow,
        handleSessionTerminationModalVisibility,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const translateKey = "myAccount:components.mfa.authenticatorApp.";
    const totpAuthenticatorName = "totp";
    const backupCodeAuthenticatorName = "backup-code-authenticator";

    const enableMFAUserWise: boolean = useSelector((state: AppState) => state?.config?.ui?.enableMFAUserWise);
    const shouldContinueToBackupCodes: boolean = isSuperTenantLogin && isBackupCodeForced;

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isTOTPConfigured, setIsTOTPConfigured ] = useState<boolean>(false);
    const [ isTOTPEnabled, setIsTOTPEnabled ] = useState<boolean>(false);
    const [ isConfigTOTPModalOpen, setIsConfigTOTPModalOpen ] = useState<boolean>(false);
    const [ qrCode, setQrCode ] = useState<string>(null);
    const [ TOTPModalCurrentStep, setTOTPModalCurrentStep ] = useState<number>(0);
    const [ isTOTPError, setIsTOTPError ] = useState<boolean>(false);
    const [ isRevokeTOTPModalOpen, setIsRevokeTOTPModalOpen ] = useState<boolean>(false);
    const [ isViewTOTPModalOpen, setIsViewTOTPModalOpen ] = useState<boolean>(false);
    const [ viewTOTPModalCurrentStep, setViewTOTPModalCurrentStep ] = useState<number>(0);
    const [ isConfirmRegenerate, setIsConfirmRegenerate ] = useState<boolean>(false);
    
    const pinCode1 = useRef<HTMLInputElement>();
    const pinCode2 = useRef<HTMLInputElement>();
    const pinCode3 = useRef<HTMLInputElement>();
    const pinCode4 = useRef<HTMLInputElement>();
    const pinCode5 = useRef<HTMLInputElement>();
    const pinCode6 = useRef<HTMLInputElement>();

    /**
     * Check whether the TOTP is configured
     */
    useEffect(() => {        
        checkIfTOTPEnabled().then((response) => {
            setIsTOTPConfigured(response);
        });
    }, []);

    /**
     * Check whether the TOTP is enabled
     */
    useEffect(() => {         
        setIsTOTPEnabled(enabledAuthenticators?.includes(totpAuthenticatorName) ?? false);
    }, [ enabledAuthenticators ]);

    /**
     * Focus to next pin code after enter a value.
     * @param field - The name of the field.
     */
    const focusInToNextPinCode = (field: string): void => {
        switch (field) {
            case "pincode-1":
                pinCode2.current.focus();

                break;
            case "pincode-2":
                pinCode3.current.focus();

                break;
            case "pincode-3":
                pinCode4.current.focus();

                break;
            case "pincode-4":
                pinCode5.current.focus();

                break;
            case "pincode-5":
                pinCode6.current.focus();
                
                break;
        }
    };

    /**
     * Focus to previous pin code after enter Backspace or Delete.
     * @param field - The name of the field.
     */
    const focusInToPreviousPinCode = (field: string): void => {
        switch (field) {
            case "pincode-2":
                pinCode1.current.focus();

                break;
            case "pincode-3":
                pinCode2.current.focus();

                break;
            case "pincode-4":
                pinCode3.current.focus();

                break;
            case "pincode-5":
                pinCode4.current.focus();

                break;
            case "pincode-6":
                pinCode5.current.focus();
                
                break;
        }
    };

    /**
     * Reset pin code value in Error state
     */
    const resetPinCodeFields = () => {
        if (pinCode1.current) {
            pinCode1.current.value = "";
            pinCode2.current.value = "";
            pinCode3.current.value = "";
            pinCode4.current.value = "";
            pinCode5.current.value = "";
            pinCode6.current.value = "";
            pinCode1.current.focus();
        }
    };

    /**
     * Update enabled authenticator list based on the update action.
     * @param action - The update action.
     */
    const handleUpdateEnabledAuthenticators = (action: EnabledAuthenticatorUpdateAction): void => {
        const authenticatorsList: Array<string> = [ ...enabledAuthenticators ];

        switch(action) {
            case EnabledAuthenticatorUpdateAction.ADD : {
                if (!authenticatorsList.includes(totpAuthenticatorName)) {
                    authenticatorsList.push(totpAuthenticatorName);
                }
                if (isSuperTenantLogin 
                        && isBackupCodeForced 
                        && !authenticatorsList.includes(backupCodeAuthenticatorName)) {
                    authenticatorsList.push(backupCodeAuthenticatorName);
                }

                break;
            }
            case EnabledAuthenticatorUpdateAction.REMOVE : {
                if (authenticatorsList.includes(totpAuthenticatorName)) {
                    authenticatorsList.splice(authenticatorsList.indexOf(totpAuthenticatorName), 1);
                }
                if (isSuperTenantLogin 
                        && isBackupCodeForced 
                        && authenticatorsList.includes(backupCodeAuthenticatorName)) {
                    authenticatorsList.splice(authenticatorsList.indexOf(backupCodeAuthenticatorName), 1);
                }

                break;
            }
        }

        // Update enabled authenticator list.
        updateEnabledAuthenticators(authenticatorsList.join(","))
            .then(() => {
                onEnabledAuthenticatorsUpdated(authenticatorsList);
            })
            .catch((errorMessage => {
                onAlertFired({
                    description: t(translateKey + 
                            "notifications.updateAuthenticatorError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.updateAuthenticatorError.error.message")
                });
            }));
    };

    /**
     * Initiate the TOTP configuration flow
     */
    const initTOTPFlow = () => {
        setIsLoading(true);

        initTOTPCode()
            .then((response) => {
                const qrCodeUrl: string = window.atob(response?.data?.qrCodeUrl);

                setIsConfigTOTPModalOpen(true);
                setQrCode(qrCodeUrl);
                setIsTOTPConfigured(true);
                handleUpdateEnabledAuthenticators(EnabledAuthenticatorUpdateAction.ADD);
            })
            .catch((error) => {
                onAlertFired({
                    description: t(translateKey + "notifications.initError.error.description", {
                        error
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.initError.error.message")
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Handle cancelling TOTP configuration flow
     */
    const handleTOTPInitCancel = () => {
        deleteTOTP()
            .then(() => {
                setIsConfigTOTPModalOpen(false);
                setQrCode(null);
                setIsTOTPConfigured(false);
                handleUpdateEnabledAuthenticators(EnabledAuthenticatorUpdateAction.REMOVE);
            })
            .catch((error) => {
                onAlertFired({
                    description: t(translateKey + "notifications.deleteError.error.description", {
                        error
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.deleteError.error.message")
                });
            });
    };

    /**
     * Handle TOTP submit flow.
     * @param event - Form submit event.
     * @param isRegenerated - Whether the TOTP is regenerated or not.
     */
    const handleTOTPSubmit = (event: React.FormEvent<HTMLFormElement>, isRegenerated: boolean = false): void => {
        let verificationCode: string =  event.target[0].value;

        for (let pinCodeIndex: number = 1; pinCodeIndex < 6; pinCodeIndex++){
            verificationCode = verificationCode + event.target[pinCodeIndex].value;
        }

        validateTOTPCode(verificationCode)
            .then((response) => {
                if (response?.data?.isValid) {
                    if (isRegenerated) {
                        setViewTOTPModalCurrentStep(2);
                    } else {
                        setTOTPModalCurrentStep(1);
                    }
                } else {
                    setIsTOTPError(true);
                }
            })
            .catch(() => {
                setIsTOTPError(true);
            })
            .finally(() => {
                resetPinCodeFields();
            });
    };

    /**
     * Handle TOTP enable/disable flow.
     * @param _ - Radio button toggle event.
     * @param data - Data related to the toggle event.
     */
    const handleTOTPToggle = (_: SyntheticEvent, data: CheckboxProps): void => {
        if (data.checked) {
            handleUpdateEnabledAuthenticators(EnabledAuthenticatorUpdateAction.ADD);
        } else {
            handleUpdateEnabledAuthenticators(EnabledAuthenticatorUpdateAction.REMOVE);
        }
    };

    /**
     * Render TOTP form to shown in TOTP modal.
     * @param isRegenerated - Whether the TOTP is regenerated or not.
     * @returns Rendered form component.
     */
    const renderTOTPVerifyForm = (isRegenerated: boolean = false): React.ReactElement => {
        return (
            <>
                <h5 className=" text-center"> { t(translateKey + "modals.verify.heading") }</h5>
                <Segment basic className="pl-0">
                    {
                        isTOTPError
                            ? (
                                <Message 
                                    className="totp-error-message" 
                                    data-testid={ `${ testId }-code-verification-form-field-error` }>
                                    { t(translateKey + "modals.verify.error") }
                                </Message>
                            ) : null
                    }
                    <Form
                        onSubmit={ 
                            (event: React.FormEvent<HTMLFormElement>) => handleTOTPSubmit(event, isRegenerated) 
                        }>
                        <Container>
                            <Grid className="ml-3 mr-3">
                                <Grid.Row textAlign="center" centered columns={ 6 } >
                                    <Grid.Column >
                                        <Form.Field >
                                            <input 
                                                autoFocus 
                                                ref = { pinCode1 } 
                                                name = "pincode-1" 
                                                placeholder = "." 
                                                className = "text-center totp-input" 
                                                type = "text" 
                                                maxLength = { 1 } 
                                                onKeyUp = { (event) => {
                                                    if (event.currentTarget.value.length !== 0) {
                                                        focusInToNextPinCode("pincode-1");
                                                    }
                                                    if ((event.key === "Backspace") || (event.key === "Delete")) {
                                                        focusInToPreviousPinCode("pincode-1");
                                                    } 
                                                } }
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column >
                                        <Form.Field>
                                            <input 
                                                ref = { pinCode2 } 
                                                name = "pincode-2" 
                                                placeholder = "." 
                                                className = "text-center totp-input" 
                                                type = "text" 
                                                maxLength = { 1 } 
                                                onKeyUp = { (event) => {
                                                    if (event.currentTarget.value.length !== 0) {
                                                        focusInToNextPinCode("pincode-2");
                                                    }
                                                    if ((event.key === "Backspace") || (event.key === "Delete")) {
                                                        focusInToPreviousPinCode("pincode-2");
                                                    } 
                                                } }/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column >
                                        <Form.Field >
                                            <input 
                                                ref = { pinCode3 } 
                                                name ="pincode-3" 
                                                placeholder ="." 
                                                className ="text-center totp-input" 
                                                type ="text" 
                                                maxLength = { 1 } 
                                                onKeyUp = { (event) => {
                                                    if (event.currentTarget.value.length !== 0) {
                                                        focusInToNextPinCode("pincode-3");
                                                    }
                                                    if ((event.key === "Backspace") || (event.key === "Delete")) {
                                                        focusInToPreviousPinCode("pincode-3");
                                                    } 
                                                } }/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Field>
                                            <input 
                                                ref = { pinCode4 } 
                                                name ="pincode-4" 
                                                placeholder = "." 
                                                className = "text-center totp-input" 
                                                type = "text" 
                                                maxLength = { 1 } 
                                                onKeyUp = { (event) => {
                                                    if (event.currentTarget.value.length !== 0) {
                                                        focusInToNextPinCode("pincode-4");
                                                    }
                                                    if ((event.key === "Backspace") || (event.key === "Delete")) {
                                                        focusInToPreviousPinCode("pincode-4");
                                                    } 
                                                } }/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column >
                                        <Form.Field>
                                            <input 
                                                ref = { pinCode5 } 
                                                name = "pincode-5" 
                                                placeholder = "." 
                                                className = "text-center totp-input" 
                                                type = "text" 
                                                maxLength = { 1 }                        
                                                onKeyUp = { (event) => {
                                                    if (event.currentTarget.value.length !== 0) {
                                                        focusInToNextPinCode("pincode-5");
                                                    }
                                                    if ((event.key === "Backspace") || (event.key === "Delete")) {
                                                        focusInToPreviousPinCode("pincode-5");
                                                    } 
                                                } }/>
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column >
                                        <Form.Field>
                                            <input 
                                                ref = { pinCode6 } 
                                                name = "pincode-6" 
                                                placeholder = "." 
                                                className = "text-center totp-input" 
                                                type = "text" 
                                                maxLength = { 1 } 
                                                onKeyUp = { (event) => {
                                                    if (event.currentTarget.value.length !== 0) {
                                                        focusInToNextPinCode("pincode-6");
                                                    }
                                                    if ((event.key === "Backspace") || (event.key === "Delete")) {
                                                        focusInToPreviousPinCode("pincode-6");
                                                    } 
                                                } }/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                                <div className = "totp-verify-step-btn">
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Button
                                                primary
                                                type="submit"
                                                className=" totp-verify-action-button"
                                                data-testid={ `${ testId }-modal-actions-primary-button` }
                                            >
                                                { t("common:verify") }
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </div>
                                { !isRegenerated
                                    ? (
                                        <div className = "totp-verify-step-btn">
                                            <Grid.Row columns={ 1 }>
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                    <Button
                                                        type="button"
                                                        onClick={ handleTOTPInitCancel }
                                                        className="link-button totp-verify-action-button"
                                                        data-testid={ `${ testId }-modal-actions-cancel-button` }>
                                                        { t("common:cancel") }
                                                    </Button>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </div>
                                    ) : null
                                }
                            </Grid>
                        </Container>
                    </Form>
                </Segment>
            </>
        );
    };

    /**
     * Render TOTP configuration modal content.
     * @returns Modal content based on TOTPModalCurrentStep.
     */
    const renderTOTPWizardContent = (): React.ReactElement => {
        if (TOTPModalCurrentStep === 0) {
            return (
                <Segment basic >
                    <h5 className=" text-center"> { t(translateKey + "modals.scan.heading") }</h5>
                    <Segment textAlign="center" basic className="qr-code">
                        { qrCode 
                            ? <QRCode value={ qrCode } data-testid={ `${ testId }-modals-scan-qrcode` }/> 
                            : null
                        }
                    </Segment>
                    { renderTOTPVerifyForm() }
                </Segment>
            );
        }

        return (
            <Segment className="totp">
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
                <p className= "success-content">{ t(translateKey + "modals.done") }</p>
            </Segment>
        );  
    };

    /**
     * Render TOTP configuration modal actions.
     * @returns Modal action based on TOTPModalCurrentStep.
     */
    const renderTOTPWizardActions = (): React.ReactElement => {
        if (TOTPModalCurrentStep === 0) {
            return (
                <Message className="totp-tooltip display-flex">      
                    <Icon name="info circle" />
                    <Message.Content> 
                        <Trans
                            i18nKey={ (translateKey + "modals.toolTip") }
                        >
                            Don&apos;t have an app? Download an authenticator 
                            application like Google Authenticator from 
                            <a
                                target="_blank"
                                href="https://www.apple.com/us/search/totp?src=globalnav" 
                                rel="noopener noreferrer"> App Store </a>
                            or 
                            <a
                                target="_blank"
                                href="https://play.google.com/store/search?q=totp" 
                                rel="noopener noreferrer"> Google Play </a> 
                        </Trans>
                    </Message.Content>
                </Message>
            );
        }

        return (
            <Button
                primary
                className = "totp-verify-done-button"
                data-testid={ `${ testId }-modal-actions-primary-button` }
                onClick= { () => {
                    setIsConfigTOTPModalOpen(false);
                    setQrCode(null);
                    setTOTPModalCurrentStep(0);

                    if (shouldContinueToBackupCodes) {
                        triggerBackupCodesFlow();
                    }

                    handleSessionTerminationModalVisibility(true);
                } }
            >
                { shouldContinueToBackupCodes ? t("common:continue") : t("common:done") }
            </Button>
        );
    };

    /**
     * Renders the TOTP configuration Modal
     * @returns Rendered modal component
     */
    const renderTOTPWizard = (): React.ReactElement => {
        return (
            <Modal
                data-testid={ `${ testId }-modal` }
                dimmer="blurring"
                size="tiny"
                open={ isConfigTOTPModalOpen }
                className="totp"
                closeOnDimmerClick={ false }
            >
                <Modal.Header className="wizard-header text-center">
                    { t(translateKey + "modals.heading") }
                </Modal.Header>
                <Modal.Content data-testid={ `${ testId }-modal-content` } scrolling>
                    { renderTOTPWizardContent() }
                </Modal.Content>
                <Modal.Actions data-testid={ `${ testId }-modal-actions` } className ="actions">
                    { renderTOTPWizardActions() }
                </Modal.Actions>
            </Modal>
        );
    };

    /**
     * Handle view TOTP event
     */
    const handleViewTOTP = (): void => {
        setIsLoading(true);
        initTOTPCode()
            .then((response) => {
                const qrCodeUrl: string = window.atob(response?.data?.qrCodeUrl);

                setQrCode(qrCodeUrl);
                setIsViewTOTPModalOpen(true);
            })
            .catch((error) => {
                onAlertFired({
                    description: t(translateKey + "notifications.initError.error.description", {
                        error
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.initError.error.message")
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Handle confirm QR code regeneration checkbox event
     */
    const handleConfirmRegenerateQRCode = (_: FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
        setIsConfirmRegenerate(data.checked ?? false);
    };

    /**
     * Handle regenerate QR code event
     */
    const handleRegenerateQRCode = (): void => {
        setIsLoading(true);
        refreshTOTPCode()
            .then((response) => {
                const qrCodeUrl: string = window.atob(response?.data?.qrCodeUrl);

                setQrCode(qrCodeUrl);
                setViewTOTPModalCurrentStep(1);
            })
            .catch((errorMessage) => {
                onAlertFired({
                    description: t(translateKey + "notifications.refreshError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.refreshError.error.message")
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * 
     * @returns Modal content based on viewTOTPModalCurrentStep
     */
    const renderViewTOTPWizardContent = (): React.ReactElement => {
        switch (viewTOTPModalCurrentStep) {
            case 0:
                return (
                    <Segment basic >
                        <h5 className=" text-center"> { t(translateKey + "modals.scan.heading") }</h5>
                        <Segment textAlign="center" basic className="qr-code">
                            { qrCode 
                                ? <QRCode value={ qrCode } data-testid={ `${ testId }-view-modals-scan-qrcode` }/>
                                : null
                            }
                        </Segment>
                        <div className="ml-3 mr-3">
                            <Message className="display-flex" size="small" warning>
                                <Icon name="warning sign" color="orange" corner />
                                <Message.Content className="tiny">
                                    { t(commonConfig.accountSecurityPage.mfa.totp.regenerateWarning) }
                                </Message.Content>
                            </Message>
                            {
                                commonConfig.accountSecurityPage.mfa.totp.showRegenerateConfirmation
                                    ? (
                                        <Checkbox
                                            className="mb-2"
                                            label={ t(translateKey + "modals.scan.regenerateConfirmLabel") }
                                            checked={ isConfirmRegenerate }
                                            onChange={ handleConfirmRegenerateQRCode }
                                            data-componentid={ `${ testId }-regenerate-assertion-checkbox` }
                                        />
                                    ) : null
                            }
                            <div className = "totp-verify-step-btn">
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Button
                                            primary
                                            type="button"
                                            className=" totp-verify-action-button"
                                            onClick={ handleRegenerateQRCode }
                                            disabled= { 
                                                isLoading 
                                                || (commonConfig.accountSecurityPage
                                                    .mfa.totp.showRegenerateConfirmation && !isConfirmRegenerate) 
                                            }
                                            data-testid={ `${ testId }-view-modal-actions-primary-button` }
                                        >
                                            { t(translateKey + "regenerate") }
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </div>
                            <div className = "totp-verify-step-btn">
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Button
                                            type="button"
                                            onClick={ () => {
                                                setIsConfirmRegenerate(false);
                                                setIsViewTOTPModalOpen(false);
                                            } }
                                            className="link-button totp-verify-action-button"
                                            data-testid={ `${ testId }-view-modal-actions-cancel-button` }>
                                            { t("common:cancel") }
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </div>
                        </div>
                    </Segment>
                );

            case 1:
                return (
                    <Segment basic >
                        <h5 className=" text-center"> { t(translateKey + "modals.scan.heading") }</h5>
                        <Segment textAlign="center" basic className="qr-code">
                            <QRCode value={ qrCode } data-testid={ `${ testId }-modals-scan-qrcode` }/>
                        </Segment>
                        { renderTOTPVerifyForm(true) }
                    </Segment>
                );
        
            default:
                return (
                    <Segment className="totp">
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
                        <p className= "success-content">{ t(translateKey + "modals.done") }</p>
                    </Segment>
                );
        }
    };

    const renderViewTOTPWizardActions = (): React.ReactElement => {
        if (viewTOTPModalCurrentStep === 0 || viewTOTPModalCurrentStep === 1) {
            return (
                <Message className="totp-tooltip display-flex">      
                    <Icon name="info circle" />
                    <Message.Content> 
                        <Trans
                            i18nKey={ (translateKey + "modals.toolTip") }
                        >
                    Don&apos;t have an app? Download an authenticator 
                    application like Google Authenticator from 
                            <a
                                target="_blank"
                                href="https://www.apple.com/us/search/totp?src=globalnav" 
                                rel="noopener noreferrer"> App Store </a>
                    or 
                            <a
                                target="_blank"
                                href="https://play.google.com/store/search?q=totp" 
                                rel="noopener noreferrer"> Google Play </a> 
                        </Trans>
                    </Message.Content>
                </Message>
            );
        }

        return (
            <Button
                primary
                className = "totp-verify-done-button"
                data-testid={ `${ testId }-modal-actions-primary-button` }
                onClick= { () => {
                    setIsConfirmRegenerate(false);
                    setIsViewTOTPModalOpen(false);
                    setViewTOTPModalCurrentStep(0);
                    handleSessionTerminationModalVisibility(true);
                } }
            >
                { t("common:done") }
            </Button>
        );
    };

    /**
     * Renders the TOTP wizard
     */
    const renderViewTOTPWizard = (): React.ReactElement => {
        return (
            <Modal
                data-testid={ `${ testId }-view-modal` }
                dimmer="blurring"
                size="tiny"
                open={ isViewTOTPModalOpen }
                className="totp"
                closeOnDimmerClick={ false }
            >
                <Modal.Header className="wizard-header text-center">
                    { t(translateKey + "modals.heading") }
                </Modal.Header>
                <Modal.Content data-testid={ `${ testId }-view-modal-content` } scrolling>
                    { renderViewTOTPWizardContent() }
                </Modal.Content>
                <Modal.Actions data-testid={ `${ testId }-view-modal-actions` } className ="actions">
                    { renderViewTOTPWizardActions() }
                </Modal.Actions>
            </Modal>
        );
    };

    /**
     *  Initiate deletion of TOTP configuration.
     */
    const initDeleteTOTP = (): void => {
        deleteTOTP()
            .then(() => {
                setIsTOTPConfigured(false);
                handleUpdateEnabledAuthenticators(EnabledAuthenticatorUpdateAction.REMOVE);

                // Deletes backup codes
                if (shouldContinueToBackupCodes) {
                    deleteBackupCode()
                        .then(() => {
                            onAlertFired({
                                description: t(translateKey + "notifications.deleteSuccess.message"),
                                level: AlertLevels.SUCCESS,
                                message: t(translateKey + "notifications.deleteSuccess.genericMessage")
                            });
                            handleSessionTerminationModalVisibility(true);
                        })
                        .catch((errorMessage) => {
                            onAlertFired({
                                description: t(translateKey + "notifications.deleteError.genericError.description", {
                                    error: errorMessage
                                }),
                                level: AlertLevels.ERROR,
                                message: t(translateKey + "notifications.deleteError.genericError.message")
                            });
                        });
                } else {
                    onAlertFired({
                        description: t(translateKey + "notifications.deleteSuccess.message"),
                        level: AlertLevels.SUCCESS,
                        message: t(translateKey + "notifications.deleteSuccess.genericMessage")
                    });
                    handleSessionTerminationModalVisibility(true);
                }
            })
            .catch((errorMessage) => {
                onAlertFired({
                    description: t(translateKey + "notifications.deleteError.genericError.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.deleteError.genericError.message")
                });
            })
            .finally(() => {
                setIsRevokeTOTPModalOpen(false);
            });
    };

    /**
     * Handle the revoke TOTP Configuration modal close event.
     */
    const handleRevokeTOTPModalClose = (): void => {
        setIsRevokeTOTPModalOpen(false);
    };

    /**
     * This renders the TOTP Authenticator delete Modal
     */
    const renderRevokeTOTPModal = () => {
        return (
            <Modal
                data-testid={ `${testId}-termination-modal` }
                size="mini"
                open={ isRevokeTOTPModalOpen }
                onClose={ handleRevokeTOTPModalClose }
                closeOnDimmerClick={ false }
                dimmer="blurring"
            >
                <Modal.Content data-testid={ `${testId}-termination-modal-content` }>
                    <Container>
                        <h3>{ t(translateKey + "modals.delete.heading") }</h3>
                    </Container>
                    <br/>
                    <p>{ t(translateKey + "modals.delete.message" ) }</p>
                </Modal.Content>
                <Modal.Actions data-testid={ `${testId}-termination-modal-actions` }>
                    <Button
                        className="link-button"
                        onClick={ handleRevokeTOTPModalClose }
                        data-testid={ `${testId}-termination-modal-actions-cancel-button` }>
                        { t("common:cancel") }
                    </Button>
                    <Button
                        primary={ true }
                        onClick={ initDeleteTOTP }
                        data-testid={ `${testId}-termination-modal-actions-terminate-button` }>
                        { t("common:remove") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    return ( 
        <>
            { renderTOTPWizard() }
            { !isTOTPConfigured 
                ? (
                    <Grid padded={ true } data-testid={ testId }>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 1 } className="first-column">
                                <List.Content floated="left">
                                    <GenericIcon
                                        icon={ getMFAIcons().authenticatorApp }
                                        size="mini"
                                        twoTone={ true }
                                        transparent={ true }
                                        square={ true }
                                        rounded={ true }
                                        relaxed={ true }
                                    />
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 12 } className="first-column">
                                <List.Content>
                                    <List.Header>{ t(translateKey + "heading") }</List.Header>
                                    <List.Description>
                                        { t(translateKey + "description") }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 3 } className="last-column">
                                <List.Content floated="right">
                                    <Popup
                                        trigger={
                                            (<Icon
                                                link={ true }
                                                onClick={ initTOTPFlow }
                                                className="list-icon padded-icon"
                                                size="small"
                                                color="grey"
                                                name="plus"
                                                disabled={ isLoading }
                                                data-testid={ `${testId}-view-button` }
                                            />)
                                        }
                                        content={ t(translateKey + "addHint") }
                                        inverted
                                    />
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <>
                        { renderViewTOTPWizard() }
                        { renderRevokeTOTPModal() }
                        <Grid padded={ true } data-testid={ testId }>
                            <Grid.Row columns={ 3 }>
                                <Grid.Column width={ 1 } className="first-column">
                                    <List.Content floated="left">
                                        <GenericIcon
                                            icon={ getMFAIcons().authenticatorApp }
                                            size="mini"
                                            twoTone={ true }
                                            transparent={ true }
                                            square={ true }
                                            rounded={ true }
                                            relaxed={ true }
                                        />
                                    </List.Content>
                                </Grid.Column>
                                <Grid.Column width={ 12 } className="first-column">
                                    <List.Content>
                                        <List.Header>
                                            { t(translateKey + "heading") }
                                        </List.Header>
                                        <List.Description>
                                            { t(translateKey + "description") }
                                        </List.Description>
                                    </List.Content>
                                </Grid.Column>
                                { 
                                    (isSuperTenantLogin && enableMFAUserWise) 
                                        ? (
                                            <Grid.Column width={ 1 } floated="right">
                                                <List.Content floated="right">
                                                    <Popup
                                                        trigger={
                                                            (
                                                                <Checkbox
                                                                    toggle
                                                                    data-testid={ `${testId}-conditional-auth` }
                                                                    onChange={ handleTOTPToggle }
                                                                    checked={ isTOTPEnabled }
                                                                    className="conditional-auth-accordion-toggle"
                                                                />
                                                            )
                                                        }
                                                        inverted
                                                        content={ t(translateKey + "enableHint") }
                                                        position="top right"
                                                    />
                                                </List.Content>
                                            </Grid.Column>
                                        ) : null 
                                }
                                <Grid.Column 
                                    width={ (isSuperTenantLogin && enableMFAUserWise) ? 2 : 3 } 
                                    className="last-column" 
                                    floated="right"
                                >
                                    <List.Content floated="right">
                                        <Popup
                                            trigger={
                                                (
                                                    <Icon
                                                        link={ true }
                                                        onClick={ handleViewTOTP }
                                                        className="list-icon padded-icon"
                                                        size="small"
                                                        color="grey"
                                                        name="eye"
                                                        data-testid={ `${testId}-view-button` }
                                                    />
                                                )
                                            }
                                            content={ t(translateKey + "hint") }
                                            position="top right"
                                            inverted
                                        />
                                        <Popup
                                            trigger={
                                                (
                                                    <Icon
                                                        link={ true }
                                                        onClick={ () => setIsRevokeTOTPModalOpen(true) }
                                                        className="list-icon padded-icon"
                                                        size="small"
                                                        color="grey"
                                                        name="trash alternate"
                                                        data-testid={ `${testId}-trash` }
                                                    />
                                                )
                                            }
                                            inverted
                                            content={ t(translateKey + "deleteHint") }
                                            position="top right"
                                        />
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </>
                ) 
            }
        </>
    );
};

/**
 * Default properties for {@link TOTPAuthenticator}
 * See type definitions in {@link TOTPProps}
 */
TOTPAuthenticator.defaultProps = {
    "data-testid": "totp-authenticator",
    enabledAuthenticators: []
};
