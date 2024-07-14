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
import { applicationTemplatesNS } from "../../../models";

export const applicationTemplates: applicationTemplatesNS = {
    categories: {
        default: {
            description: "Integrate applications based on technology and platform.",
            displayName: "Application Types"
        },
        ssoIntegration: {
            description: "Configure single sign-on seamlessly across SaaS services such as"
                + " Google Workspace, Salesforce, and more.",
            displayName: "SSO Integrations"
        }
    },
    notifications: {
        fetchTemplate: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while retrieving application template data.",
                message: "Something went wrong"
            }
        },
        fetchTemplateMetadata: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "An error occurred while retrieving application template meta data.",
                message: "Something went wrong"
            }
        }
    },
    placeholders: {
        emptyApplicationTypeList: {
            subtitles: {
                0: "There are currently no application types available.",
                1: "for configuration."
            },
            title: "No application types found"
        }
    }
};
