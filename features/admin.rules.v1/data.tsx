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

/* eslint-disable sort-keys */

export const sampleRules: RuleInterface[] = [ {
    "id": "e9a500d4-12dd-4b87-ad7c-9efdacf8a2a5",
    "execution": "totp",
    "conditions": [
        {
            "id": "c90293c7-3fc1-465e-a946-adab6170e2fcdc",
            "condition": "AND",
            "order": 0,
            "expressions": [
                {
                    "id": "8cbe103e-4c86-4021-91e4-83c37effe893a9267753",
                    "field": "application",
                    "operator": "equals",
                    "value": "c90293c7-3fc1-465e-a946",
                    "order": 0
                }
            ]
        },
        {
            "id": "c90293c7-3fc1-465e-a946-adab6170e2dc443",
            "condition": "AND",
            "order": 0,
            "expressions": [
                {
                    "id": "8cbe103e-4c86-4021-91e4-83dsfc37fe89ee3a9",
                    "field": "grantType",
                    "operator": "equals",
                    "value": "authorization_code",
                    "order": 0
                }
            ]
        },
        {
            "id": "c90293c7-3fc1-465e-a946-adab6170e2dc",
            "condition": "OR",
            "order": 0,
            "expressions": [
                {
                    "id": "8cbe103e-4c86-4021-91e4-83cdsf37fe893a9",
                    "field": "grantType",
                    "operator": "notEquals",
                    "value": "client_credentials",
                    "order": 0
                }
            ]
        },
        {
            "id": "c90293c7-3fc1-465e-a946-adab61e3270e2dc",
            "condition": "OR",
            "order": 0,
            "expressions": [
                {
                    "id": "8cbe103e-4c86-4021-91e4-83c3fdsff437fe893a9",
                    "field": "application",
                    "operator": "equals",
                    "value": "8cbe103e-4c86-4021",
                    "order": 0
                }
            ]
        }
    ]
} ];

export const sampleApplicationList: any = {
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

export const sampleExecutionsList: any = [
    {
        "displayName": "TOTP",
        "value": "totp"
    },
    {
        "displayName": "Basic",
        "value": "basic"
    },
    {
        "displayName": "Account Link",
        "value": "account-link"
    }
];

export const sampleExpressionsMeta: RuleComponentMetaDataInterface = [
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
