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
import { WsFederationConfigNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const wsFederationConfig: WsFederationConfigNS = {
    title: "WS-Federation Configuration",
    description: "Configure WS-Federation protocol for your applications.",
    form: {
        enableRequestSigning: {
            label: "Enable Authentication Requests Signing"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Error occurred while fetching WS-Federation configurations.",
                message: "Error occurred"
            }
        },
        revertConfiguration: {
            error: {
                description: "Error occurred while reverting WS-Federation configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully reverted the WS-Federation configurations.",
                message: "Revert successful"
            }
        },
        updateConfiguration: {
            error: {
                description: "Error occurred while updating WS-Federation configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the WS-Federation configurations.",
                message: "Update successful"
            }
        }
    }
};
