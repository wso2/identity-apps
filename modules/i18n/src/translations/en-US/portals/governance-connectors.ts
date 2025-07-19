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

import { governanceConnectorsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const governanceConnectors: governanceConnectorsNS = {
    goBackLoginAndRegistration: "Go back to login & registration",
    categories: "Categories",
    connectorSubHeading: "Configure {{ name }} settings.",
    connectorCategories: {
        passwordPolicies : {
            name: "Password Policies",
            description: "Configure password policies to enhance user password strength.",
            connectors: {
                passwordExpiry: {
                    friendlyName: "Password Expiry"
                },
                passwordHistory: {
                    friendlyName: "Password History",
                    properties: {
                        passwordHistoryEnable: {
                            hint: "User will not be allowed to use previously used passwords.",
                            label: "Validate password history"
                        },
                        passwordHistoryCount: {
                            hint: "Restrict using this number of last used passwords during password update.",
                            label: "Password history validation count"
                        }
                    }
                },
                passwordPolicy: {
                    friendlyName: "Password Patterns",
                    properties: {
                        passwordPolicyEnable: {
                            hint: "Validate user passwords against a policy",
                            label: "Validate passwords based on a policy pattern"
                        },
                        passwordPolicyMinLength: {
                            hint: "Minimum number of characters in the password.",
                            label: "Minimum number of characters"
                        },
                        passwordPolicyMaxLength: {
                            hint: "Maximum number of characters in the password.",
                            label: "Maximum number of characters"
                        },
                        passwordPolicyPattern: {
                            hint: "The regular expression pattern to validate the password.",
                            label: "Password pattern regex"
                        },
                        passwordPolicyErrorMsg: {
                            hint: "This error message will be displayed when a pattern violation is detected.",
                            label: "Error message on pattern violation"
                        }
                    }
                }
            }
        },
        userOnboarding : {
            name: "User Onboarding",
            description: "Configure user onboarding settings.",
            connectors: {
                askPassword: {
                    friendlyName: "Invite user to set the password"
                },
                selfSignUp: {
                    friendlyName: "Self Registration",
                    properties: {
                        selfRegistrationEnable: {
                            hint: "Allow user's to self register to the system.",
                            label: "User self registration"
                        },
                        selfRegistrationLockOnCreation: {
                            hint: "Lock self registered user account until e-mail verification.",
                            label: "Lock user account on creation"
                        },
                        selfRegistrationSendConfirmationOnCreation: {
                            hint: "Enable user account confirmation when the user account is not locked on creation",
                            label: "Enable Account Confirmation On Creation"
                        },
                        selfRegistrationNotificationInternallyManage: {
                            hint: "Disable if the client application handles notification sending",
                            label: "Manage notifications sending internally"
                        },
                        selfRegistrationReCaptcha: {
                            hint: "Enable reCaptcha verification during self registration.",
                            label: "Prompt reCaptcha"
                        },
                        selfRegistrationVerificationCodeExpiryTime: {
                            hint: "Specify the expiry time in minutes for the verification link.",
                            label: "User self registration verification link expiry time"
                        },
                        selfRegistrationVerificationCodeSmsotpExpiryTime: {
                            hint: "Specify the expiry time in minutes for the SMS OTP.",
                            label: "User self registration SMS OTP expiry time"
                        },
                        selfRegistrationSmsotpRegex: {
                            hint: "Regex for SMS OTP in format [allowed characters]{length}. Supported character ranges are a-z, A-Z, 0-9. Minimum OTP length is 4",
                            label: "User self registration SMS OTP regex"
                        },
                        selfRegistrationCallbackRegex: {
                            hint: "This prefix will be used to validate the callback URL.",
                            label: "User self registration callback URL regex"
                        },
                        urlListPurposeSelfSignUp: {
                            hint: "Click here to manage Self-Sign-Up purposes",
                            label: "Manage Self-Sign-Up purposes"
                        },
                        selfRegistrationNotifyAccountConfirmation: {
                            hint: "Enable sending notification for self sign up confirmation.",
                            label: "Send sign up confirmation email"
                        },
                        selfRegistrationResendConfirmationReCaptcha: {
                            hint: "Prompt reCaptcha verification for resend confirmation",
                            label: "Prompt reCaptcha on re-send confirmation"
                        },
                        selfRegistrationAutoLoginEnable: {
                            hint: "User will be logged in automatically after completing the Account Confirmation",
                            label: "Enable Auto Login After Account Confirmation"
                        },
                        selfRegistrationAutoLoginAliasName: {
                            hint: "Alias of the key used to sign to cookie. The public key has to be imported to the keystore.",
                            label: "Alias of the key used to sign to cookie"
                        }
                    }
                },
                liteUserSignUp: {
                    friendlyName: "Lite User Registration",
                    properties: {
                        liteRegistrationEnable: {
                            hint: "Allow user's to self register to the system without a password.",
                            label: "Lite user registration"
                        },
                        liteRegistrationLockOnCreation: {
                            hint: "Lock self registered user account until e-mail verification.",
                            label: "Lock user account on creation"
                        },
                        liteRegistrationNotificationInternallyManage: {
                            hint: "Disable if the client application handles notification sending",
                            label: "Manage notifications sending internally"
                        },
                        liteRegistrationReCaptcha: {
                            hint: "Enable reCaptcha verification during self registration.",
                            label: "Prompt reCaptcha"
                        },
                        liteRegistrationVerificationCodeExpiryTime: {
                            hint: "Specify the expiry time in minutes for the verification link.",
                            label: "Lite user registration verification link expiry time"
                        },
                        liteRegistrationVerificationCodeSmsotpExpiryTime: {
                            hint: "Specify the expiry time in minutes for the SMS OTP.",
                            label: "Lite user registration SMS OTP expiry time"
                        },
                        liteRegistrationSmsotpRegex: {
                            hint: "Regex for SMS OTP in format [allowed characters]{length}. Supported character ranges are a-z, A-Z, 0-9. Minimum OTP length is 4",
                            label: "Lite user registration SMS OTP regex"
                        },
                        liteRegistrationCallbackRegex: {
                            hint: "This prefix will be used to validate the callback URL.",
                            label: "Lite user registration callback URL regex"
                        },
                        urlListPurposeLiteUserSignUp: {
                            hint: "Click here to manage Lite-Sign-Up purposes",
                            label: "Manage Lite-Sign-Up purposes"
                        }
                    }
                },
                userEmailVerification: {
                    friendlyName: "Ask Password",
                    properties: {
                        emailVerificationEnable: {
                            hint: "An email will be sent to the user to set the password after user creation.",
                            label: "Enable email invitations for user password setup"
                        },
                        emailVerificationLockOnCreation: {
                            hint: "The user account will be locked during user creation.",
                            label: "Enable account lock on creation"
                        },
                        emailVerificationNotificationInternallyManage: {
                            hint: "Disable if the client application handles notification sending.",
                            label: "Manage notifications sending internally"
                        },
                        emailVerificationExpiryTime: {
                            hint: "Set the time span that the verification e-mail would be valid, in minutes. (For infinite validity period, set -1)",
                            label: "Email verification code expiry time"
                        },
                        emailVerificationAskPasswordExpiryTime: {
                            hint: "Set the time span that the ask password e-mail would be valid, in minutes. (For infinite validity period, set -1)",
                            label: "Ask password code expiry time"
                        },
                        emailVerificationAskPasswordPasswordGenerator: {
                            hint: "Temporary password generation extension point in ask password feature.",
                            label: "Temporary password generation extension class"
                        },
                        urlListPurposeJitProvisioning: {
                            hint: "Click here to manage just in time provisioning purposes.",
                            label: "Manage JIT provisioning purposes"
                        }
                    }
                },
                registrationFlowBuilder: {
                    friendlyName: "Registration Flow",
                    description: "Design and customize the user registration journey with a flexible, no-code " +
                        "flow builder."
                }
            }
        },
        loginAttemptsSecurity : {
            name: "Login Attempts Security",
            description: "Configure login attempt security settings.",
            connectors: {
                accountLockHandler: {
                    friendlyName: "Account Lock",
                    properties: {
                        accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                            hint: "Lock user accounts on failed login attempts",
                            label: "Lock user accounts on maximum failed attempts"
                        },
                        accountLockHandlerOnFailureMaxAttempts: {
                            hint: "Number of failed login attempts allowed until account lock.",
                            label: "Maximum failed login attempts"
                        },
                        accountLockHandlerTime: {
                            hint: "Initial account lock time period in minutes. Account will be automatically unlocked after this time period.",
                            label: "Initial account lock duration"
                        },
                        accountLockHandlerLoginFailTimeoutRatio: {
                            hint: "Account lock duration will be increased by this factor. Ex: Initial duration: 5m; Increment factor: 2; Next lock duration: 5 x 2 = 10m",
                            label: "Account lock duration increment factor"
                        },
                        accountLockHandlerNotificationManageInternally: {
                            hint: "Disable if the client application handles notification sending",
                            label: "Manage notification sending internally"
                        },
                        accountLockHandlerNotificationNotifyOnLockIncrement: {
                            hint: "Notify user when the account lock duration is increased due to continuous failed login attempts.",
                            label: "Notify user when lock time is increased"
                        }
                    }
                },
                ssoLoginRecaptcha: {
                    friendlyName: "reCaptcha for SSO Login",
                    properties: {
                        ssoLoginRecaptchaEnableAlways: {
                            hint: "Always prompt reCaptcha verification during SSO login flow.",
                            label: "Always prompt reCaptcha"
                        },
                        ssoLoginRecaptchaEnable: {
                            hint: "Prompt reCaptcha verification during SSO login flow only after the max failed attempts exceeded.",
                            label: "Prompt reCaptcha after max failed attempts"
                        },
                        ssoLoginRecaptchaOnMaxFailedAttempts: {
                            hint: "Number of failed attempts allowed without prompting reCaptcha verification.",
                            label: "Max failed attempts for reCaptcha"
                        }
                    }
                },
                siftConnector: {
                    properties: {
                        name: "Fraud Detection",
                        description: "Integrate Sift to detect and prevent fraudulent account logins.",
                        siftConnectorApiKey: {
                            label: "Sift API Key",
                            placeholder: "Enter Sift API Key"
                        }
                    },
                    notifications: {
                        configurationUpdate: {
                            error: {
                                description: "An error occurred while updating the Sift configuration.",
                                message: "Update Error"
                            },
                            success: {
                                description: "Successfully updated the Sift configuration.",
                                message: "Update Successful"
                            }
                        }
                    }
                }
            }
        },
        accountManagement : {
            name: "Account Management",
            description: "Configure account management settings.",
            connectors: {
                suspensionNotification: {
                    friendlyName: "Idle Account Suspend",
                    properties: {
                        suspensionNotificationEnable: {
                            hint: "Lock user account after a given idle period.",
                            label: "Suspend idle user accounts"
                        },
                        suspensionNotificationAccountDisableDelay: {
                            hint: "Time period in days before locking the user account.",
                            label: "Allowed idle time span in days"
                        },
                        suspensionNotificationDelays: {
                            hint: "Send warning alerts to users before locking the account, after each period. Comma separated multiple values accepted.",
                            label: "Alert sending time periods in days"
                        }
                    }
                },
                accountDisableHandler: {
                    friendlyName: "Account Disable",
                    description: "Configure account disable settings.",
                    properties: {
                        accountDisableHandlerEnable: {
                            hint: "Allow an administrative user to disable user accounts",
                            label: "Enable account disabling"
                        },
                        accountDisableHandlerNotificationManageInternally: {
                            hint: "Disable, if the client application handles notification sending",
                            label: "Manage notification sending internally"
                        }
                    },
                    notifications: {
                        configurationUpdate: {
                            error: {
                                description: "An error occurred while updating the account disable configuration.",
                                message: "Update Error"
                            },
                            success: {
                                description: "Successfully updated the account disable configuration.",
                                message: "Update Successful"
                            }
                        },
                        revertConfiguration: {
                            success: {
                                description: "Successfully reverted the account disable configuration.",
                                message: "Revert Successful"
                            },
                            error: {
                                description: "An error occurred while reverting the account disable configuration.",
                                message: "Revert Error"
                            }
                        }
                    }
                },
                multiattributeLoginHandler: {
                    friendlyName: "Multi Attribute Login",
                    properties: {
                        accountMultiattributeloginHandlerEnable: {
                            hint: "Enable using multiple attributes as login identifier",
                            label: "Enable Multi Attribute Login"
                        },
                        accountMultiattributeloginHandlerAllowedattributes: {
                            hint: "Allowed claim list separated by commas",
                            label: "Allowed Attribute Claim List"
                        }
                    }
                },
                accountRecovery: {
                    friendlyName: "Account Management",
                    properties: {
                        recoveryNotificationPasswordEnable: {
                            label: "Notification based password recovery"
                        },
                        recoveryReCaptchaPasswordEnable: {
                            label: "Enable reCaptcha for password recovery"
                        },
                        recoveryQuestionPasswordEnable: {
                            label: "Security question based password recovery"
                        },
                        recoveryQuestionPasswordMinAnswers: {
                            label: "Number of questions required for password recovery"
                        },
                        recoveryQuestionAnswerRegex: {
                            hint: "Security question answer regex",
                            label: "Security question answer regex"
                        },
                        recoveryQuestionAnswerUniqueness: {
                            hint: "Enforce security question answer uniqueness",
                            label: "Enforce security question answer uniqueness"
                        },
                        recoveryQuestionPasswordReCaptchaEnable: {
                            hint: "Prompt reCaptcha for security question based password recovery",
                            label: "Enable reCaptcha for security questions based password recovery"
                        },
                        recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                            label: "Max failed attempts for reCaptcha"
                        },
                        recoveryNotificationUsernameEnable: {
                            label: "Username recovery"
                        },
                        recoveryReCaptchaUsernameEnable: {
                            label: "Enable reCaptcha for username recovery"
                        },
                        recoveryNotificationInternallyManage: {
                            hint: "Disable if the client application handles notification sending",
                            label: "Manage notifications sending internally"
                        },
                        recoveryNotifySuccess: {
                            label: "Notify when recovery success"
                        },
                        recoveryQuestionPasswordNotifyStart: {
                            label: "Notify when security questions based recovery starts"
                        },
                        recoveryExpiryTime: {
                            label: "Recovery link expiry time in minutes"
                        },
                        recoveryNotificationPasswordExpiryTimeSmsOtp: {
                            hint: "Expiration time of the SMS OTP code for password recovery",
                            label: "SMS OTP expiry time"
                        },
                        recoveryNotificationPasswordSmsOtpRegex: {
                            hint: "Regex for SMS OTP in format [allowed characters]{length}. Supported character ranges are a-z, A-Z, 0-9. Minimum OTP length is 4",
                            label: "SMS OTP regex"
                        },
                        recoveryQuestionPasswordForcedEnable: {
                            hint: "Force users to provide answers to security questions during sign in",
                            label: "Enable forced security questions"
                        },
                        recoveryQuestionMinQuestionsToAnswer: {
                            hint: "Force users to provide answers to security questions during sign in if user has answered lesser than this value",
                            label: "Minimum number of forced security questions to be answered"
                        },
                        recoveryCallbackRegex: {
                            hint: "Recovery callback URL regex",
                            label: "Recovery callback URL regex"
                        },
                        recoveryAutoLoginEnable: {
                            hint: "User will be logged in automatically after completing the Password Reset wizard",
                            label: "Enable Auto Login After Password Reset"
                        }
                    }
                },
                adminForcedPasswordReset: {
                    friendlyName: "Password Reset",
                    properties: {
                        recoveryAdminPasswordResetRecoveryLink: {
                            hint: "User gets notified with a link to reset password",
                            label: "Enable password reset via recovery e-mail"
                        },
                        recoveryAdminPasswordResetOtp: {
                            hint: "User gets notified with a one time password to try with SSO login",
                            label: "Enable password reset via OTP"
                        },
                        recoveryAdminPasswordResetOffline: {
                            hint: "An OTP generated and stored in users claims",
                            label: "Enable password reset offline"
                        },
                        recoveryAdminPasswordResetExpiryTime: {
                            hint: "Validity time of the admin forced password reset code in minutes",
                            label: "Admin forced password reset code expiry time"
                        }
                    }
                }
            }
        },
        otherSettings : {
            name: "Other Settings",
            description: "Configure other settings.",
            connectors: {
                piiController: {
                    friendlyName: "Consent Information Controller",
                    properties: {
                        piiController: {
                            hint: "Name of the first Controller who collects the data",
                            label: "Controller Name"
                        },
                        contact: {
                            hint: "Contact name of the Controller",
                            label: "Contact Name"
                        },
                        email: {
                            hint: "Contact email address of the Controller",
                            label: "Email Address"
                        },
                        phone: {
                            hint: "Contact phone number of the Controller",
                            label: "Phone Number"
                        },
                        onBehalf: {
                            hint: "A user information (PII) Processor acting on behalf of a Controller or PII Processor",
                            label: "On Behalf"
                        },
                        piiControllerUrl: {
                            hint: "A URL for contacting the Controller",
                            label: "Url"
                        },
                        addressCountry: {
                            hint: "Country of the Controller",
                            label: "Country"
                        },
                        addressLocality: {
                            hint: "Locality of the Controller",
                            label: "Locality"
                        },
                        addressRegion: {
                            hint: "Region of the Controller",
                            label: "Region"
                        },
                        postOfficeBoxNumber: {
                            hint: "Post Office Box Number of the Controller",
                            label: "Post Office Box Number"
                        },
                        postalCode: {
                            hint: "Postal Code of the Controller",
                            label: "Postal Code"
                        },
                        streetAddress: {
                            hint: "Street Address of the Controller",
                            label: "Street Address"
                        }
                    }
                },
                analyticsEngine: {
                    friendlyName: "[Deprecated] Identity Server Analytics",
                    messages: {
                        deprecation: {
                            description: "WSO2 Identity Server Analytics is now deprecated. Use <1>ELK Analytics</1> instead.",
                            heading: "Deprecated"
                        }
                    },
                    properties: {
                        adaptiveAuthenticationAnalyticsReceiver: {
                            hint: "Target Host",
                            label: "Target Host"
                        },
                        adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                            hint: "Enable Basic Authentication",
                            label: "Enable Basic Authentication"
                        },
                        adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                            hint: "Target Host Secured User ID",
                            label: "User ID"
                        },
                        secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                            hint: "Target Host Secured Secret",
                            label: "Secret"
                        },
                        adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                            hint: "HTTP Connection Timeout in milliseconds",
                            label: "HTTP Connection Timeout"
                        },
                        adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                            hint: "HTTP Read Timeout in milliseconds",
                            label: "HTTP Read Timeout"
                        },
                        adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                            hint: "HTTP Connection Request Timeout in milliseconds",
                            label: "HTTP Connection Request Timeout"
                        },
                        adaptiveAuthenticationAnalyticsHostnameVerfier: {
                            hint: "Hostname verification. (STRICT, ALLOW_ALL)",
                            label: "Hostname verification"
                        }
                    }
                },
                elasticAnalyticsEngine: {
                    friendlyName: "ELK Analytics",
                    warningModal: {
                        configure: "<1>Configure</1> ELK Analytics settings for proper functionality.",
                        reassure: "You can update your settings anytime."
                    },
                    properties: {
                        adaptiveAuthenticationElasticReceiver: {
                            hint: "Elasticsearch Host",
                            label: "Elasticsearch Host"
                        },
                        adaptiveAuthenticationElasticBasicAuthEnabled: {
                            hint: "Enable Basic Authentication",
                            label: "Enable Basic Authentication"
                        },
                        adaptiveAuthenticationElasticBasicAuthUsername: {
                            hint: "Elasticsearch Username",
                            label: "Elasticsearch Username"
                        },
                        secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                            hint: "Elasticsearch User's Password",
                            label: "Elasticsearch Password"
                        },
                        adaptiveAuthenticationElasticHttpConnectionTimeout: {
                            hint: "HTTP Connection Timeout in milliseconds",
                            label: "HTTP Connection Timeout"
                        },
                        adaptiveAuthenticationElasticHttpReadTimeout: {
                            hint: "HTTP Read Timeout in milliseconds",
                            label: "HTTP Read Timeout"
                        },
                        adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                            hint: "HTTP Connection Request Timeout in milliseconds",
                            label: "HTTP Connection Request Timeout"
                        },
                        adaptiveAuthenticationElasticHostnameVerfier: {
                            hint: "Hostname verification. (STRICT, ALLOW_ALL)",
                            label: "Hostname verification"
                        }
                    }
                },
                userClaimUpdate: {
                    friendlyName: "Attribute Update Verification Settings",
                    subTitle: "Configure verification & notification settings when updating user attributes.",
                    properties: {
                        userClaimUpdateEmailEnableVerification: {
                            hint: "Send a verification email with a link to the new address when the email attribute is updated.",
                            label: "Enable user email verification"
                        },
                        userClaimUpdateEmailVerificationCodeExpiryTime: {
                            hint: "Validity time of the email confirmation link in minutes.",
                            label: "Email verification link expiration time"
                        },
                        userClaimUpdateEmailEnableNotification: {
                            hint: "Send a notification to the current email address when the user attempts to change the email attribute.",
                            label: "Enable email update notifications"
                        },
                        userClaimUpdateMobileNumberEnableVerification: {
                            hint: "Send a verification SMS OTP to the new mobile number when the mobile attribute is updated.",
                            label: "Enable user mobile number verification"
                        },
                        userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                            hint: "Validity time of the mobile number confirmation OTP in minutes.",
                            label: "Mobile number verification SMS OTP expiration time"
                        },
                        userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                            hint: "Allow privileged users to initiate mobile number verification on update.",
                            label: "Enable mobile number verification by privileged users"
                        }
                    },
                    update: {
                        error: {
                            description: "{{ description }}",
                            message: "Update Error"
                        },
                        genericError: {
                            description:
                                "An error occurred while updating attribute verification configurations.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Attribute verification configurations updated successfully.",
                            message: "Update Successful."
                        }
                    },
                    subHeadings: {
                        emailConfiguration: "Email Configurations",
                        mobileConfiguration: "Mobile Configurations"
                    }
                }
            }
        },
        multiFactorAuthenticators : {
            name: "Multi Factor Authenticators",
            friendlyName: "Authenticator Settings",
            description: "Configure multi factor authenticator settings.",
            connectors: {
                backupCodeAuthenticator: {
                    friendlyName: "Backup Code Authenticator",
                    properties: {
                        backupCodeBackupCodeLength: {
                            hint: "Length of a backup code",
                            label: "Backup code length"
                        },
                        backupCodeBackupCodeSize: {
                            hint: "Maximum number of backup codes",
                            label: "Backup code size"
                        }
                    }
                }
            }
        },
        sessionManagement: {
            description: "Manage settings related to the session of your users."
        },
        saml2WebSsoConfiguration: {
            description: "Configure SAML2 Web SSO for your applications."
        },
        wsFederationConfiguration: {
            description: "Configure WS-Federation protocol for your applications."
        },
        internalNotificationSending: {
            categoryTitle: "Notification Settings",
            connector: {
                description: "Manage notification sending internally.",
                title: "Internal Notification Sending"
            }
        }
    },
    dangerZone: {
        actionTitle: "Revert",
        heading: "Revert to default",
        subHeading: "This action will discard all custom configurations on this page and restore the default settings."
    },
    disabled: "Disabled",
    enabled: "Enabled",
    form: {
        errors: {
            format: "The format is incorrect.",
            positiveIntegers: "The number should not be less than 0."
        }
    },
    genericDescription: "Configure settings related to {{ name }} connector.",
    notifications: {
        getConnector: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving governance connector.",
                message: "Something went wrong"
            },
            success: {
                description: "",
                message: ""
            }
        },
        getConnectorCategories: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving governance connector categories.",
                message: "Something went wrong"
            },
            success: {
                description: "",
                message: ""
            }
        },
        updateConnector: {
            error: {
                description: "{{ description }}",
                message: "Update Error"
            },
            genericError: {
                description: "An error occurred while updating governance connector.",
                message: "Something went wrong"
            },
            success: {
                description: "{{ name }} configuration updated successfully.",
                message: "Update Successful."
            }
        },
        revertConnector: {
            error: {
                description: "An error occurred while reverting governance connector properties.",
                message: "Revert Error"
            },
            success: {
                description: "Successfully reverted the configuration to default.",
                message: "Revert Successful."
            }
        }
    },
    pageSubHeading: "Configure and manage {{ name }}."
};
