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
export interface smsProvidersNS {
    heading: string;
    subHeading: string;
    description: string;
    info: string;
    updateButton: string;
    sendTestSMSButton: string;
    goBack: string;
    confirmationModal: {
        header: string;
        message: string;
        content: string;
        assertionHint: string;
    };
    dangerZoneGroup: {
        header: string;
        revertConfig: {
            heading: string;
            subHeading: string;
            actionTitle: string;
        };
    };
    form: {
        twilio: {
            subHeading: string;
            accountSID: {
                label: string;
                placeholder: string;
                hint: string;
            };
            authToken: {
                label: string;
                placeholder: string;
                hint: string;
            };
            sender: {
                label: string;
                placeholder: string;
                hint: string;
            };
            validations: {
                required: string;
            };
        };
        vonage: {
            subHeading: string;
            accountSID: {
                label: string;
                placeholder: string;
                hint: string;
            };
            authToken: {
                label: string;
                placeholder: string;
                hint: string;
            };
            sender: {
                label: string;
                placeholder: string;
                hint: string;
            };
            validations: {
                required: string;
            };
        };
        custom: {
            subHeading: string;
            providerName: {
                label: string;
                placeholder: string;
                hint: string;
            };
            providerUrl: {
                label: string;
                placeholder: string;
                hint: string;
            };
            httpMethod: {
                label: string;
                placeholder: string;
                hint: string;
            };
            contentType: {
                label: string;
                placeholder: string;
                hint: string;
            };
            headers: {
                label: string;
                placeholder: string;
                hint: string;
            };
            payload: {
                label: string;
                placeholder: string;
                hint: string;
            };
            key: {
                label: string;
                placeholder: string;
                hint: string;
            };
            secret: {
                label: string;
                placeholder: string;
                hint: string;
            };
            sender: {
                label: string;
                placeholder: string;
                hint: string;
            };
            validations: {
                required: string;
                methodInvalid: string;
                contentTypeInvalid: string;
            };
        };
    };
    notifications: {
        getConfiguration: {
            error: {
                description: string;
                message: string;
            };
        };
        deleteConfiguration: {
            success: {
                description: string;
                message: string;
            };
            error: {
                description: string;
                message: string;
            };
        };
        updateConfiguration: {
            success: {
                description: string;
                message: string;
            };
            error: {
                description: string;
                message: string;
            };
        };
    };
}
