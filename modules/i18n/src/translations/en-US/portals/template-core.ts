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
import { templateCoreNS } from "../../../models";

export const templateCore: templateCoreNS = {
    categories: {
        other: {
            description: "Other types of un-categorized integrations.",
            displayName: "Others"
        }
    },
    forms: {
        resourceCreateWizard: {
            common: {
                validations: {
                    required: "This is a required field."
                }
            },
            url: {
                validations: {
                    invalid: "Invalid URL. Please enter a valid URL."
                }
            }
        }
    },
    notifications: {
        fetchTemplates: {
            error: {
                description: "{{description}}",
                message: "Retrieval error"
            },
            genericError: {
                description: "Couldn't retrieve {{type}} templates.",
                message: "Something went wrong"
            },
            success: {
                description: "Successfully retrieved the {{type}} templates.",
                message: "Retrieval successful"
            }
        }
    }
};
