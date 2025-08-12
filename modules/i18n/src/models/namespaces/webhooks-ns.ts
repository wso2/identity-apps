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

export interface webhooksNS {
    sidePanel: {
        name: string;
    };
    pages: {
        list: {
            heading: string;
            subHeading: string;
            buttons: {
                add: string;
                settings: string;
            };
            columns: {
                webhook: string;
                status: string;
            };
            emptyList: {
                subHeading: string;
            };
        };
        edit: {
            heading: string;
            headingWebSubHubMode: string;
            subHeading: string;
            subHeadingWebSubHubMode: string;
        };
        create: {
            heading: string;
            subHeading: string;
        };
        settings: {
            heading: string;
            subHeading: string;
            backButton: string;
            organizationPolicy: {
                heading: string;
                radioOptions: {
                    currentOrgOnly: string;
                    currentOrgAndImmediateChild: string;
                };
            };
        }
    };

    goBackToWebhooks: string;
    heading: string;
    subHeading: string;
    advancedSearch: {
        filterAttribute: {
            placeholder: string;
        };
        filterCondition: {
            placeholder: string;
        };
        filterValue: {
            placeholder: string;
        };
        filterAttributeOptions: {
            name: { label: string };
            endpoint: { label: string };
        };
        placeholder: string;
    };
    dangerZone: {
        heading: string;
        delete: {
            heading: string;
            subHeading: string;
            actionTitle: string;
        };
    };
    confirmations: {
        delete: {
            assertionHint: string;
            heading: string;
            message: string;
            content: string;
        };
    };
    configForm: {
        fields: {
            name: {
                hint: string;
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    invalid: string;
                };
            };
            endpoint: {
                hint: string;
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    invalid: string;
                    notHttps: string;
                };
            };
            secret: {
                info: {
                    message: string;
                    messageWebSubHubMode: string;
                    title: string;
                };
                hint: {
                    common: string;
                    create: string;
                    createWebSubHubMode: string;
                    update: string;
                };
                label: string;
                placeholder: string;
                validations: {
                    empty: string;
                    invalid: string;
                };
            };
        };
        channels: {
            heading: string;
            subHeading: string;
            validations: {
                empty: string;
            };
            status: {
                subscriptionAccepted: string;
                subscriptionError: string;
                unsubscriptionAccepted: string;
                unsubscriptionError: string;
            };
        };
        buttons: {
            changeSecret: string;
            cancel: string;
            create: string;
            update: string;
        };
    };
    common: {
        status: {
            active: string;
            inactive: string;
        };
    };
    notifications: {
        createWebhook: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        updateWebhook: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        updateWebhookSettings: {
            error: {
                message: string;
                description: string;
                genericDescription: string;
            };
            success: {
                message: string;
                description: string;
            };
        }
        updateWebhookStatus: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        deleteWebhook: {
            success: {
                message: string;
                description: string;
            };
            error: {
                message: string;
                description: string;
            };
        };
        fetchWebhook: {
            error: {
                message: string;
                description: string;
                genericDescription: string;
            };
        };
        fetchEventProfile: {
            error: {
                message: string;
                description: string;
                genericDescription: string;
            };
        };
        fetchWebhooks: {
            error: {
                message: string;
                description: string;
                genericDescription: string;
            };
        };
        retryWebhookState: {
            error: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
    };
    statusBanner: {
        pendingActivation: {
            title: string;
            message: string;
        };
        pendingDeactivation: {
            title: string;
            message: string;
        };
        buttons: {
            retry: string;
        };
    }
}
