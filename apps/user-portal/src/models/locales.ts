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

/**
 * Model for the common namespace
 */
export interface Common {
    access: string;
    active: string;
    add: string;
    all: string;
    applicationName: string;
    applications: string;
    approvalStatus: string;
    approve: string;
    assignees: string;
    browser: string;
    cancel: string;
    challengeQuestionNumber: string;
    change: string;
    claim: string;
    completed: string;
    configure: string;
    contains: string;
    continue: string;
    createdOn: string;
    delete: string;
    description: string;
    deviceModel: string;
    edit: string;
    endsWith: string;
    equals: string;
    filter: string;
    goBackHome: string;
    help: string;
    hidePassword: string;
    initiator: string;
    ipAddress: string;
    lastAccessed: string;
    lastSeen: string;
    loginTime: string;
    logout: string;
    more: string;
    name: string;
    operatingSystem: string;
    operations: string;
    overview: string;
    personalInfo: string;
    priority: string;
    privacy: string;
    properties: string;
    ready: string;
    reject: string;
    release: string;
    remove: string;
    reserved: string;
    resetFilters: string;
    revoke: string;
    revokeAll: string;
    save: string;
    search: string;
    security: string;
    showLess: string;
    showMore: string;
    showPassword: string;
    startsWith: string;
    submit: string;
    switch: string;
    terminate: string;
    terminateAll: string;
    terminateSession: string;
    type: string;
    update: string;
    user: string;
}

/**
 * Model for the views namespace
 */
