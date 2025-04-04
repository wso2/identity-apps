/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { userNS } from "../../../models";

/**
 * NOTE: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const user: userNS = {
    deleteJITUser: {
        confirmationModal: {
            content: "If you delete this user, the user will not be able to log in to My Account or any " +
                "other application to which the user was subscribed to until the next time the user " +
                "signs in using a social login option."
        }
    },
    deleteUser: {
        confirmationModal: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this user, the user will not be able to log in to My Account or " +
                "any other application the user was subscribed to before. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will permanently delete the user."
        }
    },
    disableUser: {
        confirmationModal: {
            assertionHint: "Please confirm your action.",
            content: "If you disable this user, the user will not be able to log in to My Account or " +
                "any other application the user was subscribed to before.",
            header: "Are you sure?",
            message: "Make sure that the user no longer requires access to the system."
        }
    },
    editUser: {
        dangerZoneGroup: {
            deleteAdminPriviledgeZone: {
                actionTitle: "Revoke Privileges",
                header: "Revoke admin privileges",
                subheader: "This action will remove the user's admin privileges, " +
                    "but the user will continue to be in the organization."
            },
            deleteUserZone: {
                actionTitle: "Delete User",
                buttonDisableHint: "Delete option is disabled because this user is managed in a Read Only user store.",
                header: "Delete user",
                subheader: "This action will permanently delete the user from the organization. Please " +
                    "be certain before you proceed."
            },
            disableUserZone: {
                actionTitle: "Disable User",
                header: "Disable user",
                subheader: "Once you disable an account, the user cannot access the system."
            },
            header: "Danger Zone",
            lockUserZone: {
                actionTitle: "Lock User",
                disabledHint: "To lock/unlock the user account, please enable the account first.",
                header: "Lock user",
                subheader: "Once you lock the account, the user can no longer log in to the system."
            },
            passwordResetZone: {
                actionTitle: "Reset Password",
                buttonHint: "This user account should be unlocked to reset the password.",
                header: "Reset password",
                subheader: "Once you change the password, the user will no longer be able to log in to " +
                    "any application using the current password."
            }
        },
        dateOfBirth: {
            placeholder: {
                part1:"Enter the",
                part2: "in the format YYYY-MM-DD"
            }
        },
        userActionZoneGroup: {
            header: "User Action",
            impersonateUserZone: {
                actionTitle: "Impersonate User",
                header: "Impersonate User",
                subheader: "Once Started impersonating a user, the initiator no longer be able to login with their identity until they terminate the existing session."
            }
        }
    },
    forms: {
        addUserForm: {
            buttons: {
                radioButton: {
                    label: "Select the method to set the user password",
                    options: {
                        askPassword: "Invite the user to set their own password",
                        createPassword: "Set a password for the user"

                    }
                }
            },
            inputs: {
                confirmPassword: {
                    label: "Confirm Password",
                    placeholder: "Enter the new password",
                    validations: {
                        empty: "Confirm password is a required field",
                        mismatch: "The password confirmation doesn't match"
                    }
                },
                domain: {
                    label: "User Store",
                    placeholder: "Select user store",
                    validations: {
                        empty: "User store name cannot be empty."
                    }
                },
                email: {
                    label: "Email Address",
                    placeholder: "Enter the email address",
                    validations: {
                        empty: "Email address cannot be empty",
                        invalid: "Please enter a valid email address. You can use alphanumeric " +
                            "characters, unicode characters, underscores (_), dashes (-), periods (.), " +
                            "and an at sign (@)."
                    }
                },
                firstName: {
                    label: "First Name",
                    placeholder: "Enter the first name",
                    validations: {
                        empty: "First name is a required field"
                    }
                },
                lastName: {
                    label: "Last Name",
                    placeholder: "Enter the last name",
                    validations: {
                        empty: "Last name is a required field"
                    }
                },
                newPassword: {
                    label: "Password",
                    placeholder: "Enter the password",
                    validations: {
                        empty: "Password is a required field",
                        regExViolation: "Please enter a valid password"
                    }
                },
                username: {
                    hint: {
                        defaultRegex: "Must be a 3-50 character string without spaces, '*', '?', or '%', and can include letters, numbers, and other symbols."
                    },
                    label: "Username",
                    placeholder: "Enter the username",
                    validations: {
                        customRegex: "The username must match the following regular expression: {{regex}}",
                        defaultRegex: "The username must be 3-50 characters long and cannot contain spaces, '*', '?', or '%'.",
                        empty: "Username is a required field",
                        invalid: "A user already exists with this username.",
                        invalidCharacters: "Username seems to contain invalid characters.",
                        regExViolation: "Please enter a valid username."
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
                    description: "The password has been changed successfully.",
                    message: "Password reset successful"
                }
            }
        }
    },
    lockUser: {
        confirmationModal: {
            assertionHint: "Please confirm your action.",
            content: "If you lock this account, the user will not be able to sign in to " +
                "any of the business applications. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action locks the user account."
        }
    },
    modals: {
        addUserWarnModal: {
            heading: "Warning",
            message: "Please note that this created user will not be assigned with a role. If you " +
                "wish to assign roles to this user please click on the button below."
        },
        addUserWizard: {
            askPassword: {
                alphanumericUsernameEnabled: "To invite users to set the password, disable " +
                    "alphanumeric username feature.",
                emailInvalid: "To invite users to set the password, please enter a valid email address.",
                emailVerificationDisabled: "To invite users to set the password, enable email invitations " +
                    "for user password setup from <1>Login & Registration settings</1>.",
                inviteOffline: "Invite offline",
                inviteViaEmail: "Invite via email"
            },
            buttons: {
                next: "Next",
                previous: "Previous",
                saveAndContinue: "Save & Continue"
            },
            steps: {
                basicDetails: "Basic Details",
                groups: "User Groups",
                invitation: "Invitation",
                method: "Method",
                roles: "User Roles"
            },
            subTitle: "Follow the steps to create the new user",
            title: "Create User",
            wizardSummary: {
                domain: "User Store",
                groups: "Group(s)",
                name: "Name",
                passwordOption: {
                    label: "Password option",
                    message: {
                        0: "An email will be sent to {{email}} with the link to set the password.",
                        1: "The password was set by the administrator."
                    }
                },
                roles: "Role(s)",
                username: "Username"
            }
        },
        bulkImportUserWizard: {
            buttons: {
                import: "Import"
            },
            sidePanel: {
                fileBased: "File Based",
                fileFormatContent: "Headers of the CSV file should be user attributes that are " +
                "mapped to <1>local attributes</1>.",
                fileFormatSampleHeading: "Sample CSV file format:",
                fileFormatTitle: "CSV File Format",
                manual: "Manual"
            },
            subTitle: "Add multiple users manually or using a CSV file.",
            title: "Add multiple users",
            wizardSummary: {
                advanceSearch: {
                    roleGroupFilterAttributePlaceHolder: "Group Name",
                    searchByGroup: "Search by Group",
                    searchByUsername: "Search by Username"
                },
                alerts: {
                    importFailed: {
                        groupAssignment: "Issues encountered in <1>{{failedUserAssignmentCount}} group " +
                            "assignment(s)</1>. Users in the affected groups were created but not assigned. " +
                            "Please navigate to User Management section to review  and assign groups to " +
                            "the users.",
                        message: "Review Required",
                        userCreation: "Issues encountered in <1>{{failedUserCreationCount}} user " +
                            "creation operations(s)</1>"
                    },
                    importSuccess: {
                        description: "The user accounts were imported successfully.",
                        message: "Import Successful"
                    }
                },
                failedCount: "Failed Imports",
                fileBased: {
                    hint: "Bulk invite multiple users using a CSV file."
                },
                inviteEmailInfo: "An email with a confirmation link will be " +
                    "sent to the provided email address for the user to set their own password.",
                manualCreation: {
                    alerts: {
                        creationSuccess: {
                            description: "The user accounts were created successfully.",
                            message: "User Creation Successful"
                        }
                    },
                    disabledHint: "The manual option is disabled due to the usage of " +
                        "alphanumeric usernames in your organization.",
                    emailsLabel: "Emails",
                    emailsPlaceholder: "Enter email addresses",
                    groupsLabel: "Groups",
                    groupsPlaceholder: "Enter groups",
                    hint: "Add the email address of the user you wish to invite and press enter.",
                    primaryButton: "Add",
                    upload: {
                        buttonText: "Upload CSV File",
                        description: "Drag and drop a CSV file here."
                    },
                    warningMessage: "This option can only be used when email address is configured " +
                        "as the username."
                },
                responseOperationType: {
                    roleAssignment: "Group Assignment",
                    userCreation: "User Creation"
                },
                successCount: "Successful Imports",
                tableHeaders: {
                    message: "Message",
                    status: "Status",
                    username: "Username"
                },
                tableMessages: {
                    internalErrorMessage: "Error occured while importing users",
                    invalidDataMessage: "Invalid data provided",
                    invalidUserNameFormatMessage: "Username does not match the specified format",
                    userAlreadyExistsMessage: "User already exists",
                    userAssignmentFailedMessage: "User assignment to {{resource}} failed",
                    userAssignmentInternalErrorMessage: "An error occurred while assigning users to " +
                        "{{resource}}",
                    userAssignmentSuccessMessage: "Users were successfully assigned to {{resource}}",
                    userCreatedMessage: "User imported successfully",
                    userCreationAcceptedMessage: "User creation accepted"
                },
                tableStatus: {
                    failed: "Failed",
                    success: "Success",
                    warning: "Warning"
                },
                totalUserAssignmentCount: "Total group assigment count ",
                totalUserCreationCount: "Total user creation count",
                userstoreMessage: "The created users will be added to the <1>{{ userstore }}</1> user store."
            }
        },
        changePasswordModal: {
            button: "Reset Password",
            header: "Reset User Password",
            hint: {
                forceReset: "WARNING: Please note that after inviting the user to change the password " +
                    "the user will no longer be able to log into any application using the current " +
                    "password. The password reset link will be valid for {{codeValidityPeriod}} minutes.",
                setPassword: "WARNING: Please note that after changing the password the user will " +
                    "no longer be able to log into any application using the current password."
            },
            message: "WARNING: Please note that after changing the password the user will no longer be " +
                "able to log into any application using the current password.",
            passwordOptions: {
                forceReset: "Invite user to reset the password",
                setPassword: "Set a new password for the user"
            }
        },
        inviteParentUserWizard: {
            errorAlert: {
                description: "An error occurred while inviting {{ failedCount }} user(s).",
                message: "Review Required"
            },
            successAlert: {
                description: "Successfully invited the user(s).",
                message: "Invitation(s) Sent"
            },
            tableMessages: {
                activeInvitationExists: "An active invitation for the user already exists",
                userAlreadyExist: "User already exists",
                userEmailNotFound: "Could not find the email of the invited user",
                userNotFound: "User not found"
            },
            totalInvitations: "Total Invitation(s)"
        }
    },
    profile: {
        accountDisabled: "The account has been disabled by an administrator.",
        accountLockReason: {
            adminInitiated: "The account has been manually locked by an administrator.",
            default: "The account is locked.",
            maxAttemptsExceeded: "The account is locked due to multiple failed login attempts.",
            pendingAdminForcedUserPasswordReset: "The account is locked until the user completes an " +
                "administrator-initiated password reset.",
            pendingAskPassword: "The account is locked until the user creates a password via the setup email sent.",
            pendingEmailVerification: "The account is locked and requires email verification from the " +
                "user to be activated.",
            pendingSelfRegistration: "The account is locked pending user verification via the self-registration email."
        },
        confirmationModals: {
            deleteAttributeConfirmation: {
                assertionHint: "Please confirm your action.",
                content: "This action is irreversible and will permanently delete the {{attributeDisplayName}}.",
                description: "If you delete this {{attributeDisplayName}}, it will be permanently removed from the user profile.",
                heading: "Are you sure?"
            }
        },
        fields: {
            createdDate: "Created Date",
            emails: "Email",
            generic: {
                default: "Add {{fieldName}}"
            },
            modifiedDate: "Modified Date",
            name_familyName: "Last Name",
            name_givenName: "First Name",
            oneTimePassword: "One Time Password",
            phoneNumbers: "Phone Number",
            photos: "Photos",
            profileUrl: "URL",
            userId: "User ID",
            userName: "Username"
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
                    dropdownPlaceholder: "Select your {{fieldName}}",
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
            changeUserPassword: {
                error: {
                    description: "{{description}}",
                    message: "Error while changing user password."
                },
                genericError: {
                    description: "Error occurred while changing the user password.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The password of the user was changed successfully.",
                    message: "Successfully changed password"
                }
            },
            disableUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while disabling the user account."
                },
                genericError: {
                    description: "Error occurred while disabling the user account.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The user account disabled successfully.",
                    genericMessage: "Account is disabled",
                    message: "{{name}}'s account is disabled"
                }
            },
            enableUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while enabling the user account."
                },
                genericError: {
                    description: "Error occurred while enabling the user account.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The user account enabled successfully.",
                    genericMessage: "Account is enabled",
                    message: "{{name}}'s account is enabled"
                }
            },
            forcePasswordReset: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while triggering the password reset flow."
                },
                genericError: {
                    description: "Error occurred while triggering the password reset flow.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Password reset is successfully initiated for the user account.",
                    message: "Initiated password reset"
                }
            },
            getProfileInfo: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while retrieving the profile details"
                },
                genericError: {
                    description: "Error occurred while retrieving the profile details.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The required user profile details are retrieved successfully.",
                    message: "Successfully retrieved user profile"
                }
            },
            lockUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while locking the user account."
                },
                genericError: {
                    description: "Error occurred while locking the user account.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The user account locked successfully.",
                    genericMessage: "Account is locked",
                    message: "{{name}}'s account is locked"
                }
            },
            noPasswordResetOptions: {
                error: {
                    description: "None of the force password options are enabled.",
                    message: "Unable to trigger a force password reset"
                }
            },
            unlockUserAccount: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while unlocking the user account."
                },
                genericError: {
                    description: "Error occurred while unlocking the user account.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The user account unlocked successfully.",
                    genericMessage: "Account is unlocked",
                    message: "{{name}}'s account is unlocked"
                }
            },
            updateProfileInfo: {
                error: {
                    description: "{{description}}",
                    message: "Error occurred while updating the profile details"
                },
                genericError: {
                    description: "Error occurred while updating the profile details.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The required user profile details were successfully updated.",
                    message: "User profile updated successfully"
                }
            },
            verifyEmail: {
                error: {
                    description: "{{description}}",
                    message: "An error occurred while sending the verification email."
                },
                genericError: {
                    description: "An error occurred while sending the verification email.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The verification email was sent successfully.",
                    message: "Verification email sent successfully"
                }
            },
            verifyMobile: {
                error: {
                    description: "{{description}}",
                    message: "An error occurred while sending the verification code."
                },
                genericError: {
                    description: "An error occurred while sending the verification code.",
                    message: "Something went wrong"
                },
                success: {
                    description: "The verification code was sent successfully.",
                    message: "Verification code sent successfully"
                }
            }
        },
        placeholders: {
            SCIMDisabled: {
                heading: "This feature is not available for your account"
            },
            userProfile: {
                emptyListPlaceholder: {
                    subtitles: "The profile information is not available for this user.",
                    title: "No profile information"
                }
            }
        },
        tooltips: {
            confirmationPending: "Confirmation pending!"
        }
    },
    revokeAdmin: {
        confirmationModal: {
            assertionHint: "Please confirm your action.",
            content: "If you revoke the admin privileges of this user, the user will not be able " +
                "to log into the Asgardeo console and " +
                "will not be able to perform admin operations. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action will revoke the admin privileges of the user."
        }
    },
    updateUser: {
        groups: {
            addGroupsModal: {
                heading: "Update User Groups",
                subHeading: "Add new groups or remove existing groups assigned to the user."
            },
            editGroups: {
                groupList: {
                    emptyListPlaceholder: {
                        subTitle: {
                            0: "There are no groups assigned to the user at the moment.",
                            1: "This might restrict user from performing certain",
                            2: "tasks like accessing certain applications."
                        },
                        title: "No Groups Assigned"
                    },
                    headers: {
                        0: "Domain",
                        1: "Name"
                    }
                },
                heading: "Assigned Groups",
                popups: {
                    viewPermissions: "View Permissions"
                },
                searchPlaceholder: "Search groups",
                subHeading: "Add or remove the groups user is assigned with and note that this will " +
                    "affect performing certain tasks."
            },
            notifications: {
                addUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating user groups"
                    },
                    genericError: {
                        description: "An error occurred while updating user groups.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Assigning new groups for the user successful.",
                        message: "Update user groups successful"
                    }
                },
                fetchUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while fetching the groups list"
                    },
                    genericError: {
                        description: "Error occurred while fetching the groups list.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The groups list was successfully retrieved.",
                        message: "User groups list retrieved successfully"
                    }
                },
                removeUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating the groups of the user"
                    },
                    genericError: {
                        description: "An error occurred while updating user groups.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Removing assigned groups for the user successful.",
                        message: "Update user groups successful"
                    }
                },
                updateUserGroups: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating user groups"
                    },
                    genericError: {
                        description: "An error occurred while updating user groups.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Updating assigned groups for the user successful.",
                        message: "Update user groups successful"
                    }
                }
            }
        },
        roles: {
            addRolesModal: {
                heading: "Update User Roles",
                subHeading: "Add new roles or remove existing roles assigned to the user."
            },
            editRoles: {
                confirmationModal: {
                    assertionHint: "Please confirm your action.",
                    content: "Modifying the role will result in the user either losing " +
                        "or gaining access to certain features. Please proceed with caution.",
                    header: "Are you sure?",
                    message: "This action will modify the role of this user."
                },
                heading: "Assigned Roles",
                infoMessage: "Roles inherited via groups are not shown here.",
                placeholders: {
                    emptyPlaceholder: {
                        subtitles: "There are no roles assigned to the user at the moment.",
                        title: "No roles assigned"
                    }
                },
                popups: {
                    viewPermissions: "View Permissions"
                },
                roleList: {
                    emptyListPlaceholder: {
                        subTitle: {
                            0: "There are no roles assigned to the user at the moment.",
                            1: "This might restrict user from performing certain",
                            2: "tasks like accessing certain applications."
                        },
                        title: "No Roles Assigned"
                    },
                    headers: {
                        0: "Domain",
                        1: "Name"
                    }
                },
                searchPlaceholder: "Search Roles",
                subHeading: "View roles assigned directly to the user."
            },
            notifications: {
                addUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating user roles"
                    },
                    genericError: {
                        description: "An error occurred while updating user roles.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Assigning new roles for the user successful.",
                        message: "Update user roles successful"
                    }
                },
                fetchUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while fetching the roles list"
                    },
                    genericError: {
                        description: "Error occurred while fetching the roles list.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "The roles list was successfully retrieved.",
                        message: "User roles list retrieved successfully"
                    }
                },
                removeUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating the roles of the user"
                    },
                    genericError: {
                        description: "An error occurred while updating user roles.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Removing assigned roles for the user successful.",
                        message: "Update user roles successful"
                    }
                },
                updateUserRoles: {
                    error: {
                        description: "{{description}}",
                        message: "Error occurred while updating the roles of the user"
                    },
                    genericError: {
                        description: "An error occurred while updating user roles.",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Updating assigned roles for the user successful.",
                        message: "Update user roles successful"
                    }
                }
            },
            viewPermissionModal: {
                backButton: "Back to list",
                editButton: "Edit Permissions",
                heading: "Permissions for {{role}}"
            }
        }
    }
};
