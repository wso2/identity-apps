/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { MyAccountNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const myAccount: MyAccountNS = {
    components: {
        accountRecovery: {
            SMSRecovery: {
                descriptions: {
                    add: "Add or update recovery mobile number.",
                    emptyMobile: "You need to configure your mobile number to proceed with SMS-OTP recovery.",
                    update: "Update recovery mobile number ({{mobile}})",
                    view: "View recovery mobile number ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "Mobile number",
                                placeholder: "Enter the recovery mobile number.",
                                validations: {
                                    empty: "Enter a mobile number.",
                                    invalidFormat: "The mobile number is not of the correct format."
                                }
                            }
                        }
                    }
                },
                heading: "SMS recovery",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Error updating the recovery mobile."
                        },
                        genericError: {
                            description: "Error occurred while updating the recovery mobile",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The mobile number in the user profile has been updated successfully",
                            message: "Mobile Number Updated Successfully"
                        }
                    }
                }
            },
            codeRecovery: {
                descriptions: {
                    add: "Add or update code recovery options"
                },
                heading: "Code Recovery"
            },
            emailRecovery: {
                descriptions: {
                    add: "Add or update recovery email address",
                    emptyEmail: "You need to configure your email address to proceed with email recovery.",
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
                        invalidNewPassword: {
                            description: "Password does not satisfy the required constraints.",
                            message: "Invalid password"
                        },
                        passwordCaseRequirement: "At least {{minUpperCase}} uppercase and {{minLowerCase}} " +
                            "lowercase letters",
                        passwordCharRequirement: "At least {{minSpecialChr}} of special character(s)",
                        passwordLengthRequirement: "Must be between {{min}} and {{max}} characters",
                        passwordLowerCaseRequirement: "At least {{minLowerCase}} lowercase letter(s)",
                        passwordNumRequirement: "At least {{min}} number(s)",
                        passwordRepeatedChrRequirement: "No more than {{repeatedChr}} repeated character(s)",
                        passwordUniqueChrRequirement: "At least {{uniqueChr}} unique character(s)",
                        passwordUpperCaseRequirement: "At least {{minUpperCase}} uppercase letter(s)",
                        submitError: {
                            description: "{{description}}",
                            message: "Change password error"
                        },
                        submitSuccess: {
                            description: "The password has been changed successfully",
                            message: "Password reset successful"
                        },
                        validationConfig: {
                            error: {
                                description: "{{description}}",
                                message: "Retrieval error"
                            },
                            genericError: {
                                description: "Couldn't retrieve validation configuration data.",
                                message: "Something went wrong"
                            }
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
            dropdown: {
                footer: {
                    cookiePolicy: "Cookies",
                    privacyPolicy: "Privacy",
                    termsOfService: "Terms"
                }
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
                addHint:"Configure",
                configuredDescription: "You can use TOTP codes from your configured " +
                    "authenticator app for two-factor authentication. If you don't have " +
                    "access to the application you can set up a new authenticator app from here.",
                deleteHint: "Remove",
                description: "You can use the authenticator app to get verification codes for " +
                    "two-factor authentication.",
                enableHint: "Enable/Disable TOTP Authenticator",
                heading: "TOTP Authenticator",
                hint: "View",
                modals: {
                    delete : {
                        heading: "Confirmation",
                        message: "This action will remove the QR code added to your profile. Do you wish to continue ? "
                    },
                    done: "Success! Now you can use your Authenticator App for two-factor authentication",
                    heading: "Set up an Authenticator App",
                    scan: {
                        additionNote: "QR code has been successfully added to your profile!",
                        authenticatorApps: "Authenticator Apps",
                        generate: "Generate a new code",
                        heading: "Scan the QR code below using an authenticator app",
                        messageBody: "You can find a list of Authenticator Apps available here.",
                        messageHeading: "Don't have an Authenticator App installed?",
                        regenerateConfirmLabel: "Confirm regenerating a new QR code",
                        regenerateWarning: {
                            extended: "When you regenerate a new QR code, you must scan it and re-setup your authenticator app. You won't be able to login with the previous QR code anymore.",
                            generic: "When you regenerate a new QR code, you must scan it and re-setup your authenticator app. Your previous setup won't work anymore."
                        }
                    },
                    toolTip: "Don't have an authenticator app? Download an authenticator app like " +
                        "Google Authenticator from <1>App Store</1> or <3>Google Play</3>",
                    verify: {
                        error: "Verification failed. Please try again.",
                        heading: "Enter the generated code for verification",
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
                    deleteSuccess: {
                        genericMessage: "Successfully removed",
                        message: "Successfully removed TOTP configuration."
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
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while trying to update the enabled authenticator list",
                            message: "Something went wrong"
                        }
                    }
                },
                regenerate: "Regenerate"
            },
            backupCode: {
                actions: {
                    add: "Add backup codes",
                    delete: "Remove backup codes"
                },
                description: "Use backup codes to access your account in the event you cannot receive multi-factor " +
                    "authentication codes. You can regenerate new codes if required.",
                download: {
                    heading: "Backup codes for {{productName}}",
                    info1: "You can only use each backup code once.",
                    info2: "These codes were generated on ",
                    subHeading: "You can use these backup codes to sign in to {{productName}} when you are " +
                        "away from your phone. Keep these backup codes somewhere safe but accessible."
                },
                heading: "Backup Codes",
                messages: {
                    disabledMessage: "At least one additional authenticator should be configured to enable backup codes."
                },
                modals: {
                    actions: {
                        copied: "Copied",
                        copy: "Copy Codes",
                        download: "Download Codes",
                        regenerate: "Regenerate"
                    },
                    delete: {
                        description: "This action will remove backup codes and you will no longer be able to use them. " +
                            "Do you wish to continue?",
                        heading: "Confirmation"
                    },
                    description: "Use backup codes to sign in when you are away from your phone.",
                    generate: {
                        description: "All of your backup codes are used. Lets generate a new set of backup codes",
                        heading: "Generate"
                    },
                    heading: "Backup Codes",
                    info: "Each code can only be used once. You can generate new codes at any time to replace these.",
                    regenerate: {
                        description: "After you generate new codes, your old codes will no longer work. "
                            + "Be sure to save the new codes once they are generated.",
                        heading: "Confirmation"
                    },
                    subHeading: "One-time passcodes that you can use to sign in",
                    warn: "These codes will appear only once. Be sure to save them now and store "
                        + "them somewhere safe but accessible."
                },
                mutedHeader: "Recovery Options",
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "Error occurred while deleting backup codes",
                            message: "Something went wrong"
                        }
                    },
                    deleteSuccess: {
                        genericMessage: "Successfully removed",
                        message: "Successfully removed backup codes."
                    },
                    downloadError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while trying to download backup codes",
                            message: "Something went wrong"
                        }
                    },
                    downloadSuccess: {
                        genericMessage: {
                            description: "The backup codes are successfully downloaded.",
                            message: "Backup codes downloaded successfully."
                        },
                        message: {
                            description: "{{message}}",
                            message: "Backup codes downloaded successfully."
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while trying to genetare new backup codes",
                            message: "Something went wrong"
                        }
                    },
                    retrieveAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while trying to get the enabled authenticator list",
                            message: "Something went wrong"
                        }
                    },
                    retrieveError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while retrieving backup codes",
                            message: "Something went wrong"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "An error occurred while trying to update the enabled authenticator list",
                            message: "Something went wrong"
                        }
                    }
                },
                remaining: "remaining"
            },
            fido: {
                description: "You can use a <1>passkey</1>, <1>FIDO security key</1> or <1>biometrics</1> in " +
                    "your device to sign in to your account.",
                form: {
                    label: "Passkey",
                    placeholder: "Enter a name for the passkey",
                    remove: "Remove the passkey",
                    required: "Please enter a name for your passkey"
                },
                heading: "Passkey",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "Please confirm your action.",
                        content: "This action is irreversible and will permanently delete the passkey.",
                        description: "If you delete this passkey, you may not be " +
                            "able to sign in to your account again. Please proceed with caution.",
                        heading: "Are you sure?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "The passkey enrollment was interrupted. "
                            + "If this was not intentional you "
                            + "may retry the flow.",
                        heading: "Passkey enrollment Failed",
                        tryWithOlderDevice: "You may also try again with an older passkey."
                    }
                },
                noPassKeyMessage: "You don't have any passkeys enrolled yet.",
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while removing the passkey"
                        },
                        genericError: {
                            description: "Error occurred while removing the passkey",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The passkey was successfully removed from the list",
                            message: "Your Passkey Removed Successfully"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while retrieving the passkey"
                        },
                        genericError: {
                            description: "Error occurred while retrieving the passkey",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The passkey was successfully enrolled and now you " +
                                "can use it for authentication.",
                            message: "Your Passkey Enrolled Successfully"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while updating the passkey name"
                        },
                        genericError: {
                            description: "Error occurred while updating the passkey name",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The name of your passkey was successfully updated",
                            message: "Passkey name updated successfully"
                        }
                    }
                },
                tryButton: "Try with an older passkey"
            },
            pushAuthenticatorApp: {
                addHint:"Configure",
                configuredDescription: "You can use the login prompts generated from your configured " +
                    "push authenticator app for two-factor authentication. If you don't have " +
                    "access to the application you can set up a new authenticator app from here.",
                deleteHint: "Remove",
                description: "You can use the push authenticator app to get login prompts as push notifications for " +
                    "two-factor authentication.",
                heading: "Push Authenticator",
                hint: "View",
                modals: {
                    deviceDeleteConfirmation: {
                        assertionHint: "Please confirm your action.",
                        content: "This action is irreversible and will permanently remove the device.",
                        description: "If you remove this device, you may not be able to sign in to your account again. Please proceed with caution.",
                        heading: "Are you sure?"
                    },
                    scan: {
                        additionNote: "QR code has been successfully added to your profile!",
                        done: "Success! Now you can use your Push Authenticator App for two-factor authentication",
                        heading: "Set up the Push Authenticator App",
                        messageBody: "You can find a list of Authenticator Apps available here.",
                        subHeading: "Scan the QR code below using the push authenticator app"
                    }
                },
                notifications: {
                    delete: {
                        error: {
                            description: "{{error}}",
                            message: "Something went wrong"
                        },
                        genericError: {
                            description: "Error occurred while removing the registered device",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully removed the registered device",
                            message: "Device deleted successfully"
                        }
                    },
                    deviceListFetchError: {
                        error: {
                            description: "An error occurred while retrieving the registered devices for push authentication",
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
                    }
                }
            },
            smsOtp: {
                descriptions: {
                    hint: "You'll receive a text message containing an one-time verification code"
                },
                heading: "Mobile number",
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
            verificationSent: {
                heading: "You will receive an OTP to your mobile number for verification shortly"
            },
            verifySmsOtp: {
                didNotReceive: "Didn't receive a code?",
                error: "Verification failed. Please try again.",
                heading: "Verify Your Mobile Number",
                label: "Enter the verification code sent to your mobile number",
                placeholder: "Enter your verification code",
                requiredError: "Enter the verification code",
                resend: "Resend"
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
                    description: "Manage your profile",
                    header: "Your {{productName}} Profile",
                    profileText: "Details of your personal profile",
                    readOnlyDescription: "View your profile",
                    userSourceText: "(Signed up via {{source}})"
                }
            }
        },
        profile: {
            actions: {
                "deleteEmail": "Delete email address",
                "deleteMobile": "Delete mobile",
                "verifyEmail": "Verify email address",
                "verifyMobile": "Verify mobile"
            },
            fields: {
                "Account Confirmed Time": "Account Confirmed Time",
                "Account Disabled": "Account Disabled",
                "Account Locked": "Account Locked",
                "Account State": "Account State",
                "Active": "Active",
                "Address - Street": "Address - Street",
                "Ask Password": "Ask Password",
                "Backup Code Enabled": "Backup Code Enabled",
                "Backup Codes": "Backup Codes",
                "Birth Date": "Birth Date",
                "Country": "Country",
                "Created Time": "Created Time",
                "Disable EmailOTP": "Disable EmailOTP",
                "Disable SMSOTP": "Disable SMSOTP",
                "Display Name": "Display Name",
                "Email": "Email",
                "Email Addresses": "Email Addresses",
                "Email Verified": "Email Verified",
                "Enabled Authenticators": "Enabled Authenticators",
                "Existing Lite User": "Existing Lite User",
                "External ID": "External ID",
                "Failed Attempts Before Success": "Failed Attempts Before Success",
                "Failed Backup Code Attempts": "Failed Backup Code Attempts",
                "Failed Email OTP Attempts": "Failed Email OTP Attempts",
                "Failed Lockout Count": "Failed Lockout Count",
                "Failed Login Attempts": "Failed Login Attempts",
                "Failed Password Recovery Attempts": "Failed Password Recovery Attempts",
                "Failed SMS OTP Attempts": "Failed SMS OTP Attempts",
                "Failed TOTP Attempts": "Failed TOTP Attempts",
                "First Name": "First Name",
                "Force Password Reset": "Force Password Reset",
                "Full Name": "Full Name",
                "Gender": "Gender",
                "Groups": "Groups",
                "Identity Provider Type": "Identity Provider Type",
                "Last Logon": "Last Logon",
                "Last Modified Time": "Last Modified Time",
                "Last Name": "Last Name",
                "Last Password Update": "Last Password Update",
                "Lite User": "Lite User",
                "Lite User ID": "Lite User ID",
                "Local": "Local",
                "Local Credential Exists": "Local Credential Exists",
                "Locality": "Locality",
                "Location": "Location",
                "Locked Reason": "Locked Reason",
                "Manager - Name": "Manager - Name",
                "Middle Name": "Middle Name",
                "Mobile": "Mobile",
                "Mobile Numbers": "Mobile Numbers",
                "Nick Name": "Nick Name",
                "Phone Verified": "Phone Verified",
                "Photo - Thumbnail": "Photo - Thumbnail",
                "Photo URL": "Photo URL",
                "Postal Code": "Postal Code",
                "Preferred Channel": "Preferred Channel",
                "Read Only User": "Read Only User",
                "Region": "Region",
                "Resource Type": "Resource Type",
                "Roles": "Roles",
                "Secret Key": "Secret Key",
                "TOTP Enabled": "TOTP Enabled",
                "Time Zone": "Time Zone",
                "URL": "URL",
                "Unlock Time": "Unlock Time",
                "User Account Type": "User Account Type",
                "User ID": "User ID",
                "User Metadata - Version": "User Metadata - Version",
                "User Source": "User Source",
                "User Source ID": "User Source ID",
                "Username": "Username",
                "Verification Pending Email": "Verification Pending Email",
                "Verification Pending Mobile Number": "Verification Pending Mobile Number",
                "Verified Email Addresses": "Verified Email Addresses",
                "Verified Mobile Numbers": "Verified Mobile Numbers",
                "Verify Email": "Verify Email",
                "Verify Mobile": "Verify Mobile",
                "Verify Secret Key": "Verify Secret Key",
                "Website URL": "Website URL",
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
                                futureDateError: "The date you entered for the {{field}} field is invalid.",
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
                            invalidFormat: "The format of the {{fieldName}} entered is incorrect"
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
            modals: {
                customMultiAttributeDeleteConfirmation: {
                    assertionHint: "Please confirm your action.",
                    content: "This action is irreversible and will permanently delete the selected value.",
                    description: "If you delete this selected value, it will be permanently removed from your profile.",
                    heading: "Are you sure?"
                },
                emailAddressDeleteConfirmation: {
                    assertionHint: "Please confirm your action.",
                    content: "This action is irreversible and will permanently delete the email address.",
                    description: "If you delete this email address, it will be permanently removed from your profile.",
                    heading: "Are you sure?"
                },
                mobileNumberDeleteConfirmation: {
                    assertionHint: "Please confirm your action.",
                    content: "This action is irreversible and will permanently delete the mobile number.",
                    description: "If you delete this mobile number, it will be permanently removed from your profile.",
                    heading: "Are you sure?"
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
                },
                verifyEmail: {
                    error: {
                        description: "{{description}}",
                        message: "An error occurred while sending the verification email"
                    },
                    genericError: {
                        description: "An error occurred while sending the verification email",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The verification email was sent successfully. Please check your inbox",
                        message: "Verification email sent successfully"
                    }
                },
                verifyMobile: {
                    error: {
                        description: "{{description}}",
                        message: "An error occurred while sending the verification code"
                    },
                    genericError: {
                        description: "An error occurred while sending the verification code",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The verification code was sent successfully. Please check your mobile",
                        message: "Verification code sent successfully"
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
        selfSignUp: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}.",
                        message: "Error retrieving self sign up preference"
                    },
                    genericError: {
                        description: "Error occurred while retrieving self sign up preference.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the self sign up preference.",
                        message: "Self sign up preference retrieval successful"
                    }
                }
            }
        },
        systemNotificationAlert: {
            resend: "Resend",
            selfSignUp: {
                awaitingAccountConfirmation: "Your account is not yet active. We've sent an " +
                    "activation link to your registered email address. Need a new link?",
                notifications: {
                    resendError: {
                        description: "Error occurred while resending the account confirmation email.",
                        message: "Something went wrong"
                    },
                    resendSuccess: {
                        description: "Successfully resent the account confirmation email.",
                        message: "Account confirmation email resent successfully"
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
                terminateActiveUserSessionModal: {
                    heading: "Terminate Current Active Sessions",
                    message:
                        "The second-factor authentication (2FA) option changes will not be applied to your active sessions. We recommend " +
                        "that you terminate them.",
                    primaryAction: "Terminate all",
                    secondaryAction: "Review and terminate"

                },
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
        },
        verificationOnUpdate: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Error getting the verification on update preference"
                    },
                    genericError: {
                        description: "Error occurred while getting the verification on update preference",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the verification on update preference",
                        message: "verification on update preference retrieval successful"
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
                            "Sign up for a Gravatar account by visiting <1>Gravatar official website</1> or use " +
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
            subTitle: "Discover and access your applications",
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
        readOnlyProfileBanner: "Your profile cannot be modified from this portal. " +
            "Please contact your administrator for more details.",
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
            description: "Manage recovery information that we can use to help you recover your password",
            emptyPlaceholderText: "No Account Recovery options available",
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
            description: "View your accounts from other connections that are linked with this account",
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
            description: "Download all your profile data including personal data, and linked accounts",
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