export interface Views {
    components: {
        accountRecovery: {
            codeRecovery: {
                descriptions: {
                    add: string;
                },
                heading: string;
            },
            emailRecovery: {
                descriptions: {
                    add: string;
                    update: string;
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalidFormat: string;
                                }
                            }
                        }
                    }
                },
                heading: string;
                notifications: {
                    updateEmail: Notification;
                }
            },
            questionRecovery: {
                descriptions: {
                    add: string;
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                }
                            },
                            question: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                }
                            }
                        }
                    }
                },
                heading: string;
                notifications: {
                    addQuestions: Notification,
                    updateQuestions: Notification
                }
            }
        },
        applications: {
            all: {
                heading: string;
            },
            favourite: {
                heading: string;
            },
            notifications: {
                fetchApplications: Notification;
            }
            recent: {
                heading: string;
            },
            search: {
                forms: {
                    searchForm: {
                        inputs: {
                            filerAttribute: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                }
                            },
                            filterCondition: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                }
                            },
                            filterValue: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                }
                            },
                        }
                    }
                },
                hints: {
                    querySearch: {
                        actionKeys: string;
                        label: string;
                    }
                },
                options: {
                    header: string;
                }
                placeholder: string;
                popups: {
                    clear: string;
                    dropdown: string;
                },
                resultsIndicator: string;
            }
        },
        approvals: {
            notifications: {
                fetchApprovalDetails: Notification,
                fetchPendingApprovals: Notification,
                updatePendingApprovals: Notification
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                mismatch: string;
                            }
                        },
                        currentPassword: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            }
                        },
                        newPassword: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: string;
                            message: string;
                        },
                        invalidCurrentPassword: {
                            description: string;
                            message: string;
                        },
                        submitError: {
                            description: string;
                            message: string;
                        },
                        submitSuccess: {
                            description: string;
                            message: string;
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: string;
                    message: string;
                }
            }
        },
        consentManagement: {
            modals: {
                consentRevokeModal: {
                    heading: string;
                    message: string;
                },
                editConsentModal: {
                    description: {
                        collectionMethod: string;
                        description: string;
                        piiCategoryHeading: string;
                        state: string;
                        version: string;
                    }
                }
            },
            notifications: {
                consentReceiptFetch: Notification;
                consentedAppsFetch: Notification;
                revokeConsentedApp: Notification;
                updateConsentedClaims: Notification;
            }
        },
        footer: {
            copyright: string;
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: string;
                }
            },
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            }
                        },
                        username: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: Notification;
                getAssociations: Notification;
                switchAccount: Notification;
            }
        },
        mfa: {
            fido: {
                description: string;
                heading: string;
                notifications: {
                    removeDevice: Notification;
                    startFidoFlow: Notification;
                }
            },
            smsOtp: {
                descriptions: {
                    hint: string;
                },
                heading: string;
                notifications: {
                    updateMobile: Notification;
                }
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: string;
                    },
                    description: string;
                    header: string;
                },
                accountSecurity: {
                    actionTitles: {
                        update: string;
                    },
                    description: string;
                    header: string;
                },
                accountStatus: {
                    header: string;
                    list: {
                        0: string;
                        1: string;
                        2: string;
                    }
                },
                consentManagement: {
                    actionTitles: {
                        manage: string;
                    },
                    description: string;
                    header: string;
                }
            }
        },
        privacy: {
            about: {
                description: string;
                heading: string;
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                        },
                        para1: string;
                    },
                    heading: string;
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: string;
                                1: string;
                                2: string;
                                3: string;
                            },
                            para1: string;
                        },
                        heading: string;
                    }
                },
                description: {
                    para1: string;
                    para2: string;
                    para3: string;
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                        }
                    },
                    heading: string;
                },
                disclosureOfPersonalInfo: {
                    description: string;
                    heading: string;
                    legalProcess: {
                        description: string;
                        heading: string;
                    }
                },
                heading: string;
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: string;
                            para2: string;
                        },
                        heading: string;
                    },
                    contactUs: {
                        description: {
                            para1: string;
                        },
                        heading: string;
                    },
                    heading: string;
                    yourChoices: {
                        description: {
                            para1: string;
                            para2: string;
                        },
                        heading: string;
                    }
                },
                storageOfPersonalInfo: {
                    heading: string;
                    howLong: {
                        description: {
                            list1: {
                                0: string;
                                1: string;
                            },
                            para1: string;
                            para2: string;
                        },
                        heading: string;
                    },
                    requestRemoval: {
                        description: {
                            para1: string;
                            para2: string;
                        },
                        heading: string;
                    },
                    where: {
                        description: {
                            para1: string;
                            para2: string;
                        },
                        heading: string;
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                        },
                        para1: string;
                        para2: string;
                        subList1: {
                            heading: string;
                            list: {
                                0: string;
                                1: string;
                                2: string;
                            }
                        },
                        subList2: {
                            heading: string;
                            list: {
                                0: string;
                                1: string;
                            }
                        }
                    },
                    heading: string;
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        },
                        list2: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        },
                        para1: string;
                        para2: string;
                    },
                    heading: string;
                }
            }
        },
        profile: {
            fields: {
                email: {
                    default: string;
                    label: string;
                },
                mobile: {
                    default: string;
                    label: string;
                },
                name: {
                    default: string;
                    label: string;
                },
                organization: {
                    default: string;
                    label: string;
                },
                username: {
                    default: string;
                    label: string;
                }
            },
            forms: {
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalidFormat: string;
                            },
                            note: string;
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalidFormat: string;
                            },
                            note: string;
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            }
                        },
                        lastName: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                            }
                        }
                    }
                }
            },
            notifications: {
                getProfileInfo: Notification;
                updateProfileInfo: Notification;
            }
        },
        profileExport: {
            notifications: {
                downloadProfileInfo: Notification;
            }
        },
        userSessions: {
            browserAndOS: string;
            lastAccessed: string;
            modals: {
                terminateAllUserSessionsModal: {
                    heading: string;
                    message: string;
                },
                terminateUserSessionModal: {
                    heading: string;
                    message: string;
                }
            },
            notifications: {
                fetchSessions: Notification;
                terminateAllUserSessions: Notification;
                terminateUserSession: Notification;
            }
        },
    };
    pages: {
        applications: Page;
        operations: Page;
        overview: Page;
        personalInfo: Page;
        privacy: Page;
        security: Page;
        404: Page;
    };
    placeholders: {
        emptySearchResult: Placeholder
    };
    sections: {
        accountRecovery: {
            description: string;
            heading: string;
        },
        approvals: {
            description: string;
            heading: string;
            placeholders: {
                emptyApprovalList: {
                    heading: string;
                }
            }
        },
        changePassword: {
            actionTitles: {
                change: string;
            },
            description: string;
            heading: string;
        },
        consentManagement: {
            actionTitles: {
                empty: string;
            },
            description: string;
            heading: string;
            placeholders: {
                emptyConsentList: {
                    heading: string;
                }
            },
        },
        linkedAccounts: {
            actionTitles: {
                add: string;
            },
            description: string;
            heading: string;
        },
        mfa: {
            description: string;
            heading: string;
        },
        profile: {
            description: string;
            heading: string;
        },
        profileExport: {
            actionTitles: {
                export: string;
            },
            description: string;
            heading: string;
        },
        userSessions: {
            actionTitles: {
                empty: string;
                terminateAll: string;
            },
            description: string;
            heading: string;
            placeholders: {
                emptySessionList: {
                    heading: string;
                }
            },
        }
    };
}

/**
 * Model for pages
 */
interface Page {
    title: string;
    subTitle: string;
}

/**
 * Model for notification set
 */
interface Notification {
    error: NotificationItem;
    genericError: NotificationItem;
    success: NotificationItem;
}

/**
 * Model for notification
 */
interface NotificationItem {
    message: string;
    description: string;
}

/**
 * Model for placeholder.
 */
interface Placeholder {
    action?: string;
    title: string;
    subtitles: string | PlaceholderSubtitle;
}

/**
 * Model for placeholder subtitle.
 */
interface PlaceholderSubtitle {
    [key: number]: string;
}
