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
    FormField,
    HelpPanelActionsInterface,
    HelpPanelInterface,
    Message,
    ModalInterface,
    Notification,
    NotificationItem,
    Page,
    Placeholder,
    Popup,
    TransferList,
    ValidationInterface
} from "../common";

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
        modals: {
            editAvatarModal: ModalInterface;
            sessionTimeoutModal: ModalInterface;
        };
        placeholders: {
            404: Placeholder;
            accessDenied: Placeholder;
            brokenPage: Placeholder;
            consentDenied: Placeholder;
            genericError: Placeholder;
            loginError: Placeholder;
            sessionStorageDisabled: Placeholder;
            unauthorized: Placeholder;
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
            inSecureURL: ValidationInterface;
            unrecognizedURL: ValidationInterface;
        };
        sidePanel: {
            privacy: string;
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
                    deleteApplication: Confirmation;
                    deleteOutboundProvisioningIDP: Confirmation;
                    deleteProtocol: Confirmation;
                    regenerateSecret: Confirmation;
                    revokeApplication: Confirmation;
                    clientSecretHashDisclaimer: {
                        modal: Confirmation;
                        forms: {
                           clientIdSecretForm: {
                               clientId: FormAttributes;
                               clientSecret: FormAttributes;
                           };
                        };
                    };
                };
                dangerZoneGroup: {
                    header: string;
                    deleteApplication: DangerZone;
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
                                            emptyPlaceholder: Placeholder;
                                            heading: string;
                                            subHeading: string;
                                        };
                                        quickSetup: {
                                            emptyPlaceholder: Placeholder;
                                            heading: string;
                                            subHeading: string;
                                        };
                                    };
                                };
                            };
                            tabName: string;
                        };
                        advanced: {
                            tabName: string;
                        };
                        attributes: {
                            forms: {
                                fields: {
                                    dynamic: {
                                        localRole: FormAttributes;
                                        applicationRole: FormAttributes;
                                    };
                                };
                            };
                            selection: {
                                addWizard: {
                                    header: string;
                                    subHeading: string;
                                    steps: {
                                        select: {
                                            transfer: TransferList;
                                        };
                                    };
                                };
                                heading: string;
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
                                    listItem: {
                                        actions: {
                                            makeMandatory: string;
                                            makeRequested: string;
                                            removeMandatory: string;
                                            removeRequested: string;
                                        };
                                        fields: {
                                            claim: FormAttributes;
                                        };
                                    };
                                    searchPlaceholder: string;
                                };
                            };
                            roleMapping: {
                                heading: string;
                            };
                            tabName: string;
                        };
                        general: {
                            tabName: string;
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
                                            heading: string;
                                            hint: string;
                                            editor: {
                                                templates: {
                                                    heading: string;
                                                    darkMode: string;
                                                };
                                            };
                                        };
                                        stepBased: {
                                            actions: {
                                                addStep: string;
                                                selectAuthenticator: string;
                                            };
                                            heading: string;
                                            hint: string;
                                            forms: {
                                                fields: {
                                                    attributesFrom: FormAttributes;
                                                    subjectIdentifierFrom: FormAttributes;
                                                };
                                            };
                                        };
                                    };
                                };
                                requestPathAuthenticators: {
                                    title: string;
                                    subTitle: string;
                                    notifications: {
                                        getRequestPathAuthenticators: Notification;
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
                    };
                };
                forms: {
                    advancedAttributeSettings: {
                        sections: {
                            subject: {
                                fields: {
                                    subjectAttribute: FormAttributes;
                                    subjectIncludeTenantDomain: FormAttributes;
                                    subjectIncludeUserDomain: FormAttributes;
                                    subjectUseMappedLocalSubject: FormAttributes;
                                };
                                heading: string;
                            };
                            role: {
                                heading: string;
                                fields: {
                                    roleAttribute: FormAttributes;
                                    role: FormAttributes;
                                };
                            };
                        };
                    };
                    advancedConfig: {
                        fields: {
                            enableAuthorization: FormAttributes;
                            returnAuthenticatedIdpList: FormAttributes;
                            saas: FormAttributes;
                            skipConsentLogin: FormAttributes;
                            skipConsentLogout: FormAttributes;
                        };
                        sections: {
                            certificate: {
                                heading: string;
                                fields: {
                                    jwksValue: FormAttributes;
                                    pemValue: FormAttributes;
                                    type: FormAttributes;
                                };
                            };
                        };
                    };
                    generalDetails: {
                        fields: {
                            name: FormAttributes;
                            description: FormAttributes;
                            imageUrl: FormAttributes;
                            discoverable: FormAttributes;
                            accessUrl: FormAttributes;
                        };
                    };
                    inboundCustom: {
                        fields: {
                            checkbox: FormAttributes;
                            dropdown: FormAttributes;
                            generic: FormAttributes;
                            password: FormAttributes;
                        };
                    };
                    inboundOIDC: {
                        fields: {
                            allowedOrigins: FormAttributes;
                            callBackUrls: FormAttributes;
                            clientID: FormAttributes;
                            clientSecret: FormAttributes;
                            grant: FormAttributes;
                            public: FormAttributes;
                        };
                        sections: {
                            accessToken: {
                                heading: string;
                                hint: string;
                                fields: {
                                    bindingType: FormAttributes;
                                    expiry: FormAttributes;
                                    type: FormAttributes;
                                    revokeToken: FormAttributes;
                                    validateBinding: FormAttributes;
                                };
                            };
                            idToken: {
                                heading: string;
                                fields: {
                                    expiry: FormAttributes;
                                    algorithm: FormAttributes;
                                    audience: FormAttributes;
                                    encryption: FormAttributes;
                                    method: FormAttributes;
                                };
                            };
                            logoutURLs: {
                                heading: string;
                                fields: {
                                    back: FormAttributes;
                                    front: FormAttributes;
                                    signatureValidation: FormAttributes;
                                };
                            };
                            pkce: {
                                heading: string;
                                hint: string;
                                fields: {
                                    pkce: FormAttributes;
                                };
                            };
                            refreshToken: {
                                heading: string;
                                fields: {
                                    expiry: FormAttributes;
                                    renew: FormAttributes;
                                };
                            };
                            scopeValidators: {
                                heading: string;
                                fields: {
                                    validator: FormAttributes;
                                };
                            };
                        };
                        messages: {
                            revokeDisclaimer: Message;
                        };
                    };
                    inboundSAML: {
                        fields: {
                            assertionURLs: FormAttributes;
                            defaultAssertionURL: FormAttributes;
                            idpEntityIdAlias: FormAttributes;
                            issuer: FormAttributes;
                            metaURL: FormAttributes;
                            mode: FormAttributes;
                            qualifier: FormAttributes;
                        };
                        sections: {
                            assertion: {
                                heading: string;
                                fields: {
                                    audience: FormAttributes;
                                    nameIdFormat: FormAttributes;
                                    recipients: FormAttributes;
                                };
                            };
                            attributeProfile: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                    includeAttributesInResponse: FormAttributes;
                                    serviceIndex: FormAttributes;
                                };
                            };
                            encryption: {
                                heading: string;
                                fields: {
                                    assertionEncryption: FormAttributes;
                                    assertionEncryptionAlgorithm: FormAttributes;
                                    keyEncryptionAlgorithm: FormAttributes;
                                };
                            };
                            idpInitiatedSLO: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                    returnToURLs: FormAttributes;
                                };
                            };
                            responseSigning: {
                                heading: string;
                                fields: {
                                    digestAlgorithm: FormAttributes;
                                    responseSigning: FormAttributes;
                                    signingAlgorithm: FormAttributes;
                                };
                            };
                            requestProfile: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                };
                            };
                            requestValidation: {
                                heading: string;
                                fields: {
                                    signatureValidation: FormAttributes;
                                    signatureValidationCertAlias: FormAttributes;
                                };
                            };
                            sloProfile: {
                                heading: string;
                                fields: {
                                    enable: FormAttributes;
                                    logoutMethod: FormAttributes;
                                    requestURL: FormAttributes;
                                    responseURL: FormAttributes;
                                };
                            };
                            ssoProfile: {
                                heading: string;
                                fields: {
                                    artifactBinding: FormAttributes;
                                    bindings: FormAttributes;
                                    idpInitiatedSSO: FormAttributes;
                                };
                            };
                        };
                    };
                    inboundSTS: {
                        fields: {
                            realm: FormAttributes;
                            replyTo: FormAttributes;
                        };
                    };
                    inboundWSTrust: {
                        fields: {
                            audience: FormAttributes;
                            certificateAlias: FormAttributes;
                        };
                    };
                    outboundProvisioning: {
                        fields: {
                            blocking: FormAttributes;
                            connector: FormAttributes;
                            idp: FormAttributes;
                            jit: FormAttributes;
                            rules: FormAttributes;
                        };
                    };
                    provisioningConfig: {
                        fields: {
                            proxyMode: FormAttributes;
                            userstoreDomain: FormAttributes;
                        };
                    };
                };
                helpPanel: HelpPanelInterface;
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                    actions: {
                        add: string;
                    };
                };
                notifications: {
                    addApplication: Notification;
                    authenticationStepMin: Notification;
                    deleteApplication: Notification;
                    deleteProtocolConfig: Notification;
                    duplicateAuthenticationStep: Notification;
                    emptyAuthenticationStep: Notification;
                    fetchAllowedCORSOrigins: Notification;
                    fetchApplication: Notification;
                    fetchApplications: Notification;
                    fetchCustomInboundProtocols: Notification;
                    fetchInboundProtocols: Notification;
                    fetchProtocolMeta: Notification;
                    fetchSAMLIDPConfigs: Notification;
                    fetchOIDCIDPConfigs: Notification;
                    fetchTemplate: Notification;
                    fetchTemplates: Notification;
                    getInboundProtocolConfig: Notification;
                    regenerateSecret: Notification;
                    revokeApplication: Notification;
                    updateAdvancedConfig: Notification;
                    updateApplication: Notification;
                    updateAuthenticationFlow: Notification;
                    updateClaimConfig: Notification;
                    updateInboundProtocolConfig: Notification;
                    updateInboundProvisioningConfig: Notification;
                    updateOutboundProvisioning: Notification;
                    updateProtocol: Notification;
                    fetchOIDCServiceEndpoints: Notification;
                };
                popups: {
                    appStatus: {
                        active: Popup;
                        notConfigured: Popup;
                        revoked: Popup;
                    };
                };
                placeholders: {
                    emptyAttributesList: Placeholder;
                    emptyAuthenticatorStep: Placeholder;
                    emptyAuthenticatorsList: Placeholder;
                    emptyOutboundProvisioningIDPs: Placeholder;
                    emptyList: Placeholder;
                    emptyProtocolList: Placeholder;
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
                        };
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
                actions: HelpPanelActionsInterface;
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
                helpPanel: HelpPanelInterface;
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
                    addFederatedAuthenticator: Notification;
                    addIDP: Notification;
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
                    deleteIDP: Notification;
                    disableAuthenticator: Notification;
                    disableOutboundProvisioningConnector: Notification;
                    duplicateCertificateUpload: Notification;
                    getIDP: Notification;
                    getIDPList: Notification;
                    getIDPTemplate: Notification;
                    getIDPTemplateList: Notification;
                    getFederatedAuthenticator: Notification;
                    getFederatedAuthenticatorsList: Notification;
                    getFederatedAuthenticatorMetadata: Notification;
                    getOutboundProvisioningConnector: Notification;
                    getOutboundProvisioningConnectorsList: Notification;
                    getOutboundProvisioningConnectorMetadata: Notification;
                    getAllLocalClaims: Notification;
                    getRolesList: Notification;
                    submitAttributeSettings: Notification;
                    deleteDefaultAuthenticator: Notification;
                    deleteDefaultConnector: Notification;
                    updateClaimsConfigs: Notification;
                    updateFederatedAuthenticator: Notification;
                    updateFederatedAuthenticators: Notification;
                    updateIDP: Notification;
                    updateIDPCertificate: Notification;
                    updateIDPRoleMappings: Notification;
                    updateJITProvisioning: Notification;
                    updateOutboundProvisioningConnectors: Notification;
                    updateOutboundProvisioningConnector: Notification;
                };
                placeHolders: {
                    emptyCertificateList: Placeholder;
                    emptyIDPList: Placeholder;
                    emptyIDPSearchResults: Placeholder;
                    emptyAuthenticatorList: Placeholder;
                    emptyConnectorList: Placeholder;
                    noAttributes: Placeholder;
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
                    general: string;
                };
                customize: string;
                identityProviderEdit: string;
                identityProviderTemplates: string;
                identityProviders: string;
                oidcScopes: string;
                oidcScopesEdit: string;
                overview: string;
                remoteRepo: string;
                remoteRepoEdit: string;
            };
            templates: {
                emptyPlaceholder: Placeholder;
            };
        };
        notifications: {
            endSession: Notification;
            getProfileInfo: Notification;
            getProfileSchema: Notification;
        };
        pages: {
            applicationTemplate: EditPage;
            applications: Page;
            applicationsEdit: EditPage;
            idp: Page;
            idpTemplate: {
                title: string;
                subTitle: string;
                backButton: string;
                supportServices: {
                    authenticationDisplayName: string;
                    provisioningDisplayName: string;
                };
            };
            overview: Page;
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
            emptySearchResult: Placeholder;
            underConstruction: Placeholder;
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
    manage: {
        features: {
            users: {
                confirmations: {
                    terminateAllSessions: Confirmation;
                    terminateSession: Confirmation;
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
                            };
                        };
                    };
                    notifications: {
                        getUserSessions: Notification;
                        terminateAllUserSessions: Notification;
                        terminateUserSession: Notification;
                    };
                    placeholders: {
                        emptyListPlaceholder: Placeholder;
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
                forms: {
                    validation: {
                        formatError: string;
                    };
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
                    userstoreError: Placeholder;
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
            approvals: {
                list: {
                    columns: {
                        actions: string;
                        name: string;
                    };
                };
                modals: {
                    taskDetails: {
                        header: string;
                        description: string;
                    };
                };
                notifications: {
                    fetchApprovalDetails: Notification;
                    fetchPendingApprovals: Notification;
                    updatePendingApprovals: Notification;
                };
                placeholders: {
                    emptyApprovalList: Placeholder;
                    emptyApprovalFilter: Placeholder;
                    emptySearchResults: Placeholder;
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
                    emptySearch: Placeholder;
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
                    roles: {
                        addRolesModal: {
                            heading: string;
                            subHeading: string;
                        };
                        subHeading: string;
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
                    fetchGroups: Notification;
                };
                placeholders: {
                    groupsError: Placeholder;
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
                form: {
                    errors: {
                        positiveIntegers: string;
                        format: string;
                    };
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
            oidcScopes: {
                buttons: {
                    addScope: string;
                };
                confirmationModals: {
                    deleteScope: Confirmation;
                    deleteClaim: Confirmation;
                };
                editScope: {
                    claimList: {
                        emptyPlaceholder: Placeholder;
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
                                    empty: string;
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
                    empty: Placeholder;
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
                    addOIDCScope: Notification;
                    addOIDCClaim: Notification;
                    fetchOIDCScopes: Notification;
                    fetchOIDCScope: Notification;
                    fetchOIDClaims: Notification;
                    deleteOIDCScope: Notification;
                    deleteOIDClaim: Notification;
                    updateOIDCScope: Notification;
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
                    emptySearch: Placeholder;
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
                        linkPopup: Popup;
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
                            accessToken: FormAttributes;
                            enable: FormAttributes;
                            connectivity: FormAttributes;
                            gitBranch: FormAttributes;
                            gitFolder: FormAttributes;
                            gitURL: FormAttributes;
                            pollingFrequency: FormAttributes;
                            sharedKey: FormAttributes;
                            username: FormAttributes;
                        };
                        heading: {
                            subTitle: string;
                            title: string;
                        };
                    };
                };
                modal: {
                    appStatusModal: ModalInterface;
                };
                notifications: {
                    createRepoConfig: Notification;
                    deleteRepoConfig: Notification;
                    getConfigDeploymentDetails: Notification;
                    getConfigList: Notification;
                    getRemoteRepoConfig: Notification;
                    triggerConfigDeployment: Notification;
                };
                pages: {
                    listing: Page;
                };
                placeholders: {
                    emptyListPlaceholder: Placeholder;
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
                            roleName: string;
                            users: string;
                            groups: string;
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
                    groups: {
                        addGroupsModal: {
                            heading: string;
                            subHeading: string;
                        };
                        emptyPlaceholder: Placeholder;
                        heading: string;
                        subHeading: string;
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
                approvals: string;
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
                disableUser: {
                    confirmationModal: Confirmation;
                };
                editUser: {
                    dangerZoneGroup: {
                        header: string;
                        deleteUserZone: DangerZone;
                        disableUserZone: DangerZone;
                        lockUserZone: DangerZone;
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
                    confirmationModal: Confirmation;
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
                    changePasswordModal: {
                        header: string;
                        message: string;
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
                        oneTimePassword: string;
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
                        lockUserAccount: Notification;
                        unlockUserAccount: Notification;
                        disableUserAccount: Notification;
                        enableUserAccount: Notification;
                        changeUserPassword: Notification;
                        forcePasswordReset: Notification;
                        noPasswordResetOptions: Notification;
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
                    fetchUserstores: Notification;
                    fetchUserstoreTemplates: Notification;
                    fetchUserstoreTypes: Notification;
                    fetchUserstoreMetadata: Notification;
                    deleteUserstore: Notification;
                    delay: NotificationItem;
                    updateUserstore: Notification;
                    testConnection: Notification;
                    addUserstore: Notification;
                    updateDelay: NotificationItem;
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
                dangerZone: {
                    delete: DangerZone;
                    disable: DangerZone;
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
            approvalsPage: Page;
            editTemplate: EditPage;
            emailLocaleAdd: EditPage;
            emailLocaleAddWithDisplayName: EditPage;
            emailTemplateTypes: Page;
            emailTemplates: EditPage;
            emailTemplatesWithDisplayName: EditPage;
            groups: Page;
            overview: Page;
            oidcScopes: Page;
            oidcScopesEdit: EditPage;
            roles: Page;
            rolesEdit: EditPage;
            serverConfigurations: Page;
            users: Page;
            usersEdit: EditPage;
        };
        placeholders: {
            emptySearchResult: Placeholder;
            underConstruction: Placeholder;
        };
    };
}
