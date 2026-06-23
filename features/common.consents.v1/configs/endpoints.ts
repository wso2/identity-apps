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

import { ConsentMgtResourceEndpointsInterface } from "../models/endpoints";

/**
 * Get the resource endpoints for the Consent Management feature.
 *
 * @param serverHost - Server host.
 * @returns The resource endpoints for the Consent Management feature.
 */
export const getConsentMgtResourceEndpoints = (serverHost: string): ConsentMgtResourceEndpointsInterface => {
    const normalizedHost: string = serverHost?.replace(/\/+$/, "") ?? "";

    // config-mgt does not support the sub-org path (/o or /o/<uuid>).
    // Strip it so requests always go to the tenant-level endpoint.
    const tenantHost: string = normalizedHost.replace(/\/o(\/.*)?$/, "");

    return {
        consentMgtElements: `${ normalizedHost }/api/identity/consent-mgt/v2.0/elements`,
        consentMgtPurposes: `${ normalizedHost }/api/identity/consent-mgt/v2.0/purposes`,
        consentPolicyApps: `${ tenantHost }/api/server/v1/configs/consent/purposes`
    };
};
