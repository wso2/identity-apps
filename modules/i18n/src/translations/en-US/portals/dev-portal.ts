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
import { DevPortalNS } from "../../../models";

export const devPortal: DevPortalNS = {
    components: {
        applications: {
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
            search: {
                forms: {
                    searchForm: {
                        inputs: {
                            filerAttribute: {
                                label: "Filter attribute",
                                placeholder: "E.g. name, description etc.",
                                validations: {
                                    empty: "Filter attribute is a required field"
                                }
                            },
                            filterCondition: {
                                label: "Filter condition",
                                placeholder: "E.g. Starts with etc.",
                                validations: {
                                    empty: "Filter condition is a required field"
                                }
                            },
                            filterValue: {
                                label: "Filter value",
                                placeholder: "E.g. facebook, slack etc.",
                                validations: {
                                    empty: "Filter value is a required field"
                                }
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
                placeholder: "Search by name",
                popups: {
                    clear: "clear search",
                    dropdown: "show options"
                },
                resultsIndicator: 'Showing results for the query "{{query}}"'
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
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
                    para3: "Entities, organizations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organization or individual."
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
                        description: "Please note that the organization, entity or individual running WSO2 IS may " +
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
                                "provided by the organization running WSO2 IS. The organization will notify " +
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
                            3: "Your device ID if you use a device (E.g., phone or tablet) to log in"
                        },
                        list2: {
                            0: "City/Country from which you originated the TCP/IP connection",
                            1: "Time of the day that you logged in (year, month, week, hour or minute)",
                            2: "Type of device that you used to log in (E.g., phone or tablet)",
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
        user: {
            forms: {
                addUserForm: {
                    inputs: {
                        confirmPassword: {
                            label: "Confirm password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "Confirm password is a required field",
                                mismatch: "The password confirmation doesn't match"
                            }
                        },
                        domain: {
                            label: "User store",
                            placeholder: "Select user store",
                            validations: {
                                empty: "User store name cannot be empty.",
                            }
                        },
                        email: {
                            label: "Email address",
                            placeholder: "Enter the email address",
                            validations: {
                                empty: "Email address cannot be empty",
                                invalid: "Please enter a valid email address"
                            }
                        },
                        firstName: {
                            label: "First name",
                            placeholder: "Enter your first name",
                            validations: {
                                empty: "First name is a required field"
                            }
                        },
                        lastName: {
                            label: "Last name",
                            placeholder: "Enter your last name",
                            validations: {
                                empty: "Last name is a required field"
                            }
                        },
                        newPassword: {
                            label: "New password",
                            placeholder: "Enter the new password",
                            validations: {
                                empty: "New password is a required field"
                            }
                        },
                        username: {
                            label: "Username",
                            placeholder: "Enter the username",
                            validations: {
                                empty: "Username is a required field",
                                invalid: "Username is invalid"
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
                addUserWarnModal: {
                    heading: "Warning",
                    message: "Please note that this created user will not be assigned with a role. If you wish to " +
                        "assign roles to this user please click on the button below."
                }
            },
            profile: {
                fields: {
                    /* eslint-disable @typescript-eslint/camelcase */
                    addresses_home: "Home address",
                    addresses_work: "Work address",
                    emails: "Email",
                    emails_home: "Home email",
                    emails_other: "Other email",
                    emails_work: "Work email",
                    generic: {
                        default: "Add {{fieldName}}"
                    },
                    name_familyName: "Last name",
                    name_givenName: "First name",
                    phoneNumbers: "Phone number",
                    phoneNumbers_home: "Home phone number",
                    phoneNumbers_mobile: "Mobile number",
                    phoneNumbers_other: "Other phone number",
                    phoneNumbers_work: "Work phone number",
                    profileUrl: "URL",
                    userName: "Username"
                    /* eslint-enable @typescript-eslint/camelcase */
                },
                forms: {
                    emailChangeForm: {
                        inputs: {
                            email: {
                                label: "Email",
                                note: "NOTE: This will change the email address in your profile",
                                placeholder: "Enter your email address",
                                validations: {
                                    empty: "Email address is a required field",
                                    invalidFormat: "The email address is not of the correct format"
                                }
                            }
                        }
                    },
                    generic: {
                        inputs: {
                            placeholder: "Enter your {{fieldName}}",
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
                                    invalidFormat: "The mobile number is not of the right format"
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
            }
        },
        users: {
            all: {
                heading: "Users",
                subHeading: "Add and manage user accounts, assign roles to the users and maintain user identities."
            },
            buttons: {
                assignUserRoleBtn: "Assign roles"
            },
            notifications: {
                addUser: {
                    error: {
                        description: "{{description}}",
                        message: "Error adding the new user"
                    },
                    genericError: {
                        description: "Couldn't add the new user",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The new user was added successfully.",
                        message: "User added successfully"
                    }
                },
                deleteUser: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the user"
                    },
                    genericError: {
                        description: "Couldn't delete the user",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The user was deleted successfully.",
                        message: "User deleted successfully"
                    }
                },
                fetchUsers: {
                    error: {
                        description: "{{description}}",
                        message: "Error retrieving users"
                    },
                    genericError: {
                        description: "Couldn't retrieve users",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Successfully retrieved the users.",
                        message: "Users retrieval successful"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Refresh list",
                    subtitles: {
                        0: "The users list returned empty.",
                        1: "Something went wrong while fetching the user list",
                    },
                    title: "No Users Found"
                }
            },
            search: {
                forms: {
                    searchForm: {
                        inputs: {
                            filerAttribute: {
                                label: "Filter attribute",
                                placeholder: "E.g. username, email etc.",
                                validations: {
                                    empty: "Filter attribute is a required field"
                                }
                            },
                            filterCondition: {
                                label: "Filter condition",
                                placeholder: "E.g. Starts with etc.",
                                validations: {
                                    empty: "Filter condition is a required field"
                                }
                            },
                            filterValue: {
                                label: "Filter value",
                                placeholder: "Enter value to search",
                                validations: {
                                    empty: "Filter value is a required field"
                                }
                            },
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
                    header: "Advanced search",
                },
                placeholder: "Search by  user name",
                popups: {
                    clear: "clear search",
                    dropdown: "show options"
                },
                resultsIndicator: "Showing results for the query \"{{query}}\""
            }
        },
        roles: {
            edit: {
                basics: {
                    fields: {
                        roleName: "Role Name"
                    }
                }
            },
            notifications: {
                deleteRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error deleting the selected role."
                    },
                    genericError: {
                        description: "Couldn't remove the selected role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected role was deleted successfully.",
                        message: "Role deleted successfully"
                    }
                },
                updateRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error updating the selected role."
                    },
                    genericError: {
                        description: "Couldn't update the selected role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The selected role was updated successfully.",
                        message: "Role updated successfully"
                    }
                },
                createRole: {
                    error: {
                        description: "{{description}}",
                        message: "Error occured while creating the role."
                    },
                    genericError: {
                        description: "Couldn't create the role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The role was created successfully.",
                        message: "Role created successfully."
                    }
                },
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "Error occured while adding permission to role."
                    },
                    genericError: {
                        description: "Couldn't add permissions to role.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Permissions were successfully added to the role.",
                        message: "Role created successfully."
                    }
                }
            }
        },
        serverConfigs: {
            selfRegistration: {
                actionTitles: {
                    config: "Configure"
                },
                description: "Configure how the User Self Registration should happen with your users.",
                heading: "User Self Registration",
                confirmation: {
                    heading: "Confirmation",
                    message: "Do you wish to save the configurations related to user self registration?"
                },
                notifications: {
                    updateConfigurations: {
                        error: {
                            description: "An error occurred while updating the self sign up configurations.",
                            message: "Error updating the configurations"
                        },
                        genericError: {
                            description: "Couldn't update the self sign up configurations.",
                            message: "Something went wrong"
                        },
                        success: {
                            description: "Successfully updated the self sign up configurations.",
                            message: "Configurations updated successfully"
                        }
                    }
                },
                form: {
                    enable: {
                        label: "Enable User Self Registration",
                    },
                    enableAccountLockOnCreation: {
                        label: "Enable Account Lock On Creation"
                    },
                    internalNotificationManagement: {
                        label: "Internal Notification Management"
                    },
                    enableReCaptcha: {
                        label: "Enable reCaptcha"
                    },
                    verificationLinkExpiryTime: {
                        label: "User self registration verification link expiry time",
                        placeholder: "Set the number of minutes for the self registration verification e-mail would be valid.",
                        validations: {
                            empty: "User self registration verification link expiry time is required."
                        }
                    },
                    smsOTPExpiryTime: {
                        label: "User self registration SMS OTP expiry time",
                        placeholder: "Set the number of minutes that the SMS OTP would be valid.",
                        validations: {
                            empty: "User self registration SMS OTP expiry time is required."
                        }
                    },
                    callbackURLRegex: {
                        label: "User self registration callback URL regex",
                        placeholder: "User self registration callback URL regex.",
                        validations: {
                            empty: "User self registration callback URL regex is required."
                        }
                    }
                }
            },
            accountRecovery: {
                actionTitles: {
                    config: "Configure"
                },
                description: "Configure how account recovery should happen with your users.",
                heading: "Account Recovery",
                usernameRecovery: {
                    actionTitles: {
                        config: "Configure"
                    },
                    description: "Configure how username recovery should happen with your users.",
                    heading: "Username Recovery",
                    form: {
                        enable: {
                            label: "Enable Username Recovery"
                        },
                        enableReCaptcha: {
                            label: "Enable reCaptcha for Username Recovery"
                        }
                    }
                },
                passwordRecovery: {
                    actionTitles: {
                        config: "Configure"
                    },
                    description: "Configure how password recovery should happen with your users.",
                    heading: "Password Recovery",
                    form: {
                        enableNotificationBasedRecovery: {
                            label: "Enable Notification Based Password Recovery"
                        },
                        enableReCaptchaBasedRecovery: {
                            label: "Enable reCaptcha for Password Recovery"
                        },
                        enableSecurityQuestionBasedRecovery: {
                            label: "Enable Security Question Based Password Recovery"
                        },
                        noOfQuestionsRequired: {
                            label: "Number Of Questions Required For Password Recovery",
                            hint: "The user will have to successfully answer this number of security questions to recover the password.",
                            validations: {
                                empty: "Number Of Questions Required For Password Recovery is required."
                            }
                        },
                        enableReCaptchaForSecurityQuestionBasedRecovery: {
                            label: "Enable reCaptcha for Security Questions Based Password Recovery",
                            hint: "Show captcha for challenge question based password recovery"
                        },
                    }
                },
                otherSettings: {
                    form: {
                        reCaptchaMaxFailedAttempts: {
                            label: "Max Failed Attempts for ReCaptcha",
                            validations: {
                                empty: "Max Failed Attempts for ReCaptcha is required."
                            }
                        },
                        enableInternalNotificationManagement: {
                            label: "Enable Internal Notification Management",
                            hint: "Set false if the client application handles notification sending"
                        },
                        notifyRecoverySuccess: {
                            label: "Notify when Recovery Success"
                        },
                        notifyQuestionRecoveryStart: {
                            label: "Notify when Questions Based Recovery Starts"
                        },
                        recoveryLinkExpiryTime: {
                            label: "Recovery Link Expiry Time",
                            hint: "Specify the time to expire the recovery link in minutes.",
                            validations: {
                                empty: "Number Of Questions Required For Password Recovery is required."
                            }
                        },
                        smsOTPExpiryTime: {
                            label: "SMS OTP Expiry Time",
                            hint: "Specify the time to expire the SMS OTP in minutes.",
                            validations: {
                                empty: "Number Of Questions Required For Password Recovery is required."
                            }
                        },
                        recoveryCallbackURLRegex: {
                            label: "Recovery callback URL regex",
                            hint: "TODO",
                            validations: {
                                empty: "Recovery callback URL regex is required."
                            }
                        },
                    }
                }
            }
        }
    },
    pages: {
        overView: {
            subTitle: "The following section would give you an overview of the system statistics",
            title: "Welcome, {{firstName}}"
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
        underConstruction: {
            action: "Back to home",
            subtitles: {
                0: "We're doing some work on this page.",
                1: "Please bare with us and come back later. Thank you for your patience."
            },
            title: "Page under construction"
        }
    }
};
