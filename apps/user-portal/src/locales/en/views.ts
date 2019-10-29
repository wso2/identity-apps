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

import { Views } from "../../models";

export const views: Views = {
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
                    add: "Add a recovery email address",
                    update: "Update recovery email address ({{email}})"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label:  "Email address",
                                placeholder: "Enter the recovery email address",
                            }
                        }
                    }
                },
                heading: "Email Recovery",
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
            questionRecovery: {
                descriptions: {
                    add: "Add and update account recovery challenge questions"
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
        approvals: {
            notifications: {
                fetchApprovalDetails: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving the approval details"
                    },
                    genericError: {
                        description: "Couldn't update the approval details",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the approval details",
                        message: "Approval details retrieval successful"
                    }
                },
                fetchPendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving pending approvals"
                    },
                    genericError: {
                        description: "Couldn't retrieve pending approvals",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved pending approvals",
                        message: "Pending approvals retrieval successful"
                    }
                },
                updatePendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating the approval"
                    },
                    genericError: {
                        description: "Couldn't update the approval",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully updated the approval",
                        message: "Update successful"
                    }
                }
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
                            message: "Password reset error"
                        },
                        invalidCurrentPassword: {
                            description: "The current password you entered appears to be invalid. Please try again",
                            message: "Password reset error"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "Password reset error"
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
                    message: "Changing the password will result in the termination of the current session. You will " +
                        "have to login with the newly changed password. Do you wish to continue?"
                }
            }
        },
        consentManagement: {
            modals: {
                consentRevokeModal: {
                    heading: "Revoke {{appName}}?",
                    message: "Are you sure you want to revoke this consent? This operation is not reversible."
                },
                editConsentModal: {
                    description: {
                        collectionMethod: "Collection Method",
                        description: "Description",
                        piiCategoryHeading: "Information that you've shared with the application",
                        state: "State",
                        version: "Version"
                    }
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
                        message: "Consent Revoke Error"
                    },
                    genericError: {
                        description: "Couldn't revoke consent for the application",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The consent has been successfully revoked for the application",
                        message: "Consent Revoke Success"
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
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "Add local user account"
                }
            },
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
                }
            }
        },
        mfa: {
            fido: {
                description: "Authenticate yourself by connecting a FIDO key",
                heading: "FIDO",
                notifications: {
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Error occurred while retrieving the device"
                        },
                        genericError: {
                            description: "Error occurred while retrieving the device",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "The device was successfully registered and now you can use it as a second " +
                                "factor",
                            message: "Your Device Registered Successfully"
                        }
                    }
                }
            },
            smsOtp: {
                descriptions: {
                    hint: "You'll receive a text message containing the verification code"
                },
                heading: "SMS OTP",
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
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "Update account security"
                    },
                    description: "You are currently logged in from the following device",
                    header: "Account activity"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "Update account security"
                    },
                    description: "Settings and recommendations to help you keep your account secure",
                    header: "Account security"
                },
                accountStatus: {
                    header: "Your account status looks good!",
                    list: {
                        0: "Password health",
                        1: "Account completion",
                        2: "Signed in activities"
                    }
                },
                consentManagement: {
                    actionTitles: {
                        manage: "Manage consents"
                    },
                    description: "Control the data you want to share with applications",
                    header: "Consent control"
                }
            }
        },
        privacy: {
            about: {
                description: "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open source " +
                    "Identity Management and Entitlement Server that is based on open standards and specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS uses your IP address to detect any suspicious login attempts to your account.",
                            1: "WSO2 IS uses attributes like your first name, last name, etc., to provide a rich and" +
                                " personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1: "WSO2 IS collects your information only to serve your access requirements. For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "Collecting information from the user profile page where you enter your personal" +
                                    " data.",
                                1: "Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.",
                                2: "Tracking your geographic information with the IP address.",
                                3: "Tracking your login history with browser cookies. Please see our" +
                                    " {{cookiePolicyLink}} for more information."
                            },
                            para1: "WSO2 IS collects your information by:"
                        },
                        heading: "Tracking Technologies"
                    }
                },
                description: {
                    para1: "This policy describes how WSO2 IS captures your personal information, the purposes of" +
                        " collection, and information about the retention of your personal information.",
                    para2: "Please note that this policy is for reference only, and is applicable for the software " +
                        "as a product. WSO2 Inc. and its developers have no access to the information held within " +
                        "WSO2 IS. Please see the <1>disclaimer</1> section for more information.",
                    para3: "Entities, organisations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organisation or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees partners " +
                                "and affiliates are not a data processor or a data controller within the meaning of " +
                                "any data privacy regulations. WSO2 does not provide any warranties or undertake any " +
                                "responsibility or liability in connection with the lawfulness or the manner and " +
                                "purposes for which WSO2 IS is used by such entities or persons.",
                            1: "This privacy policy is for the informational purposes of the entity or persons " +
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
                    description: "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service Providers, " +
                        "unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description: "Please note that the organisation, entity or individual running WSO2 IS may " +
                            "be compelled to disclose your personal information with or without your consent when " +
                            "it is required by law following due and lawful process.",
                        heading: "Legal process"
                    }
                },
                heading: "Privacy Policy",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "Upgraded versions of WSO2 IS may contain changes to this policy and " +
                                "revisions to this policy will be packaged within such upgrades. Such changes " +
                                "would only apply to users who choose to use upgraded versions.",
                            para2: "The organization running WSO2 IS may revise the Privacy Policy from time to " +
                                "time. You can find the most recent governing policy with the respective link " +
                                "provided by the organization running WSO2 IS 5.5. The organization will notify " +
                                "any changes to the privacy policy over our official public channels."
                        },
                        heading: "Changes to this policy"
                    },
                    contactUs: {
                        description: {
                            para1: "Please contact WSO2 if you have any question or concerns regarding this privacy " +
                                "policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1: "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable to you.",
                            para2: "If you do not have an account and you do not agree with our privacy policy, " +
                                "you can chose not to create one."
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
                            para1: "WSO2 IS retains your personal data as long as you are an active user of our " +
                                "system. You can update your personal data at any time using the given self-care " +
                                "user portals.",
                            para2: "WSO2 IS may keep hashed secrets to provide you with an added level of security. " +
                                "This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1: "You can request the administrator to delete your account. The administrator is " +
                                "the administrator of the tenant you are registered under, or the " +
                                "super-administrator if you do not use the tenant feature.",
                            para2: "Additionally, you can request to anonymize all traces of your activities " +
                                "that WSO2 IS may have retained in logs, databases or analytical storage."
                        },
                        heading: "How to request removal of your personal information"
                    },
                    where: {
                        description: {
                            para1: "WSO2 IS stores your personal information in secured databases. WSO2 IS " +
                                "exercises proper industry accepted security measures to protect the database " +
                                "where your personal information is held. WSO2 IS as a product does not transfer " +
                                "or share your data with any third parties or locations.",
                            para2: "WSO2 IS may use encryption to keep your personal data with an added level " +
                                "of security."
                        },
                        heading: "Where your personal information is stored"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "To provide you with a personalized user experience. WSO2 IS uses your name and " +
                                "uploaded profile pictures for this purpose.",
                            1: "To protect your account from unauthorized access or potential hacking attempts. " +
                                "WSO2 IS uses HTTP or TCP/IP Headers for this purpose.",
                            2: "Derive statistical data for analytical purposes on system performance improvements. " +
                                "WSO2 IS will not keep any personal information after statistical calculations. " +
                                "Therefore, the statistical report has no means of identifying an individual person."
                        },
                        para1: "WSO2 IS will only use your personal information for the purposes for which it was " +
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
                            0: "Your user name (except in cases where the user name created by your employer is " +
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
                        para1: "WSO2 IS considers anything related to you, and by which you may be identified, as " +
                            "your personal information. This includes, but is not limited to:",
                        para2: "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        profile: {
            fields: {
                email: {
                    default: "Add email",
                    label: "Email"
                },
                mobile: {
                    default: "Add mobile number",
                    label: "Mobile number"
                },
                name: {
                    default: "Add name",
                    label: "Name"
                },
                organization: {
                    default: "Add organization",
                    label: "Organization"
                },
                username: {
                    default: "Add username",
                    label: "Username"
                }
            },
            forms: {
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "Email",
                            placeholder: "Enter your email address",
                            validations: {
                                empty: "Email address is a required field"
                            }
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "Mobile number",
                            placeholder: "Enter your mobile number",
                            validations: {
                                empty: "Mobile number is a required field"
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
            notifications: {
                getProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while retrieving the profile details",
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
                updateProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating the profile details",
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
                        description: "The required user profile details are downloaded successfully",
                        message: "User profile details downloaded successfully"
                    }
                }
            }
        },
        userSessions: {
            browserAndOS: "{{browser}} on {{os}} {{version}}",
            lastAccessed: "Last accessed {{date}}",
            modals: {
                terminateAllUserSessionsModal: {
                    heading: "Confirmation",
                    message: "This action will log you out of all the sessions on every device. Do you wish to " +
                        "continue?"
                },
                terminateUserSessionModal: {
                    heading: "Confirmation",
                    message: "This action will log you out of the session on the particular device. Do you wish to " +
                        "continue?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving user session"
                    },
                    genericError: {
                        description: "Couldn't retrieve any user sessions",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the user sessions",
                        message: "User session retrieval successful"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Couldn't terminate user sessions"
                    },
                    genericError: {
                        description: "Something went wrong while terminating user sessions",
                        message: "Couldn't terminate user sessions"
                    },
                    success: {
                        description: "Successfully terminated all user sessions",
                        message: "Terminated all user sessions"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "Couldn't terminate the user session"
                    },
                    genericError: {
                        description: "Something went wrong while terminating the user session",
                        message: "Couldn't terminate the user session"
                    },
                    success: {
                        description: "Successfully terminated the user session",
                        message: "Session terminate success"
                    }
                }
            }
        },
    },
    pages: {
        operations: {
            subTitle: "Manage and maintain tasks like pending approvals etc.",
            title: "Operations"
        },
        overview: {
            subTitle: "Manage your information, security, privacy and all the related configurations",
            title: "Welcome, {{firstName}}"
        },
        personalInfo: {
            subTitle: "Manage information about you, your sub profiles and your account in general",
            title: "Personal info"
        },
        privacy: {
            subTitle: "",
            title: "WSO2 Identity Server Privacy Policy"
        },
        security: {
            subTitle: "Update settings to make your account secure",
            title: "Security"
        },
        404: {
            subTitle: "The page you're looking for isn't here",
            title: "It looks like you're lost. :("
        },
    },
    sections: {
        accountRecovery: {
            description: "View and manage your account recovery options",
            heading: "Account Recovery"
        },
        approvals: {
            description: "You can manage pending approvals here",
            heading: "Pending approvals",
            placeholders: {
                emptyApprovalList: {
                    heading: "You don't have any {{status}} pending approvals"
                }
            }
        },
        changePassword: {
            actionTitles: {
                change: "Change your password"
            },
            description: "Change and modify the existing password",
            heading: "Change password"
        },
        consentManagement: {
            actionTitles: {
                empty: "You have not granted consent to any application"
            },
            description: "View and Manage consented applications of your account",
            heading: "Consented applications",
            placeholders: {
                emptyConsentList: {
                    heading: "You have not granted consent to any application"
                }
            },
        },
        linkedAccounts: {
            actionTitles: {
                add: "Add account"
            },
            description: "Manage all your linked accounts in one place",
            heading: "Linked accounts"
        },
        mfa: {
            description: "View and manage your multi factor authentication options",
            heading: "Multi factor authentication"
        },
        profile: {
            description: "Manage and update your basic profile information",
            heading: "Profile"
        },
        profileExport: {
            actionTitles: {
                export: "Export profile data"
            },
            description: "Download all your profile data including personal data, security questions and consents",
            heading: "Export profile"
        },
        userSessions: {
            actionTitles: {
                empty: "You do not have any active sessions",
                terminateAll: "Terminate all sessions"
            },
            description: "This is a list of devices that have been active on your account",
            heading: "Active user sessions",
            placeholders: {
                emptySessionList: {
                    heading: "There are no active sessions for this user"
                }
            },
        }
    }
};
