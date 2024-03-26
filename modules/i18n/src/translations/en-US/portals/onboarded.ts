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
import { onboardedNS } from "../../../models";

export const onboarded: onboardedNS = {
    confirmationModal: {
        removeUser: {
            assertionHint: "Please confirm your action.",
            content: "If you remove this user, the user will not be able to access the console " +
                "within your organization. Please proceed with caution.",
            header: "Are you sure?",
            message: "This action is irreversible and will remove the user from your organization."
        }
    },
    notifications: {
        removeUser: {
            error: {
                description: "{{description}}",
                message: "Error while removing the user"
            },
            genericError: {
                description: "Couldn't remove the user from the {{tenant}} organization",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully removed the user from the {{tenant}} organization",
                message: "User removed successfully"
            }
        }
    }
};
