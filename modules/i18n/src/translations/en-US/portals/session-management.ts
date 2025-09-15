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
import { SessionManagementNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const sessionManagement: SessionManagementNS = {
    description: "Manage settings related to the session of your users.",
    title: "Session Management",
    form: {
        idleSessionTimeout: {
            hint: "The user will be logged out automatically after the configured time.",
            label: "Idle Session Timeout",
            placeholder: "Enter the idle session timeout in minutes"
        },
        rememberMePeriod: {
            hint: "The user will be prompted to login again after the configured time.",
            label: "Remember Me Period",
            placeholder: "Enter the remember me period in minutes"
        },
        validation: {
            idleSessionTimeout: "Idle Session Timeout should be a positive integer.",
            rememberMePeriod: "Remember Me Period should be a positive integer."
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Error occurred while fetching session management settings.",
                message: "Error occurred"
            }
        },
        revertConfiguration: {
            error: {
                message: "Error occurred",
                description: "Error occurred while reverting session management settings."
            },
            success: {
                message: "Revert successful",
                description: "Successfully reverted the session management settings."
            }
        },
        updateConfiguration: {
            error: {
                description: "Error occurred while updating session management settings.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the session management settings.",
                message: "Update successful"
            }
        }
    }
};
