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
    DangerZone, EditPage,
    FormAttributes,
    FormField,
    Notification,
    NotificationItem,
    Page,
    Placeholder
} from "../common";

/**
 * Model for the admin portal namespace
 */
export interface AdminPortalNS {
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
                    error: string;
                    placeholder: string;
                };
                attributes: {
                    alias: string;
                };
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                };
                notifications: {
                    addCertificate: Notification;
                    getCertificates: Notification;
                    getAlias: Notification;
                    getPublicCertificate: Notification;
                    getCertificate: Notification;
                    deleteCertificate: Notification;
                    download: Notification;
                };
                certificateModalHeader: string;
                placeholders: {
                    emptySearch: {
                        action: string;
                        title: string;
                        subtitle: string;
                    };
                    emptyList: {
                        action: string;
                        title: string;
                        subtitle: string;
                    };
                };
                confirmation: {
                    hint: string;
                    primaryAction: string;
                    header: string;
                    content: string;
                    message: string;
                    tenantContent: string;
                };
                pageLayout: {
                    title: string;
                    description: string;
                    primaryAction: string;
                };
                summary: {
                    sn: string;
                    validFrom: string;
                    validTill: string;
                    issuerDN: string;
                    subjectDN: string;
                    version: string;
                };
                wizard: {
                    panes: {
                        upload: string;
                        paste: string;
                    };
                    steps: {
                        upload: string;
                        summary: string;
                    };
                    header: string;
                    dropZone: {
                        description: string;
                        action: string;
                    };
                    pastePlaceholder: string;
                };
                forms: {
                    alias: FormField;
                };
                errorEmpty: string;
                errorCertificate: string;
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
                    error: string;
                };
                attributes: {
                    dialectURI: string;
                };
                notifications: {
                    fetchDialects: Notification;
                    fetchADialect: Notification;
                    fetchExternalClaims: Notification;
                    deleteDialect: Notification;
                    addDialect: Notification;
                    updateDialect: Notification;
                };
                localDialect: string;
                pageLayout: {
                    list: {
                        title: string;
                        description: string;
                        primaryAction: string;
                        view: string;
                    };
                    edit: {
                        description: string;
                        back: string;
                        updateDialectURI: string;
                        updateExternalAttributes: string;
                    };
                };
                dangerZone: DangerZone;
                confirmations: {
                    header: string;
                    message: string;
                    content: string;
                    hint: string;
                    action: string;
                };
                wizard: {
                    steps: {
                        dialectURI: string;
                        externalAttribute: string;
                        summary: string;
                    };
                    header: string;
                    summary: {
                        externalAttribute: string;
                        mappedAttribute: string;
                        notFound: string;
                    };
                };
                forms: {
                    dialectURI: FormField;
                    submit: string;
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
                    error: string;
                    placeholder: string;
                };
                attributes: {
                    attributeURI: string;
                    mappedClaim: string;
                };
                notifications: {
                    addExternalAttribute: Notification;
                    fetchExternalClaims: Notification;
                    getExternalAttribute: Notification;
                    updateExternalAttribute: Notification;
                    deleteExternalClaim: Notification;
                };
                forms: {
                    attributeURI: FormField;
                    localAttribute: FormField;
                    submit: string;
                };
                pageLayout: {
                    edit: {
                        header: string;
                        primaryAction: string;
                    };
                };
                placeholders: {
                    empty: {
                        title: string;
                        subtitle: string;
                    };
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
                    error: string;
                    placeholder: string;
                };
                attributes: {
                    attributeURI: string;
                };
                notifications: {
                    fetchLocalClaims: Notification;
                    getAClaim: Notification;
                    getClaims: Notification;
                    getLocalDialect: Notification;
                    addLocalClaim: Notification;
                    updateClaim: Notification;
                    deleteClaim: Notification;
                };
                pageLayout: {
                    edit: {
                        tabs: {
                            general: string;
                            additionalProperties: string;
                            mappedAttributes: string;
                        };
                        description: string;
                        back: string;
                    };
                    local: {
                        description: string;
                        title: string;
                        back: string;
                        action: string;
                    };
                };
                wizard: {
                    steps: {
                        general: string;
                        mapAttributes: string;
                        summary: string;
                    };
                    header: string;
                    summary: {
                        userstore: string;
                        attribute: string;
                        supportedByDefault: string;
                        required: string;
                        readOnly: string;
                        attributeURI: string;
                        displayOrder: string;
                        regEx: string;
                    };
                };
                additionalProperties: {
                    hint: string;
                    key: string;
                    value: string;
                    keyRequiredErrorMessage: string;
                    valueRequiredErrorMessage: string;
                };
                confirmation: {
                    hint: string;
                    primaryAction: string;
                    header: string;
                    message: string;
                    content: string;
                };
                forms: {
                    attributeID: FormField;
                    attributeHint: string;
                    name: FormField;
                    nameHint: string;
                    description: FormField;
                    regEx: FormField;
                    regExHint: string;
                    supportedByDefault: FormField;
                    displayOrder: FormField;
                    displayOrderHint: string;
                    required: FormField;
                    readOnly: FormField;
                    attribute: FormField;
                };
                dangerZone: DangerZone;
                mappedAttributes: {
                    hint: string;
                };
            };
            list: {
                columns: {
                    actions: string;
                    claimURI: string;
                    dialectURI: string;
                    name: string;
                };
                confirmation: {
                    local: {
                        message: string;
                        name: string;
                    };
                    dialect: {
                        message: string;
                        name: string;
                    };
                    external: {
                        message: string;
                        name: string;
                    };
                    hint: string;
                    header: string;
                    message: string;
                    content: string;
                    action: string;
                };
                placeholders: {
                    emptySearch: {
                        title: string;
                        subtitle: string;
                        action: string;
                    };
                    emptyList: {
                        title: {
                            local: string;
                            dialect: string;
                            external: string;
                        };
                        subtitle: string;
                        action: {
                            local: string;
                            dialect: string;
                            external: string;
                        };
                    };
                };
                warning: string;
            };
        };
        emailLocale: {
            buttons: {
                addLocaleTemplate: string;
                saveChanges: string;
            };
            forms: {
                addLocale: {
                    fields: {
                        bodyEditor: FormAttributes;
                        locale: FormAttributes;
                        signatureEditor: FormAttributes;
                        subject: FormAttributes;
                    };
                };
            };
        };
        emailTemplateTypes: {
            buttons: {
                createTemplateType: string;
                deleteTemplate: string;
                editTemplate: string;
                newType: string;
            };
            confirmations: {
                deleteTemplateType: Confirmation;
            };
            forms: {
                addTemplateType: {
                    fields: {
                        type: FormAttributes;
                    };
                };
            };
            list: {
                actions: string;
                name: string;
            };
            notifications: {
                deleteTemplateType: Notification;
                getTemplateTypes: Notification;
                updateTemplateType: Notification;
                createTemplateType: Notification;
            };
            placeholders: {
                emptyList: Placeholder;
            };
            wizards: {
                addTemplateType: {
                    heading: string;
                    subHeading: string;
                    steps: {};
                };
            };
        };
        emailTemplates: {
            buttons: {
                editTemplate: string;
                deleteTemplate: string;
                newTemplate: string;
                viewTemplate: string;
            };
            confirmations: {
                deleteTemplate: Confirmation;
            };
            editor: {
                tabs: {
                    code: {
                        tabName: string;
                    };
                    preview: {
                        tabName: string;
                    };
                };
            };
            list: {
                actions: string;
                name: string;
            };
            notifications: {
                deleteTemplate: Notification;
                createTemplate: Notification;
                getTemplateDetails: Notification;
                getTemplates: Notification;
                iframeUnsupported: Notification;
                updateTemplate: Notification;
            };
            placeholders: {
                emptyList: Placeholder;
            };
            viewTemplate: {
                heading: string;
            };
        };
        footer: {
            copyright: string;
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
            list: {
                columns: {
                    actions: string;
                    lastModified: string;
                    name: string;
                };
                storeOptions: string;
            };
            notifications: {
                deleteGroup: Notification;
                updateGroup: Notification;
                createGroup: Notification;
                createPermission: Notification;
            };
        };
        header: {
            links: {
                devPortalNav: string;
                userPortalNav: string;
            };
        };
        governanceConnectors: {
            notifications: {
                getConnectorCategories: Notification;
                getConnector: Notification;
                updateConnector: Notification;
            };
            enabled: string;
            disabled: string;
            categories: string;
            pageSubHeading: string;
            connectorSubHeading: string;
        };
        helpPanel: {
            notifications: {
                pin: Notification;
            };
        };
        overview: {
            widgets: {
                insights: {
                    groups: {
                        heading: string;
                        subHeading: string;
                    };
                    users: {
                        heading: string;
                        subHeading: string;
                    };
                };
                overview: {
                    cards: {
                        groups: {
                            heading: string;
                        };
                        users: {
                            heading: string;
                        };
                        userstores: {
                            heading: string;
                        };
                    };
                    heading: string;
                    subHeading: string;
                };
                quickLinks: {
                    cards: {
                        certificates: {
                            heading: string;
                            subHeading: string;
                        };
                        dialects: {
                            heading: string;
                            subHeading: string;
                        };
                        emailTemplates: {
                            heading: string;
                            subHeading: string;
                        };
                        generalConfigs: {
                            heading: string;
                            subHeading: string;
                        };
                        groups: {
                            heading: string;
                            subHeading: string;
                        };
                        roles: {
                            heading: string;
                            subHeading: string;
                        };
                    };
                    heading: string;
                    subHeading: string;
                };
            };
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
        roles: {
            addRoleWizard: {
                buttons: {
                    finish: string;
                    next: string;
                    previous: string;
                };
                forms: {
                    roleBasicDetails: {
                        domain: {
                            label: {
                                role: string;
                                group: string;
                            };
                            placeholder: string;
                            validation: {
                                empty: {
                                    role: string;
                                    group: string;
                                };
                            };
                        };
                        roleName: FormAttributes;
                    };
                };
                heading: string;
                permissions: {
                    buttons: {
                        collapseAll: string;
                        expandAll: string;
                        update: string;
                    };
                };
                subHeading: string;
                summary: {
                    labels: {
                        domain: {
                            role: string;
                            group: string;
                        };
                        permissions: string;
                        roleName:  string;
                        users: string;
                    };
                };
                users: {
                    assignUserModal: {
                        heading: string;
                        subHeading: string;
                        list: {
                            searchPlaceholder: string;
                            listHeader: string;
                        };
                    };
                };
                wizardSteps: {
                    0: string;
                    1: string;
                    2: string;
                    3: string;
                    4: string;
                    5: string;
                };
            };
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
                    buttons: {
                        update: string;
                    };
                    confirmation: Confirmation;
                    dangerZone: DangerZone;
                    fields: {
                        roleName: {
                            name: string;
                            required: string;
                            placeholder: string;
                        };
                    };
                };
                menuItems: {
                    basic: string;
                    permissions: string;
                    groups: string;
                    users: string;
                    roles: string;
                };
                users: {
                    list: {
                        header: string;
                        emptyPlaceholder: Placeholder;
                    };
                };
            };
            list: {
                buttons: {
                    addButton: string;
                    filterDropdown: string;
                };
                columns: {
                    actions: string;
                    lastModified: string;
                    name: string;
                };
                confirmations: {
                    deleteItem: Confirmation;
                };
                emptyPlaceholders: {
                    search: Placeholder;
                    emptyRoleList: Placeholder;
                };
                popups: {
                    delete: string;
                    edit: string;
                };
            };
            notifications: {
                deleteRole: Notification;
                fetchRoles: Notification;
                updateRole: Notification;
                createRole: Notification;
                createPermission: Notification;
            };
        };
        serverConfigs: {
            realmConfiguration: {
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
                    getConfigurations: Notification;
                    updateConfigurations: Notification;
                    emptyHomeRealmIdentifiers: Notification;
                };
                form: {
                    homeRealmIdentifiers: FormAttributes;
                    idleSessionTimeoutPeriod: FormAttributes;
                    rememberMePeriod: FormAttributes;
                };
            };
        };
        sidePanel: {
            addEmailTemplate: string;
            addEmailTemplateLocale: string;
            attributeDialects: string;
            categories: {
                attributes: string;
                certificates: string;
                configurations: string;
                general: string;
                users: string;
                userstores: string;
            };
            certificates: string;
            configurations: string;
            editEmailTemplate: string;
            editExternalDialect: string;
            editGroups: string;
            editLocalClaims: string;
            editRoles: string;
            editUsers: string;
            editUserstore: string;
            emailTemplateTypes: string;
            emailTemplates: string;
            generalConfigurations: string;
            groups: string;
            localDialect: string;
            overview: string;
            privacy: string;
            roles: string;
            users: string;
            userstoreTemplates: string;
            userstores: string;
        };
        transferList: {
            searchPlaceholder: string;
            list: {
                headers: {
                    0: string;
                    1: string;
                };
                emptyPlaceholders: {
                    default: string;
                    groups: {
                        unselected: string;
                        selected: string;
                    };
                    roles: {
                        unselected: string;
                        selected: string;
                    };
                    users: {
                        roles: {
                            unselected: string;
                            selected: string;
                        };
                    };
                };
            };
        };
        user: {
            deleteUser: {
                confirmationModal: Confirmation;
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
                        addUserGroups: Notification;
                        fetchUserGroups: Notification;
                        removeUserGroups: Notification;
                    };
                };
                roles: {
                    addRolesModal: {
                        heading: string;
                        subHeading: string;
                    };
                    editRoles: {
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
                        heading: string;
                        popups: {
                            viewPermissions: string;
                        };
                        searchPlaceholder: string;
                        subHeading: string;
                    };
                    notifications: {
                        addUserRoles: Notification;
                        fetchUserRoles: Notification;
                        removeUserRoles: Notification;
                    };
                    viewPermissionModal: {
                        backButton: string;
                        heading: string;
                    };
                };
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
                addNewUserBtn: string;
                assignUserRoleBtn: string;
                metaColumnBtn: string;
            };
            list: {
                columns: {
                    actions: string;
                    name: string;
                };
            };
            notifications: {
                addUser: Notification;
                deleteUser: Notification;
                fetchUsers: Notification;
            };
            placeholders: {
                emptyList: Placeholder;
            };
            usersList: {
                list: {
                    emptyResultPlaceholder: {
                        addButton: string;
                        subTitle: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        title: string;
                    };
                    iconPopups: {
                        delete: string;
                        edit: string;
                    };
                };
                metaOptions: {
                    heading: string;
                    columns: {
                        name: string;
                        emails: string;
                        id: string;
                        userName: string;
                        lastModified: string;
                    };
                };
                search: {
                    emptyResultPlaceholder: {
                        clearButton: string;
                        subTitle: {
                            0: string;
                            1: string;
                        };
                        title: string;
                    };
                };
            };
            userstores: {
                userstoreOptions: {
                    all: string;
                    primary: string;
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
                error: string;
            };
            notifications: {
                fetchUserstores: Notification;
                fetchUserstoreTemplates: Notification;
                fetchUserstoreTypes: Notification;
                fetchUserstoreMetadata: Notification;
                deleteUserstore: Notification;
                delay: NotificationItem;
                updateUserstore: Notification;
                testConnection: Notification;
                addUserstore: Notification;
            };
            confirmation: {
                hint: string;
                header: string;
                message: string;
                content: string;
                confirm: string;
            };
            pageLayout: {
                list: {
                    title: string;
                    description: string;
                    primaryAction: string;
                };
                templates: {
                    title: string;
                    description: string;
                    back: string;
                    templateHeading: string;
                    templateSubHeading: string;
                };
                edit: {
                    description: string;
                    back: string;
                    tabs: {
                        general: string;
                        connection: string;
                        user: string;
                        group: string;
                    };
                };
            };
            forms: {
                general: {
                    name: FormField;
                    type: FormField;
                    description: FormField;
                };
                connection: {
                    testButton: string;
                    connectionErrorMessage: string;
                };
                custom: FormField;
            };
            dangerZone: DangerZone;
            wizard: {
                steps: {
                    general: string;
                    user: string;
                    group: string;
                    summary: string;
                };
                header: string;
            };
            placeholders: {
                emptySearch: Placeholder;
                emptyList: Placeholder;
            };
            sqlEditor: {
                reset: string;
                title: string;
                create: string;
                update: string;
                read: string;
                delete: string;
                darkMode: string;
            };
        };
    };
    notifications: {
        endSession: Notification;
        getProfileInfo: Notification;
        getProfileSchema: Notification;
    };
    pages: {
        addEmailTemplate: EditPage;
        editTemplate: EditPage;
        emailLocaleAdd: EditPage;
        emailLocaleAddWithDisplayName: EditPage;
        emailTemplateTypes: Page;
        emailTemplates: EditPage;
        emailTemplatesWithDisplayName: EditPage;
        groups: Page;
        overview: Page;
        roles: Page;
        rolesEdit: EditPage;
        serverConfigurations: Page;
        users: Page;
        usersEdit: EditPage;
    };
    placeholders: {
        404: Placeholder;
        accessDenied: Placeholder;
        consentDenied: Placeholder;
        emptySearchResult: Placeholder;
        genericError: Placeholder;
        loginError: Placeholder;
        unauthorized: Placeholder;
        underConstruction: Placeholder;
    };
}
