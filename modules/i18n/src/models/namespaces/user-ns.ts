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
export interface userNS {
    deleteJITUser: {
        confirmationModal: {
            content: string;
        };
    };
    deleteUser: {
        confirmationModal: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    revokeAdmin: {
        confirmationModal: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    disableUser: {
        confirmationModal: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    editUser: {
        dangerZoneGroup: {
            header: string;
            deleteUserZone: {
                actionTitle: string;
                header: string;
                subheader: string;
                buttonDisableHint: string;
            };
            disableUserZone: {
                actionTitle: string;
                header: string;
                subheader: string;
            };
            lockUserZone: {
                actionTitle: string;
                header: string;
                subheader: string;
                disabledHint: string;
            };
            passwordResetZone: {
                actionTitle: string;
                header: string;
                subheader: string;
                buttonHint: string;
            };
            passwordSetZone: {
                actionTitle: string;
                header: string;
                subheader: string;
            };
            deleteAdminPriviledgeZone: {
                actionTitle: string;
                header: string;
                subheader: string;
            };
        };
        dateOfBirth: {
            placeholder: {
                part1: string;
                part2: string;
            };
        };
        userActionZoneGroup: {
            impersonateUserZone: {
                actionTitle: string;
                buttonDisableHints: {
                    insufficientPermissions: string;
                    myAccountDisabled: string;
                    myAccountLoginFlowIncompatible: string;
                    userAccountDisabled: string;
                    userAccountLocked: string;
                };
                header: string;
                subheader: string;
            };
        };
    };
    forms: {
        addUserForm: {
            buttons: {
                radioButton: {
                    label: string;
                    options: {
                        createPassword: string;
                        askPassword: string;
                    };
                };
            };
            inputs: {
                confirmPassword: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        mismatch: string;
                    };
                };
                firstName: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                lastName: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                username: {
                    hint: {
                        defaultRegex: string;
                    }
                    label: string;
                    placeholder: string;
                    validations: {
                        customRegex: string;
                        defaultRegex: string;
                        empty: string;
                        invalid: string;
                        invalidCharacters: string;
                        regExViolation: string;
                    };
                };
                newPassword: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        regExViolation: string;
                    };
                };
                domain: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                    };
                };
                email: {
                    label: string;
                    placeholder: string;
                    validations: {
                        empty: string;
                        invalid: string;
                    };
                };
            };
            validations: {
                genericError: {
                    description: string;
                    message: string;
                };
                invalidCurrentPassword: {
                    description: string;
                    message: string;
                };
                submitError: {
                    description: string;
                    message: string;
                };
                submitSuccess: {
                    description: string;
                    message: string;
                };
            };
        };
    };
    lockUser: {
        confirmationModal: {
            assertionHint: string;
            header: string;
            message: string;
            content: string;
        };
    };
    modals: {
        addUserWarnModal: {
            heading: string;
            message: string;
        };
        addUserWizard: {
            title: string;
            subTitle: string;
            askPassword: {
                emailVerificationDisabled: string;
                emailInvalid: string;
                alphanumericUsernameEnabled: string;
                inviteViaEmail: string;
                inviteOffline: string;
            };
            steps: {
                basicDetails: string;
                roles: string;
                groups: string;
                invitation: string;
                method: string;
            };
            buttons: {
                next: string;
                previous: string;
                saveAndContinue: string;
            };
            wizardSummary: {
                name: string;
                groups: string;
                roles: string;
                username: string;
                domain: string;
                passwordOption: {
                    label: string;
                    message: {
                        0: string;
                        1: string;
                    };
                };
            };
        };
        bulkImportUserWizard: {
            title: string;
            subTitle: string;
            wizardSummary: {
                inviteEmailInfo: string;
                successCount: string;
                failedCount: string;
                totalUserCreationCount: string;
                totalUserAssignmentCount: string;
                tableHeaders: {
                    username: string;
                    status: string;
                    message: string;
                };
                tableMessages: {
                    userCreatedMessage: string;
                    invalidDataMessage: string;
                    invalidUserNameFormatMessage: string;
                    userAlreadyExistsMessage: string;
                    userCreationAcceptedMessage: string;
                    internalErrorMessage: string;
                    userAssignmentSuccessMessage: string;
                    userAssignmentFailedMessage: string;
                    userAssignmentInternalErrorMessage: string;
                };
                tableStatus: {
                    success: string;
                    warning: string;
                    failed: string;
                };
                alerts: {
                    importSuccess: {
                        message: string;
                        description: string;
                    };
                    importFailed: {
                        message: string;
                        userCreation: string;
                        groupAssignment: string;
                    };
                };
                advanceSearch: {
                    searchByUsername: string;
                    searchByGroup: string;
                    roleGroupFilterAttributePlaceHolder: string;
                };
                manualCreation: {
                    alerts: {
                        creationSuccess: {
                            message: string;
                            description: string;
                        };
                    };
                    hint: string;
                    emailsLabel: string;
                    emailsPlaceholder: string;
                    disabledHint: string;
                    upload: {
                        buttonText: string;
                        description: string;
                    };
                    primaryButton: string;
                    groupsLabel: string;
                    groupsPlaceholder: string;
                    warningMessage: string;
                };
                fileBased: {
                    hint: string;
                };
                responseOperationType: {
                    userCreation: string;
                    roleAssignment: string;
                };
                userstoreMessage: string;
            };
            buttons: {
                import: string;
            };
            sidePanel: {
                manual: string;
                fileBased: string;
                fileFormatTitle: string;
                fileFormatContent: string;
                fileFormatSampleHeading: string;
            };
        };
        inviteParentUserWizard: {
            totalInvitations: string;
            successAlert: {
                message: string;
                description: string;
            };
            errorAlert: {
                message: string;
                description: string;
            };
            tableMessages: {
                userNotFound: string;
                activeInvitationExists: string;
                userEmailNotFound: string;
                userAlreadyExist: string;
            };
        };
        changePasswordModal: {
            header: string;
            message: string;
            hint: {
                setPassword: string;
                forceReset: string;
            };
            passwordOptions: {
                setPassword: string;
                forceReset: string;
            };
            button: string;
        };
        setPasswordModal: {
            header: string;
            message: string;
            button: string;
        };
    };
    profile: {
        confirmationModals: {
            deleteAttributeConfirmation: {
                assertionHint: string;
                content: string;
                description: string;
                heading: string;
            }
        },
        accountDisabled: string;
        accountLockReason: {
            adminInitiated: string;
            default: string;
            maxAttemptsExceeded: string;
            pendingAdminForcedUserPasswordReset: string;
            pendingAskPassword: string;
            pendingEmailVerification: string;
            pendingSelfRegistration: string;
        };
        accountState: {
            pendingAskPassword: string;
        };
        fields: {
            createdDate: string;
            generic: {
                default: string;
            };
            userId: string;
            emails: string;
            modifiedDate: string;
            profileUrl: string;
            name_familyName: string;
            name_givenName: string;
            phoneNumbers: string;
            photos: string;
            oneTimePassword: string;
            userName: string;
        };
        forms: {
            generic: {
                inputs: {
                    placeholder: string;
                    dropdownPlaceholder: string;
                    validations: {
                        empty: string;
                        invalidFormat: string;
                        required: string;
                    };
                };
            };
            emailChangeForm: {
                inputs: {
                    email: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                            invalidFormat: string;
                        };
                        note: string;
                    };
                };
            };
            email: {
                primaryEmail: {
                    validations: {
                        empty: string;
                    }
                };
            };
            mobile: {
                primaryMobile: {
                    validations: {
                        empty: string;
                    }
                };
            };
            mobileChangeForm: {
                inputs: {
                    mobile: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                            invalidFormat: string;
                        };
                        note: string;
                    };
                };
            };
            nameChangeForm: {
                inputs: {
                    firstName: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                    lastName: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                };
            };
            organizationChangeForm: {
                inputs: {
                    organization: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                };
            };
        };
        notifications: {
            getProfileInfo: {
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
            updateProfileInfo: {
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
            lockUserAccount: {
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
                    genericMessage: string;
                };
            };
            unlockUserAccount: {
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
                    genericMessage: string;
                };
            };
            disableUserAccount: {
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
                    genericMessage: string;
                };
            };
            enableUserAccount: {
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
                    genericMessage: string;
                };
            };
            setUserPassword: {
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
            changeUserPassword: {
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
            forcePasswordReset: {
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
            noPasswordResetOptions: {
                error: {
                    message: string;
                    description: string;
                };
            };
            verifyEmail: {
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
            verifyMobile: {
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
            resendCode: {
                genericError: {
                    message: string;
                    description: string;
                };
                success: {
                    message: string;
                    description: string;
                };
            };
        };
        placeholders: {
            SCIMDisabled: {
                heading: string;
            };
            userProfile: {
                emptyListPlaceholder: {
                    title: string;
                    subtitles:
                        | string
                        | {
                              [key: number]: string;
                          };
                };
            };
        };
        tooltips: {
            confirmationPending: string;
        };
    };
    updateUser: {
        groups: {
            addGroupsModal: {
                heading: string;
                subHeading: string;
            };
            editGroups: {
                groupList: {
                    emptyListPlaceholder: {
                        subTitle: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        title: string;
                    };
                    headers: {
                        0: string;
                        1: string;
                    };
                };
                heading: string;
                popups: {
                    viewPermissions: string;
                };
                searchPlaceholder: string;
                subHeading: string;
            };
            notifications: {
                addUserGroups: {
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
                fetchUserGroups: {
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
                removeUserGroups: {
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
                updateUserGroups: {
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
            };
        };
        roles: {
            addRolesModal: {
                heading: string;
                subHeading: string;
            };
            editRoles: {
                confirmationModal: {
                    assertionHint: string;
                    header: string;
                    message: string;
                    content: string;
                };
                infoMessage: string;
                roleList: {
                    emptyListPlaceholder: {
                        subTitle: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        title: string;
                    };
                    headers: {
                        0: string;
                        1: string;
                    };
                };
                placeholders: {
                    emptyPlaceholder: {
                        title: string;
                        subtitles: string;
                    };
                };
                heading: string;
                popups: {
                    viewPermissions: string;
                };
                searchPlaceholder: string;
                subHeading: string;
            };
            notifications: {
                addUserRoles: {
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
                fetchUserRoles: {
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
                removeUserRoles: {
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
                updateUserRoles: {
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
            };
            viewPermissionModal: {
                backButton: string;
                editButton: string;
                heading: string;
            };
        };
    };
    resendCode:{
        resend: string;
    }
}
