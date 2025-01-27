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

import { pushProvidersNS } from "../../../models";

export const pushProviders: pushProvidersNS = {
    alerts: {
        create: {
            error: {
                description: "Error occurred while updating push notification provider configurations.",
                message: "Something went wrong"
            },
            success: {
                description: "Push notification provider configurations updated successfully.",
                message: "Updated successfully."
            }
        },
        delete: {
            error: {
                description: "Error occurred while deleting push notification provider configurations",
                message: "Something went wrong"
            },
            success: {
                description: "Push notification provider configurations deleted succesfully",
                message: "Deleted successfully"
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
    description: "Configure the push provider settings according to your push provider.",
    goBack: "Go back to Notification Providers",
    heading: "Push Provider",
    modals: {
        deleteConfirmation: {
            assertionHint: "Please confirm your action",
            content: "If you delete the push notification provider configurations, users will no longer receive push notifications for applications set up with push authentication. Please proceed with caution.",
            heading: "Are you sure?",
            message: "This action is irreversible and will permanently delete the current push notification provider configuration."
        }
    },
    subHeading: "Configure a push provider to send push notifications to your users.",
    updateButton: "Update"
};
