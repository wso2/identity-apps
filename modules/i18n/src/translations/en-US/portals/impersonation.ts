/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { ImpersonationNS } from "../../../models";

export const impersonation: ImpersonationNS = {
    description: "Configure impersonation settings for organization.",
    form: {
        enableEmailNotification: {
            hint: "If enabled, the impersonated user will receive an email notification after impersonation starts.",
            label: "Enable Email Notification"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Error occurred while fetching impersonation configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully retrieved the impersonation configurations.",
                message: "Retrieved successful"
            }
        },
        revertConfiguration: {
            error: {
                description: "Error occurred while reverting impersonation configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully reverted the impersonation configurations.",
                message: "Revert successful"
            }
        },
        updateConfiguration: {
            error: {
                description: "Error occurred while updating impersonation configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the impersonation configurations.",
                message: "Update successful"
            }
        }
    },
    title: "Impersonation"
};
