/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import { pushProvidersNS } from "../../../models";

export const pushProviders: pushProvidersNS = {
    alerts: {
        create: {
            error: {
                description: "Error occurred while updating push provider configurations.",
                message: "Something went wrong"
            },
            success: {
                description: "Push provider configurations updated successfully.",
                message: "Updated successfully."
            }
        },
        delete: {
            error: {
                description: "Error occurred while deleting push provider configurations",
                message: "Something went wrong"
            },
            success: {
                description: "Push provider configurations deleted succesfully",
                message: "Deleted successfully"
            }
        },
        updateDefault: {
            error: {
                description: "Error occurred while updating default push sender configuration.",
                message: "Something went wrong"
            },
            success: {
                description: "Default push sender configuration updated successfully.",
                message: "Updated successfully."
            }
        }
    },
    dangerZoneGroup: {
        header: "Danger Zone",
        revertConfig: {
            actionTitle: "Delete",
            heading: "Delete Configurations",
            subHeading: "This action will delete push provider configurations. " +
                "Once deleted, users will not receive any push notifications."
        }
    },
    description: "Configure the push notification provider credentials to enable sending push notifications.",
    goBack: "Go back to Notification Providers",
    heading: "Push Provider",
    modals: {
        deleteConfirmation: {
            assertionHint: "Please confirm your action",
            content: "If you delete the push provider, users will no longer receive push notifications from applications set up with push authentication. Proceed with caution.",
            heading: "Are you sure?",
            message: "This action is irreversible and will permanently delete the current push provider configuration."
        }
    },
    pushProviderSettings: {
        defaultSender: "Set as Default Push Sender",
        defaultSenderDescription: "Select this provider as the default push notification sender."
    },
    subHeading: "Configure a push provider to send push notifications to your users.",
    updateButton: "Update"
};
