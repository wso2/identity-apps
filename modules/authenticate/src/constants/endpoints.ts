/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

type ServiceEndpointURLType = string;

interface ServiceResourcesType {
    jwks: string;
    token: string;
}

export const SERVICE_ENDPOINT: ServiceEndpointURLType = "https://localhost:9443";
export const SERVICE_RESOURCES: ServiceResourcesType = {
    jwks: `${SERVICE_ENDPOINT}/oauth2/jwks`,
    token: `${SERVICE_ENDPOINT}/oauth2/token`
};

export const AUTHORIZATION_ENDPOINT = "authorization_endpoint";
export const TOKEN_ENDPOINT = "token_endpoint";
export const REVOKE_TOKEN_ENDPOINT = "revoke_token_endpoint";
export const END_SESSION_ENDPOINT = "end_session_endpoint";
export const JWKS_ENDPOINT = "jwks_uri";
export const OP_CONFIG_INITIATED = "op_config_initiated";
