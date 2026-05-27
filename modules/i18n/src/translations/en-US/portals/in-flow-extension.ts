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

import { inFlowExtensionNS } from "../../../models";

export const inFlowExtension: inFlowExtensionNS = {
    accessConfigOverrideDialog: {
        actions: {
            cancel: "Cancel",
            reset: "Reset",
            save: "Save",
            saving: "Saving..."
        },
        contextTreeError: "Failed to load the In-Flow Extension context tree for this flow. " +
            "Refresh and retry; check that the flow-management API is reachable.",
        description: "Configure which data is exposed to and modifiable by the in-flow extension " +
            "for the {{flowType}} flow. This sets the flow-type-specific override for the access configuration.",
        noCertificateWarning: "No certificate configured. Encryption toggles are disabled. " +
            "Add a certificate from the connection settings to enable encryption.",
        resetDialog: {
            description: "If clear all, every annotation done in the UI will be removed, and reset to the " +
                "default will overwrite current state with default configuration from the connections. " +
                "This action will not take effect unless you save the changes.",
            options: {
                clearAll: {
                    description: "Remove all expose and modify paths for this flow type.",
                    label: "Clear All"
                },
                resetToDefault: {
                    description: "Restore the action's default access configuration.",
                    label: "Reset to Default"
                }
            },
            title: "Reset Access Configuration",
            warningMessage: "This action will overwrite the current access configuration for this flow type."
        },
        title: "Configure Access"
    },
    notifications: {
        createError: {
            message: "Create error"
        },
        createGenericError: {
            description: "An error occurred while creating the in-flow extension.",
            message: "Something went wrong"
        },
        createSuccess: {
            description: "Successfully created the in-flow extension.",
            message: "Create successful"
        },
        updateAccessConfigError: {
            description: "An error occurred while updating the access configuration.",
            message: "Update failed"
        },
        updateAccessConfigSuccess: {
            description: "Access configuration updated successfully.",
            message: "Access config updated"
        }
    },
    properties: {
        connectionLabel: "Connection",
        connectionPlaceholder: "Select a connection",
        description: "Select an in-flow extension to link with this flow step.",
        editAccessConfig: "Edit Access Configurations",
        navConfirmDialog: {
            actions: {
                cancel: "Cancel",
                continue: "Continue"
            },
            description: "You will be redirected to the connection setup page to edit the default " +
                "access configuration. Any unsaved changes in the flow builder will be lost.",
            title: "Navigate to Connection Settings?"
        },
        noConnectionsWarning: "No active in-flow extensions available. Please create an",
        noConnectionsWarningLink: " in-flow extension ",
        noConnectionsWarningSuffix: "to link with this flow.",
        noConnectionsSupportWarning: "No active in-flow extensions available. Please contact ",
        noConnectionsSupportWarningLink: "Asgardeo support",
        noConnectionsSupportWarningSuffix: " to enable creating in-flow extensions."
    }
};
