/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

export interface flowExtensionNS {
    createWizard: {
        steps: {
            generalSettings: {
                title: string;
                name: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        invalid: string;
                    };
                };
                description: {
                    label: string;
                    placeholder: string;
                    validations: {
                        maxLength: string;
                    };
                };
                iconUrl: {
                    label: string;
                    placeholder: string;
                    hint: string;
                    validations: {
                        invalid: string;
                    };
                };
            };
            endpointConfig: {
                title: string;
            };
        };
    };
    edit: {
        pageTitle: string;
        backButton: string;
        tabs: {
            general: {
                label: string;
            };
            endpoint: {
                label: string;
            };
            accessConfig: {
                label: string;
            };
        };
        general: {
            name: {
                label: string;
                placeholder: string;
                hint: string;
                validations: {
                    invalid: string;
                };
            };
            description: {
                label: string;
                placeholder: string;
                validations: {
                    maxLength: string;
                };
            };
            iconUrl: {
                label: string;
                placeholder: string;
                hint: string;
                validations: {
                    invalid: string;
                };
            };
        };
        endpoint: {
            title: string;
        };
        accessConfig: {
            emptyInfo: string;
            treeLoadError: string;
            resetButton: string;
        };
        dangerZone: {
            delete: {
                actionTitle: string;
                header: string;
                subheader: string;
            };
        };
        confirmations: {
            delete: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
            reset: {
                header: string;
                message: string;
                content: string;
                assertionHint: string;
            };
        };
    };
    notifications: {
        createSuccess: {
            message: string;
            description: string;
        };
        createError: {
            message: string;
            description: string;
        };
        fetchError: {
            message: string;
            description: string;
        };
        updateSuccess: {
            message: string;
            description: string;
        };
        updateError: {
            message: string;
            description: string;
        };
        resetSuccess: {
            message: string;
            description: string;
        };
        deleteSuccess: {
            message: string;
            description: string;
        };
        deleteError: {
            message: string;
            description: string;
        };
    };
    properties: {
        description: string;
        connectionLabel: string;
        connectionPlaceholder: string;
        noConnectionsWarning: string;
        noConnectionsWarningWithSupport: string;
    };
    contextTree: {
        fieldConfig: {
            title: string;
            emptyTitle: string;
            emptyHint: string;
            readOnlyBadge: string;
            editTooltip: string;
            deleteTooltip: string;
        };
        node: {
            readChip: string;
            writeChip: string;
            addEntryChip: string;
            readOnlyBadge: string;
            noEntries: string;
        };
        addClaimModal: {
            title: string;
            subtitle: string;
            noOptions: string;
            readOnlyBadge: string;
            searchPlaceholder: string;
            cancelButton: string;
            addButton: string;
            fetchError: {
                message: string;
                description: string;
            };
        };
        addEntryModal: {
            title: {
                createMap: string;
                createObject: string;
                editMap: string;
                editObject: string;
            };
            subtitle: {
                map: string;
                object: string;
            };
            keyName: {
                label: string;
                placeholder: string;
            };
            dataType: {
                label: string;
            };
            multivalued: string;
            attributes: {
                label: string;
                namePlaceholder: string;
                arrayTooltip: string;
            };
            structurePreview: string;
            cancelButton: string;
            submitButton: {
                create: string;
                edit: string;
            };
        };
    };
}
