/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import QRCode from "qrcode.react";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Checkbox,
    Container,
    Divider,
    Form,
    Grid,
    Icon,
    List,
    Message, 
    Modal,
    Popup,  
    Segment 
} from "semantic-ui-react";
import { BackupCodeAuthenticator } from "./backup-code-display";
import {
    checkIfTOTPEnabled,
    deleteTOTP,
    getEnabledAuthenticators,
    initTOTPCode,
    refreshTOTPCode,
    updateEnabledAuthenticators,
    validateTOTPCode
} from "../../../api";
import { getMFAIcons } from "../../../configs";
import {
    AlertInterface,
    AlertLevels,
    EnabledAuthenticatorUpdateAction,
    EnabledAuthenticatorsInterface
} from "../../../models";
import { AppState } from "../../../store";
import { getProfileInformation } from "../../../store/actions";

/**
 * Property types for the TOTP component.
 * Also see {@link TOTPAuthenticator.defaultProps}
 */
interface TOTPProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    isBackupCodeForced: boolean;
    onBackupCodeAvailabilityToggle;
    isSuperTenantLogin: boolean;
    backupCodes: Array<string>;
    updateBackupCodes(backupCodeList: Array<string>);
}

/**
 * TOTP Authenticator.
 *
 * @param {React.PropsWithChildren<TOTPProps>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const TOTPAuthenticator: React.FunctionComponent<TOTPProps> = (
    props: PropsWithChildren<TOTPProps>
): React.ReactElement => {

    const {
        onAlertFired,
        isBackupCodeForced,
        onBackupCodeAvailabilityToggle,
        isSuperTenantLogin,  
        backupCodes,
        updateBackupCodes,  
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const [ openWizard, setOpenWizard ] = useState(false);
    const [ qrCode, setQrCode ] = useState("");
    const [ step, setStep ] = useState(0);
    const [ error, setError ] = useState(false);
    const [ isTOTPConfigured, setIsTOTPConfigured ] = useState<boolean>(false);
    const [ revokeTOTPAuthnModalVisibility, setRevokeTOTPAuthnModalVisibility ] = useState(false);
    const [ isInitFlow, setIsInitFlow ] = useState<boolean>(false);
    const [ totpToggle, setTotpToggle ] = useState<boolean>(false);
    const [ showBackupCodeWizard, setShowBackupCodeWizard ] = useState<boolean>(false); 
    const { t } = useTranslation();

    const enableMFAUserWise: boolean = useSelector((state: AppState) => state?.config?.ui?.enableMFAUserWise);
    const totpConfig = useSelector((state: AppState) => state?.config?.ui?.authenticatorApp);

    const translateKey = "myAccount:components.mfa.authenticatorApp.";
    const backupCodeTranslateKey = "myAccount:components.mfa.backupCode.";
    const backupCodeAuthenticatorName = "Backup Code Authenticator";
    const totpAuthenticatorName = "TOTP";

    const pinCode1 = useRef<HTMLInputElement>();
    const pinCode2 = useRef<HTMLInputElement>();
    const pinCode3 = useRef<HTMLInputElement>();
    const pinCode4 = useRef<HTMLInputElement>();
    const pinCode5 = useRef<HTMLInputElement>();
    const pinCode6 = useRef<HTMLInputElement>();

    /**
     * Reset error and step when the modal is closed
     */
    useEffect(() => {
        if (!openWizard) {
            setError(false);
            setStep(0);
        }
    }, [ openWizard ]);

    useEffect(()=>{
        if (enableMFAUserWise && isSuperTenantLogin) {
            setToggleTOTPState();
        }
    },[]);

    /**
     * Makes an API call to verify the code entered by the user
     * @param code The code entered by the user
     */
    const verifyCode = (code: string) => {
        validateTOTPCode(code).then((response) => {
            if (response.data.isValid) {
                setStep(1);
            } else {
                setError(true);
                resetValues();
            }
        }).catch(() => {
            setError(true);
            resetValues();
        });
    };

    useEffect(() => {
        checkIfTOTPEnabled().then((response) => {
            setIsTOTPConfigured(response);
        });
    }, [ ]);

    /**
     * Reset pin code value in Error state
     */
    const resetValues = () => {
        pinCode1.current.value = "";
        pinCode2.current.value = "";
        pinCode3.current.value = "";
        pinCode4.current.value = "";
        pinCode5.current.value = "";
        pinCode6.current.value = "";
        pinCode1.current.focus();
    };

    /**
     * Update enabled authenticator list based on the update action.
     * @param action The update action.
    */
    const enabledAuthenticatorsUpdateHandler = (action: EnabledAuthenticatorUpdateAction): void => {

        getEnabledAuthenticators()
            .then((authenticators: EnabledAuthenticatorsInterface) => {
                let authenticatorList: Array<string>;

                if (authenticators.enabledAuthenticators !== undefined) {
                    authenticatorList = authenticators.enabledAuthenticators.split(",");
                } else {
                    authenticatorList = [];
                }

                switch(action) {
                    case EnabledAuthenticatorUpdateAction.INIT_TOTP : {
                        if (!authenticatorList.includes(totpAuthenticatorName)) {
                            authenticatorList.push(totpAuthenticatorName);
                        }
                        if (isBackupCodeForced) {
                            if (!authenticatorList.includes(backupCodeAuthenticatorName)) {
                                authenticatorList.push(backupCodeAuthenticatorName);
                            }
                        }

                        break;
                    }
                    case EnabledAuthenticatorUpdateAction.DELETE_TOTP : {

                        if (authenticatorList.includes(totpAuthenticatorName)) {
                            authenticatorList.splice(authenticatorList.indexOf(totpAuthenticatorName), 1);
                        }

                        break;
                    }
                    case EnabledAuthenticatorUpdateAction.TOTP_TOGGLE_DISABLE: {
                        if (authenticatorList.includes(totpAuthenticatorName)) {
                            authenticatorList.splice(authenticatorList.indexOf(totpAuthenticatorName), 1);
                        }

                        break;
                    }
                    case EnabledAuthenticatorUpdateAction.TOTP_TOGGLE_ENABLE: {
                        if (!authenticatorList.includes(totpAuthenticatorName)) {
                            authenticatorList.push(totpAuthenticatorName);
                        }
                        // Enable backup authenticator.
                        if (isBackupCodeForced) {
                            if (!authenticatorList.includes(backupCodeAuthenticatorName)) {
                                authenticatorList.push(backupCodeAuthenticatorName);
                            }
                        }

                        break;
                    }
                }

                // Update authenticator list.
                updateEnabledAuthenticators(authenticatorList.join(","))
                    .then(() => {
                        switch(action) {
                            case EnabledAuthenticatorUpdateAction.INIT_TOTP: {
                                setTotpToggle(true);
                                if (isBackupCodeForced) {
                                    onBackupCodeAvailabilityToggle(true);
                                }

                                break;
                            }
                            case EnabledAuthenticatorUpdateAction.DELETE_TOTP: {
                                if (isBackupCodeForced) {
                                    onBackupCodeAvailabilityToggle(false);
                                }

                                break;
                            }

                            case EnabledAuthenticatorUpdateAction.TOTP_TOGGLE_DISABLE: {
                                setTotpToggle(false);
                                if (isBackupCodeForced) {
                                    onBackupCodeAvailabilityToggle(false);
                                }

                                break;
                            }
                            case EnabledAuthenticatorUpdateAction.TOTP_TOGGLE_ENABLE: {
                                setTotpToggle(true);
                                if (isBackupCodeForced) {
                                    onBackupCodeAvailabilityToggle(true);
                                }

                                break;
                            }
                        }
                    })
                    .catch((errorMessage => {
                        onAlertFired({
                            description: t(backupCodeTranslateKey + 
                            "notifications.updateAuthenticatorError.error.description", {
                                error: errorMessage
                            }),
                            level: AlertLevels.ERROR,
                            message: t(backupCodeTranslateKey + "notifications.updateAuthenticatorError.error.message")
                        });
                    }));
            })
            .catch((errorMessage) => {
                onAlertFired({
                    description: t(backupCodeTranslateKey + 
                    "notifications.retrieveAuthenticatorError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(backupCodeTranslateKey + "notifications.retrieveAuthenticatorError.error.message")
                });
            });
    };

    /**
     * Initiates the TOTP flow by getting QR code URL
     */
    const initTOTPFlow = (isInitializeFlow: boolean) => {
        setStep(0);
        setIsInitFlow(isInitializeFlow);
        initTOTPCode().then((response) => {
            const qrCodeUrl = window.atob(response.data.qrCodeUrl);

            setQrCode(qrCodeUrl);
            setOpenWizard(true);
            if ((totpToggle || isInitializeFlow)
                  && enableMFAUserWise && isSuperTenantLogin) {
                enabledAuthenticatorsUpdateHandler(EnabledAuthenticatorUpdateAction.INIT_TOTP);
            }  
        }).catch((errorMessage) => {
            onAlertFired({
                description: t(translateKey + "notifications.initError.error.description", {
                    error: errorMessage
                }),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.initError.error.message")
            });
        });
    };

    /**
     * Set initial TOTP toggle state.
     */
    const setToggleTOTPState = (): void => {
        dispatch(getProfileInformation(true));
        getEnabledAuthenticators()
            .then((authenticators: EnabledAuthenticatorsInterface) => {
                let authenticatorList: Array<string>;

                if (authenticators.enabledAuthenticators !== undefined) {
                    authenticatorList = authenticators.enabledAuthenticators.split(",");
                } else {
                    authenticatorList = [];
                }
                if (authenticatorList.includes(totpAuthenticatorName)) {
                    setTotpToggle(true);
                } else {
                    setTotpToggle(false);
                }
                if (isBackupCodeForced && authenticatorList.includes(backupCodeAuthenticatorName)) {
                    onBackupCodeAvailabilityToggle(true);
                } else {
                    onBackupCodeAvailabilityToggle(false);
                }
            })
            .catch((errorMessage) => {
                onAlertFired({
                    description: t(backupCodeTranslateKey + 
                        "notifications.retrieveAuthenticatorError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(backupCodeTranslateKey + "notifications.retrieveAuthenticatorError.error.message")
                });
            });
    };

    /**
     * Toggle TOTP.
     */
    const toggleTOTP = (): void => {
        
        dispatch(getProfileInformation(true));
        if (totpToggle) {
            enabledAuthenticatorsUpdateHandler(EnabledAuthenticatorUpdateAction.TOTP_TOGGLE_DISABLE);
        } else {
            enabledAuthenticatorsUpdateHandler(EnabledAuthenticatorUpdateAction.TOTP_TOGGLE_ENABLE);
        }
    };

    /**
    * Initialize backup codes
    */
    const initBackupFlow = (): void => {
        setShowBackupCodeWizard(true);
        setOpenWizard(true);
    };

    /**
     *  Initiate deletion of TOTP configuration.
     */
    const initDeleteTOTP = (): void => {
        deleteTOTP().then(() => {
            setIsTOTPConfigured(false);
            if (enableMFAUserWise && isSuperTenantLogin) {
                enabledAuthenticatorsUpdateHandler(EnabledAuthenticatorUpdateAction.DELETE_TOTP);
            }

            return;
        }).catch((errorMessage) => {
            onAlertFired({
                description: t(translateKey + "notifications.deleteError.error.description", {
                    error: errorMessage
                }),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.deleteError.error.message")
            });
        }).finally(() => {
            setRevokeTOTPAuthnModalVisibility(false);
        });
    };

    /**
     * Refreshes the QR code
     */
    const refreshCode = (): void => {
        refreshTOTPCode().then((response) => {
            const qrCodeUrl = window.atob(response.data.qrCodeUrl);

            setQrCode(qrCodeUrl);
        }).catch((errorMessage) => {
            onAlertFired({
                description: t(translateKey + "notifications.initError.error.description", {
                    error: errorMessage
                }),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.initError.error.message")
            });
        });
    };

    const handleTOTPVerificationCodeSubmit = (event: React.FormEvent<HTMLFormElement> ):
        void =>{
        let verificationCode =  event.target[0].value;

        for (let pinCodeIndex = 1;pinCodeIndex<6;pinCodeIndex++){
            verificationCode = verificationCode + event.target[pinCodeIndex].value;
        }
        verifyCode(verificationCode);
    };

    /**
     * Focus to next pin code after enter a value.
     *
     * @param {string} field The name of the field.
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
     *
     * @param {string} field The name of the field.
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
     * This renders the QR code page
     */
    const renderQRCode = (step: number): JSX.Element => {
        return (
            <Segment basic >
                { !isTOTPConfigured
                    ?
                    (<Grid>
                        <Grid.Row columns={ 1 } centered={ true }>
                            <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 12 } >
                                <Message info>
                                    { t(translateKey+ "modals.scan.additionNote") }
                                </Message>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>)
                    : null
                }
                <h5 className=" text-center" > { t(translateKey + "modals.scan.heading") }</h5>
                <Segment textAlign="center" basic className="qr-code">
                    <QRCode value={ qrCode } data-testid={ `${ testId }-modals-scan-qrcode` }/>
                    <Divider hidden />
                    <p
                        className="link"
                        onClick={ refreshCode } 
                        data-testid={ `${ testId }-modals-scan-generate` }>
                        { t(translateKey + "modals.scan.generate") }
                    </p>
                </Segment>
                { totpConfig?.length > 0
                    ? (
                        <Message info>
                            <Message.Header>{ t(translateKey + "modals.scan.messageHeading") }</Message.Header>
                            <Message.Content>
                                { t(translateKey + "modals.scan.messageBody") + " " }
                                <List bulleted>
                                    { totpConfig?.map((app, index) => (
                                        <List.Item key={ index } >
                                            <a
                                                target="_blank"
                                                href={ app.link }
                                                rel="noopener noreferrer"
                                            >
                                                { app.name }
                                            </a>
                                        </List.Item>
                                    )) }
                                </List>
                            </Message.Content>
                        </Message>
                    )
                    : null }
                <h5 className=" text-center" > { t(translateKey + "modals.verify.heading") }</h5>

                <Segment basic className="pl-0">
                    {
                        error
                            ? (
                                <Message 
                                    className="totp-error-message" 
                                    data-testid={ `${ testId }-code-verification-form-field-error` }>
                                    { t(translateKey + "modals.verify.error") }
                                </Message>
                            )
                            : null
                    }
                    <Form
                        onSubmit={ (event: React.FormEvent<HTMLFormElement>): void => {
                            handleTOTPVerificationCodeSubmit(event);
                        } }>
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
                                                { stepButtonText(step) }
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </div>
                                <div className = "totp-verify-step-btn">
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            < Button
                                                onClick={ () => {
                                                    setOpenWizard(false);
                                                    setIsTOTPConfigured(true);
                                                    if (isBackupCodeForced && isInitFlow && isSuperTenantLogin) {
                                                        initBackupFlow();
                                                    }
                                                        
                                                } }
                                                className="link-button totp-verify-action-button"
                                                data-testid={ `${ testId }-modal-actions-cancel-button` }>
                                                { t("common:cancel") }
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </div>
                            </Grid>
                        </Container>
                    </Form>
                </Segment>
            </Segment>
        );
    };

    /**
     * This renders the success message at the end of the TOTP flow
     */
    const renderSuccess = (): JSX.Element => {
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
     * Generates content based on the input step
     * @param stepToDisplay The step number
     */
    const stepContent = (stepToDisplay: number): JSX.Element => {
        switch (stepToDisplay) {
            case 0:
                return renderQRCode(stepToDisplay);
            case 1:
                return renderSuccess();
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
     * Handle the revoke TOTP Configuration modal close event.
     */
    const handleRevokeTOTPAuthnClick = (): void => {
        setRevokeTOTPAuthnModalVisibility(true);
    };
    
    /**
     * Handle the revoke TOTP Configuration modal close event.
     */
    const handleRevokeTOTPAuthnModalClose = (): void => {
        setRevokeTOTPAuthnModalVisibility(false);
    };

    /**
     * This renders the TOTP Authenticator delete Modal
     */
    const revokeTOTPAuthnModal = (
        <Modal
            data-testid={ `${testId}-termination-modal` }
            size="mini"
            open={ revokeTOTPAuthnModalVisibility }
            onClose={ handleRevokeTOTPAuthnModalClose }
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
                    onClick={ handleRevokeTOTPAuthnModalClose }
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

    /**
     * This render the backup code wizard.
     */
    const backupWizard = (): JSX.Element => {
        
        return (<BackupCodeAuthenticator 
            onAlertFired={ onAlertFired } 
            isInit={ isInitFlow } 
            openWizard={ openWizard } 
            onOpenWizardToggle={ (isOpen : boolean) => {setOpenWizard(isOpen); } } 
            onShowBackupCodeWizardToggle={ (show : boolean) => {setShowBackupCodeWizard(show); } }
            backupCodes = { backupCodes }
            updateBackupCodes = { (backupCodeList: Array<string>) => {updateBackupCodes(backupCodeList);} }
        />);
    };

    /**
     * This renders the TOTP wizard
     */
    const totpWizard = (): JSX.Element => {
        return (
            <Modal
                data-testid={ `${ testId }-modal` }
                dimmer="blurring"
                size="tiny"
                open={ openWizard }
                onClose={ () => { setOpenWizard(false); setIsTOTPConfigured(true); } }
                className="totp"
                closeOnDimmerClick={ false }
            >
                {
                    step !== 3
                        ? (
                            <Modal.Header className="wizard-header text-center">
                                { t(translateKey + "modals.heading") }
                            </Modal.Header>
                        )
                        : null
                }
                <Modal.Content data-testid={ `${ testId }-modal-content` } scrolling>
                    { stepContent(step) }
                </Modal.Content>
                <Modal.Actions data-testid={ `${ testId }-modal-actions` } className ="actions">
                    {
                        step === 0
                            ? (
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
                            ) : (  
                                <Button
                                    primary
                                    className = "totp-verify-done-button"
                                    data-testid={ `${ testId }-modal-actions-primary-button` }
                                    onClick= { () => {
                                        setOpenWizard(false);
                                        setIsTOTPConfigured(true);
                                        if (isBackupCodeForced && isInitFlow && isSuperTenantLogin) {
                                            initBackupFlow();
                                        }
                                    } }
                                >
                                    { stepButtonText(step) }
                                </Button>
                            ) }
                </Modal.Actions>
            </Modal>
        );
    };

    return (
        (!isTOTPConfigured
            ?
            (<>
                { totpWizard() }
                { showBackupCodeWizard ? () =>{ backupWizard(); setShowBackupCodeWizard(false); } : null }
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
                                <List.Header>
                                    { t(translateKey + "heading") }
                                </List.Header>
                                <List.Description>
                                    { t(translateKey + "description") }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 3 } className="last-column">
                            <List.Content floated="right">
                                <Popup
                                    trigger={
                                        (
                                            <Icon
                                                link={ true }
                                                onClick={ ()=>{ initTOTPFlow(true); } }
                                                className="list-icon padded-icon"
                                                size="small"
                                                color="grey"
                                                name="plus"
                                                data-testid={ `${testId}-view-button` }
                                            />
                                        )
                                    }
                                    content={ t(translateKey + "addHint") }
                                    inverted
                                />
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>)
            :
            (<>
                { revokeTOTPAuthnModal }
                { totpWizard() }
                { showBackupCodeWizard ? backupWizard() : null }
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
                                    { t(translateKey + "configuredDescription") }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        { (isSuperTenantLogin && enableMFAUserWise) ? (
                            <Grid.Column width={ 1 } floated="right">
                                <List.Content floated="right">
                                    <Popup
                                        trigger={
                                            (
                                                <Checkbox
                                                    toggle
                                                    data-testid={ `${testId}-conditional-auth` }
                                                    onChange={ toggleTOTP }
                                                    checked={ totpToggle }
                                                    className="conditional-auth-accordion-toggle"
                                                />
                                            )
                                        }
                                        inverted
                                        content={ t(translateKey + "enableHint") }
                                    />
                                </List.Content>
                            </Grid.Column>
                        ): null } 
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
                                                onClick={ () => {
                                                    handleRevokeTOTPAuthnClick();
                                                } }
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
                                />
                                <Popup
                                    trigger={
                                        (
                                            <Icon
                                                link={ true }
                                                onClick={ () => { initTOTPFlow(false); } }
                                                className="list-icon padded-icon"
                                                size="small"
                                                color="grey"
                                                name="eye"
                                                data-testid={ `${testId}-view-button` }
                                            />
                                        )
                                    }
                                    content={ t(translateKey + "hint") }
                                    inverted
                                />
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>)
        )
    );
};

/**
 * Default properties for {@link TOTPAuthenticator}
 * See type definitions in {@link TOTPProps}
 */
TOTPAuthenticator.defaultProps = {
    "data-testid": "totp-authenticator"
};
