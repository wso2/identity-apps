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

export interface SMSTemplatesNS {
    page: {
        header: string;
        description: string;
    };
    tabs: {
        content: {
            label: string;
        };
        preview: {
            label: string;
        }
    };
    notifications: {
        getSmsTemplateList: {
            error: {
                description: string;
                message: string;
            }
        };
        getSmsTemplate: {
            error: {
                description: string;
                message: string;
            }
        };
        updateSmsTemplate: {
            success: {
                description: string;
                message: string;
            };
            error: {
                description: string;
                message: string;
            }
        };
        deleteSmsTemplate: {
            success: {
                description: string;
                message: string;
            };
            error: {
                description: string;
                message: string;
            }
        }
    };
    form: {
        inputs: {
            template: {
                label: string;
                placeholder: string;
                hint: string;
            };
            locale: {
                label: string;
                placeholder: string;
            };
            body: {
                label: string;
                hint: string;
                charLengthWarning: string;
                placeholder: string;
            }
        }
    };
    dangerZone: {
        remove : {
            heading: string;
            message: string;
            action: string;
        };
        revert : {
            heading: string;
            message: string;
            action: string;
        }
    }
}
