/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

export interface FapiSecurityPolicyNS {
    title: string;
    description: string;
    form: {
        fields: {
            enableFapi: {
                label: string;
                hint: string;
            };
        };
        profiles: {
            heading: string;
            description: string;
            options: {
                fapi1Advanced: {
                    label: string;
                    hint: string;
                };
                fapi2Security: {
                    label: string;
                    hint: string;
                };
            };
            validations: {
                atLeastOne: string;
            };
        };
        dcr: {
            heading: string;
            fields: {
                mandate: {
                    label: string;
                    hint: string;
                };
                profile: {
                    label: string;
                };
            };
        };
        buttons: {
            update: {
                ariaLabel: string;
            };
        };
    };
    constraints: {
        grantTypes: {
            hint: string;
        };
        pkce: {
            hint: string;
        };
        pvtKeyJwt: {
            hint: string;
        };
        par: {
            hint: string;
        };
        validateBinding: {
            hint: string;
        };
    };
    notifications: {
        getFapiConfig: {
            error: {
                description: string;
                message: string;
            };
        };
        getDcrConfig: {
            error: {
                description: string;
                message: string;
            };
        };
        updateConfig: {
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
