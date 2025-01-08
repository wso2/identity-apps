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

export const sampleApplicationList: any = {
    applications: [
        {
            access: "READ",
            accessUrl: "https://localhost:9443/console",
            applicationVersion: "v2.0.0",
            description: "This is the console application.",
            id: "e028224b-51d1-4b26-a0f0-6e41f45472aa",
            name: "Console",
            self: "/api/server/v1/applications/e028224b-51d1-4b26-a0f0-6e41f45472aa"
        },
        {
            access: "WRITE",
            accessUrl: "https://localhost:9443/myaccount",
            applicationVersion: "v2.0.0",
            description: "This is the my account application.",
            id: "dc2bf156-008e-4cd2-afb1-e31825277429",
            name: "My Account",
            self: "/api/server/v1/applications/dc2bf156-008e-4cd2-afb1-e31825277429"
        }
    ],
    count: 2,
    links: [],
    startIndex: 1,
    totalResults: 2
};

// TODO: Replace this with the actual data from the API.
export const sampleExecutionsList: any = [
    {
        displayName: "Prompt TOTP Page",
        value: "dc2bf156-008e-4cdws2-afb1"
    },
    {
        displayName: "Rule Conditions 3",
        value: "dc2bf156-008e-4cd2-afb1sa"
    }
];

export const sampleExpressionsMeta: RuleComponentMetaDataInterface = [
    {
        field: {
            displayName: "application",
            name: "application"
        },
        operators: [
            {
                displayName: "= Equals",
                name: "equals"
            },
            {
                displayName: "!= Not equals",
                name: "notEquals"
            }
        ],
        value: {
            inputType: "options",
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
            displayName: "grant type",
            name: "grantType"
        },
        operators: [
            {
                displayName: "= Equals",
                name: "equals"
            },
            {
                displayName: "!= Not equals",
                name: "notEquals"
            }
        ],
        value: {
            inputType: "options",
            valueType: "string",
            values: [
                {
                    displayName: "authorization code",
                    name: "authorization_code"
                },
                {
                    displayName: "password",
                    name: "password"
                },
                {
                    displayName: "refresh token",
                    name: "refresh_token"
                },
                {
                    displayName: "client credentials",
                    name: "client_credentials"
                },
                {
                    displayName: "token exchange",
                    name: "urn:ietf:params:oauth:grant-type:token-exchange"
                }
            ]
        }
    }
];
