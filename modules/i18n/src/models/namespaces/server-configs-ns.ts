/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
export interface serverConfigsNS {
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
}
