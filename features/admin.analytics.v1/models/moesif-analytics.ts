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
 * Interface for the Moesif publisher response from IS API.
 */
export interface MoesifPublisherInterface {
    /**
     * Publisher name.
     */
    name?: string;
    /**
     * Map of event publisher key to enabled flag
     * (e.g. "moesif-authentication-publisher": true, "moesif-registration-publisher": false).
     */
    eventPublisherEnablement?: Record<string, boolean>;
}

/**
 * Request body for POST /moesif-publishers — creates a new Moesif publisher config.
 */
export interface MoesifPublisherCreateRequest {
    /**
     * Moesif collector API key value.
     */
    apiKeyValue: string;
    /**
     * Map of event publisher key to enabled flag (replace-all semantics).
     * Known keys: "moesif-authentication-publisher", "moesif-registration-publisher",
     *             "moesif-flow-publisher", "moesif-org-switch-publisher",
     *             "moesif-token-issuance-publisher", "moesif-session-publisher".
     */
    eventPublisherEnablement?: Record<string, boolean>;
}

/**
 * Request body for PATCH /moesif-publishers — partial update of publisher governance configs.
 * Omitted fields are left unchanged on the server.
 */
export interface MoesifPublisherUpdateRequest {
    /**
     * Moesif collector API key value. Optional — omit to leave the existing key unchanged.
     */
    apiKeyValue?: string;
    /**
     * Map of event publisher key to enabled flag. Keys absent from the map default to false
     * on the server.
     */
    eventPublisherEnablement?: Record<string, boolean>;
}

/**
 * Response from the Moesif dashboard-info API (`GET /tenant/moesif/dashboard-info`).
 * Contains all data required to embed the Moesif Canvas dashboard.
 */
export interface MoesifDashboardInfoInterface {
    /**
     * Short-lived Moesif Portal OAuth id_token for embedded dashboard authentication.
     */
    token: string;
    /**
     * Moesif organisation ID for the Asgardeo tenant.
     */
    moesifOrgId: string;
    /**
     * Moesif application ID for the Asgardeo tenant.
     */
    moesifAppId: string;
}

/**
 * Known Moesif event publisher keys.
 */
export enum MoesifEventPublisherKey {
    AUTHENTICATION = "moesif-authentication-publisher",
    FLOW = "moesif-flow-publisher",
    ORG_SWITCH = "moesif-org-switch-publisher",
    REGISTRATION = "moesif-registration-publisher",
    SESSION = "moesif-session-publisher",
    TOKEN = "moesif-token-issuance-publisher"
}
