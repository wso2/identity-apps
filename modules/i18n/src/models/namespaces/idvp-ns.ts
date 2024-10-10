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

import { Notification } from "../common";

export interface IdvpNS {
    create: {
        notifications: {
            create: Notification;
        };
    };
    edit: {
        backButton: string;
        dangerZone: {
            delete: {
                description: string;
                header: string;
            };
            disable: {
                disabledDescription: string;
                enabledDescription: string;
                header: string;
            };
        };
        attributeSettings: {
            addButton: string;
            heading: string;
            hint: string;
            modal: {
                emptyPlaceholder:{
                    description: string;
                    title: string;
                };
                header: string;
                labels: {
                    localClaim: string;
                    mappedValue: string;
                };
                placeholders: {
                    localClaim: string;
                    mappedValue: string;
                };
                addButton: string;
                validation: {
                    duplicate: string;
                    invalid: string;
                    required: string;
                };
            };
        };
        notifications: {
            update: Notification;
        };
        status: {
            disabled: string;
            enabled: string;
            notConfigured: {
                heading: string;
                description: string;
            };
        };
    };
    delete: {
        notifications: {
            delete: Notification;
        };
        confirmation: {
            assertionHint: string;
            content: string;
            header: string;
            message: string;
        };
    };
    fetch: {
        notifications: {
            idVP: Notification;
            metadata: Notification;
        };
    };
};
