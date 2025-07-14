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
export interface SessionManagementNS {
    title: string;
    description: string;
    form: {
        idleSessionTimeout: {
            hint: string;
            label: string;
            placeholder: string;
        };
        rememberMePeriod: {
            hint: string;
            label: string;
            placeholder: string;
        };
        validation: {
            rememberMePeriod: string;
            idleSessionTimeout: string;
        };
    };
    notifications: {
        revertConfiguration: {
            error: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        updateConfiguration: {
            error: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getConfiguration: {
            error: {
                message: string;
                description: string;
            };
        };
    };
}
