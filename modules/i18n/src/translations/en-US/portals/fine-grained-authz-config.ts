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

import { FineGrainedAuthzConfigNS } from "../../../models/namespaces/fine-grained-authz-config-ns";

export const fineGrainedAuthzConfig: FineGrainedAuthzConfigNS = {
    description: "Configure fine-grained authorization settings for organization.",
    form: {
        enableFineGrainedAuthz: {
            hint: "If enabled, access to specific operations will be validated using fine-grained scopes in addition to the general endpoint-level scopes.",
            label: "Enable Fine-Grained Authorization"
        }
    },
    notifications: {
        getConfiguration: {
            error: {
                description: "Error occurred while fetching fine-grained authorization configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully retrieved the fine-grained authorization configurations.",
                message: "Retrieved successful"
            }
        },
        updateConfiguration: {
            error: {
                description: "Error occurred while updating fine-grained authorization configurations.",
                message: "Error occurred"
            },
            success: {
                description: "Successfully updated the fine-grained authorization configurations.",
                message: "Update successful"
            }
        }
    },
    title: "Fine-Grained Authorization Configuration"
};
