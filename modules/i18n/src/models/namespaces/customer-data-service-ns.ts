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

export interface CustomerDataServiceNS {

    common: {
        buttons: {
            cancel: string;
            close: string;
            confirm: string;
            delete: string;
        };
        dangerZone: {
            header: string;
        };
        notifications: {
            error: string;
            notAllowed: string;
        };
    };

    profiles: {

        /**
         * Profiles LIST PAGE
         */
        list: {
            page?: {
                title?: string;
                description?: string;
            };

            columns: {
                profile: string;
                user: string;
                unifiedProfiles: string;
            };

            chips: {
                anonymous: string;
                linked: string;
                unified: string;
                notUnified: string;
            };

            search?: {
                placeholder: string;
            };

            placeholders?: {
                emptyList: {
                    title: string;
                    subtitle: string;
                };
                emptySearch: {
                    title: string;
                    subtitle: string;
                };
            };

            confirmations: {
                delete: {
                    header: string;
                    message: string;
                    content: string;
                    assertionHint: string;
                };
            };

            notifications: {
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
        };

        /**
         * PROFILE DETAILS PAGE
         */
        details: {

            page: {
                pageTitle: string;
                fallbackTitle: string;
                description: string;
                descriptionLinkedUser: string;
                backButton: string;
            };

            tabs: {
                general: string;
                unifiedProfiles: string;
            };

            form: {
                profileId: { label: string };
                userId: { label: string };
                createdDate: { label: string };
                updatedDate: { label: string };
                location: { label: string };
                profileData: { label: string };
            };

            profileData: {
                actions: {
                    view: string;
                    copy: string;
                    export: string;
                };
                modal: {
                    title: string;
                };
                copy: {
                    success: {
                        message: string;
                        description: string;
                    };
                };
                export: {
                    success: {
                        message: string;
                        description: string;
                    };
                };
            };

            unifiedProfiles: {
                title: string;
                empty: string;
                columns: {
                    profileId: string;
                    reason: string;
                };
            };

            dangerZone: {
                delete: {
                    header: string;
                    subheader: string;
                    actionTitle: string;
                };
            };

            confirmations: {
                deleteProfile: {
                    header: string;
                    message: string;
                    assertionHint: string;
                    profileIdLabel: string;
                };
            };

            notifications: {

                fetchProfile: {
                    error: {
                        message: string;
                        description: string;
                    };
                };

                deleteProfile: {

                    notAllowed: {
                        message: string;
                        description: string;
                    };

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
        };
    };
}
