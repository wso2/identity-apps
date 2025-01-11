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

import { RuleComponentMetaDataInterface, RuleInterface } from "./models/rules";

export const sampleRules: RuleInterface[] = [
    {
        conditions: [
            {
                condition: "AND",
                expressions: [
                    {
                        field: "application",
                        id: "8cbe103e-4c86-4021-91e4-83c37effe893a9267753",
                        operator: "equals",
                        order: 0,
                        value: "c90293c7-3fc1-465e-a946"
                    }
                ],
                id: "c90293c7-3fc1-465e-a946-adab6170e2fcdc",
                order: 0
            },
            {
                condition: "AND",
                expressions: [
                    {
                        field: "grantType",
                        id: "8cbe103e-4c86-4021-91e4-83dsfc37fe89ee3a9",
                        operator: "equals",
                        order: 0,
                        value: "authorization_code"
                    }
                ],
                id: "c90293c7-3fc1-465e-a946-adab6170e2dc443",
                order: 0
            },
            {
                condition: "OR",
                expressions: [
                    {
                        field: "grantType",
                        id: "8cbe103e-4c86-4021-91e4-83cdsf37fe893a9",
                        operator: "notEquals",
                        order: 0,
                        value: "client_credentials"
                    }
                ],
                id: "c90293c7-3fc1-465e-a946-adab6170e2dc",
                order: 0
            },
            {
                condition: "OR",
                expressions: [
                    {
                        field: "application",
                        id: "8cbe103e-4c86-4021-91e4-83c3fdsff437fe893a9",
                        operator: "equals",
                        order: 0,
                        value: "8cbe103e-4c86-4021"
                    }
                ],
                id: "c90293c7-3fc1-465e-a946-adab61e3270e2dc",
                order: 0
            }
        ],
        execution: "totp",
        id: "e9a500d4-12dd-4b87-ad7c-9efdacf8a2a5"
    }
];

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
    "links": []
};

export const sampleExecutionsList = [
    {
        displayName: "Show TOTP",
        value: "dc2bf156-008e-4cdws2-afb1"
    },
    {
        displayName: "Rule",
        value: "dc2bf156-008e-4cd2-afb1sa"
    }
];

export const sampleExpressionsMeta = [
    {
        field: {
            name: "application",
            displayName: "application"
        },
        operators: [
            {
                name: "equals",
                displayName: "= Equals"
            },
            {
                name: "notEquals",
                displayName: "!= Not equals"
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
                name: "equals",
                displayName: "= Equals"
            },
            {
                name: "notEquals",
                displayName: "!= Not equals"
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
