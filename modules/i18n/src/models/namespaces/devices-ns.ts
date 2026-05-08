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

export interface DevicesNS {
    title: string;
    description: string;
    advancedSearch: {
        placeholder: string;
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
    };
    list: {
        columns: {
            deviceName: string;
            user: string;
            status: string;
            registeredAt: string;
            actions: string;
        };
        confirmations: {
            delete: {
                assertionHint: string;
                header: string;
                message: string;
                content: string;
            };
        };
    };
    notifications: {
        fetch: {
            genericError: {
                message: string;
                description: string;
            };
        };
        delete: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
    };
    assurancePolicies: {
        wizard: {
            heading: string;
            subHeading: string;
            steps: {
                platform: {
                    title: string;
                    heading: string;
                    description: string;
                };
                ruleBuilder: {
                    title: string;
                    heading: string;
                    description: string;
                    policyNameLabel: string;
                    policyNamePlaceholder: string;
                    conditionsHeading: string;
                    conditionsDescription: string;
                };
            };
            platforms: {
                android: string;
                ios: string;
                macos: string;
                windows: string;
            };
            buttons: {
                next: string;
                cancel: string;
                create: string;
                back: string;
            };
            notifications: {
                metadataFetch: {
                    genericError: {
                        message: string;
                        description: string;
                    };
                };
                create: {
                    success: {
                        message: string;
                        description: string;
                    };
                    genericError: {
                        message: string;
                        description: string;
                    };
                };
            };
        };
        title: string;
        description: string;
        list: {
            columns: {
                name: string;
                actions: string;
            };
            confirmations: {
                delete: {
                    assertionHint: string;
                    header: string;
                    message: string;
                    content: string;
                };
            };
        };
        notifications: {
            fetch: {
                genericError: {
                    message: string;
                    description: string;
                };
            };
            delete: {
                success: {
                    message: string;
                    description: string;
                };
                error: {
                    message: string;
                    description: string;
                };
            };
        };
        placeholders: {
            empty: {
                title: string;
                subtitles: {
                    0: string;
                };
            };
        };
        edit: {
            backButton: string;
            fields: {
                name: {
                    label: string;
                };
                ruleId: {
                    label: string;
                };
            };
            notifications: {
                fetch: {
                    genericError: {
                        message: string;
                        description: string;
                    };
                };
            };
        };
    };
    placeholders: {
        emptySearch: {
            title: string;
            subtitles: {
                0: string;
                1: string;
            };
            action: string;
        };
        empty: {
            title: string;
            subtitles: {
                0: string;
            };
        };
    };
}
