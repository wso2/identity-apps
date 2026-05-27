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

export interface inFlowExtensionNS {
    notifications: {
        createSuccess: {
            description: string;
            message: string;
        };
        createError: {
            message: string;
        };
        createGenericError: {
            description: string;
            message: string;
        };
        updateAccessConfigSuccess: {
            description: string;
            message: string;
        };
        updateAccessConfigError: {
            description: string;
            message: string;
        };
    };
    accessConfigOverrideDialog: {
        title: string;
        description: string;
        contextTreeError: string;
        noCertificateWarning: string;
        actions: {
            reset: string;
            cancel: string;
            save: string;
            saving: string;
        };
        resetDialog: {
            title: string;
            warningMessage: string;
            description: string;
            options: {
                clearAll: {
                    label: string;
                    description: string;
                };
                resetToDefault: {
                    label: string;
                    description: string;
                };
            };
        };
    };
    properties: {
        description: string;
        connectionLabel: string;
        connectionPlaceholder: string;
        editAccessConfig: string;
        noConnectionsWarning: string;
        noConnectionsWarningLink: string;
        noConnectionsWarningSuffix: string;
        noConnectionsSupportWarning: string;
        noConnectionsSupportWarningLink: string;
        noConnectionsSupportWarningSuffix: string;
        navConfirmDialog: {
            title: string;
            description: string;
            actions: {
                cancel: string;
                continue: string;
            };
        };
    };
}
