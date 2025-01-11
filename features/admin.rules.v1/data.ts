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

import { ConditionExpressionsMetaDataInterface, RuleExecutionMetaDataInterface } from "./models/meta";
import { RuleExecuteCollectionInterface, RuleInterface } from "./models/rules";

export const sampleRuleExecuteInstance: RuleInterface = {
    condition: "OR",
    execution: "totp",
    id: "e9a500d4-12dd-4b87-ad7c-9efdacf8a2a5",
    rules: [
        {
            condition: "AND",
            expressions: [
                {
                    field: "groups",
                    id: "2cf9e8cc-1f28-4ae5-ac18-06a5c144db6b",
                    operator: "equal",
                    order: 1,
                    value: "employee"
                },
                {
                    field: "roles",
                    id: "8cbe103e-4c86-4021-91e4-83c37fe893a9",
                    operator: "equal",
                    order: 2,
                    value: "staff"
                }
            ],
            id: "c90293c7-3fc1-465e-a946-adab6170e2dc",
            order: 1
        },
        {
            condition: "AND",
            expressions: [
                {
                    field: "groups",
                    id: "2f20d40f-f1a8-4ffc-bd88-6040592495fc",
                    operator: "equal",
                    order: 1,
                    value: "guest"
                }
            ],
            id: "b21cbf6c-985f-47fc-ba88-dfbbed7a38d0",
            order: 2
        }
    ]
};

export const sampleRuleExecuteInstances: RuleExecuteCollectionInterface = {
    fallbackExecution: "end",
    rules: [
        sampleRuleExecuteInstance,
        {
            condition: "OR",
            execution: "email_otp",
            id: "e9a500d4-12dd-4b87-ad7cfr-9efdsdacf8a2a6",
            rules: [
                {
                    condition: "AND",
                    expressions: [
                        {
                            field: "groups",
                            id: "2cf9e8cc-1f28-4ae5-ac18-06a5dfc144db6b",
                            operator: "equal",
                            order: 1,
                            value: "employee"
                        }
                    ],
                    id: "c90293c7-3fc1-465e-a946-adab6170fge2dc",
                    order: 1
                }
            ]
        }
    ]
};

export const sampleApplicationList = {
    "totalResults": 2,
    "startIndex": 1,
    "count": 2,
    "applications": [
        {
            "id": "e028224b-51d1-4b26-a0f0-6e41f45472aa",
            "name": "Console",
            "description": "This is the console application.",
            "applicationVersion": "v2.0.0",
            "accessUrl": "https://localhost:9443/console",
            "access": "READ",
            "self": "/api/server/v1/applications/e028224b-51d1-4b26-a0f0-6e41f45472aa"
        },
        {
            "id": "dc2bf156-008e-4cd2-afb1-e31825277429",
            "name": "My Account",
            "description": "This is the my account application.",
            "applicationVersion": "v2.0.0",
            "accessUrl": "https://localhost:9443/myaccount",
            "access": "WRITE",
            "self": "/api/server/v1/applications/dc2bf156-008e-4cd2-afb1-e31825277429"
        }
    ],
    count: 2,
    links: [],
    startIndex: 1,
    totalResults: 2
};

export const sampleRuleExecutionMeta: RuleExecutionMetaDataInterface = {
    executions: [
        {
            displayName: "TOTP",
            name: "totp"
        },
        {
            displayName: "Email OTP",
            name: "email_otp"
        }
    ],
    fallbackExecutions: [
        {
            displayName: "Error",
            name: "error"
        },
        {
            displayName: "End",
            name: "end"
        }
    ]
};

export const sampleExpressionsMeta: ConditionExpressionsMetaDataInterface = [
    {
        field: {
            name: "application",
            displayName: "application"
        },
        operators: [
            {
                displayName: "equal",
                name: "equal"
            },
            {
                displayName: "not equal",
                name: "notEqual"
            }
        ],
        value: {
            inputType: "options",
            valueType: "reference",
            valueReferenceAttribute: "id",
            valueDisplayAttribute: "name",
            links: [
                {
                    href: "/applications?offset=0&limit=10",
                    method: "GET",
                    rel: "values"
                },
                {
                    href: "/applications?filter=name+eq+*&limit=10",
                    method: "GET",
                    rel: "filter"
                }
            ],
            valueDisplayAttribute: "name",
            valueReferenceAttribute: "id",
            valueType: "reference"
        }
    },
    {
        field: {
            displayName: "groups",
            name: "groups"
        },
        operators: [
            {
                displayName: "equal",
                name: "equal"
            },
            {
                displayName: "not equal",
                name: "notEqual"
            }
        ],
        value: {
            inputType: "options",
            valueType: "string",
            values: [
                {
                    displayName: "employee",
                    name: "employee"
                },
                {
                    displayName: "guest",
                    name: "guest"
                }
            ]
        }
    },
    {
        field: {
            displayName: "roles",
            name: "roles"
        },
        operators: [
            {
                displayName: "equal",
                name: "equal"
            },
            {
                displayName: "not equal",
                name: "notEqual"
            }
        ],
        value: {
            inputType: "options",
            valueType: "string",
            values: [
                {
                    displayName: "staff",
                    name: "staff"
                },
                {
                    displayName: "admin",
                    name: "admin"
                }
            ]
        }
    },
    {
        field: {
            name: "grantType",
            displayName: "grant type"
        },
        operators: [
            {
                displayName: "equal",
                name: "equal"
            },
            {
                displayName: "not equal",
                name: "notEqual"
            }
        ],
        value: {
            inputType: "options",
            valueType: "string",
            values: [
                {
                    name: "authorization_code",
                    displayName: "authorization code"
                },
                {
                    name: "password",
                    displayName: "password"
                },
                {
                    name: "refresh_token",
                    displayName: "refresh token"
                },
                {
                    name: "client_credentials",
                    displayName: "client credentials"
                },
                {
                    name: "urn:ietf:params:oauth:grant-type:token-exchange",
                    displayName: "token exchange"
                }
            ]
        }
    }
];

export const dummyMeta = {
    checkValues : [
        {
            "displayName": "User Role",
            "value": "userRole"
        },
        {
            "displayName": "Application",
            "value": "application"
        },
        {
            "displayName": "Grant Type",
            "value": "grantType"
        }
    ],
    operators : [
        {
            "displayName": "= Equals",
            "value": "equals"
        },
        {
            "displayName": "!= Not equals",
            "value": "notEquals"
        },
    ]
}
