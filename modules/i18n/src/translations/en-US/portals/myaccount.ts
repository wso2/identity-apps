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

import { MyAccountNS } from "../../../models";

export const myAccount: MyAccountNS = {
    components: {
        accountRecovery: {
            codeRecovery: {
                descriptions: {
                    add: "Add or update code recovery options"
                },
                heading: "Code Recovery"
            },
            emailRecovery: {
                descriptions: {
                    add: "Add or update recovery email address",
                    update: "Update recovery email address ({{email}})",
                    view: "View recovery email address ({{email}})"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: "Email address",
                                placeholder: "Enter the recovery email address",
                                validations: {
                                    empty: "Enter an email address",
                                    invalidFormat: "The email address is not of the correct format"
                                }
                            }
                        }
                    }
                },
                heading: "Email recovery",
                notifications: {
                    updateEmail: {
                        error: {
                            description: "{{description}}",
                            message: "Error updating the recovery email"
                        },
                        genericError: {
                            description: "Error occurred while updating the recovery email",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The email address in the user profile has been updated successfully",
                            message: "Email Address Updated Successfully"
                        }
                    }
                }
            },
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Error getting the recovery preference"
                    },
                    genericError: {
                        description: "Error occurred while getting the recovery preference",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the recovery preference",
                        message: "Recovery preference retrieval successful"
                    }
                }
            },
            questionRecovery: {
                descriptions: {
                    add: "Add or update account recovery challenge questions"
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: "Answer",
                                placeholder: "Enter your answer",
                                validations: {
                                    empty: "Answer is a required field"
                                }
                            },
                            question: {
                                label: "Question",
                                placeholder: "Select a security question",
                                validations: {
                                    empty: "At least one security question must be selected"
                                }
                            }
                        }
                    }
                },
                heading: "Security questions",
                notifications: {
                    addQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while adding the security questions"
                        },
                        genericError: {
                            description: "Error occurred while adding the security questions",
                            message: "Something went wrong."
                        },
                        success: {
                            description: "The required security questions were added successfully",
                            message: "Security questions were successfully added"
                        }
                    },
                    updateQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Error updating the security questions"
                        },
                        genericError: {
                            description: "Error occurred while updating the security questions",
                            message: "Something went wrong."
                        },
                        success: {
                            description: "The required security questions were updated successfully",
                            message: "Security Questions were successfully updated"
                        }
                    }
                }
            }
        },
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Filter attribute",
                        placeholder: "E.g. Name, Description etc.",
                        validations: {
                            empty: "Filter attribute is a required field."
                        }
                    },
                    filterCondition: {
                        label: "Filter condition",
                        placeholder: "E.g. Starts with etc.",
                        validations: {
                            empty: "Filter condition is a required field."
                        }
                    },
                    filterValue: {
                        label: "Filter value",
                        placeholder: "E.g. admin, wso2 etc.",
                        validations: {
                            empty: "Filter value is a required field."
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Shift + Enter",
                    label: "To search as a query"
                }
            },
            options: {
                header: "Advanced search"
            },
            placeholder: "Search by {{attribute}}",
            popups: {
                clear: "clear search",
                dropdown: "Show options"
            },
            resultsIndicator: "Showing results for the query \"{{query}}\""
        },
        applications: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "E.g. Name, Description etc."
                        },
                        filterCondition: {
                            placeholder: "E.g. Starts with etc."
                        },
                        filterValue: {
                            placeholder: "Enter value to search"
                        }
                    }
                },
                placeholder: "Search by application name"
            },
            all: {
                heading: "All Applications"
            },
            favourite: {
                heading: "Favourites"
            },
            notifications: {
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving applications"
                    },
                    genericError: {
                        description: "Couldn't retrieve applications",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the applications.",
                        message: "Applications retrieval successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Refresh list",
                    subtitles: {
                        0: "The applications list returned empty.",
                        1: "This could be due to having no discoverable applications.",
                        2: "Please ask an admin to enable discoverability for applications."
                    },
                    title: "No Applications"
                }
            },
            recent: {
                heading: "Recent Applications"
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: "Confirm password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "Confirm password is a required field",
                                mismatch: "The password confirmation doesn't match"
                            }
                        },
                        currentPassword: {
                            label: "Current password",
                            placeholder: "Enter the current password",
                            validations: {
                                empty: "Current password is a required field",
                                invalid: "Current password is invalid"
                            }
                        },
                        newPassword: {
                            label: "New password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "New password is a required field"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "Something went wrong. Please try again",
                            message: "Change password error"
                        },
                        invalidCurrentPassword: {
                            description: "The current password you entered appears to be invalid. Please try again",
                            message: "Change password error"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "Change password error"
                        },
                        submitSuccess: {
                            description: "The password has been changed successfully",
                            message: "Password reset successful"
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: "Confirmation",
                    message:
                        "Changing the password will result in the termination of the current session. You will " +
                        "have to login with the newly changed password. Do you wish to continue?"
                }
            }
        },
        consentManagement: {
            editConsent: {
                collectionMethod: "Collection Method",
                dangerZones: {
                    revoke: {
                        actionTitle: "Revoke",
                        header: "Revoke consent",
                        subheader: "You will have to provide consent for this application again."
                    }
                },
                description: "Description",
                piiCategoryHeading:
                    "Manage consent for the collection and sharing of your personal information " +
                    "with the application. Uncheck the attributes that you need to revoke and press the update " +
                    "button to save the changes or press the revoke button to remove the consent for all the " +
                    "attributes.",
                state: "State",
                version: "Version"
            },
            modals: {
                consentRevokeModal: {
                    heading: "Are you sure?",
                    message:
                        "This operation is not reversible. This will permanently revoke consent for all the " +
                        "attributes. Are you sure you want to proceed?",
                    warning: "Please note that you will be redirected to the login consent page"
                }
            },
            notifications: {
                consentReceiptFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Something went wrong"
                    },
                    genericError: {
                        description: "Couldn't load information on the selected application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the consent receipt",
                        message: "Successful retrieval"
                    }
                },
                consentedAppsFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Something went wrong"
                    },
                    genericError: {
                        description: "Couldn't load the list of consented applications",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the consented applications list",
                        message: "Successful retrieval"
                    }
                },
                revokeConsentedApp: {
                    error: {
                        description: "{{description}}",
                        message: "Consents Revoke Error"
                    },
                    genericError: {
                        description: "Couldn't revoke consent for the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The consent has been successfully revoked for the application",
                        message: "Consents Revoke Success"
                    }
                },
                updateConsentedClaims: {
                    error: {
                        description: "{{description}}",
                        message: "Something went wrong"
                    },
                    genericError: {
                        description: "The consented claims failed to update for the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The consented claims have been successfully updated for the application",
                        message: "Consented claims updated successfully"
                    }
                }
            }
        },
        cookieConsent: {
            confirmButton: "Got It",
            content: "We use cookies to ensure that you get the best overall experience. These cookies are used to " +
                "maintain an uninterrupted continuous session while providing smooth and personalized services. To " +
                "learn more about how we use cookies, refer our <1>Cookie Policy</1>."
        },
        federatedAssociations: {
            deleteConfirmation: "This will remove the linked social account from your local account. " +
                "Do you want to continue removing?",
            notifications: {
                getFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Something went wrong"
                    },
                    genericError: {
                        description: "Couldn't retrieve Linked Social Accounts",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Linked Social Accounts have been retrieved successfully",
                        message: "Linked Social Accounts retrieved successfully"
                    }
                },
                removeAllFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Something went wrong"
                    },
                    genericError: {
                        description: "Linked Social Accounts couldn't be removed",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "All the Linked Social Accounts have been removed successfully",
                        message: "Linked Social Accounts removed successfully"
                    }
                },
                removeFederatedAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Something went wrong"
                    },
                    genericError: {
                        description: "The Linked Social Account couldn't be removed",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The Linked Social Account has been removed successfully",
                        message: "The Linked Social Account removed successfully"
                    }
                }
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        header: {
            appSwitch: {
                console: {
                    description: "Manage as developers or administrators",
                    name: "Console"
                },
                myAccount: {
                    description: "Manage your own account",
                    name: "My Account"
                },
                tooltip: "Apps"
            },
            organizationLabel: "This account is managed by"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "Add local user account"
                }
            },
            deleteConfirmation: "This will remove the linked account from your account. Do you want to continue " +
                "removing?",
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: "Password",
                            placeholder: "Enter the password",
                            validations: {
                                empty: "Password is a required field"
                            }
                        },
                        username: {
                            label: "Username",
                            placeholder: "Enter the username",
                            validations: {
                                empty: "Username is a required field"
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving linked user accounts"
                    },
                    genericError: {
                        description: "Error occurred while adding the linked account",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The required linked user account added successfully",
                        message: "Linked user account added successfully"
                    }
                },
                getAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving linked user accounts"
                    },
                    genericError: {
                        description: "Error occurred while retrieving the linked user accounts",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The required user profile details are retrieved successfully",
                        message: "Linked user accounts retrieved successfully"
                    }
                },
                removeAllAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Error removing linked user accounts"
                    },
                    genericError: {
                        description: "Error occurred while removing the linked user accounts",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "All the linked user accounts have been removed",
                        message: "Linked accounts removed successfully"
                    }
                },
                removeAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Error removing the linked user account"
                    },
                    genericError: {
                        description: "Error occurred while removing the linked user account",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The linked user accounts have been removed",
                        message: "Linked account removed successfully"
                    }
                },
                switchAccount: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while switching the account"
                    },
                    genericError: {
                        description: "Error occurred while switching the account",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The account has been switched successfully",
                        message: "Account switched successfully"
                    }
                }
            }
        },
        loginVerifyData: {
            description: "This data is used to further verify your identity during login",
            heading: "Data used to verify your login",
            modals: {
                clearTypingPatternsModal: {
                    heading: "Confirmation",
                    message: "This action will clear your typing patterns that are saved in TypingDNA. " +
                        "Do you wish to continue?"
                }
            },
            notifications: {
                clearTypingPatterns: {
                    error: {
                        description: "Typing patterns could not be cleared. Please contact your site admin",
                        message: "Failed to clear typing patterns"
                    },
                    success: {
                        description: "Your typing patterns in TypingDNA have been cleared successfully",
                        message: "Typing patterns cleared successfully"
                    }
                }
            },
            typingdna: {
                description: "Your typing patterns can be cleared from here",
                heading: "TypingDNA Typing Patterns"
            }
        },
        mfa: {
            authenticatorApp: {
                addHint:"Adds new QR code",
                configuredDescription: "You can use TOTP codes from your configured " +
                    "authenticator app for two-factor authentication. If you don't have " +
                    "access to the application you can set up a new authenticator app from here.",
                deleteHint: "Deletes QR code",
                description: " Scan the QR code using an Authenticator App to use " +
                    "time-based , one-time passcodes (also known as TOTP) as a " +
                    "second factor when logging in to applications.",
                heading: "Authenticator App",
                hint: "Show the QR Code",
                modals: {
                    delete : {
                        heading: "Confirmation",
                        message: "This action will remove the QR code added to your profile. Do you wish to continue ? "
                    },
                    done: "Success! Now you can use your Authenticator App for two-factor authentication",
                    heading: "Setup an Authenticator App",
                    scan: {
                        additionNote: "QR code has been successfully added to your profile!",
                        authenticatorApps: "Authenticator Apps",
                        generate: "Generate a new code",
                        heading: "Scan the QR code below using an authenticator app",
                        messageBody: "You can find a list of Authenticator Apps available here.",
                        messageHeading: "Don't have an Authenticator App installed?"
                    },
                    toolTip: "Don't have an app? Download an authenticator application like " +
                        "Google Authenticator from <3>App Store</3> or <3>Google Play</3>",
                    verify: {
                        error: "Verification failed. Please try again.",
                        heading: "Enter the generated code to verify",
                        label: "Verification Code",
                        placeholder: "Enter your verification code",
                        reScan: "Re-scan",
                        reScanQuestion: "Want to scan the QR code again?",
                        requiredError: "Enter the verification code"
                    }
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "Error occurred while deleting QR code",
                            message: "Something went wrong"
                        }
                    },
                    initError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while retrieving the QR code",
                            message: "Something went wrong"
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while trying to get a new QR code",
                            message: "Something went wrong"
                        }
                    }
                }
            },
            fido: {
                description: "You can use a FIDO2 security key or biometrics in " +
                    "your device to sign in to your account.",
                form: {
                    label: "Security Key/Biometric",
                    placeholder: "Enter a name for the security key/biometrics",
                    remove: "Remove the security key/biometrics",
                    required: "Please enter a name for your security key/biometrics"
                },
                heading: "Security Key/Biometrics",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "Please confirm your action.",
                        content: "This action is irreversible and will permanently delete the security key/biometrics.",
                        description: "If you delete this security key/biometrics, you may not be " +
                            "able to sign in to your account again. Please proceed with caution.",
                        heading: "Are you sure?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "The security key/biometrics registration was interrupted. "
                            + "If this was not intentional you "
                            + "may retry the flow.",
                        heading: "Security Key/Biometric Registration Failed",
                        tryWithOlderDevice: "You may also try again with an older security key/biometrics."
                    }
                },
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while removing the security key/biometrics"
                        },
                        genericError: {
                            description: "Error occurred while removing the security key/biometrics",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The security key/biometrics was successfully removed from the list",
                            message: "Your Security Key/Biometric Removed Successfully"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while retrieving the security key/biometrics"
                        },
                        genericError: {
                            description: "Error occurred while retrieving the security key/biometrics",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The security key/biometrics was successfully registered and now you " +
                                "can use it for authentication.",
                            message: "Your Security Key/Biometric Registered Successfully"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while updating the security key/biometrics name"
                        },
                        genericError: {
                            description: "Error occurred while updating the security key/biometrics name",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The name of your security key/biometrics was successfully updated",
                            message: "Security Key/Biometric name updated successfully"
                        }
                    }
                },
                tryButton: "Try with an older Security Key/Biometric"
            },
            smsOtp: {
                descriptions: {
                    hint: "You'll receive a text message containing an one-time verification code"
                },
                heading: "SMS Number",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while updating the mobile number"
                        },
                        genericError: {
                            description: "Error occurred while updating the mobile number",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The mobile number in the user profile is updated successfully",
                            message: "Mobile number updated successfully"
                        }
                    }
                }
            }
        },
        mobileUpdateWizard: {
            done: "Success! Your mobile number is successfully verified.",
            notifications: {
                resendError: {
                    error: {
                        description: "{{error}}",
                        message: "Something went wrong"
                    },
                    genericError: {
                        description: "An error occurred while trying to get a new verification code",
                        message: "Something went wrong"
                    }
                },
                resendSuccess: {
                    message: "Resend code request is sent successfully"
                }
            },
            submitMobile: {
                heading: "Enter your new mobile number"
            },
            verifySmsOtp: {
                error: "Verification failed. Please try again.",
                generate: "Resend a new verification code",
                heading: "Enter the verification code sent to your mobile number",
                label: "Verification Code",
                placeholder: "Enter your verification code",
                requiredError: "Enter the verification code"
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "Manage account activity"
                    },
                    description: "You are currently logged in from the following device",
                    header: "Active Sessions"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "Update account security"
                    },
                    description: "Settings and recommendations to help you keep your account secure",
                    header: "Account Security"
                },
                accountStatus: {
                    complete: "Your profile is complete",
                    completedFields: "Completed fields",
                    completionPercentage: "Your profile completion is at {{percentage}}%",
                    inComplete: "Complete your profile",
                    inCompleteFields: "Incomplete fields",
                    mandatoryFieldsCompletion: "{{completed}} out of {{total}} mandatory fields completed",
                    optionalFieldsCompletion: "{{completed}} out of {{total}} optional fields completed"
                },
                consentManagement: {
                    actionTitles: {
                        manage: "Manage consents"
                    },
                    description: "Control the data you want to share with applications",
                    header: "Control Consents"
                },
                profileStatus: {
                    completionPercentage: "Your profile completion is at {{percentage}}%",
                    header: "Your {{productName}} Profile",
                    userSourceText: "(Signed up via {{source}})"
                }
            }
        },
        privacy: {
            about: {
                description:
                    "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open source " +
                    "Identity Management and Entitlement Server that is based on open standards and specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS uses your IP address to detect any suspicious login attempts to your account.",
                            1:
                                "WSO2 IS uses attributes like your first name, last name, etc., to provide a rich and" +
                                " personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1: "WSO2 IS collects your information only to serve your access requirements. For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0:
                                    "Collecting information from the user profile page where you enter your personal" +
                                    " data.",
                                1: "Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.",
                                2: "Tracking your geographic information with the IP address.",
                                3:
                                    "Tracking your login history with browser cookies. Please see our" +
                                    " {{cookiePolicyLink}} for more information."
                            },
                            para1: "WSO2 IS collects your information by:"
                        },
                        heading: "Tracking Technologies"
                    }
                },
                description: {
                    para1:
                        "This policy describes how WSO2 IS captures your personal information, the purposes of" +
                        " collection, and information about the retention of your personal information.",
                    para2:
                        "Please note that this policy is for reference only, and is applicable for the software " +
                        "as a product. WSO2 Inc. and its developers have no access to the information held within " +
                        "WSO2 IS. Please see the <1>disclaimer</1> section for more information.",
                    para3:
                        "Entities, organizations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organization or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0:
                                "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees partners " +
                                "and affiliates are not a data processor or a data controller within the meaning of " +
                                "any data privacy regulations. WSO2 does not provide any warranties or undertake any " +
                                "responsibility or liability in connection with the lawfulness or the manner and " +
                                "purposes for which WSO2 IS is used by such entities or persons.",
                            1:
                                "This privacy policy is for the informational purposes of the entity or persons " +
                                "running WSO2 IS and sets out the processes and functionality contained within " +
                                "WSO2 IS regarding personal data protection. It is the responsibility of entities " +
                                "and persons running WSO2 IS to create and administer its own rules and processes " +
                                "governing users' personal data, and such rules and processes may change the use, " +
                                "storage and disclosure policies contained herein. Therefore users should consult " +
                                "the entity or persons running WSO2 IS for its own privacy policy for details " +
                                "governing users' personal data."
                        }
                    },
                    heading: "Disclaimer"
                },
                disclosureOfPersonalInfo: {
                    description:
                        "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service Providers, " +
                        "unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description:
                            "Please note that the organization, entity or individual running WSO2 IS may " +
                            "be compelled to disclose your personal information with or without your consent when " +
                            "it is required by law following due and lawful process.",
                        heading: "Legal process"
                    }
                },
                heading: "Privacy Policy",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1:
                                "Upgraded versions of WSO2 IS may contain changes to this policy and " +
                                "revisions to this policy will be packaged within such upgrades. Such changes " +
                                "would only apply to users who choose to use upgraded versions.",
                            para2:
                                "The organization running WSO2 IS may revise the Privacy Policy from time to " +
                                "time. You can find the most recent governing policy with the respective link " +
                                "provided by the organization running WSO2 IS. The organization will notify " +
                                "any changes to the privacy policy over our official public channels."
                        },
                        heading: "Changes to this policy"
                    },
                    contactUs: {
                        description: {
                            para1:
                                "Please contact WSO2 if you have any question or concerns regarding this privacy " +
                                "policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1:
                                "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable to you.",
                            para2:
                                "If you do not have an account and you do not agree with our privacy policy, " +
                                "you can choose not to create one."
                        },
                        heading: "Your choices"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "Storage of personal information",
                    howLong: {
                        description: {
                            list1: {
                                0: "Current password",
                                1: "Previously used passwords"
                            },
                            para1:
                                "WSO2 IS retains your personal data as long as you are an active user of our " +
                                "system. You can update your personal data at any time using the given self-care " +
                                "user portals.",
                            para2:
                                "WSO2 IS may keep hashed secrets to provide you with an added level of security. " +
                                "This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1:
                                "You can request the administrator to delete your account. The administrator is " +
                                "the administrator of the organization you are registered under, or the " +
                                "super-administrator if you do not use the organization feature.",
                            para2:
                                "Additionally, you can request to anonymize all traces of your activities " +
                                "that WSO2 IS may have retained in logs, databases or analytical storage."
                        },
                        heading: "How to request removal of your personal information"
                    },
                    where: {
                        description: {
                            para1:
                                "WSO2 IS stores your personal information in secured databases. WSO2 IS " +
                                "exercises proper industry accepted security measures to protect the database " +
                                "where your personal information is held. WSO2 IS as a product does not transfer " +
                                "or share your data with any third parties or locations.",
                            para2:
                                "WSO2 IS may use encryption to keep your personal data with an added level " +
                                "of security."
                        },
                        heading: "Where your personal information is stored"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "To provide you with a personalized user experience. WSO2 IS uses your name and " +
                                "uploaded profile pictures for this purpose.",
                            1:
                                "To protect your account from unauthorized access or potential hacking attempts. " +
                                "WSO2 IS uses HTTP or TCP/IP Headers for this purpose.",
                            2:
                                "Derive statistical data for analytical purposes on system performance improvements. " +
                                "WSO2 IS will not keep any personal information after statistical calculations. " +
                                "Therefore, the statistical report has no means of identifying an individual person."
                        },
                        para1:
                            "WSO2 IS will only use your personal information for the purposes for which it was " +
                            "collected (or for a use identified as consistent with that purpose).",
                        para2: "WSO2 IS uses your personal information only for the following purposes.",
                        subList1: {
                            heading: "This includes:",
                            list: {
                                0: "IP address",
                                1: "Browser fingerprinting",
                                2: "Cookies"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS may use:",
                            list: {
                                0: "IP Address to derive geographic information",
                                1: "Browser fingerprinting to determine the browser technology or/and version"
                            }
                        }
                    },
                    heading: "Use of personal information"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "Your user name (except in cases where the user name created by your employer is " +
                                "under contract)",
                            1: "Your date of birth/age",
                            2: "IP address used to log in",
                            3: "Your device ID if you use a device (e.g., phone or tablet) to log in"
                        },
                        list2: {
                            0: "City/Country from which you originated the TCP/IP connection",
                            1: "Time of the day that you logged in (year, month, week, hour or minute)",
                            2: "Type of device that you used to log in (e.g., phone or tablet)",
                            3: "Operating system and generic browser information"
                        },
                        para1:
                            "WSO2 IS considers anything related to you, and by which you may be identified, as " +
                            "your personal information. This includes, but is not limited to:",
                        para2:
                            "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        profile: {
            fields: {
                emails: "Email",
                generic: {
                    default: "Add {{fieldName}}"
                },
                nameFamilyName: "Last name",
                nameGivenName: "First name",
                phoneNumbers: "Phone number",
                profileImage: "Profile Image",
                profileUrl: "URL",
                userName: "Username"
            },
            forms: {
                countryChangeForm: {
                    inputs: {
                        country: {
                            placeholder: "Select your country"
                        }
                    }
                },
                dateChangeForm: {
                    inputs: {
                        date: {
                            validations: {
                                invalidFormat: "Please enter a valid {{fieldName}} in the format YYYY-MM-DD."
                            }
                        }
                    }
                },
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "Email",
                            note: "NOTE: Editing this changes the email address associated with this account. This " +
                                "email address is also used for account recovery.",
                            placeholder: "Enter your email address",
                            validations: {
                                empty: "Email address is a required field",
                                invalidFormat: "Please enter a valid email address. You can use alphanumeric " +
                                    "characters, unicode characters, underscores (_), dashes (-), periods (.), " +
                                    "and an at sign (@)."
                            }
                        }
                    }
                },
                generic: {
                    inputs: {
                        placeholder: "Enter your {{fieldName}}",
                        readonly: {
                            placeholder: "This value is empty",
                            popup: "Contact the administrator to update your {{fieldName}}"
                        },
                        validations: {
                            empty: "{{fieldName}} is a required field",
                            invalidFormat: "The {{fieldName}} is not of the correct format"
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "Mobile number",
                            note: "NOTE: This will change the mobile number in your profile",
                            placeholder: "Enter your mobile number",
                            validations: {
                                empty: "Mobile number is a required field",
                                invalidFormat: "Please enter a valid mobile number in the format [+][country code]"+
                                    "[area code][local phone number]."
                            }
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: "First name",
                            placeholder: "Enter the first name",
                            validations: {
                                empty: "First name is a required field"
                            }
                        },
                        lastName: {
                            label: "Last name",
                            placeholder: "Enter the last name",
                            validations: {
                                empty: "Last name is a required field"
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: "Organization",
                            placeholder: "Enter your organization",
                            validations: {
                                empty: "Organization is a required field"
                            }
                        }
                    }
                }
            },
            messages: {
                emailConfirmation: {
                    content: "Please confirm the email address update in order to add the new email to your profile.",
                    header: "Confirmation pending!"
                },
                mobileVerification: {
                    content: "This mobile number is used for sending SMS OTP when second factor authentication " +
                        "is enabled and for sending recovery codes in case of a username/password recovery. " +
                        "To update this number, you have to verify the new number by entering the verification " +
                        "code sent to your new number. Click update if you wish to proceed."
                }
            },
            notifications: {
                getProfileCompletion: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred"
                    },
                    genericError: {
                        description: "Error occurred while assessing the profile completion",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Profile completion was assessed successfully",
                        message: "Calculation Successful"
                    }
                },
                getProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while retrieving the profile details"
                    },
                    genericError: {
                        description: "Error occurred while retrieving the profile details",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The required user profile details are retrieved successfully",
                        message: "Successfully retrieved user profile"
                    }
                },
                getUserReadOnlyStatus: {
                    genericError: {
                        description: "Error occurred while retrieving the read-only status of the user",
                        message: "Something went wrong"
                    }
                },
                updateProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating the profile details"
                    },
                    genericError: {
                        description: "Error occurred while updating the profile details",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The required user profile details were successfully updated",
                        message: "User profile updated successfully"
                    }
                }
            },
            placeholders: {
                SCIMDisabled: {
                    heading: "This feature is not available for your account"
                }
            }
        },
        profileExport: {
            notifications: {
                downloadProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while downloading the user profile details"
                    },
                    genericError: {
                        description: "Error occurred while downloading the user profile details",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The file containing the required user profile details has started downloading",
                        message: "User profile details download started"
                    }
                }
            }
        },
        userAvatar: {
            infoPopover: "This image has been retrieved from <1>Gravatar</1> service.",
            urlUpdateHeader: "Enter an image URL to set your profile picture"
        },
        userSessions: {
            browserAndOS: "{{browser}} on {{os}} {{version}}",
            dangerZones: {
                terminate: {
                    actionTitle: "Terminate",
                    header: "Terminate session",
                    subheader: "You will be logged out of the session on the particular device."
                }
            },
            lastAccessed: "Last accessed {{date}}",
            modals: {
                terminateAllUserSessionsModal: {
                    heading: "Confirmation",
                    message:
                        "The action will log you out of this session and all the other sessions on every device. " +
                        "Do you wish to continue?"
                },
                terminateUserSessionModal: {
                    heading: "Confirmation",
                    message:
                        "This action will log you out of the session on the particular device. Do you wish to " +
                        "continue?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving active session"
                    },
                    genericError: {
                        description: "Couldn't retrieve any active sessions",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the active sessions",
                        message: "Active session retrieval successful"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Couldn't terminate active sessions"
                    },
                    genericError: {
                        description: "Something went wrong while terminating active sessions",
                        message: "Couldn't terminate active sessions"
                    },
                    success: {
                        description: "Successfully terminated all active sessions",
                        message: "Terminated all active sessions"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "Couldn't terminate the active session"
                    },
                    genericError: {
                        description: "Something went wrong while terminating the active session",
                        message: "Couldn't terminate the active session"
                    },
                    success: {
                        description: "Successfully terminated the active session",
                        message: "Session terminate success"
                    }
                }
            }
        }
    },
    modals: {
        editAvatarModal: {
            content: {
                gravatar: {
                    errors: {
                        noAssociation: {
                            content: "It seems like the selected email is not registered on Gravatar. " +
                                "Sign up for a Gravatar account by visiting Gravatar official website or use " +
                                "one of the following.",
                            header: "No matching Gravatar image found!"
                        }
                    },
                    heading: "Gravatar based on "
                },
                hostedAvatar: {
                    heading: "Hosted Image",
                    input: {
                        errors: {
                            http: {
                                content: "The selected URL points to an insecure image served over HTTP. " +
                                    "Please proceed with caution.",
                                header: "Insecure Content!"
                            },
                            invalid: {
                                content: "Please enter a valid image URL"
                            }
                        },
                        hint: "Enter a valid image URL which is hosted on a third party location.",
                        placeholder: "Enter URL for the image.",
                        warnings: {
                            dataURL: {
                                content: "Using Data URLs with large character count might result in database " +
                                    "issues. Proceed with caution.",
                                header: "Double check the entered Data URL!"
                            }
                        }
                    }
                },
                systemGenAvatars: {
                    heading: "System generated avatar",
                    types: {
                        initials: "Initials"
                    }
                }
            },
            description: null,
            heading: "Update profile picture",
            primaryButton: "Save",
            secondaryButton: "Cancel"
        },
        sessionTimeoutModal: {
            description: "When you click on <1>Go back</1>, we will try to recover the session if " +
                "it exists. If you don't have an active session, you will be redirected to the login page.",
            heading: "It looks like you have been inactive for a long time.",
            loginAgainButton: "Login again",
            primaryButton: "Go back",
            secondaryButton: "Logout",
            sessionTimedOutDescription: "Please log in again to continue from where you left off.",
            sessionTimedOutHeading: "User session has expired due to inactivity."
        }
    },
    pages: {
        applications: {
            subTitle: "Manage and maintain your applications",
            title: "Applications"
        },
        overview: {
            subTitle: "Manage your personal information, account security, and privacy settings",
            title: "Welcome, {{firstName}}"
        },
        personalInfo: {
            subTitle: "Edit or export your personal profile and manage linked accounts",
            title: "Personal Info"
        },
        personalInfoWithoutExportProfile: {
            subTitle: "View and manage your personal information",
            title: "Personal Info"
        },
        personalInfoWithoutLinkedAccounts: {
            subTitle: "Edit or export your personal profile",
            title: "Personal Info"
        },
        privacy: {
            subTitle: "",
            title: "WSO2 Identity Server Privacy Policy"
        },
        security: {
            subTitle: "Secure your account by managing consents, sessions, and security settings",
            title: "Security"
        }
    },
    placeholders: {
        404: {
            action: "Back to home",
            subtitles: {
                0: "We couldn't find the page you are looking for.",
                1: "Please check the URL or click on the button below to be redirected back to the home page."
            },
            title: "Page not found"
        },
        accessDeniedError: {
            action: "Back to home",
            subtitles: {
                0: "It seems like you are not allowed to access this page.",
                1: "Please try signing in with a different account."
            },
            title: "Access not granted"
        },
        emptySearchResult: {
            action: "Clear search query",
            subtitles: {
                0: "We couldn't find any results for \"{{query}}\"",
                1: "Please try a different search term."
            },
            title: "No results found"
        },
        genericError: {
            action: "Refresh the page",
            subtitles: {
                0: "Something went wrong while displaying this page.",
                1: "See the browser console for technical details."
            },
            title: "Something went wrong"
        },
        loginError: {
            action: "Continue logout",
            subtitles: {
                0: "It seems like you don't have permission to use this portal.",
                1: "Please sign in with a different account."
            },
            title: "You are not authorized"
        },
        sessionStorageDisabled: {
            subtitles: {
                0: "To use this application, you have to enable cookies in your web browser settings.",
                1: "For more information on how to enable cookies, see the help section of your web browser."
            },
            title: "Cookies are disabled in your browser."
        }
    },
    sections: {
        accountRecovery: {
            description:
                "Manage recovery information that we can use to help you recover your username or password",
            heading: "Account Recovery"
        },
        changePassword: {
            actionTitles: {
                change: "Change your password"
            },
            description: "Update your password regularly and make sure it's unique from other passwords you use.",
            heading: "Change Password"
        },
        consentManagement: {
            actionTitles: {
                empty: "You have not granted consent to any application"
            },
            description:
                "Review the consents you have provided for each application. " +
                "Also, you can revoke one or many of them as required.",
            heading: "Manage Consents",
            placeholders: {
                emptyConsentList: {
                    heading: "You have not granted consent to any application"
                }
            }
        },
        createPassword: {
            actionTitles: {
                create: "Create password"
            },
            description: "Create a password in {{productName}}. " +
                "You can use this password to sign in to {{productName}} in addition " +
                "to social login.",
            heading: "Create Password"
        },
        federatedAssociations: {
            description: "View your accounts from other identity providers that are linked with this account",
            heading: "Linked Social Accounts"
        },
        linkedAccounts: {
            actionTitles: {
                add: "Add account"
            },
            description: "Link/associate your other accounts, and access them seamlessly without re-login",
            heading: "Linked Accounts"
        },
        mfa: {
            description:
                "Configure additional authentications to sign in easily or " +
                "to add an extra layer of security to your account.",
            heading: "Additional Authentication"
        },
        profile: {
            description: "Manage your personal profile",
            heading: "Profile"
        },
        profileExport: {
            actionTitles: {
                export: "Download the profile"
            },
            description: "Download all your profile data including personal data, security questions, and consents",
            heading: "Export Profile"
        },
        userSessions: {
            actionTitles: {
                empty: "No active sessions",
                terminateAll: "Terminate all sessions"
            },
            description: "Review all the active user sessions for your account",
            heading: "Active Sessions",
            placeholders: {
                emptySessionList: {
                    heading: "There are no active sessions for this user"
                }
            }
        }
    }
};
