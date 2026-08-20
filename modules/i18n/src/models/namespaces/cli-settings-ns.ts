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

export interface CliSettingsNS {
    enablement: {
        description: string;
        disableConfirmation: {
            content: string;
            heading: string;
            message: string;
        };
        notifications: {
            disabled: {
                description: string;
                message: string;
            };
            enabled: {
                description: string;
                message: string;
            };
            genericError: {
                disableDescription: string;
                enableDescription: string;
                message: string;
            };
        };
        status: {
            disabled: string;
            enabled: string;
        };
        title: string;
        toggleAriaLabel: string;
    };
    notConfigured: {
        subtitle: string;
        title: string;
    };
    page: {
        description: string;
        title: string;
    };
    tabs: {
        users: string;
    };
    users: {
        heading: string;
        list: {
            emptyPlaceholder: {
                action: string;
                subtitles: string;
                title: string;
            };
        };
        notifications: {
            pendingApproval: {
                description: string;
                message: string;
            };
            success: {
                description: string;
                message: string;
            };
        };
        roleNotFound: {
            description: string;
            subtitle: string;
            title: string;
        };
        subHeading: string;
    };
}
