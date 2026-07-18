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

import { NotificationItem } from "../common";

export interface functionLibrariesNS {
    page: {
        title: string;
        description: string;
        backButton: string;
        primaryAction: string;
    };
    editPage: {
        description: string;
        backButton: string;
    };
    notFound: {
        title: string;
        subtitle: string;
    };
    list: {
        columns: {
            name: string;
            actions: string;
        };
        emptyPlaceholder: {
            title: string;
            subtitle: string;
            action: string;
        };
    };
    forms: {
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
        };
        content: {
            hint: string;
            uploadButton: string;
            validations: {
                empty: string;
            };
        };
    };
    wizards: {
        add: {
            heading: string;
            subHeading: string;
        };
    };
    modals: {
        deleteConfirmation: {
            assertionHint: string;
            heading: string;
            message: string;
            content: string;
        };
    };
    dangerZone: {
        header: string;
        delete: {
            actionTitle: string;
            heading: string;
            subHeading: string;
        };
    };
    notifications: {
        fetchList: {
            genericError: NotificationItem;
        };
        fetch: {
            genericError: NotificationItem;
        };
        create: {
            success: NotificationItem;
            genericError: NotificationItem;
        };
        update: {
            success: NotificationItem;
            genericError: NotificationItem;
        };
        delete: {
            success: NotificationItem;
            genericError: NotificationItem;
        };
    };
}
