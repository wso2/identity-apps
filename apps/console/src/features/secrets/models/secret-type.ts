/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * This model should return with a 201 when you create a secret type via
 * the API. Please refer the sample JSON object.
 *
 * {
 *  "name": "secretTypeName",
 *  "id": ""d6a29bb8-8bbd-40a1-acf4-611d7487cef4",
 *  "description": "This is a sample secret type's description"
 * }
 */
export interface SecretTypeModel {
    id: string;
    name: string;
    description: string;
}

// Request DTOs

export type CreateSecretTypeRequestModel = {
    body: {
        name: string;
        description: string;
    }
};

export type UpdateSecretTypeRequestModel = {
    body: {
        description: string;
    },
    params: {
        secretType: string;
    }
};

export type GetSecretTypeRequestModel = {
    params: {
        secretType: string;
    }
};

export type DeleteSecretTypeRequestModel = {
    params: {
        secretType: string;
    }
};

// Response DTOs

export type CreateSecretTypeResponseModel = SecretTypeModel;
export type GetSecretTypeResponseModel = SecretTypeModel;
export type UpdateSecretTypeResponseModel = SecretTypeModel;
