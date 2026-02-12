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

export const CDM_HOST = "localhost";
export const CDM_PORT = 8900;
export const CDM_BASE_URL = `https://${CDM_HOST}:${CDM_PORT}/t/carbon.super/cds/api/v1`;

/**
 * (Optional) keep CDS-specific error codes in one place later.
 */
export const CDS_ERRORS = {
    FETCH_PROFILES_ERROR: "CDS_PROFILES_FETCH_ERROR",
    FETCH_PROFILE_ERROR: "CDS_PROFILE_FETCH_ERROR",
    DELETE_PROFILE_ERROR: "CDS_PROFILE_DELETE_ERROR",
    INVALID_STATUS_CODE: "CDS_INVALID_STATUS_CODE"
};