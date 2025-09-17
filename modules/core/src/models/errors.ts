/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
 * Comprehensive API Error Response Interface.
 * This interface includes all the error properties found across different API responses
 * in the identity-apps codebase to properly type AxiosError responses.
 */
export interface APIErrorResponseInterface {
    /**
     * Error code.
     * @example "APP-60001", "ORG-60007", "TM-10011"
     */
    code?: string;

    /**
     * Error message.
     * @example "Some error message."
     */
    message?: string;

    /**
     * Error description.
     * @example "Some error description."
     */
    description?: string;

    /**
     * Error description alias (used in some APIs).
     * @example "Some error description."
     */
    detail?: string;

    /**
     * Error trace id.
     * @example "e0fbcfeb-3617-43c4-8dd0-7b7d38e13047"
     */
    traceId?: string;

    /**
     * HTTP status code as string (for some error responses).
     * @example "500", "400"
     */
    status?: string;

    /**
     * SCIM error type (for user management related errors).
     * @example "USER_LIMIT_REACHED"
     */
    scimType?: string;

    /**
     * Operation ID (for async operations like branding generation).
     * @example "op-123456"
     */
    operation_id?: string;
}
