/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { NotificationItem } from "../common";

export interface governanceConnectorsNS {
    dangerZone: {
        actionTitle: string;
        heading: string;
        subHeading: string;
    };
    notifications: {
        getConnectorCategories: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getConnector: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateConnector: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        revertConnector: {
            error: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
    };
    form: {
        errors: {
            positiveIntegers: string;
            format: string;
        };
    };
    goBackLoginAndRegistration: string;
    enabled: string;
    disabled: string;
    categories: string;
    pageSubHeading: string;
    connectorSubHeading: string;
    genericDescription: string;
    connectorCategories: {
        passwordPolicies: {
            name: string;
            description: string;
            connectors: {
                passwordExpiry: {
                    friendlyName: string;
                };
                passwordHistory: {
                    friendlyName: string;
                    properties: {
                        passwordHistoryEnable: {
                            hint: string;
                            label: string;
                        };
                        passwordHistoryCount: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                passwordPolicy: {
                    friendlyName: string;
                    properties: {
                        passwordPolicyEnable: {
                            hint: string;
                            label: string;
                        };
                        passwordPolicyMinLength: {
                            hint: string;
                            label: string;
                        };
                        passwordPolicyMaxLength: {
                            hint: string;
                            label: string;
                        };
                        passwordPolicyPattern: {
                            hint: string;
                            label: string;
                        };
                        passwordPolicyErrorMsg: {
                            hint: string;
                            label: string;
                        };
                    };
                };
            };
        };
        userOnboarding: {
            name: string;
            description: string;
            connectors: {
                askPassword: {
                    friendlyName: string;
                };
                selfSignUp: {
                    friendlyName: string;
                    properties: {
                        selfRegistrationEnable: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationLockOnCreation: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationSendConfirmationOnCreation: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationNotificationInternallyManage: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationReCaptcha: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationVerificationCodeExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationVerificationCodeSmsotpExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationSmsotpRegex: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationCallbackRegex: {
                            hint: string;
                            label: string;
                        };
                        urlListPurposeSelfSignUp: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationNotifyAccountConfirmation: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationResendConfirmationReCaptcha: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationAutoLoginEnable: {
                            hint: string;
                            label: string;
                        };
                        selfRegistrationAutoLoginAliasName: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                liteUserSignUp: {
                    friendlyName: string;
                    properties: {
                        liteRegistrationEnable: {
                            hint: string;
                            label: string;
                        };
                        liteRegistrationLockOnCreation: {
                            hint: string;
                            label: string;
                        };
                        liteRegistrationNotificationInternallyManage: {
                            hint: string;
                            label: string;
                        };
                        liteRegistrationReCaptcha: {
                            hint: string;
                            label: string;
                        };
                        liteRegistrationVerificationCodeExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        liteRegistrationVerificationCodeSmsotpExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        liteRegistrationSmsotpRegex: {
                            hint: string;
                            label: string;
                        };
                        liteRegistrationCallbackRegex: {
                            hint: string;
                            label: string;
                        };
                        urlListPurposeLiteUserSignUp: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                userEmailVerification: {
                    friendlyName: string;
                    properties: {
                        emailVerificationEnable: {
                            hint: string;
                            label: string;
                        };
                        emailVerificationLockOnCreation: {
                            hint: string;
                            label: string;
                        };
                        emailVerificationNotificationInternallyManage: {
                            hint: string;
                            label: string;
                        };
                        emailVerificationExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        emailVerificationAskPasswordExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        emailVerificationAskPasswordPasswordGenerator: {
                            hint: string;
                            label: string;
                        };
                        urlListPurposeJitProvisioning: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                registrationFlowBuilder: {
                    friendlyName: string;
                    description: string;
                }
            };
        };
        loginAttemptsSecurity: {
            name: string;
            description: string;
            connectors: {
                accountLockHandler: {
                    friendlyName: string;
                    properties: {
                        accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                            hint: string;
                            label: string;
                        };
                        accountLockHandlerOnFailureMaxAttempts: {
                            hint: string;
                            label: string;
                        };
                        accountLockHandlerTime: {
                            hint: string;
                            label: string;
                        };
                        accountLockHandlerLoginFailTimeoutRatio: {
                            hint: string;
                            label: string;
                        };
                        accountLockHandlerNotificationManageInternally: {
                            hint: string;
                            label: string;
                        };
                        accountLockHandlerNotificationNotifyOnLockIncrement: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                ssoLoginRecaptcha: {
                    friendlyName: string;
                    properties: {
                        ssoLoginRecaptchaEnableAlways: {
                            hint: string;
                            label: string;
                        };
                        ssoLoginRecaptchaEnable: {
                            hint: string;
                            label: string;
                        };
                        ssoLoginRecaptchaOnMaxFailedAttempts: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                siftConnector: {
                    properties: {
                        name: string;
                        description: string;
                        siftConnectorApiKey: {
                            label: string;
                            placeholder: string;
                        };
                    };
                    notifications: {
                        configurationUpdate: {
                            success: NotificationItem;
                            error: NotificationItem;
                        };
                    };
                };
            };
        };
        accountManagement: {
            name: string;
            description: string;
            connectors: {
                suspensionNotification: {
                    friendlyName: string;
                    properties: {
                        suspensionNotificationEnable: {
                            hint: string;
                            label: string;
                        };
                        suspensionNotificationAccountDisableDelay: {
                            hint: string;
                            label: string;
                        };
                        suspensionNotificationDelays: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                accountDisableHandler: {
                    friendlyName: string;
                    description: string;
                    properties: {
                        accountDisableHandlerEnable: {
                            hint: string;
                            label: string;
                        };
                        accountDisableHandlerNotificationManageInternally: {
                            hint: string;
                            label: string;
                        };
                    };
                    notifications: {
                        configurationUpdate: {
                            success: NotificationItem;
                            error: NotificationItem;
                        };
                        revertConfiguration: {
                            success: {
                                description: string;
                                message: string;
                            };
                            error: {
                                description: string;
                                message: string;
                            };
                        };
                    };
                };
                multiattributeLoginHandler: {
                    friendlyName: string;
                    properties: {
                        accountMultiattributeloginHandlerEnable: {
                            hint: string;
                            label: string;
                        };
                        accountMultiattributeloginHandlerAllowedattributes: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                accountRecovery: {
                    friendlyName: string;
                    properties: {
                        recoveryNotificationPasswordEnable: {
                            label: string;
                        };
                        recoveryReCaptchaPasswordEnable: {
                            label: string;
                        };
                        recoveryQuestionPasswordEnable: {
                            label: string;
                        };
                        recoveryQuestionPasswordMinAnswers: {
                            label: string;
                        };
                        recoveryQuestionAnswerRegex: {
                            hint: string;
                            label: string;
                        };
                        recoveryQuestionAnswerUniqueness: {
                            hint: string;
                            label: string;
                        };
                        recoveryQuestionPasswordReCaptchaEnable: {
                            hint: string;
                            label: string;
                        };
                        recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                            label: string;
                        };
                        recoveryNotificationUsernameEnable: {
                            label: string;
                        };
                        recoveryReCaptchaUsernameEnable: {
                            label: string;
                        };
                        recoveryNotificationInternallyManage: {
                            hint: string;
                            label: string;
                        };
                        recoveryNotifySuccess: {
                            label: string;
                        };
                        recoveryQuestionPasswordNotifyStart: {
                            label: string;
                        };
                        recoveryExpiryTime: {
                            label: string;
                        };
                        recoveryNotificationPasswordExpiryTimeSmsOtp: {
                            hint: string;
                            label: string;
                        };
                        recoveryNotificationPasswordSmsOtpRegex: {
                            hint: string;
                            label: string;
                        };
                        recoveryQuestionPasswordForcedEnable: {
                            hint: string;
                            label: string;
                        };
                        recoveryQuestionMinQuestionsToAnswer: {
                            hint: string;
                            label: string;
                        };
                        recoveryCallbackRegex: {
                            hint: string;
                            label: string;
                        };
                        recoveryAutoLoginEnable: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                adminForcedPasswordReset: {
                    friendlyName: string;
                    properties: {
                        recoveryAdminPasswordResetRecoveryLink: {
                            hint: string;
                            label: string;
                        };
                        recoveryAdminPasswordResetOtp: {
                            hint: string;
                            label: string;
                        };
                        recoveryAdminPasswordResetOffline: {
                            hint: string;
                            label: string;
                        };
                        recoveryAdminPasswordResetExpiryTime: {
                            hint: string;
                            label: string;
                        };
                    };
                };
            };
        };
        otherSettings: {
            name: string;
            description: string;
            connectors: {
                piiController: {
                    friendlyName: string;
                    properties: {
                        piiController: {
                            hint: string;
                            label: string;
                        };
                        contact: {
                            hint: string;
                            label: string;
                        };
                        email: {
                            hint: string;
                            label: string;
                        };
                        phone: {
                            hint: string;
                            label: string;
                        };
                        onBehalf: {
                            hint: string;
                            label: string;
                        };
                        piiControllerUrl: {
                            hint: string;
                            label: string;
                        };
                        addressCountry: {
                            hint: string;
                            label: string;
                        };
                        addressLocality: {
                            hint: string;
                            label: string;
                        };
                        addressRegion: {
                            hint: string;
                            label: string;
                        };
                        postOfficeBoxNumber: {
                            hint: string;
                            label: string;
                        };
                        postalCode: {
                            hint: string;
                            label: string;
                        };
                        streetAddress: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                analyticsEngine: {
                    friendlyName: string;
                    messages: {
                        deprecation: {
                            description: string;
                            heading: string;
                        };
                    };
                    properties: {
                        adaptiveAuthenticationAnalyticsReceiver: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                            hint: string;
                            label: string;
                        };
                        secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationAnalyticsHostnameVerfier: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                elasticAnalyticsEngine: {
                    friendlyName: string;
                    warningModal: {
                        configure: string;
                        reassure: string;
                    };
                    properties: {
                        adaptiveAuthenticationElasticReceiver: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationElasticBasicAuthEnabled: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationElasticBasicAuthUsername: {
                            hint: string;
                            label: string;
                        };
                        secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationElasticHttpConnectionTimeout: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationElasticHttpReadTimeout: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                            hint: string;
                            label: string;
                        };
                        adaptiveAuthenticationElasticHostnameVerfier: {
                            hint: string;
                            label: string;
                        };
                    };
                };
                userClaimUpdate: {
                    friendlyName: string;
                    subTitle: string;
                    update: {
                        error: {
                            description: string;
                            message: string;
                        },
                        genericError: {
                            description: string;
                            message: string;
                        },
                        success: {
                            description: string;
                            message: string;
                        }
                    },
                    subHeadings: {
                        emailConfiguration: string;
                        mobileConfiguration: string;
                    },
                    properties: {
                        userClaimUpdateEmailEnableVerification: {
                            hint: string;
                            label: string;
                        };
                        userClaimUpdateEmailVerificationCodeExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        userClaimUpdateEmailEnableNotification: {
                            hint: string;
                            label: string;
                        };
                        userClaimUpdateMobileNumberEnableVerification: {
                            hint: string;
                            label: string;
                        };
                        userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                            hint: string;
                            label: string;
                        };
                        userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                            hint: string;
                            label: string;
                        };
                    };
                };
            };
        };
        multiFactorAuthenticators: {
            name: string;
            friendlyName: string;
            description: string;
            connectors: {
                backupCodeAuthenticator: {
                    friendlyName: string;
                    properties: {
                        backupCodeBackupCodeLength: {
                            hint: string;
                            label: string;
                        };
                        backupCodeBackupCodeSize: {
                            hint: string;
                            label: string;
                        };
                    };
                };
            };
        };
        sessionManagement: {
            description: string;
        };
        saml2WebSsoConfiguration: {
            description: string;
        };
        wsFederationConfiguration: {
            description: string;
        };
        internalNotificationSending: {
            categoryTitle: string;
            connector: {
                title: string;
                description: string;
            }
        }
    };
}
