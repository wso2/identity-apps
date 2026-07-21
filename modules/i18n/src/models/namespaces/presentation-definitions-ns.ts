/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

interface CredentialFieldsNS {
    credentialQueryId: { label: string; placeholder: string; hint: string; patternError: string };
    type: { label: string; placeholder: string };
    purpose: { label: string; placeholder: string };
    claims: {
        label: string;
        placeholder: string;
        hint: string;
        claimName: { label: string; placeholder: string };
        claimPath: { label: string; placeholder: string; hint: string; addSegment: string };
        mandatory: { label: string; hint: string };
        allowedValues: { label: string; placeholder: string; hint: string };
        addClaim: string;
    };
    claimSets: {
        label: string;
        hint: string;
        optionLabel: string;
        optionPlaceholder: string;
        addSet: string;
    };
    enforceTrustedIssuers: { label: string; hint: string };
    trustedIssuers: { label: string; placeholder: string; hint: string };
    issuerCert: {
        label: string;
        hint: string;
        none: { label: string; hint: string };
        jwks: { label: string; urlLabel: string; urlPlaceholder: string; urlHint: string };
        pem: { label: string; hint: string };
    };
    addButton: string;
}

export interface PresentationDefinitionsNS {
    page: {
        title: string;
        heading: string;
        description: string;
    };
    buttons: {
        addDefinition: string;
    };
    placeholders: {
        emptyList: {
            subtitle: string;
        };
    };
    list: {
        columns: {
            name: string;
            description: string;
            actions: string;
        };
        confirmations: {
            deleteItem: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
        };
    };
    wizard: {
        title: string;
        form: {
            name: { label: string; placeholder: string; hint: string };
            description: { label: string; placeholder: string };
            credentials: {
                label: string;
                hint: string;
            } & CredentialFieldsNS;
            submitButton: string;
        };
    };
    editPage: {
        title: string;
        backButton: string;
        tabs: {
            general: string;
            credentials: string;
        };
        form: {
            name: { label: string; placeholder: string };
            description: { label: string; placeholder: string };
            credentials: {
                label: string;
                hint: string;
                noCredentials: string;
                addCredential: { title: string };
                editCredential: { title: string };
            } & CredentialFieldsNS;
            credentialSets: {
                label: string;
                hint: string;
                setLabel: string;
                required: { label: string };
                options: {
                    label: string;
                    hint: string;
                    optionLabel: string;
                    optionPlaceholder: string;
                    addOption: string;
                };
                addSet: string;
            };
        };
        dangerZone: {
            header: string;
            delete: {
                header: string;
                subheader: string;
                actionTitle: string;
            };
        };
        confirmations: {
            deleteDefinition: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
        };
    };
    notifications: {
        fetchDefinitions: {
            error: { message: string; description: string };
        };
        fetchDefinition: {
            error: { message: string; description: string };
        };
        createDefinition: {
            success: { message: string; description: string };
            error: { message: string; description: string };
            duplicateError: { message: string; description: string };
        };
        updateDefinition: {
            success: { message: string; description: string };
            error: { message: string; description: string };
        };
        deleteDefinition: {
            success: { message: string; description: string };
            error: { message: string; description: string };
        };
    };
}
