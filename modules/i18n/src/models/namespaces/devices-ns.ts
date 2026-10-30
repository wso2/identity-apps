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

export interface DevicesNS {
    assurancePolicies: {
        advancedSearch: {
            emptyResults: {
                clearButton: string;
                subtitles: {
                    0: string;
                    1: string;
                };
                title: string;
            };
            placeholder: string;
        };
        backButton: string;
        buttons: {
            add: string;
            edit: string;
        };
        connector: {
            description: string;
            header: string;
        };
        description: string;
        list: {
            columns: {
                actions: string;
                name: string;
            };
            confirmations: {
                delete: {
                    assertionHint: string;
                    content: string;
                    header: string;
                    message: string;
                };
            };
        };
        notifications: {
            delete: {
                genericError: {
                    description: string;
                    message: string;
                };
                success: {
                    description: string;
                    message: string;
                };
            };
            fetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
        };
        placeholders: {
            empty: {
                subtitles: {
                    0: string;
                };
                title: string;
            };
        };
        platforms: {
            android: string;
            ios: string;
            macos: string;
            windows: string;
        };
        title: string;
        view: {
            backButton: string;
            notifications: {
                fetch: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
                fetchMetadata: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                };
            };
            rules: {
                empty: string;
            };
        };
        wizard: {
            create: {
                heading: string;
                subHeading: string;
            };
            edit: {
                heading: string;
                subHeading: string;
            };
            general: {
                name: {
                    editHint: string;
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                platforms: {
                    hint: string;
                    label: string;
                    validations: {
                        required: string;
                    };
                };
            };
            notifications: {
                create: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
                update: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
            };
            rules: {
                empty: {
                    addRule: string;
                    description: string;
                    title: string;
                };
                hint: string;
                validations: {
                    incomplete: string;
                };
            };
            steps: {
                general: string;
                review: string;
                rules: string;
            };
        };
    };
    registrationStep: {
        properties: {
            description: string;
            noPolicies: string;
            policy: {
                hint: string;
                label: string;
                noPermission: string;
                placeholder: string;
            };
        };
        validation: {
            authenticationRequired: string;
        };
    };
    userDevices: {
        confirmations: {
            delete: {
                assertionHint: string;
                content: string;
                header: string;
                message: string;
            };
        };
        list: {
            actions: {
                rename: string;
            };
            columns: {
                actions: string;
                name: string;
                registeredAt: string;
                status: string;
            };
            status: {
                ACTIVE: string;
                INACTIVE: string;
            };
        };
        notifications: {
            delete: {
                    genericError: {
                        description: string;
                        message: string;
                    };
                    success: {
                        description: string;
                        message: string;
                    };
                };
            fetch: {
                genericError: {
                    description: string;
                    message: string;
                };
            };
            update: {
                    genericError: {
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
            empty: {
                subtitles: {
                    0: string;
                };
                title: string;
            };
        };
        rename: {
            heading: string;
            name: {
                label: string;
                placeholder: string;
            };
        };
    };
}
