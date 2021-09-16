/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

/**
 * This model should return with a 201 when you create a secret via
 * the API. Please refer the sample JSON object.
 *
 * {
 *    "secretId": "c552ccbd-0501-4f1b-942e-ee77a39fb3b9",
 *    "secretName": "sample-secret",
 *    "created": "2021-09-05T20:14:36.492Z",
 *    "lastModified": "2021-09-05T20:14:36.492Z",
 *    "type": "ADAPTIVE_AUTH_CALL_CHOREO",
 *    "description": "This is a sample secret"
 * }
 */
export interface SecretModel {
    secretId: string;
    secretName: string;
    created: string;
    lastModified: string;
    type: string;
    description: string;
}

type CommonRequestParams = {
    secretType: string;
    secretName: string;
};

export type CreateSecretRequest = {
    params: { secretType: string; };
    body: {
        name: string;
        value: string;
        description: string;
    }
};

export type GetSecretRequest = {
    params: CommonRequestParams;
};

/**
 * API supports one value patch at a time. So it's either
 * value or description. Simple as below.
 *
 * {
 *  "operation":"REPLACE",
 *  "path":"/description", // or /value
 *  "value": "{value}"
 * }
 *
 * {@see https://github.com/wso2/identity-api-server/pull/310}
 */
export type UpdateSecretRequest = {
    params: CommonRequestParams;
    body: {
        operation: "REPLACE";
        path: "/value" | "/description";
        value: string;
    };
};

export type GetSecretListRequest = {
    params: { secretType: string; };
};

export type DeleteSecretRequest = {
    params: CommonRequestParams;
};

export type CreateSecretResponse = SecretModel;

export type GetSecretResponse = SecretModel;

export type UpdateSecretResponse = SecretModel;

export type GetSecretListResponse = Array<SecretModel>;
