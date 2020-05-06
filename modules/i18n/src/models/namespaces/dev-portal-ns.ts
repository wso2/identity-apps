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

import {
    Confirmation,
    DangerZone,
    EditPage,
    FormAttributes,
    HelpPanelInterface,
    Notification,
    Page,
    Placeholder
} from "../common";

/**
 * Model for the dev portal namespace
 */
export interface DevPortalNS {
    components: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                    filterCondition: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                    filterValue: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                        };
                    };
                };
            };
            hints: {
                querySearch: {
                    actionKeys: string;
                    label: string;
                };
            };
            options: {
                header: string;
            };
            placeholder: string;
            popups: {
                clear: string;
                dropdown: string;
            };
            resultsIndicator: string;
        };
        applications: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: string;
                        };
                        filterCondition: {
                            placeholder: string;
                        };
                        filterValue: {
                            placeholder: string;
                        };
                    };
                };
                placeholder: string;
            };
            helpPanel: HelpPanelInterface;
            notifications: {
                fetchApplications: Notification;
            };
            placeholders: {
                emptyList: Placeholder;
            };
            templates: {
                manualSetup: {
                    heading: string;
                    subHeading: string;
                };
                quickSetup: {
                    heading: string;
                    subHeading: string;
                };
            };
        };
        certificates: {
            keystore: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: string;
                            };
                            filterCondition: {
                                placeholder: string;
                            };
                            filterValue: {
                                placeholder: string;
                            };
                        };
                    };
                    placeholder: string;
                };
            };
            truststore: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: string;
                            };
                            filterCondition: {
                                placeholder: string;
                            };
                            filterValue: {
                                placeholder: string;
                            };
                        };
                    };
                    placeholder: string;
                };
            };
        };
        claims: {
            dialects: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: string;
                            };
                            filterCondition: {
                                placeholder: string;
                            };
                            filterValue: {
                                placeholder: string;
                            };
                        };
                    };
                    placeholder: string;
                };
            };
            external: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: string;
                            };
                            filterCondition: {
                                placeholder: string;
                            };
                            filterValue: {
                                placeholder: string;
                            };
                        };
                    };
                    placeholder: string;
                };
            };
            local: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: string;
                            };
                            filterCondition: {
                                placeholder: string;
                            };
                            filterValue: {
                                placeholder: string;
                            };
                        };
                    };
                    placeholder: string;
                };
            };
        };
        emailTemplateTypes: {
            notifications: {
                deleteTemplateType: Notification;
                updateTemplateType: Notification;
                createTemplateType: Notification;
            };
        };
        emailTemplates: {
            notifications: {
                deleteTemplate: Notification;
                updateTemplate: Notification;
                createTemplate: Notification;
            };
        };
        helpPanel: {
            notifications: {
                pin: Notification;
            };
        };
        idp: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: string;
                        };
                        filterCondition: {
                            placeholder: string;
                        };
                        filterValue: {
                            placeholder: string;
                        };
                    };
                };
                placeHolders: {
                    emptyIDPList: Placeholder;
                };
            };
            buttons: {
                addIDP: string;
                addAuthenticator: string;
                addConnector: string;
                addAttribute: string;
            };
            confirmations: {
                deleteIDP: Confirmation;
                deleteAuthenticator: Confirmation;
                deleteConnector: Confirmation;
            };
            dangerZoneGroup: {
                header: string;
                disableIDP: DangerZone;
                deleteIDP: DangerZone;
            };
            forms: {
                advancedConfigs: {
                    federationHub: FormAttributes;
                    homeRealmIdentifier: FormAttributes;
                    alias: FormAttributes;
                    certificateType: {
                        label: string;
                        hint: string;
                        certificatePEM: FormAttributes;
                        certificateJWKS: FormAttributes;
                    };
                };
                attributeSettings: {
                    attributeMapping: {
                        attributeColumnHeader: string;
                        attributeMapColumnHeader: string;
                        attributeMapInputPlaceholderPrefix: string;
                        componentHeading: string;
                        hint: string;
                    };
                    attributeProvisioning: {
                        attributeColumnHeader: {
                            0: string;
                            1: string;
                        };
                        attributeMapColumnHeader: string;
                        attributeMapInputPlaceholderPrefix: string;
                        componentHeading: string;
                        hint: string;
                    };
                    attributeListItem: {
                        validation: {
                            empty: string;
                        };
                    };
                    attributeSelection: {
                        searchAttributes: {
                            placeHolder: string;
                        };
                    };
                };
                authenticatorAccordion: {
                    default: {
                        0: string;
                        1: string;
                    };
                    enable: {
                        0: string;
                        1: string;
                    };
                };
                outboundConnectorAccordion: {
                    default: string;
                    enable: string;
                };
                common: {
                    requiredErrorMessage: string;
                    invalidURLErrorMessage: string;
                    invalidQueryParamErrorMessage: string;
                };
                generalDetails: {
                    name: FormAttributes;
                    description: FormAttributes;
                    image: FormAttributes;
                };
                jitProvisioning: {
                    enableJITProvisioning: FormAttributes;
                    provisioningUserStoreDomain: FormAttributes;
                    provisioningScheme: {
                        hint: string;
                        label: string;
                        children: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                    };
                };
                roleMapping: {
                    heading: string;
                    keyName: string;
                    valueName: string;
                    validation: {
                        keyRequiredMessage: string;
                        valueRequiredErrorMessage: string;
                        duplicateKeyErrorMsg: string;
                    };
                    hint: string;
                };
                uriAttributeSettings: {
                    subject: {
                        heading: string;
                        hint: string;
                        placeHolder: string;
                        label: string;
                        validation: {
                            empty: string;
                        };
                    };
                    role: {
                        heading: string;
                        hint: string;
                        placeHolder: string;
                        label: string;
                        validation: {
                            empty: string;
                        };
                    };
                };
                outboundProvisioningRoles: {
                    heading: string;
                    hint: string;
                    placeHolder: string;
                    label: string;
                    popup: {
                        content: string;
                    };
                };
            };
            templates: {
                manualSetup: {
                    heading: string;
                    subHeading: string;
                };
                quickSetup: {
                    heading: string;
                    subHeading: string;
                };
            };
            modals: {
                addAuthenticator: {
                    title: string;
                    subTitle: string;
                };
                attributeSelection: {
                    title: string;
                    subTitle: string;
                    content: {
                        searchPlaceholder: string;
                    };
                };
            };
            notifications: {
                deleteIDP: Notification;
                getIDP: Notification;
                updateIDP: Notification;
                submitAttributeSettings: Notification;
                updateFederatedAuthenticator: Notification;
                getIDPTemplateList: Notification;
                getIDPTemplate: Notification;
                getFederatedAuthenticator: Notification;
                getFederatedAuthenticatorMetadata: Notification;
                disableAuthenticator: Notification;
                updateJITProvisioning: Notification;
                getOutboundProvisioningConnectorMetadata: Notification;
                getOutboundProvisioningConnector: Notification;
                updateOutboundProvisioningConnector: Notification;
                disableOutboundProvisioningConnector: Notification;
                getRolesList: Notification;
                updateIDPRoleMappings: Notification;
            };
            placeHolders: {
                emptyIDPList: Placeholder;
                emptyAuthenticatorList: Placeholder;
                emptyConnectorList: Placeholder;
                noAttributes: Placeholder;
            };
        };
        users: {
            advancedSearch: {
                form: {
                    dropdown: {
                        filterAttributeOptions: {
                            username: string;
                            email: string;
                        };
                    };
                    inputs: {
                        filterAttribute: {
                            placeholder: string;
                        };
                        filterCondition: {
                            placeholder: string;
                        };
                        filterValue: {
                            placeholder: string;
                        };
                    };
                };
                placeholder: string;
            };
            all: {
                heading: string;
                subHeading: string;
            };
            buttons: {
                assignUserRoleBtn: string;
            };
            notifications: {
                addUser: Notification;
                deleteUser: Notification;
                fetchUsers: Notification;
            };
            placeholders: {
                emptyList: Placeholder;
            };
            userstores: {
                userstoreOptions: {
                    all: string;
                    primary: string;
                };
            };
        };
        user: {
            deleteUser: {
                confirmationModal: {
                    content: string;
                    header: string;
                    message: string;
                    assertionHint: string;
                };
            };
            editUser: {
                dangerZoneGroup: {
                    header: string;
                    dangerZone: DangerZone;
                };
                menu: {
                    menuItems: {
                        0: string;
                        1: string;
                        2: string;
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
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                            };
                        };
                        newPassword: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
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
            modals: {
                addUserWarnModal: {
                    heading: string;
                    message: string;
                };
                addUserWizard: {
                    title: string;
                    subTitle: string;
                    steps: {
                        basicDetails: string;
                        roles: string;
                        groups: string;
                        summary: string;
                    };
                    buttons: {
                        next: string;
                        previous: string;
                    };
                };
            };
            profile: {
                fields: {
                    generic: {
                        default: string;
                    };
                    emails: string;
                    profileUrl: string;
                    addresses_work: string;
                    addresses_home: string;
                    emails_home: string;
                    emails_other: string;
                    emails_work: string;
                    name_familyName: string;
                    name_givenName: string;
                    phoneNumbers: string;
                    phoneNumbers_home: string;
                    phoneNumbers_mobile: string;
                    phoneNumbers_work: string;
                    phoneNumbers_other: string;
                    userName: string;
                };
                forms: {
                    generic: {
                        inputs: {
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalidFormat: string;
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
                    getProfileInfo: Notification;
                    updateProfileInfo: Notification;
                };
                placeholders: {
                    SCIMDisabled: {
                        heading: string;
                    };
                };
            };
        };
        userstores: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: string;
                        };
                        filterCondition: {
                            placeholder: string;
                        };
                        filterValue: {
                            placeholder: string;
                        };
                    };
                };
                placeholder: string;
            };
        };
        roles: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: string;
                        };
                        filterCondition: {
                            placeholder: string;
                        };
                        filterValue: {
                            placeholder: string;
                        };
                    };
                };
                placeholder: string;
            };
            edit: {
                basics: {
                    fields: {
                        roleName: {
                            name: string;
                            required: string;
                            placeholder: string;
                        };
                    };
                };
            };
            notifications: {
                deleteRole: Notification;
                updateRole: Notification;
                createRole: Notification;
                createPermission: Notification;
            };
        };
        groups: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: string;
                        };
                        filterCondition: {
                            placeholder: string;
                        };
                        filterValue: {
                            placeholder: string;
                        };
                    };
                };
                placeholder: string;
            };
            edit: {
                basics: {
                    fields: {
                        groupName: {
                            name: string;
                            required: string;
                            placeholder: string;
                        };
                    };
                };
            };
            notifications: {
                deleteGroup: Notification;
                updateGroup: Notification;
                createGroup: Notification;
                createPermission: Notification;
            };
        };
        serverConfigs: {
            selfRegistration: {
                actionTitles: {
                    config: string;
                };
                description: string;
                heading: string;
                confirmation: {
                    heading: string;
                    message: string;
                };
                notifications: {
                    updateConfigurations: Notification;
                    updateEnable: Notification;
                    updateAccountLockOnCreation: Notification;
                    updateInternalNotificationManagement: Notification;
                    updateReCaptcha: Notification;
                };
                form: {
                    enable: FormAttributes;
                    enableAccountLockOnCreation: FormAttributes;
                    internalNotificationManagement: FormAttributes;
                    enableReCaptcha: FormAttributes;
                    verificationLinkExpiryTime: FormAttributes;
                    smsOTPExpiryTime: FormAttributes;
                    callbackURLRegex: FormAttributes;
                };
            };
            accountRecovery: {
                actionTitles: {
                    config: string;
                };
                description: string;
                heading: string;
                confirmation: {
                    heading: string;
                    message: string;
                };
                notifications: {
                    updateConfigurations: Notification;
                    updateEnableUsernameRecovery: Notification;
                    updateUsernameRecoveryReCaptcha: Notification;
                    updateEnableNotificationPasswordRecovery: Notification;
                    updateNotificationPasswordRecoveryReCaptcha: Notification;
                    updateSecurityQuestionPasswordRecoveryReCaptcha: Notification;
                };
                usernameRecovery: {
                    heading: string;
                    form: {
                        enable: FormAttributes;
                        enableReCaptcha: FormAttributes;
                    };
                };
                passwordRecovery: {
                    heading: string;
                    form: {
                        enableNotificationBasedRecovery: FormAttributes;
                        enableReCaptchaForNotificationBasedRecovery: FormAttributes;
                        enableSecurityQuestionBasedRecovery: FormAttributes;
                        noOfQuestionsRequired: FormAttributes;
                        enableReCaptchaForSecurityQuestionBasedRecovery: FormAttributes;
                    };
                };
                otherSettings: {
                    heading: string;
                    form: {
                        enableForcedChallengeQuestions: FormAttributes;
                        reCaptchaMaxFailedAttempts: FormAttributes;
                        enableInternalNotificationManagement: FormAttributes;
                        notifyRecoverySuccess: FormAttributes;
                        notifyQuestionRecoveryStart: FormAttributes;
                        recoveryLinkExpiryTime: FormAttributes;
                        smsOTPExpiryTime: FormAttributes;
                        recoveryCallbackURLRegex: FormAttributes;
                    };
                };
            };
            loginPolicies: {
                actionTitles: {
                    config: string;
                };
                description: string;
                heading: string;
                confirmation: {
                    heading: string;
                    message: string;
                };
                notifications: {
                    updateConfigurations: Notification;
                    updateAccountLockEnable: Notification;
                    updateAccountDisablingEnable: Notification;
                    updateAccountDisableInternalNotificationManagement: Notification;
                };
                accountLock: {
                    heading: string;
                    form: {
                        accountLockEnable: FormAttributes;
                        maxFailedLoginAttemptsToAccountLock: FormAttributes;
                        accountLockTime: FormAttributes;
                        accountLockTimeIncrementFactor: FormAttributes;
                        accountLockInternalNotificationManagement: FormAttributes;
                    };
                };
                accountDisable: {
                    heading: string;
                    form: {
                        accountDisablingEnable: FormAttributes;
                        accountDisableInternalNotificationManagement: FormAttributes;
                    };
                };
                reCaptcha: {
                    heading: string;
                    form: {
                        reCaptchaPreference: {
                            label: string;
                            reCaptchaAlwaysEnable: FormAttributes;
                            reCaptchaAfterMaxFailedAttemptsEnable: FormAttributes;
                        };
                        maxFailedLoginAttemptsToReCaptcha: FormAttributes;
                    };
                };
            };
            passwordPolicies: {
                actionTitles: {
                    config: string;
                };
                description: string;
                heading: string;
                confirmation: {
                    heading: string;
                    message: string;
                };
                notifications: {
                    updateConfigurations: Notification;
                    accountLockEnable: Notification;
                    accountDisablingEnable: Notification;
                };
                passwordHistory: {
                    heading: string;
                    form: {
                        enable: FormAttributes;
                        passwordHistoryCount: FormAttributes;
                    };
                };
                passwordPatterns: {
                    heading: string;
                    form: {
                        enable: FormAttributes;
                        policyMinLength: FormAttributes;
                        policyMaxLength: FormAttributes;
                        policyPattern: FormAttributes;
                        errorMessage: FormAttributes;
                    };
                };
            };
        };
        transferList: {
            searchPlaceholder: string;
            list: {
                headers: {
                    0: string;
                    1: string;
                };
                emptyPlaceholder: string;
            };
        };
        footer: {
            copyright: string;
        };
        privacy: {
            about: {
                description: string;
                heading: string;
            };
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        para1: string;
                    };
                    heading: string;
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: string;
                                1: string;
                                2: string;
                                3: string;
                            };
                            para1: string;
                        };
                        heading: string;
                    };
                };
                description: {
                    para1: string;
                    para2: string;
                    para3: string;
                };
                disclaimer: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                        };
                    };
                    heading: string;
                };
                disclosureOfPersonalInfo: {
                    description: string;
                    heading: string;
                    legalProcess: {
                        description: string;
                        heading: string;
                    };
                };
                heading: string;
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                    contactUs: {
                        description: {
                            para1: string;
                        };
                        heading: string;
                    };
                    heading: string;
                    yourChoices: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                };
                storageOfPersonalInfo: {
                    heading: string;
                    howLong: {
                        description: {
                            list1: {
                                0: string;
                                1: string;
                            };
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                    requestRemoval: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                    where: {
                        description: {
                            para1: string;
                            para2: string;
                        };
                        heading: string;
                    };
                };
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        para1: string;
                        para2: string;
                        subList1: {
                            heading: string;
                            list: {
                                0: string;
                                1: string;
                                2: string;
                            };
                        };
                        subList2: {
                            heading: string;
                            list: {
                                0: string;
                                1: string;
                            };
                        };
                    };
                    heading: string;
                };
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                        list2: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                        para1: string;
                        para2: string;
                    };
                    heading: string;
                };
            };
        };
        templates: {
            emptyPlaceholder: Placeholder;
        };
    };
    pages: {
        applicationTemplate: EditPage;
        applications: Page;
        applicationsEdit: EditPage;
        idpTemplate: EditPage;
        overView: Page;
        users: Page;
        usersEdit: EditPage;
    };
    placeholders: {
        404: Placeholder;
        emptySearchResult: Placeholder;
        genericError: Placeholder;
        loginError: Placeholder;
        underConstruction: Placeholder;
    };
}
