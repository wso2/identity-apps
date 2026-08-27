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

/**
 * FAPI profile types as defined by the server API.
 */
export type FapiProfile = "FAPI1_ADVANCED" | "FAPI2_SECURITY";

/**
 * API response interface for GET /api/server/v1/configs/fapi
 */
export interface FapiConfigAPIResponseInterface {
    enabled: boolean;
    supportedProfiles: FapiProfile[];
}

/**
 * Request body interface for PUT /api/server/v1/configs/fapi
 */
export interface FapiConfigPutRequestInterface {
    enabled: boolean;
    supportedProfiles: FapiProfile[];
}

/**
 * API response interface for GET /api/server/v1/configs/dcr
 */
export interface DcrConfigAPIResponseInterface {
    enableFapiEnforcement: boolean;
    fapiProfile: FapiProfile;
    mandateSSA: boolean;
    authenticationRequired: boolean;
    ssaJwks: string;
}

/**
 * A single JSON Patch operation (RFC 6902) for PATCH /api/server/v1/configs/dcr
 */
export interface DcrPatchOperationInterface {
    operation: "ADD" | "REMOVE" | "REPLACE";
    path: string;
    value?: unknown;
}
