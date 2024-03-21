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

/**
 * Model for the Console namespace
 */
export interface ConsoleNS {
    common: {
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
        cookieConsent: {
            content: string;
            confirmButton: string;
        };
        dateTime: {
            humanizedDateString: string;
        };
        header: {
            appSwitch: {
                console: {
                    name: string;
                    description: string;
                };
                myAccount: {
                    name: string;
                    description: string;
                };
                tooltip: string;
            };
            featureAnnouncements: {
                organizations: {
                    message: string;
                    buttons: {
                        tryout: string;
                    };
                };
            };
            organizationSwitch: {
                emptyOrgListMessage: string;
                orgSearchPlaceholder: string;
                breadcrumbError: {
                    message: string;
                    description: string;
                };
            };
        };
        modals: {
            editAvatarModal: {
                description: string;
                heading: string;
                content: Record<string, unknown>;
                primaryButton: string;
                secondaryButton: string;
            };
            sessionTimeoutModal: {
                description: string;
                heading: string;
                primaryButton: string;
                secondaryButton: string;
                loginAgainButton: string;
                sessionTimedOutHeading: string;
                sessionTimedOutDescription: string;
            };
        };
        notifications: {
            invalidPEMFile: {
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
        placeholders: {
            404: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            accessDenied: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            brokenPage: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            consentDenied: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            genericError: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            loginError: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            sessionStorageDisabled: {
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            unauthorized: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
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
        validations: {
            inSecureURL: {
                heading: string;
                description: string;
            };
            unrecognizedURL: {
                heading: string;
                description: string;
            };
        };
        sidePanel: {
            privacy: string;
            loginAndRegistration: {
                label: string;
                description: string;
            };
            userAttributesAndStores: string;
            userManagement: string;
            branding: string;
        };
    };
    apiResources: {
        confirmations: {
            deleteAPIResource: {
                assertionHint: string;
                content: string;
                header: string;
                message: string;
            };
            deleteAPIResourcePermission: {
                assertionHint: string;
                content: string;
                header: string;
                message: string;
            };
        };
        tabs: {
            scopes: {
                button: string;
                label: string;
                title: string;
                subTitle: string;
                learnMore: string;
                search: string;
                empty: {
                    title: string;
                    subTitle: string;
                };
                emptySearch: {
                    title: string;
                    subTitle: {
                        0: string;
                        1: string;
                    };
                    viewAll: string;
                };
                copyPopupText: string;
                copiedPopupText: string;
                removeScopePopupText: string;
                form: {
                    button: string;
                    cancelButton: string;
                    submitButton: string;
                    title: string;
                    subTitle: string;
                    fields: {
                        displayName: {
                            emptyValidate: string;
                            label: string;
                            placeholder: string;
                        };
                        scope: {
                            emptyValidate: string;
                            label: string;
                            placeholder: string;
                        };
                        description: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
            };
        };
        wizard: {
            addApiResource: {
                steps: {
                    scopes: {
                        empty: {
                            title: string;
                            subTitle: string;
                        };
                        stepTitle: string;
                        form: {
                            button: string;
                            fields: {
                                displayName: {
                                    emptyValidate: string;
                                    label: string;
                                    placeholder: string;
                                    hint: string;
                                };
                                permission: {
                                    emptyValidate: string;
                                    uniqueValidate: string;
                                    invalid: string;
                                    label: string;
                                    placeholder: string;
                                    hint: string;
                                };
                                permissionList: {
                                    label: string;
                                };
                                description: {
                                    label: string;
                                    placeholder: string;
                                    hint: string;
                                };
                            };
                        };
                        removeScopePopupText: string;
                    };
                };
            };
        };
    };
    branding: {
        form: {
            actions: {
                save: string;
                resetAll: string;
            };
        };
        tabs: {
            text: {
                label: string;
            };
            preview: {
                label: string;
            };
        };
        screens: {
            common: string;
            login: string;
            "sms-otp": string;
            "email-otp": string;
            "email-template": string;
            "sign-up": string;
            totp: string;
            myaccount: string;
            "password-recovery": string;
            "password-reset": string;
            "password-reset-success": string;
        };
    };
    brandingCustomText: {
        revertScreenConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        revertUnsavedConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        form: {
            genericFieldResetTooltip: string;
            genericFieldPlaceholder: string;
            fields: {
                copyright: {
                    hint: string;
                };
                "privacy.policy": {
                    hint: string;
                };
                "site.title": {
                    hint: string;
                };
                "terms.of.service": {
                    hint: string;
                };
                "login.button": {
                    hint: string;
                };
                "login.heading": {
                    hint: string;
                };
                "sms.otp.heading": {
                    hint: string;
                };
                "email.otp.heading": {
                    hint: string;
                };
                "totp.heading": {
                    hint: string;
                };
                "sign.up.button": {
                    hint: string;
                };
                "sign.up.heading": {
                    hint: string;
                };
                "password.recovery.body": {
                    hint: string;
                };
                "password.recovery.button": {
                    hint: string;
                };
                "password.recovery.heading": {
                    hint: string;
                };
                "password.reset.button": {
                    hint: string;
                };
                "password.reset.heading": {
                    hint: string;
                };
                "password.reset.success.action": {
                    hint: string;
                };
                "password.reset.success.body": {
                    hint: string;
                };
                "password.reset.success.heading": {
                    hint: string;
                };
            };
        };
        localeSelectDropdown: {
            label: string;
            placeholder: string;
        };
        modes: {
            text: {
                label: string;
            };
            json: {
                label: string;
            };
        };
        notifications: {
            getPreferenceError: {
                description: string;
                message: string;
            };
            revertError: {
                description: string;
                message: string;
            };
            resetSuccess: {
                description: string;
                message: string;
            };
            updateError: {
                description: string;
                message: string;
            };
            updateSuccess: {
                description: string;
                message: string;
            };
        };
        screenSelectDropdown: {
            label: string;
            placeholder: string;
        };
    };
    consoleSettings: {
        administrators: {
            add: {
                action: string;
                options: {
                    addExistingUser: string;
                    inviteNewUser: string;
                };
            };
            edit: {
                backButton: string;
            };
            tabLabel: string;
        };
        loginFlow: {
            tabLabel: string;
        };
        protocol: {
            tabLabel: string;
        };
        roles: {
            add: {
                organizationPermissions: {
                    label: string;
                };
                tenantPermissions: {
                    label: string;
                };
            };
            tabLabel: string;
            permissionLevels: {
                edit: string;
                view: string;
            };
        };
    };
    featureGate: {
        enabledFeatures: {
            tags: {
                premium: {
                    warning: string;
                };
            };
        };
    };
    develop: {
        features: {
            URLInput: {
                withLabel: {
                    positive: {
                        header: string;
                        content: string;
                        detailedContent: {
                            0: string;
                            1: string;
                        };
                    };
                    negative: {
                        header: string;
                        content: string;
                        detailedContent: {
                            0: string;
                            1: string;
                        };
                        leftAction: string;
                    };
                };
            };
            applications: {
                addWizard: {
                    steps: {
                        generalSettings: {
                            heading: string;
                        };
                        protocolConfig: {
                            heading: string;
                        };
                        protocolSelection: {
                            heading: string;
                        };
                        summary: {
                            heading: string;
                            sections: {
                                accessURL: {
                                    heading: string;
                                };
                                applicationQualifier: {
                                    heading: string;
                                };
                                assertionURLs: {
                                    heading: string;
                                };
                                audience: {
                                    heading: string;
                                };
                                callbackURLs: {
                                    heading: string;
                                };
                                certificateAlias: {
                                    heading: string;
                                };
                                discoverable: {
                                    heading: string;
                                };
                                grantType: {
                                    heading: string;
                                };
                                issuer: {
                                    heading: string;
                                };
                                metaFile: {
                                    heading: string;
                                };
                                metadataURL: {
                                    heading: string;
                                };
                                public: {
                                    heading: string;
                                };
                                realm: {
                                    heading: string;
                                };
                                renewRefreshToken: {
                                    heading: string;
                                };
                                replyTo: {
                                    heading: string;
                                };
                            };
                        };
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
                confirmations: {
                    addSocialLogin: {
                        content: string;
                        header: string;
                        subHeader: string;
                    };
                    changeProtocol: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteApplication: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteChoreoApplication: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteOutboundProvisioningIDP: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteProtocol: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    handlerAuthenticatorAddition: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    backupCodeAuthenticatorDelete: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    lowOIDCExpiryTimes: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    regenerateSecret: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    reactivateSPA: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    reactivateOIDC: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    removeApplicationUserAttribute: {
                        content: string;
                        header: string;
                        subHeader: string;
                    };
                    removeApplicationUserAttributeMapping: {
                        content: string;
                        header: string;
                        subHeader: string;
                    };
                    revokeApplication: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    clientSecretHashDisclaimer: {
                        modal: {
                            header: string;
                            message: string;
                            content: string;
                            assertionHint: string;
                        };
                        forms: {
                            clientIdSecretForm: {
                                clientId: {
                                    hide: string;
                                    show: string;
                                    label: string;
                                    placeholder: string;
                                    validations: {
                                        empty: string;
                                    };
                                };
                                clientSecret: {
                                    hide: string;
                                    show: string;
                                    label: string;
                                    placeholder: string;
                                    validations: {
                                        empty: string;
                                    };
                                };
                            };
                        };
                    };
                    certificateDelete: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    } & Record<string, string>;
                };
                dangerZoneGroup: {
                    header: string;
                    deleteApplication: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
                };
                edit: {
                    sections: {
                        access: {
                            addProtocolWizard: {
                                heading: string;
                                subHeading: string;
                                steps: {
                                    protocolSelection: {
                                        manualSetup: {
                                            emptyPlaceholder: {
                                                title: string;
                                                subtitles: string;
                                            };
                                            heading: string;
                                            subHeading: string;
                                        };
                                        quickSetup: {
                                            emptyPlaceholder: {
                                                title: string;
                                                subtitles: string;
                                            };
                                            heading: string;
                                            subHeading: string;
                                        };
                                    };
                                };
                            };
                            tabName: string;
                            protocolLanding: {
                                heading: string;
                                subHeading: string;
                            };
                        };
                        advanced: {
                            tabName: string;
                        };
                        attributes: {
                            forms: {
                                fields: {
                                    dynamic: {
                                        localRole: {
                                            label: string;
                                            validations: {
                                                empty: string;
                                            };
                                        };
                                        applicationRole: {
                                            label: string;
                                            validations: {
                                                empty: string;
                                                duplicate: string;
                                            };
                                        };
                                    };
                                };
                            };
                            selection: {
                                addWizard: {
                                    header: string;
                                    subHeading: string;
                                    steps: {
                                        select: {
                                            transfer: {
                                                searchPlaceholders: {
                                                    attribute: string;
                                                    role: string;
                                                };
                                                headers: {
                                                    attribute: string;
                                                };
                                            };
                                        };
                                    };
                                };
                                heading: string;
                                scopelessAttributes: {
                                    description: string;
                                    displayName: string;
                                    name: string;
                                    hint: string;
                                };
                                selectedScopesComponentHint: string;
                                howToUseScopesHint: string;
                                attributeComponentHint: string;
                                attributeComponentHintAlt: string;
                                description: string;
                                mandatoryAttributeHint: string;
                                mappingTable: {
                                    actions: {
                                        enable: string;
                                    };
                                    columns: {
                                        appAttribute: string;
                                        attribute: string;
                                        mandatory: string;
                                        requested: string;
                                    };
                                    mappedAtributeHint: string;
                                    mappingRevert: {
                                        confirmationHeading: string;
                                        confirmationMessage: string;
                                        confirmationContent: string;
                                        confirmPrimaryAction: string;
                                        confirmSecondaryAction: string;
                                    };
                                    listItem: {
                                        actions: {
                                            makeMandatory: string;
                                            makeRequested: string;
                                            makeScopeRequested: string;
                                            removeMandatory: string;
                                            removeRequested: string;
                                            removeScopeRequested: string;
                                            subjectDisabledSelection: string;
                                        };
                                        faultyAttributeMapping: string;
                                        faultyAttributeMappingHint: string;
                                        fields: {
                                            claim: {
                                                label: string;
                                                placeholder: string;
                                            };
                                        };
                                    };
                                    searchPlaceholder: string;
                                };
                                selectAll: string;
                            };
                            attributeMappingChange: {
                                error: {
                                    message: string;
                                    description: string;
                                };
                            };
                            emptySearchResults: {
                                subtitles: {
                                    0: string;
                                    1: string;
                                };
                                title: string;
                            };
                            roleMapping: {
                                heading: string;
                            };
                            tabName: string;
                        };
                        info: {
                            oidcHeading: string;
                            oidcSubHeading: string;
                            samlHeading: string;
                            samlSubHeading: string;
                            wsFedHeading: string;
                            wsFedSubHeading: string;
                            tabName: string;
                        };
                        general: {
                            tabName: string;
                        };
                        protocol: {
                            title: string;
                            subtitle: string;
                            button: string;
                        };
                        provisioning: {
                            tabName: string;
                            inbound: {
                                heading: string;
                                subHeading: string;
                            };
                            outbound: {
                                actions: {
                                    addIdp: string;
                                };
                                addIdpWizard: {
                                    heading: string;
                                    subHeading: string;
                                    steps: {
                                        details: string;
                                    };
                                    errors: {
                                        noProvisioningConnector: string;
                                    };
                                };
                                heading: string;
                                subHeading: string;
                            };
                        };
                        signOnMethod: {
                            tabName: string;
                            sections: {
                                authenticationFlow: {
                                    heading: string;
                                    sections: {
                                        scriptBased: {
                                            accordion: {
                                                title: {
                                                    description: string;
                                                    heading: string;
                                                };
                                            };
                                            conditionalAuthTour: {
                                                steps: {
                                                    0: {
                                                        heading: string;
                                                        content: {
                                                            0: string;
                                                            1: string;
                                                        };
                                                    };
                                                    1: {
                                                        heading: string;
                                                        content: {
                                                            0: string;
                                                        };
                                                    };
                                                    2: {
                                                        heading: string;
                                                        content: {
                                                            0: string;
                                                        };
                                                    };
                                                };
                                            };
                                            heading: string;
                                            hint: string;
                                            editor: {
                                                apiDocumentation: string;
                                                changeConfirmation: {
                                                    content: string;
                                                    heading: string;
                                                    message: string;
                                                };
                                                goToApiDocumentation: string;
                                                resetConfirmation: {
                                                    content: string;
                                                    heading: string;
                                                    message: string;
                                                };
                                                templates: {
                                                    heading: string;
                                                    darkMode: string;
                                                };
                                            };
                                            secretsList: {
                                                create: string;
                                                emptyPlaceholder: string;
                                                search: string;
                                                tooltips: {
                                                    keyIcon: string;
                                                    plusIcon: string;
                                                };
                                            };
                                        };
                                        stepBased: {
                                            actions: {
                                                addAuthentication: string;
                                                addNewStep: string;
                                                addStep: string;
                                                selectAuthenticator: string;
                                            };
                                            addAuthenticatorModal: {
                                                description: string;
                                                heading: string;
                                                content: Record<string, unknown>;
                                                primaryButton: string;
                                                secondaryButton: string;
                                            };
                                            heading: string;
                                            hint: string;
                                            forms: {
                                                fields: {
                                                    attributesFrom: {
                                                        label: string;
                                                        placeholder: string;
                                                    };
                                                    subjectIdentifierFrom: {
                                                        label: string;
                                                        placeholder: string;
                                                    };
                                                    enableBackupCodes: {
                                                        label: string;
                                                    };
                                                };
                                            };
                                            secondFactorDisabled: string;
                                            secondFactorDisabledDueToProxyMode: string;
                                            secondFactorDisabledInFirstStep: string;
                                            backupCodesDisabled: string;
                                            backupCodesDisabledInFirstStep: string;
                                            authenticatorDisabled: string;
                                            firstFactorDisabled: string;
                                            federatedSMSOTPConflictNote: {
                                                multipleIdps: string;
                                                singleIdp: string;
                                            };
                                            sessionExecutorDisabledInFirstStep: string;
                                            sessionExecutorDisabledInMultiOptionStep: string;
                                        };
                                    };
                                };
                                customization: {
                                    heading: string;
                                    revertToDefaultButton: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                                landing: {
                                    defaultConfig: {
                                        description: {
                                            0: string;
                                            1: string;
                                        };
                                        heading: string;
                                    };
                                    flowBuilder: {
                                        addMissingSocialAuthenticatorModal: {
                                            description: string;
                                            heading: string;
                                            content: Record<string, unknown>;
                                            primaryButton: string;
                                            secondaryButton: string;
                                        };
                                        duplicateSocialAuthenticatorSelectionModal: {
                                            description: string;
                                            heading: string;
                                            content: Record<string, unknown>;
                                            primaryButton: string;
                                            secondaryButton: string;
                                        };
                                        heading: string;
                                        headings: {
                                            default: string;
                                            socialLogin: string;
                                            multiFactorLogin: string;
                                            passwordlessLogin: string;
                                        };
                                        types: {
                                            apple: {
                                                description: string;
                                                heading: string;
                                            };
                                            defaultConfig: {
                                                description: string;
                                                heading: string;
                                            };
                                            facebook: {
                                                description: string;
                                                heading: string;
                                            };
                                            github: {
                                                description: string;
                                                heading: string;
                                            };
                                            google: {
                                                description: string;
                                                heading: string;
                                            };
                                            idf: {
                                                tooltipText: string;
                                            };
                                            totp: {
                                                description: string;
                                                heading: string;
                                            };
                                            usernameless: {
                                                description: string;
                                                heading: string;
                                                info: string;
                                            };
                                            passkey: {
                                                description: string;
                                                heading: string;
                                                info: {
                                                    progressiveEnrollmentEnabled: string;
                                                    passkeyAsFirstStepWhenprogressiveEnrollmentEnabled: string;
                                                    passkeyIsNotFirstStepWhenprogressiveEnrollmentEnabled: string;
                                                    progressiveEnrollmentEnabledCheckbox: string;
                                                    progressiveEnrollmentDisabled: string;
                                                };
                                            };
                                            magicLink: {
                                                description: string;
                                                heading: string;
                                            };
                                            microsoft: {
                                                description: string;
                                                heading: string;
                                            };
                                            emailOTP: {
                                                description: string;
                                                heading: string;
                                            };
                                            smsOTP: {
                                                description: string;
                                                heading: string;
                                            };
                                            emailOTPFirstFactor: {
                                                description: string;
                                                heading: string;
                                            };
                                            smsOTPFirstFactor: {
                                                description: string;
                                                heading: string;
                                            };
                                        };
                                    };
                                };
                                requestPathAuthenticators: {
                                    title: string;
                                    subTitle: string;
                                    notifications: {
                                        getRequestPathAuthenticators: {
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
                                templateDescription: {
                                    popupContent: string;
                                    description: {
                                        prerequisites: string;
                                        parameters: string;
                                        description: string;
                                        defaultSteps: string;
                                        helpReference: string;
                                        code: string;
                                    };
                                };
                            };
                        };
                        sharedAccess: {
                            subTitle: string;
                            tabName: string;
                        };
                        shareApplication: {
                            heading: string;
                            shareApplication: string;
                            addSharingNotification: {
                                genericError: {
                                    message: string;
                                    description: string;
                                };
                                success: {
                                    message: string;
                                    description: string;
                                };
                            };
                            stopSharingNotification: {
                                genericError: {
                                    message: string;
                                    description: string;
                                };
                                success: {
                                    message: string;
                                    description: string;
                                };
                            };
                            getSharedOrganizations: {
                                genericError: {
                                    message: string;
                                    description: string;
                                };
                            };
                            stopAllSharingNotification: {
                                genericError: {
                                    message: string;
                                    description: string;
                                };
                                success: {
                                    message: string;
                                    description: string;
                                };
                            };
                            switchToSelectiveShareFromSharingWithAllSuborgsWarning: string;
                        };
                        apiAuthorization: {
                            m2mPolicyMessage: string;
                        };
                        roles: {
                            createApplicationRoleWizard: {
                                title: string;
                                subTitle: string;
                                button: string;
                            };
                        };
                    };
                };
                forms: {
                    advancedAttributeSettings: {
                        sections: {
                            linkedAccounts: {
                                errorAlert: {
                                    message: string;
                                    description: string;
                                };
                                heading: string;
                                descriptionFederated: string;
                                fields: {
                                    validateLocalAccount: {
                                        hint: string;
                                        label: string;
                                    };
                                    mandateLocalAccount: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            subject: {
                                fields: {
                                    alternateSubjectAttribute: {
                                        hint: string;
                                        label: string;
                                    };
                                    subjectAttribute: {
                                        hintOIDC: string;
                                        hintSAML: string;
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    subjectIncludeTenantDomain: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    subjectIncludeUserDomain: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    subjectUseMappedLocalSubject: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    subjectType: {
                                        public: {
                                            label: string;
                                            hint: string;
                                        };
                                        pairwise: {
                                            label: string;
                                            hint: string;
                                        };
                                        label: string;
                                    };
                                    sectorIdentifierURI: {
                                        multipleCallbackError: string;
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            invalid: string;
                                            required: string;
                                        };
                                    };
                                };
                                heading: string;
                            };
                            role: {
                                heading: string;
                                fields: {
                                    roleAttribute: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    role: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                    advancedConfig: {
                        fields: {
                            enableAuthorization: {
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            returnAuthenticatedIdpList: {
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            saas: {
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            skipConsentLogin: {
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            skipConsentLogout: {
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                        sections: {
                            applicationNativeAuthentication: {
                                heading: string;
                                alerts: {
                                    clientAttestation: string;
                                };
                                fields: {
                                    enableAPIBasedAuthentication: {
                                        hint: string;
                                        label: string;
                                    };
                                    enableClientAttestation: {
                                        hint: string;
                                        label: string;
                                    };
                                    android: {
                                        heading: string;
                                        fields: {
                                            androidPackageName: {
                                                hint: string;
                                                label: string;
                                                placeholder: string;
                                                validations: {
                                                    empty: string;
                                                };
                                            };
                                            androidAttestationServiceCredentials: {
                                                hint: string;
                                                label: string;
                                                placeholder: string;
                                                validations: {
                                                    empty: string;
                                                };
                                            };
                                        };
                                    };
                                    apple: {
                                        heading: string;
                                        fields: {
                                            appleAppId: {
                                                hint: string;
                                                label: string;
                                                placeholder: string;
                                            };
                                        };
                                    };
                                };
                            };
                            certificate: {
                                heading: string;
                                hint: {
                                    customOidc: string;
                                    customPassiveSTS: string;
                                    customSaml: string;
                                };
                                fields: {
                                    jwksValue: {
                                        description: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    pemValue: {
                                        description: string;
                                        actions: {
                                            view: string;
                                        };
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    type: {
                                        children: {
                                            jwks: {
                                                label: string;
                                            };
                                            pem: {
                                                label: string;
                                            };
                                        };
                                        label: string;
                                    };
                                };
                                invalidOperationModal: {
                                    header: string;
                                    message: string;
                                };
                            };
                        };
                    };
                    generalDetails: {
                        fields: {
                            name: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    duplicate: string;
                                    reserved: string;
                                };
                            };
                            description: {
                                label: string;
                                placeholder: string;
                            };
                            imageUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                };
                            };
                            discoverable: {
                                hint: string;
                                label: string;
                            };
                            accessUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            isSharingEnabled: {
                                hint: string;
                                label: string;
                            };
                            isManagementApp: {
                                hint: string;
                                label: string;
                            };
                            isFapiApp: {
                                hint: string;
                                label: string;
                            };
                        };
                        managementAppBanner: string;
                    };
                    inboundCustom: {
                        fields: {
                            checkbox: {
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            dropdown: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            generic: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            password: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                    };
                    inboundOIDC: {
                        description: string;
                        documentation: string;
                        fields: {
                            allowedOrigins: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            callBackUrls: {
                                info: string;
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                    required: string;
                                };
                            };
                            clientID: {
                                label: string;
                            };
                            clientSecret: {
                                hashedDisclaimer: string;
                                hideSecret: string;
                                message: string;
                                showSecret: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            grant: {
                                children: {
                                    client_credential: {
                                        hint: string;
                                        label: string;
                                    };
                                    implicit: {
                                        hint: string;
                                        label: string;
                                    };
                                    password: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                                validation: {
                                    refreshToken: string;
                                };
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            public: {
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                        mobileApp: {
                            discoverableHint: string;
                            mobileAppPlaceholder: string;
                        };
                        dropdowns: {
                            selectOption: string;
                        };
                        sections: {
                            accessToken: {
                                heading: string;
                                hint: string;
                                fields: {
                                    bindingType: {
                                        children: {
                                            ssoBinding: {
                                                label: string;
                                            };
                                        };
                                        description: string;
                                        label: string;
                                        valueDescriptions: {
                                            cookie: string;
                                            none: string;
                                            sso_session: string;
                                        };
                                    };
                                    expiry: {
                                        labelForSPA: string;
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    applicationTokenExpiry: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    type: {
                                        label: string;
                                        valueDescriptions: {
                                            default: string;
                                            jwt: string;
                                        };
                                    };
                                    revokeToken: {
                                        hint: string;
                                        label: string;
                                    };
                                    validateBinding: {
                                        hint: string;
                                        label: string;
                                    };
                                    audience: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            duplicate: string;
                                            invalid: string;
                                        };
                                    };
                                };
                            };
                            idToken: {
                                heading: string;
                                fields: {
                                    expiry: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    algorithm: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    audience: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            duplicate: string;
                                            invalid: string;
                                        };
                                    };
                                    encryption: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    signing: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    method: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            logoutURLs: {
                                heading: string;
                                fields: {
                                    back: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    front: {
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                };
                            };
                            pkce: {
                                description: string;
                                heading: string;
                                hint: string;
                                fields: {
                                    pkce: {
                                        children: {
                                            mandatory: {
                                                label: string;
                                            };
                                            plainAlg: {
                                                label: string;
                                            };
                                        };
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            clientAuthentication: {
                                heading: string;
                                fields: {
                                    authenticationMethod: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    signingAlgorithm: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    subjectDN: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                            };
                            pushedAuthorization: {
                                heading: string;
                                fields: {
                                    requirePushAuthorizationRequest: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            requestObject: {
                                heading: string;
                                fields: {
                                    requestObjectSigningAlg: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    requestObjectEncryptionAlgorithm: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                    requestObjectEncryptionMethod: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                    };
                                };
                            };
                            refreshToken: {
                                heading: string;
                                fields: {
                                    expiry: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    renew: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            requestObjectSignature: {
                                heading: string;
                                description: string;
                                fields: {
                                    signatureValidation: {
                                        label: string;
                                    };
                                };
                            };
                            scopeValidators: {
                                heading: string;
                                fields: {
                                    validator: {
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            certificates: {
                                disabledPopup: string;
                            };
                        };
                        messages: {
                            revokeDisclaimer: {
                                heading: string;
                                content: string;
                            };
                            customInvalidMessage: string;
                        };
                    };
                    inboundSAML: {
                        description: string;
                        documentation: string;
                        fields: {
                            assertionURLs: {
                                info: string;
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                    required: string;
                                };
                            };
                            defaultAssertionURL: {
                                hint: string;
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            idpEntityIdAlias: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            issuer: {
                                errorMessage: string;
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            metaURL: {
                                errorMessage: string;
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            mode: {
                                children: {
                                    manualConfig: {
                                        label: string;
                                    };
                                    metadataFile: {
                                        label: string;
                                    };
                                    metadataURL: {
                                        label: string;
                                    };
                                };
                                hint: string;
                                label: string;
                            };
                            qualifier: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                        sections: {
                            assertion: {
                                heading: string;
                                fields: {
                                    audience: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            invalid: string;
                                        };
                                    };
                                    nameIdFormat: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    recipients: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            invalid: string;
                                        };
                                    };
                                };
                            };
                            attributeProfile: {
                                heading: string;
                                fields: {
                                    enable: {
                                        hint: string;
                                        label: string;
                                    };
                                    includeAttributesInResponse: {
                                        hint: string;
                                        label: string;
                                    };
                                    serviceIndex: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            encryption: {
                                heading: string;
                                fields: {
                                    assertionEncryption: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    assertionEncryptionAlgorithm: {
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    keyEncryptionAlgorithm: {
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            idpInitiatedSLO: {
                                heading: string;
                                fields: {
                                    enable: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    returnToURLs: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            invalid: string;
                                        };
                                    };
                                };
                            };
                            responseSigning: {
                                heading: string;
                                fields: {
                                    digestAlgorithm: {
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    responseSigning: {
                                        hint: string;
                                        label: string;
                                    };
                                    signingAlgorithm: {
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            requestProfile: {
                                heading: string;
                                fields: {
                                    enable: {
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            requestValidation: {
                                heading: string;
                                fields: {
                                    signatureValidation: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    signatureValidationCertAlias: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            sloProfile: {
                                heading: string;
                                fields: {
                                    enable: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    logoutMethod: {
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    requestURL: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                    responseURL: {
                                        hint: string;
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                            invalid: string;
                                        };
                                    };
                                };
                            };
                            ssoProfile: {
                                heading: string;
                                fields: {
                                    artifactBinding: {
                                        hint: string;
                                        label: string;
                                    };
                                    bindings: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                    idpInitiatedSSO: {
                                        hint: string;
                                        label: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            certificates: {
                                disabledPopup: string;
                                certificateRemoveConfirmation: {
                                    header: string;
                                    content: string;
                                };
                            };
                        };
                    };
                    inboundSTS: {
                        fields: {
                            realm: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            replyTo: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            replyToLogout: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                        };
                    };
                    inboundWSTrust: {
                        fields: {
                            audience: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            certificateAlias: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                    };
                    outboundProvisioning: {
                        fields: {
                            blocking: {
                                hint: string;
                                label: string;
                            };
                            connector: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            idp: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            jit: {
                                hint: string;
                                label: string;
                            };
                            rules: {
                                hint: string;
                                label: string;
                            };
                        };
                    };
                    provisioningConfig: {
                        fields: {
                            proxyMode: {
                                hint: string;
                                label: string;
                            };
                            userstoreDomain: {
                                hint: string;
                                label: string;
                            };
                        };
                    };
                    spaProtocolSettingsWizard: {
                        fields: {
                            callBackUrls: {
                                label: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            name: {
                                label: string;
                                validations: {
                                    invalid: string;
                                };
                            };
                            urlDeepLinkError: string;
                        };
                    };
                };
                helpPanel: {
                    tabs: {
                        configs: {
                            content: {
                                subTitle: string;
                                title: string;
                            };
                            heading: string;
                        };
                        docs: {
                            content: null;
                            heading: string;
                        };
                        samples: {
                            content: {
                                sample: {
                                    configurations: {
                                        btn: string;
                                        subTitle: string;
                                        title: string;
                                    };
                                    downloadSample: {
                                        btn: string;
                                        subTitle: string;
                                        title: string;
                                    };
                                    goBack: string;
                                    subTitle: string;
                                    title: string;
                                };
                                technology: {
                                    subTitle: string;
                                    title: string;
                                };
                            };
                            heading: string;
                        };
                        sdks: {
                            content: {
                                sdk: {
                                    goBack: string;
                                    subTitle: string;
                                    title: string;
                                };
                            };
                            heading: string;
                        };
                        start: {
                            content: {
                                endpoints: {
                                    subTitle: string;
                                    title: string;
                                };
                                oidcConfigurations: {
                                    labels: {
                                        authorize: string;
                                        dynamicClientRegistration: string;
                                        endSession: string;
                                        introspection: string;
                                        issuer: string;
                                        jwks: string;
                                        keystore: string;
                                        openIdServer: string;
                                        pushedAuthorizationRequest: string;
                                        revoke: string;
                                        sessionIframe: string;
                                        token: string;
                                        userInfo: string;
                                        webFinger: string;
                                        wellKnown: string;
                                    };
                                };
                                samlConfigurations: {
                                    buttons: {
                                        certificate: string;
                                        metadata: string;
                                    };
                                    labels: {
                                        certificate: string;
                                        issuer: string;
                                        metadata: string;
                                        slo: string;
                                        sso: string;
                                        destinationURL: string;
                                        artifactResolutionUrl: string;
                                    };
                                };
                                trySample: {
                                    btn: string;
                                    subTitle: string;
                                    title: string;
                                };
                                useSDK: {
                                    btns: {
                                        withSDK: string;
                                        withoutSDK: string;
                                    };
                                    subTitle: string;
                                    title: string;
                                };
                                wsFedConfigurations: {
                                    labels: {
                                        passiveSTSUrl: string;
                                    };
                                };
                            };
                            heading: string;
                        };
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        name: string;
                        inboundKey: string;
                    };
                    actions: {
                        add: string;
                        predefined: string;
                        custom: string;
                    };
                    labels: {
                        fragment: string;
                    };
                };
                myaccount: {
                    title: string;
                    description: string;
                    popup: string;
                    enable: {
                        0: string;
                        1: string;
                    };
                    Confirmation: {
                        enableConfirmation: {
                            content: string;
                            heading: string;
                            message: string;
                        };
                        disableConfirmation: {
                            content: string;
                            heading: string;
                            message: string;
                        };
                    };
                    notifications: {
                        error: {
                            description: string;
                            message: string;
                        };
                        genericError: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                    fetchMyAccountStatus: {
                        error: {
                            description: string;
                            message: string;
                        };
                        genericError: {
                            description: string;
                            message: string;
                        };
                    };
                };
                notifications: {
                    addApplication: {
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
                    apiLimitReachedError: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    authenticationStepMin: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    authenticationStepDeleteErrorDueToSecondFactors: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    authenticationStepDeleteErrorDueToAppShared: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    deleteApplication: {
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
                    deleteOptionErrorDueToSecondFactorsOnRight: {
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
                    deleteProtocolConfig: {
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
                    duplicateAuthenticationStep: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    emptyAuthenticationStep: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    fetchAllowedCORSOrigins: {
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
                    fetchApplication: {
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
                    fetchMyAccountApplication: {
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
                    fetchApplications: {
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
                    fetchCustomInboundProtocols: {
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
                    fetchInboundProtocols: {
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
                    fetchProtocolMeta: {
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
                    fetchSAMLIDPConfigs: {
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
                    fetchOIDCIDPConfigs: {
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
                    fetchTemplate: {
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
                    fetchTemplates: {
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
                    getInboundProtocolConfig: {
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
                    regenerateSecret: {
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
                    revokeApplication: {
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
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: string;
                            title: string;
                            subtitles: string;
                        };
                        heading: string;
                    };
                    updateAdvancedConfig: {
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
                    updateApplication: {
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
                    updateAuthenticationFlow: {
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
                    updateClaimConfig: {
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
                    updateInboundProtocolConfig: {
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
                    updateInboundProvisioningConfig: {
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
                    updateOutboundProvisioning: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    updateProtocol: {
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
                    fetchOIDCServiceEndpoints: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    secondFactorAuthenticatorToFirstStep: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    firstFactorAuthenticatorToSecondStep: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    conditionalScriptLoopingError: {
                        message: string;
                        description: string;
                    };
                    deleteCertificateSuccess: {
                        message: string;
                        description: string;
                    };
                    deleteCertificateGenericError: {
                        message: string;
                        description: string;
                    };
                    updateOnlyIdentifierFirstError: {
                        message: string;
                        description: string;
                    };
                    updateIdentifierFirstInFirstStepError: {
                        message: string;
                        description: string;
                    };
                };
                popups: {
                    appStatus: {
                        active: {
                            content: string;
                            header: string;
                            subHeader: string;
                        };
                        notConfigured: {
                            content: string;
                            header: string;
                            subHeader: string;
                        };
                        revoked: {
                            content: string;
                            header: string;
                            subHeader: string;
                        };
                    };
                };
                placeholders: {
                    emptyAttributesList: {
                        action: string;
                        title: string;
                        subtitles: string;
                    };
                    emptyAuthenticatorStep: {
                        title: string;
                        subtitles: {
                            0: string;
                        };
                    };
                    emptyAuthenticatorsList: {
                        title: string;
                        subtitles: string;
                    };
                    emptyOutboundProvisioningIDPs: {
                        action: string;
                        title: string;
                        subtitles: string;
                    };
                    emptyList: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptyProtocolList: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                };
                resident: {
                    provisioning: {
                        outbound: {
                            actions: {
                                addIdp: string;
                            };
                            addIdpWizard: {
                                heading: string;
                                subHeading: string;
                                steps: {
                                    details: string;
                                };
                            };
                            emptyPlaceholder: {
                                action: string;
                                title: string;
                                subtitles: string;
                            };
                            form: {
                                fields: {
                                    connection: {
                                        label: string;
                                        placeholder: string;
                                        validations: {
                                            empty: string;
                                        };
                                    };
                                };
                            };
                            heading: string;
                            subHeading: string;
                            notifications: {
                                create: {
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
                                delete: {
                                    genericError: {
                                        message: string;
                                        description: string;
                                    };
                                    success: {
                                        message: string;
                                        description: string;
                                    };
                                };
                                fetch: {
                                    genericError: {
                                        message: string;
                                        description: string;
                                    };
                                };
                                update: {
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
                wizards: {
                    minimalAppCreationWizard: {
                        help: {
                            heading: string;
                            subHeading: string;
                            template: {
                                common: {
                                    authorizedRedirectURLs: {
                                        example: string;
                                        subTitle: string;
                                        title: string;
                                    };
                                    heading: {
                                        example: string;
                                        subTitle: string;
                                        title: string;
                                    };
                                    protocol: {
                                        subTitle: string;
                                        title: string;
                                    };
                                };
                                label: string;
                                samlWeb: {
                                    assertionResponseURLs: {
                                        example: string;
                                        subTitle: string;
                                        title: string;
                                    };
                                    issuer: {
                                        example: string;
                                        subTitle: string;
                                        title: string;
                                    };
                                    metaFile: {
                                        subTitle: string;
                                        title: string;
                                    };
                                    metaURL: {
                                        subTitle: string;
                                        title: string;
                                    };
                                };
                            };
                        };
                    };
                    applicationCertificateWizard: {
                        heading: string;
                        subHeading: string;
                        emptyPlaceHolder: {
                            title: string;
                            description1: string;
                            description2: string;
                        };
                    };
                };
            };
            authenticationProvider: {
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
                buttons: {
                    addIDP: string;
                    addAuthenticator: string;
                    addConnector: string;
                    addAttribute: string;
                    addCertificate: string;
                };
                confirmations: {
                    deleteIDP: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteIDPWithConnectedApps: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteAuthenticator: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteConnector: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                    deleteCertificate: {
                        header: string;
                        message: string;
                        content: string;
                        assertionHint: string;
                    };
                };
                dangerZoneGroup: {
                    header: string;
                    disableIDP: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                        subheader2: string;
                    };
                    deleteIDP: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
                };
                edit: {
                    common: {
                        settings: {
                            tabName: string;
                        };
                    };
                    emailOTP: {
                        emailTemplate: {
                            tabName: string;
                        };
                    };
                    smsOTP: {
                        smsProvider: {
                            tabName: string;
                        };
                    };
                };
                forms: {
                    advancedConfigs: {
                        federationHub: {
                            hint: string;
                            label: string;
                        };
                        homeRealmIdentifier: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        alias: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        certificateType: {
                            label: string;
                            hint: string;
                            certificatePEM: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            certificateJWKS: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
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
                    authenticatorSettings: {
                        apple: {
                            additionalQueryParameters: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            callbackUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            keyId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            privateKey: {
                                hint: string;
                                label: string;
                                placeholder: string;

                                validations: {
                                    required: string;
                                };
                            };
                            secretValidityPeriod: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    };
                                    name: {
                                        description: string;
                                    };
                                };
                            };
                            teamId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                        };
                        emailOTP: {
                            enableBackupCodes: {
                                hint: string;
                                label: string;
                                validations: {
                                    required: string;
                                };
                            };
                            expiryTime: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: string;
                                    required: string;
                                };
                                unit: string;
                            };
                            tokenLength: {
                                hint: string;
                                label: string;
                                unit: {
                                    digits: string;
                                    characters: string;
                                };
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: {
                                        digits: string;
                                        characters: string;
                                    };
                                    required: string;
                                };
                            };
                            useAlphanumericChars: {
                                hint: string;
                                label: string;
                                validations: {
                                    required: string;
                                };
                            };
                        };
                        smsOTP: {
                            hint: string;
                            expiryTime: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: string;
                                    required: string;
                                };
                                unit: string;
                            };
                            tokenLength: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    invalid: string;
                                    range: {
                                        digits: string;
                                        characters: string;
                                    };
                                    required: string;
                                };
                                unit: {
                                    digits: string;
                                    characters: string;
                                };
                            };
                            useNumericChars: {
                                hint: string;
                                label: string;
                                validations: {
                                    required: string;
                                };
                            };
                            allowedResendAttemptCount: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                    invalid: string;
                                    range: string;
                                };
                            };
                        };
                        fido2: {
                            allowProgressiveEnrollment: {
                                hint: string;
                                label: string;
                            };
                            allowUsernamelessAuthentication: {
                                hint: string;
                                label: string;
                            };
                        };
                        facebook: {
                            callbackUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientSecret: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    };
                                    profile: {
                                        description: string;
                                    };
                                };
                            };
                            userInfo: {
                                heading: string;
                                hint: string;
                                placeholder: string;
                                list: {
                                    ageRange: {
                                        description: string;
                                    };
                                    email: {
                                        description: string;
                                    };
                                    firstName: {
                                        description: string;
                                    };
                                    gender: {
                                        description: string;
                                    };
                                    id: {
                                        description: string;
                                    };
                                    lastName: {
                                        description: string;
                                    };
                                    link: {
                                        description: string;
                                    };
                                    name: {
                                        description: string;
                                    };
                                };
                            };
                        };
                        github: {
                            callbackUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientId: {
                                hint: string;
                                label: string;
                                placeholder: string;

                                validations: {
                                    required: string;
                                };
                            };
                            clientSecret: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    };
                                    profile: {
                                        description: string;
                                    };
                                };
                            };
                        };
                        google: {
                            callbackUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientSecret: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            enableGoogleOneTap: {
                                hint: string;
                                label: string;
                                placeholder: string;
                            };
                            AdditionalQueryParameters: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                                validations: {
                                    required: string;
                                };
                            };
                            scopes: {
                                heading: string;
                                hint: string;
                                list: {
                                    email: {
                                        description: string;
                                    };
                                    openid: {
                                        description: string;
                                    };
                                    profile: {
                                        description: string;
                                    };
                                };
                            };
                        };
                        microsoft: {
                            callbackUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            clientSecret: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            commonAuthQueryParams: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                                validations: {
                                    required: string;
                                };
                            };
                            scopes: {
                                ariaLabel: string;
                                heading: string;
                                hint: string;
                                label: string;
                                list: {
                                    email: {
                                        description: string;
                                    };
                                    openid: {
                                        description: string;
                                    };
                                    profile: {
                                        description: string;
                                    };
                                };
                                placeholder: string;
                            };
                        };
                        hypr: {
                            appId: {
                                hint: string;
                                label: string;
                                placeholder: string;

                                validations: {
                                    required: string;
                                };
                            };
                            apiToken: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            baseUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                        };
                        iproov: {
                            apiKey: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            apiSecret: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            oauthUsername: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            oauthPassword: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            baseUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            enableProgressiveEnrollment: {
                                hint: string;
                                label: string;
                            };
                        };
                        saml: {
                            AuthRedirectUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            SPEntityId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            SSOUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            IdPEntityId: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            NameIDType: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            RequestMethod: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            IsSLORequestAccepted: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            IsLogoutEnabled: {
                                hint: string;
                                label: string;

                                ariaLabel: string;
                            };
                            LogoutReqUrl: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            IsAuthnRespSigned: {
                                hint: string;
                                label: string;

                                ariaLabel: string;
                            };
                            IsLogoutReqSigned: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            ISAuthnReqSigned: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            SignatureAlgorithm: {
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            DigestAlgorithm: {
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            IncludeProtocolBinding: {
                                hint: string;
                                label: string;

                                ariaLabel: string;
                            };
                            IsUserIdInClaims: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            commonAuthQueryParams: {
                                label: string;
                                ariaLabel: string;
                            };

                            isAssertionSigned: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            includeCert: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            includeNameIDPolicy: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            isEnableAssertionEncryption: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };

                            authenticationContextClass: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            customAuthenticationContextClass: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                            attributeConsumingServiceIndex: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };

                            isArtifactBindingEnabled: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            artifactResolveEndpointUrl: {
                                placeholder: string;
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            isArtifactResolveReqSigned: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            isArtifactResponseSigned: {
                                hint: string;
                                label: string;
                                ariaLabel: string;
                            };
                            authContextComparisonLevel: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                ariaLabel: string;
                            };
                        };
                    };
                    outboundConnectorAccordion: {
                        default: {
                            0: string;
                            1: string;
                        };
                        enable: {
                            0: string;
                            1: string;
                        };
                    };
                    common: {
                        requiredErrorMessage: string;
                        invalidURLErrorMessage: string;
                        invalidQueryParamErrorMessage: string;
                        invalidScopesErrorMessage: string;
                        customProperties: string;
                    };
                    generalDetails: {
                        name: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                duplicate: string;
                                required: string;
                                maxLengthReached: string;
                            };
                        };
                        issuer: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        alias: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        description: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        image: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                    };
                    jitProvisioning: {
                        enableJITProvisioning: {
                            hint: string;
                            label: string;
                            disabledMessageContent: string;
                            disabledMessageHeader: string;
                        };
                        provisioningUserStoreDomain: {
                            hint: string;
                            label: string;
                        };
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
                        associateLocalUser: {
                            hint: string;
                            label: string;
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
                        group: {
                            heading: string;
                            hint: string;
                            mappedRolesAbsentMessage: string;
                            mappedRolesPresentMessage: string;
                            messageOIDC: string;
                            messageSAML: string;
                            placeHolder: string;
                            roleMappingDisabledMessage: string;
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
                    certificateSection: {
                        certificateEditSwitch: {
                            jwks: string;
                            pem: string;
                        };
                        noCertificateAlert: string;
                    };
                };
                helpPanel: {
                    tabs: {
                        samples: {
                            content: {
                                docs: {
                                    goBack: string;
                                    hint: string;
                                    title: string;
                                };
                            };
                            heading: string;
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
                    apple: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            keyId: {
                                description: string;
                                heading: string;
                            };
                            name: {
                                connectionDescription: string;
                                idpDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureAppleSignIn: string;
                                configureReturnURL: string;
                                configureWebDomain: string;
                                getCredentials: string;
                                heading: string;
                            };
                            privateKey: {
                                description: string;
                                heading: string;
                            };
                            subHeading: string;
                            teamId: {
                                description: string;
                                heading: string;
                            };
                        };
                    };
                    expert: {
                        wizardHelp: {
                            heading: string;
                            description: {
                                connectionDescription: string;
                                heading: string;
                                idpDescription: string;
                            };
                            name: {
                                connectionDescription: string;
                                heading: string;
                                idpDescription: string;
                            };
                            subHeading: string;
                        };
                    };
                    facebook: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            clientSecret: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureOAuthApps: string;
                                configureRedirectURL: string;
                                configureSiteURL: string;
                                getCredentials: string;
                                heading: string;
                            };
                            subHeading: string;
                        };
                    };
                    github: {
                        wizardHelp: {
                            heading: string;
                            subHeading: string;
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            clientSecret: {
                                description: string;
                                heading: string;
                            };
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureOAuthApps: string;
                                configureHomePageURL: string;
                                configureRedirectURL: string;
                                heading: string;
                                getCredentials: string;
                            };
                        };
                    };
                    google: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            clientSecret: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureOAuthApps: string;
                                configureRedirectURL: string;
                                getCredentials: string;
                                heading: string;
                            };
                            subHeading: string;
                        };
                    };
                    organizationIDP: {
                        wizardHelp: {
                            name: {
                                description: string;
                                heading: string;
                            };
                            description: {
                                description: string;
                                heading: string;
                                example: string;
                            };
                        };
                    };
                    microsoft: {
                        wizardHelp: {
                            clientId: {
                                description: string;
                                heading: string;
                            };
                            clientSecret: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                configureOAuthApps: string;
                                configureRedirectURL: string;
                                getCredentials: string;
                                heading: string;
                            };
                            subHeading: string;
                        };
                    };
                    hypr: {
                        wizardHelp: {
                            apiToken: {
                                description: string;
                                heading: string;
                            };
                            appId: {
                                description: string;
                                heading: string;
                            };
                            baseUrl: {
                                description: string;
                                heading: string;
                            };
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                rpDescription: string;
                                tokenDescription: string;
                                heading: string;
                            };
                        };
                    };
                    iproov: {
                        wizardHelp: {
                            baseUrl: {
                                description: string;
                                heading: string;
                            };
                            oauthUsername: {
                                description: string;
                                heading: string;
                            };
                            oauthPassword: {
                                description: string;
                                heading: string;
                            };
                            apiKey: {
                                description: string;
                                heading: string;
                            };
                            apiSecret: {
                                description: string;
                                heading: string;
                            };
                            enableProgressiveEnrollment: {
                                description: string;
                                heading: string;
                            }
                            heading: string;
                            name: {
                                idpDescription: string;
                                connectionDescription: string;
                                heading: string;
                            };
                            preRequisites: {
                                appDescription: string;
                                heading: string;
                            };
                        }
                    };
                    enterprise: {
                        addWizard: {
                            title: string;
                            subtitle: string;
                        };
                        saml: {
                            preRequisites: {
                                configureIdp: string;
                                configureRedirectURL: string;
                                heading: string;
                                hint: string;
                            };
                        };
                        validation: {
                            name: string;
                            invalidName: string;
                        };
                    };
                    trustedTokenIssuer: {
                        addWizard: {
                            title: string;
                            subtitle: string;
                        };
                        forms: {
                            steps: {
                                general: string;
                                certificate: string;
                            };
                            name: {
                                label: string;
                                placeholder: string;
                            };
                            issuer: {
                                label: string;
                                placeholder: string;
                                hint: string;
                                validation: {
                                    notValid: string;
                                };
                            };
                            alias: {
                                label: string;
                                placeholder: string;
                                hint: string;
                                validation: {
                                    notValid: string;
                                };
                            };
                            certificateType: {
                                label: string;
                                requiredCertificate: string;
                            };
                            jwksUrl: {
                                optionLabel: string;
                                placeholder: string;
                                label: string;
                                hint: string;
                                validation: {
                                    notValid: string;
                                };
                            };
                            pem: {
                                optionLabel: string;
                                hint: string;
                                uploadCertificateButtonLabel: string;
                                dropzoneText: string;
                                pasteAreaPlaceholderText: string;
                            };
                        };
                    };
                };
                list: {
                    actions: string;
                    name: string;
                };
                modals: {
                    addAuthenticator: {
                        title: string;
                        subTitle: string;
                    };
                    addCertificate: {
                        title: string;
                        subTitle: string;
                    };
                    addProvisioningConnector: {
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
                    addFederatedAuthenticator: {
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
                    addIDP: {
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
                    changeCertType: {
                        pem: {
                            description: string;
                            message: string;
                        };
                        jwks: {
                            description: string;
                            message: string;
                        };
                    };
                    deleteCertificate: {
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
                    deleteIDP: {
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
                    deleteIDPWithConnectedApps: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    deleteConnection: {
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
                    disableAuthenticator: {
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
                    disableIDPWithConnectedApps: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    disableOutboundProvisioningConnector: {
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
                    duplicateCertificateUpload: {
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
                    getIDP: {
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
                    getIDPList: {
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
                    getIDPTemplate: {
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
                    getIDPTemplateList: {
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
                    getFederatedAuthenticator: {
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
                    getFederatedAuthenticatorsList: {
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
                    getFederatedAuthenticatorMetadata: {
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
                    getConnectionDetails: {
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
                    getOutboundProvisioningConnector: {
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
                    getOutboundProvisioningConnectorsList: {
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
                    getOutboundProvisioningConnectorMetadata: {
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
                    getAllLocalClaims: {
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
                    getRolesList: {
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
                    submitAttributeSettings: {
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
                    deleteDefaultAuthenticator: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                        success: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                    };
                    deleteDefaultConnector: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                        success: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                    };
                    updateAttributes: {
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
                    updateClaimsConfigs: {
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
                    updateFederatedAuthenticator: {
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
                    updateFederatedAuthenticators: {
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
                    updateEmailOTPAuthenticator: {
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
                    updateSMSOTPAuthenticator: {
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
                    updateGenericAuthenticator: {
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
                    updateIDP: {
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
                    updateIDPCertificate: {
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
                    updateIDPRoleMappings: {
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
                    updateJITProvisioning: {
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
                    updateOutboundProvisioningConnectors: {
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
                    updateOutboundProvisioningConnector: {
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
                    apiLimitReachedError: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                };
                popups: {
                    appStatus: {
                        enabled: {
                            content: string;
                            header: string;
                            subHeader: string;
                        };
                        disabled: {
                            content: string;
                            header: string;
                            subHeader: string;
                        };
                    };
                };
                placeHolders: {
                    emptyCertificateList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    emptyIDPList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptyIDPSearchResults: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    emptyAuthenticatorList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptyConnectionTypeList: {
                        subtitles: {
                            0: string;
                            1: string;
                        };
                        title: string;
                    };
                    emptyConnectorList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    noAttributes: {
                        title: string;
                        subtitles: {
                            0: string;
                        };
                    };
                };
                wizards: {
                    addAuthenticator: {
                        header: string;
                        steps: {
                            authenticatorSelection: {
                                title: string;
                                quickSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                                manualSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            authenticatorSettings: {
                                emptyPlaceholder: {
                                    subtitles: [string, string];
                                    title: string;
                                };
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addIDP: {
                        header: string;
                        steps: {
                            generalSettings: {
                                title: string;
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            provisioningConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addProvisioningConnector: {
                        header: string;
                        steps: {
                            connectorSelection: {
                                title: string;
                                defaultSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            connectorConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    buttons: {
                        next: string;
                        finish: string;
                        previous: string;
                    };
                };
            };
            suborganizations: {
                notifications: {
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: string;
                            title: string;
                            subtitles: string;
                        };
                        heading: string;
                    };
                    subOrgLevelsLimitReachedError: {
                        emptyPlaceholder: {
                            action: string;
                            title: string;
                            subtitles: string;
                        };
                        heading: string;
                    };
                    duplicateOrgError: {
                        message: string;
                        description: string;
                    };
                };
            };
            footer: {
                copyright: string;
            };
            header: {
                links: {
                    adminPortalNav: string;
                    userPortalNav: string;
                };
            };
            helpPanel: {
                actions: {
                    close: string;
                    open: string;
                    pin: string;
                    unPin: string;
                };
                notifications: {
                    pin: {
                        success: {
                            message: string;
                            description: string;
                        };
                    };
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
                    placeholder: string;
                };
                buttons: {
                    addIDP: string;
                    addAuthenticator: string;
                    addConnector: string;
                    addAttribute: string;
                    addCertificate: string;
                };
                confirmations: {
                    deleteIDP: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    deleteIDPWithConnectedApps: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    deleteAuthenticator: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    deleteConnector: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                connectedApps: {
                    action: string;
                    header: string;
                    subHeader: string;
                    placeholders: {
                        search: string;
                        emptyList: string;
                    };
                    applicationEdit: {
                        back: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
                dangerZoneGroup: {
                    header: string;
                    disableIDP: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                        subheader2: string;
                    };
                    deleteIDP: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
                };
                forms: {
                    advancedConfigs: {
                        federationHub: {
                            hint: string;
                            label: string;
                        };
                        homeRealmIdentifier: {
                            hint: string;
                            label: string;
                        };
                        alias: {
                            hint: string;
                            label: string;
                        };
                        certificateType: {
                            label: string;
                            hint: string;
                            certificatePEM: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            certificateJWKS: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                    invalid: string;
                                };
                            };
                        };
                        implicitAssociation: {
                            enable: {
                                label: string;
                                hint: string;
                            };
                            primaryAttribute: {
                                label: string;
                                hint: string;
                            };
                            secondaryAttribute: {
                                label: string;
                                hint: string;
                            };
                            warning: string;
                        };
                    };
                    attributeSettings: {
                        attributeMapping: {
                            attributeColumnHeader: string;
                            attributeMapColumnHeader: string;
                            attributeMapInputPlaceholderPrefix: string;
                            componentHeading: string;
                            hint: string;
                            placeHolder: {
                                title: string;
                                subtitle: string;
                                action: string;
                            };
                            attributeMapTable: {
                                mappedAttributeColumnHeader: string;
                                externalAttributeColumnHeader: string;
                            };
                            heading: string;
                            subheading: string;
                            search: {
                                placeHolder: string;
                            };
                            attributeDropdown: {
                                label: string;
                                placeHolder: string;
                                noResultsMessage: string;
                            };
                            externalAttributeInput: {
                                label: string;
                                placeHolder: string;
                                existingErrorMessage: string;
                            };
                            addAttributeButtonLabel: string;
                            modal: {
                                header: string;
                                placeholder: {
                                    title: string;
                                    subtitle: string;
                                };
                            };
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
                        default: {
                            0: string;
                            1: string;
                        };
                        enable: {
                            0: string;
                            1: string;
                        };
                    };
                    common: {
                        requiredErrorMessage: string;
                        invalidURLErrorMessage: string;
                        invalidQueryParamErrorMessage: string;
                        customProperties: string;
                        internetResolvableErrorMessage: string;
                    };
                    generalDetails: {
                        name: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                duplicate: string;
                                maxLengthReached: string;
                            };
                        };
                        description: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        image: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                    };
                    jitProvisioning: {
                        enableJITProvisioning: {
                            disabledMessageContent:
                                | string
                                | {
                                      1: string;
                                      2: string;
                                  };
                            hint: string;
                            label: string;
                            disabledMessageHeader: string;
                        };
                        provisioningUserStoreDomain: {
                            hint: string;
                            label: string;
                        };
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
                    outboundProvisioningTitle: string;
                };
                helpPanel: {
                    tabs: {
                        samples: {
                            content: {
                                docs: {
                                    goBack: string;
                                    hint: string;
                                    title: string;
                                };
                            };
                            heading: string;
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
                list: {
                    actions: string;
                    name: string;
                };
                modals: {
                    addAuthenticator: {
                        title: string;
                        subTitle: string;
                    };
                    addCertificate: {
                        title: string;
                        subTitle: string;
                    };
                    addProvisioningConnector: {
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
                    addFederatedAuthenticator: {
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
                    addIDP: {
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
                    apiLimitReachedError: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    changeCertType: {
                        pem: {
                            description: string;
                            message: string;
                        };
                        jwks: {
                            description: string;
                            message: string;
                        };
                    };
                    deleteCertificate: {
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
                    deleteIDP: {
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
                    disableAuthenticator: {
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
                    disableOutboundProvisioningConnector: {
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
                    duplicateCertificateUpload: {
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
                    getIDP: {
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
                    getIDPList: {
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
                    getIDPTemplate: {
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
                    getIDPTemplateList: {
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
                    getFederatedAuthenticator: {
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
                    getFederatedAuthenticatorsList: {
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
                    getFederatedAuthenticatorMetadata: {
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
                    getOutboundProvisioningConnector: {
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
                    getOutboundProvisioningConnectorsList: {
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
                    getOutboundProvisioningConnectorMetadata: {
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
                    getAllLocalClaims: {
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
                    getRolesList: {
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
                    submitAttributeSettings: {
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
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: string;
                            title: string;
                            subtitles: string;
                        };
                        heading: string;
                    };
                    deleteDefaultAuthenticator: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                        success: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                    };
                    deleteDefaultConnector: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                        success: {
                            message: string;
                            description: string;
                            genericMessage: string;
                        };
                    };
                    updateClaimsConfigs: {
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
                    updateFederatedAuthenticator: {
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
                    updateFederatedAuthenticators: {
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
                    updateIDP: {
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
                    updateIDPCertificate: {
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
                    updateIDPRoleMappings: {
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
                    updateJITProvisioning: {
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
                    updateOutboundProvisioningConnectors: {
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
                    updateOutboundProvisioningConnector: {
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
                placeHolders: {
                    emptyCertificateList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    emptyIDPList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptyIDPSearchResults: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    emptyAuthenticatorList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptyConnectorList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    noAttributes: {
                        title: string;
                        subtitles: {
                            0: string;
                        };
                    };
                };
                wizards: {
                    addAuthenticator: {
                        header: string;
                        steps: {
                            authenticatorSelection: {
                                title: string;
                                quickSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                                manualSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addIDP: {
                        header: string;
                        steps: {
                            generalSettings: {
                                title: string;
                            };
                            authenticatorConfiguration: {
                                title: string;
                            };
                            provisioningConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    addProvisioningConnector: {
                        header: string;
                        steps: {
                            connectorSelection: {
                                title: string;
                                defaultSetup: {
                                    title: string;
                                    subTitle: string;
                                };
                            };
                            connectorConfiguration: {
                                title: string;
                            };
                            summary: {
                                title: string;
                            };
                        };
                    };
                    buttons: {
                        next: string;
                        finish: string;
                        previous: string;
                    };
                };
            };
            idvp: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterValue: {
                                placeholder: string;
                            };
                        };
                    };
                    placeholder: string;
                };
                buttons: {
                    addIDVP: string;
                };
                placeholders: {
                    emptyIDVPList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptyIDVPTypeList: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                };
                confirmations: {
                    deleteIDVP: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                notifications: {
                    getIDVPList: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    deleteIDVP: {
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
                    updateIDVP: {
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
                    addIDVP: {
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
                    submitAttributeSettings: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    getAllLocalClaims: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    getIDVP: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    getUIMetadata: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    getIDVPTemplateTypes: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    getIDVPTemplateType: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    getIDVPTemplate: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                };
                forms: {
                    attributeSettings: {
                        attributeMapping: {
                            heading: string;
                            hint: string;
                            addButton: string;
                            emptyPlaceholderEdit: {
                                title: string;
                                subtitle: string;
                            };
                            emptyPlaceholderCreate: {
                                title: string;
                                subtitle: string;
                            };
                        };
                        attributeMappingListItem: {
                            validation: {
                                duplicate: string;
                                required: string;
                                invalid: string;
                            };
                            placeholders: {
                                mappedValue: string;
                                localClaim: string;
                            };
                            labels: {
                                mappedValue: string;
                                localClaim: string;
                            };
                        };
                        attributeSelectionModal: {
                            header: string;
                        };
                    };
                    generalDetails: {
                        name: {
                            hint: string;
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                duplicate: string;
                                invalid: string;
                                required: string;
                                maxLengthReached: string;
                            };
                        };
                        description: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                dangerZoneGroup: {
                    header: string;
                    disableIDVP: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                        subheader2: string;
                    };
                    deleteIDVP: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
                };
                list: {
                    actions: string;
                    name: string;
                };
            };
            overview: {
                banner: {
                    heading: string;
                    subHeading: string;
                    welcome: string;
                };
                quickLinks: {
                    cards: {
                        applications: {
                            heading: string;
                            subHeading: string;
                        };
                        idps: {
                            heading: string;
                            subHeading: string;
                        };
                        authenticationProviders: {
                            heading: string;
                            subHeading: string;
                        };
                        remoteFetch: {
                            heading: string;
                            subHeading: string;
                        };
                    };
                };
            };
            sidePanel: {
                applicationEdit: string;
                applicationTemplates: string;
                applications: string;
                categories: {
                    application: string;
                    gettingStarted: string;
                    identityProviders: string;
                    authenticationProviders: string;
                    general: string;
                    identityVerificationProviders: string;
                };
                customize: string;
                identityProviderEdit: string;
                identityProviderTemplates: string;
                identityProviders: string;
                authenticationProviderEdit: string;
                authenticationProviderTemplates: string;
                authenticationProviders: string;
                oidcScopes: string;
                oidcScopesEdit: string;
                overview: string;
                remoteRepo: string;
                remoteRepoEdit: string;
            };
            templates: {
                emptyPlaceholder: {
                    action: string;
                    title: string;
                    subtitles: string;
                };
            };
            secrets: {
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
                page: {
                    title: string;
                    description: string;
                    primaryActionButtonText: string;
                    subFeatureBackButton: string;
                };
                errors: {
                    generic: {
                        message: string;
                        description: string;
                    };
                };
                routes: {
                    name: string;
                    category: string;
                    sidePanelChildrenNames: string[];
                };
                alerts: {
                    createdSecret: {
                        description: string;
                        message: string;
                    };
                    updatedSecret: {
                        description: string;
                        message: string;
                    };
                    deleteSecret: {
                        description: string;
                        message: string;
                    };
                };
                modals: {
                    deleteSecret: {
                        assertionHint: string;
                        primaryActionButtonText: string;
                        secondaryActionButtonText: string;
                        title: string;
                        content: string;
                        warningMessage: string;
                    };
                };
                wizards: {
                    addSecret: {
                        heading: string;
                        subheading: string;
                        form: {
                            secretTypeField: Record<string, string>;
                            secretNameField: Record<string, string>;
                            secretValueField: Record<string, string>;
                            secretDescriptionField: Record<string, string>;
                        };
                    };
                    actions: {
                        createButton: {
                            label: string;
                            ariaLabel: string;
                        };
                        cancelButton: {
                            label: string;
                            ariaLabel: string;
                        };
                    };
                };
                banners: {
                    secretIsHidden: {
                        title: string;
                        content: string;
                    };
                    adaptiveAuthSecretType: {
                        title: string;
                        content: string;
                    };
                };
                forms: {
                    editSecret: {
                        page: {
                            description: string;
                        };
                        secretValueField: Record<string, string>;
                        secretDescriptionField: Record<string, string>;
                    };
                    actions: {
                        submitButton: {
                            label: string;
                            ariaLabel: string;
                        };
                    };
                };
                emptyPlaceholders: {
                    resourceNotFound: {
                        messages: string[];
                    };
                    emptyListOfSecrets: {
                        messages: string[];
                    };
                    buttons: {
                        backToSecrets: {
                            label: string;
                            ariaLabel: string;
                        };
                        addSecret: {
                            label: string;
                            ariaLabel: string;
                        };
                    };
                };
            };
        };
        notifications: {
            endSession: {
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
            getProfileSchema: {
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
        pages: {
            applicationTemplate: {
                backButton: string;
                title: string;
                subTitle: string;
            };
            applications: {
                title: string;
                subTitle: string;
                alternateSubTitle: string;
            };
            applicationsEdit: {
                backButton: string;
                title: string;
                subTitle: string;
            };
            authenticationProvider: {
                title: string;
                subTitle: string;
            };
            authenticationProviderTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
                disabledHint: {
                    apple: string;
                };
                search: {
                    placeholder: string;
                };
                supportServices: {
                    authenticationDisplayName: string;
                    provisioningDisplayName: string;
                };
            };
            idp: {
                title: string;
                subTitle: string;
            };
            idpTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
                supportServices: {
                    authenticationDisplayName: string;
                    provisioningDisplayName: string;
                };
            };
            idvp: {
                title: string;
                subTitle: string;
            };
            idvpTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
                search: {
                    placeholder: string;
                };
            };
            overview: {
                title: string;
                subTitle: string;
            };
        };
        componentExtensions: {
            component: {
                application: {
                    quickStart: {
                        title: string;
                    };
                };
            };
        };
        placeholders: {
            emptySearchResult: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            underConstruction: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
        };
        technologies: {
            android: string;
            angular: string;
            ios: string;
            java: string;
            python: string;
            react: string;
            windows: string;
        };
    };
    loginFlow: {
        adaptiveLoginFlowSelectConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        basicLoginFlowSelectConfirmationModal: {
            content: string;
            heading: string;
            message: string;
        };
        options: {
            controls: {
                remove: string;
            };
            displayName: string;
            divider: string;
        };
        modes: {
            legacy: {
                label: string;
            };
            visual: {
                label: string;
            };
            switchConfirmationModal: {
                assertionHint: string;
                content: string;
                primaryActionButtonText: string;
                secondaryActionButtonText: string;
                title: string;
                warningMessage: string;
            };
        };
        nodes: {
            controls: {
                attributeSelector: {
                    label: string;
                };
                enableBackupCodes: {
                    label: string;
                };
                userAttributeSelector: {
                    label: string;
                };
            };
            emailOTP: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                        secondary: string;
                    };
                    fields: {
                        code: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            identifierFirst: {
                controls: {
                    optionRemoveTooltipContent: string;
                    optionSwitchTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                    };
                    fields: {
                        rememberMe: {
                            label: string;
                        };
                        username: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            signIn: {
                controls: {
                    optionRemoveTooltipContent: string;
                    optionSwitchTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                    };
                    fields: {
                        password: {
                            label: string;
                            placeholder: string;
                        };
                        rememberMe: {
                            label: string;
                        };
                        username: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            smsOTP: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                        secondary: string;
                    };
                    fields: {
                        code: {
                            label: string;
                            placeholder: string;
                        };
                    };
                };
                header: string;
            };
            totp: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    actions: {
                        primary: string;
                    };
                    fields: {
                        code: {
                            label: string;
                            placeholder: string;
                        };
                    };
                    help: string;
                };
                header: string;
            };
            activeSessionsLimit: {
                controls: {
                    optionRemoveTooltipContent: string;
                };
                form: {
                    sessions: {
                        browserLabel: string;
                        lastAccessedLabel: string;
                    };
                    help: string;
                };
                header: string;
            };
        };
        revertConfirmationModal: {
            assertionHint: string;
            content: string;
            primaryActionButtonText: string;
            secondaryActionButtonText: string;
            title: string;
            warningMessage: string;
        };
        steps: {
            controls: {
                addOption: string;
                remove: string;
                signUp: {
                    hint: string;
                    label: string;
                };
            };
        };
        predefinedFlows: {
            adaptive: {
                actions: {
                    add: string;
                };
                header: string;
            };
            authenticators: {
                apple: {
                    displayName: string;
                };
                facebook: {
                    displayName: string;
                };
                github: {
                    displayName: string;
                };
                google: {
                    displayName: string;
                };
                microsoft: {
                    displayName: string;
                };
            };
            basic: {
                header: string;
            };
            categories: {
                basic: {
                    label: string;
                };
                mfa: {
                    label: string;
                };
                passwordless: {
                    label: string;
                };
                social: {
                    label: string;
                };
            };
            header: string;
            panelHeader: string;
        };
        scriptEditor: {
            panelHeader: string;
            secretSelector: {
                actions: {
                    create: {
                        label: string;
                    };
                };
                emptyPlaceholder: {
                    header: string;
                    description: string;
                };
                label: string;
            };
            themes: {
                dark: {
                    label: string;
                };
                highContrast: {
                    label: string;
                };
                light: {
                    label: string;
                };
            };
        };
        visualEditor: {
            actions: {
                revert: {
                    label: string;
                };
                update: {
                    label: string;
                };
            };
        };
    };
    manage: {
        features: {
            businessGroups: {
                fields: {
                    groupName: {
                        label: string;
                        placeholder: string;
                        validations: {
                            empty: string;
                            duplicate: string;
                            invalid: string;
                        };
                    };
                };
            };
            organizationDiscovery: {
                advancedSearch: {
                    form: {
                        dropdown: {
                            filterAttributeOptions: {
                                organizationName: string;
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
                assign: {
                    title: string;
                    description: string;
                    form: {
                        fields: {
                            emailDomains: {
                                label: string;
                                placeholder: string;
                                hint: string;
                                validations: {
                                    invalid: {
                                        0: string;
                                        1: string;
                                    };
                                };
                            };
                            organizationName: {
                                label: string;
                                placeholder: string;
                                emptyPlaceholder: {
                                    0: string;
                                    1: string;
                                };
                                hint: string;
                            };
                        };
                    };
                    buttons: {
                        assign: string;
                    };
                };
                emailDomains: {
                    actions: {
                        assign: string;
                        enable: string;
                    };
                };
                edit: {
                    back: string;
                    description: string;
                    form: {
                        fields: {
                            emailDomains: {
                                label: string;
                                placeholder: string;
                                hint: string;
                                validations: {
                                    invalid: {
                                        0: string;
                                        1: string;
                                    };
                                };
                            };
                            organizationName: {
                                label: string;
                                hint: string;
                            };
                        };
                        message: string;
                    };
                };
                message: string;
                notifications: {
                    addEmailDomains: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    checkEmailDomain: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    disableEmailDomainDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                    enableEmailDomainDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                    fetchOrganizationDiscoveryAttributes: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    getEmailDomainDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    getOrganizationListWithDiscovery: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    updateOrganizationDiscoveryAttributes: {
                        error: {
                            description: string;
                            message: string;
                        };
                        success: {
                            description: string;
                            message: string;
                        };
                    };
                };
                placeholders: {
                    emptyList: {
                        action: string;
                        title: string;
                        subtitles: string;
                    };
                };
                title: string;
            };
            organizations: {
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
                list: {
                    actions: {
                        add: string;
                    };
                    columns: {
                        name: string;
                        actions: string;
                    };
                };
                title: string;
                notifications: {
                    fetchOrganization: {
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
                    deleteOrganization: {
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
                    deleteOrganizationWithSubOrganizationError: string;
                    disableOrganization: {
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
                    disableOrganizationWithSubOrganizationError: string;
                    enableOrganization: {
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
                    updateOrganization: {
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
                    updateOrganizationAttributes: {
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
                    addOrganization: {
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
                    getOrganizationList: {
                        error: {
                            message: string;
                            description: string;
                        };
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                };
                confirmations: {
                    deleteOrganization: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                placeholders: {
                    emptyList: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                    };
                };
                edit: {
                    description: string;
                    back: string;
                    tabTitles: {
                        overview: string;
                        attributes: string;
                    };
                    fields: {
                        id: {
                            label: string;
                            ariaLabel: string;
                        };
                        name: {
                            label: string;
                            placeholder: string;
                            ariaLabel: string;
                        };
                        description: {
                            label: string;
                            placeholder: string;
                            ariaLabel: string;
                        };
                        domain: {
                            label: string;
                            ariaLabel: string;
                        };
                        type: {
                            label: string;
                            ariaLabel: string;
                        };
                        created: {
                            label: string;
                            ariaLabel: string;
                        };
                        lastModified: {
                            label: string;
                            ariaLabel: string;
                        };
                    };
                    dangerZone: {
                        title: string;
                        subHeader: string;
                        disableOrganization: {
                            enableActionTitle: string;
                            disableActionTitle: string;
                            subheader: string;
                        };
                    };
                    attributes: {
                        hint: string;
                        key: string;
                        value: string;
                        keyRequiredErrorMessage: string;
                        valueRequiredErrorMessage: string;
                    };
                };
                modals: {
                    addOrganization: {
                        header: string;
                        subtitle1: string;
                        subtitle2: string;
                    };
                };
                forms: {
                    addOrganization: {
                        name: {
                            validation: {
                                duplicate: string;
                                empty: string;
                            };
                            label: string;
                            placeholder: string;
                        };
                        description: {
                            label: string;
                            placeholder: string;
                        };
                        domainName: {
                            validation: {
                                duplicate: string;
                                empty: string;
                            };
                            label: string;
                            placeholder: string;
                        };
                        type: string;
                        structural: string;
                        tenant: string;
                    };
                };
                homeList: {
                    name: string;
                    description: string;
                };
                shareApplicationSubTitle: string;
                shareApplicationRadio: string;
                shareApplicationInfo: string;
                unshareApplicationRadio: string;
                shareWithSelectedOrgsRadio: string;
                unshareApplicationInfo: string;
                switching: {
                    search: {
                        placeholder: string;
                    };
                    emptyList: string;
                    subOrganizations: string;
                    goBack: string;
                    switchLabel: string;
                    switchButton: string;
                    notifications: {
                        switchOrganization: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                    };
                };
                view: {
                    description: string;
                };
            };
            users: {
                addUserType: {
                    createUser: {
                        title: string;
                        description: string;
                    };
                    inviteParentUser: {
                        title: string;
                        description: string;
                    };
                };
                consumerUsers: {
                    fields: {
                        username: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                                invalidCharacters: string;
                                regExViolation: string;
                            };
                        };
                    };
                };
                guestUsers: {
                    fields: {
                        username: {
                            label: string;
                            placeholder: string;
                            validations: {
                                empty: string;
                                invalid: string;
                                invalidCharacters: string;
                                regExViolation: string;
                            };
                        };
                    };
                };
                confirmations: {
                    terminateAllSessions: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    terminateSession: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    addMultipleUser: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                editUser: {
                    tab: {
                        menuItems: {
                            0: string;
                            1: string;
                            2: string;
                            3: string;
                        };
                    };
                    placeholders: {
                        undefinedUser: {
                            action: string;
                            title: string;
                            subtitles: string;
                        };
                    };
                };
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: string;
                                terminateSession: string;
                            };
                            labels: {
                                browser: string;
                                deviceModel: string;
                                ip: string;
                                lastAccessed: string;
                                loggedInAs: string;
                                loginTime: string;
                                os: string;
                                recentActivity: string;
                                activeApplication: string;
                            };
                        };
                    };
                    dangerZones: {
                        terminate: {
                            actionTitle: string;
                            header: string;
                            subheader: string;
                        };
                    };
                    notifications: {
                        getUserSessions: {
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
                        terminateAllUserSessions: {
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
                        terminateUserSession: {
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
                        getAdminUser: {
                            error: {
                                message: string;
                                description: string;
                            };
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                    };
                    placeholders: {
                        emptyListPlaceholder: {
                            title: string;
                            subtitles: string;
                        };
                    };
                };
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
                addUserDropDown: {
                    addNewUser: string;
                    bulkImport: string;
                };
                forms: {
                    validation: {
                        formatError: string;
                        dateFormatError: string;
                        mobileFormatError: string;
                        futureDateError: string;
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                };
                notifications: {
                    addUser: {
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
                    addUserPendingApproval: {
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
                    bulkImportUser: {
                        validation: {
                            emptyRowError: {
                                message: string;
                                description: string;
                            };
                            columnMismatchError: {
                                message: string;
                                description: string;
                            };
                            emptyHeaderError: {
                                message: string;
                                description: string;
                            };
                            missingRequiredHeaderError: {
                                message: string;
                                description: string;
                            };
                            blockedHeaderError: {
                                message: string;
                                description: string;
                            };
                            duplicateHeaderError: {
                                message: string;
                                description: string;
                            };
                            invalidHeaderError: {
                                message: string;
                                description: string;
                            };
                            emptyDataField: {
                                message: string;
                                description: string;
                            };
                            invalidRole: {
                                message: string;
                                description: string;
                            };
                            invalidGroup: {
                                message: string;
                                description: string;
                            };
                        };
                        submit: {
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
                        timeOut: {
                            message: string;
                            description: string;
                        };
                    };
                    deleteUser: {
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
                    fetchUsers: {
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
                    getAdminRole: {
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
                    revokeAdmin: {
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
                placeholders: {
                    emptyList: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    userstoreError: {
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                };
                usersList: {
                    list: {
                        emptyResultPlaceholder: {
                            addButton: string;
                            emptyUsers: string;
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
            approvals: {
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                };
                modals: {
                    approvalProperties: {
                        Claims: string;
                        "REQUEST ID": string;
                        Roles: string;
                        "User Store Domain": string;
                        Username: string;
                    };
                    taskDetails: {
                        header: string;
                        description: string;
                    };
                };
                notifications: {
                    fetchApprovalDetails: {
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
                    fetchPendingApprovals: {
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
                    updatePendingApprovals: {
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
                placeholders: {
                    emptyApprovalList: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptyApprovalFilter: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                    emptySearchResults: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
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
                        addCertificate: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        getCertificates: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        getAlias: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        getPublicCertificate: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        getCertificate: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        deleteCertificate: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        download: {
                            success: {
                                message: string;
                                description: string;
                            };
                        };
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
                        alias: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                        };
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
                attributeMappings: {
                    axschema: {
                        heading: string;
                        description: string;
                    };
                    eidas: {
                        heading: string;
                        description: string;
                    };
                    oidc: {
                        heading: string;
                        description: string;
                    };
                    scim: {
                        heading: string;
                        description: string;
                    };
                    custom: {
                        heading: string;
                        description: string;
                    };
                };
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
                        fetchDialects: {
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
                        fetchADialect: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        fetchExternalClaims: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        deleteDialect: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        addDialect: {
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
                        updateDialect: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        fetchSCIMResource: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                    };
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
                    dangerZone: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
                    sections: {
                        manageAttributes: {
                            heading: string;
                            description: string;
                            attributes: {
                                heading: string;
                                description: string;
                            };
                        };
                        manageAttributeMappings: {
                            heading: string;
                            description: string;
                            oidc: {
                                heading: string;
                                description: string;
                            };
                            scim: {
                                heading: string;
                                description: string;
                            };
                            custom: {
                                heading: string;
                                description: string;
                            };
                        };
                    };
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
                        fields: {
                            attributeName: {
                                validation: {
                                    invalid: string;
                                    alreadyExists: string;
                                };
                            };
                        };
                        dialectURI: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                        };
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
                        addExternalAttribute: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        fetchExternalClaims: {
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
                        getExternalAttribute: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        updateExternalAttribute: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        deleteExternalClaim: {
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
                    forms: {
                        attributeURI: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                            validationErrorMessages: {
                                duplicateName: string;
                                invalidName: string;
                                scimInvalidName: string;
                            };
                        };
                        localAttribute: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                        };
                        submit: string;
                        warningMessage: string;
                        emptyMessage: string;
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
                        fetchLocalClaims: {
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
                        getAClaim: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        getClaims: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        getLocalDialect: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                        };
                        addLocalClaim: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        updateClaim: {
                            genericError: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                        };
                        deleteClaim: {
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
                        attributeID: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                        };
                        attributeHint: string;
                        name: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                            validationErrorMessages: {
                                invalidName: string;
                            };
                        };
                        nameHint: string;
                        description: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                        };
                        descriptionHint: string;
                        regEx: {
                            label: string;
                            placeholder: string;
                        };
                        regExHint: string;
                        supportedByDefault: {
                            label: string;
                        };
                        displayOrder: {
                            label: string;
                            placeholder: string;
                        };
                        displayOrderHint: string;
                        required: {
                            label: string;
                        };
                        requiredHint: string;
                        requiredWarning: string;
                        readOnly: {
                            label: string;
                        };
                        readOnlyHint: string;
                        attribute: {
                            placeholder: string;
                            requiredErrorMessage: string;
                        };
                        infoMessages: {
                            disabledConfigInfo: string;
                            configApplicabilityInfo: string;
                        };
                    };
                    dangerZone: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
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
                scopeMappings: {
                    deletionConfirmationModal: {
                        assertionHint: string;
                        content: string;
                        header: string;
                        message: string;
                    };
                    saveChangesButton: string;
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
                            bodyEditor: {
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            locale: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            signatureEditor: {
                                label: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            subject: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                    };
                };
            };
            emailTemplateTypes: {
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
                buttons: {
                    createTemplateType: string;
                    deleteTemplate: string;
                    editTemplate: string;
                    newType: string;
                };
                confirmations: {
                    deleteTemplateType: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                forms: {
                    addTemplateType: {
                        fields: {
                            type: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                        };
                    };
                };
                list: {
                    actions: string;
                    name: string;
                };
                notifications: {
                    deleteTemplateType: {
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
                    getTemplateTypes: {
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
                    updateTemplateType: {
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
                    createTemplateType: {
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
                placeholders: {
                    emptySearch: {
                        action: string;
                        title: string;
                        subtitles: string;
                    };
                    emptyList: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
                };
                wizards: {
                    addTemplateType: {
                        heading: string;
                        subHeading: string;
                        steps: {
                            templateType: {
                                heading: string;
                            };
                        };
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
                    deleteTemplate: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
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
                    deleteTemplate: {
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
                    createTemplate: {
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
                    getTemplateDetails: {
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
                    getTemplates: {
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
                    iframeUnsupported: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    updateTemplate: {
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
                placeholders: {
                    emptyList: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                    };
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
                    roles: {
                        addRolesModal: {
                            heading: string;
                            subHeading: string;
                        };
                        heading: string;
                        subHeading: string;
                        placeHolders: {
                            emptyListPlaceholder: {
                                title: string;
                                subtitles: string;
                            };
                        };
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        lastModified: string;
                        name: string;
                        source: string;
                    };
                    storeOptions: string;
                };
                notifications: {
                    deleteGroup: {
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
                    updateGroup: {
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
                    createGroup: {
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
                    createPermission: {
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
                    fetchGroups: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                };
                placeholders: {
                    groupsError: {
                        title: string;
                        subtitles: string[];
                    };
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
                    getConnectorCategories: {
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
                    getConnector: {
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
                    updateConnector: {
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
                form: {
                    errors: {
                        positiveIntegers: string;
                        format: string;
                    };
                };
                goBackLoginAndRegistration: string;
                enabled: string;
                disabled: string;
                categories: string;
                pageSubHeading: string;
                connectorSubHeading: string;
                genericDescription: string;
                connectorCategories: {
                    passwordPolicies: {
                        name: string;
                        description: string;
                        connectors: {
                            passwordExpiry: {
                                friendlyName: string;
                            };
                            passwordHistory: {
                                friendlyName: string;
                                properties: {
                                    passwordHistoryEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordHistoryCount: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            passwordPolicy: {
                                friendlyName: string;
                                properties: {
                                    passwordPolicyEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyMinLength: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyMaxLength: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyPattern: {
                                        hint: string;
                                        label: string;
                                    };
                                    passwordPolicyErrorMsg: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    userOnboarding: {
                        name: string;
                        description: string;
                        connectors: {
                            askPassword: {
                                friendlyName: string;
                            };
                            selfSignUp: {
                                friendlyName: string;
                                properties: {
                                    selfRegistrationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationLockOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationSendConfirmationOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationReCaptcha: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationSmsotpRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationCallbackRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    urlListPurposeSelfSignUp: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationNotifyAccountConfirmation: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationResendConfirmationReCaptcha: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationAutoLoginEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    selfRegistrationAutoLoginAliasName: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            liteUserSignUp: {
                                friendlyName: string;
                                properties: {
                                    liteRegistrationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationLockOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationReCaptcha: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationSmsotpRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    liteRegistrationCallbackRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    urlListPurposeLiteUserSignUp: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            userEmailVerification: {
                                friendlyName: string;
                                properties: {
                                    emailVerificationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationLockOnCreation: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationAskPasswordExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    emailVerificationAskPasswordPasswordGenerator: {
                                        hint: string;
                                        label: string;
                                    };
                                    urlListPurposeJitProvisioning: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    loginAttemptsSecurity: {
                        name: string;
                        description: string;
                        connectors: {
                            accountLockHandler: {
                                friendlyName: string;
                                properties: {
                                    accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerOnFailureMaxAttempts: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerLoginFailTimeoutRatio: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerNotificationManageInternally: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountLockHandlerNotificationNotifyOnLockIncrement: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            ssoLoginRecaptcha: {
                                friendlyName: string;
                                properties: {
                                    ssoLoginRecaptchaEnableAlways: {
                                        hint: string;
                                        label: string;
                                    };
                                    ssoLoginRecaptchaEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    ssoLoginRecaptchaOnMaxFailedAttempts: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    accountManagement: {
                        name: string;
                        description: string;
                        connectors: {
                            suspensionNotification: {
                                friendlyName: string;
                                properties: {
                                    suspensionNotificationEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    suspensionNotificationAccountDisableDelay: {
                                        hint: string;
                                        label: string;
                                    };
                                    suspensionNotificationDelays: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            accountDisableHandler: {
                                friendlyName: string;
                                properties: {
                                    accountDisableHandlerEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountDisableHandlerNotificationManageInternally: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            multiattributeLoginHandler: {
                                friendlyName: string;
                                properties: {
                                    accountMultiattributeloginHandlerEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    accountMultiattributeloginHandlerAllowedattributes: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            accountRecovery: {
                                friendlyName: string;
                                properties: {
                                    recoveryNotificationPasswordEnable: {
                                        label: string;
                                    };
                                    recoveryReCaptchaPasswordEnable: {
                                        label: string;
                                    };
                                    recoveryQuestionPasswordEnable: {
                                        label: string;
                                    };
                                    recoveryQuestionPasswordMinAnswers: {
                                        label: string;
                                    };
                                    recoveryQuestionAnswerRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionAnswerUniqueness: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionPasswordReCaptchaEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                                        label: string;
                                    };
                                    recoveryNotificationUsernameEnable: {
                                        label: string;
                                    };
                                    recoveryReCaptchaUsernameEnable: {
                                        label: string;
                                    };
                                    recoveryNotificationInternallyManage: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryNotifySuccess: {
                                        label: string;
                                    };
                                    recoveryQuestionPasswordNotifyStart: {
                                        label: string;
                                    };
                                    recoveryExpiryTime: {
                                        label: string;
                                    };
                                    recoveryNotificationPasswordExpiryTimeSmsOtp: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryNotificationPasswordSmsOtpRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionPasswordForcedEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryQuestionMinQuestionsToAnswer: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryCallbackRegex: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAutoLoginEnable: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            adminForcedPasswordReset: {
                                friendlyName: string;
                                properties: {
                                    recoveryAdminPasswordResetRecoveryLink: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAdminPasswordResetOtp: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAdminPasswordResetOffline: {
                                        hint: string;
                                        label: string;
                                    };
                                    recoveryAdminPasswordResetExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    otherSettings: {
                        name: string;
                        description: string;
                        connectors: {
                            piiController: {
                                friendlyName: string;
                                properties: {
                                    piiController: {
                                        hint: string;
                                        label: string;
                                    };
                                    contact: {
                                        hint: string;
                                        label: string;
                                    };
                                    email: {
                                        hint: string;
                                        label: string;
                                    };
                                    phone: {
                                        hint: string;
                                        label: string;
                                    };
                                    onBehalf: {
                                        hint: string;
                                        label: string;
                                    };
                                    piiControllerUrl: {
                                        hint: string;
                                        label: string;
                                    };
                                    addressCountry: {
                                        hint: string;
                                        label: string;
                                    };
                                    addressLocality: {
                                        hint: string;
                                        label: string;
                                    };
                                    addressRegion: {
                                        hint: string;
                                        label: string;
                                    };
                                    postOfficeBoxNumber: {
                                        hint: string;
                                        label: string;
                                    };
                                    postalCode: {
                                        hint: string;
                                        label: string;
                                    };
                                    streetAddress: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            analyticsEngine: {
                                friendlyName: string;
                                messages: {
                                    deprecation: {
                                        description: string;
                                        heading: string;
                                    };
                                };
                                properties: {
                                    adaptiveAuthenticationAnalyticsReceiver: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                                        hint: string;
                                        label: string;
                                    };
                                    secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationAnalyticsHostnameVerfier: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            elasticAnalyticsEngine: {
                                friendlyName: string;
                                warningModal: {
                                    configure: string;
                                    reassure: string;
                                };
                                properties: {
                                    adaptiveAuthenticationElasticReceiver: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticBasicAuthEnabled: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticBasicAuthUsername: {
                                        hint: string;
                                        label: string;
                                    };
                                    secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHttpConnectionTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHttpReadTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                                        hint: string;
                                        label: string;
                                    };
                                    adaptiveAuthenticationElasticHostnameVerfier: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                            userClaimUpdate: {
                                friendlyName: string;
                                properties: {
                                    userClaimUpdateEmailEnableVerification: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateEmailVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateEmailEnableNotification: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateMobileNumberEnableVerification: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                                        hint: string;
                                        label: string;
                                    };
                                    userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    multiFactorAuthenticators: {
                        name: string;
                        friendlyName: string;
                        description: string;
                        connectors: {
                            backupCodeAuthenticator: {
                                friendlyName: string;
                                properties: {
                                    backupCodeBackupCodeLength: {
                                        hint: string;
                                        label: string;
                                    };
                                    backupCodeBackupCodeSize: {
                                        hint: string;
                                        label: string;
                                    };
                                };
                            };
                        };
                    };
                    sessionManagement: {
                        description: string;
                    };
                    saml2WebSsoConfiguration: {
                        description: string;
                    };
                    wsFederationConfiguration: {
                        description: string;
                    };
                };
            };
            helpPanel: {
                notifications: {
                    pin: {
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                };
            };
            oidcScopes: {
                back: string;
                viewAttributes: string;
                manageAttributes: string;
                buttons: {
                    addScope: string;
                };
                confirmationModals: {
                    deleteScope: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    deleteClaim: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                addAttributes: {
                    description: string;
                };
                editScope: {
                    claimList: {
                        emptyPlaceholder: {
                            action: string;
                            title: string;
                            subtitles: {
                                0: string;
                                1: string;
                            };
                        };
                        emptySearch: {
                            action: string;
                            title: string;
                            subtitles: {
                                0: string;
                                1: string;
                            };
                        };
                        title: string;
                        subTitle: string;
                        addClaim: string;
                        popupDelete: string;
                        searchClaims: string;
                    };
                };
                forms: {
                    addScopeForm: {
                        inputs: {
                            displayName: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            scopeName: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    duplicate: string;
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            description: {
                                label: string;
                                placeholder: string;
                            };
                        };
                    };
                };
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                    empty: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
                    searchPlaceholder: string;
                };
                wizards: {
                    addScopeWizard: {
                        title: string;
                        subTitle: string;
                        steps: {
                            basicDetails: string;
                            claims: string;
                        };
                        buttons: {
                            next: string;
                            previous: string;
                        };
                        claimList: {
                            searchPlaceholder: string;
                            table: {
                                header: string;
                                emptyPlaceholders: {
                                    assigned: string;
                                    unAssigned: string;
                                };
                            };
                        };
                    };
                };
                notifications: {
                    addOIDCScope: {
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
                    addOIDCClaim: {
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
                    fetchOIDCScopes: {
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
                    fetchOIDCScope: {
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
                    fetchOIDClaims: {
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
                    deleteOIDCScope: {
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
                    deleteOIDClaim: {
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
                    updateOIDCScope: {
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
                    claimsMandatory: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                };
                placeholders: {
                    emptyList: {
                        action: string;
                        subtitles: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        title: string;
                    };
                    emptySearch: {
                        action: string;
                        title: string;
                        subtitles: {
                            0: string;
                            1: string;
                        };
                    };
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
            remoteFetch: {
                components: {
                    status: {
                        details: string;
                        header: string;
                        hint: string;
                        linkPopup: {
                            content: string;
                            header: string;
                            subHeader: string;
                        };
                        refetch: string;
                    };
                };
                forms: {
                    getRemoteFetchForm: {
                        actions: {
                            remove: string;
                            save: string;
                        };
                        fields: {
                            accessToken: {
                                label: string;
                                placeholder: string;
                            };
                            enable: {
                                hint: string;
                                label: string;
                            };
                            connectivity: {
                                [key: string]: any;
                                label: string;
                            };
                            gitBranch: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            gitFolder: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            gitURL: {
                                label: string;
                                placeholder: string;
                                validations: {
                                    required: string;
                                };
                            };
                            pollingFrequency: {
                                label: string;
                            };
                            sharedKey: {
                                label: string;
                            };
                            username: {
                                label: string;
                                placeholder: string;
                            };
                        };
                        heading: {
                            subTitle: string;
                            title: string;
                        };
                    };
                };
                modal: {
                    appStatusModal: {
                        description: string;
                        heading: string;
                        primaryButton: string;
                        secondaryButton: string;
                    };
                };
                notifications: {
                    createRepoConfig: {
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
                    deleteRepoConfig: {
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
                    getConfigDeploymentDetails: {
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
                    getConfigList: {
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
                    getRemoteRepoConfig: {
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
                    triggerConfigDeployment: {
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
                pages: {
                    listing: {
                        title: string;
                        subTitle: string;
                    };
                };
                placeholders: {
                    emptyListPlaceholder: {
                        action: string;
                        title: string;
                        subtitles: string;
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
                            roleName: {
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    duplicate: string;
                                    duplicateInAudience: string;
                                    empty: string;
                                    invalid: string;
                                };
                            };
                            roleAudience: {
                                values: {
                                    organization: string;
                                    application: string;
                                };
                                hint: string;
                                label: string;
                            };
                            assignedApplication: {
                                applicationSubTitle: {
                                    application: string;
                                    organization: string;
                                    changeAudience: string;
                                };
                                note: string;
                                hint: string;
                                label: string;
                                placeholder: string;
                                validations: {
                                    empty: string;
                                };
                            };
                            notes: {
                                orgNote: string;
                                appNote: string;
                                cannotCreateRole: string;
                            };
                        };
                        rolePermission: {
                            apiResource: {
                                label: string;
                                placeholder: string;
                                hint: {
                                    empty: string;
                                };
                            };
                            permissions: {
                                label: string;
                                placeholder: string;
                                tooltips: {
                                    noScopes: string;
                                    selectAllScopes: string;
                                    removeAPIResource: string;
                                };
                                validation: {
                                    empty: string;
                                };
                                permissionsLabel: string;
                            };
                            notes: {
                                applicationRoles: string;
                            };
                            notifications: {
                                fetchAPIResourceError: {
                                    error: {
                                        message: string;
                                        description: string;
                                    };
                                };
                            };
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
                    back: string;
                    summary: {
                        labels: {
                            domain: {
                                role: string;
                                group: string;
                            };
                            permissions: string;
                            roleName: string;
                            roles: string;
                            users: string;
                            groups: string;
                        };
                    };
                    users: {
                        assignUserModal: {
                            heading: string;
                            hint: string;
                            subHeading: string;
                            list: {
                                searchPlaceholder: string;
                                searchByEmailPlaceholder: string;
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
                    placeholders: {
                        errorPlaceHolder: {
                            action: string;
                            title: string;
                            subtitles: {
                                0: string;
                                1: string;
                            };
                        };
                    };
                    basics: {
                        buttons: {
                            update: string;
                        };
                        confirmation: {
                            assertionHint: string;
                            header: string;
                            message: string;
                            content: string;
                        };
                        dangerZone: {
                            actionTitle: string;
                            header: string;
                            subheader: string;
                            buttonDisableHint: string;
                        };
                        fields: {
                            roleName: {
                                name: string;
                                required: string;
                                placeholder: string;
                            };
                        };
                    };
                    groups: {
                        addGroupsModal: {
                            heading: string;
                            subHeading: string;
                        };
                        placeholders: {
                            emptyPlaceholder: {
                                action: string;
                                title: string;
                                subtitles: {
                                    0: string;
                                };
                            };
                            errorPlaceholder: {
                                action: string;
                                title: string;
                                subtitles: {
                                    0: string;
                                    1: string;
                                };
                            };
                        };
                        notifications: {
                            error: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                            genericError: {
                                message: string;
                                description: string;
                            };
                            fetchError: {
                                message: string;
                                description: string;
                            };
                        };
                        heading: string;
                        localGroupsHeading: string;
                        externalGroupsHeading: string;
                        subHeading: string;
                        actions: {
                            search: {
                                placeholder: string;
                            };
                            assign: {
                                placeholder: string;
                            };
                            remove: {
                                label: string;
                                placeholder: string;
                            };
                        };
                    };
                    menuItems: {
                        basic: string;
                        connectedApps: string;
                        permissions: string;
                        groups: string;
                        users: string;
                        roles: string;
                    };
                    users: {
                        heading: string;
                        subHeading: string;
                        placeholders: {
                            emptyPlaceholder: {
                                action: string;
                                title: string;
                                subtitles: {
                                    0: string;
                                };
                            };
                            errorPlaceholder: {
                                action: string;
                                title: string;
                                subtitles: {
                                    0: string;
                                    1: string;
                                };
                            };
                        };
                        notifications: {
                            error: {
                                message: string;
                                description: string;
                            };
                            success: {
                                message: string;
                                description: string;
                            };
                            genericError: {
                                message: string;
                                description: string;
                            };
                            fetchError: {
                                message: string;
                                description: string;
                            };
                        };
                        list: {
                            emptyPlaceholder: {
                                action: string;
                                title: string;
                                subtitles: string;
                            };
                            user: string;
                            organization: string;
                        };
                        actions: {
                            search: {
                                placeholder: string;
                            };
                            assign: {
                                placeholder: string;
                            };
                            remove: {
                                label: string;
                                placeholder: string;
                            };
                        };
                    };
                    permissions: {
                        heading: string;
                        subHeading: string;
                        readOnlySubHeading: string;
                        removedPermissions: string;
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
                        managedByOrg: {
                            label: string;
                            header: string;
                        };
                        managedByApp: {
                            label: string;
                            header: string;
                        };
                        audience: string;
                    };
                    confirmations: {
                        deleteItem: {
                            assertionHint: string;
                            header: string;
                            message: string;
                            content: string;
                        };
                        deleteItemError: {
                            header: string;
                            message: string;
                            content: string;
                        };
                    };
                    emptyPlaceholders: {
                        search: {
                            action: string;
                            title: string;
                            subtitles: {
                                0: string;
                                1: string;
                            };
                        };
                        emptyRoleList: {
                            action: string;
                            title: string;
                            subtitles: {
                                0: string;
                                1: string;
                                2: string;
                            };
                        } & {
                            emptyRoles: string;
                        };
                    };
                    popups: {
                        delete: string;
                        edit: string;
                    };
                    filterOptions: {
                        all: string;
                        applicationRoles: string;
                        organizationRoles: string;
                    };
                    filterAttirbutes: {
                        name: string;
                        audience: string;
                    };
                };
                readOnlyList: {
                    emptyPlaceholders: {
                        searchAndFilter: {
                            title: string;
                            subtitles:
                                | string
                                | {
                                      0: string;
                                      1: string;
                                  };
                        };
                    };
                };
                notifications: {
                    deleteRole: {
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
                    fetchRoles: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    fetchRole: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    updateRole: {
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
                    createRole: {
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
                    createPermission: {
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
            serverConfigs: {
                server: {
                    title: string;
                    description: string;
                };
                adminAdvisory: {
                    configurationEditSection: {
                        backButtonLabel: string;
                        pageHeading: string;
                        pageSubheading: string;
                        form: {
                            bannerContent: {
                                label: string;
                                hint: string;
                                placeholder: string;
                            };
                        };
                    };
                    configurationSection: {
                        disabled: string;
                        description: string;
                        enabled: string;
                        heading: string;
                    };
                    notifications: {
                        disbleAdminAdvisoryBanner: {
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
                        enableAdminAdvisoryBanner: {
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
                        getConfigurations: {
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
                        updateConfigurations: {
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
                    pageHeading: string;
                    pageSubheading: string;
                };
                manageNotificationSendingInternally: {
                    title: string;
                    description: string;
                };
                remoteLogPublishing: {
                    title: string;
                    pageTitle: string;
                    description: string;
                    fields: {
                        logTypes: {
                            label: string;
                            values: {
                                carbonLogs: string;
                                auditLogs: string;
                                allLogs: string;
                            };
                        };
                        remoteURL: {
                            label: string;
                        };
                        advanced: {
                            title: string;
                            connectionTimeout: {
                                label: string;
                            };
                            verifyHostname: {
                                label: string;
                            };
                            basicAuthConfig: {
                                title: string;
                                serverUsername: {
                                    label: string;
                                };
                                serverPassword: {
                                    label: string;
                                };
                            };
                            sslConfig: {
                                title: string;
                                keystorePath: {
                                    label: string;
                                };
                                keystorePassword: {
                                    label: string;
                                };
                                truststorePath: {
                                    label: string;
                                };
                                truststorePassword: {
                                    label: string;
                                };
                            };
                        };
                    };
                    dangerZone: {
                        button: string;
                        title: string;
                        header: string;
                        subheader: string;
                        confirmation: {
                            hint: string;
                            header: string;
                            message: string;
                            content: string;
                        };
                    };
                    notification: {
                        success: {
                            description: string;
                            message: string;
                        };
                        error: {
                            updateError: {
                                description: string;
                                message: string;
                            };
                            fetchError: {
                                description: string;
                                message: string;
                            };
                        };
                    };
                };
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
                        getConfigurations: {
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
                        updateConfigurations: {
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
                        emptyHomeRealmIdentifiers: {
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
                    form: {
                        homeRealmIdentifiers: {
                            hint: string;
                            label: string;
                            placeholder: string;
                        };
                        idleSessionTimeoutPeriod: {
                            hint: string;
                            label: string;
                        };
                        rememberMePeriod: {
                            hint: string;
                            label: string;
                        };
                    };
                };
            };
            sidePanel: {
                accountManagement: string;
                addEmailTemplate: string;
                addEmailTemplateLocale: string;
                approvals: string;
                attributeDialects: string;
                categories: {
                    attributes: string;
                    certificates: string;
                    configurations: string;
                    general: string;
                    users: string;
                    userstores: string;
                    organizations: string;
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
                emailDomainDiscovery: string;
                emailTemplateTypes: string;
                emailTemplates: string;
                generalConfigurations: string;
                groups: string;
                localDialect: string;
                loginAttemptsSecurity: string;
                multiFactorAuthenticators: string;
                organizations: string;
                otherSettings: string;
                overview: string;
                passwordPolicies: string;
                remoteFetchConfig: string;
                roles: string;
                userOnboarding: string;
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
                        2: string;
                    };
                    emptyPlaceholders: {
                        default: string;
                        groups: {
                            unselected: string;
                            selected: string;
                            common: string;
                        };
                        roles: {
                            unselected: string;
                            selected: string;
                            common: string;
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
                        };
                        passwordResetZone: {
                            actionTitle: string;
                            header: string;
                            subheader: string;
                            buttonHint: string;
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
                };
                profile: {
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
                    fetchUserstores: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    fetchUserstoreTemplates: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    fetchUserstoreTypes: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    fetchUserstoreMetadata: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                    };
                    deleteUserstore: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    delay: {
                        message: string;
                        description: string;
                    };
                    updateUserstore: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    testConnection: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    addUserstore: {
                        genericError: {
                            message: string;
                            description: string;
                        };
                        success: {
                            message: string;
                            description: string;
                        };
                    };
                    apiLimitReachedError: {
                        error: {
                            message: string;
                            description: string;
                        };
                    };
                    updateDelay: {
                        message: string;
                        description: string;
                    };
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
                        name: {
                            label: string;
                            placeholder: string;
                            requiredErrorMessage: string;
                            validationErrorMessages: {
                                [key: string]: string;
                            };
                        };
                        type: {
                            label: string;
                            requiredErrorMessage: string;
                        };
                        description: {
                            label: string;
                            placeholder: string;
                            validationErrorMessages: {
                                invalidInputErrorMessage: string;
                            };
                        };
                    };
                    connection: {
                        updatePassword: string;
                        testButton: string;
                        connectionErrorMessage: string;
                    };
                    custom: {
                        placeholder: string;
                        requiredErrorMessage: string;
                    };
                };
                dangerZone: {
                    delete: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
                    disable: {
                        actionTitle: string;
                        header: string;
                        subheader: string;
                    };
                };
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
                    emptySearch: {
                        action: string;
                        title: string;
                        subtitles: string;
                    };
                    emptyList: {
                        action: string;
                        title: string;
                        subtitles: string;
                    };
                    emptyListReadOnly: {
                        title: string;
                        subtitles: string;
                    };
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
            invite: {
                inviteButton: string;
                subSelection: {
                    onBoard: string;
                    invitees: string;
                };
                notifications: {
                    deleteInvite: {
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
                    resendInvite: {
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
                    sendInvite: {
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
                    updateInvite: {
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
                confirmationModal: {
                    deleteInvite: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                    resendInvite: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
                placeholder: {
                    emptySearchResultPlaceholder: {
                        clearButton: string;
                        subTitle: {
                            0: string;
                            1: string;
                        };
                        title: string;
                    };
                    emptyResultPlaceholder: {
                        addButton: string;
                        subTitle: {
                            0: string;
                            1: string;
                            2: string;
                        };
                        title: string;
                    };
                };
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
                form: {
                    sendmail: {
                        title: string;
                        subTitle: string;
                    };
                };
                rolesUpdateModal: {
                    header: string;
                    subHeader: string;
                    searchPlaceholder: string;
                };
            };
            parentOrgInvitations: {
                addUserWizard: {
                    heading: string;
                    description: string;
                    hint: string;
                    username: {
                        label: string;
                        placeholder: string;
                        hint: string;
                        validations: {
                            required: string;
                        };
                    };
                    groups: {
                        label: string;
                        placeholder: string;
                        hint: string;
                        validations: {
                            required: string;
                        };
                    };
                    inviteButton: string;
                };
                tab: {
                    usersTab: string;
                    invitationsTab: string;
                };
                searchPlaceholder: string;
                searchdropdown: {
                    pendingLabel: string;
                    expiredLabel: string;
                };
                createDropdown: {
                    createLabel: string;
                    inviteLabel: string;
                };
                filterLabel: string;
                emptyPlaceholder: {
                    noPendingInvitations: string;
                    noExpiredInvitations: string;
                    noInvitations: string;
                    noCollaboratorUserInvitations: string;
                };
                invitedUserLabel: string;
            };
            onboarded: {
                notifications: {
                    removeUser: {
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
                confirmationModal: {
                    removeUser: {
                        assertionHint: string;
                        header: string;
                        message: string;
                        content: string;
                    };
                };
            };
            validation: {
                fetchValidationConfigData: {
                    error: {
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
                validationError: {
                    minMaxMismatch: string;
                    uniqueChrMismatch: string;
                    consecutiveChrMismatch: string;
                    invalidConfig: string;
                    minLimitError: string;
                    maxLimitError: string;
                    wrongCombination: string;
                };
                notifications: {
                    error: {
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                pageTitle: string;
                description: string;
                goBackToApplication: string;
                goBackToValidationConfig: string;
            };
            jwtPrivateKeyConfiguration: {
                fetchValidationConfigData: {
                    error: {
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
                notifications: {
                    error: {
                        description: string;
                        message: string;
                    };
                    genericError: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                pageTitle: string;
                description: string;
                goBackToApplication: string;
                goBackToAccountSecurityConfig: string;
                messageInfo: string;
                tokenReuseEnabled: string;
                tokenReuseDisabled: string;
            };
            insights: {
                pageTitle: string;
                title: string;
                description: string;
                durationMessage: string;
                durationOption: string;
                lastFetchedMessage: {
                    label: string;
                    tooltipText: string;
                };
                advancedFilter: {
                    filterAttribute: string;
                    filterCondition: string;
                    filterValue: string;
                };
                commonFilters: {
                    userId: string;
                };
                activityType: {
                    login: {
                        filters: {
                            userStore: string;
                            serviceProvider: string;
                            identityProvider: string;
                            authenticator: {
                                attributeName: string;
                                values: {
                                    basic: string;
                                    identifierFirst: string;
                                    fido2: string;
                                    magicLink: string;
                                    emailOtp: string;
                                    smsOtp: string;
                                    totp: string;
                                    backupCodes: string;
                                    google: string;
                                    facebook: string;
                                    github: string;
                                    apple: string;
                                    oidc: string;
                                    saml: string;
                                    hypr: string;
                                    iproov: string;
                                    organizationLogin: string;
                                };
                            };
                        };
                    };
                    registration: {
                        filters: {
                            onboardingMethod: {
                                attributeName: string;
                                values: {
                                    adminInitiated: string;
                                    userInvited: string;
                                    selfSignUp: string;
                                };
                            };
                        };
                    };
                };
                graphs: {
                    activeUsers: {
                        title: string;
                        titleHint: string;
                    };
                    successLogins: {
                        title: string;
                        titleHint: string;
                    };
                    failedLogins: {
                        title: string;
                    };
                    signups: {
                        title: string;
                        titleHint: string;
                    };
                };
                notifications: {
                    fetchInsights: {
                        genericError: {
                            description: string;
                            message: string;
                        };
                    };
                };
                compareToLastPeriodMessage: string;
            };
            smsProviders: {
                heading: string;
                subHeading: string;
                description: string;
                info: string;
                updateButton: string;
                sendTestSMSButton: string;
                goBack: string;
                confirmationModal: {
                    header: string;
                    message: string;
                    content: string;
                    assertionHint: string;
                };
                dangerZoneGroup: {
                    header: string;
                    revertConfig: {
                        heading: string;
                        subHeading: string;
                        actionTitle: string;
                    };
                };
                form: {
                    twilio: {
                        subHeading: string;
                        accountSID: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        authToken: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        sender: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        validations: {
                            required: string;
                        };
                    };
                    vonage: {
                        subHeading: string;
                        accountSID: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        authToken: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        sender: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        validations: {
                            required: string;
                        };
                    };
                    custom: {
                        subHeading: string;
                        providerName: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        providerUrl: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        httpMethod: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        contentType: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        headers: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        payload: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        key: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        secret: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        sender: {
                            label: string;
                            placeholder: string;
                            hint: string;
                        };
                        validations: {
                            required: string;
                            methodInvalid: string;
                            contentTypeInvalid: string;
                        };
                    };
                };
                notifications: {
                    getConfiguration: {
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    deleteConfiguration: {
                        success: {
                            description: string;
                            message: string;
                        };
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                    updateConfiguration: {
                        success: {
                            description: string;
                            message: string;
                        };
                        error: {
                            description: string;
                            message: string;
                        };
                    };
                };
            };
        };
        notifications: {
            endSession: {
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
            getProfileSchema: {
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
        pages: {
            addEmailTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            approvalsPage: {
                title: string;
                subTitle: string;
            };
            editTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            emailDomainDiscovery: {
                title: string;
                subTitle: string;
            };
            emailLocaleAdd: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            emailLocaleAddWithDisplayName: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            emailTemplateTypes: {
                title: string;
                subTitle: string;
            };
            emailTemplates: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            emailTemplatesWithDisplayName: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            groups: {
                title: string;
                subTitle: string;
            };
            organizations: {
                title: string;
                subTitle: string;
            };
            overview: {
                title: string;
                subTitle: string;
            };
            oidcScopes: {
                title: string;
                subTitle: string;
            };
            oidcScopesEdit: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            roles: {
                title: string;
                subTitle: string;
                alternateSubTitle: string;
            };
            rolesEdit: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            groupsEdit: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            serverConfigurations: {
                title: string;
                subTitle: string;
            };
            users: {
                title: string;
                subTitle: string;
            };
            usersEdit: {
                title: string;
                subTitle: string;
                backButton: string;
            };
            invite: {
                title: string;
                subTitle: string;
            };
        };
        placeholders: {
            emptySearchResult: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
            underConstruction: {
                action: string;
                title: string;
                subtitles: {
                    0: string;
                    1: string;
                };
            };
        };
    };
}
