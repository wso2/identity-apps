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
import { OAuth2ConfigNS } from "../../../models";

export const oauth2Config: OAuth2ConfigNS = {
    description: "Configure OAuth2/OpenID Connect settings for your applications.",
    form: {
        preserveSessionAtPasswordUpdate: {
            hint: "Enable this to preserve the user session when the password is updated.",
            label: "Preserve Session at Password Update"
        },
        validation: {
            preserveSessionAtPasswordUpdate: "Invalid value for preserve session at password update."
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Error occurred while fetching OAuth2 configurations.",
                message: "Error occurred"
            }
        },
        revertConfiguration: {
            error: {
                description: "Error occurred while reverting OAuth2 configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully reverted the OAuth2 configurations.",
                message: "Revert successful"
            }
        },
        updateConfiguration: {
            error: {
                description: "Error occurred while updating OAuth2 configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the OAuth2 configurations.",
                message: "Update successful"
            }
        }
    },
    title: "OAuth2 Configuration"
};
