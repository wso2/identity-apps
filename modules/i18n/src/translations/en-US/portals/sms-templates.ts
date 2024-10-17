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

import { SMSTemplatesNS } from "../../../models";

export const smsTemplates: SMSTemplatesNS = {
    dangerZone: {
        remove: {
            action: "Remove Template",
            heading: "Remove Template",
            message: "This action will remove the selected template and you " +
                "will lose any changes you've done to this template."
        },
        revert: {
            action: "Revert",
            heading: "Revert to default",
            message: "This action will revert the selected template to " +
                "default and you will lose any changes you've done to this template."
        }
    },
    form: {
        inputs: {
            body: {
                charLengthWarning: "Consult with your SMS service provider for the maximum character limit.",
                hint: "You can utilize placeholder variables within the SMS body.",
                label: "SMS Body",
                placeholder: "Enter the SMS content"
            },
            locale: {
                label: "Locale",
                placeholder: "Select Locale"
            },
            template: {
                hint: "Select the SMS template",
                label: "SMS Template",
                placeholder: "Select the SMS template"
            }
        }
    },
    notifications: {
        deleteSmsTemplate: {
            error: {
                description: "Error while deleting SMS template. Please try again",
                message: "Error while deleting the SMS template"
            },
            success: {
                description: "SMS template deleted successfully",
                message: "SMS template deleted successfully"
            }
        },
        getSmsTemplate: {
            error: {
                description: "An error occurred while retrieving the SMS template.",
                message: "Error retrieving SMS template."
            }
        },
        getSmsTemplateList: {
            error: {
                description: "An error occurred while retrieving the SMS templates.",
                message: "An error occurred while retrieving the SMS templates"
            }
        },
        updateSmsTemplate: {
            error: {
                description: "Error while updating SMS template. " +
                    "Make sure you have filled all the required fields and try again",
                message: "Error while updating SMS template"
            },
            success: {
                description: "SMS template updated successfully",
                message: "SMS template updated successfully"
            }
        }
    },
    page: {
        description: "Customize sms templates used in your organization.",
        header: "SMS Templates"
    },
    tabs: {
        content: {
            label: "Content"
        },
        preview: {
            label: "Preview"
        }
    }
};
